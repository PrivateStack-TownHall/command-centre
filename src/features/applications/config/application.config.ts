import type { ColumnDef } from "@tanstack/react-table";
import {
  Coffee,
  UtensilsCrossed,
  Sandwich,
  ShoppingCart,
  Store,
  Compass,
  Home,
} from "lucide-react";

import { APPLICATIONS } from "@/lib/constants";
import type { BadgeColor } from "@/lib/badge-variants";

import { createEntityColumns } from "../columns/createEntityColumns";
import { categoryColumns } from "../columns/category.columns";
import { imageColumns } from "../columns/image.columns";
import { reviewColumns } from "../columns/review.columns";

const getApp = (id: string) => APPLICATIONS.find((app) => app.id === id)!;

export interface ResourceConfig {
  key: string;
  label: string;
  endpoint: string;
  paginated?: boolean;
  /** Dot-path into the app's /stats response, e.g. "products.total".
   *  Used to show a badge count without having to fetch the full tab. */
  statsKey?: string;
  columns?: ColumnDef<any>[];
}

export interface DetailConfig {
  /** Tab label used inside the slide-over panel, e.g. "Reviews", "Comments". */
  label: string;
  /** Builds the nested endpoint for one parent row, e.g.
   *  bookId => `/books/${bookId}/reviews`. */
  endpoint: (parentId: string | number) => string;
  /** Which resource's rows are clickable to open this panel. */
  parentResourceKey: string;
}

export interface ApplicationConfig {
  app: (typeof APPLICATIONS)[number];
  emoji: string;
  color: BadgeColor;
  entityName: string;
  entityPluralName: string;
  resources: ResourceConfig[];
  /** Present only for apps confirmed (via swagger) to have GET /stats. */
  statsEndpoint?: string;
  /** Contextual "click a row to see related items" panel — used where
   *  the real API nests a sub-resource under its parent instead of
   *  exposing a flat list endpoint (confirmed per-app from swagger). */
  detail?: DetailConfig;
}

const defineResources = (resources: ResourceConfig[]): ResourceConfig[] => resources;

const commerceEntityColumns = (
  icon: Parameters<typeof createEntityColumns>[0]["icon"],
  color: BadgeColor,
  unitLabel: string,
) => createEntityColumns({ icon, color, unitLabel });

