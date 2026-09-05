import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAcademy } from '../context/AcademyContext';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { MewLogo } from './MewLogo';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    closeAuthModal,
    checkoutCourse,
    login,
    register,
    registerSendOtp,
    registerVerifyOtp,
    registerResendOtp,
    forgotPassword,
    resetPassword,
    loginWithGoogleCredential,
    loginWithGoogleAccessToken
  } = useAcademy();

  // Synchronously initialize URL params so reset mode is active on first render only if token is present
  const getInitialUrlParams = () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
      const token = searchParams.get('reset_token') || hashParams.get('reset_token') || searchParams.get('token') || hashParams.get('token') || '';
      const emailParam = searchParams.get('email') || hashParams.get('email') || '';
      return { token, email: emailParam };
    } catch {
      return { token: '', email: '' };
    }
  };

  const initialParams = getInitialUrlParams();

  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'verify-email' | 'forgot' | 'reset'>(() => {
    if (authModalMode) return authModalMode;
    return initialParams.token && initialParams.email ? 'reset' : 'login';
  });
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(() => initialParams.email);
  const [password, setPassword] = useState('');
  const [resetCode, setResetCode] = useState(() => initialParams.token);
  const [registrationOtp, setRegistrationOtp] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [googleClientId, setGoogleClientId] = useState<string>(() => (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '');

  // Synchronize internal authMode whenever authModalMode or modal open state changes
  useEffect(() => {
    if (isAuthModalOpen) {
      if (authModalMode) {
        setAuthMode(authModalMode);
      }
      setErrorMessage('');
      if (authModalMode === 'login' || authModalMode === 'signup') {
        setSuccessMessage('');
        setPassword('');
        setConfirmPassword('');
        setResetCode('');
      }
    }
  }, [isAuthModalOpen, authModalMode]);

  // Detect reset_token and email dynamically on popstate / hashchange / mount
  useEffect(() => {
    const checkParams = () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
        const token = searchParams.get('reset_token') || hashParams.get('reset_token') || searchParams.get('token') || hashParams.get('token');
        const emailParam = searchParams.get('email') || hashParams.get('email');
        if (token && emailParam) {
          setEmail(emailParam);
          setResetCode(token);
          setAuthMode('reset');
          setAuthModalMode('reset');
          setIsAuthModalOpen(true);
          setSuccessMessage('Recovery link verified! Please set your new password.');
        }
      } catch {
        // ignore
      }
    };

    checkParams();
    window.addEventListener('popstate', checkParams);
    window.addEventListener('hashchange', checkParams);
    return () => {
      window.removeEventListener('popstate', checkParams);
      window.removeEventListener('hashchange', checkParams);
    };
  }, [setIsAuthModalOpen, setAuthModalMode]);

  // Fetch Google Client ID from backend if not already set in frontend env
  useEffect(() => {
    let isMounted = true;
    if (!googleClientId) {
      fetch('/api/auth/config')
        .then(res => res.json())
        .then(data => {
          if (data?.googleClientId && isMounted) {
            setGoogleClientId(data.googleClientId);
          }
        })
        .catch(() => { });
    }
    return () => {
      isMounted = false;
    };
  }, [googleClientId]);

  // Initialize Google Identity Services (GIS)
  useEffect(() => {
    if (!isAuthModalOpen || !googleClientId) return;

    let checkInterval: any = null;

    const setupGoogle = () => {
      const g = (window as any).google;
      if (!g?.accounts?.id) return false;

      try {
        g.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            if (response?.credential) {
              setIsLoading(true);
              setErrorMessage('');
              const res = await loginWithGoogleCredential(response.credential);
              setIsLoading(false);
              if (!res.success) {
                setErrorMessage(res.message || 'Google sign-in failed.');
              }
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        return true;
      } catch (err) {
        console.warn('Google Identity initialization notice:', err);
        return false;
      }
    };

    if (!setupGoogle()) {
      checkInterval = setInterval(() => {
        if (setupGoogle()) {
          clearInterval(checkInterval);
        }
      }, 300);
      setTimeout(() => clearInterval(checkInterval), 6000);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [isAuthModalOpen, googleClientId, loginWithGoogleCredential]);

  if (!isAuthModalOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: 'Empty', color: 'bg-slate-200', textColor: 'text-slate-400' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-600' };
    if (score <= 2) return { score: 2, text: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-600' };
    if (score <= 3) return { score: 3, text: 'Good', color: 'bg-sky-500', textColor: 'text-sky-600' };
    return { score: 4, text: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-600' };
  };

  const strength = getPasswordStrength(password);

  // Handle sending 6-digit OTP and reset link
  const handleForgotSubmit = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    if (!email.includes('@')) {
      setErrorMessage('Please enter a valid Gmail address.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await forgotPassword(email.trim());
      if (result.success) {
        setAuthMode('reset');
        setResetCode('');
        setSuccessMessage(`OTP sent successfully to ${email.trim()}! Please enter the 6-digit OTP code below.`);
      } else {
        setErrorMessage(result.message || 'Failed to send OTP. Please check your email and try again.');
      }
    } catch {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setErrorMessage('');
    setSuccessMessage('');

    if (authMode === 'forgot') {
      await handleForgotSubmit();
      return;
    }

    if (authMode === 'reset') {
      if (!email.includes('@')) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      if (!resetCode.trim()) {
        setErrorMessage('Please enter the 6-digit OTP code or reset token.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('New password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }

      setIsLoading(true);
      const result = await resetPassword(email.trim(), resetCode.trim(), password);
      setIsLoading(false);
      if (result.success) {
        setSuccessMessage('Password reset successfully! Logging you in...');
        // Clean up URL parameters after successful reset without forcing homepage redirection
        try {
          const searchParams = new URLSearchParams(window.location.search);
          searchParams.delete('reset_token');
          searchParams.delete('token');
          searchParams.delete('email');
          const newSearch = searchParams.toString() ? `?${searchParams.toString()}` : '';
          window.history.replaceState({}, document.title, window.location.pathname + newSearch + window.location.hash);
        } catch {
          // ignore
        }
      } else {
        setErrorMessage(result.message || 'Invalid or expired 6-digit OTP code. Please try again.');
      }
      return;
    }

    if (authMode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!phone.trim()) {
        setErrorMessage('Please enter your phone number.');
        return;
      }
      if (!email.includes('@')) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }

      setIsLoading(true);
      const result = await registerSendOtp(name.trim(), email.trim(), password, phone.trim());
      setIsLoading(false);
      if (result.success) {
        setAuthMode('verify-email');
        setErrorMessage('');
        setSuccessMessage(result.message || `A 6-digit verification code has been sent to ${email.trim()}.`);
      } else {
        setErrorMessage(result.message || 'Unable to register. Please check your details and try again.');
      }
      return;
    }

    if (authMode === 'verify-email') {
      if (!registrationOtp.trim() || registrationOtp.trim().length < 6) {
        setErrorMessage('Please enter the 6-digit verification code sent to your email.');
        return;
      }

      setIsLoading(true);
      const result = await registerVerifyOtp(email.trim(), registrationOtp.trim());
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.message || 'Invalid or expired verification code. Please try again.');
      }
      return;
    }

    // Default: Login Mode
    if (!email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    const result = await login(email.trim(), password);
    setIsLoading(false);
    if (!result.success) {
      setErrorMessage(result.message || 'Invalid email or password.');
    }
  };

  const handleGoogleSignIn = () => {
    setErrorMessage('');
    const g = (window as any).google;

    if (!googleClientId) {
      setErrorMessage('Google Client ID is missing. Please sign in with your email or set VITE_GOOGLE_CLIENT_ID in .env.');
      return;
    }

    // 1. Try modern Google OAuth2 Token Client popup (reliable on direct user click)
    if (g?.accounts?.oauth2?.initTokenClient) {
      try {
        const client = g.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          prompt: 'select_account',
          callback: async (tokenResponse: any) => {
            if (tokenResponse?.access_token) {
              setIsLoading(true);
              setErrorMessage('');
              const res = await loginWithGoogleAccessToken(tokenResponse.access_token);
              setIsLoading(false);
              if (!res.success) {
                setErrorMessage(res.message || 'Google sign-in failed.');
              }
            } else if (tokenResponse?.error) {
              if (tokenResponse.error === 'access_denied') {
                setErrorMessage('Google sign-in was cancelled.');
              } else {
                setErrorMessage(`Google OAuth notice: ${tokenResponse.error_description || tokenResponse.error}. If testing locally, ensure ${window.location.origin} is added to Authorized JavaScript Origins in Google Cloud Console.`);
              }
            }
          },
          error_callback: (error: any) => {
            console.error('Google OAuth error callback:', error);
            setErrorMessage(`Google Sign-In error (${error?.type || 'origin_mismatch'}). Ensure ${window.location.origin} is in your Google Cloud Console Authorized JavaScript Origins.`);
          }
        });
        client.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err: any) {
        console.warn('Google OAuth Token Client notice, falling back to One Tap:', err);
      }
    }

    // 2. Fallback to One Tap prompt
    if (g?.accounts?.id) {
      try {
        g.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            const reason = notification.getNotDisplayedReason?.() || notification.getSkippedReason?.() || 'popup_blocked';
            console.log('Google One Tap notice:', reason);
            if (reason === 'opt_out_or_no_session' || reason === 'suppressed_by_user') {
              setErrorMessage('Google One Tap was dismissed. Please sign in with your email and password.');
            }
          }
        });
      } catch (err: any) {
        console.warn('Google prompt error:', err);
        setErrorMessage('Google Sign-In popup could not open. Please sign in with email.');
      }
    } else {
      setErrorMessage('Google Sign-In library is loading. If using an ad-blocker or Brave Shields, please allow Google scripts.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">

        {/* Modal Backdrop Click Target */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0"
        />

        {/* Modal Container */}
        <div className="relative w-full max-w-4xl my-auto z-10" onClick={e => e.stopPropagation()}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[520px]">

              {/* Left Brand Panel */}
              <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-[#051329] via-[#071739] to-[#041026] text-white p-6 lg:p-8 flex-col justify-between relative overflow-hidden">
                <div className="space-y-6 relative z-10">
                  <div>
                    <MewLogo size="md" theme="on-dark" />
                  </div>

                  <div className="space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Live Cohort Platform
                    </span>
                    <h2 className="text-xl lg:text-2xl font-black text-white leading-snug">
                      Master Industry Tech with Live Mentorship
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Connect to your live batches, verified credentials, and real-world project portfolios.
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center gap-2.5 text-xs text-slate-200 font-medium">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                        ✓
                      </div>
                      <span>Online Live EDA &amp; Python Masterclasses</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-200 font-medium">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                        ✓
                      </div>
                      <span>Accredited QR-Verifiable Certificate Suite</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-200 font-medium">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                        ✓
                      </div>
                      <span>Direct WhatsApp Peer Learning Community</span>
                    </div>
                  </div>
                </div>

                {/* Accreditation Note */}
                <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2 relative z-10">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Official MEW Academy Hub</span>
                </div>
              </div>

              {/* Right Form Area */}
              <div className="md:col-span-7 flex flex-col relative bg-white">

                {/* Mobile Header */}
                <div className="md:hidden bg-gradient-to-br from-[#051329] via-[#071739] to-[#041026] text-white p-4 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <MewLogo size="sm" theme="on-dark" />
                  </div>
                  <button
                    onClick={closeAuthModal}
                    className="p-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
                    aria-label="Close dialog"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Desktop Close Button */}
                <button
                  onClick={closeAuthModal}
                  className="hidden md:flex absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Form Inner Body */}
                <div className="p-5 sm:p-7 space-y-4">

                  {/* Header Titles */}
                  {/* Header Titles */}
                  <div className="space-y-1 pr-6">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {authMode === 'login' && 'Sign In to MEW Academy'}
                      {authMode === 'signup' && 'Create Your Student Account'}
                      {authMode === 'verify-email' && 'Verify Your Email Address'}
                      {authMode === 'forgot' && 'Reset Your Password'}
                      {authMode === 'reset' && 'Enter OTP & Set New Password'}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {authMode === 'login' && 'Access your course admissions, batch schedules, and verified certificates.'}
                      {authMode === 'signup' && 'Register to join masterclass batches and earn accredited certificates.'}
                      {authMode === 'verify-email' && `Enter the 6-digit confirmation code sent to ${email || 'your email'}.`}
                      {authMode === 'forgot' && 'Enter your registered Gmail to receive a 6-digit OTP code.'}
                      {authMode === 'reset' && `Enter the 6-digit OTP code sent to ${email || 'your email'} and set your new password.`}
                    </p>
                  </div>

                  {/* Course Context Banner */}
                  {checkoutCourse && (
                    <div className="bg-amber-50 border border-amber-300/80 rounded-xl p-3 flex items-center gap-2.5 shadow-2xs">
                      <Sparkles className="w-4 h-4 text-[#d9822b] flex-shrink-0" />
                      <div className="text-xs text-amber-950 min-w-0 flex-1">
                        <span className="font-bold block">Sign in to complete your admission:</span>
                        <span className="text-slate-700 truncate block text-[11px]">{checkoutCourse.title} • ₹{checkoutCourse.priceINR.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}

                  {/* Mode Selector Tabs (Login / Signup) */}
                  {(authMode === 'login' || authMode === 'signup') && (
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('login');
                          setAuthModalMode('login');
                          setErrorMessage('');
                          setSuccessMessage('');
                        }}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${authMode === 'login'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                          }`}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signup');
                          setAuthModalMode('signup');
                          setErrorMessage('');
                          setSuccessMessage('');
                        }}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${authMode === 'signup'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                          }`}
                      >
                        Create Account
                      </button>
                    </div>
                  )}

                  {/* Google OAuth Button (Login / Signup only) */}
                  {(authMode === 'login' || authMode === 'signup') && (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full h-11 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>{authMode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}</span>
                      </button>

                      <div className="relative flex items-center justify-center my-1">
                        <div className="border-t border-slate-200 w-full"></div>
                        <span className="bg-white px-2.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Or continue with email
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Feedback Alerts */}
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {successMessage && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2 animate-in fade-in duration-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{successMessage}</span>
                    </div>
                  )}

                  {/* Main Form Fields */}
                  <form onSubmit={handleSubmit} className="space-y-3">

                    {/* Email Verification Step for Registration */}
                    {authMode === 'verify-email' ? (
                      <div className="space-y-3.5">
                        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 space-y-1">
                          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                            <Mail className="w-4 h-4 text-[#d9822b]" />
                            <span>Verification Code Sent</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            We have sent a 6-digit code to <strong className="text-slate-900">{email}</strong>. Enter it below to activate your account.
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-slate-700">
                              6-Digit Verification Code <span className="text-rose-500">*</span>
                            </label>
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={async () => {
                                setIsLoading(true);
                                const res = await registerResendOtp(email.trim());
                                setIsLoading(false);
                                if (res.success) {
                                  setSuccessMessage(`Fresh verification code sent to ${email.trim()}.`);
                                } else {
                                  setErrorMessage(res.message || 'Failed to resend code.');
                                }
                              }}
                              className="text-[11px] text-[#d9822b] hover:underline font-bold cursor-pointer disabled:opacity-50"
                            >
                              Resend Code
                            </button>
                          </div>
                          <div className="relative flex items-center">
                            <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                            <input
                              id="registrationOtp"
                              name="registrationOtp"
                              type="text"
                              value={registrationOtp}
                              onChange={e => setRegistrationOtp(e.target.value.trim())}
                              placeholder="e.g. 583920"
                              maxLength={6}
                              className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base focus:outline-none focus:border-[#d9822b] focus:bg-white transition-all font-mono font-bold text-slate-900 tracking-widest text-center"
                              required
                              autoFocus
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block text-center">
                            Valid for 15 minutes. Check your spam folder if not found.
                          </span>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-11 sm:h-12 px-4 bg-gradient-to-r from-[#d9822b] to-[#f5a623] hover:from-[#c87624] hover:to-[#e0961b] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                        >
                          {isLoading ? (
                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            <>
                              <ShieldCheck className="w-4 h-4" />
                              <span>Verify Email &amp; Complete Registration</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>

                        <div className="flex items-center justify-between pt-1 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMode('signup');
                              setErrorMessage('');
                              setSuccessMessage('');
                            }}
                            className="text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                          >
                            ← Edit registration details
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setAuthMode('login');
                              setAuthModalMode('login');
                              setErrorMessage('');
                              setSuccessMessage('');
                            }}
                            className="text-slate-600 hover:text-[#d9822b] font-bold cursor-pointer ml-auto"
                          >
                            Sign In
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Name Field (Sign Up only) */}
                        {authMode === 'signup' && (
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Full Name <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative flex items-center">
                              <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                              <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. Rahul Sharma"
                                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#d9822b] focus:bg-white transition-all font-medium"
                                required
                              />
                            </div>
                          </div>
                        )}

                        {/* Phone Number Field (Sign Up only) */}
                        {authMode === 'signup' && (
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Phone Number <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative flex items-center">
                              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                              <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="e.g. +91 98765 43210"
                                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#d9822b] focus:bg-white transition-all font-medium"
                                required
                              />
                            </div>
                          </div>
                        )}

                        {/* Email Field (All modes) */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Email Address <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative flex items-center">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                            <input
                              id="email"
                              name="email"
                              type="email"
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              placeholder="e.g. student@gmail.com"
                              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#d9822b] focus:bg-white transition-all font-medium"
                              required
                            />
                          </div>
                        </div>

                        {/* Reset Code / OTP Field (Reset Mode only) */}
                        {authMode === 'reset' && (
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs font-bold text-slate-700">
                                6-Digit OTP / Verification Code <span className="text-rose-500">*</span>
                              </label>
                              <button
                                type="button"
                                disabled={isLoading}
                                onClick={async () => {
                                  if (!email.includes('@')) {
                                    setErrorMessage('Enter your email to receive OTP.');
                                    return;
                                  }
                                  setIsLoading(true);
                                  const res = await forgotPassword(email.trim());
                                  setIsLoading(false);
                                  if (res.success) {
                                    setSuccessMessage(`Fresh 6-digit OTP has been sent to ${email.trim()}. Check your inbox.`);
                                  } else {
                                    setErrorMessage(res.message || 'Failed to resend OTP.');
                                  }
                                }}
                                className="text-[11px] text-[#d9822b] hover:underline font-bold cursor-pointer disabled:opacity-50"
                              >
                                Resend OTP
                              </button>
                            </div>
                            <div className="relative flex items-center">
                              <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                              <input
                                id="resetCode"
                                name="resetCode"
                                type="text"
                                value={resetCode}
                                onChange={e => setResetCode(e.target.value.trim())}
                                placeholder="Enter 6-digit OTP (e.g. 583920)"
                                maxLength={64}
                                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#d9822b] focus:bg-white transition-all font-mono font-bold text-slate-900 tracking-wider"
                                required
                              />
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              Check your inbox (or spam) for the 6-digit OTP code or reset token.
                            </span>
                          </div>
                        )}

                        {/* Password Field (Login, Signup, Reset) */}
                        {authMode !== 'forgot' && (
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs font-bold text-slate-700">
                                {authMode === 'reset' ? 'New Password' : 'Password'} <span className="text-rose-500">*</span>
                              </label>
                              {authMode === 'login' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAuthMode('forgot');
                                    setAuthModalMode('forgot');
                                    setErrorMessage('');
                                    setSuccessMessage('');
                                  }}
                                  className="text-[11px] text-[#d9822b] hover:text-[#b7681c] font-bold cursor-pointer"
                                >
                                  Forgot password?
                                </button>
                              )}
                            </div>

                            <div className="relative flex items-center">
                              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                              <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#d9822b] focus:bg-white transition-all font-mono"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                                aria-label="Toggle password visibility"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>

                            {/* Password Strength Meter */}
                            {(authMode === 'signup' || authMode === 'reset') && password && (
                              <div className="mt-1.5 space-y-1">
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="text-slate-500">Security strength:</span>
                                  <span className={`font-bold ${strength.textColor}`}>{strength.text}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                                  <div className={`h-full flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-slate-200'}`} />
                                  <div className={`h-full flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-slate-200'}`} />
                                  <div className={`h-full flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-200'}`} />
                                  <div className={`h-full flex-1 rounded-full ${strength.score >= 4 ? strength.color : 'bg-slate-200'}`} />
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Confirm Password Field (Reset Mode only) */}
                        {authMode === 'reset' && (
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Confirm New Password <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative flex items-center">
                              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="Re-type new password"
                                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#d9822b] focus:bg-white transition-all font-mono"
                                required
                              />
                            </div>
                          </div>
                        )}

                        {/* Remember Me Checkbox (Login only) */}
                        {authMode === 'login' && (
                          <div className="flex items-center gap-2 pt-0.5">
                            <input
                              type="checkbox"
                              id="rememberMe"
                              checked={rememberMe}
                              onChange={e => setRememberMe(e.target.checked)}
                              className="w-4 h-4 text-[#d9822b] rounded border-slate-300 focus:ring-[#d9822b] cursor-pointer"
                            />
                            <label htmlFor="rememberMe" className="text-xs text-slate-600 font-medium select-none cursor-pointer">
                              Remember my login credentials
                            </label>
                          </div>
                        )}

                        {/* Submit Action Button */}
                        {authMode === 'forgot' ? (
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 sm:h-12 px-4 bg-gradient-to-r from-[#d9822b] to-[#f5a623] hover:from-[#c87624] hover:to-[#e0961b] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                          >
                            {isLoading ? (
                              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                              <>
                                <Mail className="w-4 h-4" />
                                <span>Send 6-Digit OTP</span>
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 sm:h-12 px-4 bg-gradient-to-r from-[#d9822b] to-[#f5a623] hover:from-[#c87624] hover:to-[#e0961b] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                          >
                            {isLoading ? (
                              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                              <>
                                <span>
                                  {authMode === 'login' && 'Sign In to MEW Academy'}
                                  {authMode === 'signup' && 'Create Account & Verify Email'}
                                  {authMode === 'reset' && 'Verify OTP & Reset Password'}
                                </span>
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        )}

                        {/* Bottom Navigation Links */}
                        {(authMode === 'forgot' || authMode === 'reset') && (
                          <div className="flex items-center justify-between pt-2 text-xs">
                            {authMode === 'forgot' ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setAuthMode('reset');
                                  setAuthModalMode('reset');
                                  setErrorMessage('');
                                  setSuccessMessage('');
                                }}
                                className="text-[#d9822b] hover:underline font-bold cursor-pointer"
                              >
                                Already have an OTP code? Enter it here →
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setAuthMode('forgot');
                                  setAuthModalMode('forgot');
                                  setErrorMessage('');
                                  setSuccessMessage('');
                                }}
                                className="text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                              >
                                ← Request new OTP
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setAuthMode('login');
                                setAuthModalMode('login');
                                setErrorMessage('');
                                setSuccessMessage('');
                                try {
                                  const searchParams = new URLSearchParams(window.location.search);
                                  searchParams.delete('reset_token');
                                  searchParams.delete('token');
                                  searchParams.delete('email');
                                  const newSearch = searchParams.toString() ? `?${searchParams.toString()}` : '';
                                  window.history.replaceState({}, document.title, window.location.pathname + newSearch + window.location.hash);
                                } catch {
                                  // ignore
                                }
                              }}
                              className="text-slate-600 hover:text-[#d9822b] font-bold cursor-pointer ml-auto"
                            >
                              Sign In
                            </button>
                          </div>
                        )}
                      </>
                    )}

                  </form>

                  {/* Footer Legal Notice */}
                  <div className="pt-2 border-t border-slate-100 text-center">
                    <p className="text-[11px] text-slate-500 leading-snug">
                      By accessing MEW Academy, you agree to our{' '}
                      <span className="text-[#d9822b] font-medium">Terms of Use</span>{' '}
                      and{' '}
                      <span className="text-[#d9822b] font-medium">Privacy Policy</span>.
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
