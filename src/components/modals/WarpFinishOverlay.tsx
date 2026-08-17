import React, { useEffect, useState } from 'react';
import { Rocket, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../engine/soundEngine';

interface WarpFinishOverlayProps {
  isOpen: boolean;
  onFinish: () => void;
}

export const WarpFinishOverlay: React.FC<WarpFinishOverlayProps> = ({
  isOpen,
  onFinish,
}) => {
  const [countdown, setCountdown] = useState(3);
  const [phase, setPhase] = useState<'WARPING' | 'SUCCESS'>('WARPING');

  useEffect(() => {
    if (isOpen) {
      setCountdown(3);
      setPhase('WARPING');
      sound.playWarp();

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setPhase('SUCCESS');
            sound.playGachaThunder();
            confetti({
              particleCount: 200,
              spread: 120,
              origin: { y: 0.5 },
              colors: ['#00f0ff', '#ff007f', '#ffd700', '#00ff66'],
            });
            return 0;
          }
          sound.playClick();
          return prev - 1;
        });
      }, 900);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
      {phase === 'WARPING' ? (
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="relative w-40 h-40 rounded-full flex items-center justify-center border-4 border-cyber-cyan animate-spin-slow">
            <div className="text-6xl font-black font-orbitron text-cyber-pink animate-ping">
              {countdown}
            </div>
          </div>
          <div className="text-3xl font-black font-orbitron text-cyber-cyan tracking-widest animate-pulse">
            ✦ CHARGING HYPERSPACE WARP CORE ✦
          </div>
          <div className="text-xs font-mono text-gray-400">
            TRANSMITTING QUANTUM COORDINATES TO YOUR REALITY...
          </div>
        </div>
      ) : (
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#060a22] border-2 border-cyber-green box-glow-cyan text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-cyber-green/20 border-2 border-cyber-green flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-cyber-green" />
          </div>

          <div>
            <div className="text-xs font-mono text-cyber-green tracking-widest uppercase mb-1">
              ✦ DIMENSION TRANSFER COMPLETE ✦
            </div>
            <h3 className="text-2xl font-black font-orbitron text-white">
              TRANSCENDENCE SUCCESSFUL
            </h3>
            <p className="text-xs font-mono text-gray-300 mt-2">
              모든 전설의 유물이 현실 좌표로 성공적으로 전송되었습니다.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-left text-xs font-mono space-y-1.5">
            <div className="flex justify-between text-gray-400">
              <span>SECURITY HASH</span>
              <span className="text-cyber-cyan font-bold">#HYPER-9029-X</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>STATUS</span>
              <span className="text-cyber-green font-bold">ARRIVED IN PARALLEL REALITY</span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onFinish();
            }}
            className="w-full py-3.5 rounded-xl font-orbitron font-black text-xs tracking-widest text-black bg-cyber-green hover:bg-white transition-all duration-300"
          >
            RETURN TO BAZAAR
          </button>
        </div>
      )}
    </div>
  );
};
