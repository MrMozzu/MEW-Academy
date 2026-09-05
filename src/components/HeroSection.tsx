import React, { useState, useEffect } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { motion } from 'motion/react';
import { 
  UserCheck, 
  Star, 
  Trophy, 
  ArrowRight,
  Sparkles,
  Users,
  Award,
  Briefcase,
  GraduationCap,
  Layers,
  BarChart3,
  PieChart,
  CheckCircle2,
  Flame,
  Radio,
  Zap,
  BookOpen,
  Code2,
  Phone
} from 'lucide-react';
import { CinematicIntroVideo } from './CinematicIntroVideo';
import { HeroVideoBackground } from './HeroVideoBackground';

export const HeroSection: React.FC = () => {
  const { setActiveView, courses } = useAcademy();
  const [activeSessionCount, setActiveSessionCount] = useState(18650);

  // Subtle live counter heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSessionCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#06142a] text-white pt-8 sm:pt-14 pb-20 sm:pb-24">
      {/* 10-Second Cinematic Brand Video Background Layer */}
      <HeroVideoBackground />

      {/* Dynamic Background Ambient Glowing Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          x: [0, 20, 0],
          y: [0, -15, 0],
          opacity: [0.15, 0.28, 0.15]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[550px] h-[550px] bg-blue-600/25 rounded-full blur-[130px] pointer-events-none -mr-32 -mt-32"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, -25, 0],
          y: [0, 20, 0],
          opacity: [0.12, 0.22, 0.12]
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 left-0 w-[480px] h-[480px] bg-amber-500/20 rounded-full blur-[110px] pointer-events-none -ml-24"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.08, 0.16, 0.08]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 right-1/4 w-[380px] h-[380px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Subtle Floating Starlight Dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: '15%', left: '10%', delay: 0, duration: 4 },
          { top: '25%', left: '85%', delay: 1.2, duration: 5 },
          { top: '65%', left: '18%', delay: 2.4, duration: 4.5 },
          { top: '75%', left: '78%', delay: 0.8, duration: 6 },
          { top: '40%', left: '48%', delay: 1.8, duration: 5.2 }
        ].map((star, idx) => (
          <motion.div
            key={idx}
            style={{ top: star.top, left: star.left }}
            animate={{
              opacity: [0.2, 0.9, 0.2],
              scale: [0.8, 1.3, 0.8],
              y: [0, -10, 0]
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: star.delay
            }}
            className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047]"
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Hero Copy & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-5 sm:space-y-6 text-left"
          >
            {/* "WELCOME TO MEW ACADEMY" */}
            <motion.div 
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/40 shadow-[0_0_20px_rgba(245,166,35,0.25)] select-none"
            >
              <span className="w-2 h-2 rounded-full bg-[#f5a623] animate-pulse"></span>
              <span className="text-[#f5a623] font-black text-xs sm:text-sm tracking-widest uppercase">
                WELCOME TO MEW ACADEMY
              </span>
            </motion.div>

            {/* Main Headline: MEW Academy with Subtle Glowing Shimmer */}
            <motion.h1 
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]"
            >
              <motion.span 
                className="text-[#f5a623] inline-block hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_25px_rgba(245,166,35,0.35)]"
              >
                MEW
              </motion.span>{' '}
              <span className="text-white">Academy</span>
            </motion.h1>

            {/* Motto Subheading: Make. Explore. Win. with Staggered Glows */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5"
            >
              <motion.span 
                whileHover={{ scale: 1.08 }}
                className="text-[#f5a623] cursor-default transition-all"
              >
                Make.
              </motion.span>{' '}
              <motion.span 
                whileHover={{ scale: 1.08 }}
                className="text-[#38bdf8] cursor-default transition-all"
              >
                Explore.
              </motion.span>{' '}
              <motion.span 
                whileHover={{ scale: 1.08 }}
                className="text-[#c084fc] cursor-default transition-all"
              >
                Win.
              </motion.span>
            </motion.div>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-xl font-normal leading-relaxed"
            >
              Your journey to a smarter future starts here. Learn from industry experts and become job-ready with our practical, project-driven courses.
            </motion.p>

            {/* Action Buttons with Interactive Physics */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1"
            >
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  const el = document.getElementById('our-course-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    setActiveView('courses');
                  }
                }}
                className="px-6 sm:px-7 py-3 sm:py-3.5 bg-gradient-to-r from-[#d9822b] to-[#f5a623] hover:from-[#c87624] hover:to-[#e0961b] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-lg shadow-amber-950/50 flex items-center gap-2 cursor-pointer group"
                id="explore-course-hero-btn"
              >
                <span>Explore Course</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  const el = document.getElementById('contact-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="px-5 sm:px-6 py-3 sm:py-3.5 bg-slate-800/80 hover:bg-slate-700 text-amber-300 font-semibold text-sm sm:text-base rounded-xl border border-amber-400/50 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                id="hero-contact-us-btn"
              >
                <Phone className="w-4 h-4 text-[#f5a623]" />
                <span>Contact Us</span>
              </motion.button>
            </motion.div>

            {/* 3 Feature Badges in dark container with interactive hover */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="pt-3"
            >
              <div className="inline-flex flex-wrap items-center gap-4 sm:gap-6 bg-[#091b35]/90 backdrop-blur-md border border-slate-700/70 rounded-2xl px-4 sm:px-5 py-3 shadow-lg">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 cursor-default"
                >
                  <span className="text-[#f5a623] text-lg">👤</span>
                  <div className="text-xs sm:text-sm font-bold text-slate-100">
                    Expert-Led Learning
                  </div>
                </motion.div>

                <div className="w-[1px] h-4 bg-slate-700 hidden sm:block"></div>

                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 cursor-default"
                >
                  <span className="text-[#f5a623] text-lg">💼</span>
                  <div className="text-xs sm:text-sm font-bold text-slate-100">
                    Career-Ready Skills
                  </div>
                </motion.div>

                <div className="w-[1px] h-4 bg-slate-700 hidden sm:block"></div>

                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setActiveView('certificates')}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-[#f5a623] text-lg">🏅</span>
                  <div className="text-xs sm:text-sm font-bold text-slate-100 hover:text-amber-300 transition-colors">
                    Industry-Recognized Certificates
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: 3D Visual Composition with Interactive Floating Badges & Motion */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative flex items-center justify-center mt-6 lg:mt-0"
          >
            {/* Glowing Golden Orbital Rings in background with gentle rotation */}
            <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full border-2 border-amber-400/30 blur-[1px] pointer-events-none -right-4 -top-8 animate-spin-slow"></div>
            <div className="absolute w-80 sm:w-[420px] h-80 sm:h-[420px] rounded-full border border-blue-400/20 blur-[2px] pointer-events-none right-4 top-2 animate-pulse-glow"></div>

            {/* Interactive Floating Pill Badge: Python & Pandas (Top Right) */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                x: [0, 4, 0]
              }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.1, zIndex: 40 }}
              className="absolute -top-6 right-2 sm:right-6 z-30 bg-[#0c244d]/95 backdrop-blur-md border border-sky-400/50 rounded-xl px-3 py-1.5 shadow-xl flex items-center gap-2 text-xs font-bold text-sky-200 select-none cursor-pointer"
            >
              <span className="text-base">🐍</span>
              <span>Python &amp; Pandas</span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
            </motion.div>

            {/* Interactive Floating Pill Badge: Live Doubt Solving (Mid Left) */}
            <motion.div
              animate={{
                y: [0, 8, 0],
                x: [0, -3, 0]
              }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              whileHover={{ scale: 1.1, zIndex: 40 }}
              className="absolute top-1/2 -left-4 sm:-left-8 z-30 bg-[#091b35]/95 backdrop-blur-md border border-amber-400/50 rounded-xl px-3 py-1.5 shadow-xl flex items-center gap-2 text-xs font-bold text-amber-200 select-none cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Live Doubt Solving</span>
            </motion.div>

            {/* Main Visual Container */}
            <div className="relative w-full max-w-[540px]">
              
              {/* Floating Mortarboard / Graduation Cap with Physics Motion */}
              <motion.div 
                animate={{ 
                  y: [0, -12, 0],
                  rotate: [-12, -7, -12]
                }}
                transition={{ 
                  duration: 4.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                whileHover={{ scale: 1.15, rotate: 0 }}
                className="absolute -top-12 left-4 sm:left-10 z-30 drop-shadow-2xl select-none cursor-pointer"
              >
                <div className="relative">
                  <div className="w-24 sm:w-32 h-24 sm:h-32 relative flex items-center justify-center">
                    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_15px_15px_rgba(0,0,0,0.7)]">
                      {/* Cap Top Rhombus Diamond */}
                      <polygon points="60,10 115,35 60,60 5,35" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                      <polygon points="60,15 105,35 60,55 15,35" fill="#0f172a" />
                      {/* Skull cap under */}
                      <path d="M30,42 L30,68 C30,82 90,82 90,68 L90,42" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                      {/* Golden Button & Tassel */}
                      <circle cx="60" cy="35" r="3.5" fill="#f59e0b" />
                      <path d="M60,35 Q78,48 76,70" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
                      <rect x="73" y="70" width="6" height="12" rx="2" fill="#d97706" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Photorealistic 4K Cinematic Intro Video Player */}
              <div className="relative w-full z-10">
                <CinematicIntroVideo />
              </div>

              {/* Stack of Hardcover Books (Blue & Gold) on bottom-left */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                whileHover={{ scale: 1.1, rotate: -2 }}
                className="absolute -bottom-6 -left-4 sm:-left-6 z-20 select-none drop-shadow-2xl cursor-pointer"
              >
                <div className="flex flex-col items-center">
                  {/* Top Book (Blue) */}
                  <div className="w-20 sm:w-28 h-5 sm:h-6 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 rounded-md border-l-4 border-amber-400 shadow-md flex items-center justify-center px-2">
                    <span className="text-[7px] sm:text-[9px] font-bold text-white tracking-wider">AI</span>
                  </div>
                  {/* Bottom Book (Gold/Yellow) */}
                  <div className="w-24 sm:w-32 h-6 sm:h-7 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-md border-l-4 border-slate-900 shadow-lg -mt-1 flex items-center justify-center px-2">
                    <span className="text-[8px] sm:text-[10px] font-black text-slate-950 tracking-wider">RESEARCH</span>
                  </div>
                </div>
              </motion.div>

              {/* Golden 3D Winner's Trophy on bottom-right */}
              <motion.div 
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                whileHover={{ scale: 1.12, rotate: 6 }}
                className="absolute -bottom-6 -right-3 sm:-right-6 z-20 select-none drop-shadow-2xl cursor-pointer"
              >
                <div className="w-16 sm:w-22 h-24 sm:h-32 flex flex-col items-center justify-end">
                  {/* Golden Cup Vector */}
                  <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.6)]">
                    <defs>
                      <linearGradient id="goldTrophyGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="30%" stopColor="#f59e0b" />
                        <stop offset="70%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#78350f" />
                      </linearGradient>
                      <linearGradient id="pedestalGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>
                    </defs>
                    {/* Cup Body */}
                    <path d="M25,15 L75,15 C75,55 60,65 50,65 C40,65 25,55 25,15 Z" fill="url(#goldTrophyGrad)" stroke="#fef08a" strokeWidth="1" />
                    {/* Left Handle */}
                    <path d="M25,25 C10,25 10,45 27,48" fill="none" stroke="url(#goldTrophyGrad)" strokeWidth="4" strokeLinecap="round" />
                    {/* Right Handle */}
                    <path d="M75,25 C90,25 90,45 73,48" fill="none" stroke="url(#goldTrophyGrad)" strokeWidth="4" strokeLinecap="round" />
                    {/* Stem */}
                    <rect x="46" y="65" width="8" height="20" fill="url(#goldTrophyGrad)" />
                    {/* Stem Ring */}
                    <ellipse cx="50" cy="85" rx="14" ry="4" fill="url(#goldTrophyGrad)" />
                    {/* Pedestal Stand */}
                    <rect x="32" y="89" width="36" height="22" rx="3" fill="url(#pedestalGrad)" stroke="#475569" strokeWidth="1" />
                    <rect x="38" y="94" width="24" height="10" rx="1" fill="#f59e0b" opacity="0.9" />
                    {/* Star on Cup */}
                    <polygon points="50,28 53,35 60,35 55,40 57,47 50,43 43,47 45,40 40,35 47,35" fill="#ffffff" opacity="0.9" />
                  </svg>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

