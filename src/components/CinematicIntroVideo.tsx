import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export const CinematicIntroVideo: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMute = !isMuted;
    videoRef.current.muted = nextMute;
    setIsMuted(nextMute);
  };

  return (
    <div 
      className={`relative w-full rounded-2xl bg-[#040914] border border-slate-700/80 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden select-none font-sans group cursor-pointer ${className}`}
      id="cinematic-intro-video-player"
      onClick={togglePlay}
    >
      {/* 16:9 Aspect Ratio Pure Cinematic Video Player */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black flex items-center justify-center">
        
        {/* Your Official MP4 Intro Video */}
        <video
          ref={videoRef}
          src="/mew_academy_intro.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Ambient Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-black/25 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Play/Pause Overlay Indicator on Hover */}
        {!isPlaying && (
          <div className="absolute inset-0 z-20 bg-black/40 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-slate-900/90 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.5)] pl-1">
              <Play className="w-7 h-7 text-cyan-300 fill-cyan-300" />
            </div>
          </div>
        )}

        {/* Minimal Single Audio Toggle in Corner */}
        <div className="absolute bottom-3 right-3 z-30 opacity-70 group-hover:opacity-100 transition-opacity">
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-700/70 text-slate-200 hover:text-white backdrop-blur-md shadow-lg transition-all cursor-pointer"
            title={isMuted ? "Unmute Video Audio" : "Mute Video Audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>

      </div>
    </div>
  );
};
