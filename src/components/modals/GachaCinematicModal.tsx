import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { GachaResult } from '../../types';
import { Sparkles, Star, Zap, Check, X, ShieldAlert } from 'lucide-react';
import { sound } from '../../engine/soundEngine';

interface GachaCinematicModalProps {
  isOpen: boolean;
  results: GachaResult[];
  onClose: () => void;
  onAcceptAll: () => void;
}

export const GachaCinematicModal: React.FC<GachaCinematicModalProps> = ({
  isOpen,
  results,
  onClose,
  onAcceptAll,
}) => {
  const [phase, setPhase] = useState<'METEOR' | 'REVEAL'>('METEOR');

  useEffect(() => {
    if (isOpen) {
      setPhase('METEOR');
      sound.playGachaThunder();

      // Trigger Confetti Storm
      const timer1 = setTimeout(() => {
        setPhase('REVEAL');
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#ff007f', '#ffd700', '#ffffff'],
        });
      }, 1500);

      return () => clearTimeout(timer1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
      {/* Meteor / Summoning Stage */}
      {phase === 'METEOR' ? (
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="relative w-48 h-48 rounded-full flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-cyber-gold animate-ping opacity-75" />
            <div className="absolute inset-0 rounded-full border-2 border-cyber-pink animate-spin-slow" />
            <Zap className="w-24 h-24 text-cyber-yellow animate-bounce drop-shadow-[0_0_35px_#ffd700]" />
          </div>
          <div className="text-2xl md:text-4xl font-black font-orbitron text-cyber-gold tracking-widest animate-pulse">
            ✦ SUMMONING DIMENSIONAL SOULS ✦
          </div>
          <div className="text-xs font-mono text-cyber-cyan">
            REALITY FABRIC RIPPING // SSR GUARANTEED RESONANCE
          </div>
        </div>
      ) : (
        /* Reveal Results Grid */
        <div className="w-full max-w-5xl p-6 md:p-8 rounded-3xl bg-[#060a22]/90 border border-cyber-gold/50 box-glow-gold flex flex-col max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-cyber-gold/30">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-cyber-gold animate-spin-slow" />
              <h3 className="text-xl md:text-2xl font-black font-orbitron text-cyber-gold">
                DIVINE SUMMON RESULTS
              </h3>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg border border-white/20 hover:border-white text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 my-6 overflow-y-auto pr-1">
            {results.map((res, index) => {
              const p = res.product;
              const isSSR = p.rarity === 'MYTHIC_SSR' || res.isGuaranteedSSR;
              return (
                <div
                  key={index}
                  className={`relative p-3 rounded-xl border flex flex-col justify-between transition-all duration-300 transform hover:scale-105 ${
                    isSSR
                      ? 'border-cyber-gold bg-cyber-gold/15 box-glow-gold ssr-rainbow'
                      : 'border-cyber-cyan/40 bg-black/60'
                  }`}
                >
                  {/* Top Badge */}
                  <div className="flex justify-between items-center text-[9px] font-mono mb-2">
                    <span className={`px-1.5 py-0.5 rounded font-bold ${isSSR ? 'bg-cyber-gold text-black' : 'bg-cyber-cyan/20 text-cyber-cyan'}`}>
                      {p.rarity}
                    </span>
                    <span className="text-cyber-yellow flex items-center">
                      <Star className="w-2.5 h-2.5 fill-cyber-yellow mr-0.5" />
                      {p.rating}
                    </span>
                  </div>

                  {/* Image */}
                  <div className="aspect-square rounded-lg overflow-hidden border border-white/10 mb-2">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Title & Stats */}
                  <div className="space-y-1">
                    <div className="font-orbitron font-bold text-xs text-white truncate">
                      {p.name}
                    </div>
                    <div className="text-[10px] font-mono text-gray-400 truncate">
                      {p.title}
                    </div>
                    <div className="text-[10px] font-mono text-cyber-cyan">
                      ⚡ {p.powerLevel.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action */}
          <div className="pt-2 border-t border-white/10 flex justify-end">
            <button
              onClick={() => {
                sound.playEquip();
                onAcceptAll();
                onClose();
              }}
              className="px-8 py-3.5 rounded-xl font-orbitron font-black text-xs tracking-wider text-black bg-gradient-to-r from-cyber-yellow via-cyber-gold to-cyber-pink hover:scale-105 transition-all box-glow-gold flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>CLAIM ALL RELICS & ADD TO INVENTORY</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
