import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { motion } from 'motion/react';
import { 
  Star, 
  Clock, 
  Layers, 
  Sparkles,
  BookOpen,
  Download
} from 'lucide-react';

export const CourseCatalog: React.FC = () => {
  const { 
    courses, 
    openCourseDetail, 
    startCheckout, 
    openCoursePlayer, 
    isEnrolled, 
    selectedCategory,
    setSelectedCategory,
    openBrochure,
    downloadBrochurePDF
  } = useAcademy();

  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-low' | 'duration'>('popular');

  const filteredCourses = [...courses].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-low') return a.priceUSD - b.priceUSD;
    if (sortBy === 'duration') return b.durationHours - a.durationHours;
    return b.reviewsCount - a.reviewsCount;
  });

  return (
    <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20 sm:scroll-mt-24" id="course-catalog-section">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 sm:mb-8 text-center sm:text-left"
      >
        <span className="text-xs font-black uppercase tracking-wider text-[#d9822b] bg-amber-50 px-3 py-1 rounded-full border border-amber-300">
          Curriculum & Specializations
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2.5">
          Explore Certified Tech Programs
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
          Engineered by industry practitioners. Master high-demand data analytics skills, build real production systems, and earn verifiable credentials from MEW Academy.
        </p>
      </motion.div>

      {/* Filter & Sort Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-row items-center justify-between gap-3 sm:gap-4"
      >
        <span className="text-xs sm:text-sm text-slate-600 font-medium">
          Showing <strong className="text-slate-900 font-bold">{filteredCourses.length}</strong> certified program{filteredCourses.length > 1 ? 's' : ''}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold hidden xs:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="duration">Course Duration</option>
          </select>
        </div>
      </motion.div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No courses found</h3>
          <p className="text-sm text-slate-500 mt-1">Try selecting a different category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCourses.map((course, idx) => {
            const enrolled = isEnrolled(course.id);

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl hover:border-amber-300 transition-shadow duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Thumbnail Header */}
                <div>
                  <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Tag badge */}
                    {course.tag && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-3 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider rounded-md shadow-md flex items-center gap-1 bg-[#d9822b] text-white">
                          <Sparkles className="w-3 h-3" />
                          {course.tag}
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-xs font-semibold">
                      {course.durationHours}h Total
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 text-left">
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-[#d9822b] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        {course.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span className="text-slate-900">{course.rating}</span>
                        <span className="text-slate-500 font-normal">({course.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => openCourseDetail(course.id)}
                      className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#d9822b] transition-colors cursor-pointer line-clamp-2 leading-snug"
                    >
                      {course.title}
                    </h3>

                    {/* Short Desc */}
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {course.shortDescription}
                    </p>

                    {/* Instructor */}
                    <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-slate-100">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-7 h-7 rounded-full object-cover border border-amber-300"
                      />
                      <div className="text-xs font-semibold text-slate-700">
                        {course.instructor.name}
                      </div>
                    </div>

                    {/* Key skills pills */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {course.skillsGained.slice(0, 3).map((skill, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Price & CTAs */}
                <div className="p-5 sm:p-6 pt-0">
                  <div className="flex items-baseline justify-between pt-4 border-t border-slate-100 mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-slate-900">
                        ₹{course.priceINR.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ₹{course.originalPriceINR.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-[#d9822b] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      50% OFF
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openBrochure(course)}
                      className="w-full py-2.5 rounded-xl border border-amber-300 bg-amber-50/60 hover:bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-[#d9822b]" />
                      <span>Brochure</span>
                    </motion.button>

                    {enrolled ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openCoursePlayer(course.id)}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Continue</span>
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => startCheckout(course)}
                        className="w-full py-2.5 rounded-xl bg-[#d9822b] hover:bg-[#c87624] text-white font-bold text-xs sm:text-sm transition-colors shadow-md cursor-pointer text-center"
                      >
                        Enroll Now
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
};

