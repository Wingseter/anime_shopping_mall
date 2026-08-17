import React, { useState } from 'react';
import { X, Fingerprint, ShieldCheck, Zap, Sparkles, Orbit, Compass, Flame, ShieldAlert } from 'lucide-react';
import { sound } from '../../engine/soundEngine';
import { UserSoulProfile, Faction } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (profile: Partial<UserSoulProfile>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [tab, setTab] = useState<'LOGIN' | 'REGISTER'>('REGISTER');
  const [soulName, setSoulName] = useState('CYBER_RUNNER_909');
  const [selectedFaction, setSelectedFaction] = useState<Faction>('NEO_TOKYO');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  if (!isOpen) return null;

  const factions: { id: Faction; name: string; desc: string; icon: typeof Flame; color: string; border: string }[] = [
    { id: 'NEO_TOKYO', name: '네오 도쿄 신디케이트', desc: '사이버 카타나 & 플라즈마 나노테크', icon: Flame, color: 'text-cyber-cyan', border: 'border-cyber-cyan' },
    { id: 'CELESTIAL', name: '아스트랄 생츄어리', desc: '천사 광익 & 태양 플레어 신성 성물', icon: Sparkles, color: 'text-cyber-gold', border: 'border-cyber-gold' },
    { id: 'ABYSS', name: '심연의 보이드 아콘', desc: '암흑물질 특이점 & 블랙홀 에너지', icon: ShieldAlert, color: 'text-cyber-purple', border: 'border-cyber-purple' },
    { id: 'CHRONOS', name: '시공간 크로노스 감시자', desc: '타키온 시간 지연 & 타임스톱 유물', icon: Orbit, color: 'text-cyber-pink', border: 'border-cyber-pink' },
  ];

  const handleExecuteAuth = () => {
    sound.playSlash();
    setScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          sound.playGachaThunder();

          setTimeout(() => {
            onAuthSuccess({
              isSynced: true,
              soulName: soulName || 'CYBER_HERO',
              soulRank: 'GRANDMASTER_SSR',
              faction: selectedFaction,
              chronoCredits: 777000,
              manaResonance: 99.9,
            });
            onClose();
          }, 600);
          return 100;
        }
        return prev + 15;
      });
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
      <div className="relative w-full max-w-xl p-6 md:p-8 rounded-3xl bg-[#060a22] border border-cyber-cyan/50 box-glow-cyan">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg border border-white/10 hover:border-white/30"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 mb-6">
          <button
            onClick={() => {
              sound.playClick();
              setTab('REGISTER');
            }}
            className={`flex-1 pb-3 text-xs md:text-sm font-orbitron font-bold tracking-wider transition-colors relative ${
              tab === 'REGISTER' ? 'text-cyber-cyan' : 'text-gray-400 hover:text-white'
            }`}
          >
            차원 신규 계약 (REGISTER)
            {tab === 'REGISTER' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-cyber-cyan box-glow-cyan" />}
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setTab('LOGIN');
            }}
            className={`flex-1 pb-3 text-xs md:text-sm font-orbitron font-bold tracking-wider transition-colors relative ${
              tab === 'LOGIN' ? 'text-cyber-pink' : 'text-gray-400 hover:text-white'
            }`}
          >
            영혼 동기화 로그인 (LOGIN)
            {tab === 'LOGIN' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-cyber-pink box-glow-pink" />}
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5">
              SOUL IDENTIFIER (영혼 닉네임)
            </label>
            <input
              type="text"
              value={soulName}
              onChange={(e) => setSoulName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/20 font-mono text-sm text-cyber-cyan focus:outline-none focus:border-cyber-cyan"
            />
          </div>

          {tab === 'REGISTER' && (
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-2">
                CHOOSE YOUR FACTION (소속 세력 선택)
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {factions.map((fac) => {
                  const Icon = fac.icon;
                  const isSelected = selectedFaction === fac.id;
                  return (
                    <button
                      key={fac.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedFaction(fac.id);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? `${fac.border} bg-white/10 scale-102`
                          : 'border-white/10 bg-black/40 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon className={`w-4 h-4 ${fac.color}`} />
                        <span className={`text-xs font-orbitron font-bold ${fac.color}`}>{fac.name}</span>
                      </div>
                      <p className="text-[10px] font-mono text-gray-400 line-clamp-1">{fac.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scanner Feedback */}
          <div className="p-4 rounded-xl bg-black/80 border border-cyber-cyan/30 flex items-center space-x-3">
            <Fingerprint className={`w-8 h-8 ${scanning ? 'text-cyber-pink animate-pulse' : 'text-cyber-cyan'}`} />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-mono text-cyber-gold font-bold">
                {scanning ? `BIOMETRIC SCANNING: ${scanProgress}%` : 'READY TO ENGAGE NEURAL LINK'}
              </div>
              <div className="text-[10px] font-mono text-gray-400 truncate">
                {tab === 'REGISTER' ? '가입 즉시 777,000 크로노 크레딧(CC) 자동 지급' : '기존 생체 서약 키 복원'}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleExecuteAuth}
            disabled={scanning}
            className="w-full py-4 rounded-xl font-orbitron font-black text-xs tracking-widest text-black bg-gradient-to-r from-cyber-cyan via-white to-cyber-pink hover:scale-102 transition-all box-glow-cyan flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-black" />
            <span>{scanning ? 'SYNCHRONIZING...' : tab === 'REGISTER' ? '차원 계약 체결 & 보너스 수령' : '영혼 즉시 동기화'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
