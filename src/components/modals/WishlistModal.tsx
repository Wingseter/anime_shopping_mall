import React from 'react';
import { X, Heart, ShoppingBag, Trash2, Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { sound } from '../../engine/soundEngine';

interface WishlistModalProps {
  isOpen: boolean;
  wishlistProducts: Product[];
  onClose: () => void;
  onRemoveWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  wishlistProducts,
  onClose,
  onRemoveWishlist,
  onAddToCart,
  onOpenDetail,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-md h-full bg-[#050818] border-l border-cyber-pink/30 flex flex-col p-6 shadow-[-10px_0_30px_rgba(255,0,127,0.2)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyber-pink/20">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-cyber-pink fill-cyber-pink" />
            <h3 className="text-lg font-black font-orbitron text-white">
              SOUL WISHLIST ({wishlistProducts.length})
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg border border-white/10 hover:border-white/30 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-2">
              <Heart className="w-12 h-12 text-gray-600 mb-2" />
              <p className="font-orbitron text-sm">관심 유물이 없습니다.</p>
              <p className="text-xs font-mono text-gray-500">
                상품 카드의 하트를 눌러 위시리스트에 각인하세요.
              </p>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-3 hover:border-cyber-pink/40 transition-colors"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 rounded-lg object-cover border border-white/10 shrink-0 cursor-pointer"
                  onClick={() => {
                    sound.playClick();
                    onOpenDetail(product);
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => {
                      sound.playClick();
                      onOpenDetail(product);
                    }}
                    className="font-orbitron font-bold text-xs text-white truncate cursor-pointer hover:text-cyber-cyan"
                  >
                    {product.name}
                  </h4>
                  <div className="text-[10px] font-mono text-cyber-gold">
                    {product.price.toLocaleString()} CC
                  </div>

                  <button
                    onClick={() => {
                      sound.playEquip();
                      onAddToCart(product);
                    }}
                    className="mt-2 text-[10px] font-orbitron font-bold text-cyber-cyan flex items-center space-x-1 hover:text-white"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>장바구니 담기</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    onRemoveWishlist(product.id);
                  }}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
