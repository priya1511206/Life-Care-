import React, { useState, useEffect, useMemo } from 'react';
import {
  Patient,
  Doctor,
  Appointment,
  MedicalRecord,
  ActivePage,
  AppointmentStatus,
  DoctorStatus
} from './types';
import { computeDoctorStatus } from './utils/doctorDuty';
import {
  INITIAL_PATIENTS,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_RECORDS
} from './data/initialData';
import { LoginView } from './components/LoginView';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { PatientsView } from './components/PatientsView';
import { DoctorsView } from './components/DoctorsView';
import { AppointmentsView } from './components/AppointmentsView';
import { PatientRecordsView } from './components/PatientRecordsView';
import { ProjectGuideModal } from './components/ProjectGuideModal';
import { PrintDocumentModal, PrintableDocType } from './components/PrintDocumentModal';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('medicare_admin_session') === 'true';
  });
  const [adminUser, setAdminUser] = useState<string>(() => {
    return localStorage.getItem('medicare_admin_name') || 'Administrator';
  });

  // Navigation State
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals & Drawers State
  const [isRegisterPatientOpen, setIsRegisterPatientOpen] = useState(false);
  const [isBookAppointmentOpen, setIsBookAppointmentOpen] = useState(false);
  const [isProjectGuideOpen, setIsProjectGuideOpen] = useState(false);
  const [printableDoc, setPrintableDoc] = useState<PrintableDocType | null>(null);

  // Preselection helpers for inter-page navigation
  const [preselectedDoctorId, setPreselectedDoctorId] = useState<string | null>(null);
  const [preselectedPatientId, setPreselectedPatientId] = useState<string | null>(null);

  // Domain Data State with LocalStorage Persistence
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('medicare_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('medicare_doctors');
    return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('medicare_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [records, setRecords] = useState<MedicalRecord[]>(() => {
    const saved = localStorage.getItem('medicare_records');
    return saved ? JSON.parse(saved) : INITIAL_RECORDS;
  });

  // Sync to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('medicare_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('medicare_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('medicare_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('medicare_records', JSON.stringify(records));
  }, [records]);

  // Auth Handlers
  const handleLogin = (user: string) => {
    setIsAuthenticated(true);
    setAdminUser(user);
    localStorage.setItem('medicare_admin_session', 'true');
    localStorage.setItem('medicare_admin_name', user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('medicare_admin_session');
    localStorage.removeItem('medicare_admin_name');
  };

  // Patients Actions
  const handleAddPatient = (newPatientData: Omit<Patient, 'id' | 'registeredDate'>) => {
    const nextIdNumber = 1000 + patients.length + 1;
    const newPatient: Patient = {
      ...newPatientData,
      id: `PID-${nextIdNumber}`,
      registeredDate: new Date().toISOString().split('T')[0]
    };
    setPatients((prev) => [newPatient, ...prev]);
  };

  const handleDeletePatient = (id: string) => {
    if (window.confirm(`Are you sure you want to remove patient ${id}?`)) {
      setPatients((prev) => prev.filter((p) => p.id !== id));
      setAppointments((prev) => prev.filter((a) => a.patientId !== id));
    }
  };

  // Dynamic Doctor Availability & Duty Status (IST Asia/Kolkata)
  const [currentDutyCheckTime, setCurrentDutyCheckTime] = useState<Date>(() => new Date());
  const [ongoingSurgeries, setOngoingSurgeries] = useState<string[]>([]);
  const [manualDoctorOverrides, setManualDoctorOverrides] = useState<Record<string, DoctorStatus>>({});

  // Automatically update doctor duty statuses every 30 seconds without page refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDutyCheckTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Doctors with calculated dynamic status based on current IST time and shift schedule
  const dynamicDoctors = useMemo(() => {
    return doctors.map((doc) => ({
      ...doc,
      status: computeDoctorStatus(
        doc,
        appointments,
        ongoingSurgeries,
        manualDoctorOverrides,
        currentDutyCheckTime
      )
    }));
  }, [doctors, appointments, ongoingSurgeries, manualDoctorOverrides, currentDutyCheckTime]);

  // Doctors Actions
  const handleAddDoctor = (newDocData: Omit<Doctor, 'id'>) => {
    const nextIdNumber = 200 + doctors.length + 1;
    const newDoc: Doctor = {
      ...newDocData,
      id: `DOC-${nextIdNumber}`
    };
    setDoctors((prev) => [...prev, newDoc]);
  };

  const handleUpdateDoctorStatus = (id: string, status: DoctorStatus) => {
    if (status === 'In Surgery') {
      setOngoingSurgeries((prev) => Array.from(new Set([...prev, id])));
    } else {
      setOngoingSurgeries((prev) => prev.filter((docId) => docId !== id));
    }
    setManualDoctorOverrides((prev) => ({ ...prev, [id]: status }));
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    );
  };

  const handleBookWithDoctor = (doctor: Doctor) => {
    setPreselectedDoctorId(doctor.id);
    setActivePage('appointments');
    setIsBookAppointmentOpen(true);
  };

  const handleBookForPatient = (patient: Patient) => {
    setPreselectedPatientId(patient.id);
    setActivePage('appointments');
    setIsBookAppointmentOpen(true);
  };

  // Appointments Actions
  const handleAddAppointment = (
    newApptData: Omit<Appointment, 'id' | 'tokenNo' | 'createdAt'>
  ) => {
    const nextNum = appointments.length + 1;
    const tokenNo = `TK-${String(nextNum).padStart(2, '0')}`;
    const newAppt: Appointment = {
      ...newApptData,
      id: `APT-${300 + nextNum}`,
      tokenNo,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setAppointments((prev) => [newAppt, ...prev]);
  };

  const handleUpdateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('Are you sure you want to cancel and remove this appointment?')) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // Medical Records Actions
  const handleAddRecord = (newRecData: Omit<MedicalRecord, 'id'>) => {
    const nextNum = records.length + 1;
    const newRec: MedicalRecord = {
      ...newRecData,
      id: `REC-${400 + nextNum}`
    };
    setRecords((prev) => [newRec, ...prev]);
  };

  // Reset to original college demo data
  const handleResetData = () => {
    if (window.confirm('Reset all patients, doctors, and appointments to initial demo data?')) {
      setPatients(INITIAL_PATIENTS);
      setDoctors(INITIAL_DOCTORS);
      setAppointments(INITIAL_APPOINTMENTS);
      setRecords(INITIAL_RECORDS);
      localStorage.clear();
      localStorage.setItem('medicare_admin_session', 'true');
    }
  };

  // If not logged in, render Admin Login
  if (!isAuthenticated) {
    return (
      <>
        <LoginView
          onLoginSuccess={handleLogin}
          onOpenProjectCode={() => setIsProjectGuideOpen(true)}
        />
        <ProjectGuideModal
          isOpen={isProjectGuideOpen}
          onClose={() => setIsProjectGuideOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-800">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        onSelectPage={(page) => {
          if (page === 'guide') {
            setIsProjectGuideOpen(true);
          } else {
            setActivePage(page);
          }
        }}
        adminName={adminUser}
        onLogout={handleLogout}
        patientCount={patients.length}
        doctorCount={dynamicDoctors.length}
        appointmentCount={appointments.length}
        recordCount={records.length}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          activePage={activePage}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenBookAppointment={() => {
            setActivePage('appointments');
            setIsBookAppointmentOpen(true);
          }}
        />

        {/* Dynamic Page View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && (
            <DashboardView
              patients={patients}
              doctors={dynamicDoctors}
              appointments={appointments}
              onNavigate={(page) => {
                if (page === 'guide') {
                  setIsProjectGuideOpen(true);
                } else {
                  setActivePage(page);
                }
              }}
              onOpenRegisterPatient={() => {
                setActivePage('patients');
                setIsRegisterPatientOpen(true);
              }}
              onOpenBookAppointment={() => {
                setActivePage('appointments');
                setIsBookAppointmentOpen(true);
              }}
              onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
              onOpenProjectCode={() => setIsProjectGuideOpen(true)}
            />
          )}

          {activePage === 'patients' && (
            <PatientsView
              patients={patients}
              onAddPatient={handleAddPatient}
              onDeletePatient={handleDeletePatient}
              onOpenBookAppointmentForPatient={handleBookForPatient}
              onPrintPatientCard={(patient) =>
                setPrintableDoc({ type: 'patient', data: patient })
              }
              isRegisterModalOpen={isRegisterPatientOpen}
              setIsRegisterModalOpen={setIsRegisterPatientOpen}
            />
          )}

          {activePage === 'doctors' && (
            <DoctorsView
              doctors={dynamicDoctors}
              onAddDoctor={handleAddDoctor}
              onBookAppointmentWithDoctor={handleBookWithDoctor}
              onUpdateDoctorStatus={handleUpdateDoctorStatus}
            />
          )}

          {activePage === 'appointments' && (
            <AppointmentsView
              appointments={appointments}
              patients={patients}
              doctors={dynamicDoctors}
              onAddAppointment={handleAddAppointment}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onDeleteAppointment={handleDeleteAppointment}
              onPrintAppointmentSlip={(appt) =>
                setPrintableDoc({ type: 'appointment', data: appt })
              }
              isBookModalOpen={isBookAppointmentOpen}
              setIsBookModalOpen={(open) => {
                setIsBookAppointmentOpen(open);
                if (!open) {
                  setPreselectedDoctorId(null);
                  setPreselectedPatientId(null);
                }
              }}
              preselectedDoctorId={preselectedDoctorId}
              preselectedPatientId={preselectedPatientId}
            />
          )}

          {activePage === 'records' && (
            <PatientRecordsView
              records={records}
              patients={patients}
              doctors={dynamicDoctors}
              onAddRecord={handleAddRecord}
              onPrintRecord={(rec) =>
                setPrintableDoc({ type: 'record', data: rec })
              }
            />
          )}
        </main>

        {/* Global Footer */}
        <footer className="py-4 px-6 border-t border-slate-200/80 bg-white/70 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">LIFE CARE HOSPITAL</span>
            <span>·</span>
            <span>Hospital Management System</span>
            <span>·</span>
            <span>Quality Healthcare Services</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              className="text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
              title="Reset data to default state"
            >
              Reset Data
            </button>
          </div>
        </footer>
      </div>

      {/* Global Modals */}
      <ProjectGuideModal
        isOpen={isProjectGuideOpen}
        onClose={() => setIsProjectGuideOpen(false)}
      />

      <PrintDocumentModal
        document={printableDoc}
        onClose={() => setPrintableDoc(null)}
      />
    </div>
  );
}
