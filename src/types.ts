export type Gender = 'Male' | 'Female' | 'Other';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type PatientStatus = 'Outpatient' | 'Inpatient' | 'Discharged';

export type DoctorStatus = 'Upcoming' | 'On Duty' | 'Available' | 'In Surgery' | 'Off Duty' | 'On Leave';

export type AppointmentStatus = 'Scheduled' | 'In-Consultation' | 'Completed' | 'Cancelled';

export interface Patient {
  id: string; // e.g., 'PID-1001'
  name: string;
  age: number;
  gender: Gender;
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  allergies?: string;
  registeredDate: string;
  status: PatientStatus;
}

export interface Doctor {
  id: string; // e.g., 'DOC-201'
  name: string;
  department: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  opdTimings: string;
  roomNo: string;
  phone: string;
  email: string;
  status: DoctorStatus;
  consultationFee: number;
}

export interface Appointment {
  id: string; // e.g., 'APT-301'
  tokenNo: string; // e.g., 'TK-01'
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  appointmentDate: string;
  timeSlot: string;
  status: AppointmentStatus;
  symptoms: string;
  notes?: string;
  createdAt: string;
}

export interface PrescriptionItem {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface MedicalRecord {
  id: string; // e.g., 'REC-401'
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  visitDate: string;
  diagnosis: string;
  vitals: {
    bloodPressure: string;
    pulseRate: string;
    temperature: string;
    spO2: string;
    weight: string;
  };
  complaints: string;
  prescriptions: PrescriptionItem[];
  labTests: string[];
  clinicalNotes: string;
  followUpDate?: string;
}

export type ActivePage = 'dashboard' | 'patients' | 'doctors' | 'appointments' | 'records' | 'guide';
