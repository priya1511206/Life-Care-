import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Printer,
  Calendar,
  Activity,
  Heart,
  Thermometer,
  Pill,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { MedicalRecord, PrescriptionItem, Patient, Doctor } from '../types';

interface PatientRecordsViewProps {
  records: MedicalRecord[];
  patients: Patient[];
  doctors: Doctor[];
  onAddRecord: (newRec: Omit<MedicalRecord, 'id'>) => void;
  onPrintRecord: (record: MedicalRecord) => void;
}

export const PatientRecordsView: React.FC<PatientRecordsViewProps> = ({
  records,
  patients,
  doctors,
  onAddRecord,
  onPrintRecord
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState<string>(
    records[0]?.id || ''
  );
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);

  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [diagnosis, setDiagnosis] = useState('');
  const [complaints, setComplaints] = useState('');
  const [bp, setBp] = useState('120/80 mmHg');
  const [pulse, setPulse] = useState('74 bpm');
  const [temp, setTemp] = useState('98.6 °F');
  const [spo2, setSpo2] = useState('99%');
  const [weight, setWeight] = useState('65 kg');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [labTestsText, setLabTestsText] = useState('CBC, Fasting Blood Sugar');

  // Dynamic Prescriptions
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      medicine: 'Tab. Paracetamol',
      dosage: '650 mg',
      frequency: '1 - 0 - 1',
      duration: '5 Days',
      instructions: 'After meals with water'
    }
  ]);

  const [formError, setFormError] = useState<string | null>(null);

  // Filter records
  const filteredRecords = records.filter((rec) => {
    return (
      rec.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.patientId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const activeRecord = records.find((r) => r.id === selectedRecordId) || records[0];

  const handleAddPrescriptionRow = () => {
    setPrescriptions([
      ...prescriptions,
      {
        medicine: '',
        dosage: '500 mg',
        frequency: '1 - 0 - 1',
        duration: '5 Days',
        instructions: 'After meals'
      }
    ]);
  };

  const handleRemovePrescriptionRow = (index: number) => {
    if (prescriptions.length === 1) return;
    setPrescriptions(prescriptions.filter((_, idx) => idx !== index));
  };

  const handlePrescriptionChange = (
    index: number,
    field: keyof PrescriptionItem,
    value: string
  ) => {
    const updated = [...prescriptions];
    updated[index][field] = value;
    setPrescriptions(updated);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientObj = patients.find((p) => p.id === selectedPatientId);
    const doctorObj = doctors.find((d) => d.id === selectedDoctorId);

    if (!patientObj || !doctorObj) {
      setFormError('Please select a valid patient and attending doctor.');
      return;
    }

    if (!diagnosis.trim()) {
      setFormError('Please enter clinical diagnosis.');
      return;
    }

    const cleanedPrescriptions = prescriptions.filter((p) => p.medicine.trim() !== '');
    if (cleanedPrescriptions.length === 0) {
      setFormError('Please add at least one prescription medication.');
      return;
    }

    const parsedLabTests = labTestsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onAddRecord({
      patientId: patientObj.id,
      patientName: patientObj.name,
      doctorId: doctorObj.id,
      doctorName: doctorObj.name,
      visitDate,
      diagnosis: diagnosis.trim(),
      complaints: complaints.trim() || 'Routine outpatient follow-up',
      vitals: {
        bloodPressure: bp.trim() || '120/80 mmHg',
        pulseRate: pulse.trim() || '72 bpm',
        temperature: temp.trim() || '98.6 °F',
        spO2: spo2.trim() || '99%',
        weight: weight.trim() || '65 kg'
      },
      prescriptions: cleanedPrescriptions,
      labTests: parsedLabTests,
      clinicalNotes: clinicalNotes.trim() || 'Patient advised healthy lifestyle and follow-up.',
      followUpDate: followUpDate || undefined
    });

    // Reset
    setDiagnosis('');
    setComplaints('');
    setClinicalNotes('');
    setFormError(null);
    setIsAddRecordModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medical records by patient name or diagnosis..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 hover:bg-white transition-colors"
          />
        </div>

        <button
          onClick={() => setIsAddRecordModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs shadow-blue-600/30 transition-colors whitespace-nowrap cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>New Clinical Record</span>
        </button>
      </div>

      {/* Main Split View: Left record list, Right detailed case sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Records List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Consultation Case Sheets ({filteredRecords.length})
            </span>
          </div>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredRecords.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                No clinical records found.
              </div>
            ) : (
              filteredRecords.map((rec) => {
                const isSelected = activeRecord?.id === rec.id;
                return (
                  <div
                    key={rec.id}
                    onClick={() => setSelectedRecordId(rec.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {rec.patientName}
                        </span>
                        <span className="text-[11px] font-mono text-blue-600 font-semibold block">
                          {rec.patientId} · {rec.id}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                        {rec.visitDate}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-600">
                      <p className="font-medium text-slate-800 line-clamp-1">{rec.diagnosis}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">By {rec.doctorName}</p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{rec.prescriptions.length} Meds Prescribed</span>
                      <span className="font-mono text-blue-700">BP: {rec.vitals.bloodPressure}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Case Sheet & Prescription (8 cols) */}
        <div className="lg:col-span-8">
          {activeRecord ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Header */}
              <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-blue-300 font-mono mb-1">
                    <span>CASE SHEET: {activeRecord.id}</span>
                    <span>·</span>
                    <span>VISIT DATE: {activeRecord.visitDate}</span>
                  </div>
                  <h3 className="text-xl font-bold">{activeRecord.patientName}</h3>
                  <p className="text-xs text-slate-300">
                    Patient ID: <strong className="font-mono text-white">{activeRecord.patientId}</strong> · Attending: <strong className="text-white">{activeRecord.doctorName}</strong>
                  </p>
                </div>

                <button
                  onClick={() => onPrintRecord(activeRecord)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Case Summary</span>
                </button>
              </div>

              {/* Vitals Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-y sm:divide-y-0 divide-slate-100 bg-blue-50/40 border-b border-slate-200 text-xs">
                <div className="p-3 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Blood Pressure</span>
                  <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                    {activeRecord.vitals.bloodPressure}
                  </span>
                </div>
                <div className="p-3 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Pulse Rate</span>
                  <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                    {activeRecord.vitals.pulseRate}
                  </span>
                </div>
                <div className="p-3 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Temperature</span>
                  <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                    {activeRecord.vitals.temperature}
                  </span>
                </div>
                <div className="p-3 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Oxygen (SpO2)</span>
                  <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                    {activeRecord.vitals.spO2}
                  </span>
                </div>
                <div className="p-3 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Weight</span>
                  <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                    {activeRecord.vitals.weight}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 sm:p-6 space-y-6 text-xs text-slate-700">
                {/* Chief Complaints & Diagnosis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Chief Complaints & Symptoms
                    </span>
                    <p className="font-medium text-slate-800 leading-relaxed">
                      {activeRecord.complaints}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                      Clinical Diagnosis
                    </span>
                    <p className="font-bold text-blue-900 leading-relaxed text-sm">
                      {activeRecord.diagnosis}
                    </p>
                  </div>
                </div>

                {/* Prescriptions Table */}
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Pill className="w-4 h-4 text-blue-600" />
                    <h4 className="font-bold text-slate-900 text-sm">Rx: Prescribed Medications</h4>
                  </div>

                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
                        <tr>
                          <th className="py-2.5 px-3">Medicine Name</th>
                          <th className="py-2.5 px-3">Dosage</th>
                          <th className="py-2.5 px-3">Frequency</th>
                          <th className="py-2.5 px-3">Duration</th>
                          <th className="py-2.5 px-3">Instructions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {activeRecord.prescriptions.map((med, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 font-semibold text-slate-900">
                              {med.medicine}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-600">{med.dosage}</td>
                            <td className="py-2.5 px-3 font-mono text-blue-700 font-medium">
                              {med.frequency}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-600">{med.duration}</td>
                            <td className="py-2.5 px-3 text-slate-500">{med.instructions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Lab Tests & Clinical Advice */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Recommended Lab Investigations
                    </span>
                    <ul className="space-y-1">
                      {activeRecord.labTests.map((test, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>{test}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Doctor's Clinical Notes & Follow-up
                    </span>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <p className="text-slate-700 leading-relaxed">{activeRecord.clinicalNotes}</p>
                      {activeRecord.followUpDate && (
                        <div className="flex items-center gap-1.5 text-xs text-blue-700 font-semibold pt-1 border-t border-slate-200">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Next Follow-up Review: {activeRecord.followUpDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              Select a medical case sheet from the left to view clinical details.
            </div>
          )}
        </div>
      </div>

      {/* New Clinical Record Modal */}
      {isAddRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-blue-600 to-sky-600 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Create Clinical Record & Prescription</h3>
                  <p className="text-xs text-blue-100">Document patient vitals, diagnosis & prescribed medications</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddRecordModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Patient & Doctor Select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Patient *
                  </label>
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Consulting Doctor *
                  </label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Diagnosis and Complaints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Clinical Diagnosis *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acute Gastritis / Hypertension Stage 1"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Symptoms / Complaints
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Epigastric burning pain, nausea"
                    value={complaints}
                    onChange={(e) => setComplaints(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Vitals Grid */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-2">
                  Vital Measurements
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">BP</label>
                    <input
                      type="text"
                      value={bp}
                      onChange={(e) => setBp(e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-mono bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Pulse</label>
                    <input
                      type="text"
                      value={pulse}
                      onChange={(e) => setPulse(e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-mono bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Temp</label>
                    <input
                      type="text"
                      value={temp}
                      onChange={(e) => setTemp(e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-mono bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">SpO2</label>
                    <input
                      type="text"
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-mono bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Weight</label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-mono bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Prescriptions List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-blue-600" />
                    <span>Prescriptions (Rx)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddPrescriptionRow}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Medicine</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {prescriptions.map((p, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 items-center text-xs"
                    >
                      <div className="col-span-4">
                        <input
                          type="text"
                          required
                          placeholder="Medicine name"
                          value={p.medicine}
                          onChange={(e) =>
                            handlePrescriptionChange(idx, 'medicine', e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="Dosage"
                          value={p.dosage}
                          onChange={(e) =>
                            handlePrescriptionChange(idx, 'dosage', e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white font-mono"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="Freq (1-0-1)"
                          value={p.frequency}
                          onChange={(e) =>
                            handlePrescriptionChange(idx, 'frequency', e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white font-mono"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="Duration / Timing"
                          value={p.instructions}
                          onChange={(e) =>
                            handlePrescriptionChange(idx, 'instructions', e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemovePrescriptionRow(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Tests & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lab Tests (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Complete Blood Count, Serum Urea"
                    value={labTestsText}
                    onChange={(e) => setLabTestsText(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Next Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Clinical Advice / Lifestyle Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Advice on diet, exercise, hydration, or restrictions..."
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddRecordModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Record & Prescription</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
