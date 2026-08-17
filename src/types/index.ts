export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC_SSR';

export type Category = 'ALL' | 'SPIRIT_WEAPON' | 'DARK_MATTER' | 'COSMIC_FASHION' | 'ANIME_RELIC' | 'DIVINE_ELIXIR';

export interface Product {
  id: string;
  name: string;
  jpName: string;
  title: string;
  category: Category;
  rarity: Rarity;
  price: number; // in Chrono Credits (CC)
  originalPrice: number;
  rating: number;
  stock: number;
  dimensions: string;
  powerLevel: number;
  description: string;
  lore: string;
  image: string;
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
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface UserSoulProfile {
  isSynced: boolean;
  soulName: string;
  soulRank: string;
  biometricId: string;
  chronoCredits: number;
  manaResonance: number;
  gachaPityCount: number;
  inventory: Product[];
}

export interface GachaResult {
  product: Product;
  isNew: boolean;
  isGuaranteedSSR: boolean;
}
