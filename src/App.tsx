import React, { useState, useMemo } from 'react';
import { CinematicWorld } from './components/canvas/CinematicWorld';
import { CursorTracker } from './components/canvas/CursorTracker';
import { ScreenShakeOverlay } from './components/ui/ScreenShakeOverlay';
import { HologramNav } from './components/ui/HologramNav';

// Pages
import { HeroSection } from './components/sections/HeroSection';
import { CinematicTurntableStage } from './components/sections/CinematicTurntableStage';
import { RelicsShowcase } from './components/sections/RelicsShowcase';
import { QuantumRecommendations } from './components/sections/QuantumRecommendations';
import { GachaAltar } from './components/sections/GachaAltar';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { CheckoutPage } from './pages/CheckoutPage';

// Modals
import { AuthModal } from './components/modals/AuthModal';
import { UserProfileModal } from './components/modals/UserProfileModal';
import { GachaCinematicModal } from './components/modals/GachaCinematicModal';
import { QuantumCartModal } from './components/modals/QuantumCartModal';
import { WishlistModal } from './components/modals/WishlistModal';
import { WarpTrackingModal } from './components/modals/WarpTrackingModal';
import { WarpFinishOverlay } from './components/modals/WarpFinishOverlay';

import { PRODUCTS, ENCHANT_LEVELS } from './data/products';
import { Product, CartItem, UserSoulProfile, GachaResult, WarpShipment, PageView } from './types';
import { sound } from './engine/soundEngine';

