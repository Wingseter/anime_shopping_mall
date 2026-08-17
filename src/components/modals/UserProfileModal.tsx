import React from 'react';
import { X, ShieldCheck, Sparkles, Zap, Award, Coins, Package, Flame } from 'lucide-react';
import { sound } from '../../engine/soundEngine';
import { UserSoulProfile, Product } from '../../types';

interface UserProfileModalProps {
  isOpen: boolean;
  user: UserSoulProfile;
  onClose: () => void;
  onChargeCredits: () => void;
  onOpenItemDetail: (item: Product) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  user,
  onClose,
  onChargeCredits,
  onOpenItemDetail,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#060a22] border border-cyber-cyan/50 box-glow-cyan p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg border border-white/10 hover:border-white/30"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 pb-6 border-b border-white/10">
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyber-cyan via-cyber-pink to-cyber-gold p-[2px] animate-pulse-glow">
            <div className="w-full h-full bg-[#050818] rounded-2xl flex items-center justify-center">
              <Award className="w-10 h-10 text-cyber-gold" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyber-pink/20 border border-cyber-pink/40 text-cyber-pink font-mono text-[10px] font-bold">
                {user.soulRank}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyber-cyan/20 border border-cyber-cyan/40 text-cyber-cyan font-mono text-[10px] font-bold">
                {user.faction}
              </span>
            </div>
            <h3 className="text-2xl font-black font-orbitron text-white">
              {user.soulName}
            </h3>
            <div className="text-xs font-mono text-gray-400">
              NEURAL HASH: <span className="text-cyber-cyan">{user.biometricId || '0x7F99-ALPHA'}</span>
            </div>
          </div>

          {/* Credits Box */}
          <div className="p-4 rounded-xl bg-black/60 border border-cyber-gold/40 text-center sm:text-right">
            <div className="text-[10px] font-mono text-gray-400">보유 크로노 크레딧</div>
            <div className="text-xl font-black font-orbitron text-cyber-gold">
              {user.chronoCredits.toLocaleString()} <span className="text-xs">CC</span>
            </div>
            <button
              onClick={() => {
                sound.playGachaThunder();
                onChargeCredits();
              }}
              className="mt-2 px-3 py-1 rounded bg-cyber-gold text-black font-orbitron font-bold text-[10px] hover:bg-white transition-colors"
            >
              + 100,000 CC 무료 충전
            </button>
          </div>
        </div>

        {/* Resonance Stats Bar */}
        <div className="my-6 p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-gray-300">마나 공명 지수 (Mana Resonance)</span>
            <span className="text-cyber-cyan font-bold">{user.manaResonance}% SYNC</span>
          </div>
          <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-pink"
              style={{ width: `${user.manaResonance}%` }}
            />
          </div>
        </div>

        {/* Inventory Section */}
        <div>
          <div className="flex items-center space-x-2 text-xs font-orbitron font-bold text-white mb-3">
            <Package className="w-4 h-4 text-cyber-yellow" />
            <span>ACQUIRED SOUL INVENTORY (보유 유물)</span>
          </div>

          {user.inventory.length === 0 ? (
            <div className="p-8 rounded-xl bg-black/40 border border-dashed border-white/10 text-center text-gray-400 text-xs font-mono">
              보유 중인 유물이 없습니다. 가챠 제단 또는 오픈마켓에서 유물을 획득하세요.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {user.inventory.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    sound.playClick();
                    onOpenItemDetail(item);
                  }}
                  className="p-2.5 rounded-xl bg-black/60 border border-white/10 hover:border-cyber-cyan cursor-pointer group transition-all"
                >
                  <img src={item.image} alt={item.name} className="w-full aspect-square rounded-lg object-cover mb-2" />
                  <div className="text-[10px] font-orbitron font-bold text-white truncate group-hover:text-cyber-cyan">
                    {item.name}
                  </div>
                  <div className="text-[9px] font-mono text-cyber-gold">{item.rarity}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
