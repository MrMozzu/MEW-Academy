import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Maximize2, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Award,
  Upload,
  CheckCircle2,
  Tv
} from 'lucide-react';
import { MewLogo } from './MewLogo';

interface HeroVideoShowcaseProps {
  onOpenModal?: () => void;
}

export const HeroVideoShowcase: React.FC<HeroVideoShowcaseProps> = ({ onOpenModal }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(9.5);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [captionsEnabled, setCaptionsEnabled] = useState<boolean>(true);
  const [speechSynthesisActive, setSpeechSynthesisActive] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<any>(null);

  // Script transcript from user's uploaded video:
  // 00:00 - 00:01: "Welcome to Mew Academy."
  // 00:01 - 00:04: "We are redefining the future of learning."
  // 00:04 - 00:07: "It is time to make, explore, and win."
  // 00:07 - 00:09.5: "MEW Academy — Unleash your potential."

  const getActiveScene = (time: number) => {
    if (time < 1.8) return 1;
    if (time < 4.8) return 2;
    if (time < 7.5) return 3;
    return 4;
  };

  const activeScene = getActiveScene(currentTime);

  // Auto-play / progression loop for the interactive holographic presentation video
  useEffect(() => {
    if (!isPlaying) return;

    const interval = 50; // 50ms tick for smooth progress
    timerRef.current = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= duration) {
          return 0; // loop
        }
        return prev + 0.05;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, duration]);

  // Audio Speech Synthesis when unmuted
  const speakText = (text: string) => {
    if (isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = 0.85;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  // Trigger speech on scene transitions
  useEffect(() => {
    if (!isPlaying || isMuted) return;

    if (activeScene === 1 && currentTime < 0.3) {
      speakText('Welcome to Mew Academy.');
    } else if (activeScene === 2 && currentTime >= 1.8 && currentTime < 2.1) {
      speakText('We are redefining the future of learning.');
    } else if (activeScene === 3 && currentTime >= 4.8 && currentTime < 5.1) {
      speakText('It is time to make, explore, and win.');
    } else if (activeScene === 4 && currentTime >= 7.5 && currentTime < 7.8) {
      speakText('MEW Academy. Unleash your potential.');
    }
  }, [activeScene, isPlaying, isMuted]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
    if (!isMuted) {
      speakText('Welcome to Mew Academy.');
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    setCurrentTime(Math.min(Math.max(pos * duration, 0), duration));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      className="relative bg-gradient-to-b from-slate-900 via-[#071739] to-slate-950 rounded-3xl p-3.5 sm:p-4 border-2 border-amber-400/60 shadow-[0_25px_60px_-15px_rgba(245,166,35,0.35)] backdrop-blur-xl z-20 overflow-hidden group select-none transition-all duration-300"
    >
      {/* Top Header Bar / Brand Badge */}
      <div className="flex items-center justify-between px-2 pb-2.5 border-b border-slate-800/80 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <span className="text-[11px] font-black text-amber-300 ml-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#f5a623]" />
            <span>MEW Academy Brand Film</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>4K ULTRA HD</span>
          </span>

          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload custom video file"
            className="text-[10px] text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded-md border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Upload className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">Upload</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="video/*" 
            className="hidden" 
          />
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden border border-slate-700/80 shadow-2xl flex items-center justify-center">
        
        {customVideoUrl ? (
          /* Custom Uploaded Video Player */
          <video
            src={customVideoUrl}
            autoPlay
            loop
            muted={isMuted}
            className="w-full h-full object-cover"
          />
        ) : (
          /* High-Fidelity Holographic Video Presentation Recreating the Uploaded Clip */
          <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#1a140b] via-[#09152b] to-[#040914] flex items-center justify-center">
            
            {/* Background Studio Wall Lights (reproducing the warm vertical ambient sconce lights in the video) */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-[18%] w-12 h-28 bg-amber-400/25 rounded-b-full blur-xl" />
              <div className="absolute top-0 left-[38%] w-12 h-32 bg-amber-300/30 rounded-b-full blur-xl" />
              <div className="absolute top-0 right-[38%] w-12 h-32 bg-amber-300/30 rounded-b-full blur-xl" />
              <div className="absolute top-0 right-[18%] w-12 h-28 bg-amber-400/25 rounded-b-full blur-xl" />

              {/* Vertical Wall Wood Slats */}
              <div className="absolute top-0 inset-x-0 h-28 flex justify-around opacity-20">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-1.5 h-full bg-amber-600 rounded-b-sm" />
                ))}
              </div>
            </div>

            {/* Glowing Golden Particle Sparks */}
            <div className="absolute inset-0 pointer-events-none">
              {[
                { x: '20%', y: '30%', delay: 0 },
                { x: '75%', y: '25%', delay: 1.5 },
                { x: '15%', y: '70%', delay: 0.8 },
                { x: '85%', y: '65%', delay: 2.1 },
                { x: '50%', y: '80%', delay: 1.1 }
              ].map((p, idx) => (
                <motion.div
                  key={idx}
                  style={{ left: p.x, top: p.y }}
                  animate={{
                    opacity: [0.1, 0.8, 0.1],
                    scale: [0.7, 1.4, 0.7],
                    y: [0, -15, 0]
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: p.delay
                  }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047]"
                />
              ))}
            </div>

            {/* SCENES 1, 2, 3: Presenter with Futuristic Holographic UI */}
            {activeScene < 4 && (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Presenter Portrait (Prof. / Instructor in Suit) */}
                <div className="relative z-10 flex flex-col items-center mt-6 sm:mt-8">
                  {/* Glowing Backlight Halo */}
                  <div className="absolute -top-6 w-44 sm:w-56 h-44 sm:h-56 bg-amber-500/20 rounded-full blur-2xl -z-10" />

                  {/* Character Illustration / Presenter Photo */}
                  <div className="relative w-36 sm:w-48 h-44 sm:h-56 rounded-t-full overflow-hidden border-b-0 border-t-2 border-x-2 border-amber-400/40 shadow-2xl bg-gradient-to-t from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
                    <img 
                      src="/tahseen_iqbal_photo.png" 
                      alt="MEW Academy Instructor" 
                      className="w-full h-full object-cover object-top scale-105"
                      onError={(e) => {
                        // Fallback if local image not found
                        e.currentTarget.src = '/tahseen-equbal.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* SCENE 1: Holographic Orbitals (0.0s - 1.8s) */}
                <AnimatePresence>
                  {activeScene === 1 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center"
                    >
                      {/* Orbiting Golden Particle Ribbon */}
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        className="absolute w-64 sm:w-80 h-36 sm:h-44 rounded-full border border-sky-400/40 border-dashed"
                      />
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        className="absolute w-52 sm:w-68 h-28 sm:h-36 rounded-full border border-amber-400/50"
                      />

                      {/* Sci-Fi HUD Crosshairs & Sparkles */}
                      <div className="absolute left-6 sm:left-12 top-10 bg-slate-900/90 border border-sky-400/60 rounded-xl px-2.5 py-1 text-[10px] text-sky-300 font-mono flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                        <span>NEURAL_SYS // ONLINE</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* SCENE 2: Future of Learning HUD Dial (1.8s - 4.8s) */}
                <AnimatePresence>
                  {activeScene === 2 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 pointer-events-none z-20 flex items-center justify-between px-4 sm:px-10"
                    >
                      {/* Left HUD: Futuristic Floating Panel */}
                      <motion.div 
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="bg-slate-900/90 backdrop-blur-md border border-cyan-400/80 rounded-2xl p-2.5 sm:p-3 text-left space-y-1 shadow-[0_0_20px_rgba(6,182,212,0.3)] max-w-[130px] sm:max-w-[160px]"
                      >
                        <div className="flex items-center justify-between text-[9px] font-mono text-cyan-300 border-b border-cyan-500/30 pb-1">
                          <span>FUTURE_LEARN</span>
                          <span className="text-emerald-400 font-bold">100%</span>
                        </div>
                        <div className="text-[10px] sm:text-xs font-black text-white">AI &amp; Data Mastery</div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full w-[85%]" />
                        </div>
                      </motion.div>

                      {/* Right HUD: Holographic Radial Dial 056 */}
                      <motion.div 
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                        className="bg-slate-900/90 backdrop-blur-md border border-amber-400/80 rounded-2xl p-2.5 sm:p-3 text-center space-y-1 shadow-[0_0_20px_rgba(245,166,35,0.3)]"
                      >
                        <div className="text-[9px] font-mono text-amber-300">SYSTEM ID</div>
                        <div className="relative w-12 sm:w-14 h-12 sm:h-14 mx-auto flex items-center justify-center">
                          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90 animate-spin-slow">
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#334155" strokeWidth="2.5" />
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="75 100" />
                          </svg>
                          <span className="absolute text-xs font-black text-white font-mono">056</span>
                        </div>
                        <div className="text-[8px] font-mono text-emerald-400">READY</div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* SCENE 3: Make • Explore • Win Holographic Panels (4.8s - 7.5s) */}
                <AnimatePresence>
                  {activeScene === 3 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 pointer-events-none z-20 flex items-center justify-between p-3 sm:p-6"
                    >
                      {/* Left: Make Cards */}
                      <div className="space-y-1.5 max-w-[110px] sm:max-w-[140px]">
                        <motion.div 
                          initial={{ x: -20 }}
                          animate={{ x: 0 }}
                          className="bg-slate-900/90 border border-amber-400/80 rounded-xl p-1.5 sm:p-2 text-left backdrop-blur-md shadow-lg"
                        >
                          <span className="text-[8px] font-black uppercase text-amber-400">MAKE</span>
                          <p className="text-[9px] sm:text-[10px] font-bold text-white">Hands-on Code</p>
                        </motion.div>

                        <motion.div 
                          initial={{ x: -20 }}
                          animate={{ x: 0 }}
                          transition={{ delay: 0.1 }}
                          className="bg-slate-900/90 border border-amber-400/80 rounded-xl p-1.5 sm:p-2 text-left backdrop-blur-md shadow-lg"
                        >
                          <span className="text-[8px] font-black uppercase text-amber-400">BUILD</span>
                          <p className="text-[9px] sm:text-[10px] font-bold text-white">Real Projects</p>
                        </motion.div>
                      </div>

                      {/* Right: Explore & Win Cards */}
                      <div className="space-y-1.5 max-w-[110px] sm:max-w-[140px]">
                        <motion.div 
                          initial={{ x: 20 }}
                          animate={{ x: 0 }}
                          className="bg-slate-900/90 border border-sky-400/80 rounded-xl p-1.5 sm:p-2 text-left backdrop-blur-md shadow-lg"
                        >
                          <span className="text-[8px] font-black uppercase text-sky-400">EXPLORE</span>
                          <p className="text-[9px] sm:text-[10px] font-bold text-white">Data Analytics</p>
                        </motion.div>

                        <motion.div 
                          initial={{ x: 20 }}
                          animate={{ x: 0 }}
                          transition={{ delay: 0.1 }}
                          className="bg-slate-900/90 border border-purple-400/80 rounded-xl p-1.5 sm:p-2 text-left backdrop-blur-md shadow-lg"
                        >
                          <span className="text-[8px] font-black uppercase text-purple-400">WIN</span>
                          <p className="text-[9px] sm:text-[10px] font-bold text-white">Get Hired</p>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            )}

            {/* SCENE 4: Iconic Logo Reveal & Grand Finale (7.5s - 9.5s) */}
            <AnimatePresence>
              {activeScene === 4 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 z-30 bg-[#030914] flex flex-col items-center justify-center p-4 text-center"
                >
                  {/* Golden Starlight Burst */}
                  <motion.div 
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="absolute w-80 h-80 rounded-full border border-amber-400/30 blur-[2px] pointer-events-none"
                  />

                  <div className="relative z-10 space-y-2">
                    {/* Animated MEW Logo (Exact Match of Brand Video Finale) */}
                    <div className="flex items-center justify-center scale-90 sm:scale-100">
                      <MewLogo variant="full" size="xl" theme="on-dark" showMotto={true} />
                    </div>

                    {/* Tagline */}
                    <motion.p 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="text-xs sm:text-sm font-black text-amber-300 drop-shadow-[0_0_15px_rgba(245,166,35,0.6)] tracking-wide"
                    >
                      Unleash Your Potential
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subtitles Overlay */}
            {captionsEnabled && (
              <div className="absolute bottom-4 inset-x-4 z-40 text-center pointer-events-none">
                <div className="inline-block bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-xs sm:text-sm font-bold text-white shadow-xl max-w-[90%] transition-all">
                  {activeScene === 1 && "“ Welcome to Mew Academy. ”"}
                  {activeScene === 2 && "“ We are redefining the future of learning. ”"}
                  {activeScene === 3 && "“ It is time to make, explore, and win. ”"}
                  {activeScene === 4 && "“ MEW Academy — Unleash your potential. ”"}
                </div>
              </div>
            )}

            {/* Big Center Play Overlay when Paused */}
            {!isPlaying && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={handleTogglePlay}
                className="absolute z-40 w-16 h-16 rounded-full bg-gradient-to-tr from-[#d9822b] to-[#f5a623] text-white flex items-center justify-center shadow-[0_0_30px_rgba(245,166,35,0.7)] hover:scale-110 transition-transform cursor-pointer"
              >
                <Play className="w-8 h-8 ml-1 fill-white" />
              </motion.button>
            )}

          </div>
        )}

      </div>

      {/* Video Control Bar */}
      <div className="pt-2.5 space-y-2">
        {/* Progress Bar / Scrubber */}
        <div 
          onClick={handleSeek}
          className="relative h-2 w-full bg-slate-800 rounded-full cursor-pointer overflow-hidden group/bar"
        >
          <div 
            style={{ width: `${(currentTime / duration) * 100}%` }}
            className="h-full bg-gradient-to-r from-[#d9822b] to-[#f5a623] rounded-full relative transition-all duration-75 shadow-[0_0_10px_#f5a623]"
          />
        </div>

        {/* Action Controls & Timestamps */}
        <div className="flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className="p-1.5 text-white hover:text-amber-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            <button
              onClick={handleRestart}
              className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Restart from beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleToggleMute}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                isMuted 
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-800' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
              }`}
              title={isMuted ? 'Unmute voice' : 'Mute voice'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="text-[10px] font-bold hidden sm:inline">{isMuted ? 'Muted' : 'Audio On'}</span>
            </button>

            <span className="font-mono text-[11px] text-slate-400 ml-1">
              00:0{Math.floor(currentTime)} / 00:09
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCaptionsEnabled(!captionsEnabled)}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer border ${
                captionsEnabled 
                  ? 'bg-amber-400 text-slate-950 border-amber-400' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title="Toggle Captions"
            >
              CC
            </button>

            <button
              onClick={handleToggleFullscreen}
              className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
