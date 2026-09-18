import {
  buildResourceParams,
  filterRowsBySearch,
  type ResourceFilterState,
} from "../resource-query";

const state: ResourceFilterState = {
  search: "espresso",
  categoryId: "3",
  sort: "price",
  order: "asc",
  page: 2,
  limit: 10,
};

describe("buildResourceParams", () => {
  it("sends every param for a commerce-style paginated resource", () => {
    expect(
      buildResourceParams(
        {
          paginated: true,
          params: {
            search: true,
            category: { param: "categoryId", optionsFrom: "categories" },
            sort: true,
          },
        },
        state,
      ),
    ).toEqual({
      search: "espresso",
      categoryId: "3",
      sort: "price",
      order: "asc",
      page: 2,
      limit: 10,
    });
  });

  it("uses the resource's own category param name", () => {
    expect(
      buildResourceParams(
        {
          params: {
            search: true,
            category: { param: "genreId", optionsFrom: "genres" },
          },
        },
        state,
      ),
    ).toEqual({ search: "espresso", genreId: "3" });
  });

  it("sends nothing for a resource that declares no params", () => {
    expect(buildResourceParams({}, state)).toBeUndefined();
    expect(buildResourceParams(undefined, state)).toBeUndefined();
  });

  it("drops empty search and category values", () => {
    expect(
      buildResourceParams(
        {
          params: {
            search: true,
            category: { param: "categoryId", optionsFrom: "categories" },
          },
        },
        { ...state, search: "   ", categoryId: "" },
      ),
    ).toBeUndefined();
  });
});

describe("filterRowsBySearch", () => {
  const rows = [
    { id: 1, name: "Electronics", description: "Gadgets" },
    { id: 2, name: "Books", description: "Paper" },
    { id: 12, name: "Toys", description: null },
  ];

  it("returns all rows for an empty keyword", () => {
    expect(filterRowsBySearch(rows, "  ")).toBe(rows);
  });

  it("matches string fields case-insensitively", () => {
    expect(filterRowsBySearch(rows, "GADG")).toEqual([rows[0]]);
  });

  it("matches number fields", () => {
    expect(filterRowsBySearch(rows, "12")).toEqual([rows[2]]);
  });
});
