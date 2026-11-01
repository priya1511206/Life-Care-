import { Doctor, DoctorStatus, Appointment } from '../types';

/**
 * Parses time string like "09:00 AM", "1:00 PM" into minutes from midnight (0..1439).
 */
export function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hour < 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;

  return hour * 60 + minute;
}

/**
 * Parses a timing range like "09:00 AM - 01:00 PM".
 */
export function parseOpdTimings(timings: string): { startMinutes: number; endMinutes: number } | null {
  if (!timings) return null;
  const parts = timings.split('-').map((s) => s.trim());
  if (parts.length !== 2) return null;

  const start = parseTimeToMinutes(parts[0]);
  const end = parseTimeToMinutes(parts[1]);

  if (start === null || end === null) return null;
  return { startMinutes: start, endMinutes: end };
}

/**
 * Gets current minutes and date representation in Indian Standard Time (IST, Asia/Kolkata).
 */
export function getCurrentIstTime(date: Date = new Date()): {
  totalMinutes: number;
  formattedTime: string;
  istDateString: string;
} {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  });
  const parts = formatter.formatToParts(date);
  const hour = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
  const minute = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);

  const totalMinutes = hour * 60 + minute;

  // Format YYYY-MM-DD for IST
  const dateParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);

  return {
    totalMinutes,
    formattedTime: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    istDateString: dateParts
  };
}

/**
 * Calculates a doctor's dynamic duty and availability status.
 *
 * Rules:
 * - If an ongoing surgery is actively recorded for this doctor -> "In Surgery"
 * - If manual status override is "On Leave" -> "On Leave"
 * - If manual status override is "In Surgery" -> "In Surgery"
 * - If current IST time < OPD start time -> "Upcoming" (Shift has not started yet)
 * - If current IST time >= OPD end time -> "Off Duty" (Scheduled shift has ended)
 * - If within scheduled OPD working hours:
 *     - If actively attending an appointment consultation -> "On Duty"
 *     - If free to attend patients -> "Available"
 */
export function computeDoctorStatus(
  doctor: Doctor,
  appointments: Appointment[] = [],
  ongoingSurgeries: string[] = [],
  manualOverrides: Record<string, DoctorStatus> = {},
  date: Date = new Date()
): DoctorStatus {
  // 1. Check if an actual ongoing surgery is recorded for this doctor
  if (ongoingSurgeries.includes(doctor.id)) {
    return 'In Surgery';
  }

  // Check manual override if explicitly set to 'On Leave' or 'In Surgery'
  const override = manualOverrides[doctor.id];
  if (override === 'In Surgery') return 'In Surgery';
  if (override === 'On Leave') return 'On Leave';

  const timings = parseOpdTimings(doctor.opdTimings);
  if (!timings) {
    return 'Available';
  }

  const { totalMinutes: currentIstMinutes } = getCurrentIstTime(date);
  const { startMinutes, endMinutes } = timings;

  // 2. Before shift start time -> Upcoming (Do not show as On Duty before scheduled shift)
  if (currentIstMinutes < startMinutes) {
    return 'Upcoming';
  }

  // 3. After shift end time -> Off Duty
  if (currentIstMinutes >= endMinutes) {
    return 'Off Duty';
  }

  // 4. Within scheduled working hours:
  // If manual override was explicitly set to 'On Duty' or 'Available', respect it if within working hours
  if (override === 'On Duty') return 'On Duty';
  if (override === 'Available') return 'Available';

  // Check if doctor is actively engaged in an ongoing appointment consultation
  const hasActiveConsultation = appointments.some(
    (a) =>
      (a.doctorId === doctor.id || a.doctorName.toLowerCase().includes(doctor.name.toLowerCase().replace('dr.', '').trim())) &&
      a.status === 'In-Consultation'
  );

  if (hasActiveConsultation) {
    return 'On Duty'; // within working hours and actively consulting
  }

  // Within scheduled hours and free to attend patients
  return 'Available';
}

/**
 * Returns badge styling for each doctor status.
 */
export function getDoctorStatusBadgeClass(status: DoctorStatus): string {
  switch (status) {
    case 'Available':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'On Duty':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'In Surgery':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Upcoming':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'Off Duty':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    case 'On Leave':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
}
