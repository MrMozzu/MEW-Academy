import React, { useState, useEffect } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { 
  ShieldCheck, 
  Award, 
  Users, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Search, 
  RefreshCw, 
  PlusCircle, 
  Check, 
  AlertCircle, 
  Lock, 
  Eye, 
  EyeOff, 
  KeyRound, 
  LogOut, 
  GraduationCap, 
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Layers,
  FileCheck,
  CreditCard,
  CheckCircle,
  XCircle,
  Copy,
  Phone,
  Mail,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Certificate, PendingPayment } from '../types';

export const AdminCertificatePortal: React.FC = () => {
  const { 
    user, 
    isLoggedIn,
    authToken,
    adminLogin,
    adminChangePassword,
    logout,
    courses, 
    issueCertificateAdmin, 
    revokeCertificateAdmin, 
    revokeCertificateBundleAdmin,
    fetchAdminRegistry,
    fetchPendingPayments,
    approvePendingPayment,
    rejectPendingPayment,
    setActiveCertificateModal,
    setActiveView 
  } = useAcademy();

  const ADMIN_EMAILS = [
    'muzammilahsan07@gmail.com',
    'muzammilahsanahsan07@gmail.com',
    'mewacademy.ac@gmail.com'
  ];

  const isVerifiedAdmin = isLoggedIn && user.role === 'admin' && !!authToken && ADMIN_EMAILS.includes(user.email?.toLowerCase());

  // Gate login state
  const [adminEmail, setAdminEmail] = useState('muzammilahsan07@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Tab state
  const [activeAdminTab, setActiveAdminTab] = useState<'approvals' | 'registry' | 'issue'>('approvals');

  // Change password modal
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [changePasswordMsg, setChangePasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Registry & Issuance Data
  const [registryData, setRegistryData] = useState<{
    students: any[];
    enrollments: any[];
    certificates: any[];
  }>({
    students: [],
    enrollments: [],
    certificates: []
  });

  // Pending Payments Data
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [isApprovingId, setIsApprovingId] = useState<string | null>(null);
  const [isRejectingId, setIsRejectingId] = useState<string | null>(null);
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'issued'>('all');
  
  // Direct Issue Form State
  const [selectedStudentEmail, setSelectedStudentEmail] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'course-data-analytics');
  const [moduleScope, setModuleScope] = useState<'all' | 'py' | 'viz' | 'pro'>('all');
  const [grade, setGrade] = useState<'Distinction' | 'High Honors' | 'Excellence' | 'Passed'>('Distinction');
  const [score, setScore] = useState(98);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchAdminRegistry();
    if (data.success) {
      setRegistryData({
        students: data.students,
        enrollments: data.enrollments,
        certificates: data.certificates
      });
    }

    const pendingRes = await fetchPendingPayments();
    if (pendingRes.success) {
      setPendingPayments(pendingRes.pendingPayments);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (isVerifiedAdmin) {
      loadData();
    }
  }, [isVerifiedAdmin]);

  // Handle Admin Gate Login
  const handleAdminGateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword) {
      setLoginError('Both admin email and password are required.');
      return;
    }

    setIsVerifying(true);
    setLoginError(null);

    const res = await adminLogin(adminEmail.trim(), adminPassword);
    setIsVerifying(false);

    if (!res.success) {
      setLoginError(res.message);
    } else {
      setAdminPassword('');
    }
  };

  // Handle Changing Admin Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setChangePasswordMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setIsChangingPassword(true);
    setChangePasswordMsg(null);

    const res = await adminChangePassword(newPassword);
    setIsChangingPassword(false);

    if (res.success) {
      setChangePasswordMsg({ type: 'success', text: res.message });
      setNewPassword('');
      setTimeout(() => {
        setIsChangePasswordModalOpen(false);
        setChangePasswordMsg(null);
      }, 2000);
    } else {
      setChangePasswordMsg({ type: 'error', text: res.message });
    }
  };

  // Handle Approving a Pending Payment
  const handleApprovePayment = async (payment: PendingPayment) => {
    setIsApprovingId(payment.transactionId);
    setFeedbackMessage(null);

    const res = await approvePendingPayment(payment.transactionId, payment.userId, payment.courseId);
    setIsApprovingId(null);

    if (res.success) {
      setFeedbackMessage({ 
        type: 'success', 
        text: `🎉 Admission Approved for ${payment.studentName}! Course enrolled & WhatsApp Batch invite emailed.` 
      });
      await loadData();
    } else {
      setFeedbackMessage({ type: 'error', text: res.message });
    }
  };

  // Handle Rejecting a Pending Payment
  const handleRejectPayment = async (payment: PendingPayment) => {
    if (!window.confirm(`Are you sure you want to reject the payment submission for ${payment.studentName} (UPI Transaction ID: ${payment.utrNumber})?`)) {
      return;
    }

    setIsRejectingId(payment.transactionId);
    setFeedbackMessage(null);

    const res = await rejectPendingPayment(payment.transactionId, payment.userId, payment.courseId);
    setIsRejectingId(null);

    if (res.success) {
      setFeedbackMessage({ 
        type: 'success', 
        text: `Payment request for ${payment.studentName} has been rejected.` 
      });
      await loadData();
    } else {
      setFeedbackMessage({ type: 'error', text: res.message });
    }
  };

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  // If NOT authenticated as verified admin: Show Security Gate
  if (!isVerifiedAdmin) {
    return (
      <div className="py-16 sm:py-24 bg-slate-950 min-h-[85vh] flex items-center justify-center px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center space-y-3 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-mono uppercase font-bold tracking-wider mb-2">
                Restricted Admin Zone
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Admin Terminal
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                Payment Approvals &amp; Certificate Authority is protected. Only <strong>muzammilahsan07@gmail.com</strong> with password can unlock this portal.
              </p>
            </div>
          </div>

          {loginError && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs font-bold text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminGateLogin} className="space-y-4 relative z-10">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Authorized Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                placeholder="muzammilahsan07@gmail.com"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Administrator Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 bg-gradient-to-r from-[#d9822b] to-[#f5a623] hover:from-[#c87624] hover:to-[#e0961b] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Unlock Admin Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Handle Direct Issue Form
  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentEmail.trim()) {
      setFeedbackMessage({ type: 'error', text: 'Please enter or select a student email.' });
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage(null);

    const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

    const res = await issueCertificateAdmin({
      studentEmail: selectedStudentEmail.trim().toLowerCase(),
      courseId: selectedCourse.id,
      courseTitle: selectedCourse.title,
      category: selectedCourse.category,
      instructorName: selectedCourse.instructor?.name || 'Prof. MD Tahseen Equbal',
      instructorTitle: selectedCourse.instructor?.title || 'Lead Data Science Mentor & Founder, MEW Academy',
      grade,
      overallScore: score,
      skillsVerified: selectedCourse.skillsGained,
      moduleType: moduleScope
    });

    setIsSubmitting(false);

    if (res.success) {
      setFeedbackMessage({ type: 'success', text: res.message });
      setSelectedStudentEmail('');
      await loadData();
    } else {
      setFeedbackMessage({ type: 'error', text: res.message });
    }
  };

  // Quick 1-click issue 3-in-1 suite for a student row
  const handleQuickIssueAll = async (studentEmail: string, courseId: string) => {
    setIsSubmitting(true);
    setFeedbackMessage(null);
    const selectedCourse = courses.find(c => c.id === courseId) || courses[0];

    const res = await issueCertificateAdmin({
      studentEmail: studentEmail.trim().toLowerCase(),
      courseId,
      courseTitle: selectedCourse.title,
      category: selectedCourse.category,
      instructorName: selectedCourse.instructor?.name || 'Prof. MD Tahseen Equbal',
      grade: 'Distinction',
      overallScore: 98,
      skillsVerified: selectedCourse.skillsGained,
      moduleType: 'all'
    });

    setIsSubmitting(false);
    if (res.success) {
      setFeedbackMessage({ type: 'success', text: `3-in-1 Certificate Suite successfully awarded to ${studentEmail}!` });
      await loadData();
    } else {
      setFeedbackMessage({ type: 'error', text: res.message });
    }
  };

  // Handle revoking single certificate
  const handleRevokeSingle = async (certId: string, certNumber: string) => {
    if (!window.confirm(`Are you sure you want to revoke Certificate #${certNumber}?`)) {
      return;
    }

    const res = await revokeCertificateAdmin(certId);
    if (res.success) {
      setFeedbackMessage({ type: 'success', text: res.message });
      await loadData();
    } else {
      setFeedbackMessage({ type: 'error', text: res.message });
    }
  };

  // Handle revoking all certificates (bundle) for a student & course
  const handleRevokeAll = async (userId: string, courseId: string, studentName: string) => {
    if (!window.confirm(`Are you sure you want to revoke ALL 3 certificates for ${studentName}?`)) {
      return;
    }

    const res = await revokeCertificateBundleAdmin(userId, courseId);
    if (res.success) {
      setFeedbackMessage({ type: 'success', text: res.message });
      await loadData();
    } else {
      setFeedbackMessage({ type: 'error', text: res.message });
    }
  };

  // Merge students with enrollments and issued certificates (EXCLUDING ADMINS)
  const studentRows = registryData.enrollments
    .filter(enr => {
      const student = registryData.students.find(s => s.id === (enr.user_id || enr.userId));
      const email = (student?.email || '').toLowerCase();
      return !ADMIN_EMAILS.includes(email);
    })
    .map(enr => {
      const studentUserId = enr.user_id || enr.userId;
      const courseId = enr.course_id || enr.courseId;

      const student = registryData.students.find(s => s.id === studentUserId) || {
        name: 'Enrolled Learner',
        email: 'student@example.com',
        phone: '',
        avatar: '/student-avatar.png',
        joined_at: enr.enrolled_at || enr.enrolledAt
      };

      const course = courses.find(c => c.id === courseId) || {
        title: 'Exploratory Data Analysis Masterclass'
      };

      const studentCerts = registryData.certificates.filter(
        c => (c.user_id === studentUserId || c.userId === studentUserId) && (c.course_id === courseId || c.courseId === courseId)
      );

      const pyCert = studentCerts.find(c => (c.covers || '').includes('Python') || (c.badge_title || c.badgeTitle || '').includes('Python'));
      const vizCert = studentCerts.find(c => (c.covers || '').includes('Visualization') || (c.badge_title || c.badgeTitle || '').includes('Visualization'));
      const proCert = studentCerts.find(c => c.is_flagship || c.isFlagship || (c.badge_title || c.badgeTitle || '').includes('Flagship'));

      return {
        userId: studentUserId,
        studentName: student.name,
        studentEmail: student.email,
        studentPhone: student.phone || '',
        studentAvatar: student.avatar || '/student-avatar.png',
        courseId,
        courseTitle: course.title,
        enrolledAt: enr.enrolled_at || enr.enrolledAt,
        status: enr.status || 'enrolled',
        certs: studentCerts,
        pyCert,
        vizCert,
        proCert,
        totalIssuedCount: studentCerts.length,
        isFullyCertified: studentCerts.length >= 3,
        isUncertified: studentCerts.length === 0
      };
    });

  const filteredRows = studentRows.filter(row => {
    const matchesSearch = 
      row.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (row.studentPhone && row.studentPhone.includes(searchQuery)) ||
      row.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterStatus === 'pending') return row.totalIssuedCount === 0;
    if (filterStatus === 'issued') return row.totalIssuedCount > 0;
    return true;
  });

  const filteredPendingPayments = pendingPayments.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.studentName.toLowerCase().includes(q) ||
      p.studentEmail.toLowerCase().includes(q) ||
      p.studentPhone.includes(q) ||
      p.utrNumber.toLowerCase().includes(q) ||
      p.courseTitle.toLowerCase().includes(q)
    );
  });

  return (
    <div className="py-8 bg-slate-50 min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

        {/* Executive Header Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Executive Command Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                MEW Academy Administrator Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Verify student UPI admissions, manage WhatsApp batch enrollments, and award accredited 3-in-1 industry credentials.
              </p>
            </div>

            {/* Admin Controls Box */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-3 bg-slate-800/90 p-3 rounded-2xl border border-slate-700">
                <img
                  src={user.avatar || '/student-avatar.png'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-white truncate max-w-[140px]">{user.name}</div>
                  <div className="text-[10px] text-amber-300 font-mono">Role: Administrator</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(true)}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  title="Change Admin Password"
                >
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Password</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setActiveView('home');
                  }}
                  className="p-2.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 rounded-xl border border-red-800/50 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  title="Lock Terminal & Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Lock Terminal</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Quick Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pending Payments Card */}
          <div 
            onClick={() => setActiveAdminTab('approvals')}
            className={`p-5 rounded-2xl border shadow-xs flex items-center gap-4 cursor-pointer transition-all ${
              activeAdminTab === 'approvals' 
                ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/20' 
                : 'bg-white border-slate-200 hover:border-amber-300'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#d9822b] flex items-center justify-center font-bold flex-shrink-0 relative">
              <CreditCard className="w-6 h-6" />
              {pendingPayments.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 flex items-center gap-1.5">
                <span>{pendingPayments.length}</span>
                {pendingPayments.length > 0 && (
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded-full uppercase">Action Needed</span>
                )}
              </div>
              <div className="text-xs text-slate-500 font-semibold">Pending Payments</div>
            </div>
          </div>

          <div 
            onClick={() => setActiveAdminTab('registry')}
            className={`p-5 rounded-2xl border shadow-xs flex items-center gap-4 cursor-pointer transition-all ${
              activeAdminTab === 'registry' 
                ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-400/20' 
                : 'bg-white border-slate-200 hover:border-blue-300'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">
                {registryData.students.filter(s => s.role !== 'admin' && !ADMIN_EMAILS.includes(s.email?.toLowerCase())).length}
              </div>
              <div className="text-xs text-slate-500 font-semibold">Registered Students</div>
            </div>
          </div>

          <div 
            onClick={() => setActiveAdminTab('registry')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 cursor-pointer hover:border-purple-300 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{studentRows.filter(r => r.status === 'enrolled').length}</div>
              <div className="text-xs text-slate-500 font-semibold">Active Enrollments</div>
            </div>
          </div>

          <div 
            onClick={() => setActiveAdminTab('issue')}
            className={`p-5 rounded-2xl border shadow-xs flex items-center gap-4 cursor-pointer transition-all ${
              activeAdminTab === 'issue' 
                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/20' 
                : 'bg-white border-slate-200 hover:border-emerald-300'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">
                {registryData.certificates.length}
              </div>
              <div className="text-xs text-slate-500 font-semibold">Certificates Issued</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-300/60">
          <button
            type="button"
            onClick={() => setActiveAdminTab('approvals')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeAdminTab === 'approvals'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#d9822b]" />
            <span>Payment Approvals</span>
            {pendingPayments.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                {pendingPayments.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('registry')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeAdminTab === 'registry'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Users className="w-4 h-4 text-blue-600" />
            <span>Student Registry &amp; Certificates</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
              {studentRows.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('issue')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeAdminTab === 'issue'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Direct Certificate Issuance</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all ${
            feedbackMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {feedbackMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
              <span>{feedbackMessage.text}</span>
            </div>
            <button type="button" onClick={() => setFeedbackMessage(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
          </div>
        )}

        {/* TAB 1: Payment Approvals Queue */}
        {activeAdminTab === 'approvals' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#d9822b] flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  <span>Pending UPI Verification Queue</span>
                </div>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">
                  Review &amp; Approve Student Payments
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cross-check the 12-digit UPI Transaction ID on your bank app / SMS, then click <strong>Approve</strong> to automatically enroll the student and dispatch the WhatsApp Batch Group invite.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search Transaction ID, student, phone..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d9822b] w-64"
                  />
                </div>

                <button
                  type="button"
                  onClick={loadData}
                  disabled={isLoading}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  title="Refresh Queue"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#d9822b]' : ''}`} />
                </button>
              </div>
            </div>

            {filteredPendingPayments.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900">All Caught Up!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  There are currently no pending payment approvals in the queue. New submissions will appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                      <th className="py-3.5 px-4 sm:px-6">Student Information</th>
                      <th className="py-3.5 px-4">Masterclass Program</th>
                      <th className="py-3.5 px-4">Amount Paid</th>
                      <th className="py-3.5 px-4">UPI Transaction ID</th>
                      <th className="py-3.5 px-4">Submitted At</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Approval Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredPendingPayments.map(p => (
                      <tr key={p.transactionId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 uppercase">
                              {p.studentName.slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{p.studentName}</div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span>{p.studentEmail}</span>
                              </div>
                              {p.studentPhone && (
                                <div className="text-[11px] text-emerald-700 font-mono flex items-center gap-1 mt-0.5">
                                  <Phone className="w-3 h-3 text-emerald-600" />
                                  <span>{p.studentPhone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-slate-800">
                          <div className="font-bold text-slate-900">{p.courseTitle}</div>
                          <span className="inline-block mt-0.5 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold">
                            Live Cohort Batch
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <div className="text-sm font-black text-[#d9822b]">
                            ₹{p.amount.toLocaleString('en-IN')}
                          </div>
                          {p.couponCode && (
                            <span className="inline-block text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-mono font-bold mt-0.5">
                              🎟️ {p.couponCode}
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs select-all">
                              {p.utrNumber}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyUtr(p.utrNumber)}
                              className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                              title="Copy UPI Transaction ID"
                            >
                              {copiedUtr === p.utrNumber ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-[11px] text-slate-500 font-mono">
                          {p.createdAt || 'Just now'}
                        </td>

                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleRejectPayment(p)}
                              disabled={isRejectingId === p.transactionId || isApprovingId === p.transactionId}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-2xs"
                              title="Reject submission"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleApprovePayment(p)}
                              disabled={isApprovingId === p.transactionId || isRejectingId === p.transactionId}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                            >
                              {isApprovingId === p.transactionId ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Enrolling...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Approve &amp; Enroll</span>
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Direct Issue Form Card */}
        {activeAdminTab === 'issue' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#d9822b] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>3-in-1 Credential Generator</span>
                </div>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">
                  Direct Certificate Issuance
                </h2>
              </div>
              <span className="text-[11px] text-slate-500">
                Awards Python, Visualization &amp; BI, and Flagship Professional credentials
              </span>
            </div>

            <form onSubmit={handleIssueCertificate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Student Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. student@gmail.com"
                  value={selectedStudentEmail}
                  onChange={e => setSelectedStudentEmail(e.target.value)}
                  list="registered-students-list"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d9822b]"
                />
                <datalist id="registered-students-list">
                  {registryData.students
                    .filter(s => s.role !== 'admin' && !ADMIN_EMAILS.includes(s.email?.toLowerCase()))
                    .map(s => (
                      <option key={s.id} value={s.email}>{s.name} ({s.email}{s.phone ? ` • 📱 ${s.phone}` : ''})</option>
                    ))}
                </datalist>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Accreditation Scope</label>
                <select
                  value={moduleScope}
                  onChange={e => setModuleScope(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d9822b]"
                >
                  <option value="all">🌟 All 3 Certificates (Full Suite)</option>
                  <option value="py">Module 1: Python Data Analytics</option>
                  <option value="viz">Module 2: Data Visualization &amp; BI</option>
                  <option value="pro">Module 3: Flagship Professional</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Course Program</label>
                <select
                  value={selectedCourseId}
                  onChange={e => setSelectedCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d9822b]"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Performance Grade</label>
                <select
                  value={grade}
                  onChange={e => setGrade(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d9822b]"
                >
                  <option value="Distinction">Distinction (Score ≥ 90%)</option>
                  <option value="High Honors">High Honors (Score ≥ 80%)</option>
                  <option value="Excellence">Excellence (Score ≥ 70%)</option>
                  <option value="Passed">Passed</option>
                </select>
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#d9822b] hover:bg-[#c87624] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Issue 3-in-1 Suite</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: Student Registry Table */}
        {activeAdminTab === 'registry' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#d9822b] flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>Student &amp; Certification Registry</span>
                </div>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">
                  Enrolled Students &amp; Issued 3-in-1 Suites
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name, email, phone..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d9822b] w-56"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setFilterStatus('all')}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                  >
                    All ({studentRows.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterStatus('pending')}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${filterStatus === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                  >
                    Uncertified ({studentRows.filter(r => r.totalIssuedCount === 0).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterStatus('issued')}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${filterStatus === 'issued' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                  >
                    Certified ({studentRows.filter(r => r.totalIssuedCount > 0).length})
                  </button>
                </div>

                <button
                  type="button"
                  onClick={loadData}
                  disabled={isLoading}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  title="Refresh Table"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#d9822b]' : ''}`} />
                </button>
              </div>
            </div>

            {filteredRows.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No students match the search filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                      <th className="py-3.5 px-4 sm:px-6">Student</th>
                      <th className="py-3.5 px-4">Enrolled Program</th>
                      <th className="py-3.5 px-4">M1: Python</th>
                      <th className="py-3.5 px-4">M2: Visualization</th>
                      <th className="py-3.5 px-4">M3: Flagship</th>
                      <th className="py-3.5 px-4">Suite Status</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredRows.map(row => (
                      <tr key={`${row.userId}-${row.courseId}`} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 uppercase">
                              {row.studentName.slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{row.studentName}</div>
                              <div className="text-[11px] text-slate-500">{row.studentEmail}</div>
                              {row.studentPhone && (
                                <div className="text-[11px] text-emerald-700 font-mono mt-0.5">
                                  📱 {row.studentPhone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-slate-700 font-semibold max-w-[200px] truncate">
                          {row.courseTitle}
                        </td>

                        <td className="py-4 px-4">
                          {row.pyCert ? (
                            <span 
                              onClick={() => setActiveCertificateModal(row.pyCert)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[#d9822b] rounded-lg font-mono text-[11px] font-bold cursor-pointer transition-colors"
                              title="View Certificate"
                            >
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>#{row.pyCert.certificate_number || row.pyCert.certificateNumber}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Not Issued</span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          {row.vizCert ? (
                            <span 
                              onClick={() => setActiveCertificateModal(row.vizCert)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg font-mono text-[11px] font-bold cursor-pointer transition-colors"
                              title="View Certificate"
                            >
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>#{row.vizCert.certificate_number || row.vizCert.certificateNumber}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Not Issued</span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          {row.proCert ? (
                            <span 
                              onClick={() => setActiveCertificateModal(row.proCert)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-lg font-mono text-[11px] font-bold cursor-pointer transition-colors"
                              title="View Certificate"
                            >
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>#{row.proCert.certificate_number || row.proCert.certificateNumber}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Not Issued</span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          {row.isFullyCertified ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] uppercase tracking-wider">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>3-in-1 Suite Active</span>
                            </span>
                          ) : row.totalIssuedCount > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px] uppercase tracking-wider">
                              <Clock className="w-3 h-3" />
                              <span>Partial ({row.totalIssuedCount}/3)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-bold text-[10px] uppercase tracking-wider">
                              <span>Pending</span>
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 sm:px-6 text-right">
                          {row.totalIssuedCount > 0 ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleRevokeAll(row.userId, row.courseId, row.studentName)}
                                className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                title="Revoke All 3 Certificates"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleQuickIssueAll(row.studentEmail, row.courseId)}
                              disabled={isSubmitting}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>Issue 3-in-1 Suite</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Change Admin Password</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsChangePasswordModalOpen(false);
                  setChangePasswordMsg(null);
                }}
                className="text-slate-400 hover:text-white cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            {changePasswordMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                changePasswordMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {changePasswordMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 py-2 bg-gradient-to-r from-[#d9822b] to-[#f5a623] hover:from-[#c87624] text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {isChangingPassword ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
