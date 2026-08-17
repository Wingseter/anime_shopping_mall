import React, { useState } from 'react';
import { Product } from '../types';
import { ENCHANT_LEVELS } from '../data/products';
import { GlitchText } from '../components/ui/GlitchText';
import { ArrowLeft, Sparkles, Zap, ShoppingCart, Rocket, Heart, Check, Star, RotateCw, MessageSquare, ShieldCheck, Share2 } from 'lucide-react';
import { sound } from '../engine/soundEngine';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  isWishlisted: boolean;
  isCartFlying: boolean;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, enchantLevel: number, finalPrice: number) => void;
  onTriggerDroneBuy: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onDirectCheckout: (product: Product, enchantLevel: number) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  isWishlisted,
  isCartFlying,
  onBack,
  onSelectProduct,
  onAddToCart,
  onTriggerDroneBuy,
  onToggleWishlist,
  onDirectCheckout,
}) => {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedEnchant, setSelectedEnchant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [is3DMode, setIs3DMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'SPECS' | 'LORE' | 'REVIEWS'>('SPECS');

  const currentEnchant = ENCHANT_LEVELS[selectedEnchant] || ENCHANT_LEVELS[0];
  const finalSinglePrice = Math.round(product.price * currentEnchant.multiplier);
  const totalAmount = finalSinglePrice * quantity;

  const images = product.thumbnails && product.thumbnails.length > 0 ? product.thumbnails : [product.image];
  const relatedProducts = allProducts.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);

  const handleEnchantChange = (lvl: number) => {
    sound.playEnchant(lvl);
    setSelectedEnchant(lvl);
  };

  return (
    <div className="pt-24 pb-20 px-4 md:px-12 max-w-7xl mx-auto z-10 relative">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="flex items-center space-x-2 text-xs font-orbitron font-bold text-cyber-cyan hover:text-white px-4 py-2 rounded-xl bg-black/60 border border-white/10 hover:border-cyber-cyan transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO CATALOG</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              sound.playWishlist();
              onToggleWishlist(product.id);
            }}
            className={`p-2.5 rounded-xl border transition-all ${
              isWishlisted ? 'bg-cyber-pink text-white border-cyber-pink box-glow-pink' : 'bg-black/60 text-gray-400 border-white/20 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main 2-Column Product Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Gallery & 3D Interactive Viewer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden border-2 border-cyber-cyan/40 bg-black/80 box-glow-cyan group">
            <img
              src={selectedImage}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-700 ${is3DMode ? 'scale-125 rotate-6' : 'group-hover:scale-105'}`}
            />

            {/* Dynamic Enchant Glow */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen transition-all duration-500"
              style={{ backgroundColor: currentEnchant.glowColor }}
            />

            {/* 360 Mode Button */}
            <button
              onClick={() => {
                sound.playClick();
                setIs3DMode(!is3DMode);
              }}
              className={`absolute bottom-4 left-4 px-3.5 py-2 rounded-xl border text-xs font-mono flex items-center space-x-2 transition-all ${
                is3DMode ? 'bg-cyber-cyan text-black font-bold box-glow-cyan' : 'bg-black/80 text-white border-white/20'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${is3DMode ? 'animate-spin' : ''}`} />
              <span>{is3DMode ? '3D HOLOGRAM ACTIVE' : 'TOGGLE 360° HOLOGRAM'}</span>
            </button>

            <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/80 border border-cyber-gold text-xs font-mono font-bold text-cyber-gold">
              {product.rarity}
            </div>
          </div>

          {/* Thumbnails Strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img ? 'border-cyber-cyan scale-105 box-glow-cyan' : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Enchantment Customizer Matrix */}
          <div className="p-5 rounded-2xl bg-[#060a22]/90 border border-cyber-gold/40 backdrop-blur-md space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-cyber-yellow font-bold flex items-center space-x-1">
                <Sparkles className="w-4 h-4 text-cyber-gold" />
                <span>양자 인챈트 강화 시뮬레이터</span>
              </span>
              <span className="text-cyber-gold font-bold">{currentEnchant.name}</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {ENCHANT_LEVELS.map((ench, idx) => (
                <button
                  key={idx}
                  onClick={() => handleEnchantChange(idx)}
                  className={`py-3 rounded-xl text-xs font-orbitron font-bold border transition-all ${
                    selectedEnchant === idx
                      ? 'bg-cyber-gold text-black border-cyber-gold box-glow-gold scale-105'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  +{idx === 0 ? '0' : idx === 1 ? '1' : idx === 2 ? '3' : idx === 3 ? '7' : '9'}
                </button>
              ))}
            </div>

            <div className="text-xs font-mono text-cyber-cyan">
              ✦ 부여 효과: <strong>{currentEnchant.addedStats}</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Specs, Information & Buy Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyber-pink">
              <span>{product.category}</span>
              <span>•</span>
              <span>{product.jpName}</span>
              <span>•</span>
              <span className="text-cyber-gold font-bold">{product.faction}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black font-orbitron text-white mt-2">
              {product.name}
            </h1>
            <p className="text-sm font-mono text-cyber-cyan mt-1">
              {product.title}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-[#060a22]/80 border border-white/15 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-gray-400 line-through">
                정상가: {product.originalPrice.toLocaleString()} CC
              </div>
              <div className="text-3xl font-black font-orbitron text-cyber-gold">
                {finalSinglePrice.toLocaleString()} <span className="text-xs">CC</span>
              </div>
            </div>

            {/* Quantity Controller */}
            <div className="flex items-center space-x-3 bg-black/60 p-2 rounded-xl border border-white/15">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-white font-bold"
              >
                -
              </button>
              <span className="font-mono font-bold text-sm px-2 text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-white font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-6 border-b border-white/15 text-xs font-orbitron font-bold">
            {[
              { id: 'SPECS', label: 'KEY SPECIFICATIONS' },
              { id: 'LORE', label: 'DIMENSIONAL LORE' },
              { id: 'REVIEWS', label: `REVIEWS (${product.reviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`pb-3 transition-colors relative ${
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
            <div className="space-y-4">
              <p className="text-sm font-sans text-gray-300 leading-relaxed">
                {product.description}
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-gray-400 block mb-1">규격 및 치수</span>
                  <span className="text-white font-bold">{product.dimensions}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-gray-400 block mb-1">기본 파워레벨</span>
                  <span className="text-cyber-gold font-bold">⚡ {product.powerLevel.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs font-mono text-gray-300">
                    <Check className="w-3.5 h-3.5 text-cyber-green shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'LORE' && (
            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono text-gray-300 leading-relaxed space-y-3">
              <div className="text-cyber-gold font-bold">📜 제3성단 비밀 기록</div>
              <p>{product.lore}</p>
            </div>
          )}

          {activeTab === 'REVIEWS' && (
            <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
              {product.reviews.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-gray-400">
                  아직 작성된 리뷰가 없습니다. 첫 구매자가 되어 영혼의 평점을 남겨보세요!
                </div>
              ) : (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-orbitron font-bold text-cyber-cyan">{rev.author}</span>
                      <span className="text-cyber-yellow flex items-center">
                        <Star className="w-3 h-3 fill-cyber-yellow mr-1" />
                        {rev.rating}.0
                      </span>
                    </div>
                    <p className="text-xs text-gray-300">{rev.comment}</p>
                    <div className="text-[10px] font-mono text-gray-500">{rev.date} // 공명도: {rev.resonanceScore}%</div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Action Buttons: Flying Drone Cart & Instant Checkout */}
          <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onTriggerDroneBuy(product);
                onAddToCart(product, selectedEnchant, totalAmount);
              }}
              disabled={isCartFlying}
              className="flex-1 py-4 rounded-xl font-orbitron font-black text-xs tracking-wider text-black bg-gradient-to-r from-cyber-cyan via-white to-cyber-pink hover:scale-102 transition-all box-glow-cyan flex items-center justify-center space-x-2"
            >
              <Rocket className="w-4 h-4 text-black animate-bounce" />
              <span>{isCartFlying ? '드론 카트 수거 중...' : `제트 드론 카트 담기 (${totalAmount.toLocaleString()} CC)`}</span>
            </button>

            <button
              onClick={() => {
                onAddToCart(product, selectedEnchant, totalAmount);
                onDirectCheckout(product, selectedEnchant);
              }}
              className="px-8 py-4 rounded-xl font-orbitron font-bold text-xs tracking-wider text-cyber-gold border border-cyber-gold/50 bg-cyber-gold/15 hover:bg-cyber-gold hover:text-black transition-all box-glow-gold flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>즉시 결제 도약</span>
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-10 border-t border-white/10">
          <div className="text-xl font-black font-orbitron text-white mb-6">
            ✦ 연관 차원 성물 (RELATED ARTIFACTS)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  sound.playClick();
                  onSelectProduct(rel);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hologram-card rounded-2xl p-4 cursor-pointer group"
              >
                <img src={rel.image} alt={rel.name} className="w-full aspect-video rounded-xl object-cover mb-3" />
                <div className="text-[10px] font-mono text-cyber-gold">{rel.rarity}</div>
                <h4 className="font-orbitron font-bold text-sm text-white group-hover:text-cyber-cyan truncate">
                  {rel.name}
                </h4>
                <div className="font-orbitron font-bold text-cyber-gold text-xs mt-2">
                  {rel.price.toLocaleString()} CC
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
