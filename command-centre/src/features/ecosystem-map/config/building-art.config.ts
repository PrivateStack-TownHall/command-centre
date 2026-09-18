import {
  Coffee,
  ChefHat,
  ShoppingCart,
  Sandwich,
  Store,
  MessageSquareText,
  Users,
  Camera,
  BookOpen,
  Package,
  Castle,
  Compass,
  type LucideIcon,
} from "lucide-react";

export type BuildingVariant =
  | "cafe" // awning + cup sign (Kings Brew)
  | "kitchen" // awning + chef hat sign (Castle Kitchen)
  | "tower" // glass office tower (Trade Hub, M-ployee)
  | "diner" // striped awning (Byte Burger)
  | "storefront" // flat glass front (Quantum Mart, Codigram, Nomad)
  | "warehouse" // garage doors (WareTrack, Pineapple Stack)
  | "shop" // simple shopfront (Leather Shelf)
  | "manor"; // arches (Medieval Airbnb)

export interface BuildingArtConfig {
  variant: BuildingVariant;
  icon: LucideIcon;
}

export const BUILDING_ART: Record<string, BuildingArtConfig> = {
  "kings-brew": { variant: "cafe", icon: Coffee },
  "castle-kitchen": { variant: "kitchen", icon: ChefHat },
  "trade-hub": { variant: "tower", icon: ShoppingCart },
  "byte-burger": { variant: "diner", icon: Sandwich },
  "quantum-mart": { variant: "storefront", icon: Store },
  "pineapple-stack": { variant: "warehouse", icon: MessageSquareText },
  "m-ployee": { variant: "tower", icon: Users },
  codigram: { variant: "storefront", icon: Camera },
  "leather-shelf": { variant: "shop", icon: BookOpen },
  waretrack: { variant: "warehouse", icon: Package },
  "medieval-airbnb": { variant: "manor", icon: Castle },
  nomad: { variant: "storefront", icon: Compass },
};
