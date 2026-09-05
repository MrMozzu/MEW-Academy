import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { motion } from 'motion/react';
import { 
  Clock, 
  Layers, 
  Award, 
  ArrowRight,
  Video,
  Sparkles,
  Calendar,
  HelpCircle,
  GraduationCap,
  Download,
  FileText,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const FeaturedCourseSection: React.FC = () => {
  const { 
    courses, 
    startCheckout, 
    isEnrolled,
    openBrochure,
    downloadBrochurePDF,
    setActiveView
  } = useAcademy();

  const featuredCourse = courses.find(c => c.id === 'course-data-analytics') || courses[0];
  const enrolled = isEnrolled(featuredCourse?.id || '');

  const featureBadges = [
    { icon: Video, label: 'Online Live', color: 'text-sky-400', bg: 'hover:border-sky-400/50' },
    { icon: Calendar, label: '1 Month', color: 'text-amber-400', bg: 'hover:border-amber-400/50' },
    { icon: Clock, label: 'Weekend Batches', color: 'text-emerald-400', bg: 'hover:border-emerald-400/50' },
    { icon: Layers, label: '3 Real Datasets', color: 'text-purple-400', bg: 'hover:border-purple-400/50' },
    { icon: Award, label: 'Certificate', color: 'text-[#f5a623]', bg: 'hover:border-amber-400/50' },
    { icon: HelpCircle, label: 'Doubt Solving', color: 'text-rose-400', bg: 'hover:border-rose-400/50' }
  ];

  return (
    <section id="our-course-section" className="py-8 sm:py-10 bg-[#f8fafc] relative z-20 scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Masterclass Card - Compact & Balanced with Animated Sheen */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-br from-[#071739] via-[#0b2447] to-[#041026] text-white rounded-2xl sm:rounded-3xl border border-slate-700/80 shadow-2xl p-5 sm:p-7 md:p-8 relative overflow-hidden group"
        >
          {/* Animated Ambient Glow in background */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.12, 0.25, 0.12]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-80 h-80 bg-[#f5a623]/15 rounded-full blur-3xl pointer-events-none"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-0 left-0 w-72 h-72 bg-sky-500/15 rounded-full blur-3xl pointer-events-none"
          />

          <div className="relative z-10 space-y-5">
            
            {/* Top Bar: Live Tag + Instructor */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
              <div className="flex items-center gap-2.5">
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1 rounded-full bg-[#f5a623] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  <span>1-MONTH ONLINE LIVE</span>
                </motion.span>
                <span className="text-xs text-slate-300 font-semibold hidden sm:inline">
                  EDA Masterclass &amp; Live Analytics
                </span>
              </div>

              {/* Prof. MD Tahseen Equbal Badge */}
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-2 bg-slate-800/90 border border-amber-400/40 px-3 py-1.5 rounded-xl shadow-xs"
              >
                <GraduationCap className="w-4 h-4 text-[#f5a623]" />
                <div className="text-left">
                  <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider leading-none">Course Director</div>
                  <div className="text-xs font-bold text-amber-300 leading-tight">Prof. MD Tahseen Equbal</div>
                </div>
              </motion.div>
            </div>

            {/* Course Title + Description */}
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                <span className="text-[#f5a623]">EDA</span>{' '}
                <span className="text-white">(Exploratory Data Analysis)</span>
              </h2>
              <div className="text-xs sm:text-sm font-bold text-sky-400 tracking-wide flex items-center gap-2">
                <span>COMPLETE COURSE PLAN — From Basics to Insights</span>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse hidden sm:inline-block"></span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed pt-0.5">
                Learn to clean, analyze, visualize, and extract business insights using <strong className="text-amber-300 font-semibold">Python, NumPy, Pandas, Matplotlib, Seaborn, Excel</strong> &amp; bonus Power BI module.
              </p>
            </div>

            {/* 3 Certificates Highlight Banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 border border-amber-400/30 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-[#f5a623]">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">3-IN-1 ACCREDITATION BUNDLE</span>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    Earn 3 Industry-Recognized Certificates from One Single Course
                  </h3>
                </div>
              </div>

              {/* 3 Certificate Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {/* Cert 1 */}
                <div className="bg-slate-900/90 border border-slate-700/80 hover:border-amber-400/50 p-3.5 rounded-xl transition-all space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/60">CERTIFICATE 1</span>
                    <span className="text-xs">🐍</span>
                  </div>
                  <div className="text-sm font-bold text-white">Python Data Analytics</div>
                  <div className="text-[11px] text-slate-300 font-mono">
                    <strong className="text-slate-400 font-sans">Covers:</strong> Python • NumPy • Pandas
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1">Core Data Wrangling & Manipulation</div>
                </div>

                {/* Cert 2 */}
                <div className="bg-slate-900/90 border border-slate-700/80 hover:border-amber-400/50 p-3.5 rounded-xl transition-all space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/60">CERTIFICATE 2</span>
                    <span className="text-xs">📊</span>
                  </div>
                  <div className="text-sm font-bold text-white">Data Visualization & BI</div>
                  <div className="text-[11px] text-slate-300 font-mono">
                    <strong className="text-slate-400 font-sans">Covers:</strong> Matplotlib • Seaborn • Excel • Power BI
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1">Visual Analytics & Storytelling</div>
                </div>

                {/* Cert 3 (Flagship) */}
                <div className="bg-gradient-to-br from-amber-950/70 to-slate-900 border-2 border-amber-400/70 hover:border-amber-300 p-3.5 rounded-xl transition-all space-y-1.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/40">CERTIFICATE 3 • FLAGSHIP</span>
                    <span className="text-xs">🏆</span>
                  </div>
                  <div className="text-sm font-black text-amber-300">Professional Data Analytics</div>
                  <div className="text-[11px] text-amber-200/90 font-mono">
                    <strong className="text-amber-400/80 font-sans">Covers:</strong> Python • NumPy • Pandas • Visualization • Excel • Power BI • Projects
                  </div>
                  <div className="text-[10px] text-amber-200/70 pt-1">Full-Stack Data Analytics Program</div>
                </div>
              </div>
            </div>

            {/* 6 Quick Badges in Compact Grid with Staggered Hover Lifts */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
              {featureBadges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`bg-slate-800/70 border border-slate-700/80 px-2.5 py-2 rounded-xl flex items-center gap-2 transition-all ${badge.bg} shadow-2xs cursor-default`}
                  >
                    <Icon className={`w-4 h-4 ${badge.color} flex-shrink-0`} />
                    <span className="text-xs font-medium text-slate-200 truncate">{badge.label}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Action Buttons & Pricing Bar */}
            <div className="pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-slate-400">Launch Price:</span>
                <span className="text-xl sm:text-2xl font-black text-white">₹{featuredCourse ? featuredCourse.priceINR.toLocaleString('en-IN') : '1,599'}</span>
                <span className="text-xs text-slate-400 line-through">₹{featuredCourse ? featuredCourse.originalPriceINR.toLocaleString('en-IN') : '2,999'}</span>
                
                {/* 50% OFF Pill with Pulse Animation */}
                <motion.span 
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full shadow-xs"
                >
                  50% OFF
                </motion.span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => openBrochure(featuredCourse)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-bold text-xs sm:text-sm rounded-xl border border-amber-400/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  id="download-brochure-featured-btn"
                >
                  <Download className="w-3.5 h-3.5 text-[#f5a623]" />
                  <span>Download Brochure</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    if (enrolled) {
                      setActiveView('dashboard');
                    } else if (featuredCourse) {
                      startCheckout(featuredCourse);
                    }
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-[#d9822b] to-[#f5a623] hover:from-[#c87624] hover:to-[#e0961b] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-950/40 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  id="enroll-now-eda-poster-btn"
                >
                  <span>{enrolled ? 'View Live Batch Portal' : 'Enroll Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

