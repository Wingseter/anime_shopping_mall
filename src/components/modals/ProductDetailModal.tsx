import React, { useState } from 'react';
import { X, Sparkles, Zap, ShoppingCart, Check, Star, RotateCw, Layers, ShieldCheck, Heart } from 'lucide-react';
import { Product } from '../../types';
import { ENCHANT_LEVELS } from '../../data/products';
import { sound } from '../../engine/soundEngine';

interface ProductDetailModalProps {
  product: Product | null;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, enchantLevel: number, finalPrice: number) => void;
  onToggleWishlist: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isWishlisted,
  onClose,
  onAddToCart,
  onToggleWishlist,
}) => {
  const [selectedEnchant, setSelectedEnchant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [is3DMode, setIs3DMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'SPECS' | 'LORE' | 'REVIEWS'>('SPECS');

  if (!product) return null;

  const currentEnchant = ENCHANT_LEVELS[selectedEnchant] || ENCHANT_LEVELS[0];
  const finalSinglePrice = Math.round(product.price * currentEnchant.multiplier);
  const totalAmount = finalSinglePrice * quantity;

  const handleEnchantChange = (lvl: number) => {
    sound.playEnchant(lvl);
    setSelectedEnchant(lvl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#060a22] border border-cyber-cyan/40 box-glow-cyan p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg border border-white/10 hover:border-white/30"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Visual & 360 Hologram Mode */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/20 bg-black/60 group">
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  is3DMode ? 'scale-125 rotate-6' : 'group-hover:scale-105'
                }`}
              />

              {/* Dynamic Enchant Glow Overlay */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-500 opacity-40 mix-blend-screen"
                style={{ backgroundColor: currentEnchant.glowColor }}
              />

              {/* 360 Mode Indicator */}
              <button
                onClick={() => {
                  sound.playClick();
                  setIs3DMode(!is3DMode);
                }}
                className={`absolute bottom-3 left-3 px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center space-x-1.5 transition-all ${
                  is3DMode
                    ? 'bg-cyber-cyan text-black border-cyber-cyan font-bold box-glow-cyan'
                    : 'bg-black/70 text-gray-300 border-white/20 hover:text-white'
                }`}
              >
                <RotateCw className={`w-3.5 h-3.5 ${is3DMode ? 'animate-spin' : ''}`} />
                <span>{is3DMode ? '3D HOLOGRAM ACTIVE' : '360° HOLOGRAM'}</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => {
                  sound.playWishlist();
                  onToggleWishlist(product.id);
                }}
                className={`absolute top-3 right-3 p-2.5 rounded-full border transition-all ${
                  isWishlisted ? 'bg-cyber-pink text-white border-cyber-pink box-glow-pink' : 'bg-black/60 text-gray-300 border-white/20'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Enchant Option Selector */}
            <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-cyber-yellow font-bold">인챈트 강화 레벨</span>
                <span className="text-cyber-gold font-bold">{currentEnchant.name}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {ENCHANT_LEVELS.map((ench, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleEnchantChange(idx)}
                    className={`py-2 rounded-lg text-xs font-orbitron font-bold border transition-all ${
                      selectedEnchant === idx
                        ? 'bg-cyber-gold text-black border-cyber-gold box-glow-gold'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    +{idx === 0 ? '0' : idx === 1 ? '1' : idx === 2 ? '3' : idx === 3 ? '7' : '9'}
                  </button>
                ))}
              </div>
              <div className="text-[10px] font-mono text-cyber-cyan flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-cyber-gold" />
                <span>{currentEnchant.addedStats}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Specs & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-cyber-pink">
                <span>{product.category}</span>
                <span>•</span>
                <span className="text-gray-400">{product.jpName}</span>
                <span>•</span>
                <span className="text-cyber-gold font-bold">{product.faction}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black font-orbitron text-white mt-1">
                {product.name}
              </h3>
              <p className="text-xs font-mono text-cyber-cyan mt-0.5">
                {product.title}
              </p>

              {/* Tab Navigation */}
              <div className="flex space-x-4 border-b border-white/10 mt-4 mb-3 text-xs font-orbitron font-bold">
                {[
                  { id: 'SPECS', label: 'SPECIFICATIONS' },
                  { id: 'LORE', label: 'DIMENSIONAL LORE' },
                  { id: 'REVIEWS', label: `REVIEWS (${product.reviews.length})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveTab(tab.id as typeof activeTab);
                    }}
                    className={`pb-2 transition-colors relative ${
                      activeTab === tab.id ? 'text-cyber-cyan' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-cyber-cyan box-glow-cyan" />}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'SPECS' && (
                <div className="space-y-2.5">
                  <p className="text-xs font-sans text-gray-300 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                      <span className="text-gray-400">규격: </span>
                      <span className="text-white">{product.dimensions}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                      <span className="text-gray-400">기본 파워레벨: </span>
                      <span className="text-cyber-gold font-bold">{product.powerLevel.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {product.features.map((f, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs font-mono text-gray-300">
                        <Check className="w-3.5 h-3.5 text-cyber-green shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'LORE' && (
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-gray-300 leading-relaxed space-y-2">
                  <div className="text-cyber-gold font-bold">✦ 비밀 고문서 기록</div>
                  <p>{product.lore}</p>
                </div>
              )}

              {activeTab === 'REVIEWS' && (
                <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
                  {product.reviews.length === 0 ? (
                    <div className="text-xs font-mono text-gray-400 p-4 text-center">
                      아직 등록된 다차원 여행자 후기가 없습니다. 첫 번째 리뷰어가 되어보세요!
                    </div>
                  ) : (
                    product.reviews.map((rev) => (
                      <div key={rev.id} className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-orbitron font-bold text-cyber-cyan">{rev.author}</span>
                          <span className="text-cyber-yellow flex items-center">
                            <Star className="w-3 h-3 fill-cyber-yellow mr-1" />
                            {rev.rating}.0
                          </span>
                        </div>
                        <p className="text-gray-300 text-[11px]">{rev.comment}</p>
                        <div className="text-[9px] font-mono text-gray-500">{rev.date} // 공명도: {rev.resonanceScore}%</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions: Quantity, Total & Add to Cart */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-gray-400">단가 (인챈트 포함)</div>
                  <div className="text-xl font-black font-orbitron text-cyber-gold">
                    {finalSinglePrice.toLocaleString()} <span className="text-xs">CC</span>
                  </div>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center space-x-2 bg-black/50 p-1.5 rounded-xl border border-white/10">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sm px-2 text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playEquip();
                  onAddToCart(product, selectedEnchant, totalAmount);
                  onClose();
                }}
                onMouseEnter={() => sound.playHover()}
                className="w-full py-4 rounded-xl font-orbitron font-black text-xs tracking-wider text-black bg-gradient-to-r from-cyber-cyan via-white to-cyber-pink hover:scale-102 transition-all box-glow-cyan flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4 text-black" />
                <span>장바구니 담기 ({totalAmount.toLocaleString()} CC)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
