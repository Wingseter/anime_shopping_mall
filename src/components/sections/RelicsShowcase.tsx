import React, { useState } from 'react';
import { Product } from '../../types';
import { GlitchText } from '../ui/GlitchText';
import { Sparkles, Zap, Shield, Flame, Plus, Eye } from 'lucide-react';
import { sound } from '../../engine/soundEngine';

interface RelicsShowcaseProps {
  relics: Product[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const RelicsShowcase: React.FC<RelicsShowcaseProps> = ({
  relics,
  onAddToCart,
  onSelectProduct,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const current = relics[selectedIndex] || relics[0];

  const handleSelect = (index: number) => {
    sound.playSlash();
    setSelectedIndex(index);
  };

  return (
    <section id="relics" className="relative min-h-screen py-24 px-4 md:px-12 flex flex-col justify-center overflow-hidden">
      {/* Background Section Aura */}
      <div 
        className="absolute inset-0 opacity-25 transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 60% 40%, ${current.accentColor} 0%, transparent 65%)`
        }}
      />

      {/* Header */}
      <div className="max-w-6xl mx-auto w-full mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 z-10">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-cyber-gold tracking-widest uppercase mb-2">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>MYTHIC & SSR ARTIFACT STAGE</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-orbitron tracking-wide text-white">
            <GlitchText text="DIVINE RELICS" as="span" />
          </h2>
        </div>
        <p className="text-sm font-mono text-gray-400 max-w-md">
          Silver Palace 스타일 3D 뎁스 롤 전환 시스템. 각 유물은 단 하나의 평행세계 고유 파동을 지닙니다.
        </p>
      </div>

      {/* Main Relic Stage */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left: Role/Relic Selector Tabs */}
        <div className="lg:col-span-3 flex lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-none">
          {relics.map((relic, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={relic.id}
                onClick={() => handleSelect(idx)}
                onMouseEnter={() => sound.playHover()}
                className={`p-3.5 rounded-xl border text-left transition-all duration-300 flex items-center space-x-3 shrink-0 lg:shrink ${
                  isSelected
                    ? 'border-cyber-cyan bg-cyber-cyan/15 box-glow-cyan translate-x-2'
                    : 'border-white/10 bg-[#060a1a]/70 hover:border-white/30 hover:bg-white/5'
                }`}
              >
                <div 
                  className="w-10 h-10 rounded-lg overflow-hidden border flex-shrink-0"
                  style={{ borderColor: relic.accentColor }}
                >
                  <img src={relic.image} alt={relic.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-cyber-gold font-bold uppercase truncate">
                    {relic.rarity}
                  </div>
                  <div className="text-xs font-bold font-orbitron text-white truncate">
                    {relic.name}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    {relic.price.toLocaleString()} CC
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Center: Fullscreen Visual Showcase */}
        <div className="lg:col-span-5 relative group flex flex-col items-center justify-center">
          {/* Hologram Floating Platform */}
          <div className="relative w-full max-w-[380px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/20 p-2 backdrop-blur-xl bg-black/40 box-glow-cyan">
            {/* Ambient Back Glow */}
            <div 
              className="absolute inset-0 opacity-40 blur-2xl transition-all duration-700"
              style={{ backgroundColor: current.accentColor }}
            />
            <img
              src={current.image}
              alt={current.name}
              className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-110"
            />
            {/* Japanese Subtitle Badge */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-md bg-black/80 border border-white/20 font-mono text-xs text-white">
              {current.jpName}
            </div>
            {/* Power Level Badge */}
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-black/80 border border-cyber-cyan/30 flex items-center justify-between">
              <span className="text-[10px] font-mono text-cyber-cyan">POWER LEVEL</span>
              <span className="font-orbitron font-black text-cyber-gold text-sm tracking-widest">
                ⚡ {current.powerLevel.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Stats, Lore & Transmutation Action */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <span className="px-2.5 py-1 rounded-md bg-cyber-pink/20 border border-cyber-pink/50 text-cyber-pink font-mono text-xs font-bold">
              {current.category}
            </span>
            <h3 className="text-2xl font-black font-orbitron text-white mt-3 leading-tight">
              {current.name}
            </h3>
            <p className="text-xs font-mono text-cyber-cyan mt-1">
              {current.title}
            </p>
          </div>

          <p className="text-xs md:text-sm text-gray-300 leading-relaxed bg-[#060a1d]/60 p-3.5 rounded-xl border border-white/10">
            {current.description}
          </p>

          {/* Stats Bar Gauges */}
          <div className="space-y-2.5 font-mono text-xs">
            {Object.entries(current.stats).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-[11px] text-gray-400 mb-1 capitalize">
                  <span>{key}</span>
                  <span className="text-cyber-cyan font-bold">{val} / 1000</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(val / 1000) * 100}%`,
                      backgroundColor: current.accentColor,
                      boxShadow: `0 0 8px ${current.accentColor}`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Price & Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <div className="text-[10px] font-mono text-gray-400 line-through">
                {current.originalPrice.toLocaleString()} CC
              </div>
              <div className="text-2xl font-orbitron font-black text-cyber-gold">
                {current.price.toLocaleString()} <span className="text-xs">CC</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onSelectProduct(current);
                }}
                onMouseEnter={() => sound.playHover()}
                className="p-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all"
                title="3D 홀로그램 상세 보기"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  sound.playEquip();
                  onAddToCart(current);
                }}
                onMouseEnter={() => sound.playHover()}
                className="flex-1 px-5 py-3 rounded-xl font-orbitron font-black text-xs tracking-wider text-black bg-gradient-to-r from-cyber-cyan to-cyber-pink hover:opacity-90 transition-all box-glow-cyan flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>SACRIFICE & BUY</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
