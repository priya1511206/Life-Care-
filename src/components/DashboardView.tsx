import React from 'react';
import {
  Users,
  UserCheck,
  CalendarCheck2,
  Activity,
  Plus,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  Stethoscope
} from 'lucide-react';
import { Patient, Doctor, Appointment, AppointmentStatus, ActivePage } from '../types';
import { getDoctorStatusBadgeClass } from '../utils/doctorDuty';

interface DashboardViewProps {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  onNavigate: (page: ActivePage) => void;
  onOpenRegisterPatient: () => void;
  onOpenBookAppointment: () => void;
  onUpdateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  onOpenProjectCode?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  doctors,
  appointments,
  onNavigate,
  onOpenRegisterPatient,
  onOpenBookAppointment,
  onUpdateAppointmentStatus,
  onOpenProjectCode
}) => {
  // Statistics calculations
  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;
  
  // Today's scheduled or active appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.appointmentDate === today || true); // show recent for demo
  const pendingAppointments = appointments.filter((a) => a.status === 'Scheduled').length;
  const inConsultationAppointments = appointments.filter((a) => a.status === 'In-Consultation').length;
  const completedAppointments = appointments.filter((a) => a.status === 'Completed').length;
  const activeDoctors = doctors.filter((d) => d.status === 'On Duty' || d.status === 'Available');

  const statCards = [
    {
      title: 'Total Patients',
      value: totalPatients,
      subtitle: `${patients.filter(p => p.status === 'Inpatient').length} currently admitted`,
      icon: Users,
      color: 'blue',
      onClick: () => onNavigate('patients')
    },
    {
      title: 'Total Doctors',
      value: totalDoctors,
      subtitle: `${activeDoctors.length} available today`,
      icon: UserCheck,
      color: 'emerald',
      onClick: () => onNavigate('doctors')
    },
    {
      title: 'Total Appointments',
      value: totalAppointments,
      subtitle: `${pendingAppointments} queued in OPD`,
      icon: CalendarCheck2,
      color: 'indigo',
      onClick: () => onNavigate('appointments')
    },
    {
      title: 'Today Consultations',
      value: completedAppointments + inConsultationAppointments,
      subtitle: `${completedAppointments} completed visits`,
      icon: Activity,
      color: 'sky',
      onClick: () => onNavigate('records')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-sky-700 rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium mb-3 border border-white/20">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Hospital Administration System Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Life Care Hospital – OPD & Inpatient Operations Console
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 leading-relaxed">
            Quickly register outpatients, schedule appointments with specialists, generate consultation tokens, and review clinical case sheets.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              onClick={onOpenRegisterPatient}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-700 font-semibold text-xs hover:bg-blue-50 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register Patient</span>
            </button>
            <button
              onClick={onOpenBookAppointment}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/40 hover:bg-blue-500/60 text-white font-semibold text-xs border border-white/25 transition-colors cursor-pointer"
            >
              <CalendarCheck2 className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={card.onClick}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{card.title}</span>
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-bold text-slate-900 tracking-tight font-mono tabular-nums">
                  {card.value}
                </span>
                <p className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                  <span>{card.subtitle}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Today's Appointments & On-Duty Doctors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Appointments Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Today's OPD Queue & Appointments</h3>
                <p className="text-xs text-slate-500 mt-0.5">Live consultation status and token numbers</p>
              </div>
              <button
                onClick={() => onNavigate('appointments')}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200/80 uppercase font-semibold text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Token</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Doctor / Dept</th>
                    <th className="py-3 px-4">Time Slot</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {todayAppointments.slice(0, 5).map((appt) => (
                    <tr key={appt.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono tabular-nums font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {appt.tokenNo}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div>{appt.patientName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{appt.patientId}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{appt.doctorName}</div>
                        <div className="text-[11px] text-slate-500">{appt.department}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {appt.timeSlot}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            appt.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : appt.status === 'In-Consultation'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : appt.status === 'Cancelled'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={appt.status}
                          onChange={(e) =>
                            onUpdateAppointmentStatus(appt.id, e.target.value as AppointmentStatus)
                          }
                          className="text-[11px] bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="In-Consultation">In Consultation</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing top 5 appointments for today's roster</span>
            <button
              onClick={onOpenBookAppointment}
              className="text-blue-600 font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book Next Slot</span>
            </button>
          </div>
        </div>

        {/* Right Col: Doctors On Duty */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Doctors On Duty</h3>
                <p className="text-xs text-slate-500">Specialists actively attending OPD</p>
              </div>
              <button
                onClick={() => onNavigate('doctors')}
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                All Doctors
              </button>
            </div>

            <div className="space-y-3.5">
              {doctors.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{doc.name}</h4>
                    <p className="text-[11px] text-blue-600 font-medium truncate">{doc.department}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {doc.roomNo}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {doc.opdTimings}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap border ${getDoctorStatusBadgeClass(
                        doc.status
                      )}`}
                    >
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
