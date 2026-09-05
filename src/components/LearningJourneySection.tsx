import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Terminal, 
  Database, 
  BarChart3, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';

export const LearningJourneySection: React.FC = () => {
  const { setActiveView } = useAcademy();
  const [activePhase, setActivePhase] = useState(0);

  const phases = [
    {
      step: '01',
      title: 'Python Basics + EDA Intro',
      subtitle: 'Environment Setup & Foundations',
      duration: 'Week 1 · Days 1–6',
      icon: Terminal,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200/80',
      description: 'Master Anaconda & Jupyter setup, variables, operators, conditional loops, data structures, and functions, leading into the core EDA workflow.',
      skills: ['Anaconda & Jupyter', 'Variables & Loops', 'Lists, Dicts & Sets', 'EDA Workflow'],
      deliverable: 'Write basic Python code & understand the EDA workflow'
    },
    {
      step: '02',
      title: 'NumPy + Pandas',
      subtitle: 'Data Wrangling & Manipulation',
      duration: 'Week 2 · Days 7–12',
      icon: Database,
      color: 'text-sky-500',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200/80',
      description: 'Learn NumPy multidimensional arrays, Pandas DataFrames, CSV/Excel imports, data filtering, missing values handling, and GroupBy aggregations.',
      skills: ['NumPy Arrays & Stats', 'Pandas DataFrames', 'Handling Missing Data', 'GroupBy & Joins'],
      deliverable: 'Clean, manipulate & prepare data using NumPy & Pandas'
    },
    {
      step: '03',
      title: 'Data Visualization',
      subtitle: 'Matplotlib + Seaborn Storytelling',
      duration: 'Week 3 · Days 13–18',
      icon: BarChart3,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200/80',
      description: 'Build compelling visual dashboards with line, bar, pie, and scatter plots, Seaborn countplots, boxplots, correlation heatmaps, and outlier detection.',
      skills: ['Matplotlib Subplots', 'Seaborn Themes', 'Heatmaps & Pairplots', 'Outlier Analysis'],
      deliverable: 'Visualize data beautifully & extract meaningful insights'
    },
    {
      step: '04',
      title: 'Excel + Complete EDA Project',
      subtitle: 'Capstone + Power BI Bonus',
      duration: 'Week 4 · Days 19–30',
      icon: Award,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200/80',
      description: 'Master Excel formulas, conditional formatting, and pivot tables, execute an end-to-end E-Commerce EDA capstone project, and build a Power BI dashboard.',
      skills: ['Excel Pivot Tables', 'E-Commerce Capstone', 'Power BI Dashboards', 'Final Certification'],
      deliverable: 'Perform EDA using Excel & Python and deliver a complete project'
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-t border-slate-200/70 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[#d9822b] font-bold text-xs uppercase tracking-wider mb-3 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Month Day-by-Day Course Plan</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Your Learning Journey to <span className="text-[#d9822b]">EDA Mastery</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm sm:text-base text-slate-600 mt-2.5 font-normal leading-relaxed"
          >
            A 30-day structured curriculum with 1 hour daily live classes (15m Revision + 15m Theory + 30m Hands-on Practical).
          </motion.p>
        </div>

        {/* 4-Week Roadmap Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {phases.map((phase, idx) => {
            const IconComp = phase.icon;
            const isSelected = activePhase === idx;

            return (
              <motion.div
                key={phase.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => setActivePhase(idx)}
                whileHover={{ y: -4 }}
                className={`bg-[#f8fafc] rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between cursor-pointer group relative ${
                  isSelected ? 'border-[#d9822b] shadow-md bg-white ring-1 ring-[#d9822b]/20' : 'border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl ${phase.bgColor} ${phase.borderColor} border flex items-center justify-center ${phase.color} shadow-xs group-hover:scale-105 transition-transform`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      <Clock className="w-3 h-3 text-[#d9822b]" />
                      <span>{phase.duration}</span>
                    </div>
                  </div>

                  {/* Phase Number & Title */}
                  <div className="text-[11px] font-mono font-bold text-[#d9822b] uppercase tracking-wider mb-1">
                    Week {phase.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug mb-1">
                    {phase.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mb-3">
                    {phase.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {phase.description}
                  </p>
                </div>

                <div>
                  {/* Skills Chips */}
                  <div className="pt-3 border-t border-slate-200/80">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Core Toolset
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {phase.skills.map((skill, sIdx) => (
                        <span 
                          key={sIdx} 
                          className="text-[10px] font-medium bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Outcome Deliverable */}
                    <div className="bg-amber-50/60 rounded-xl p-2.5 border border-amber-200/60 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#d9822b] flex-shrink-0 mt-0.5" />
                      <div className="text-[11px] font-semibold text-slate-800 leading-tight">
                        <span className="text-[#d9822b] font-bold">Outcome:</span> {phase.deliverable}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 sm:mt-12 bg-gradient-to-r from-slate-950 via-[#06142a] to-[#0a2145] rounded-2xl p-6 sm:p-8 text-white border border-amber-400/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left"
        >
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-bold text-amber-400 flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>Ready to Master Exploratory Data Analysis?</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Join our upcoming live cohort led directly by Prof. MD Tahseen Equbal.
            </p>
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0 flex-wrap justify-center">
            <button
              onClick={() => {
                setActiveView('home');
                setTimeout(() => {
                  const el = document.getElementById('our-course-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              className="px-6 py-3 bg-gradient-to-r from-[#d9822b] to-[#f5a623] hover:from-[#c87624] hover:to-[#e0961b] text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Course &amp; Curriculum</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
