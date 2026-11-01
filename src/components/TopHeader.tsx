import React, { useState, useEffect } from 'react';
import { Menu, Calendar, Clock } from 'lucide-react';
import { ActivePage } from '../types';

interface TopHeaderProps {
  activePage: ActivePage;
  onOpenMobileMenu: () => void;
  onOpenBookAppointment: () => void;
}

interface OpdStatusInfo {
  status: 'OPD Active' | 'OPD Inactive' | 'OPD Closed';
  badgeClass: string;
  iconClass: string;
  detail: string;
}

const getOpdStatus = (date: Date = new Date()): OpdStatusInfo => {
  const currentMinutes = date.getHours() * 60 + date.getMinutes();

  const morningStart = 9 * 60;   // 9:00 AM (540 mins)
  const morningEnd = 13 * 60;    // 1:00 PM (780 mins)
  const eveningStart = 16 * 60;  // 4:00 PM (960 mins)
  const eveningEnd = 20 * 60;    // 8:00 PM (1200 mins)

  // Working hours: Morning 9:00 AM - 1:00 PM OR Evening 4:00 PM - 8:00 PM
  if (
    (currentMinutes >= morningStart && currentMinutes < morningEnd) ||
    (currentMinutes >= eveningStart && currentMinutes < eveningEnd)
  ) {
    const shift = currentMinutes < morningEnd ? 'Morning (9 AM - 1 PM)' : 'Evening (4 PM - 8 PM)';
    return {
      status: 'OPD Active',
      badgeClass: 'bg-emerald-50/80 border-emerald-200/70 text-emerald-700',
      iconClass: 'text-emerald-600',
      detail: `OPD is actively attending patients · ${shift}`
    };
  }

  // Afternoon break: 1:00 PM to 4:00 PM
  if (currentMinutes >= morningEnd && currentMinutes < eveningStart) {
    return {
      status: 'OPD Inactive',
      badgeClass: 'bg-amber-50/80 border-amber-200/70 text-amber-700',
      iconClass: 'text-amber-600',
      detail: 'Afternoon Intermission · Evening OPD resumes at 4:00 PM'
    };
  }

  // Outside working hours (before 9:00 AM or after 8:00 PM)
  return {
    status: 'OPD Closed',
    badgeClass: 'bg-slate-100 border-slate-200/80 text-slate-600',
    iconClass: 'text-slate-500',
    detail: 'OPD is closed · Timings: 9:00 AM - 1:00 PM & 4:00 PM - 8:00 PM'
  };
};

/**
 * Returns the current date formatted dynamically in Indian Standard Time (IST, Asia/Kolkata)
 * using the standard DD/MM/YYYY format.
 */
const getIndianFormattedDate = (date: Date = new Date()): string => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).formatToParts(date);

  const day = parts.find((p) => p.type === 'day')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const year = parts.find((p) => p.type === 'year')?.value;

  if (day && month && year) {
    return `${day}/${month}/${year}`;
  }

  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

export const TopHeader: React.FC<TopHeaderProps> = ({
  activePage,
  onOpenMobileMenu,
  onOpenBookAppointment
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [todayFormatted, setTodayFormatted] = useState(() => getIndianFormattedDate(new Date()));
  const [opdStatus, setOpdStatus] = useState<OpdStatusInfo>(() => getOpdStatus(new Date()));

  // Auto-check time every 10 seconds to update date and status in real-time without requiring a page refresh
  useEffect(() => {
    const updateTimeAndStatus = () => {
      const now = new Date();
      setCurrentDate(now);
      setTodayFormatted(getIndianFormattedDate(now));
      setOpdStatus(getOpdStatus(now));
    };

    updateTimeAndStatus();
    const intervalId = setInterval(updateTimeAndStatus, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const getPageInfo = (page: ActivePage) => {
    switch (page) {
      case 'dashboard':
        return { title: 'Dashboard Overview', subtitle: 'Live hospital occupancy, OPD statistics & appointments' };
      case 'patients':
        return { title: 'Patients Directory', subtitle: 'Manage patient registrations, medical profiles & status' };
      case 'doctors':
        return { title: 'Doctors Directory', subtitle: 'Medical staff roster, OPD consultation schedules & departments' };
      case 'appointments':
        return { title: 'Appointment Booking', subtitle: 'OPD queue management, consultation tokens & schedules' };
      case 'records':
        return { title: 'Patient Medical Records', subtitle: 'Clinical notes, vital measurements, diagnoses & prescriptions' };
      case 'guide':
        return { title: 'DBMS & OOPS Mini Project Hub', subtitle: 'MySQL 3NF schema, Java JDBC DAO, Servlets & Viva guide' };
      default:
        return { title: 'Hospital Management', subtitle: 'Medical administrative operations' };
    }
  };

  const pageInfo = getPageInfo(activePage);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Zone 1: Breadcrumb & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Life Care Hospital</span>
            <span aria-hidden="true">/</span>
            <span className="text-blue-600 capitalize">{activePage}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate leading-tight">
            {pageInfo.title}
          </h1>
        </div>
      </div>

      {/* Zone 2: Date & Dynamic OPD Shift Status (Desktop) */}
      <div className="hidden md:flex items-center gap-3 text-xs text-slate-500 shrink-0">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-medium text-slate-700">{todayFormatted}</span>
        </div>

        {/* Dynamic time-based OPD status badge */}
        <div
          title={opdStatus.detail}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium transition-colors ${opdStatus.badgeClass}`}
        >
          <Clock className={`w-3.5 h-3.5 ${opdStatus.iconClass}`} />
          <span>{opdStatus.status}</span>
        </div>
      </div>

      {/* Zone 3: Primary Action Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <button
          onClick={onOpenBookAppointment}
          className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors whitespace-nowrap cursor-pointer border border-slate-200"
        >
          <Calendar className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">Book</span> Appt
        </button>
      </div>
    </header>
  );
};
