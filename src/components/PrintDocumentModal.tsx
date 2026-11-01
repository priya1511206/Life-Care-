import React from 'react';
import { Printer, X, Hospital, CheckCircle2, HeartPulse } from 'lucide-react';
import { Appointment, MedicalRecord, Patient } from '../types';

export type PrintableDocType = 
  | { type: 'appointment'; data: Appointment }
  | { type: 'record'; data: MedicalRecord }
  | { type: 'patient'; data: Patient };

interface PrintDocumentModalProps {
  document: PrintableDocType | null;
  onClose: () => void;
}

export const PrintDocumentModal: React.FC<PrintDocumentModalProps> = ({ document, onClose }) => {
  if (!document) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col">
        {/* Top Control Bar (Hidden during actual print) */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs">
            <Printer className="w-4 h-4 text-blue-400" />
            <span className="font-semibold">Hospital Document Print Preview</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Area (Rendered with pure black & white / clinical styling for clean printing) */}
        <div id="printable-area" className="p-8 bg-white text-slate-900 text-xs font-sans space-y-6">
          {/* Hospital Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold">
                <Hospital className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  LIFE CARE HOSPITAL
                </h1>
                <p className="text-[11px] text-slate-500">
                  Center for Clinical Excellence & Patient Care · 24x7 Emergency & Multi-Specialty OPD
                </p>
                <p className="text-[10px] text-slate-400">
                  Tel: +91 80 2345 6789 · Email: info@lifecare.org · Web: www.lifecare-hospital.edu
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-[11px] text-slate-600">
              <p>Generated: {new Date().toLocaleDateString()}</p>
              <p className="text-blue-700 font-bold">Hospital Administration</p>
            </div>
          </div>

          {/* Document Type 1: Appointment Slip */}
          {document.type === 'appointment' && (
            <div className="space-y-5">
              <div className="text-center py-2 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-xs uppercase tracking-widest font-bold text-blue-900">
                  OPD CONSULTATION TOKEN SLIP
                </span>
                <div className="text-3xl font-mono font-extrabold text-blue-700 mt-1">
                  {document.data.tokenNo}
                </div>
                <p className="text-[11px] text-slate-600">Appointment ID: {document.data.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 border border-slate-200 rounded-lg">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Name</span>
                  <span className="text-sm font-bold text-slate-900">{document.data.patientName}</span>
                  <span className="text-xs text-slate-500 font-mono block">PID: {document.data.patientId}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Consulting Specialist</span>
                  <span className="text-sm font-bold text-slate-900">{document.data.doctorName}</span>
                  <span className="text-xs text-blue-600 font-medium block">{document.data.department}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Scheduled Date</span>
                  <span className="font-mono font-semibold text-slate-800">{document.data.appointmentDate}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Time Slot</span>
                  <span className="font-mono font-semibold text-slate-800">{document.data.timeSlot}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Reason for Visit / Reported Symptoms
                </span>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-700 leading-relaxed">
                  {document.data.symptoms}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 flex items-end justify-between text-[11px] text-slate-500">
                <div>
                  <p>• Please report to the designated OPD counter 15 minutes before your slot.</p>
                  <p>• Bring previous test reports, medications, and this token slip.</p>
                </div>
                <div className="text-center pt-8 border-t border-slate-400 w-48">
                  <span className="block font-semibold text-slate-700">Hospital OPD Registrar</span>
                  <span className="text-[10px] text-slate-400">Authorized Signature</span>
                </div>
              </div>
            </div>
          )}

          {/* Document Type 2: Clinical Medical Record & Prescription */}
          {document.type === 'record' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900">CLINICAL CASE SUMMARY & PRESCRIPTION</h2>
                  <p className="text-slate-500 font-mono text-[11px]">Record Ref: {document.data.id}</p>
                </div>
                <div className="text-right font-mono">
                  <span>Date: {document.data.visitDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Patient Details</span>
                  <p className="font-bold text-slate-800 text-sm">{document.data.patientName}</p>
                  <p className="text-slate-500 font-mono">{document.data.patientId}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Attending Physician</span>
                  <p className="font-bold text-slate-800 text-sm">{document.data.doctorName}</p>
                  <p className="text-blue-600 font-medium">Department Consultant</p>
                </div>
              </div>

              {/* Vitals */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Vital Parameters</span>
                <div className="grid grid-cols-5 gap-2 p-2.5 border border-slate-200 rounded text-center font-mono">
                  <div>
                    <span className="text-[9px] text-slate-400 block">BP</span>
                    <span className="font-bold">{document.data.vitals.bloodPressure}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">Pulse</span>
                    <span className="font-bold">{document.data.vitals.pulseRate}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">Temp</span>
                    <span className="font-bold">{document.data.vitals.temperature}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">SpO2</span>
                    <span className="font-bold">{document.data.vitals.spO2}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">Weight</span>
                    <span className="font-bold">{document.data.vitals.weight}</span>
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="p-3 bg-blue-50/50 border border-blue-200 rounded">
                <span className="text-[10px] uppercase font-bold text-blue-700 block mb-0.5">Clinical Diagnosis</span>
                <span className="font-bold text-slate-900 text-sm">{document.data.diagnosis}</span>
              </div>

              {/* Prescriptions */}
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-900 block mb-2">Rx: Medications</span>
                <table className="w-full text-left border border-slate-200">
                  <thead className="bg-slate-100 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-2 border-b">Medicine</th>
                      <th className="p-2 border-b">Dosage</th>
                      <th className="p-2 border-b">Frequency</th>
                      <th className="p-2 border-b">Duration</th>
                      <th className="p-2 border-b">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {document.data.prescriptions.map((m, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-bold">{m.medicine}</td>
                        <td className="p-2 font-mono">{m.dosage}</td>
                        <td className="p-2 font-mono">{m.frequency}</td>
                        <td className="p-2 font-mono">{m.duration}</td>
                        <td className="p-2 text-slate-600">{m.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Advice */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Lab Investigations Ordered
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                    {document.data.labTests.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Physician's Advice & Review
                  </span>
                  <p className="text-slate-700 leading-relaxed">{document.data.clinicalNotes}</p>
                  {document.data.followUpDate && (
                    <p className="font-semibold text-blue-700 mt-1">
                      Review Date: {document.data.followUpDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-200 flex items-end justify-between text-[11px]">
                <p className="text-slate-400">Computer generated medical record.</p>
                <div className="text-center w-52 pt-8 border-t border-slate-400">
                  <span className="font-bold text-slate-800">{document.data.doctorName}</span>
                  <span className="block text-[10px] text-slate-500">Doctor's Signature & Stamp</span>
                </div>
              </div>
            </div>
          )}

          {/* Document Type 3: Patient Health Card */}
          {document.type === 'patient' && (
            <div className="space-y-5">
              <div className="text-center py-2 bg-slate-100 rounded-lg border border-slate-300">
                <span className="text-xs uppercase tracking-widest font-bold text-slate-700">
                  PERMANENT PATIENT IDENTIFICATION CARD
                </span>
                <div className="text-2xl font-mono font-extrabold text-blue-700 mt-0.5">
                  {document.data.id}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 border border-slate-200 rounded-lg">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Full Name</span>
                  <span className="text-sm font-bold text-slate-900">{document.data.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Blood Group</span>
                  <span className="text-sm font-mono font-bold text-rose-700">{document.data.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Age / Gender</span>
                  <span className="font-mono text-slate-800">{document.data.age} Years · {document.data.gender}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Contact Phone</span>
                  <span className="font-mono text-slate-800">{document.data.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Emergency Contact</span>
                  <span className="font-semibold text-rose-700">{document.data.emergencyContact}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Address</span>
                  <span className="text-slate-700">{document.data.address}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                <span className="text-[10px] uppercase font-bold text-amber-800 block mb-0.5">Known Allergies</span>
                <span className="text-amber-900">{document.data.allergies || 'None reported.'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
