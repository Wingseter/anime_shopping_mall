import React, { useState } from 'react';
import { X, Fingerprint, Eye, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { sound } from '../../engine/soundEngine';
import { UserSoulProfile } from '../../types';

interface SoulSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncSuccess: (profile: Partial<UserSoulProfile>) => void;
}

export const SoulSyncModal: React.FC<SoulSyncModalProps> = ({
  isOpen,
  onClose,
  onSyncSuccess,
}) => {
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [soulName, setSoulName] = useState('CYBER_RUNNER_909');
  const [statusText, setStatusText] = useState('READY TO SCAN BIOMETRIC FREQUENCY');

  if (!isOpen) return null;

  const handleStartScan = () => {
    sound.playSlash();
    setScanning(true);
    setScanProgress(0);
    setStatusText('INITIALIZING QUANTUM RETINA & FINGERPRINT SCAN...');

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          setStatusText('SOUL CONTRACT SYNCHRONIZATION COMPLETE!');
          sound.playGachaThunder();

          setTimeout(() => {
            onSyncSuccess({
              isSynced: true,
              soulName: soulName || 'CYBER_HERO',
              soulRank: 'GRANDMASTER_SSR',
              chronoCredits: 777000,
              manaResonance: 99.9,
            });
            onClose();
          }, 800);
          return 100;
        }
        if (prev === 40) {
          setStatusText('DECRYPTING ANCIENT CYBER RUNE HASH...');
          sound.playClick();
        }
        if (prev === 80) {
          setStatusText('INSCRIBING IMMUTABLE SOUL RECORD...');
          sound.playHover();
        }
        return prev + 10;
      });
    }, 120);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <div className="relative w-full max-w-lg p-6 md:p-8 rounded-2xl bg-[#060a1e] border border-cyber-cyan/50 box-glow-cyan">
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

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan font-mono text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>QUANTUM SOUL CONTRACT</span>
          </div>
          <h3 className="text-2xl font-black font-orbitron text-white">
            BIOMETRIC SOUL SYNC
          </h3>
          <p className="text-xs font-mono text-gray-400">
            신경망 지문 및 홍채 주파수를 동기화하여 차원 상점 VIP 계정을 활성화합니다.
          </p>
        </div>

        {/* Soul Handle Input */}
        <div className="mb-6">
          <label className="block text-xs font-mono text-gray-300 mb-2">
            SOUL IDENTIFIER (닉네임)
          </label>
          <input
            type="text"
            value={soulName}
            onChange={(e) => setSoulName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/20 font-mono text-sm text-cyber-cyan focus:outline-none focus:border-cyber-cyan"
            placeholder="Enter your soul handle..."
          />
        </div>

        {/* Biometric Scanner Visualizer */}
        <div className="relative aspect-[16/9] rounded-xl bg-black/80 border border-cyber-cyan/30 overflow-hidden flex flex-col items-center justify-center p-4 mb-6">
          {/* Laser Scan Line */}
          {scanning && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent scanline-effect shadow-[0_0_15px_#00f0ff]" />
          )}

          <div className="relative z-10 flex flex-col items-center space-y-3">
            <div className="relative p-4 rounded-full border-2 border-cyber-cyan/40 bg-cyber-cyan/5">
              <Fingerprint className={`w-12 h-12 ${scanning ? 'text-cyber-pink animate-pulse' : 'text-cyber-cyan'}`} />
            </div>

            <div className="text-center">
              <div className="text-xs font-mono font-bold text-cyber-gold tracking-widest uppercase">
                {statusText}
              </div>
              {scanning && (
                <div className="text-xs font-orbitron text-cyber-cyan mt-1">
                  SYNC RATE: {scanProgress}%
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sync Trigger Button */}
        <button
          onClick={handleStartScan}
          disabled={scanning}
          onMouseEnter={() => sound.playHover()}
          className="w-full py-3.5 rounded-xl font-orbitron font-black text-xs tracking-widest text-black bg-gradient-to-r from-cyber-cyan via-white to-cyber-pink hover:scale-102 transition-all box-glow-cyan flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Zap className="w-4 h-4 text-black" />
          <span>{scanning ? 'SYNCHRONIZING...' : 'EXECUTE SOUL SYNC (+777,000 CC)'}</span>
        </button>
      </div>
    </div>
  );
};
