import React, { useState, useEffect, useRef } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { MewLogo } from './MewLogo';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Sparkles,
  ChevronDown,
  Home,
  Users,
  Phone,
  LogIn,
  LogOut,
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    startCheckout,
    courses,
    isEnrolled,
    openAuthModal,
    isLoggedIn,
    authToken,
    user,
    logout
  } = useAcademy();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isAnyEnrolled = courses.some(c => isEnrolled(c.id));

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Click outside listener to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setIsUserMenuOpen(false);
    if (activeView !== 'home') {
      setActiveView('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleEnrollClick = () => {
    setIsUserMenuOpen(false);
    if (isAnyEnrolled) {
      setActiveView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (courses.length > 0) {
      startCheckout(courses[0]);
    } else {
      scrollToSection('our-course-section');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24 gap-2 sm:gap-4 w-full">

          {/* Official MEW Academy Logo */}
          <div
            onClick={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer flex items-center flex-shrink-0 select-none py-1.5 group transition-all"
            id="brand-logo"
          >
            {/* Mobile logo (< 640px) */}
            <div className="sm:hidden flex items-center">
              <MewLogo size="md" />
            </div>
            {/* Tablet & Desktop logo (>= 640px) */}
            <div className="hidden sm:flex items-center">
              <MewLogo size="lg" />
            </div>
          </div>

          {/* Desktop Nav Links (Visible on Large Screens) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 self-center flex-shrink-0">
            <button
              onClick={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-sm font-semibold transition-colors cursor-pointer py-1 ${activeView === 'home'
                  ? 'text-[#d9822b] border-b-2 border-[#d9822b]'
                  : 'text-slate-700 hover:text-[#d9822b]'
                }`}
            >
              Home
            </button>

            <button
              onClick={() => scrollToSection('our-course-section')}
              className="text-sm font-semibold text-slate-700 hover:text-[#d9822b] transition-colors cursor-pointer py-1"
            >
              Courses
            </button>

            <button
              onClick={() => scrollToSection('instructors-section')}
              className="text-sm font-semibold text-slate-700 hover:text-[#d9822b] transition-colors cursor-pointer py-1"
            >
              Instructor
            </button>

            <button
              onClick={() => scrollToSection('why-choose-section')}
              className="text-sm font-semibold text-slate-700 hover:text-[#d9822b] transition-colors cursor-pointer py-1"
            >
              About Us
            </button>

            <button
              onClick={() => scrollToSection('contact-section')}
              className="text-sm font-semibold text-slate-700 hover:text-[#d9822b] transition-colors cursor-pointer py-1"
            >
              Contact
            </button>

            {isAnyEnrolled && user.role !== 'admin' && (
              <button
                onClick={() => {
                  setActiveView('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-sm font-bold transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
                  activeView === 'dashboard' ? 'text-[#d9822b]' : 'text-slate-700 hover:text-[#d9822b]'
                }`}
              >
                <span>Dashboard</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            )}

            {isLoggedIn && user.role === 'admin' && !!authToken && (
              <button
                onClick={() => {
                  setActiveView('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-sm font-bold transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
                  activeView === 'admin' ? 'text-amber-600' : 'text-slate-700 hover:text-amber-600'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Admin Authority</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 self-center flex-shrink-0">

            {/* Dynamic User Profile (Logged In) OR Sign In Button (Logged Out) */}
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="inline-flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-2 sm:px-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs cursor-pointer select-none"
                  id="user-profile-header-btn"
                >
                  <div className="relative">
                    <img
                      src={user.avatar || '/student-avatar.png'}
                      alt={user.name}
                      onError={(e) => { e.currentTarget.src = '/student-avatar.png'; }}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-amber-400 shadow-2xs bg-slate-100"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 hidden sm:inline max-w-[80px] md:max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isUserMenuOpen ? 'rotate-180 text-[#d9822b]' : ''}`} />
                </motion.button>

                {/* User Profile Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 overflow-hidden"
                    >
                      {/* User Identity Header */}
                      <div className="p-2.5 bg-gradient-to-br from-slate-900 to-[#071739] text-white rounded-xl mb-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.avatar || '/student-avatar.png'}
                            alt={user.name}
                            onError={(e) => { e.currentTarget.src = '/student-avatar.png'; }}
                            className="w-9 h-9 rounded-full object-cover border border-amber-400 flex-shrink-0 bg-slate-100"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-white truncate">{user.name}</div>
                            <div className="text-[10px] text-slate-300 truncate">{user.email}</div>
                            {user.phone && (
                              <div className="text-[10px] text-amber-300/90 truncate flex items-center gap-1 mt-0.5">
                                <span>📱 {user.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                          <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30 capitalize">
                            {user.role === 'admin' ? 'Administrator' : user.role === 'instructor' ? 'Mentor' : 'Active Student'}
                          </span>
                        </div>
                      </div>

                      {/* Menu Action Links */}
                      <div className="space-y-1 text-xs font-medium text-slate-700">
                        {isLoggedIn && user.role === 'admin' && !!authToken && (
                          <motion.button
                            whileHover={{ x: 4, scale: 1.01 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              setActiveView('admin');
                              setIsUserMenuOpen(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left cursor-pointer ${
                              activeView === 'admin'
                                ? 'bg-amber-50 text-[#d9822b] font-black border border-amber-200/80 shadow-2xs'
                                : 'hover:bg-slate-100 hover:text-[#d9822b] font-semibold text-amber-900 bg-amber-50/50'
                            }`}
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-500" />
                            <span>Certificate Authority (Admin)</span>
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ x: 4, scale: 1.01 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            setActiveView('home');
                            setIsUserMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left cursor-pointer ${activeView === 'home'
                              ? 'bg-amber-50 text-[#d9822b] font-bold border border-amber-200/80 shadow-2xs'
                              : 'hover:bg-slate-100 hover:text-[#d9822b]'
                            }`}
                        >
                          <Home className="w-4 h-4 text-[#d9822b]" />
                          <span>Home Page</span>
                        </motion.button>

                        {user.role !== 'admin' && (
                          <motion.button
                            whileHover={{ x: 4, scale: 1.01 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              setActiveView('dashboard');
                              setIsUserMenuOpen(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left cursor-pointer ${activeView === 'dashboard'
                                ? 'bg-amber-50 text-[#d9822b] font-black border border-amber-200/80 shadow-2xs'
                                : 'hover:bg-slate-100 hover:text-[#d9822b] font-semibold'
                              }`}
                          >
                            <LayoutDashboard className="w-4 h-4 text-amber-500" />
                            <span>Student Dashboard</span>
                          </motion.button>
                        )}

                        <motion.button
                          whileHover={{ x: 4, scale: 1.01 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => scrollToSection('our-course-section')}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-[#d9822b] transition-all text-left cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4 text-sky-500" />
                          <span>Courses &amp; Curriculum</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ x: 4, scale: 1.01 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => scrollToSection('instructors-section')}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-[#d9822b] transition-all text-left cursor-pointer"
                        >
                          <Users className="w-4 h-4 text-purple-500" />
                          <span>Meet Our Mentor</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ x: 4, scale: 1.01 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => scrollToSection('contact-section')}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-[#d9822b] transition-all text-left cursor-pointer"
                        >
                          <Phone className="w-4 h-4 text-slate-500" />
                          <span>Contact &amp; Support</span>
                        </motion.button>
                      </div>

                      {/* Sign Out Divider & Button */}
                      <div className="pt-2 mt-2 border-t border-slate-100">
                        <motion.button
                          whileHover={{ x: 4, scale: 1.01 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-bold transition-all text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openAuthModal('login')}
                className="inline-flex h-9 sm:h-10 px-2.5 sm:px-4 items-center justify-center text-xs sm:text-sm font-bold text-slate-800 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer shadow-2xs whitespace-nowrap gap-1.5"
                id="login-header-btn"
              >
                <LogIn className="w-3.5 h-3.5 text-[#d9822b]" />
                <span>Sign In</span>
              </motion.button>
            )}

            {/* Enroll Now / My Dashboard Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEnrollClick}
              className="h-9 sm:h-10 px-3 sm:px-4 md:px-5 inline-flex items-center justify-center text-xs sm:text-sm font-bold text-white bg-[#d9822b] hover:bg-[#c87624] border border-[#d9822b] rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap gap-1 sm:gap-1.5 flex-shrink-0"
              id="signup-header-btn"
            >
              <span>{isAnyEnrolled ? 'My Dashboard' : 'Enroll Now'}</span>
              <Sparkles className="w-3.5 h-3.5 hidden xs:inline-block" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};
