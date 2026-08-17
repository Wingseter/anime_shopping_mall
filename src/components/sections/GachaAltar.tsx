import React from 'react';
import { GlitchText } from '../ui/GlitchText';
import { Sparkles, Zap, Flame, ShieldAlert, Award } from 'lucide-react';
import { sound } from '../../engine/soundEngine';

interface GachaAltarProps {
  onPerformGacha: (count: number) => void;
  pityCount: number;
}

export const GachaAltar: React.FC<GachaAltarProps> = ({
  onPerformGacha,
  pityCount,
}) => {
  return (
    <section id="gacha" className="relative min-h-screen py-24 px-4 md:px-12 flex flex-col justify-center items-center overflow-hidden z-10">
      {/* Background Magic Circle & Lightning Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <div className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full border-2 border-cyber-gold animate-spin-slow border-dashed" />
        <div className="absolute w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full border border-cyber-pink animate-spin-slow [animation-direction:reverse]" />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
        {/* Banner Tag */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyber-gold/15 border border-cyber-gold/50 text-cyber-gold font-mono text-xs font-bold tracking-widest box-glow-gold">
          <Award className="w-4 h-4 text-cyber-gold" />
          <span>CELESTIAL SUMMON ALTAR // SSR GUARANTEED PITY SYSTEM</span>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-6xl font-black font-orbitron text-white">
          <GlitchText text="DIVINE GACHA ALTAR" as="span" />
        </h2>

        <p className="text-xs md:text-base font-mono text-gray-300 max-w-2xl mx-auto leading-relaxed">
          차원 경계의 마나를 소모하여 전설의 SSR 유물을 실체화합니다. <br />
          소환 즉시 화면 전체가 황금빛 벼락에 휩싸이는 극상의 컷씬을 경험하십시오.
        </p>

        {/* Pity Progress Gauge */}
        <div className="max-w-md mx-auto p-4 rounded-xl bg-black/60 border border-cyber-gold/30 backdrop-blur-md">
          <div className="flex justify-between text-xs font-mono text-gray-300 mb-2">
            <span>SSR 확정 천장 카운터 (Pity)</span>
            <span className="text-cyber-gold font-bold">{pityCount} / 10 PULLS</span>
          </div>
          <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-cyber-pink via-cyber-yellow to-cyber-gold transition-all duration-500 box-glow-gold"
              style={{ width: `${(pityCount / 10) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] font-mono text-cyber-cyan flex items-center justify-center space-x-1">
            <Sparkles className="w-3 h-3 text-cyber-yellow" />
            <span>10회 누적 시 신화(MYTHIC SSR) 아이템 100% 확정 강림!</span>
          </div>
        </div>

        {/* Summon Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* 1x Summon */}
          <button
            onClick={() => {
              sound.playGachaThunder();
              onPerformGacha(1);
            }}
            onMouseEnter={() => sound.playHover()}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-orbitron font-bold text-sm tracking-widest text-white border border-cyber-cyan/50 bg-cyber-cyan/10 hover:bg-cyber-cyan hover:text-black transition-all duration-300 hover:scale-105 box-glow-cyan flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 text-cyber-cyan" />
            <span>1X DIMENSION PULL (1,600 CC)</span>
          </button>

          {/* 10x Epic Summon */}
          <button
            onClick={() => {
              sound.playGachaThunder();
              onPerformGacha(10);
            }}
            onMouseEnter={() => sound.playHover()}
            className="w-full sm:w-auto px-10 py-4 rounded-xl font-orbitron font-black text-sm tracking-widest text-black bg-gradient-to-r from-cyber-yellow via-cyber-gold to-cyber-pink hover:scale-108 transition-all duration-300 box-glow-gold flex items-center justify-center space-x-2 animate-pulse-glow"
          >
            <Flame className="w-5 h-5 text-red-600 animate-bounce" />
            <span>10X DIVINE SUMMON (16,000 CC)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
