import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import { sound } from '../../engine/soundEngine';
import { UserSoulProfile } from '../../types';

interface HologramNavProps {
  user: UserSoulProfile;
  cartCount: number;
  onOpenLogin: () => void;
  onOpenCart: () => void;
  onScrollTo: (id: string) => void;
}

export const HologramNav: React.FC<HologramNavProps> = ({
  user,
  cartCount,
  onOpenLogin,
  onOpenCart,
  onScrollTo,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playClick();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 md:px-8 flex justify-between items-center backdrop-blur-md bg-[#050814]/75 border-b border-cyber-cyan/20">
      {/* Brand Logo & Live Pulse */}
      <div 
        className="flex items-center space-x-3 cursor-pointer group"
        onClick={() => {
          sound.playClick();
          onScrollTo('hero');
        }}
      >
        <div className="relative w-9 h-9 rounded-lg bg-gradient-to-tr from-cyber-pink via-cyber-purple to-cyber-cyan p-[1.5px] animate-pulse-glow">
          <div className="w-full h-full bg-[#050814] rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-cyber-cyan group-hover:rotate-45 transition-transform duration-300" />
          </div>
        </div>
        <div>
          <div className="font-orbitron font-black tracking-widest text-lg bg-clip-text text-transparent bg-gradient-to-r from-cyber-cyan via-white to-cyber-pink">
            HYPERION
          </div>
          <div className="text-[10px] font-mono tracking-tighter text-cyber-cyan/60 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-ping" />
            <span>MULTIVERSE LINKED // 2026.08</span>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="hidden lg:flex items-center space-x-7 font-orbitron text-xs tracking-wider text-gray-300 font-semibold">
        {[
          { id: 'hero', label: 'GENESIS' },
          { id: 'relics', label: 'SSR RELICS' },
          { id: 'bazaar', label: 'OPEN BAZAAR' },
          { id: 'gacha', label: 'DIVINE SUMMON' },
          { id: 'checkout', label: 'WARP CHECKOUT' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              sound.playClick();
              onScrollTo(item.id);
            }}
            onMouseEnter={() => sound.playHover()}
            className="hover:text-cyber-cyan transition-colors relative py-1 group"
          >
            {item.label}
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-cyber-cyan to-cyber-pink group-hover:w-full transition-all duration-300" />
          </button>
        ))}
      </nav>

      {/* User Actions: Audio, Credits, Soul Profile, Cart */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Audio Synthesizer Toggle */}
        <button
          onClick={handleToggleSound}
          onMouseEnter={() => sound.playHover()}
          title={isMuted ? '음악/효과음 켜기' : '음소거'}
          className={`p-2 rounded-lg border transition-all ${
            !isMuted
              ? 'border-cyber-cyan/50 bg-cyber-cyan/10 text-cyber-cyan box-glow-cyan'
              : 'border-gray-700 bg-gray-900/50 text-gray-400'
          }`}
        >
          {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Chrono Credits Display */}
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-cyber-gold/40 bg-cyber-gold/5 font-mono text-xs text-cyber-gold">
          <Sparkles className="w-3.5 h-3.5 text-cyber-gold animate-spin-slow" />
          <span className="font-bold">{user.chronoCredits.toLocaleString()}</span>
          <span className="text-[10px] text-cyber-gold/70">CC</span>
        </div>

        {/* Soul Sync Login Button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenLogin();
          }}
          onMouseEnter={() => sound.playHover()}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-orbitron font-semibold tracking-wider transition-all ${
            user.isSynced
              ? 'border-cyber-green/50 bg-cyber-green/10 text-cyber-green'
              : 'border-cyber-pink/50 bg-cyber-pink/10 text-cyber-pink hover:bg-cyber-pink hover:text-white box-glow-pink'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="hidden md:inline">
            {user.isSynced ? user.soulName : 'SOUL SYNC'}
          </span>
        </button>

        {/* Quantum Cart Button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenCart();
          }}
          onMouseEnter={() => sound.playHover()}
          className="relative p-2 rounded-lg border border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan hover:border-cyber-cyan hover:scale-105 transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-cyber-pink to-cyber-yellow text-[10px] font-black text-black flex items-center justify-center animate-bounce">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