export const App: React.FC = () => {
  // 1. Navigation & View State (Multi-Page SPA Router)
  const [currentView, setCurrentView] = useState<PageView>('HOME');
  const [activeProduct, setActiveProduct] = useState<Product>(PRODUCTS[0]);

  // 2. User State
  const [user, setUser] = useState<UserSoulProfile>({
    isSynced: false,
    soulName: 'UNSYNCED_TRAVELER',
    soulRank: 'NOVICE_RUNNER',
    faction: 'NEO_TOKYO',
    biometricId: '0x000-UNSYNC',
    chronoCredits: 350000,
    manaResonance: 45.0,
    gachaPityCount: 4,
    inventory: [PRODUCTS[0]],
    wishlistIds: ['relic-katana-01', 'relic-angel-wings-02'],
  });

  // 3. 3D Cinematic World Engine State
  const [turntableIndex, setTurntableIndex] = useState(0);
  const [isInspecting, setIsInspecting] = useState(false);
  const [isCartFlying, setIsCartFlying] = useState(false);
  const [isScreenShaking, setIsScreenShaking] = useState(false);
  const [isShockwaveActive, setIsShockwaveActive] = useState(false);

  // 4. Cart State
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS[0], quantity: 1, enchantLevel: 1, finalPrice: Math.round(PRODUCTS[0].price * 1.15) },
  ]);

  // 5. Shipments State (Live Warp Radar)
  const [shipments, setShipments] = useState<WarpShipment[]>([
    {
      id: 'ship-1',
      orderNumber: 'WARP-9082-ALPHA',
      items: [{ product: PRODUCTS[0], quantity: 1, enchantLevel: 0, finalPrice: PRODUCTS[0].price }],
      totalCredits: PRODUCTS[0].price,
      departureTime: '2026-08-17 10:00:00',
      estimatedArrival: '2026-08-17 10:30:00',
      currentSector: '제3성단 아스트랄 웜홀 통과 중',
      progressPercent: 65,
      status: 'WARPING',
    },
  ]);

  // 6. Modals State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isGachaModalOpen, setIsGachaModalOpen] = useState(false);
  const [gachaResults, setGachaResults] = useState<GachaResult[]>([]);
  const [isWarpFinishOpen, setIsWarpFinishOpen] = useState(false);

  // Calculations
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0), [cart]);
  const wishlistProducts = useMemo(() => PRODUCTS.filter((p) => user.wishlistIds.includes(p.id)), [user.wishlistIds]);

  // Navigation Handler
  const navigateTo = (view: PageView) => {
    setCurrentView(view);
    setIsInspecting(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProductDetail = (product: Product) => {
    setActiveProduct(product);
    setCurrentView('PRODUCT_DETAIL');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Screen Shake Trigger Helper
  const triggerCameraShake = () => {
    setIsScreenShaking(true);
    setIsShockwaveActive(true);
    setTimeout(() => setIsScreenShaking(false), 600);
    setTimeout(() => setIsShockwaveActive(false), 900);
  };

  // Toggle 3D Bullet Time Fly-In
  const handleToggleInspect = () => {
    sound.playBulletTimeFlyIn();
    triggerCameraShake();
    setIsInspecting(!isInspecting);
  };

  // Flying Drone Cart Ingestion Trigger
  const handleTriggerDroneBuy = (product: Product) => {
    if (isCartFlying) return;
    sound.playDroneFlyIn();
    triggerCameraShake();
    setIsCartFlying(true);

    setTimeout(() => {
      sound.playTractorBeam();
    }, 600);

    setTimeout(() => {
      sound.playWarp();
    }, 1400);
  };

  const handleDroneCartComplete = () => {
    setIsCartFlying(false);
    sound.playEquip();
    triggerCameraShake();

    const productToAdd = currentView === 'PRODUCT_DETAIL' ? activeProduct : PRODUCTS[turntableIndex] || PRODUCTS[0];
    handleAddToCart(productToAdd);
    setIsInspecting(false);
  };

  // Wishlist Toggle
  const handleToggleWishlist = (productId: string) => {
    setUser((prev) => {
      const exists = prev.wishlistIds.includes(productId);
      const updated = exists
        ? prev.wishlistIds.filter((id) => id !== productId)
        : [...prev.wishlistIds, productId];
      return { ...prev, wishlistIds: updated };
    });
  };

  // Cart Actions
  const handleAddToCart = (product: Product, enchantLevel = 0, finalPrice?: number) => {
    const calcPrice = finalPrice || Math.round(product.price * (ENCHANT_LEVELS[enchantLevel]?.multiplier || 1.0));
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.enchantLevel === enchantLevel);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.enchantLevel === enchantLevel
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, enchantLevel, finalPrice: calcPrice }];
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
      alert('크로노 크레딧(CC)이 부족합니다! SOUL SYNC 또는 프로필에서 크레딧을 충전하세요.');
      setIsAuthOpen(true);
      return;
    }

    triggerCameraShake();
    setUser((prev) => ({
      ...prev,
      chronoCredits: prev.chronoCredits - cost,
      gachaPityCount: (prev.gachaPityCount + count) % 10,
    }));

    const results: GachaResult[] = [];
    for (let i = 0; i < count; i++) {
      const isGuaranteed = count === 10 && i === 9;
      let pulledProduct: Product;
      if (isGuaranteed) {
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
    const newItems = gachaResults.map((r) => r.product);
    setUser((prev) => ({
      ...prev,
      inventory: [...prev.inventory, ...newItems],
    }));
    gachaResults.forEach((res) => {
      handleAddToCart(res.product);
    });
  };

  const handleChargeCredits = () => {
    setUser((prev) => ({
      ...prev,
      chronoCredits: prev.chronoCredits + 100000,
    }));
  };

  // Checkout Execution
  const handleExecuteCheckout = () => {
    if (cart.length === 0) {
      alert('장바구니가 비어 있습니다.');
      return;
    }
    triggerCameraShake();
    setIsWarpFinishOpen(true);
  };

  const handleFinishCheckout = () => {
    setIsWarpFinishOpen(false);

    const newShipment: WarpShipment = {
      id: `ship-${Date.now()}`,
      orderNumber: `WARP-${Math.floor(1000 + Math.random() * 9000)}-HYPER`,
      items: [...cart],
      totalCredits: totalPrice,
      departureTime: new Date().toLocaleTimeString(),
      estimatedArrival: '도약 중 (즉시 전송)',
      currentSector: '웜홀 엔진 가동 // 차원 축 통과 중',
      progressPercent: 30,
      status: 'WARPING',
    };

    setShipments((prev) => [newShipment, ...prev]);
    setCart([]);
    navigateTo('HOME');
  };

  return (
    <div className="relative min-h-screen bg-[#02040b] text-white selection:bg-cyber-pink selection:text-white">
      {/* 3D WebGL Engine Layer */}
      <CinematicWorld
        products={PRODUCTS}
        selectedIndex={turntableIndex}
        isInspecting={isInspecting}
        isCartFlying={isCartFlying}
        onSelectProductIndex={(idx) => setTurntableIndex(idx)}
        onDroneCartComplete={handleDroneCartComplete}
      />

      {/* Screen Shake & Shockwave Overlays */}
      <ScreenShakeOverlay
        isShaking={isScreenShaking}
        shockwaveActive={isShockwaveActive}
      />

      {/* Mouse Sparkle & Reticle Tracker */}
      <CursorTracker />

      {/* Futuristic Header HUD */}
      <HologramNav
        user={user}
        currentView={currentView}
        cartCount={cartCount}
        wishlistCount={user.wishlistIds.length}
        shipmentCount={shipments.length}
        onNavigate={navigateTo}
        onOpenLogin={() => setIsAuthOpen(true)}
        onOpenProfile={() => navigateTo('PROFILE')}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
      />

      {/* Main Multi-Page Router View */}
      <main className="relative z-10">
        {/* VIEW 1: HOME (3D Cinematic Turntable Stage + AI Recommendations) */}
        {currentView === 'HOME' && (
          <>
            <HeroSection
              onExplore={() => {
                const el = document.getElementById('turntable');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onGacha={() => navigateTo('GACHA')}
            />

            <CinematicTurntableStage
              products={PRODUCTS}
              selectedIndex={turntableIndex}
              isInspecting={isInspecting}
              isCartFlying={isCartFlying}
              onPrevItem={() => setTurntableIndex((prev) => (prev > 0 ? prev - 1 : PRODUCTS.length - 1))}
              onNextItem={() => setTurntableIndex((prev) => (prev < PRODUCTS.length - 1 ? prev + 1 : 0))}
              onToggleInspect={handleToggleInspect}
              onTriggerDroneBuy={handleTriggerDroneBuy}
              onOpenDetailModal={handleOpenProductDetail}
            />

            <RelicsShowcase
              relics={PRODUCTS.slice(0, 4)}
              onAddToCart={(p) => handleAddToCart(p)}
              onSelectProduct={handleOpenProductDetail}
            />

            <QuantumRecommendations
              products={PRODUCTS}
              userFaction={user.faction}
              wishlistIds={user.wishlistIds}
              onAddToCart={(p) => handleAddToCart(p)}
              onSelectProduct={handleOpenProductDetail}
              onToggleWishlist={handleToggleWishlist}
            />
          </>
        )}

        {/* VIEW 2: CATALOG (Full Open Market Catalog with Deep Filters & Search) */}
        {currentView === 'CATALOG' && (
          <CatalogPage
            products={PRODUCTS}
            wishlistIds={user.wishlistIds}
            onSelectProduct={handleOpenProductDetail}
            onAddToCart={(p) => handleAddToCart(p)}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {/* VIEW 3: PRODUCT_DETAIL (Standalone Fullscreen Product Inspection Page) */}
        {currentView === 'PRODUCT_DETAIL' && (
          <ProductDetailPage
            product={activeProduct}
            allProducts={PRODUCTS}
            isWishlisted={user.wishlistIds.includes(activeProduct.id)}
            isCartFlying={isCartFlying}
            onBack={() => navigateTo('CATALOG')}
            onSelectProduct={handleOpenProductDetail}
            onAddToCart={handleAddToCart}
            onTriggerDroneBuy={handleTriggerDroneBuy}
            onToggleWishlist={handleToggleWishlist}
            onDirectCheckout={(p, ench) => {
              handleAddToCart(p, ench);
              navigateTo('CHECKOUT');
            }}
          />
        )}

        {/* VIEW 4: PROFILE (Soul Dashboard, Inventory, Shipments, Wishlist) */}
        {currentView === 'PROFILE' && (
          <ProfilePage
            user={user}
            shipments={shipments}
            allProducts={PRODUCTS}
            onChargeCredits={handleChargeCredits}
            onSelectProduct={handleOpenProductDetail}
            onRemoveWishlist={handleToggleWishlist}
            onAddToCart={(p) => handleAddToCart(p)}
          />
        )}

        {/* VIEW 5: CHECKOUT (Full 3D Cargo Bay & Delivery Checkout Page) */}
        {currentView === 'CHECKOUT' && (
          <CheckoutPage
            cart={cart}
            totalPrice={totalPrice}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onExecuteWarpCheckout={handleExecuteCheckout}
            onBackToCatalog={() => navigateTo('CATALOG')}
          />
        )}

        {/* VIEW 6: GACHA (Dedicated Divine Summon Altar Page) */}
        {currentView === 'GACHA' && (
          <div className="pt-20">
            <GachaAltar
              onPerformGacha={handlePerformGacha}
              pityCount={user.gachaPityCount}
            />
          </div>
        )}
      </main>

      {/* Modals & Overlays */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(profile) => {
          setUser((prev) => ({ ...prev, ...profile }));
        }}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        user={user}
        onClose={() => setIsProfileOpen(false)}
        onChargeCredits={handleChargeCredits}
        onOpenItemDetail={handleOpenProductDetail}
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
        onCheckout={() => {
          setIsCartOpen(false);
          navigateTo('CHECKOUT');
        }}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        wishlistProducts={wishlistProducts}
        onClose={() => setIsWishlistOpen(false)}
        onRemoveWishlist={handleToggleWishlist}
        onAddToCart={(p) => handleAddToCart(p)}
        onOpenDetail={handleOpenProductDetail}
      />

      <WarpTrackingModal
        isOpen={isTrackingOpen}
        shipments={shipments}
        onClose={() => setIsTrackingOpen(false)}
      />

      <WarpFinishOverlay
        isOpen={isWarpFinishOpen}
        onFinish={handleFinishCheckout}
      />
    </div>
  );
};
