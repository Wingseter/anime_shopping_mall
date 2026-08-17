import React from 'react';
import { Product } from '../../types';
import { GlitchText } from '../ui/GlitchText';
import { Sparkles, Zap, ChevronLeft, ChevronRight, Eye, ShoppingCart, Rocket, Shield, RotateCw } from 'lucide-react';
import { sound } from '../../engine/soundEngine';

interface CinematicTurntableStageProps {
  products: Product[];
  selectedIndex: number;
  isInspecting: boolean;
  isCartFlying: boolean;
  onPrevItem: () => void;
  onNextItem: () => void;
  onToggleInspect: () => void;
  onTriggerDroneBuy: (product: Product) => void;
  onOpenDetailModal: (product: Product) => void;
}

export const CinematicTurntableStage: React.FC<CinematicTurntableStageProps> = ({
  products,
  selectedIndex,
  isInspecting,
  isCartFlying,
  onPrevItem,
  onNextItem,
  onToggleInspect,
  onTriggerDroneBuy,
  onOpenDetailModal,
}) => {
  const current = products[selectedIndex] || products[0];

  return (
    <section id="turntable" className="relative min-h-screen flex flex-col justify-between p-4 md:p-12 pointer-events-none z-10 select-none">
      {/* Top Stage Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-16 pointer-events-auto">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyber-gold tracking-widest uppercase mb-1">
            <Sparkles className="w-4 h-4 animate-spin-slow text-cyber-gold" />
            <span>3D ROTATING QUANTUM TURNTABLE // CINEMATIC ENGINE</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-orbitron text-white">
            <GlitchText text="THE GODS' TURNTABLE" as="span" />
          </h2>
        </div>

        {/* Drag / Key Controls Hint */}
        <div className="hidden lg:flex items-center space-x-3 px-4 py-2 rounded-xl bg-black/60 border border-cyber-cyan/30 text-xs font-mono text-gray-300">
          <RotateCw className="w-4 h-4 text-cyber-cyan animate-spin-slow" />
          <span>DRAG 3D MOUSE OR USE [A] / [D] / SCROLL TO ROTATE WORLD</span>
        </div>
      </div>

      {/* Center Cinematic Fly-In Hologram Overlay (When Inspecting) */}
      {isInspecting && (
        <div className="my-auto max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 pointer-events-auto animate-fade-in">
          {/* Left Hologram Spec Card */}
          <div className="p-6 rounded-2xl bg-[#060a22]/90 border-2 border-cyber-cyan backdrop-blur-2xl box-glow-cyan space-y-4">
            <div className="flex justify-between items-center">
              <span className="px-2.5 py-0.5 rounded-full bg-cyber-pink/20 text-cyber-pink font-mono text-xs font-bold">
                {current.rarity}
              </span>
              <span className="text-xs font-mono text-cyber-gold font-bold">
                ⚡ POWER {current.powerLevel.toLocaleString()}
              </span>
            </div>

            <div>
              <h3 className="text-2xl md:text-3xl font-black font-orbitron text-white">
                {current.name}
              </h3>
              <p className="text-xs font-mono text-cyber-cyan mt-0.5">
                {current.title}
              </p>
            </div>

            <p className="text-xs font-sans text-gray-300 leading-relaxed bg-black/50 p-3 rounded-xl border border-white/10">
              {current.description}
            </p>

            {/* Quick Stat Gauges */}
            <div className="space-y-1.5 font-mono text-xs">
              {Object.entries(current.stats).map(([k, v]) => (
                <div key={k} className="flex justify-between text-[11px]">
                  <span className="text-gray-400 capitalize">{k}</span>
                  <span className="text-cyber-cyan font-bold">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Hologram Action Console */}
          <div className="p-6 rounded-2xl bg-[#060a22]/90 border-2 border-cyber-pink backdrop-blur-2xl box-glow-pink flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-mono text-cyber-pink font-bold uppercase mb-1">
                ✦ JET DRONE INGESTION SYSTEM
              </div>
              <p className="text-xs font-mono text-gray-300">
                구매 버튼을 누르는 즉시 화면 외곽에서 <span className="text-cyber-cyan font-bold">3D 제트 드론 카트</span>가 날아와 중력 견인 빔으로 유물을 빨아들입니다.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-center">
              <div className="text-[10px] font-mono text-gray-400">즉시 연성 교환가</div>
              <div className="text-3xl font-black font-orbitron text-cyber-gold">
                {current.price.toLocaleString()} <span className="text-xs">CC</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => onTriggerDroneBuy(current)}
                disabled={isCartFlying}
                className="w-full py-4 rounded-xl font-orbitron font-black text-sm tracking-widest text-black bg-gradient-to-r from-cyber-cyan via-white to-cyber-pink hover:scale-105 transition-all box-glow-cyan flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Rocket className="w-5 h-5 text-black animate-bounce" />
                <span>{isCartFlying ? 'DRONE CART INGESTING...' : 'DISPATCH DRONE CART & BUY'}</span>
              </button>

              <button
                onClick={onToggleInspect}
                className="w-full py-2.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-orbitron text-gray-300 transition-all"
              >
                RETURN TO TURNTABLE ORBIT (궤도 복귀)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Turntable Stage Console (When in Orbit Mode) */}
      {!isInspecting && (
        <div className="max-w-4xl mx-auto w-full pb-8 pointer-events-auto space-y-4">
          <div className="p-5 md:p-6 rounded-3xl bg-[#060a22]/85 border border-cyber-cyan/40 backdrop-blur-xl box-glow-cyan flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left/Right Orbit Stepper */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  sound.playClick();
                  onPrevItem();
                }}
                className="p-3 rounded-xl border border-white/20 bg-black/50 hover:border-cyber-cyan hover:text-cyber-cyan text-white transition-all"
                title="이전 유물"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="text-center md:text-left min-w-[200px]">
                <div className="text-[10px] font-mono text-cyber-gold font-bold uppercase">
                  SLOT {selectedIndex + 1} / {products.length} // {current.rarity}
                </div>
                <div className="font-orbitron font-black text-lg md:text-xl text-white truncate">
                  {current.name}
                </div>
                <div className="text-xs font-mono text-cyber-cyan">
                  {current.price.toLocaleString()} CC
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onNextItem();
                }}
                className="p-3 rounded-xl border border-white/20 bg-black/50 hover:border-cyber-cyan hover:text-cyber-cyan text-white transition-all"
                title="다음 유물"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={onToggleInspect}
                onMouseEnter={() => sound.playHover()}
                className="flex-1 md:flex-none px-6 py-3.5 rounded-xl font-orbitron font-bold text-xs tracking-wider text-white border border-cyber-cyan/50 bg-cyber-cyan/15 hover:bg-cyber-cyan hover:text-black transition-all box-glow-cyan flex items-center justify-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>FLY-IN BULLET TIME (3D 줌인)</span>
              </button>

              <button
                onClick={() => onTriggerDroneBuy(current)}
                disabled={isCartFlying}
                onMouseEnter={() => sound.playHover()}
                className="flex-1 md:flex-none px-6 py-3.5 rounded-xl font-orbitron font-black text-xs tracking-wider text-black bg-gradient-to-r from-cyber-yellow via-cyber-gold to-cyber-pink hover:scale-105 transition-all box-glow-gold flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Rocket className="w-4 h-4 text-black" />
                <span>DRONE BUY</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
