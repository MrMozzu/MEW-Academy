import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { 
  Star, 
  Clock, 
  Layers, 
  Award, 
  Infinity as InfinityIcon, 
  CheckCircle2, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Download, 
  Share2, 
  Lock, 
  Unlock,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

export const CourseDetailView: React.FC = () => {
  const { 
    selectedCourseId, 
    courses, 
    setActiveView, 
    startCheckout, 
    openCoursePlayer, 
    isEnrolled, 
    currency,
    getCourseProgress,
    openBrochure,
    downloadBrochurePDF
  } = useAcademy();

  const [expandedModuleId, setExpandedModuleId] = useState<string>('mod-1');

  const course = courses.find(c => c.id === selectedCourseId) || courses[0];
  const enrolled = isEnrolled(course.id);
  const progress = getCourseProgress(course.id);

  const toggleModule = (id: string) => {
    setExpandedModuleId(prev => prev === id ? '' : id);
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <button
          onClick={() => setActiveView('courses')}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Courses</span>
        </button>

        {/* Hero Top Card */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden mb-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              {/* Badge */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {course.category}
                </span>
                {course.tag && (
                  <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {course.tag}
                  </span>
                )}
                <span className="text-slate-400 text-xs font-medium">
                  Last updated February 2026
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {course.fullDescription}
              </p>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{course.rating}</span>
                  <span className="text-slate-400">({course.reviewsCount} verified reviews)</span>
                </div>
                <div>•</div>
                <div>{course.durationHours} Hours On-Demand</div>
                <div>•</div>
                <div>{course.totalLessons} Lessons & Labs</div>
                <div>•</div>
                <div>{course.level}</div>
              </div>

              {/* Instructor profile */}
              <div className="flex items-center gap-3 pt-3">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                />
                <div>
                  <div className="text-xs text-slate-400">Created by</div>
                  <div className="text-sm font-bold text-white">
                    {course.instructor.name} ({course.instructor.title})
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card / Enrollment Box */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 text-slate-900 shadow-xl border border-slate-100">
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-slate-900 group">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-amber-300 font-bold text-[10px] uppercase px-2.5 py-1 rounded-md border border-amber-400/40">
                  Online Live Masterclass
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900">
                    ₹{course.priceINR.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-slate-400 line-through">
                    ₹{course.originalPriceINR.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                    50% OFF
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  or ${course.priceUSD} USD (International Students)
                </div>
                <p className="text-[11px] text-amber-700 font-semibold mt-1">
                  ⚡ 1-Month Live Cohort • Official MEW Certification included
                </p>
              </div>

              {/* Main Action Button */}
              {enrolled ? (
                <div className="space-y-2 mb-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                    <div className="text-xs font-bold text-emerald-900 mb-0.5">
                      ✓ Confirmed Live Batch Admission
                    </div>
                    <div className="text-[11px] text-emerald-700 font-semibold">
                      Live Weekend Cohort #14 • Sat &amp; Sun 10:00 AM IST
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveView('dashboard')}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-sm rounded-xl shadow-lg border border-amber-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-[#f5a623]" />
                    <span>View Batch Links &amp; Admission Portal</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  <button
                    onClick={() => startCheckout(course)}
                    className="w-full py-3.5 bg-gradient-to-r from-[#d9822b] to-[#f5a623] hover:from-[#c87624] hover:to-[#e0961b] text-white font-black text-sm rounded-xl shadow-lg shadow-amber-950/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    id="checkout-course-detail-btn"
                  >
                    <span>Enroll Now • Reserve Live Batch Seat</span>
                  </button>

                  <button
                    onClick={() => openBrochure(course)}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#d9822b]" />
                    <span>Download Program Syllabus (PDF)</span>
                  </button>
                </div>
              )}

              {/* Guarantees */}
              <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>30-Day Money-Back Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Verified Industry Certification</span>
                </div>
                <div className="flex items-center gap-2">
                  <InfinityIcon className="w-4 h-4 text-slate-500" />
                  <span>Full Lifetime Access on Mobile & Desktop</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Body Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: What you'll learn, Syllabus, Requirements, Reviews */}
          <div className="lg:col-span-8 space-y-8">
            {/* Skills & Outcomes */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                What You Will Master in This Course
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.skillsGained.map((skill, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3-Certificate Accreditation Bundle */}
            <div className="bg-gradient-to-br from-[#071739] via-[#0b2447] to-[#041026] text-white p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-xl space-y-4">
              <div className="pb-3 border-b border-slate-700">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
                  🏆 3 ACCREDITED CERTIFICATES INCLUDED
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  Recommended Certificate Structure
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Cert 1 */}
                <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-2xl space-y-2">
                  <span className="text-[10px] font-black uppercase text-sky-300 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                    Certificate 1
                  </span>
                  <h3 className="text-sm font-bold text-white">Certificate in Python for Data Analytics</h3>
                  <p className="text-[11px] text-slate-300 font-mono">
                    <strong className="text-slate-400 font-sans">Covers:</strong> Python • NumPy • Pandas
                  </p>
                  <p className="text-[10px] text-slate-400 pt-1">Foundational &amp; Advanced Data Wrangling</p>
                </div>

                {/* Cert 2 */}
                <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-2xl space-y-2">
                  <span className="text-[10px] font-black uppercase text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                    Certificate 2
                  </span>
                  <h3 className="text-sm font-bold text-white">Certificate in Data Visualization &amp; BI</h3>
                  <p className="text-[11px] text-slate-300 font-mono">
                    <strong className="text-slate-400 font-sans">Covers:</strong> Matplotlib • Seaborn • Excel • Power BI
                  </p>
                  <p className="text-[10px] text-slate-400 pt-1">Exploratory Visual Storytelling &amp; Dashboards</p>
                </div>

                {/* Cert 3 Flagship */}
                <div className="bg-gradient-to-b from-amber-950/80 to-slate-900 border-2 border-amber-400 p-4 rounded-2xl space-y-2 shadow-md relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-700">
                      Certificate 3 • Flagship 🏆
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-amber-300">Professional Certificate in Data Analytics</h3>
                  <p className="text-[11px] text-amber-100 font-mono">
                    <strong className="text-amber-400/80 font-sans">Covers:</strong> Python • NumPy • Pandas • Visualization • Excel • Power BI • Projects
                  </p>
                  <p className="text-[10px] text-amber-200/80 font-bold pt-1">Full-Stack Program Credential</p>
                </div>
              </div>
            </div>

            {/* Interactive Syllabus Accordion */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Comprehensive Course Curriculum
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {course.modules.length} Modules • {course.totalLessons} Lessons • Interactive Quizzes & Projects
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {course.modules.map((mod, modIdx) => {
                  const isExpanded = expandedModuleId === mod.id;
                  return (
                    <div 
                      key={mod.id} 
                      className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                    >
                      {/* Module Header */}
                      <button
                        onClick={() => toggleModule(mod.id)}
                        className="w-full p-4 sm:p-5 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between text-left transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                            {modIdx + 1}
                          </div>
                          <div>
                            <h3 className="text-sm sm:text-base font-bold text-slate-900">
                              {mod.title}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {mod.lessons.length} Lessons • {mod.description}
                            </p>
                          </div>
                        </div>

                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                        )}
                      </button>

                      {/* Module Lessons List */}
                      {isExpanded && (
                        <div className="divide-y divide-slate-100 bg-white p-2">
                          {mod.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="p-3 sm:p-4 hover:bg-amber-50/40 rounded-xl flex items-center justify-between gap-4 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-6 h-6 rounded-full bg-amber-50 text-[#d9822b] flex items-center justify-center font-bold text-xs flex-shrink-0">
                                  <BookOpen className="w-3 h-3" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                                    {lesson.title}
                                  </div>
                                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                    {lesson.summary}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                                  {lesson.duration}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Prerequisites & Requirements
              </h2>
              <ul className="space-y-2">
                {course.prerequisites.map((req, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Student Reviews */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Student Feedback & Ratings
              </h2>
              <div className="space-y-4">
                {course.reviews.map(rev => (
                  <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <img src={rev.avatar} alt={rev.userName} className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <div className="text-sm font-bold text-slate-900">{rev.userName}</div>
                          <div className="text-xs text-slate-500">{rev.userRole}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Instructor Credentials & FAQs */}
          <div className="lg:col-span-4 space-y-6">
            {/* Instructor Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Lead Instructor
              </div>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{course.instructor.name}</h3>
                  <p className="text-xs font-semibold text-blue-600">{course.instructor.title}</p>
                  <p className="text-[11px] text-slate-500">{course.instructor.company}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {course.instructor.bio}
              </p>
              <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 p-3 rounded-xl text-xs">
                <div>
                  <div className="font-extrabold text-slate-900">{course.instructor.rating} ⭐</div>
                  <div className="text-[10px] text-slate-400">Instructor Rating</div>
                </div>
                <div>
                  <div className="font-extrabold text-slate-900">{course.instructor.studentsCount.toLocaleString()}+</div>
                  <div className="text-[10px] text-slate-400">Graduates</div>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Frequently Asked Questions
              </div>
              <div className="space-y-4">
                {course.faqs.map((faq, i) => (
                  <div key={i} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <h4 className="text-xs font-bold text-slate-900 mb-1">
                      {faq.question}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
