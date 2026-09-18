import { buildStatCards, type StatCardSources } from "../stat-cards";
import type { ResourceConfig } from "../../config/application.config";

const icon = (() => null) as unknown as ResourceConfig["icon"];

const resources: ResourceConfig[] = [
  { key: "entities", label: "Menu", icon, endpoint: "/menu", paginated: true },
  { key: "categories", label: "Categories", icon, endpoint: "/menu-categories" },
  { key: "reviews", label: "Reviews", icon, endpoint: "/reviews", statsKey: "reviews.total" },
  { key: "employees", label: "Employees", icon, endpoint: "/employee-profiles", requiresAuth: true },
];

const sources = (overrides: Partial<StatCardSources> = {}): StatCardSources => ({
  stats: { reviews: { total: 120 } },
  isStatsLoading: false,
  countOnlyKey: "entities",
  countOnlyTotal: 25,
  isCountOnlyLoading: false,
  getLoadedRowCount: () => undefined,
  isLoadingRows: () => false,
  ...overrides,
});

const byKey = (cards: ReturnType<typeof buildStatCards>) =>
  Object.fromEntries(cards.map((card) => [card.key, card]));

describe("buildStatCards", () => {
  it("reads counts from stats when the resource has a statsKey", () => {
    expect(byKey(buildStatCards(resources, sources())).reviews.count).toBe(120);
  });

  it("uses meta.total for the paginated resource without stats", () => {
    expect(byKey(buildStatCards(resources, sources())).entities.count).toBe(25);
  });

  it("falls back to rows loaded for an opened tab", () => {
    const cards = byKey(
      buildStatCards(
        resources,
        sources({ getLoadedRowCount: (r) => (r.key === "categories" ? 7 : undefined) }),
      ),
    );

    expect(cards.categories.count).toBe(7);
    expect(cards.employees.count).toBeUndefined();
  });

  it("shows loading only for the source that is still loading", () => {
    const cards = byKey(
      buildStatCards(
        resources,
        sources({ isStatsLoading: true, isLoadingRows: (r) => r.key === "categories" }),
      ),
    );

    expect(cards.reviews.isCountLoading).toBe(true);
    expect(cards.categories.isCountLoading).toBe(true);
    expect(cards.entities.isCountLoading).toBe(false);
  });

  it("marks admin-only resources as locked", () => {
    const cards = byKey(buildStatCards(resources, sources()));

    expect(cards.employees.locked).toBe(true);
    expect(cards.entities.locked).toBe(false);
  });
});
