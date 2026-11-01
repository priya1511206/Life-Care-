import React, { useState } from 'react';
import {
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Database,
  FileCode,
  Eye,
  EyeOff,
  Hospital,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (adminUser: string) => void;
  onOpenProjectCode: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onOpenProjectCode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 6. Do not allow login when password field is empty
    if (!password) {
      setError('Invalid password. Please enter the correct password.');
      return;
    }

    setIsLoading(true);

    // Verify exact case-sensitive match with required password
    const REQUIRED_KEY = 'LifeCare@2026';

    setTimeout(() => {
      if (password === REQUIRED_KEY) {
        setIsLoading(false);
        // Flexible username: user can enter any username, default to 'Admin' if left blank
        const resolvedUsername = username.trim() || 'Admin';
        onLoginSuccess(resolvedUsername);
      } else {
        setIsLoading(false);
        // Exact requested error message
        setError('Invalid password. Please enter the correct password.');
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/90 via-teal-50/30 to-sky-100/60 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans">
      {/* Top Header: Prominently displaying LIFE CARE HOSPITAL */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-3 border-b border-teal-100/80">
        <div className="flex items-center gap-3">
          {/* Medical Cross Logo */}
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-teal-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            {/* Attractive Medical Cross Symbol */}
            <svg
              className="w-6 h-6 text-white drop-shadow-xs"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-6v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-6H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h6V3z" />
            </svg>
          </div>
          <div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-blue-950 uppercase leading-none block">
              LIFE CARE HOSPITAL
            </span>
            <span className="text-xs text-teal-700 font-semibold tracking-wide block mt-0.5">
              Center for Clinical Excellence & Patient Care
            </span>
          </div>
        </div>
      </header>

      {/* Main Login Container */}
      <main className="max-w-md mx-auto w-full my-auto py-6">
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-200/90 overflow-hidden">
          {/* Card Header Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 px-6 py-8 text-white text-center relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute -right-10 -top-10 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-teal-400/15 rounded-full blur-xl pointer-events-none" />

            {/* Logo Emblem */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 mb-3.5 shadow-inner">
              <svg
                className="w-7 h-7 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h7a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-7v7a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-7H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h7V2z" />
              </svg>
            </div>

            {/* Requirement 4: Welcome to Life Care Hospital */}
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Welcome to Life Care Hospital
            </h2>

            {/* Requirement 5: Hospital Management System – Admin Portal */}
            <p className="text-teal-100 text-xs sm:text-sm mt-1.5 font-medium">
              Hospital Management System – Admin Portal
            </p>
          </div>

          {/* Form Section */}
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Requirement 6: Username input field (Flexible - any username permitted) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username (e.g. admin)"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50 hover:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Requirement 7: Password input field with show/hide password functionality */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50 hover:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-slate-600" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Requirement 11: Professional blue Login button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Login to Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Security Notice */}
            <div className="mt-6 pt-5 border-t border-slate-100 bg-slate-50/80 -mx-6 -mb-6 p-5 text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Authorized Hospital Personnel Only</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Secure management system for clinical records and hospital administrative operations.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center py-2 text-xs text-slate-500">
        LIFE CARE HOSPITAL · Hospital Management System · All rights reserved
      </footer>
    </div>
  );
};
