import {
  Activity,
  Radar,
  LayoutGrid,
  MessageSquareText,
  ShoppingBag,
} from "lucide-react";

export interface Application {
  id: string;
  name: string;
  shortName: string;
  emoji: string;
  color: string;
  description: string;
  path: string;
  url: string;
}

export interface SidebarMenu {
  name: string;
  path: string;
  color: string;
  icon: React.ElementType;
}

export const APPLICATIONS: Application[] = [
  {
    id: "kings-brew",
    name: "Kings Brew",
    shortName: "KB",
    emoji: "☕",
    color: "#8B5E3C",
    description: "Coffee Ordering Platform",
    path: "/applications/kings-brew",
    url: import.meta.env.VITE_KINGS_BREW_URL ?? "",
  },

  {
    id: "castle-kitchen",
    name: "Castle Kitchen",
    shortName: "CK",
    emoji: "🥩",
    color: "#7F1D1D",
    description: "Steak & Restaurant Ordering Platform",
    path: "/applications/castle-kitchen",
    url: import.meta.env.VITE_CASTLE_KITCHEN_URL ?? "",
  },

  {
    id: "trade-hub",
    name: "Trade Hub",
    shortName: "TH",
    emoji: "🏪",
    color: "#22C55E",
    description: "Marketplace Platform",
    path: "/applications/trade-hub",
    url: import.meta.env.VITE_TRADE_HUB_URL ?? "",
  },

  {
    id: "byte-burger",
    name: "Byte Burger",
    shortName: "BB",
    emoji: "🍔",
    color: "#DC2626",
    description: "Food Ordering Platform",
    path: "/applications/byte-burger",
    url: import.meta.env.VITE_BYTE_BURGER_URL ?? "",
  },

  {
    id: "quantum-mart",
    name: "Quantum Mart",
    shortName: "QM",
    emoji: "🛒",
    color: "#2563EB",
    description: "Ecommerce Platform",
    path: "/applications/quantum-mart",
    url: import.meta.env.VITE_QUANTUM_MART_URL ?? "",
  },

  {
    id: "pineapple-stack",
    name: "Pineapple Stack",
    shortName: "PS",
    emoji: "🍍",
    color: "#EAB308",
    description: "Community Forum & Discussion Platform",
    path: "/applications/pineapple-stack",
    url: import.meta.env.VITE_PINEAPPLE_STACK_URL ?? "",
  },

  {
    id: "m-ployee",
    name: "M-ployee",
    shortName: "MP",
    emoji: "👨‍💼",
    color: "#4F46E5",
    description: "Employee Information System",
    path: "/applications/m-ployee",
    url: import.meta.env.VITE_M_PLOYEE_URL ?? "",
  },

  {
    id: "codigram",
    name: "Codigram",
    shortName: "CG",
    emoji: "📸",
    color: "#EC4899",
    description: "Social Media Platform",
    path: "/applications/codigram",
    url: import.meta.env.VITE_CODIGRAM_URL ?? "",
  },

  {
    id: "leather-shelf",
    name: "Leather Shelf",
    shortName: "LS",
    emoji: "📚",
    color: "#92400E",
    description: "Library Management Platform",
    path: "/applications/leather-shelf",
    url: import.meta.env.VITE_LEATHER_SHELF_URL ?? "",
  },

  {
    id: "waretrack",
    name: "WareTrack",
    shortName: "WT",
    emoji: "📦",
    color: "#0369A1",
    description: "Warehouse & Inventory Management Platform",
    path: "/applications/waretrack",
    url: import.meta.env.VITE_WARETRACK_URL ?? "",
  },

  // TEMPLATE applications — no real backend yet.
  {
    id: "medieval-airbnb",
    name: "Medieval Airbnb",
    shortName: "MA",
    emoji: "🏡",
    color: "#D6B98C",
    description: "Property Booking Platform",
    path: "/applications/medieval-airbnb",
    url: import.meta.env.VITE_MEDIEVAL_AIRBNB_URL ?? "",
  },

  {
    id: "nomad",
    name: "Nomad",
    shortName: "ND",
    emoji: "🧭",
    color: "#0F766E",
    description: "Digital Nomad Platform",
    path: "/applications/nomad",
    url: import.meta.env.VITE_NOMAD_URL ?? "",
  },
];

export const SIDEBAR_MENU: SidebarMenu[] = [
  {
    name: "Applications",
    path: "/applications",
    color: "#F59E0B",
    icon: LayoutGrid,
  },
  {
    name: "Command Centre",
    path: "/",
    color: "#2563EB",
    icon: Radar,
  },

  {
    name: "Reviews",
    path: "/reviews",
    color: "#EC4899",
    icon: MessageSquareText,
  },

  {
    name: "Orders",
    path: "/orders",
    color: "#22C55E",
    icon: ShoppingBag,
  },

  {
    name: "Monitoring",
    path: "/monitoring",
    color: "#F97316",
    icon: Activity,
  },
];

export const APP_STATS = {
  TOTAL_APPLICATIONS: APPLICATIONS.length,
  ACTIVE_APPLICATIONS: 5,
  TOTAL_REVIEWS: 0,
  TOTAL_ORDERS: 0,
} as const;
