import React, { useState } from 'react';
import { UserSoulProfile, WarpShipment, Product } from '../types';
import { GlitchText } from '../components/ui/GlitchText';
import { Award, Package, Rocket, Heart, Coins, ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../engine/soundEngine';

interface ProfilePageProps {
  user: UserSoulProfile;
  shipments: WarpShipment[];
  allProducts: Product[];
  onChargeCredits: () => void;
  onSelectProduct: (product: Product) => void;
  onRemoveWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  shipments,
  allProducts,
  onChargeCredits,
  onSelectProduct,
  onRemoveWishlist,
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState<'INVENTORY' | 'SHIPMENTS' | 'WISHLIST'>('INVENTORY');

  const wishlistProducts = allProducts.filter((p) => user.wishlistIds.includes(p.id));

  return (
    <div className="pt-24 pb-20 px-4 md:px-12 max-w-6xl mx-auto z-10 relative">
      {/* Header Profile Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#060a22]/90 border border-cyber-cyan/40 backdrop-blur-xl box-glow-cyan mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyber-cyan via-cyber-pink to-cyber-gold p-[2px] animate-pulse-glow">
              <div className="w-full h-full bg-[#050818] rounded-2xl flex items-center justify-center">
                <Award className="w-10 h-10 text-cyber-gold" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-cyber-pink/20 text-cyber-pink font-mono text-xs font-bold">
                  {user.soulRank}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan font-mono text-xs font-bold">
                  {user.faction}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black font-orbitron text-white">
                {user.soulName}
              </h1>
              <div className="text-xs font-mono text-gray-400">
                NEURAL HASH: <span className="text-cyber-cyan">{user.biometricId || '0x7F99-ALPHA'}</span>
              </div>
            </div>
          </div>

          {/* Credits Box */}
          <div className="p-4 rounded-2xl bg-black/60 border border-cyber-gold/40 text-center md:text-right min-w-[200px]">
            <div className="text-xs font-mono text-gray-400">보유 크로노 크레딧</div>
            <div className="text-2xl font-black font-orbitron text-cyber-gold">
              {user.chronoCredits.toLocaleString()} <span className="text-xs">CC</span>
            </div>
            <button
              onClick={() => {
                sound.playGachaThunder();
                onChargeCredits();
              }}
              className="mt-2 w-full px-3 py-2 rounded-xl bg-cyber-gold text-black font-orbitron font-bold text-xs hover:bg-white transition-colors"
            >
              + 100,000 CC 무료 충전
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-white/10 mb-8 text-xs font-orbitron font-bold">
        {[
          { id: 'INVENTORY', label: `SOUL INVENTORY (${user.inventory.length})`, icon: Package },
          { id: 'SHIPMENTS', label: `WARP SHIPMENTS (${shipments.length})`, icon: Rocket },
          { id: 'WISHLIST', label: `WISHLIST (${wishlistProducts.length})`, icon: Heart },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`pb-3 flex items-center space-x-2 transition-colors relative ${
                activeTab === tab.id ? 'text-cyber-cyan' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {activeTab === tab.id && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-cyber-cyan box-glow-cyan" />}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Inventory */}
      {activeTab === 'INVENTORY' && (
        <div>
          {user.inventory.length === 0 ? (
            <div className="p-16 rounded-3xl bg-black/40 border border-dashed border-white/10 text-center text-gray-400">
              보유 중인 유물이 없습니다. 오픈마켓 또는 가챠 제단에서 유물을 획득하세요.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {user.inventory.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    sound.playClick();
                    onSelectProduct(item);
                  }}
                  className="hologram-card rounded-2xl p-4 cursor-pointer group"
                >
                  <img src={item.image} alt={item.name} className="w-full aspect-square rounded-xl object-cover mb-3" />
                  <div className="text-[10px] font-mono text-cyber-gold">{item.rarity}</div>
                  <h4 className="font-orbitron font-bold text-sm text-white group-hover:text-cyber-cyan truncate">
                    {item.name}
                  </h4>
                  <div className="text-xs font-mono text-cyber-cyan mt-1">⚡ {item.powerLevel.toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Shipments */}
      {activeTab === 'SHIPMENTS' && (
        <div className="space-y-4">
          {shipments.length === 0 ? (
            <div className="p-16 rounded-3xl bg-black/40 border border-dashed border-white/10 text-center text-gray-400">
              진행 중인 차원 전송 배송이 없습니다.
            </div>
          ) : (
            shipments.map((ship) => (
              <div key={ship.id} className="p-6 rounded-2xl bg-[#060a22]/80 border border-white/10 space-y-4">
                <div className="flex justify-between items-center text-xs font-mono pb-3 border-b border-white/10">
                  <div>
                    <span className="text-gray-400">ORDER NO: </span>
                    <span className="text-cyber-cyan font-bold">{ship.orderNumber}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-cyber-green/20 text-cyber-green font-bold">
                    {ship.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-300">현재 좌표: {ship.currentSector}</span>
                    <span className="text-cyber-gold font-bold">{ship.progressPercent}% WARP</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-pink to-cyber-yellow box-glow-cyan"
                      style={{ width: `${ship.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Wishlist */}
      {activeTab === 'WISHLIST' && (
        <div>
          {wishlistProducts.length === 0 ? (
            <div className="p-16 rounded-3xl bg-black/40 border border-dashed border-white/10 text-center text-gray-400">
              위시리스트에 담긴 유물이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map((product) => (
                <div key={product.id} className="hologram-card rounded-2xl p-4">
                  <img src={product.image} alt={product.name} className="w-full aspect-square rounded-xl object-cover mb-3" />
                  <div className="text-[10px] font-mono text-cyber-pink">{product.faction}</div>
                  <h4 className="font-orbitron font-bold text-sm text-white truncate">{product.name}</h4>
                  <div className="font-orbitron font-bold text-cyber-gold text-xs my-2">{product.price.toLocaleString()} CC</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="flex-1 py-2 rounded-lg bg-cyber-cyan text-black font-bold text-xs"
                    >
                      장바구니 담기
                    </button>
                    <button
                      onClick={() => onRemoveWishlist(product.id)}
                      className="px-3 py-2 rounded-lg border border-red-500/40 text-red-400 text-xs"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
