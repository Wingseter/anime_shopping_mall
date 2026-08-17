import React from 'react';
import { X, Sparkles, Zap, Shield, ShoppingCart, Check, Star } from 'lucide-react';
import { Product } from '../../types';
import { sound } from '../../engine/soundEngine';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#060a22] border border-cyber-cyan/40 box-glow-cyan p-6 md:p-8 max-h-[90vh] overflow-y-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Visual Showcase */}
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/20 bg-black/60">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded bg-black/80 border border-cyber-gold text-[10px] font-mono text-cyber-gold font-bold">
              {product.rarity}
            </div>
            <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-lg bg-black/80 border border-white/20 flex justify-between items-center text-xs font-mono">
              <span className="text-gray-400">DIMENSIONS</span>
              <span className="text-cyber-cyan font-bold">{product.dimensions}</span>
            </div>
          </div>

          {/* Details & Lore */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-cyber-pink">
                <span>{product.category}</span>
                <span>•</span>
                <span className="text-gray-400">{product.jpName}</span>
              </div>
              <h3 className="text-2xl font-black font-orbitron text-white mt-1">
                {product.name}
              </h3>
              <p className="text-xs font-mono text-cyber-cyan mt-0.5">
                {product.title}
              </p>
            </div>

            {/* Lore */}
            <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 text-xs font-sans text-gray-300 leading-relaxed">
              <div className="text-[10px] font-mono text-cyber-gold font-bold mb-1">
                📜 DIMENSIONAL LORE
              </div>
              {product.lore}
            </div>

            {/* Features list */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-gray-400">KEY SPECIFICATIONS</div>
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs text-gray-300 font-mono">
                  <Check className="w-3.5 h-3.5 text-cyber-green shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Price & Action */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-gray-400 line-through">
                  {product.originalPrice.toLocaleString()} CC
                </div>
                <div className="text-2xl font-black font-orbitron text-cyber-gold">
                  {product.price.toLocaleString()} <span className="text-xs">CC</span>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playEquip();
                  onAddToCart(product);
                  onClose();
                }}
                onMouseEnter={() => sound.playHover()}
                className="px-6 py-3 rounded-xl font-orbitron font-black text-xs tracking-wider text-black bg-gradient-to-r from-cyber-cyan to-cyber-pink hover:scale-105 transition-all box-glow-cyan flex items-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>ADD TO CART</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
