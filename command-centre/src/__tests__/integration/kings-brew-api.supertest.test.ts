import request from "supertest";

/**
 * This hits the real, deployed Kings Brew API (not a mock) to confirm the
 * response envelope contract our frontend relies on — { success, data,
 * meta? } — actually matches what's running in production. It's what
 * would have caught the "categories.slice is not a function" mismatch
 * before it ever reached the browser.
 *
 * Supertest can test a remote base URL directly (not just an in-process
 * app), which is what we use it for here.
 *
 * Requires outbound network access to onrender.com. If that's not
 * available in the current environment (e.g. a sandboxed CI runner),
 * this suite is skipped rather than failing on a network error.
 */
const BASE_URL = process.env.VITE_KINGS_BREW_URL || "https://kings-brew.onrender.com";
const RUN_INTEGRATION_TESTS = process.env.RUN_INTEGRATION_TESTS === "true";

const describeIfNetwork = RUN_INTEGRATION_TESTS ? describe : describe.skip;

describeIfNetwork("Kings Brew API contract (integration)", () => {
  it("GET /coffees returns a paginated envelope: { success, meta, data: [] }", async () => {
    const response = await request(BASE_URL).get("/coffees");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("meta");
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("GET /coffee-categories returns a non-paginated envelope: { success, data: [] }", async () => {
    const response = await request(BASE_URL).get("/coffee-categories");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("GET /health responds (used by the Command Centre dashboard)", async () => {
    const response = await request(BASE_URL).get("/health");

    expect(response.status).toBe(200);
  });
});
