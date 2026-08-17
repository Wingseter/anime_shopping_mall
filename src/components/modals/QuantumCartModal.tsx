import React from 'react';
import { X, Trash2, Plus, Minus, Rocket, ShoppingBag, Sparkles, Box } from 'lucide-react';
import { CartItem } from '../../types';
import { sound } from '../../engine/soundEngine';
import { CargoBay3D } from '../canvas/CargoBay3D';

interface QuantumCartModalProps {
  isOpen: boolean;
  cart: CartItem[];
  totalPrice: number;
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const QuantumCartModal: React.FC<QuantumCartModalProps> = ({
  isOpen,
  cart,
  totalPrice,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-md h-full bg-[#050818] border-l border-cyber-cyan/30 flex flex-col p-6 shadow-[-10px_0_30px_rgba(0,240,255,0.2)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyber-cyan/20">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-cyber-cyan" />
            <h3 className="text-lg font-black font-orbitron text-white">
              QUANTUM CARGO BAY HUD
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

        {/* 3D Physical Anti-Gravity Chamber */}
        {cart.length > 0 && (
          <div className="my-3 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-cyber-cyan">
              <span className="flex items-center space-x-1">
                <Box className="w-3 h-3 text-cyber-yellow" />
                <span>3D ANTI-GRAVITY CARGO CHAMBER</span>
              </span>
              <span className="text-cyber-gold font-bold">{cart.length} CUBES FLOATING</span>
            </div>
            <CargoBay3D cart={cart} />
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-2">
              <ShoppingBag className="w-12 h-12 text-gray-600 mb-2" />
              <p className="font-orbitron text-sm">카고 베이가 비어있습니다.</p>
              <p className="text-xs font-mono text-gray-500">
                턴테이블에서 제트 드론 카트로 유물을 수거하세요.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-3 hover:border-cyber-cyan/40 transition-colors"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-lg object-cover border border-white/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-orbitron font-bold text-xs text-white truncate">
                    {item.product.name}
                  </h4>
                  <div className="flex items-center space-x-1.5 text-[10px] font-mono">
                    <span className="text-cyber-gold font-bold">
                      {item.finalPrice.toLocaleString()} CC
                    </span>
                    {item.enchantLevel > 0 && (
                      <span className="px-1.5 py-0.2 rounded bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/40">
                        +{item.enchantLevel === 1 ? '1' : item.enchantLevel === 2 ? '3' : item.enchantLevel === 3 ? '7' : '9'} 강
                      </span>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => {
                        sound.playClick();
                        onUpdateQuantity(item.product.id, -1);
                      }}
                      className="p-1 rounded bg-black/50 border border-white/20 hover:border-cyber-cyan text-gray-300"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-mono font-bold text-white px-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        sound.playClick();
                        onUpdateQuantity(item.product.id, 1);
                      }}
                      className="p-1 rounded bg-black/50 border border-white/20 hover:border-cyber-cyan text-gray-300"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playSlash();
                    onRemoveItem(item.product.id);
                  }}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                  title="제거"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-cyber-cyan/20 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-gray-400">결제 총액</span>
              <span className="text-xl font-black font-orbitron text-cyber-gold">
                {totalPrice.toLocaleString()} <span className="text-xs">CC</span>
              </span>
            </div>

            <button
              onClick={() => {
                sound.playWarp();
                onCheckout();
                onClose();
              }}
              onMouseEnter={() => sound.playHover()}
              className="w-full py-3.5 rounded-xl font-orbitron font-black text-xs tracking-wider text-black bg-gradient-to-r from-cyber-cyan to-cyber-pink hover:scale-102 transition-all box-glow-cyan flex items-center justify-center space-x-2"
            >
              <Rocket className="w-4 h-4 text-black" />
              <span>EXECUTE DIMENSION CHECKOUT</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
