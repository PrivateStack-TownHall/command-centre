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
    url: "https://kings-brew.onrender.com",
    // url: "http://localhost:3000",
  },

  {
    id: "castle-kitchen",
    name: "Castle Kitchen",
    shortName: "CK",
    emoji: "🥩",
    color: "#7F1D1D",
    description: "Steak & Restaurant Ordering Platform",
    path: "/applications/castle-kitchen",
    url: "https://castle-kitchen.onrender.com",
  },

  {
    id: "trade-hub",
    name: "Trade Hub",
    shortName: "TH",
    emoji: "🏪",
    color: "#22C55E",
    description: "Marketplace Platform",
    path: "/applications/trade-hub",
    url: "https://trade-hub-zh4z.onrender.com",
  },

  {
    id: "byte-burger",
    name: "Byte Burger",
    shortName: "BB",
    emoji: "🍔",
    color: "#DC2626",
    description: "Food Ordering Platform",
    path: "/applications/byte-burger",
    url: "https://byte-burger.onrender.com",
  },

  {
    id: "quantum-mart",
    name: "Quantum Mart",
    shortName: "QM",
    emoji: "🛒",
    color: "#2563EB",
    description: "Ecommerce Platform",
    path: "/applications/quantum-mart",
    url: "https://quantum-mart.onrender.com",
  },

  {
    id: "pineapple-stack",
    name: "Pineapple Stack",
    shortName: "PS",
    emoji: "🍍",
    color: "#EAB308",
    description: "Community Forum & Discussion Platform",
    path: "/applications/pineapple-stack",
    url: "",
  },

  {
    id: "m-ployee",
    name: "M-ployee",
    shortName: "MP",
    emoji: "👨‍💼",
    color: "#4F46E5",
    description: "Employee Information System",
    path: "/applications/m-ployee",
    url: "",
  },

  {
    id: "codigram",
    name: "Codigram",
    shortName: "CG",
    emoji: "📸",
    color: "#EC4899",
    description: "Social Media Platform",
    path: "/applications/codigram",
    url: "",
  },

  {
    id: "medieval-airbnb",
    name: "Medieval Airbnb",
    shortName: "MA",
    emoji: "🏡",
    color: "#D6B98C",
    description: "Property Booking Platform",
    path: "/applications/medieval-airbnb",
    url: "",
  },

  {
    id: "leather-shelf",
    name: "Leather Shelf",
    shortName: "LS",
    emoji: "📚",
    color: "#92400E",
    description: "Library Management Platform",
    path: "/applications/leather-shelf",
    url: "",
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
