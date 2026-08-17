import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, ShoppingBag, ShieldCheck, Zap, Heart, Rocket, User, Search } from 'lucide-react';
import { sound } from '../../engine/soundEngine';
import { UserSoulProfile, PageView } from '../../types';

interface HologramNavProps {
  user: UserSoulProfile;
  currentView: PageView;
  cartCount: number;
  wishlistCount: number;
  shipmentCount: number;
  onNavigate: (view: PageView) => void;
  onOpenLogin: () => void;
  onOpenProfile: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenTracking: () => void;
}

export const HologramNav: React.FC<HologramNavProps> = ({
  user,
  currentView,
  cartCount,
  wishlistCount,
  shipmentCount,
  onNavigate,
  onOpenLogin,
  onOpenProfile,
  onOpenCart,
  onOpenWishlist,
  onOpenTracking,
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
    <header className="fixed top-0 left-0 right-0 z-40 px-3 py-2.5 md:px-8 flex justify-between items-center backdrop-blur-md bg-[#050814]/85 border-b border-cyber-cyan/20">
      {/* Brand Logo */}
      <div
        className="flex items-center space-x-3 cursor-pointer group"
        onClick={() => {
          sound.playClick();
          onNavigate('HOME');
        }}
      >
        <div className="relative w-9 h-9 rounded-lg bg-gradient-to-tr from-cyber-pink via-cyber-purple to-cyber-cyan p-[1.5px] animate-pulse-glow">
          <div className="w-full h-full bg-[#050814] rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-cyber-cyan group-hover:rotate-45 transition-transform duration-300" />
          </div>
        </div>
        <div>
          <div className="font-orbitron font-black tracking-widest text-base md:text-lg bg-clip-text text-transparent bg-gradient-to-r from-cyber-cyan via-white to-cyber-pink">
            HYPERION
          </div>
          <div className="text-[9px] md:text-[10px] font-mono tracking-tighter text-cyber-cyan/60 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-ping" />
            <span>MULTIVERSE LINKED // 2026.08</span>
          </div>
        </div>
      </div>

      {/* Nav Links (Multi-Page Router) */}
      <nav className="hidden lg:flex items-center space-x-6 font-orbitron text-xs tracking-wider font-semibold">
        {[
          { view: 'HOME' as PageView, label: '3D TURNTABLE' },
          { view: 'CATALOG' as PageView, label: 'OPEN CATALOG' },
          { view: 'GACHA' as PageView, label: 'DIVINE GACHA' },
          { view: 'PROFILE' as PageView, label: 'MY PROFILE' },
          { view: 'CHECKOUT' as PageView, label: 'WARP CHECKOUT' },
        ].map((item) => {
          const active = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => {
                sound.playClick();
                onNavigate(item.view);
              }}
              onMouseEnter={() => sound.playHover()}
              className={`transition-colors relative py-1 ${
                active ? 'text-cyber-cyan font-black' : 'text-gray-300 hover:text-white'
              }`}
            >
              {item.label}
              {active && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyber-cyan to-cyber-pink box-glow-cyan" />}
            </button>
          );
        })}
      </nav>

      {/* User Actions HUD */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Search Shortcut */}
        <button
          onClick={() => {
            sound.playClick();
            onNavigate('CATALOG');
          }}
          title="유물 검색"
          className="p-2 rounded-lg border border-white/15 bg-white/5 hover:border-cyber-cyan text-gray-300 hover:text-white transition-all"
        >
          <Search className="w-4 h-4" />
        </button>

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

        {/* Warp Tracking Radar Button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenTracking();
          }}
          onMouseEnter={() => sound.playHover()}
          title="차원 배송 레이더"
          className="relative p-2 rounded-lg border border-cyber-green/40 bg-cyber-green/10 text-cyber-green hover:border-cyber-green transition-all"
        >
          <Rocket className="w-4 h-4" />
          {shipmentCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyber-green animate-ping" />
          )}
        </button>

        {/* Wishlist Button */}
        <button
          onClick={() => {
            sound.playWishlist();
            onOpenWishlist();
          }}
          onMouseEnter={() => sound.playHover()}
          title="위시리스트"
          className="relative p-2 rounded-lg border border-cyber-pink/40 bg-cyber-pink/10 text-cyber-pink hover:border-cyber-pink transition-all"
        >
          <Heart className="w-4 h-4" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-cyber-pink text-[9px] font-black text-white flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </button>

        {/* Chrono Credits */}
        <div
          onClick={() => {
            sound.playClick();
            onOpenProfile();
          }}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-cyber-gold/40 bg-cyber-gold/5 font-mono text-xs text-cyber-gold cursor-pointer hover:bg-cyber-gold/15 transition-all"
          title="소울 프로필 보기"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyber-gold animate-spin-slow" />
          <span className="font-bold">{user.chronoCredits.toLocaleString()}</span>
          <span className="text-[10px] text-cyber-gold/70">CC</span>
        </div>

        {/* Soul Profile or Login */}
        {user.isSynced ? (
          <button
            onClick={() => {
              sound.playClick();
              onOpenProfile();
            }}
            onMouseEnter={() => sound.playHover()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-cyber-green/50 bg-cyber-green/10 text-cyber-green text-xs font-orbitron font-semibold tracking-wider hover:bg-cyber-green/20 transition-all"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{user.soulName}</span>
          </button>
        ) : (
          <button
            onClick={() => {
              sound.playClick();
              onOpenLogin();
            }}
            onMouseEnter={() => sound.playHover()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-cyber-pink/50 bg-cyber-pink/10 text-cyber-pink hover:bg-cyber-pink hover:text-white text-xs font-orbitron font-semibold tracking-wider box-glow-pink transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>SOUL SYNC</span>
          </button>
        )}

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
