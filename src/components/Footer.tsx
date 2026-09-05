import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { MewLogo } from './MewLogo';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin,
  ArrowRight, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube, 
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const Footer: React.FC = () => {
  const { setActiveView } = useAcademy();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer id="contact-section" className="bg-[#030d1c] text-slate-300 pt-16 pb-8 border-t border-slate-800 scroll-mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1: Brand & Bio with Official MEW Logo */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => setActiveView('home')} 
              className="cursor-pointer select-none inline-block transition-opacity hover:opacity-95"
            >
              <MewLogo size="md" theme="on-dark" />
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed pt-1">
              MEW Academy powers modern learners with enterprise Data Analytics curriculum, interactive sandboxes, and cryptographic verifiable certifications.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://www.linkedin.com/company/mew-academy/" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-[#08182f] hover:bg-[#0A66C2] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 border border-slate-800 hover:scale-110 shadow-sm"
                title="MEW Academy on LinkedIn"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/mewacademy?igsi=MXJ0ODl2dXdlemxiaQ==" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-[#08182f] hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 border border-slate-800 hover:scale-110 shadow-sm"
                title="MEW Academy on Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://wa.me/917070806047" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-[#08182f] hover:bg-[#25D366] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 border border-slate-800 hover:scale-110 shadow-sm"
                title="Chat with MEW Academy on WhatsApp"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              <a 
                href="mailto:mewacademy.ac@gmail.com" 
                className="w-9 h-9 rounded-full bg-[#08182f] hover:bg-[#d9822b] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 border border-slate-800 hover:scale-110 shadow-sm"
                title="Email MEW Academy"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setActiveView('home')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActiveView('home');
                    setTimeout(() => {
                      const el = document.getElementById('our-course-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                  }} 
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Data Analytics Program
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActiveView('home');
                    setTimeout(() => {
                      const el = document.getElementById('instructors-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }} 
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Instructors &amp; Mentors
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActiveView('home');
                    setTimeout(() => {
                      const el = document.getElementById('contact-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }} 
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Support */}
          <div>
            <h4 className="text-sm font-black text-sky-400 uppercase tracking-wider mb-4">
              Contact &amp; Support
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="https://wa.me/917070806047" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-2.5 hover:text-[#25D366] transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                  <span>+91 7070806047</span>
                </a>
              </li>
              <li>
                <a href="mailto:mewacademy.ac@gmail.com" className="flex items-center gap-2.5 hover:text-sky-400 transition-colors">
                  <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>mewacademy.ac@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-slate-400 leading-snug">Bhopal, India</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="text-sm font-black text-purple-400 uppercase tracking-wider mb-4">
              Newsletter
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Subscribe to receive curated case studies, dataset drops, and scholarship announcements.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-slate-900 text-white placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-l-xl border border-slate-800 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-3.5 py-2.5 rounded-r-xl font-bold transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {subscribed && (
                <div className="text-xs text-amber-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Subscribed to MEW Insider!</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom copyright line with MEW Motto */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 MEW Academy. Make • Explore • Win. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => setActiveView('verify-cert')} className="hover:text-amber-400 cursor-pointer">
              Verify Certificate Portal
            </button>
            <a href="#" className="hover:text-slate-400">Terms of Use</a>
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

