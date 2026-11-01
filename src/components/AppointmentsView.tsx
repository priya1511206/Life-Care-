import React, { useState } from 'react';
import {
  CalendarCheck2,
  Search,
  Plus,
  Filter,
  Clock,
  Printer,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Stethoscope,
  Ticket
} from 'lucide-react';
import { Appointment, AppointmentStatus, Patient, Doctor } from '../types';

interface AppointmentsViewProps {
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
  onAddAppointment: (newAppt: Omit<Appointment, 'id' | 'tokenNo' | 'createdAt'>) => void;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onDeleteAppointment: (id: string) => void;
  onPrintAppointmentSlip: (appt: Appointment) => void;
  isBookModalOpen: boolean;
  setIsBookModalOpen: (open: boolean) => void;
  preselectedDoctorId?: string | null;
  preselectedPatientId?: string | null;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  patients,
  doctors,
  onAddAppointment,
  onUpdateStatus,
  onDeleteAppointment,
  onPrintAppointmentSlip,
  isBookModalOpen,
  setIsBookModalOpen,
  preselectedDoctorId,
  preselectedPatientId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Booking Form State
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    preselectedPatientId || (patients[0]?.id || '')
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    preselectedDoctorId || (doctors[0]?.id || '')
  );
  const [appointmentDate, setAppointmentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState<string>('08:00 AM');
  const [symptoms, setSymptoms] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const availableTimeSlots = [
    '08:00 AM',
    '08:30 AM',
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM',
    '05:30 PM',
    '06:00 PM',
    '06:30 PM',
    '07:00 PM',
    '07:30 PM',
    '08:00 PM'
  ];

  // Filtering
  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch =
      appt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.tokenNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || appt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientObj = patients.find((p) => p.id === selectedPatientId);
    const doctorObj = doctors.find((d) => d.id === selectedDoctorId);

    if (!patientObj || !doctorObj) {
      setFormError('Please select both a valid Patient and Doctor.');
      return;
    }

    if (!symptoms.trim()) {
      setFormError('Please describe the chief complaint or reason for consultation.');
      return;
    }

    onAddAppointment({
      patientId: patientObj.id,
      patientName: patientObj.name,
      doctorId: doctorObj.id,
      doctorName: doctorObj.name,
      department: doctorObj.department,
      appointmentDate,
      timeSlot,
      status: 'Scheduled',
      symptoms: symptoms.trim()
    });

    // Reset
    setSymptoms('');
    setFormError(null);
    setIsBookModalOpen(false);
  };

  const selectedDoctorObj = doctors.find((d) => d.id === selectedDoctorId);

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient, doctor, or token (e.g. TK-01)..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 hover:bg-white transition-colors"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/90 rounded-lg border border-slate-200">
          {['ALL', 'Scheduled', 'In-Consultation', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                statusFilter === status
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status === 'ALL' ? 'All' : status}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs shadow-blue-600/30 transition-colors whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Appointments Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">OPD Appointments Schedule</h3>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {filteredAppointments.length} Appointments
            </span>
          </div>
          <span className="text-xs text-slate-500">
            Real-time OPD Consultation Queue
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Token</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Doctor & Department</th>
                <th className="py-3 px-4">Date & Slot</th>
                <th className="py-3 px-4">Reason / Symptoms</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <CalendarCheck2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-slate-600">No appointments found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Click "Book Appointment" to add an OPD consultation.</p>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200 text-xs">
                        {appt.tokenNo}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{appt.patientName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{appt.patientId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{appt.doctorName}</div>
                      <div className="text-[11px] text-blue-600 font-medium">{appt.department}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono">
                      <div className="text-slate-800">{appt.appointmentDate}</div>
                      <div className="text-[11px] text-slate-500">{appt.timeSlot}</div>
                    </td>
                    <td className="py-3 px-4 max-w-[200px]">
                      <p className="truncate text-slate-600" title={appt.symptoms}>
                        {appt.symptoms}
                      </p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={appt.status}
                        onChange={(e) => onUpdateStatus(appt.id, e.target.value as AppointmentStatus)}
                        className={`text-[11px] font-semibold rounded-md px-2 py-1 border cursor-pointer ${
                          appt.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : appt.status === 'In-Consultation'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : appt.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="In-Consultation">In Consultation</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onPrintAppointmentSlip(appt)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Print Consultation Slip / Token"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteAppointment(appt.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Appointment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-blue-600 to-sky-600 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Book OPD Appointment</h3>
                  <p className="text-xs text-blue-100">Generates sequential consultation token</p>
                </div>
              </div>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Select Patient */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Registered Patient *
                </label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id}) · {p.gender}, {p.age}y · {p.bloodGroup}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Doctor */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Doctor & Department *
                </label>
                <select
                  required
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.department} ({d.opdTimings})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Doctor Summary Pill */}
              {selectedDoctorObj && (
                <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200/80 text-[11px] text-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                    <span>Room: <strong>{selectedDoctorObj.roomNo}</strong></span>
                  </div>
                  <div>
                    <span>Consultation Fee: <strong>₹{selectedDoctorObj.consultationFee}</strong></span>
                  </div>
                </div>
              )}

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    OPD Time Slot *
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono"
                  >
                    {availableTimeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Chief Complaints / Reason */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Visit / Symptoms *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Fever with chills for 2 days, persistent headache and loss of taste."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Generate Token & Book</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
