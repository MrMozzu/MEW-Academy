import React from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { WhatsAppIcon } from './WhatsAppIcon';

export const ContactSection: React.FC = () => {
  const { openBrochure } = useAcademy();

  const contactChannels = [
    {
      title: 'Admissions WhatsApp & Hotline',
      icon: WhatsAppIcon,
      iconColor: 'text-[#25D366]',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200/80',
      primaryText: '+91 7070806047',
      primaryHref: 'https://wa.me/917070806047',
      secondaryText: 'Live student counseling on WhatsApp',
      secondaryHref: 'https://wa.me/917070806047',
      badge: 'WhatsApp Active',
      badgeColor: 'text-emerald-700 bg-emerald-100/80 border-emerald-300',
      actionLabel: 'Chat on WhatsApp'
    },
    {
      title: 'Official Email Support',
      icon: Mail,
      iconColor: 'text-sky-500',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200/80',
      primaryText: 'mewacademy.ac@gmail.com',
      primaryHref: 'mailto:mewacademy.ac@gmail.com',
      secondaryText: 'Admissions & Student Helpdesk',
      secondaryHref: 'mailto:mewacademy.ac@gmail.com',
      badge: 'Quick Response',
      badgeColor: 'text-sky-700 bg-sky-100/80 border-sky-300',
      actionLabel: 'Send Email'
    },
    {
      title: 'Academic Center',
      icon: MapPin,
      iconColor: 'text-rose-500',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200/80',
      primaryText: 'Bhopal, India',
      primaryHref: '#',
      secondaryText: 'MEW Academy, Bhopal, India',
      secondaryHref: null,
      badge: 'Headquarters',
      badgeColor: 'text-rose-700 bg-rose-100/80 border-rose-300',
      actionLabel: null
    }
  ];

  return (
    <section 
      id="contact-section" 
      className="py-14 sm:py-20 bg-white scroll-mt-16 sm:scroll-mt-20 relative overflow-hidden"
    >
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
            <span>Direct Support &amp; Admissions</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Contact <span className="text-[#d9822b]">MEW Academy</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm sm:text-base text-slate-600 mt-2.5 font-normal leading-relaxed"
          >
            Have questions about our Data Analytics curriculum, live cohort schedule, or enrollment? Reach out to our advisors directly.
          </motion.p>
        </div>

        {/* 3 Contact Detail Cards (3-Column Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {contactChannels.map((channel, idx) => {
            const IconComp = channel.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-[#f8fafc] rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className={`w-11 h-11 rounded-xl ${channel.bgColor} ${channel.borderColor} border flex items-center justify-center ${channel.iconColor} group-hover:scale-105 transition-transform`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    {channel.badge && (
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${channel.badgeColor}`}>
                        {channel.badge}
                      </span>
                    )}
                  </div>

                  {/* Channel Title */}
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    {channel.title}
                  </h3>

                  {/* Primary Info */}
                  {channel.primaryHref ? (
                    <a 
                      href={channel.primaryHref}
                      className="text-lg sm:text-xl font-bold text-slate-900 hover:text-[#d9822b] transition-colors block leading-snug"
                    >
                      {channel.primaryText}
                    </a>
                  ) : (
                    <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {channel.primaryText}
                    </p>
                  )}

                  {/* Secondary Info */}
                  {channel.secondaryHref ? (
                    <a 
                      href={channel.secondaryHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 mt-1.5 inline-flex items-center gap-1 hover:underline"
                    >
                      <span>{channel.secondaryText}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                      {channel.secondaryText}
                    </p>
                  )}
                </div>

                {/* Bottom Action if present */}
                {channel.actionLabel && channel.primaryHref && (
                  <div className="pt-5 mt-4 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Direct Line</span>
                    <a
                      href={channel.primaryHref}
                      className="text-xs font-bold text-[#d9822b] hover:text-[#b7681c] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>{channel.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Quick Syllabus Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 sm:mt-10 max-w-5xl mx-auto bg-gradient-to-r from-slate-950 via-[#06142a] to-[#0a2145] rounded-2xl p-6 sm:p-8 text-white border border-amber-400/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left"
        >
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-bold text-amber-400 flex items-center justify-center sm:justify-start gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Looking for Complete Curriculum Details?</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Download the official EDA syllabus with session breakdown, tools stack, and certification criteria.
            </p>
          </div>
          <button
            onClick={() => openBrochure()}
            className="px-5 py-2.5 bg-[#d9822b] hover:bg-[#b7681c] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <span>View Full Syllabus</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};
