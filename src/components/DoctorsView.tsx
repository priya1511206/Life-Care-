import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  Clock,
  MapPin,
  Award,
  Calendar,
  X,
  CheckCircle2,
  AlertTriangle,
  Stethoscope
} from 'lucide-react';
import { Doctor, DoctorStatus } from '../types';
import { DEPARTMENTS } from '../data/initialData';
import { getDoctorStatusBadgeClass } from '../utils/doctorDuty';

interface DoctorsViewProps {
  doctors: Doctor[];
  onAddDoctor: (newDoctor: Omit<Doctor, 'id'>) => void;
  onBookAppointmentWithDoctor: (doctor: Doctor) => void;
  onUpdateDoctorStatus: (id: string, status: DoctorStatus) => void;
}

export const DoctorsView: React.FC<DoctorsViewProps> = ({
  doctors,
  onAddDoctor,
  onBookAppointmentWithDoctor,
  onUpdateDoctorStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    department: 'Cardiology',
    specialization: '',
    qualification: '',
    experienceYears: '5',
    opdTimings: '09:00 AM - 01:00 PM',
    roomNo: 'OPD-105',
    phone: '',
    email: '',
    status: 'Available' as DoctorStatus,
    consultationFee: '500'
  });
  const [formError, setFormError] = useState<string | null>(null);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || doc.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.qualification.trim() || !formData.specialization.trim()) {
      setFormError('Please enter Doctor Name, Qualification, and Specialization.');
      return;
    }

    const exp = parseInt(formData.experienceYears, 10) || 0;
    const fee = parseFloat(formData.consultationFee) || 500;

    onAddDoctor({
      name: formData.name.trim().startsWith('Dr.') ? formData.name.trim() : `Dr. ${formData.name.trim()}`,
      department: formData.department,
      specialization: formData.specialization.trim(),
      qualification: formData.qualification.trim(),
      experienceYears: exp,
      opdTimings: formData.opdTimings,
      roomNo: formData.roomNo.trim() || 'OPD-General',
      phone: formData.phone.trim() || '+91 98450 00000',
      email: formData.email.trim() || `${formData.name.toLowerCase().replace(/[^a-z]/g, '')}@medicare.org`,
      status: formData.status,
      consultationFee: fee
    });

    // Reset Form
    setFormData({
      name: '',
      department: 'Cardiology',
      specialization: '',
      qualification: '',
      experienceYears: '5',
      opdTimings: '09:00 AM - 01:00 PM',
      roomNo: 'OPD-105',
      phone: '',
      email: '',
      status: 'Available',
      consultationFee: '500'
    });
    setFormError(null);
    setIsAddDoctorModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Action Bar */}
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
            placeholder="Search by doctor name or specialization..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 hover:bg-white transition-colors"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent focus:outline-none font-medium text-slate-700 cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsAddDoctorModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs shadow-blue-600/30 transition-colors whitespace-nowrap cursor-pointer ml-auto md:ml-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Doctor</span>
          </button>
        </div>
      </div>

      {/* Doctors Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
            <UserCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-medium text-slate-600">No doctors match your query</p>
            <p className="text-xs text-slate-400 mt-1">Try selecting a different department or adding a new doctor.</p>
          </div>
        ) : (
          filteredDoctors.map((doctor) => {
            const initials = doctor.name
              .replace('Dr.', '')
              .trim()
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={doctor.id}
                className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-blue-300 hover:shadow-xs transition-all"
              >
                <div>
                  {/* Top Doctor Avatar & Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-xs">
                        {initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{doctor.name}</h4>
                        <span className="text-xs font-semibold text-blue-600 block mt-0.5">
                          {doctor.department}
                        </span>
                      </div>
                    </div>

                    <select
                      value={doctor.status}
                      onChange={(e) => onUpdateDoctorStatus(doctor.id, e.target.value as DoctorStatus)}
                      className={`text-[10px] font-bold rounded-full px-2 py-0.5 border cursor-pointer ${getDoctorStatusBadgeClass(
                        doctor.status
                      )}`}
                    >
                      <option value="Available">Available</option>
                      <option value="On Duty">On Duty</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="In Surgery">In Surgery</option>
                      <option value="Off Duty">Off Duty</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>

                  {/* Doctor Info */}
                  <div className="text-xs space-y-2 mt-4 pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Specialization</span>
                      <p className="font-medium text-slate-800">{doctor.specialization}</p>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">Qualification</span>
                      <p className="text-slate-600 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{doctor.qualification}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{doctor.opdTimings}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{doctor.roomNo}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{doctor.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700 font-mono">
                          ₹{doctor.consultationFee} OPD Fee
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onBookAppointmentWithDoctor(doctor)}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Appointment with {doctor.name.split(' ')[1] || 'Doctor'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Doctor Modal */}
      {isAddDoctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-blue-600 to-sky-600 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Add Doctor to Hospital Staff</h3>
                  <p className="text-xs text-blue-100">Enter medical credentials & department details</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddDoctorModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Doctor Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Harish Chandra"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pediatric Cardiology"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Qualifications *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MBBS, MD, DM"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="e.g. 10"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    OPD Consultation Hours
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 09:00 AM - 01:00 PM"
                    value={formData.opdTimings}
                    onChange={(e) => setFormData({ ...formData, opdTimings: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Room / OPD No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. OPD-104"
                    value={formData.roomNo}
                    onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98450 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Consultation Fee (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    placeholder="e.g. 600"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddDoctorModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Doctor Details</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
