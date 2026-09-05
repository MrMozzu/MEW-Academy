import React from 'react';
import { 
  Layers, 
  Compass, 
  GraduationCap, 
  Trophy, 
  Sparkles 
} from 'lucide-react';
import { motion } from 'motion/react';

export const WhyChooseSection: React.FC = () => {
  const pillars = [
    {
      title: 'Make',
      subtitle: 'Build Real Projects',
      icon: Layers,
      color: 'text-amber-400',
      bgGlow: 'from-amber-500/10 to-transparent',
      borderColor: 'border-amber-500/20 hover:border-amber-400/50'
    },
    {
      title: 'Explore',
      subtitle: 'AI • Data • Technology • Research',
      icon: Compass,
      color: 'text-sky-400',
      bgGlow: 'from-sky-500/10 to-transparent',
      borderColor: 'border-sky-500/20 hover:border-sky-400/50'
    },
    {
      title: 'Learn',
      subtitle: 'Industry-Relevant Skills',
      icon: GraduationCap,
      color: 'text-purple-400',
      bgGlow: 'from-purple-500/10 to-transparent',
      borderColor: 'border-purple-500/20 hover:border-purple-400/50'
    },
    {
      title: 'Win',
      subtitle: 'Grow With Purpose',
      icon: Trophy,
      color: 'text-emerald-400',
      bgGlow: 'from-emerald-500/10 to-transparent',
      borderColor: 'border-emerald-500/20 hover:border-emerald-400/50'
    }
  ];

  return (
    <section id="why-choose-section" className="py-12 sm:py-16 lg:py-20 bg-slate-50 scroll-mt-16 sm:scroll-mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-br from-slate-950 via-[#06142a] to-[#0a2145] rounded-3xl p-6 sm:p-10 lg:p-14 text-white shadow-2xl border border-amber-400/20 relative overflow-hidden"
        >
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-left">
              {/* Motto Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/30 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest">
                  <span className="text-amber-400">Make</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-sky-400">Explore</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-purple-400">Win</span>
                </div>
              </div>

              {/* Heading */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                Why Learn with <span className="text-amber-400">MEW Academy</span>?
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                MEW Academy empowers learners with industry-calibrated Data Analytics &amp; tech curriculums. From raw exploratory analysis to enterprise visualization, we provide hands-on projects, personalized mentor guidance, and verifiable graduation credentials.
              </p>

              {/* Key Value Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Real-World Case Studies</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <div className="w-2 h-2 rounded-full bg-sky-400" />
                  <span>Interactive Sandboxes</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>Tutor Q&amp;A &amp; Doubt Solving</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Cryptographic Certifications</span>
                </div>
              </div>
            </div>

            {/* Right Pillars Grid (2x2) */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-3.5 sm:gap-5 pt-4 lg:pt-0">
              {pillars.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -3, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className={`bg-slate-900/70 backdrop-blur-md rounded-2xl p-4 sm:p-5 border ${pillar.borderColor} transition-all duration-300 flex flex-col justify-between group shadow-lg`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center ${pillar.color} group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </div>

                    <div>
                      <div className={`text-2xl sm:text-3xl font-black ${pillar.color} tracking-tight`}>
                        {pillar.title}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1 leading-snug">
                        {pillar.subtitle}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
