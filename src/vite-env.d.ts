/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;

  // --- commerce-core (unchanged, already correct) ---
  readonly VITE_KINGS_BREW_URL: string;
  readonly VITE_CASTLE_KITCHEN_URL: string;
  readonly VITE_TRADE_HUB_URL: string;
  readonly VITE_BYTE_BURGER_URL: string;
  readonly VITE_QUANTUM_MART_URL: string;

  // --- operations-core (real code, endpoints confirmed from source) ---
  readonly VITE_PINEAPPLE_STACK_URL: string;
  readonly VITE_M_PLOYEE_URL: string;
  readonly VITE_CODIGRAM_URL: string;
  readonly VITE_LEATHER_SHELF_URL: string;
  readonly VITE_WARETRACK_URL: string;

  // --- TEMPLATE — no real backend yet ---
  readonly VITE_MEDIEVAL_AIRBNB_URL: string;
  readonly VITE_NOMAD_URL: string;

  readonly VITE_AUDIT_LOG_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
