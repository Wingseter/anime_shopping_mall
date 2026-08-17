import React from 'react';
import { GlitchText } from '../ui/GlitchText';
import { Rocket, ShieldCheck, Zap, Sparkles, Orbit } from 'lucide-react';
import { sound } from '../../engine/soundEngine';
import { CartItem } from '../../types';

interface WarpCheckoutSectionProps {
  cart: CartItem[];
  totalPrice: number;
  onExecuteWarpCheckout: () => void;
  onOpenCart: () => void;
}

export const WarpCheckoutSection: React.FC<WarpCheckoutSectionProps> = ({
  cart,
  totalPrice,
  onExecuteWarpCheckout,
  onOpenCart,
}) => {
  return (
    <section id="checkout" className="relative min-h-[85vh] py-24 px-4 md:px-12 flex flex-col justify-center items-center overflow-hidden z-10">
      {/* Background Warp Aura */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyber-cyan/10 via-black to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10 w-full">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyber-cyan/15 border border-cyber-cyan/50 text-cyber-cyan font-mono text-xs font-bold tracking-widest box-glow-cyan">
          <Orbit className="w-4 h-4 animate-spin-slow" />
          <span>HYPERSPACE WARP ENGINE READY // 100% SECURE QUANTUM CHECKOUT</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black font-orbitron text-white">
          <GlitchText text="TRANSCENDENT WARP CHECKOUT" as="span" />
        </h2>

        <p className="text-xs md:text-sm font-mono text-gray-300 max-w-xl mx-auto">
          선택한 모든 전설의 유물을 당신의 현실 좌표로 즉각 전송합니다. <br />
          버튼을 누르는 순간 웜홀 엔진이 가동되며 초공간 도약 결제가 실행됩니다.
        </p>

        {/* Warp Checkout Card Preview */}
        <div className="max-w-md mx-auto p-6 rounded-2xl bg-[#060a1f]/90 border border-cyber-cyan/30 backdrop-blur-xl box-glow-cyan text-left space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <span className="text-xs font-mono text-gray-400">담긴 전설 아이템</span>
            <span className="font-orbitron font-bold text-sm text-cyber-cyan">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} UNITS
            </span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <span className="text-xs font-mono text-gray-400">차원 도약 결제 총액</span>
            <span className="font-orbitron font-black text-xl text-cyber-gold">
              {totalPrice.toLocaleString()} <span className="text-xs">CC</span>
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[10px] font-mono text-cyber-green">
            <ShieldCheck className="w-4 h-4" />
            <span>양자 암호화 완료 // 세관 검역 면제 프리패스</span>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => {
                sound.playWarp();
                onExecuteWarpCheckout();
              }}
              onMouseEnter={() => sound.playHover()}
              className="w-full py-4 rounded-xl font-orbitron font-black text-sm tracking-widest text-black bg-gradient-to-r from-cyber-cyan via-white to-cyber-pink hover:scale-105 transition-all duration-300 box-glow-pink flex items-center justify-center space-x-2"
            >
              <Rocket className="w-5 h-5 text-black" />
              <span>LAUNCH HYPERSPACE WARP</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenCart();
              }}
              onMouseEnter={() => sound.playHover()}
              className="w-full py-2.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-orbitron text-gray-300 transition-all"
            >
              인벤토리 세부 품목 조정
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
