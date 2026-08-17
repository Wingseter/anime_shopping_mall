import React, { useState, useMemo } from 'react';
import { MultiverseBackground } from './components/canvas/MultiverseBackground';
import { CursorTracker } from './components/canvas/CursorTracker';
import { HologramNav } from './components/ui/HologramNav';
import { HeroSection } from './components/sections/HeroSection';
import { RelicsShowcase } from './components/sections/RelicsShowcase';
import { OpenMarketCatalog } from './components/sections/OpenMarketCatalog';
import { GachaAltar } from './components/sections/GachaAltar';
import { WarpCheckoutSection } from './components/sections/WarpCheckoutSection';
import { SoulSyncModal } from './components/modals/SoulSyncModal';
import { GachaCinematicModal } from './components/modals/GachaCinematicModal';
import { QuantumCartModal } from './components/modals/QuantumCartModal';
import { ProductDetailModal } from './components/modals/ProductDetailModal';
import { WarpFinishOverlay } from './components/modals/WarpFinishOverlay';
import { PRODUCTS } from './data/products';
import { Product, CartItem, UserSoulProfile, GachaResult } from './types';
import { sound } from './engine/soundEngine';

export const App: React.FC = () => {
  // 1. User State (Soul Profile & Credits)
  const [user, setUser] = useState<UserSoulProfile>({
    isSynced: false,
    soulName: 'UNSYNCED_TRAVELER',
    soulRank: 'NOVICE',
    biometricId: '0x000-UNSYNC',
    chronoCredits: 350000,
    manaResonance: 45.0,
    gachaPityCount: 4,
    inventory: [],
  });

  // 2. Cart State
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS[0], quantity: 1 },
  ]);

  // 3. Modals State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isGachaModalOpen, setIsGachaModalOpen] = useState(false);
  const [gachaResults, setGachaResults] = useState<GachaResult[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isWarpFinishOpen, setIsWarpFinishOpen] = useState(false);

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  // Cart Actions
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Gacha Summon Logic
  const handlePerformGacha = (count: number) => {
    const cost = count === 1 ? 1600 : 16000;
    if (user.chronoCredits < cost) {
      alert('크로노 크레딧(CC)이 부족합니다! 상단 SOUL SYNC를 진행하여 777,000 CC를 충전하세요.');
      setIsLoginOpen(true);
      return;
    }

    // Deduct credits
    setUser((prev) => ({
      ...prev,
      chronoCredits: prev.chronoCredits - cost,
      gachaPityCount: (prev.gachaPityCount + count) % 10,
    }));

    // Generate Pull Results
    const results: GachaResult[] = [];
    for (let i = 0; i < count; i++) {
      const isGuaranteed = count === 10 && i === 9;
      let pulledProduct: Product;
      if (isGuaranteed) {
        // Guaranteed SSR
        const ssrPool = PRODUCTS.filter((p) => p.rarity === 'MYTHIC_SSR');
        pulledProduct = ssrPool[Math.floor(Math.random() * ssrPool.length)];
      } else {
        pulledProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      }

      results.push({
        product: pulledProduct,
        isNew: true,
        isGuaranteedSSR: isGuaranteed || pulledProduct.rarity === 'MYTHIC_SSR',
      });
    }

    setGachaResults(results);
    setIsGachaModalOpen(true);
  };

  const handleAcceptGachaAll = () => {
    gachaResults.forEach((res) => {
      handleAddToCart(res.product);
    });
  };

  // Scroll to section
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Checkout Execution
  const handleExecuteCheckout = () => {
    setIsWarpFinishOpen(true);
  };

  const handleFinishCheckout = () => {
    setIsWarpFinishOpen(false);
    setCart([]);
    handleScrollTo('hero');
  };

  return (
    <div className="relative min-h-screen bg-[#03060f] text-white selection:bg-cyber-pink selection:text-white">
      {/* 3D WebGL Canvas Layer */}
      <MultiverseBackground />

      {/* Mouse Sparkle & Reticle Tracker */}
      <CursorTracker />

      {/* Futuristic HUD Header */}
      <HologramNav
        user={user}
        cartCount={cartCount}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onScrollTo={handleScrollTo}
      />

      {/* Main Sections */}
      <main className="relative z-10">
        <HeroSection
          onExplore={() => handleScrollTo('bazaar')}
          onGacha={() => handleScrollTo('gacha')}
        />

        <RelicsShowcase
          relics={PRODUCTS.slice(0, 4)}
          onAddToCart={handleAddToCart}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />

        <OpenMarketCatalog
          products={PRODUCTS}
          onAddToCart={handleAddToCart}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />

        <GachaAltar
          onPerformGacha={handlePerformGacha}
          pityCount={user.gachaPityCount}
        />

        <WarpCheckoutSection
          cart={cart}
          totalPrice={totalPrice}
          onExecuteWarpCheckout={handleExecuteCheckout}
          onOpenCart={() => setIsCartOpen(true)}
        />
      </main>

      {/* Modals & Overlays */}
      <SoulSyncModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSyncSuccess={(profile) => {
          setUser((prev) => ({ ...prev, ...profile }));
        }}
      />

      <GachaCinematicModal
        isOpen={isGachaModalOpen}
        results={gachaResults}
        onClose={() => setIsGachaModalOpen(false)}
        onAcceptAll={handleAcceptGachaAll}
      />

      <QuantumCartModal
        isOpen={isCartOpen}
        cart={cart}
        totalPrice={totalPrice}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleExecuteCheckout}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <WarpFinishOverlay
        isOpen={isWarpFinishOpen}
        onFinish={handleFinishCheckout}
      />
    </div>
  );
};
