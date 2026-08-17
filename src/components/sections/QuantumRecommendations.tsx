import React, { useState, useEffect } from 'react';
import { Product, Faction } from '../../types';
import { GlitchText } from '../ui/GlitchText';
import { Sparkles, Zap, Flame, Clock, Plus, ShieldCheck, ArrowRight, Heart } from 'lucide-react';
import { sound } from '../../engine/soundEngine';

interface QuantumRecommendationsProps {
  products: Product[];
  userFaction: Faction;
  wishlistIds: string[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
}

export const QuantumRecommendations: React.FC<QuantumRecommendationsProps> = ({
  products,
  userFaction,
  wishlistIds,
  onAddToCart,
  onSelectProduct,
  onToggleWishlist,
}) => {
  // Flash Sale Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter Recommendations based on Faction
  const factionMatches = products.filter((p) => p.faction === userFaction);
  const recommendedItems = factionMatches.length > 0 ? factionMatches : products.slice(0, 3);

  // Synergy Pair
  const katana = products.find((p) => p.id === 'relic-katana-01');
  const stealthCoat = products.find((p) => p.id === 'relic-hoodie-07');

  return (
    <section id="recommendations" className="relative py-20 px-4 md:px-12 z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Flash Sale Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-red-950/70 via-black/80 to-purple-950/70 border-2 border-cyber-pink/50 backdrop-blur-xl box-glow-pink flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-cyber-pink/20 border border-cyber-pink text-cyber-pink animate-bounce">
              <Flame className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-cyber-pink tracking-widest font-bold">
                <Clock className="w-4 h-4 animate-spin-slow" />
                <span>DIMENSIONAL RIFT FLASH SALE // 45% INSTANT TRANSMUTATION</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black font-orbitron text-white mt-1">
                시공간 균열 한정 특가 매트릭스
              </h3>
            </div>
          </div>

          {/* Digital Flip Clock */}
          <div className="flex items-center space-x-3 font-orbitron font-black text-xl md:text-2xl">
            <div className="px-4 py-2 rounded-xl bg-black/80 border border-cyber-pink text-cyber-pink">
              {String(timeLeft.hours).padStart(2, '0')}
              <span className="block text-[8px] font-mono text-gray-400">HOURS</span>
            </div>
            <span className="text-cyber-pink">:</span>
            <div className="px-4 py-2 rounded-xl bg-black/80 border border-cyber-pink text-cyber-pink">
              {String(timeLeft.minutes).padStart(2, '0')}
              <span className="block text-[8px] font-mono text-gray-400">MINS</span>
            </div>
            <span className="text-cyber-pink">:</span>
            <div className="px-4 py-2 rounded-xl bg-black/80 border border-cyber-yellow text-cyber-yellow animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
              <span className="block text-[8px] font-mono text-gray-400">SECS</span>
            </div>
          </div>
        </div>

        {/* AI Quantum Faction Recommendations */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyber-cyan tracking-widest uppercase mb-1">
                <Sparkles className="w-4 h-4 text-cyber-gold animate-spin-slow" />
                <span>AI QUANTUM RESONANCE PROTOCOL</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black font-orbitron text-white">
                <GlitchText text="RECOMMENDED FOR YOUR FACTION" as="span" />
              </h2>
            </div>
            <p className="text-xs font-mono text-gray-400 mt-2 md:mt-0">
              세력 <span className="text-cyber-gold font-bold">[{userFaction}]</span>의 마나 파동과 99.7% 일치하는 맞춤형 유물
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedItems.map((product) => {
              const isWish = wishlistIds.includes(product.id);
              return (
                <div
                  key={product.id}
                  className="hologram-card rounded-2xl p-5 flex flex-col justify-between group"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/10">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    
                    {/* Wishlist Heart */}
                    <button
                      onClick={() => onToggleWishlist(product.id)}
                      className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md border transition-all ${
                        isWish ? 'bg-cyber-pink text-white border-cyber-pink box-glow-pink' : 'bg-black/60 text-gray-300 border-white/20 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWish ? 'fill-white' : ''}`} />
                    </button>

                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-cyber-cyan/40 text-[9px] font-mono text-cyber-cyan font-bold">
                      RESONANCE 99.8%
                    </div>
                  </div>

                  <div className="space-y-1 mb-4">
                    <div className="text-[10px] font-mono text-cyber-gold">{product.rarity}</div>
                    <h4 className="font-orbitron font-bold text-sm text-white group-hover:text-cyber-cyan transition-colors truncate">
                      {product.name}
                    </h4>
                    <p className="text-[11px] font-mono text-gray-400 line-clamp-1">{product.title}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="font-orbitron font-bold text-cyber-gold text-sm">
                      {product.price.toLocaleString()} CC
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          sound.playClick();
                          onSelectProduct(product);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 text-xs text-white hover:bg-white/10"
                      >
                        상세
                      </button>
                      <button
                        onClick={() => {
                          sound.playEquip();
                          onAddToCart(product);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyber-cyan hover:bg-white text-black font-bold text-xs"
                      >
                        담기
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quantum Synergy Combo Matrix */}
        {katana && stealthCoat && (
          <div className="p-6 md:p-8 rounded-3xl bg-[#060a22]/90 border border-cyber-cyan/40 backdrop-blur-xl box-glow-cyan">
            <div className="flex items-center space-x-2 text-xs font-mono text-cyber-yellow tracking-widest uppercase mb-2">
              <Zap className="w-4 h-4 text-cyber-yellow" />
              <span>SYNERGY RESONANCE MATRIX (+200% POWER BOOST)</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black font-orbitron text-white mb-6">
              [네오 도쿄 암살자 세트] 시공간 절단 듀오
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Item 1 */}
              <div className="md:col-span-4 p-4 rounded-xl bg-black/60 border border-white/10 flex items-center space-x-3">
                <img src={katana.image} alt={katana.name} className="w-16 h-16 rounded-lg object-cover border border-cyber-cyan/40" />
                <div className="min-w-0">
                  <div className="text-xs font-orbitron font-bold text-white truncate">{katana.name}</div>
                  <div className="text-[10px] font-mono text-cyber-gold">{katana.price.toLocaleString()} CC</div>
                </div>
              </div>

              {/* Plus Sign */}
              <div className="md:col-span-1 flex justify-center text-cyber-pink font-orbitron font-black text-2xl">
                +
              </div>

              {/* Item 2 */}
              <div className="md:col-span-4 p-4 rounded-xl bg-black/60 border border-white/10 flex items-center space-x-3">
                <img src={stealthCoat.image} alt={stealthCoat.name} className="w-16 h-16 rounded-lg object-cover border border-cyber-pink/40" />
                <div className="min-w-0">
                  <div className="text-xs font-orbitron font-bold text-white truncate">{stealthCoat.name}</div>
                  <div className="text-[10px] font-mono text-cyber-gold">{stealthCoat.price.toLocaleString()} CC</div>
                </div>
              </div>

              {/* Action Button */}
              <div className="md:col-span-3">
                <button
                  onClick={() => {
                    sound.playGachaThunder();
                    onAddToCart(katana);
                    onAddToCart(stealthCoat);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className="w-full py-4 rounded-xl font-orbitron font-black text-xs tracking-wider text-black bg-gradient-to-r from-cyber-yellow via-cyber-gold to-cyber-pink hover:scale-105 transition-all box-glow-gold flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>연성 세트 일괄 담기</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
