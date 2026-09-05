import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Quote, 
  CheckCircle2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  TrendingUp, 
  Users,
  GraduationCap
} from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  rating: number;
  date: string;
  course: string;
  category: 'career' | 'learning' | 'mentorship';
  content: string;
  highlight: string;
  avatarBg: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Pooja Sharma',
    role: 'Junior Data Analyst',
    organization: 'Cognizant',
    rating: 5,
    date: 'February 2026',
    course: 'EDA (Exploratory Data Analysis) Masterclass',
    category: 'career',
    highlight: 'Cracked technical interview on the first attempt!',
    content: 'Prof. Tahseen’s live weekend sessions made Pandas, NumPy, and Seaborn visual storytelling so intuitive. The 3 real-world datasets we cleaned and analyzed gave me the exact portfolio project that helped me stand out in my campus recruitment.',
    avatarBg: 'from-amber-500 to-orange-600',
    initials: 'PS'
  },
  {
    id: 'test-2',
    name: 'Aman Verma',
    role: 'BI & Analytics Associate',
    organization: 'FinTech Solutions',
    rating: 5,
    date: 'January 2026',
    course: 'EDA Masterclass & Python Live',
    category: 'career',
    highlight: 'Practical hands-on EDA with messy data',
    content: 'Most courses teach standard clean data, but MEW Academy taught us how to handle missing values, outliers, and complex skewness. The live doubt-solving sessions after every class ensured no query went unanswered.',
    avatarBg: 'from-blue-600 to-cyan-600',
    initials: 'AV'
  },
  {
    id: 'test-3',
    name: 'Sneha Patel',
    role: 'Final Year B.Tech Student',
    organization: 'VJTI Mumbai',
    rating: 5,
    date: 'February 2026',
    course: 'EDA (Exploratory Data Analysis) Masterclass',
    category: 'learning',
    highlight: 'Weekend live format fit my schedule perfectly',
    content: 'Being in final year, the weekend schedule was ideal. Prof. Tahseen explains complex statistical visualizations with extreme clarity. The interactive exercises kept everyone engaged throughout the 1-month program.',
    avatarBg: 'from-emerald-500 to-teal-700',
    initials: 'SP'
  },
  {
    id: 'test-4',
    name: 'Rahul Mukherjee',
    role: 'Software Engineer → Data Trainee',
    organization: 'Tech Mahindra',
    rating: 5,
    date: 'January 2026',
    course: 'EDA Masterclass with Power BI Module',
    category: 'career',
    highlight: 'Power BI bonus module and verifiable certificate',
    content: 'The transition from core programming to data analytics was made seamless. The cryptographic certificate from MEW Academy was easily verifiable by recruiters on LinkedIn, giving immediate credibility to my new skill set.',
    avatarBg: 'from-purple-600 to-indigo-700',
    initials: 'RM'
  },
  {
    id: 'test-5',
    name: 'Fatima Khan',
    role: 'Data Research Intern',
    organization: 'KPMG India',
    rating: 5,
    date: 'February 2026',
    course: 'EDA Masterclass',
    category: 'mentorship',
    highlight: 'Direct mentorship by Prof. MD Tahseen Equbal',
    content: 'Having an experienced educator like Prof. Tahseen guide each step of the EDA pipeline made all the difference. He shared real corporate case studies and practical dos and don’ts that textbooks completely miss.',
    avatarBg: 'from-rose-500 to-pink-600',
    initials: 'FK'
  },
  {
    id: 'test-6',
    name: 'Rohit Kulkarni',
    role: 'MBA Business Analytics Student',
    organization: 'Symbiosis',
    rating: 5,
    date: 'January 2026',
    course: 'EDA (Exploratory Data Analysis) Masterclass',
    category: 'learning',
    highlight: 'Bridged the gap between Excel and Python',
    content: 'I knew basic Excel, but this masterclass bridged the gap into advanced Python data manipulation effortlessly. Now I can build complete exploratory dashboards in Jupyter and present actionable business insights.',
    avatarBg: 'from-amber-600 to-yellow-600',
    initials: 'RK'
  }
];

export const FeedbackSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'career' | 'learning' | 'mentorship'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredTestimonials = selectedFilter === 'all' 
    ? TESTIMONIALS 
    : TESTIMONIALS.filter(t => t.category === selectedFilter);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? filteredTestimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === filteredTestimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section 
      id="feedback-section" 
      className="py-12 sm:py-16 bg-[#f8fafc] scroll-mt-20 sm:scroll-mt-24 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[#d9822b] font-bold text-xs uppercase tracking-wider mb-3 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Student Success Stories</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Learner <span className="text-[#d9822b]">Feedback</span> &amp; Reviews
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm sm:text-base text-slate-600 mt-2.5 font-normal leading-relaxed"
          >
            Discover how students and working professionals transformed their analytical skills through MEW Academy's live live-cohort programs.
          </motion.p>
        </div>

        {/* Quick Highlights / Trust Metrics Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10"
        >
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#d9822b] flex-shrink-0">
              <Star className="w-5 h-5 fill-[#d9822b]" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-slate-900 leading-tight">4.9 / 5.0</div>
              <div className="text-xs text-slate-500 font-medium">Average Cohort Rating</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-600 flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-slate-900 leading-tight">1,200+</div>
              <div className="text-xs text-slate-500 font-medium">Active &amp; Past Learners</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-slate-900 leading-tight">94%</div>
              <div className="text-xs text-slate-500 font-medium">Career Recommendation</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-600 flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-slate-900 leading-tight">100%</div>
              <div className="text-xs text-slate-500 font-medium">Verifiable Certificates</div>
            </div>
          </div>
        </motion.div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'career', label: 'Career Outcomes' },
            { id: 'learning', label: 'Live Learning Experience' },
            { id: 'mentorship', label: 'Instructor Mentorship' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedFilter(tab.id as any);
                setCurrentIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-[#d9822b] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Testimonials Grid (6 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative group"
            >
              {/* Quote icon mark */}
              <div className="absolute top-5 right-5 text-amber-100 group-hover:text-amber-200 transition-colors pointer-events-none">
                <Quote className="w-8 h-8 rotate-180 opacity-60" />
              </div>

              <div>
                {/* Star rating row */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1.5">5.0</span>
                </div>

                {/* Highlight Quote */}
                <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                  "{t.highlight}"
                </h3>

                {/* Main feedback text */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-5">
                  {t.content}
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${t.avatarBg} text-white font-black text-xs flex items-center justify-center shadow-xs flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>{t.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50" />
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {t.role} • <span className="text-slate-700">{t.organization}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-semibold bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                  Verified
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