export const APPLICATION_CONFIG = {
  // ───────────────────────────────────────────────────────────────────
  // commerce-core — unchanged shape (do not modify these 5 apps' tabs).
  // Only Kings Brew is confirmed (via swagger) to have GET /stats.
  // ───────────────────────────────────────────────────────────────────
  "kings-brew": {
    app: getApp("kings-brew"),
    emoji: "☕",
    color: "coffee",
    entityName: "Coffee",
    entityPluralName: "Coffees",
    statsEndpoint: "/stats",

    resources: defineResources([
      {
        key: "entities",
        label: "Coffees",
        endpoint: "/coffees",
        paginated: true,
        statsKey: "products.total",
        columns: commerceEntityColumns(Coffee, "coffee", "per cup"),
      },
      { key: "categories", label: "Categories", endpoint: "/coffee-categories", statsKey: "categories.total", columns: categoryColumns },
      { key: "images", label: "Images", endpoint: "/coffee-images", statsKey: "images.total", columns: imageColumns },
      { key: "reviews", label: "Reviews", endpoint: "/reviews", statsKey: "reviews.total", columns: reviewColumns },
    ]),
  } as ApplicationConfig,

  "castle-kitchen": {
    app: getApp("castle-kitchen"),
    emoji: "🥩",
    color: "restaurant",
    entityName: "Menu",
    entityPluralName: "Menu",
    // No /stats in the uploaded swagger for this app — badge counts only
    // show up once a tab has actually been visited.

    resources: defineResources([
      {
        key: "entities",
        label: "Menu",
        endpoint: "/menu",
        paginated: true,
        columns: commerceEntityColumns(UtensilsCrossed, "restaurant", "per plate"),
      },
      { key: "categories", label: "Categories", endpoint: "/menu-categories", columns: categoryColumns },
      { key: "images", label: "Images", endpoint: "/menu-images", columns: imageColumns },
      { key: "reviews", label: "Reviews", endpoint: "/reviews", columns: reviewColumns },
    ]),
  } as ApplicationConfig,

  "byte-burger": {
    app: getApp("byte-burger"),
    emoji: "🍔",
    color: "burger",
    entityName: "Burger",
    entityPluralName: "Burgers",

    resources: defineResources([
      {
        key: "entities",
        label: "Burgers",
        endpoint: "/burgers",
        paginated: true,
        columns: commerceEntityColumns(Sandwich, "burger", "per burger"),
      },
      { key: "categories", label: "Categories", endpoint: "/burger-categories", columns: categoryColumns },
      { key: "images", label: "Images", endpoint: "/burger-images", columns: imageColumns },
      { key: "reviews", label: "Reviews", endpoint: "/reviews", columns: reviewColumns },
    ]),
  } as ApplicationConfig,

  "quantum-mart": {
    app: getApp("quantum-mart"),
    emoji: "🛒",
    color: "mart",
    entityName: "Inventory",
    entityPluralName: "Inventory",

    resources: defineResources([
      {
        key: "entities",
        label: "Inventory",
        endpoint: "/inventory",
        paginated: true,
        columns: commerceEntityColumns(ShoppingCart, "mart", "per item"),
      },
      { key: "categories", label: "Categories", endpoint: "/inventory-categories", columns: categoryColumns },
      { key: "images", label: "Images", endpoint: "/inventory-images", columns: imageColumns },
      { key: "reviews", label: "Reviews", endpoint: "/reviews", columns: reviewColumns },
    ]),
  } as ApplicationConfig,

  "trade-hub": {
    app: getApp("trade-hub"),
    emoji: "🏪",
    color: "ecommerce",
    entityName: "Catalog",
    entityPluralName: "Catalog",

    resources: defineResources([
      {
        key: "entities",
        label: "Catalog",
        endpoint: "/catalog",
        paginated: true,
        columns: commerceEntityColumns(Store, "ecommerce", "per item"),
      },
      { key: "categories", label: "Categories", endpoint: "/catalog-categories", columns: categoryColumns },
      { key: "images", label: "Images", endpoint: "/catalog-images", columns: imageColumns },
      { key: "reviews", label: "Reviews", endpoint: "/reviews", columns: reviewColumns },
    ]),
  } as ApplicationConfig,

  // ───────────────────────────────────────────────────────────────────
  // operations-core — resources corrected against the uploaded swagger:
  //  - Comments/Dependents that are nested per-parent (not flat lists)
  //    become a contextual `detail` panel instead of their own tab.
  //  - Likes/Stars have no list endpoint at all (toggle-only) — dropped.
  //  - Endpoints requiring another required query param with no natural
  //    "give me everything" mode (Stocks, Locations) are left out for
  //    now rather than showing a permanently empty/erroring tab.
  // ───────────────────────────────────────────────────────────────────
  codigram: {
    app: getApp("codigram"),
    emoji: "📸",
    color: "pink",
    entityName: "Post",
    entityPluralName: "Posts",
    statsEndpoint: "/stats",

    resources: defineResources([
      { key: "posts", label: "Posts", endpoint: "/posts", statsKey: "posts.total" },
      { key: "categories", label: "Categories", endpoint: "/post-categories", statsKey: "categories.total" },
      // Likes: only POST /posts/:id/like (toggle) exists — no list endpoint.
    ]),

    // Comments are nested: GET /posts/:postId/comments — not a flat list.
    detail: {
      label: "Comments",
      endpoint: (postId) => `/posts/${postId}/comments`,
      parentResourceKey: "posts",
    },
  } as ApplicationConfig,

  "pineapple-stack": {
    app: getApp("pineapple-stack"),
    emoji: "🍍",
    color: "pineapple",
    entityName: "Thread",
    entityPluralName: "Threads",
    statsEndpoint: "/stats",

    resources: defineResources([
      { key: "threads", label: "Threads", endpoint: "/threads", statsKey: "threads.total" },
      // Likes/Stars: only POST toggle endpoints exist — no list endpoint.
    ]),

    // Comments are nested: GET /threads/:threadId/comments.
    detail: {
      label: "Comments",
      endpoint: (threadId) => `/threads/${threadId}/comments`,
      parentResourceKey: "threads",
    },
  } as ApplicationConfig,

  "leather-shelf": {
    app: getApp("leather-shelf"),
    emoji: "📚",
    color: "leather",
    entityName: "Book",
    entityPluralName: "Books",
    statsEndpoint: "/stats",

    resources: defineResources([
      { key: "books", label: "Books", endpoint: "/books", statsKey: "books.total" },
      { key: "genres", label: "Genres", endpoint: "/genres", statsKey: "genres.total" },
      { key: "authors", label: "Authors", endpoint: "/authors", statsKey: "authors.total" },
      { key: "publishers", label: "Publishers", endpoint: "/publishers", statsKey: "publishers.total" },
    ]),

    // Reviews are nested per book: GET /books/:id/reviews (Opsi C).
    detail: {
      label: "Reviews",
      endpoint: (bookId) => `/books/${bookId}/reviews`,
      parentResourceKey: "books",
    },
  } as ApplicationConfig,

  "m-ployee": {
    app: getApp("m-ployee"),
    emoji: "👨‍💼",
    color: "employee",
    entityName: "Employee",
    entityPluralName: "Employees",
    statsEndpoint: "/stats",

    resources: defineResources([
      { key: "employees", label: "Employees", endpoint: "/employee-profiles", statsKey: "employees.total" },
      { key: "departments", label: "Departments", endpoint: "/departments", statsKey: "departments.total" },
      { key: "jobs", label: "Jobs", endpoint: "/jobs", statsKey: "jobs.total" },
      // Locations requires a required ?countryId= query param — no
      // "list everything" mode, so left out until there's a country
      // picker to drive it. Regions/Countries are reference data for it.
    ]),

    // Dependents are nested per employee: GET /employee-profiles/:id/dependents.
    detail: {
      label: "Dependents",
      endpoint: (employeeId) => `/employee-profiles/${employeeId}/dependents`,
      parentResourceKey: "employees",
    },
  } as ApplicationConfig,

  waretrack: {
    app: getApp("waretrack"),
    emoji: "📦",
    color: "waretrack",
    entityName: "Product",
    entityPluralName: "Products",
    statsEndpoint: "/stats",

    resources: defineResources([
      { key: "products", label: "Products", endpoint: "/products", statsKey: "products.total" },
      { key: "categories", label: "Categories", endpoint: "/product-categories", statsKey: "categories.total" },
      { key: "warehouses", label: "Warehouses", endpoint: "/warehouses", statsKey: "warehouses.total" },
      { key: "suppliers", label: "Suppliers", endpoint: "/suppliers", statsKey: "suppliers.total" },
      { key: "brands", label: "Brands", endpoint: "/brands" },
      // Stocks requires required ?warehouseId= & ?productId= query
      // params — no "list everything" mode, left out for now.
    ]),
  } as ApplicationConfig,

  // ───────────────────────────────────────────────────────────────────
  // TEMPLATE — no real backend yet. Mirrors the commerce-core shape
  // until the real API is confirmed (see earlier TEMPLATE notes).
  // ───────────────────────────────────────────────────────────────────
  "medieval-airbnb": {
    app: getApp("medieval-airbnb"),
    emoji: "🏡",
    color: "medieval",
    entityName: "Property",
    entityPluralName: "Properties",

    resources: defineResources([
      {
        key: "entities",
        label: "Properties",
        endpoint: "/properties",
        paginated: true,
        columns: commerceEntityColumns(Home, "medieval", "per night"),
      },
      { key: "categories", label: "Categories", endpoint: "/property-categories", columns: categoryColumns },
      { key: "images", label: "Images", endpoint: "/property-images", columns: imageColumns },
      { key: "reviews", label: "Reviews", endpoint: "/reviews", columns: reviewColumns },
    ]),
  } as ApplicationConfig,

  nomad: {
    app: getApp("nomad"),
    emoji: "🧭",
    color: "nomad",
    entityName: "Listing",
    entityPluralName: "Listings",

    resources: defineResources([
      {
        key: "entities",
        label: "Listings",
        endpoint: "/listings",
        paginated: true,
        columns: commerceEntityColumns(Compass, "nomad", "per booking"),
      },
      { key: "categories", label: "Categories", endpoint: "/listing-categories", columns: categoryColumns },
      { key: "images", label: "Images", endpoint: "/listing-images", columns: imageColumns },
      { key: "reviews", label: "Reviews", endpoint: "/reviews", columns: reviewColumns },
    ]),
  } as ApplicationConfig,
} as const;

export type ApplicationId = keyof typeof APPLICATION_CONFIG;
