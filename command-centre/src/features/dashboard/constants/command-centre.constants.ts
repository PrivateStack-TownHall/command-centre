import {
  Boxes,
  FolderKanban,
  ImageIcon,
  MessageSquareText,
  Package,
  ShoppingCart,
} from "lucide-react";

import type { DashboardSummary } from "../types/dashboard-summary.type";
import type { MetricCard } from "../types/metric-card.type";
import type { ApplicationOverview } from "../types/application-overview.type";
import type { LatestUpdate } from "../types/latest-update.type";
import type { AuditLog } from "../types/audit-log.type";

export const DASHBOARD_CARDS: MetricCard[] = [
  {
    title: "Applications",
    value: 10,
    icon: Boxes,
  },
  {
    title: "Products",
    value: 428,
    icon: Package,
  },
  {
    title: "Categories",
    value: 54,
    icon: FolderKanban,
  },
  {
    title: "Images",
    value: 872,
    icon: ImageIcon,
  },
  {
    title: "Reviews",
    value: 1284,
    icon: MessageSquareText,
  },
  {
    title: "Orders",
    value: 523,
    icon: ShoppingCart,
  },
];

export const DASHBOARD_SUMMARY: DashboardSummary = {
  totalApplications: 10,
  totalProducts: 428,
  totalCategories: 54,
  totalImages: 872,
  totalReviews: 1284,
  totalOrders: 523,
  applications: [],
  latestUpdates: [],
  auditLogs: [],
};

export const APPLICATIONS_OVERVIEW: ApplicationOverview[] = [
  {
    id: "kb",
    name: "Kings Brew",
    emoji: "☕",
    products: 29,
    categories: 7,
    images: 58,
    reviews: 25,
    orders: 18,
    lastUpdated: "2 minutes ago",
  },
  {
    id: "ck",
    name: "Castle Kitchen",
    emoji: "🥩",
    products: 18,
    categories: 5,
    images: 36,
    reviews: 12,
    orders: 8,
    lastUpdated: "10 minutes ago",
  },
  {
    id: "bb",
    name: "Byte Burger",
    emoji: "🍔",
    products: 24,
    categories: 6,
    images: 48,
    reviews: 18,
    orders: 14,
    lastUpdated: "25 minutes ago",
  },
  {
    id: "th",
    name: "Trade Hub",
    emoji: "🏪",
    products: 96,
    categories: 20,
    images: 168,
    reviews: 65,
    orders: 32,
    lastUpdated: "42 minutes ago",
  },
  {
    id: "qm",
    name: "Quantum Mart",
    emoji: "🛒",
    products: 64,
    categories: 12,
    images: 112,
    reviews: 43,
    orders: 21,
    lastUpdated: "1 hour ago",
  },
];

export const LATEST_UPDATES: LatestUpdate[] = [
  {
    id: "1",
    appId: "kb",
    appName: "Kings Brew",
    appEmoji: "☕",
    entity: "Coffee",
    entityName: "Winter Mocha",
    createdAt: "2 min ago",
  },
  {
    id: "2",
    appId: "ck",
    appName: "Castle Kitchen",
    appEmoji: "🥩",
    entity: "Menu",
    entityName: "Tomahawk Steak",
    createdAt: "8 min ago",
  },
  {
    id: "3",
    appId: "bb",
    appName: "Byte Burger",
    appEmoji: "🍔",
    entity: "Burger",
    entityName: "Cheese Burger",
    createdAt: "16 min ago",
  },
  {
    id: "4",
    appId: "th",
    appName: "Trade Hub",
    appEmoji: "🏪",
    entity: "Catalog",
    entityName: "Gaming Laptop",
    createdAt: "31 min ago",
  },
  {
    id: "5",
    appId: "qm",
    appName: "Quantum Mart",
    appEmoji: "🛒",
    entity: "Inventory",
    entityName: "Mechanical Keyboard",
    createdAt: "46 min ago",
  },
];

export const AUDIT_LOGS: AuditLog[] = [
  {
    id: "1",
    appId: "kb",
    appName: "Kings Brew",
    appEmoji: "☕",
    action: "Product Created",
    target: "Winter Mocha",
    createdAt: "09:41",
  },
  {
    id: "2",
    appId: "ck",
    appName: "Castle Kitchen",
    appEmoji: "🥩",
    action: "Menu Updated",
    target: "Tomahawk Steak",
    createdAt: "09:22",
  },
  {
    id: "3",
    appId: "bb",
    appName: "Byte Burger",
    appEmoji: "🍔",
    action: "Review Submitted",
    target: "Cheese Burger",
    createdAt: "09:10",
  },
  {
    id: "4",
    appId: "th",
    appName: "Trade Hub",
    appEmoji: "🏪",
    action: "Catalog Created",
    target: "Gaming Laptop",
    createdAt: "08:55",
  },
  {
    id: "5",
    appId: "qm",
    appName: "Quantum Mart",
    appEmoji: "🛒",
    action: "Inventory Updated",
    target: "Mechanical Keyboard",
    createdAt: "08:33",
  },
];

export const RECENT_ORDERS = [
  {
    id: "1",
    orderNumber: "KB-10241",
    customer: "Michael Johnson",
    application: "Kings Brew",
    total: "Rp255.000",
    status: "Paid",
  },
  {
    id: "2",
    orderNumber: "CK-20213",
    customer: "Sarah Wilson",
    application: "Castle Kitchen",
    total: "Rp890.000",
    status: "Completed",
  },
  {
    id: "3",
    orderNumber: "BB-30012",
    customer: "David Lee",
    application: "Byte Burger",
    total: "Rp142.000",
    status: "Preparing",
  },
];

export const RECENT_REVIEWS = [
  {
    id: "1",
    customer: "Michael Johnson",
    product: "Winter Mocha",
    application: "Kings Brew",
    rating: 5,
    comment: "Amazing coffee with rich chocolate flavor.",
  },
  {
    id: "2",
    customer: "Sarah Wilson",
    product: "Tomahawk Steak",
    application: "Castle Kitchen",
    rating: 5,
    comment: "Perfectly cooked and highly recommended.",
  },
  {
    id: "3",
    customer: "David Lee",
    product: "Cheese Burger",
    application: "Byte Burger",
    rating: 4,
    comment: "Very juicy and delicious.",
  },
];

export const LAST_SYNCHRONIZATION = [
  {
    application: "Kings Brew",
    status: "Success",
    updatedAt: "2 sec ago",
  },
  {
    application: "Castle Kitchen",
    status: "Success",
    updatedAt: "8 sec ago",
  },
  {
    application: "Byte Burger",
    status: "Success",
    updatedAt: "12 sec ago",
  },
  {
    application: "Trade Hub",
    status: "Success",
    updatedAt: "18 sec ago",
  },
  {
    application: "Quantum Mart",
    status: "Success",
    updatedAt: "21 sec ago",
  },
];

export const ECOSYSTEM_STATUS = [
  {
    application: "Kings Brew",
    status: "online",
  },
  {
    application: "Castle Kitchen",
    status: "online",
  },
  {
    application: "Byte Burger",
    status: "online",
  },
  {
    application: "Trade Hub",
    status: "warning",
  },
  {
    application: "Quantum Mart",
    status: "offline",
  },
] as const;
