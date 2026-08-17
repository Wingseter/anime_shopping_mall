export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC_SSR';

export type Category = 'ALL' | 'SPIRIT_WEAPON' | 'DARK_MATTER' | 'COSMIC_FASHION' | 'ANIME_RELIC' | 'DIVINE_ELIXIR';

export type Faction = 'NEO_TOKYO' | 'CELESTIAL' | 'ABYSS' | 'CHRONOS';

export type PageView = 'HOME' | 'CATALOG' | 'PRODUCT_DETAIL' | 'PROFILE' | 'CHECKOUT' | 'GACHA';

export interface ProductReview {
  id: string;
  author: string;
  authorRank: string;
  authorFaction: Faction;
  rating: number;
  date: string;
  comment: string;
  resonanceScore: number;
}

export interface EnchantLevel {
  level: number;
  name: string;
  multiplier: number;
  glowColor: string;
  addedStats: string;
}

export interface Product {
  id: string;
  name: string;
  jpName: string;
  title: string;
  category: Category;
  rarity: Rarity;
  faction: Faction;
  price: number; // in Chrono Credits (CC)
  originalPrice: number;
  rating: number;
  stock: number;
  dimensions: string;
  powerLevel: number;
  description: string;
  lore: string;
  image: string;
  thumbnails?: string[];
  accentColor: string;
  glowColor: string;
  stats: {
    attack?: number;
    resonance?: number;
    temporalStability?: number;
    manaConductivity?: number;
    aestheticScore?: number;
  };
  features: string[];
  reviews: ProductReview[];
  synergyWith?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  enchantLevel: number;
  finalPrice: number;
}

export interface UserSoulProfile {
  isSynced: boolean;
  soulName: string;
  soulRank: string;
  faction: Faction;
  biometricId: string;
  chronoCredits: number;
  manaResonance: number;
  gachaPityCount: number;
  inventory: Product[];
  wishlistIds: string[];
}

export interface GachaResult {
  product: Product;
  isNew: boolean;
  isGuaranteedSSR: boolean;
}

export interface WarpShipment {
  id: string;
  orderNumber: string;
  items: CartItem[];
  totalCredits: number;
  departureTime: string;
  estimatedArrival: string;
  currentSector: string;
  progressPercent: number;
  status: 'WARPING' | 'ORBITAL_DESCENT' | 'MATERIALIZED';
}
