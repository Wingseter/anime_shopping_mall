import React from 'react';
import { GlitchText } from '../ui/GlitchText';
import { ArrowDown, Flame, ShieldAlert, Sparkles, Orbit, Compass } from 'lucide-react';
import { sound } from '../../engine/soundEngine';

interface HeroSectionProps {
  onExplore: () => void;
  onGacha: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onGacha }) => {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center px-4 pt-24 pb-16 overflow-hidden">
      {/* Background Cybernetic Rune Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[600px] h-[600px] md:w-[850px] md:h-[850px] rounded-full border border-cyber-cyan/40 animate-spin-slow border-dashed" />
        <div className="absolute w-[450px] h-[450px] md:w-[650px] md:h-[650px] rounded-full border border-cyber-pink/30 animate-spin-slow [animation-direction:reverse]" />
      </div>

      {/* Top Warning Banner */}
      <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyber-pink/10 border border-cyber-pink/40 text-cyber-pink font-mono text-xs tracking-wider mb-6 box-glow-pink animate-pulse">
        <ShieldAlert className="w-3.5 h-3.5" />
        <span>CAUTION: REALITY DISTORTION OVERFLOW // CLASSIFIED S-RANK</span>
      </div>

      {/* Main Epic Hero Title */}
      <div className="text-center max-w-5xl mx-auto z-10 space-y-4">
        <div className="text-xs md:text-sm font-mono tracking-[0.3em] text-cyber-cyan font-bold uppercase">
          ✦ The Open Market of Gods & Relics ✦
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black font-orbitron tracking-tight leading-none text-white">
          <GlitchText text="PROJECT" className="block text-white mb-2" as="span" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyber-cyan via-cyber-pink to-cyber-yellow drop-shadow-[0_0_40px_rgba(0,240,255,0.6)]">
            HYPERION
          </span>
        </h1>

        <p className="text-sm md:text-lg text-gray-300 font-sans max-w-2xl mx-auto leading-relaxed pt-2">
          평행우주에서 소환된 <span className="text-cyber-cyan font-bold">초진동 카타나</span>부터{' '}
          <span className="text-cyber-pink font-bold">암흑물질 특이점 배터리</span>까지. <br className="hidden sm:inline" />
          가독성과 현실의 법칙을 파괴한 <strong className="text-cyber-yellow">압도적 시네마틱 오픈마켓</strong>에 오신 것을 환영합니다.
        </p>
      </div>

      {/* Hero Stat Matrix HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6 my-10 max-w-4xl w-full z-10">
        {[
          { icon: Flame, label: 'TOTAL RELICS', value: '14,892+', color: 'text-cyber-pink', border: 'border-cyber-pink/30' },
          { icon: Orbit, label: 'DIMENSION WARP', value: '0.001 MS', color: 'text-cyber-cyan', border: 'border-cyber-cyan/30' },
          { icon: Sparkles, label: 'SSR RATE BOOST', value: '99.8 %', color: 'text-cyber-gold', border: 'border-cyber-gold/30' },
          { icon: Compass, label: 'SOUL RESONANCE', value: 'INFINITY', color: 'text-cyber-green', border: 'border-cyber-green/30' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              onMouseEnter={() => sound.playHover()}
              className={`p-3 md:p-4 rounded-xl backdrop-blur-md bg-[#05091a]/80 border ${stat.border} hover:scale-105 transition-all duration-300 group`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-gray-400">{stat.label}</span>
                <Icon className={`w-3.5 h-3.5 ${stat.color} group-hover:rotate-12 transition-transform`} />
              </div>
              <div className={`text-lg md:text-xl font-orbitron font-black ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overkill Action Triggers */}
      <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
        <button
          onClick={() => {
            sound.playSlash();
            onExplore();
          }}
          onMouseEnter={() => sound.playHover()}
          className="relative group px-8 py-4 rounded-xl overflow-hidden font-orbitron font-black text-sm tracking-widest text-black bg-gradient-to-r from-cyber-cyan via-white to-cyber-pink transition-all duration-300 hover:scale-105 box-glow-cyan"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          <span className="relative flex items-center space-x-2">
            <span>ENTER BAZAAR</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </span>
        </button>

        <button
          onClick={() => {
            sound.playGachaThunder();
            onGacha();
          }}
          onMouseEnter={() => sound.playHover()}
          className="px-8 py-4 rounded-xl font-orbitron font-bold text-sm tracking-widest text-cyber-gold border border-cyber-gold/60 bg-cyber-gold/10 hover:bg-cyber-gold hover:text-black transition-all duration-300 hover:scale-105 box-glow-gold flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span>DIVINE GACHA ALTAR</span>
        </button>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1 pointer-events-none opacity-60">
        <span className="text-[10px] font-mono tracking-widest text-cyber-cyan">SCROLL TO INVOKE WARP</span>
        <div className="w-4 h-7 rounded-full border border-cyber-cyan/50 flex justify-center p-1">
          <div className="w-1 h-2 bg-cyber-pink rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};
