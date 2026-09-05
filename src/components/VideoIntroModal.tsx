import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { X, Award, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { CinematicIntroVideo } from './CinematicIntroVideo';

export const VideoIntroModal: React.FC = () => {
  const { isVideoIntroOpen, setIsVideoIntroOpen, setActiveView } = useAcademy();

  if (!isVideoIntroOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 text-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="font-bold text-sm text-white">MEW Academy Official 10s Brand Story Film</span>
          </div>
          <button
            onClick={() => setIsVideoIntroOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Showcase Player */}
        <div className="p-4 sm:p-6 bg-slate-950">
          <CinematicIntroVideo />
        </div>

        {/* Bottom Info */}
        <div className="p-6 bg-slate-900/90 space-y-4 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <span>Redefining the Future of Learning</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Make, Explore, and Win with MEW Academy's 1-Month EDA and Python Data Analytics Masterclass.
              </p>
            </div>

            <button
              onClick={() => {
                setIsVideoIntroOpen(false);
                const el = document.getElementById('our-course-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setActiveView('courses');
                }
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-[#d9822b] to-[#f5a623] text-white text-xs font-bold rounded-xl shadow-lg hover:from-[#c87624] hover:to-[#e0961b] transition-all whitespace-nowrap cursor-pointer"
            >
              Explore Masterclass
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-center text-xs text-slate-300">
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real Production Datasets</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>3 Verifiable Credentials</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Live Doubt Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
