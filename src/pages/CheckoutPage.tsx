import React, { useState } from 'react';
import { CartItem } from '../types';
import { GlitchText } from '../components/ui/GlitchText';
import { CargoBay3D } from '../components/canvas/CargoBay3D';
import { Rocket, Trash2, Plus, Minus, ShieldCheck, CreditCard, ArrowLeft, MapPin } from 'lucide-react';
import { sound } from '../engine/soundEngine';

interface CheckoutPageProps {
  cart: CartItem[];
  totalPrice: number;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onExecuteWarpCheckout: () => void;
  onBackToCatalog: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  totalPrice,
  onUpdateQuantity,
  onRemoveItem,
  onExecuteWarpCheckout,
  onBackToCatalog,
}) => {
  const [targetCoordinate, setTargetCoordinate] = useState('대한민국 서울특별시 강남구 테헤란로 152 (현실 좌표)');
  const [paymentMethod, setPaymentMethod] = useState<'CC' | 'QUANTUM_CARD' | 'KONBINI'>('CC');

  return (
    <div className="pt-24 pb-20 px-4 md:px-12 max-w-6xl mx-auto z-10 relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => {
              sound.playClick();
              onBackToCatalog();
            }}
            className="flex items-center space-x-2 text-xs font-orbitron font-bold text-cyber-cyan hover:text-white mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO SHOPPING</span>
          </button>
          <h1 className="text-3xl md:text-5xl font-black font-orbitron text-white">
            <GlitchText text="WARP CHECKOUT SYSTEM" as="span" />
          </h1>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="p-16 rounded-3xl bg-[#060a22]/80 border border-dashed border-white/10 text-center space-y-4">
          <p className="font-orbitron text-lg text-white">인벤토리 카고 베이가 비어있습니다.</p>
          <button
            onClick={onBackToCatalog}
            className="px-6 py-3 rounded-xl bg-cyber-cyan text-black font-bold font-orbitron text-xs"
          >
            오픈마켓 카탈로그로 이동
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 3D Cargo Bay & Cart Items */}
          <div className="lg:col-span-7 space-y-6">
            {/* 3D Chamber */}
            <div className="p-5 rounded-2xl bg-[#060a22]/90 border border-cyber-cyan/40 backdrop-blur-xl box-glow-cyan space-y-2">
              <div className="text-xs font-mono text-cyber-cyan font-bold">
                ✦ 3D ANTI-GRAVITY CARGO BAY ({cart.length} ITEMS LOADED)
              </div>
              <CargoBay3D cart={cart} />
            </div>

            {/* Cart Items List */}
            <div className="p-5 rounded-2xl bg-[#060a22]/80 border border-white/10 space-y-3">
              <div className="text-xs font-orbitron font-bold text-white mb-2">
                SELECTED RELICS & ARTIFACTS
              </div>
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-4 rounded-xl bg-black/60 border border-white/10 flex items-center space-x-4"
                >
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover border border-white/10 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-orbitron font-bold text-xs text-white truncate">
                      {item.product.name}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs font-mono text-cyber-gold mt-0.5">
                      <span>{item.finalPrice.toLocaleString()} CC</span>
                      {item.enchantLevel > 0 && (
                        <span className="px-1.5 py-0.2 rounded bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/40 text-[10px]">
                          +{item.enchantLevel === 1 ? '1' : item.enchantLevel === 2 ? '3' : item.enchantLevel === 3 ? '7' : '9'}강
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="w-6 h-6 rounded bg-white/5 hover:bg-white/15 text-white text-xs"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-xs text-white px-1">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="w-6 h-6 rounded bg-white/5 hover:bg-white/15 text-white text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-2 text-gray-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Coordinates & Payment */}
          <div className="lg:col-span-5 space-y-6">
            {/* Delivery Destination */}
            <div className="p-5 rounded-2xl bg-[#060a22]/80 border border-white/10 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-orbitron font-bold text-white">
                <MapPin className="w-4 h-4 text-cyber-pink" />
                <span>현실 차원 전송 좌표 (DELIVERY ADDRESS)</span>
              </div>
              <textarea
                value={targetCoordinate}
                onChange={(e) => setTargetCoordinate(e.target.value)}
                rows={2}
                className="w-full p-3 rounded-xl bg-black/60 border border-white/20 font-mono text-xs text-white focus:outline-none focus:border-cyber-cyan"
              />
              <div className="text-[10px] font-mono text-cyber-green flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>K-Logistics 3~5일 양자 웜홀 프리패스 적용</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-5 rounded-2xl bg-[#060a22]/80 border border-white/10 space-y-3">
              <div className="text-xs font-orbitron font-bold text-white">
                결제 수단 선택 (PAYMENT METHOD)
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'CC', label: '크로노 크레딧 (CC)' },
                  { id: 'QUANTUM_CARD', label: '양자 카드 (Card)' },
                  { id: 'KONBINI', label: '편의점 결제 (Konbini)' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      sound.playClick();
                      setPaymentMethod(m.id as typeof paymentMethod);
                    }}
                    className={`p-3 rounded-xl text-center font-mono text-[11px] border transition-all ${
                      paymentMethod === m.id
                        ? 'border-cyber-cyan bg-cyber-cyan/15 text-white font-bold box-glow-cyan'
                        : 'border-white/10 bg-black/40 text-gray-400'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Total & Launch Button */}
            <div className="p-6 rounded-2xl bg-[#060a22]/90 border border-cyber-gold/40 backdrop-blur-xl box-glow-gold space-y-4">
              <div className="flex justify-between items-center text-xs font-mono text-gray-300">
                <span>차원 도약 총 결제액</span>
                <span className="text-2xl font-black font-orbitron text-cyber-gold">
                  {totalPrice.toLocaleString()} <span className="text-xs">CC</span>
                </span>
              </div>

              <button
                onClick={() => {
                  sound.playWarp();
                  onExecuteWarpCheckout();
                }}
                className="w-full py-4 rounded-xl font-orbitron font-black text-sm tracking-widest text-black bg-gradient-to-r from-cyber-cyan via-white to-cyber-pink hover:scale-102 transition-all box-glow-pink flex items-center justify-center space-x-2"
              >
                <Rocket className="w-5 h-5 text-black" />
                <span>LAUNCH DIMENSIONAL WARP</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
