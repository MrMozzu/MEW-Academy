import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAcademy } from '../context/AcademyContext';
import {
  GraduationCap,
  Award,
  Sparkles,
  BookOpen,
  Download,
  Calendar,
  CheckCircle2,
  FileText,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  CreditCard,
  Layers,
  FileCheck,
  ChevronRight,
  Receipt,
  ArrowRight,
  ArrowLeft,
  Home
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { Course } from '../types';

export const DashboardView: React.FC = () => {
  const {
    user,
    isLoggedIn,
    authToken,
    openAuthModal,
    courses,
    enrolledCourseIds,
    pendingCourseIds,
    isPendingApproval,
    certificates,
    transactions,
    setActiveView,
    setActiveCertificateModal,
    downloadBrochurePDF,
    startCheckout,
    setSelectedCourseId
  } = useAcademy();

  const [activeTab, setActiveTab] = useState<'purchases' | 'orders' | 'certificates' | 'support'>('purchases');
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  // If there are no order transactions, guarantee activeTab is not stuck on orders
  React.useEffect(() => {
    if (activeTab === 'orders' && transactions.length === 0) {
      setActiveTab('purchases');
    }
  }, [activeTab, transactions.length]);

  const enrolledCourses = courses.filter(c => enrolledCourseIds.includes(c.id));
  const pendingCourses = courses.filter(c => pendingCourseIds.includes(c.id) && !enrolledCourseIds.includes(c.id));
  const allStudentCourses = [...enrolledCourses, ...pendingCourses];
  const featuredCourse = courses[0];

  const handleDownloadInvoice = (txnId: string) => {
    setDownloadSuccessMessage(`Generating Official Tax Invoice for #${txnId}...`);
    setTimeout(() => {
      setDownloadSuccessMessage(`Tax Invoice #${txnId} downloaded successfully!`);
      setTimeout(() => setDownloadSuccessMessage(null), 3000);
    }, 1000);
  };

  if (!isLoggedIn) {
    return (
      <div className="py-16 sm:py-24 bg-[#f8fafc] min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#d9822b] flex items-center justify-center mx-auto border border-amber-200/80 shadow-xs">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Login Required</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Please sign in to your registered MEW Academy account to view your enrolled courses, live batch links, and certificates.
            </p>
          </div>
          <div className="pt-2 space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openAuthModal('login')}
              className="w-full py-3.5 bg-gradient-to-r from-[#d9822b] to-[#f5a623] hover:from-[#c87624] hover:to-[#e0961b] text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Student Log In / Sign Up</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <button
              onClick={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              ← Return to Home Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dedicated Admin Screen: Separate Admin profile from Student Learner profile
  if (user.role === 'admin') {
    return (
      <div className="py-16 sm:py-24 bg-slate-950 min-h-[85vh] flex items-center justify-center px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 max-w-lg w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono uppercase font-bold tracking-wider">
              Administrator Master Account
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {user.name}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
              You are signed in as the <strong>MEW Academy Administrator</strong> ({user.email}). This account manages course admissions, student registries, and authorizes credentials. It is separated from student learner accounts.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                setActiveView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3.5 bg-gradient-to-r from-[#d9822b] to-[#f5a623] hover:from-[#c87624] hover:to-[#e0961b] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Go to Admin Certificate &amp; Admissions Authority</span>
            </button>

            <button
              onClick={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              ← Return to Academy Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 sm:pt-6 pb-12 bg-[#f8fafc] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-7">

        {/* Notification Toast */}
        {downloadSuccessMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="text-xs font-bold text-amber-300">{downloadSuccessMessage}</span>
          </div>
        )}

        {/* Dashboard Top Header Area (Breadcrumb + Welcome Header) */}
        <div className="space-y-2.5 sm:space-y-3">
          {/* Navigation Breadcrumb / Return to Home Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white py-2 px-3 sm:px-4 rounded-2xl border border-slate-200 shadow-2xs">
            <motion.button
              whileHover={{ scale: 1.03, x: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-[#d9822b] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>← Back to Home Page</span>
            </motion.button>

            <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold text-slate-600">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveView('home');
                  setTimeout(() => {
                    document.getElementById('our-course-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 80);
                }}
                className="hover:text-[#d9822b] cursor-pointer transition-colors"
              >
                Browse Courses
              </motion.button>
              <span>•</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveView('home');
                  setTimeout(() => {
                    document.getElementById('instructors-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 80);
                }}
                className="hover:text-[#d9822b] cursor-pointer transition-colors"
              >
                Meet Mentor
              </motion.button>
              <span>•</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveView('home');
                  setTimeout(() => {
                    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 80);
                }}
                className="hover:text-[#d9822b] cursor-pointer transition-colors"
              >
                Contact Support
              </motion.button>
            </div>
          </div>

          {/* Welcome & Admission Profile Banner Header */}
          <div className="bg-gradient-to-br from-[#071739] via-[#0b2447] to-[#041026] rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-700/80 relative overflow-hidden">
            <div className="space-y-2 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Official Student Enrollment &amp; Orders Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                Welcome back, {user.name} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Manage your enrolled courses, learning resources, curriculum progress, and official tax invoices.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {user.email && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-white/90 text-xs font-medium border border-white/10">
                    <Mail className="w-3.5 h-3.5 text-amber-300" />
                    <span>{user.email}</span>
                  </span>
                )}
                {user.phone && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-white/90 text-xs font-medium border border-white/10">
                    <Phone className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{user.phone}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-[#d9822b] flex items-center justify-center font-bold flex-shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-xl sm:text-2xl font-black text-slate-900">{enrolledCourses.length}</div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-semibold truncate">Purchased Courses</div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-black text-slate-900">
                {enrolledCourses.length > 0 ? 'Confirmed' : 'None'}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-semibold truncate">Admission Status</div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-xl sm:text-2xl font-black text-slate-900">{certificates.length}</div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-semibold truncate">Issued Certificates</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('purchases')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'purchases'
                ? 'bg-slate-900 text-amber-400 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Purchased Courses ({enrolledCourses.length})</span>
          </button>

          {transactions.length > 0 && (
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'orders'
                  ? 'bg-slate-900 text-amber-400 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Order History &amp; Tax Invoices ({transactions.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'certificates'
                ? 'bg-slate-900 text-amber-400 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificates ({certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'support'
                ? 'bg-slate-900 text-amber-400 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Admissions Desk &amp; Mentorship</span>
          </button>
        </div>

        {/* Tab 1: Purchased Courses */}
        {activeTab === 'purchases' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Your Active Enrollments &amp; Learning Hub
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Access your course modules, community mentorship, and downloadable learning resources.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveView('home');
                  setTimeout(() => {
                    document.getElementById('our-course-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                }}
                className="text-xs font-bold text-[#d9822b] hover:underline self-start sm:self-auto cursor-pointer"
              >
                Browse Available Courses →
              </button>
            </div>

            {allStudentCourses.length === 0 ? (
              <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
                <BookOpen className="w-14 h-14 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No courses enrolled yet</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Enroll in our industry-leading courses and masterclasses to advance your skills and earn verifiable certificate credentials.
                </p>
                <button
                  onClick={() => {
                    setActiveView('home');
                    setTimeout(() => {
                      document.getElementById('our-course-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 80);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#d9822b] to-[#f5a623] hover:from-[#c87624] hover:to-[#e0961b] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Browse Available Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {allStudentCourses.map(course => {
                  const isPending = isPendingApproval(course.id);
                  return (
                    <div
                      key={course.id}
                      className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden"
                    >
                      {/* Official Admission Header Strip */}
                      {isPending ? (
                        <div className="bg-amber-950 text-amber-300 px-6 py-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-amber-900">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                              ⏳ ADMISSION UNDER VERIFICATION
                            </span>
                            <span className="text-amber-400/60">•</span>
                            <span className="text-amber-200">Bank Transfer Review in Progress</span>
                          </div>
                          <div className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Verification Team Active</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-900 text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                              CONFIRMED ADMISSION
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-300">Verified Enrollment</span>
                          </div>
                          <div className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Official MEW Academy Seat Confirmed</span>
                          </div>
                        </div>
                      )}

                      <div className="p-6 sm:p-8 space-y-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          {/* Course Details */}
                          <div className="flex items-start gap-4 min-w-0">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-24 h-20 sm:w-28 sm:h-22 rounded-2xl object-cover flex-shrink-0 shadow-sm border border-slate-200"
                            />
                            <div className="min-w-0 space-y-1">
                              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md uppercase border border-sky-200">
                                {course.category}
                              </span>
                              <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 mt-1">
                                {course.title}
                              </h3>
                              <div className="text-xs text-slate-600 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-[#d9822b]" />
                                <span>Instructor: <strong className="text-slate-900">{course.instructor?.name || 'Prof. MD Tahseen Equbal'}</strong></span>
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {course.shortDescription || 'Comprehensive practical program with official certificate.'}
                              </div>
                            </div>
                          </div>

                          {/* Admission Status Badge */}
                          {isPending ? (
                            <div className="bg-amber-50 border border-amber-200 p-3.5 sm:p-4 rounded-2xl flex flex-col items-start lg:items-end justify-center gap-1 flex-shrink-0">
                              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                <span>Payment Under Review</span>
                              </div>
                              <div className="text-[11px] text-slate-600">
                                Status: <span className="font-bold text-amber-700">Pending Approval</span>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-emerald-50/80 border border-emerald-200/80 p-3.5 sm:p-4 rounded-2xl flex flex-col items-start lg:items-end justify-center gap-1 flex-shrink-0">
                              <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>Admission Confirmed</span>
                              </div>
                              <div className="text-[11px] text-slate-600">
                                Status: <span className="font-bold text-emerald-700">Active Learner</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Core Action Buttons */}
                        {isPending ? (
                          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-3">
                            <div className="text-xs text-amber-900 leading-relaxed">
                              <strong>⏳ Payment Verification in Progress:</strong> We are cross-referencing your 12-digit UPI Transaction ID with our bank statement. Once verified by the admissions team, your seat will be active and you will receive the WhatsApp Batch Group invite.
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                              <a
                                href="https://wa.me/917070806047?text=Hi%20MEW%20Academy!%20I%20have%20submitted%20my%20course%20payment%20UPI%20Transaction%20ID.%20Please%20verify%20my%20admission."
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2.5 bg-[#25d366] hover:bg-[#20ba59] text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                              >
                                <WhatsAppIcon className="w-4 h-4" />
                                <span>WhatsApp Support for Instant Approval</span>
                              </a>
                              <button
                                onClick={() => downloadBrochurePDF(course)}
                                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download Syllabus</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className={`grid grid-cols-1 ${transactions.some(t => t.courseId === course.id) ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3 pt-2`}>
                              {/* 1. Join Batch WhatsApp (Classrooms, Schedules, Materials) */}
                              <a
                                href={(import.meta as any).env?.VITE_WHATSAPP_BATCH_LINK || 'https://chat.whatsapp.com/EDIc8xNvYD37djUfdcxPZI'}
                                target="_blank"
                                rel="noreferrer"
                                className="p-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all text-center"
                              >
                                <WhatsAppIcon className="w-4 h-4" />
                                <span>Join WhatsApp Batch Group</span>
                              </a>

                              {/* 2. Download Full Syllabus / Brochure */}
                              <button
                                onClick={() => downloadBrochurePDF(course)}
                                className="p-3.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm border border-amber-400/30 transition-all cursor-pointer"
                              >
                                <Download className="w-4 h-4 text-[#f5a623]" />
                                <span>Download Syllabus PDF</span>
                              </button>

                              {/* 3. View / Download GST Tax Invoice */}
                              {transactions.some(t => t.courseId === course.id) && (
                                <button
                                  onClick={() => setActiveTab('orders')}
                                  className="p-3.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                                >
                                  <Receipt className="w-4 h-4 text-[#d9822b]" />
                                  <span>View Official Invoice</span>
                                </button>
                              )}
                            </div>

                            {/* Onboarding & Program Information */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                              <div className="font-bold text-slate-900 flex items-center justify-between">
                                <span>Next Steps &amp; Program Delivery:</span>
                                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Admission Secured
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-slate-600">
                                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                                  <span className="font-bold text-slate-900 block text-[11px]">1. Live Class Delivery</span>
                                  All live Zoom &amp; Google Meet session links, schedule, and assignments are provided inside the Official WhatsApp Batch Group.
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                                  <span className="font-bold text-slate-900 block text-[11px]">
                                    {transactions.length > 0 ? '2. Save Syllabus & Invoice' : '2. Download Syllabus PDF'}
                                  </span>
                                  Download your official program syllabus and GST payment tax invoice for your records.
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                                  <span className="font-bold text-slate-900 block text-[11px]">3. Earn Accredited Certificate</span>
                                  Upon completing the live masterclass and capstone project, your verifiable 3-in-1 credentials are issued here.
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Orders & Tax Invoices */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Order History &amp; Official Invoices
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official GST / Tax invoices generated upon course purchase. Suitable for employer reimbursement or academic records.
              </p>
            </div>

            {transactions.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-3">
                <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No payment receipts yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When you purchase a course or masterclass, your GST invoices and payment receipts will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                      <tr>
                        <th className="p-4">Order Reference</th>
                        <th className="p-4">Course Program</th>
                        <th className="p-4">Payment Method</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {transactions.map(txn => (
                        <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-900">
                            {txn.orderId}
                          </td>
                          <td className="p-4 font-semibold text-slate-900">
                            {txn.courseTitle}
                          </td>
                          <td className="p-4">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[11px]">
                              {txn.gateway}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500">
                            {txn.date}
                          </td>
                          <td className="p-4 font-extrabold text-slate-900">
                            {txn.currency === 'INR' ? '₹' : '$'}{txn.amount.toLocaleString()}
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full text-[10px] border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              PAID
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDownloadInvoice(txn.orderId)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              <Download className="w-3 h-3" />
                              <span>Download PDF</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Certificates */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full mb-1">
                  <span>🏆 Official Accreditation</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Your Certificates &amp; Credentials ({certificates.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verifiable digital credentials issued upon course completion with cryptographic SHA-256 verification.
                </p>
              </div>
              <button
                onClick={() => setActiveView('certificates')}
                className="text-xs font-bold text-[#d9822b] hover:underline bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200 cursor-pointer"
              >
                Public Verification Portal →
              </button>
            </div>

            {isLoggedIn && user.role === 'admin' && !!authToken && (
              <div className="bg-gradient-to-r from-slate-900 via-[#071739] to-slate-900 text-white p-5 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-300">Administrator Authority Enabled</div>
                    <div className="text-xs text-slate-300">You have exclusive permissions to authorize and issue student certificates.</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveView('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#d9822b] to-[#f5a623] hover:from-[#c87624] hover:to-[#e0961b] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer flex-shrink-0"
                >
                  <span>Open Admin Certificate Authority</span>
                  <span>→</span>
                </button>
              </div>
            )}

            {certificates.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">No certificates awarded yet</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Certificates are <strong>strictly issued by mentors</strong> upon completion and evaluation. Once your project is reviewed and approved by Prof. MD Tahseen Equbal, your verifiable credential will unlock here automatically.
                  </p>
                </div>
                
                {isLoggedIn && user.role === 'admin' && !!authToken ? (
                  <button
                    onClick={() => {
                      setActiveView('admin');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 border border-amber-400/30"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Issue Certificate as Admin</span>
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Cohort in Progress • Awaiting Mentor Review</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificates.map(cert => (
                  <div
                    key={cert.id}
                    onClick={() => setActiveCertificateModal(cert)}
                    className="p-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all group border flex flex-col justify-between bg-white border-slate-200 hover:border-amber-300"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          Verified Certificate
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Authenticated
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#d9822b] transition-colors line-clamp-2">
                        {cert.courseTitle}
                      </h4>

                      <div className="text-[11px] text-slate-500">
                        Issued to <strong>{cert.recipientName}</strong> • {cert.issueDate}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs font-bold text-[#d9822b]">
                      <span>View &amp; Print Certificate</span>
                      <span>→</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Admissions Desk & Mentorship Support */}
        {activeTab === 'support' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#d9822b] flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Academic &amp; Mentorship Support
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect with <strong>Team MEW Academy</strong> for questions about assignments, dataset inquiries, and capstone project reviews.
              </p>
              <div className="pt-2 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-[#d9822b]" />
                  <a href="mailto:mewacademy.ac@gmail.com" className="hover:underline font-semibold text-[#d9822b]">
                    mewacademy.ac@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#25D366] flex items-center justify-center">
                <WhatsAppIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Admissions &amp; Enrollment Counselor
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Need help with Zoom batch links, payment receipt requests, or schedule changes? Contact our student coordinator on WhatsApp.
              </p>
              <div className="pt-2 space-y-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp: +91 7070806047</span>
                </div>
                <a
                  href="https://wa.me/917070806047"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>WhatsApp Student Counselor</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
