import React from 'react';
import { INSTRUCTORS } from '../data/instructorsData';
import { motion } from 'motion/react';
import { 
  Linkedin, 
  Star, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Laptop, 
  Cpu, 
  Columns, 
  TrendingUp,
  Award
} from 'lucide-react';
import { Instructor } from '../types';

export const InstructorsSection: React.FC = () => {
  return (
    <section id="instructors-section" className="py-14 sm:py-20 bg-[#f8fafc] scroll-mt-20 sm:scroll-mt-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title with Gold Underline */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[#d9822b] font-bold text-xs uppercase tracking-wider mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Masterclass Mentors</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Meet Your{' '}
            <span className="relative inline-block text-slate-900">
              Instructors
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-[#d9822b] rounded-full"></span>
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-3 max-w-xl mx-auto leading-relaxed font-normal">
            Learn directly from seasoned educators and industry practitioners with interactive 100% live cohorts, code walkthroughs, and personalized doubt resolution.
          </p>
        </motion.div>

        {/* 2-Column Responsive Instructors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
          {INSTRUCTORS.map((instructor: Instructor, idx: number) => {
            const isLead = idx === 0;
            return (
              <motion.div
                key={instructor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-lg hover:shadow-xl hover:border-slate-300 transition-all p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group"
              >
                {/* Subtle Ambient Glow */}
                <div className={`absolute top-0 right-0 w-64 h-64 ${isLead ? 'bg-amber-100/40' : 'bg-sky-100/40'} rounded-full blur-3xl pointer-events-none`} />

                <div className="relative z-10 space-y-6">
                  {/* Top Row: Avatar + Key Metadata */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                    
                    {/* Avatar Container */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="relative mb-3.5">
                        <div className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-slate-900 border-4 ${isLead ? 'border-[#d9822b]' : 'border-sky-600'} shadow-xl p-1 bg-gradient-to-tr ${isLead ? 'from-[#071739] via-amber-500 to-[#d9822b]' : 'from-[#071739] via-sky-500 to-blue-600'}`}>
                          <img
                            src={instructor.avatar}
                            alt={instructor.name}
                            onError={(e) => {
                              // Safe fallback until custom photo provided
                              e.currentTarget.src = '/default-avatar.png';
                            }}
                            className="w-full h-full rounded-full object-cover object-top"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="absolute bottom-0 right-1 bg-emerald-500 text-white p-1.5 rounded-full shadow-md border-2 border-white flex items-center justify-center" title="Verified Instructor">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* LinkedIn Action */}
                      <motion.a
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        href={instructor.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0a66c2] hover:bg-[#084e96] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                      >
                        <Linkedin className="w-3.5 h-3.5 fill-current" />
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3 opacity-80" />
                      </motion.a>
                    </div>

                    {/* Instructor Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                          isLead 
                            ? 'text-[#d9822b] bg-amber-50 border-amber-200/80' 
                            : 'text-sky-700 bg-sky-50 border-sky-200/80'
                        }`}>
                          {instructor.company}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          • {instructor.experience}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                        {instructor.name}
                      </h3>
                      <p className={`text-xs sm:text-sm font-bold ${isLead ? 'text-[#d9822b]' : 'text-sky-600'}`}>
                        {instructor.title}
                      </p>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-1">
                        {instructor.bio}
                      </p>
                    </div>
                  </div>

                  {/* 3 Metric Badges */}
                  <div className="grid grid-cols-3 gap-2.5 pt-1">
                    <div className="bg-[#f8fafc] border border-slate-200/90 rounded-2xl p-2.5 text-center">
                      <div className="text-base sm:text-lg font-black text-slate-900 flex items-center justify-center gap-1">
                        <span>{instructor.rating}</span>
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Rating</div>
                    </div>

                    <div className="bg-[#f8fafc] border border-slate-200/90 rounded-2xl p-2.5 text-center">
                      <div className="text-base sm:text-lg font-black text-slate-900">
                        {instructor.studentsCount.toLocaleString()}+
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Learners Mentored</div>
                    </div>

                    <div className="bg-[#f8fafc] border border-slate-200/90 rounded-2xl p-2.5 text-center">
                      <div className="text-base sm:text-lg font-black text-slate-900">100%</div>
                      <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Live Cohorts</div>
                    </div>
                  </div>

                  {/* Pillars / Tags */}
                  <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    {(isLead 
                      ? ['Exploratory Data Analysis', 'Python & Pandas', 'Matplotlib & Seaborn', 'Power BI Dashboards', 'Career Mentorship']
                      : ['Technical Mentorship', 'Applied Architectures', 'Code Reviews', 'Hands-On Datasets', 'Industry Practices']
                    ).map((skill) => (
                      <span key={skill} className="text-[11px] bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-200/80">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Bottom Dark Navy Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 sm:mt-16 bg-[#051329] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center">
            
            {/* Stat 1: 100% Practical Learning */}
            <motion.div 
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0a1f3d] border border-amber-400/30 flex items-center justify-center text-[#f5a623] flex-shrink-0">
                <Laptop className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white">100%</div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium">Practical Learning</div>
              </div>
            </motion.div>

            {/* Stat 2: 7+ Core Technologies */}
            <motion.div 
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0a1f3d] border border-amber-400/30 flex items-center justify-center text-[#f5a623] flex-shrink-0">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white">7+</div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium">Core Technologies</div>
              </div>
            </motion.div>

            {/* Stat 3: 4 Learning Pillars */}
            <motion.div 
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0a1f3d] border border-amber-400/30 flex items-center justify-center text-[#f5a623] flex-shrink-0">
                <Columns className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white">4</div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium">Learning Pillars</div>
              </div>
            </motion.div>

            {/* Stat 4: ∞ Growth Potential */}
            <motion.div 
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0a1f3d] border border-amber-400/30 flex items-center justify-center text-[#f5a623] flex-shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white">∞</div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium">Growth Potential</div>
              </div>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
