import type { ColumnDef } from "@tanstack/react-table";
import {
  BookOpen,
  Briefcase,
  Building,
  Building2,
  Coffee,
  Compass,
  FolderKanban,
  Globe,
  Home,
  ImageIcon,
  MessagesSquare,
  Newspaper,
  Package,
  PenLine,
  Sandwich,
  ShoppingCart,
  Star,
  Store,
  Tag,
  Tags,
  Truck,
  Users,
  UtensilsCrossed,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

import { APPLICATIONS } from "@/lib/constants";
import type { BadgeColor } from "@/lib/badge-variants";

import { createEntityColumns } from "../columns/createEntityColumns";
import { categoryColumns } from "../columns/category.columns";
import { imageColumns } from "../columns/image.columns";
import { reviewColumns } from "../columns/review.columns";

const getApp = (id: string) => APPLICATIONS.find((app) => app.id === id)!;

/**
 * Query params a list endpoint actually accepts, taken from its swagger.
 * Anything not declared here is never sent to the backend.
 */
export interface ResourceParamsConfig {
  /** Server-side `?search=`. Without it the search box filters the
   *  already-loaded rows in the browser instead. */
  search?: boolean;
  /** Category-style filter, e.g. `?categoryId=` or Leather Shelf's
   *  `?genreId=`. Dropdown options come from another resource of the
   *  same app (`optionsFrom` is that resource's key). */
  category?: { param: string; optionsFrom: string };
  /** Server-side `?sort=` & `?order=`. */
  sort?: boolean;
}

export interface ResourceConfig {
  key: string;
  label: string;
  /** Shown on the resource's stat card. */
  icon: LucideIcon;
  endpoint: string;
  /** Server-side `?page=` & `?limit=` with a `meta` block in the response. */
  paginated?: boolean;
  /** The list endpoint needs an admin bearer token, which Command Centre
   *  doesn't have. The resource stays visible (its count can still come
   *  from /stats) but can't be opened or fetched. */
  requiresAuth?: boolean;
  params?: ResourceParamsConfig;
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

/**
 * Path of a public (no token) cross-app endpoint.
 *  - a string → available at that path
 *  - `null`   → planned but not available yet (shown as "Coming soon")
 *  - omitted  → not applicable to this application (not listed at all)
 */
export type PublicEndpoint = string | null;

export interface PublicEndpointsConfig {
  /** Flat list of every review, e.g. GET /reviews. */
  reviews?: PublicEndpoint;
  /** Unscoped list of every order, e.g. GET /public/orders. */
  orders?: PublicEndpoint;
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
  /** Liveness check. "/health" where it exists; the commerce apps without
   *  it answer GET "/" with `{ success: true }`, which is enough for UP/DOWN. */
  healthEndpoint?: string;
  /** Public endpoints used by the cross-app pages (Reviews, Orders). */
  publicEndpoints?: PublicEndpointsConfig;
  /** Contextual "click a row to see related items" panel — used where
   *  the real API nests a sub-resource under its parent instead of
   *  exposing a flat list endpoint (confirmed per-app from swagger). */
  detail?: DetailConfig;
}

/** Main-entity list params shared by every commerce-core backend
 *  (GET /coffees, /menu, /burgers, /inventory, /catalog). */
const COMMERCE_ENTITY_PARAMS: ResourceParamsConfig = {
  search: true,
  category: { param: "categoryId", optionsFrom: "categories" },
  sort: true,
};

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
    healthEndpoint: "/health",
    publicEndpoints: { reviews: "/reviews", orders: "/public/orders" },

    resources: defineResources([
      {
        key: "entities",
        label: "Coffees",
        icon: Coffee,
        endpoint: "/coffees",
        paginated: true,
        params: COMMERCE_ENTITY_PARAMS,
        statsKey: "products.total",
        columns: commerceEntityColumns(Coffee, "coffee", "per cup"),
      },
      { key: "categories", label: "Categories", icon: FolderKanban, endpoint: "/coffee-categories", statsKey: "categories.total", columns: categoryColumns },
      { key: "images", label: "Images", icon: ImageIcon, endpoint: "/coffee-images", statsKey: "images.total", columns: imageColumns },
      { key: "reviews", label: "Reviews", icon: Star, endpoint: "/reviews", statsKey: "reviews.total", columns: reviewColumns },
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
    healthEndpoint: "/",
    // GET /orders needs a bearer token and only returns the caller's own
    // orders — /public/orders isn't deployed on this backend yet.
    publicEndpoints: { reviews: "/reviews", orders: null },

    resources: defineResources([
      {
        key: "entities",
        label: "Menu",
        icon: UtensilsCrossed,
        endpoint: "/menu",
        paginated: true,
        params: COMMERCE_ENTITY_PARAMS,
        columns: commerceEntityColumns(UtensilsCrossed, "restaurant", "per plate"),
      },
      { key: "categories", label: "Categories", icon: FolderKanban, endpoint: "/menu-categories", columns: categoryColumns },
      { key: "images", label: "Images", icon: ImageIcon, endpoint: "/menu-images", columns: imageColumns },
      { key: "reviews", label: "Reviews", icon: Star, endpoint: "/reviews", columns: reviewColumns },
    ]),
  } as ApplicationConfig,

  "byte-burger": {
    app: getApp("byte-burger"),
    emoji: "🍔",
    color: "burger",
    entityName: "Burger",
    entityPluralName: "Burgers",
    healthEndpoint: "/",
    publicEndpoints: { reviews: "/reviews", orders: null },

    resources: defineResources([
      {
        key: "entities",
        label: "Burgers",
        icon: Sandwich,
        endpoint: "/burgers",
        paginated: true,
        params: COMMERCE_ENTITY_PARAMS,
        columns: commerceEntityColumns(Sandwich, "burger", "per burger"),
      },
      { key: "categories", label: "Categories", icon: FolderKanban, endpoint: "/burger-categories", columns: categoryColumns },
      { key: "images", label: "Images", icon: ImageIcon, endpoint: "/burger-images", columns: imageColumns },
      { key: "reviews", label: "Reviews", icon: Star, endpoint: "/reviews", columns: reviewColumns },
    ]),
  } as ApplicationConfig,

  "quantum-mart": {
    app: getApp("quantum-mart"),
    emoji: "🛒",
    color: "mart",
    entityName: "Inventory",
    entityPluralName: "Inventory",
    healthEndpoint: "/",
    publicEndpoints: { reviews: "/reviews", orders: null },

    resources: defineResources([
      {
        key: "entities",
        label: "Inventory",
        icon: ShoppingCart,
        endpoint: "/inventory",
        paginated: true,
        params: COMMERCE_ENTITY_PARAMS,
        columns: commerceEntityColumns(ShoppingCart, "mart", "per item"),
      },
      { key: "categories", label: "Categories", icon: FolderKanban, endpoint: "/inventory-categories", columns: categoryColumns },
      { key: "images", label: "Images", icon: ImageIcon, endpoint: "/inventory-images", columns: imageColumns },
      { key: "reviews", label: "Reviews", icon: Star, endpoint: "/reviews", columns: reviewColumns },
    ]),
  } as ApplicationConfig,

  "trade-hub": {
    app: getApp("trade-hub"),
    emoji: "🏪",
    color: "ecommerce",
    entityName: "Catalog",
    entityPluralName: "Catalog",
    healthEndpoint: "/",
    publicEndpoints: { reviews: "/reviews", orders: null },

    resources: defineResources([
      {
        key: "entities",
        label: "Catalog",
        icon: Store,
        endpoint: "/catalog",
        paginated: true,
        params: COMMERCE_ENTITY_PARAMS,
        columns: commerceEntityColumns(Store, "ecommerce", "per item"),
      },
      { key: "categories", label: "Categories", icon: FolderKanban, endpoint: "/catalog-categories", columns: categoryColumns },
      { key: "images", label: "Images", icon: ImageIcon, endpoint: "/catalog-images", columns: imageColumns },
      { key: "reviews", label: "Reviews", icon: Star, endpoint: "/reviews", columns: reviewColumns },
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
    healthEndpoint: "/health",

    resources: defineResources([
      {
        key: "posts",
        label: "Posts",
        icon: Newspaper,
        endpoint: "/posts",
        statsKey: "posts.total",
        params: { category: { param: "categoryId", optionsFrom: "categories" } },
      },
      { key: "categories", label: "Categories", icon: FolderKanban, endpoint: "/post-categories", statsKey: "categories.total" },
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
    healthEndpoint: "/health",

    resources: defineResources([
      {
        key: "threads",
        label: "Threads",
        icon: MessagesSquare,
        endpoint: "/threads",
        statsKey: "threads.total",
        // `?category=` also exists, but takes a free-text name and there is
        // no categories endpoint to build a dropdown from — search only.
        params: { search: true },
      },
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
    healthEndpoint: "/health",
    // Reviews only exist per book (GET /books/:id/reviews) — no flat list
    // to aggregate yet.
    publicEndpoints: { reviews: null },

    resources: defineResources([
      {
        key: "books",
        label: "Books",
        icon: BookOpen,
        endpoint: "/books",
        statsKey: "books.total",
        params: { search: true, category: { param: "genreId", optionsFrom: "genres" } },
      },
      { key: "genres", label: "Genres", icon: Tags, endpoint: "/genres", statsKey: "genres.total" },
      { key: "authors", label: "Authors", icon: PenLine, endpoint: "/authors", statsKey: "authors.total" },
      { key: "publishers", label: "Publishers", icon: Building2, endpoint: "/publishers", statsKey: "publishers.total" },
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
    healthEndpoint: "/health",

    resources: defineResources([
      {
        key: "employees",
        label: "Employees",
        icon: Users,
        endpoint: "/employee-profiles",
        statsKey: "employees.total",
        // GET /employee-profiles is admin-only (401 without a token).
        requiresAuth: true,
      },
      { key: "departments", label: "Departments", icon: Building, endpoint: "/departments", statsKey: "departments.total" },
      { key: "jobs", label: "Jobs", icon: Briefcase, endpoint: "/jobs", statsKey: "jobs.total" },
      { key: "regions", label: "Regions", icon: Globe, endpoint: "/regions", statsKey: "regions.total" },
      // Countries (?regionId=) and Locations (?countryId=) both require a
      // query param — no "list everything" mode, so left out until there's
      // a picker to drive them.
    ]),

    // Dependents are nested per employee
    // (GET /employee-profiles/:id/dependents) and both endpoints need an
    // admin token — re-enable this panel once Command Centre has auth:
    // detail: {
    //   label: "Dependents",
    //   endpoint: (employeeId) => `/employee-profiles/${employeeId}/dependents`,
    //   parentResourceKey: "employees",
    // },
  } as ApplicationConfig,

  waretrack: {
    app: getApp("waretrack"),
    emoji: "📦",
    color: "waretrack",
    entityName: "Product",
    entityPluralName: "Products",
    statsEndpoint: "/stats",
    healthEndpoint: "/health",

    resources: defineResources([
      {
        key: "products",
        label: "Products",
        icon: Package,
        endpoint: "/products",
        statsKey: "products.total",
        params: { search: true, category: { param: "categoryId", optionsFrom: "categories" } },
      },
      { key: "categories", label: "Categories", icon: FolderKanban, endpoint: "/product-categories", statsKey: "categories.total" },
      { key: "warehouses", label: "Warehouses", icon: Warehouse, endpoint: "/warehouses", statsKey: "warehouses.total" },
      { key: "suppliers", label: "Suppliers", icon: Truck, endpoint: "/suppliers", statsKey: "suppliers.total" },
      { key: "brands", label: "Brands", icon: Tag, endpoint: "/brands", statsKey: "brands.total" },
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
    publicEndpoints: { reviews: null, orders: null },

    resources: defineResources([
      {
        key: "entities",
        label: "Properties",
        icon: Home,
        endpoint: "/properties",
        paginated: true,
        params: COMMERCE_ENTITY_PARAMS,
        columns: commerceEntityColumns(Home, "medieval", "per night"),
      },
      { key: "categories", label: "Categories", icon: FolderKanban, endpoint: "/property-categories", columns: categoryColumns },
      { key: "images", label: "Images", icon: ImageIcon, endpoint: "/property-images", columns: imageColumns },
      { key: "reviews", label: "Reviews", icon: Star, endpoint: "/reviews", columns: reviewColumns },
    ]),
  } as ApplicationConfig,

  nomad: {
    app: getApp("nomad"),
    emoji: "🧭",
    color: "nomad",
    entityName: "Listing",
    entityPluralName: "Listings",
    publicEndpoints: { reviews: null, orders: null },

    resources: defineResources([
      {
        key: "entities",
        label: "Listings",
        icon: Compass,
        endpoint: "/listings",
        paginated: true,
        params: COMMERCE_ENTITY_PARAMS,
        columns: commerceEntityColumns(Compass, "nomad", "per booking"),
      },
      { key: "categories", label: "Categories", icon: FolderKanban, endpoint: "/listing-categories", columns: categoryColumns },
      { key: "images", label: "Images", icon: ImageIcon, endpoint: "/listing-images", columns: imageColumns },
      { key: "reviews", label: "Reviews", icon: Star, endpoint: "/reviews", columns: reviewColumns },
    ]),
  } as ApplicationConfig,
} as const;

export type ApplicationId = keyof typeof APPLICATION_CONFIG;
