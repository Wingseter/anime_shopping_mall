import React, { useState, useMemo } from 'react';
import { Product, Category } from '../../types';
import { GlitchText } from '../ui/GlitchText';
import { ShoppingCart, Search, Eye, Sparkles, Filter, Zap, Star } from 'lucide-react';
import { sound } from '../../engine/soundEngine';

interface OpenMarketCatalogProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const OpenMarketCatalog: React.FC<OpenMarketCatalogProps> = ({
  products,
  onAddToCart,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'POWER' | 'PRICE_ASC' | 'PRICE_DESC'>('POWER');

  const categories: { id: Category; label: string }[] = [
    { id: 'ALL', label: 'ALL MULTIVERSE' },
    { id: 'SPIRIT_WEAPON', label: 'WEAPONS' },
    { id: 'DARK_MATTER', label: 'DARK MATTER' },
    { id: 'COSMIC_FASHION', label: 'CYBER FASHION' },
    { id: 'ANIME_RELIC', label: 'ANIME RELICS' },
    { id: 'DIVINE_ELIXIR', label: 'ELIXIRS' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'POWER') return b.powerLevel - a.powerLevel;
        if (sortBy === 'PRICE_ASC') return a.price - b.price;
        if (sortBy === 'PRICE_DESC') return b.price - a.price;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="bazaar" className="relative min-h-screen py-24 px-4 md:px-12 z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyber-cyan tracking-widest uppercase">
            <Zap className="w-4 h-4 text-cyber-yellow" />
            <span>UNLIMITED CROSS-DIMENSIONAL BAZAAR</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-orbitron text-white">
            <GlitchText text="OPEN MARKET CATALOG" as="span" />
          </h2>
          <p className="text-xs md:text-sm font-mono text-gray-400">
            차원 전송망을 통해 우주 전역에서 입고되는 실시간 오픈마켓 인벤토리.
          </p>
        </div>

        {/* Filters & Search Control HUD */}
        <div className="mb-10 flex flex-col lg:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#060a1d]/80 border border-cyber-cyan/20 backdrop-blur-md">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start w-full lg:w-auto">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedCategory(cat.id);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-orbitron font-semibold tracking-wider transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-cyber-cyan to-cyber-pink text-black font-black box-glow-cyan'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Bar & Sort Dropdown */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Multiverse Items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/60 border border-white/20 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan transition-colors"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => {
                sound.playClick();
                setSortBy(e.target.value as typeof sortBy);
              }}
              className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 text-xs font-orbitron text-gray-200 focus:outline-none focus:border-cyber-cyan"
            >
              <option value="POWER">Power Level ▼</option>
              <option value="PRICE_ASC">Price: Low to High</option>
              <option value="PRICE_DESC">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Cards Hyper Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="hologram-card rounded-2xl p-4 flex flex-col justify-between group"
            >
              {/* Product Image & Badges */}
              <div className="relative aspect-square rounded-xl overflow-hidden mb-4 border border-white/10 bg-black/40">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Rarity & Power Badges */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-cyber-gold/40 text-[9px] font-mono font-bold text-cyber-gold">
                  {product.rarity}
                </div>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-cyber-cyan/40 text-[9px] font-mono text-cyber-cyan flex items-center space-x-1">
                  <Zap className="w-2.5 h-2.5" />
                  <span>{product.powerLevel.toLocaleString()}</span>
                </div>

                {/* Hover Quick Actions */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      sound.playClick();
                      onSelectProduct(product);
                    }}
                    onMouseEnter={() => sound.playHover()}
                    className="p-3 rounded-full bg-white/10 hover:bg-cyber-cyan hover:text-black border border-white/20 text-white transition-all transform translate-y-4 group-hover:translate-y-0"
                    title="홀로그램 상세 보기"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      sound.playEquip();
                      onAddToCart(product);
                    }}
                    onMouseEnter={() => sound.playHover()}
                    className="p-3 rounded-full bg-cyber-pink hover:bg-cyber-yellow hover:text-black text-white font-bold transition-all transform translate-y-4 group-hover:translate-y-0 box-glow-pink"
                    title="장바구니 담기"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-1.5 mb-4">
                <div className="text-[10px] font-mono text-gray-400 flex items-center justify-between">
                  <span>{product.category}</span>
                  <span className="flex items-center text-cyber-yellow">
                    <Star className="w-3 h-3 fill-cyber-yellow mr-1" />
                    {product.rating}
                  </span>
                </div>
                <h4 className="font-orbitron font-bold text-sm text-white line-clamp-1 group-hover:text-cyber-cyan transition-colors">
                  {product.name}
                </h4>
                <p className="text-[11px] font-mono text-gray-400 line-clamp-2">
                  {product.title}
                </p>
              </div>

              {/* Price & Buy Button */}
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
                  onClick={() => {
                    sound.playEquip();
                    onAddToCart(product);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className="px-3.5 py-2 rounded-lg bg-cyber-cyan/15 hover:bg-cyber-cyan hover:text-black border border-cyber-cyan/40 text-cyber-cyan text-xs font-orbitron font-bold transition-all flex items-center space-x-1"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>BUY</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
