import React, { useState, useMemo } from 'react';
import { Product, Category, Faction, Rarity } from '../types';
import { GlitchText } from '../components/ui/GlitchText';
import { Search, Filter, ShoppingCart, Eye, Heart, Zap, Star, Sparkles, SlidersHorizontal, Grid, List } from 'lucide-react';
import { sound } from '../engine/soundEngine';

interface CatalogPageProps {
  products: Product[];
  wishlistIds: string[];
  initialCategory?: Category;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  products,
  wishlistIds,
  initialCategory = 'ALL',
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory);
  const [selectedFaction, setSelectedFaction] = useState<string>('ALL');
  const [selectedRarity, setSelectedRarity] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'POWER_DESC' | 'PRICE_ASC' | 'PRICE_DESC' | 'RATING'>('POWER_DESC');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [viewMode, setViewMode] = useState<'GRID' | 'COMPACT'>('GRID');

  const categories: { id: Category; label: string; count: number }[] = [
    { id: 'ALL', label: '전체 유물 (ALL)', count: products.length },
    { id: 'SPIRIT_WEAPON', label: '성물 무기 (WEAPONS)', count: products.filter((p) => p.category === 'SPIRIT_WEAPON').length },
    { id: 'DARK_MATTER', label: '암흑물질 (DARK MATTER)', count: products.filter((p) => p.category === 'DARK_MATTER').length },
    { id: 'COSMIC_FASHION', label: '우주 패션 (CYBER FASHION)', count: products.filter((p) => p.category === 'COSMIC_FASHION').length },
    { id: 'ANIME_RELIC', label: '애니메 성물 (ANIME RELICS)', count: products.filter((p) => p.category === 'ANIME_RELIC').length },
    { id: 'DIVINE_ELIXIR', label: '신의 영약 (DIVINE ELIXIRS)', count: products.filter((p) => p.category === 'DIVINE_ELIXIR').length },
  ];

  const factions: { id: string; label: string }[] = [
    { id: 'ALL', label: '모든 세력' },
    { id: 'NEO_TOKYO', label: '네오 도쿄' },
    { id: 'CELESTIAL', label: '아스트랄 생츄어리' },
    { id: 'ABYSS', label: '심연의 보이드' },
    { id: 'CHRONOS', label: '크로노스 감시자' },
  ];

  const rarities: { id: string; label: string }[] = [
    { id: 'ALL', label: '전체 등급' },
    { id: 'MYTHIC_SSR', label: 'MYTHIC SSR' },
    { id: 'LEGENDARY', label: 'LEGENDARY' },
    { id: 'EPIC', label: 'EPIC' },
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
        const matchesFaction = selectedFaction === 'ALL' || p.faction === selectedFaction;
        const matchesRarity = selectedRarity === 'ALL' || p.rarity === selectedRarity;
        const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.jpName.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesFaction && matchesRarity && matchesPrice && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'POWER_DESC') return b.powerLevel - a.powerLevel;
        if (sortBy === 'PRICE_ASC') return a.price - b.price;
        if (sortBy === 'PRICE_DESC') return b.price - a.price;
        if (sortBy === 'RATING') return b.rating - a.rating;
        return 0;
      });
  }, [products, selectedCategory, selectedFaction, selectedRarity, minPrice, maxPrice, searchQuery, sortBy]);

  return (
    <div className="pt-24 pb-20 px-4 md:px-12 max-w-7xl mx-auto z-10 relative">
      {/* Page Header & Breadcrumb */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyber-cyan">
          <span>MULTIVERSE BAZAAR</span>
          <span>/</span>
          <span className="text-white font-bold">{selectedCategory}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black font-orbitron text-white">
          <GlitchText text="OPEN MARKET CATALOG" as="span" />
        </h1>
        <p className="text-xs md:text-sm font-mono text-gray-400">
          실시간 차원 전송망에 연결된 {products.length}개의 전설 성물 데이터베이스.
        </p>
      </div>

      {/* Main Search Bar & Quick Toggles */}
      <div className="p-4 rounded-2xl bg-[#060a22]/90 border border-cyber-cyan/30 backdrop-blur-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4 box-glow-cyan">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-cyan" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="유물 이름, 일본어 명칭, 특성, 로어로 검색... (예: 카타나, 블랙홀, 광익)"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/20 text-xs md:text-sm font-mono text-white focus:outline-none focus:border-cyber-cyan"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 p-1 rounded-lg bg-black/60 border border-white/10">
            <button
              onClick={() => setViewMode('GRID')}
              className={`p-1.5 rounded ${viewMode === 'GRID' ? 'bg-cyber-cyan text-black' : 'text-gray-400'}`}
              title="그리드 뷰"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('COMPACT')}
              className={`p-1.5 rounded ${viewMode === 'COMPACT' ? 'bg-cyber-cyan text-black' : 'text-gray-400'}`}
              title="컴팩트 뷰"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 rounded-xl bg-black/60 border border-white/20 font-orbitron text-xs text-white focus:outline-none focus:border-cyber-cyan"
          >
            <option value="POWER_DESC">파워레벨 높은순 ⚡</option>
            <option value="PRICE_ASC">가격 낮은순 (CC ↑)</option>
            <option value="PRICE_DESC">가격 높은순 (CC ↓)</option>
            <option value="RATING">평점 높은순 ★</option>
          </select>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Filters */}
        <div className="lg:col-span-3 space-y-6 p-5 rounded-2xl bg-[#060a22]/80 border border-white/10 backdrop-blur-md">
          {/* Categories */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-orbitron font-bold text-white mb-3">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyber-yellow" />
              <span>CATEGORIES</span>
            </div>
            <div className="space-y-1">
              {categories.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedCategory(cat.id);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-left text-xs font-mono flex items-center justify-between transition-all ${
                      active
                        ? 'bg-cyber-cyan text-black font-bold box-glow-cyan'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-[10px] opacity-75">{cat.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Factions */}
          <div className="pt-4 border-t border-white/10">
            <div className="text-xs font-orbitron font-bold text-white mb-2">FACTIONS (세력)</div>
            <div className="space-y-1">
              {factions.map((fac) => (
                <button
                  key={fac.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedFaction(fac.id);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded text-left text-xs font-mono transition-colors ${
                    selectedFaction === fac.id ? 'text-cyber-gold font-bold bg-cyber-gold/10' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {fac.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rarities */}
          <div className="pt-4 border-t border-white/10">
            <div className="text-xs font-orbitron font-bold text-white mb-2">RARITY (등급)</div>
            <div className="space-y-1">
              {rarities.map((rar) => (
                <button
                  key={rar.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedRarity(rar.id);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded text-left text-xs font-mono transition-colors ${
                    selectedRarity === rar.id ? 'text-cyber-pink font-bold bg-cyber-pink/10' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {rar.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-300">최대 예산 한도</span>
              <span className="text-cyber-gold font-bold">{maxPrice.toLocaleString()} CC</span>
            </div>
            <input
              type="range"
              min={50000}
              max={500000}
              step={10000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-cyber-cyan"
            />
          </div>
        </div>

        {/* Right Content: Product Results */}
        <div className="lg:col-span-9">
          <div className="flex justify-between items-center text-xs font-mono text-gray-400 mb-4">
            <span>검색 결과: <strong className="text-white">{filteredProducts.length}</strong>개 유물 발굴됨</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-16 rounded-3xl bg-[#060a22]/60 border border-dashed border-white/15 text-center space-y-3">
              <Sparkles className="w-12 h-12 text-gray-600 mx-auto" />
              <p className="font-orbitron text-lg text-white">일치하는 차원 성물이 없습니다.</p>
              <p className="text-xs font-mono text-gray-400">필터 조건을 재설정하거나 다른 검색어를 입력해 보세요.</p>
            </div>
          ) : viewMode === 'GRID' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isWish = wishlistIds.includes(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      sound.playClick();
                      onSelectProduct(product);
                    }}
                    className="hologram-card rounded-2xl p-4 flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-4 border border-white/10 bg-black/40">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playWishlist();
                          onToggleWishlist(product.id);
                        }}
                        className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md border transition-all z-20 ${
                          isWish ? 'bg-cyber-pink text-white border-cyber-pink box-glow-pink' : 'bg-black/60 text-gray-300 border-white/20 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-white' : ''}`} />
                      </button>

                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-cyber-gold/40 text-[9px] font-mono font-bold text-cyber-gold">
                        {product.rarity}
                      </div>

                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-cyber-cyan/40 text-[9px] font-mono text-cyber-cyan flex items-center space-x-1">
                        <Zap className="w-2.5 h-2.5" />
                        <span>{product.powerLevel.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-1 mb-4">
                      <div className="text-[10px] font-mono text-cyber-pink">{product.faction}</div>
                      <h4 className="font-orbitron font-bold text-sm text-white group-hover:text-cyber-cyan transition-colors truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] font-mono text-gray-400 line-clamp-1">{product.title}</p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <div className="text-[9px] font-mono text-gray-500 line-through">
                          {product.originalPrice.toLocaleString()} CC
                        </div>
                        <div className="text-base font-orbitron font-black text-cyber-gold">
                          {product.price.toLocaleString()} <span className="text-[10px]">CC</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playEquip();
                          onAddToCart(product);
                        }}
                        className="px-3.5 py-2 rounded-lg bg-cyber-cyan/15 hover:bg-cyber-cyan hover:text-black border border-cyber-cyan/40 text-cyber-cyan text-xs font-orbitron font-bold transition-all flex items-center space-x-1"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>담기</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Compact List View */
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectProduct(product);
                  }}
                  className="p-4 rounded-2xl bg-[#060a22]/80 border border-white/10 hover:border-cyber-cyan flex items-center justify-between gap-4 cursor-pointer group transition-all"
                >
                  <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover border border-white/10" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 text-[10px] font-mono">
                      <span className="text-cyber-gold font-bold">{product.rarity}</span>
                      <span>•</span>
                      <span className="text-cyber-pink">{product.faction}</span>
                    </div>
                    <h4 className="font-orbitron font-bold text-sm text-white group-hover:text-cyber-cyan truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs font-mono text-gray-400 truncate">{product.title}</p>
                  </div>

                  <div className="text-right">
                    <div className="font-orbitron font-bold text-cyber-gold text-sm">
                      {product.price.toLocaleString()} CC
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playEquip();
                        onAddToCart(product);
                      }}
                      className="mt-1 px-3 py-1 rounded-lg bg-cyber-cyan text-black font-orbitron font-bold text-[10px]"
                    >
                      장바구니 담기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
