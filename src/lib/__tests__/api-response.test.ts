import { unwrapItem, unwrapList, unwrapMeta } from "@/lib/api-response";

describe("unwrapList", () => {
  it("returns the array as-is when the payload is already a bare array", () => {
    expect(unwrapList([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("unwraps { data: [...] } envelopes", () => {
    const payload = { success: true, data: [{ id: 1 }, { id: 2 }] };

    expect(unwrapList(payload)).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it("returns [] instead of throwing when data is missing", () => {
    expect(unwrapList({ success: true })).toEqual([]);
  });

  it("returns [] instead of throwing when data is not an array (the exact bug this fixes)", () => {
    // This is the shape that used to crash with "categories.slice is not
    // a function": an envelope object was being treated as an array.
    const malformed = { success: true, data: { id: 1, name: "oops" } };

    expect(unwrapList(malformed)).toEqual([]);
  });

  it("returns [] for null/undefined payloads", () => {
    expect(unwrapList(null)).toEqual([]);
    expect(unwrapList(undefined)).toEqual([]);
  });
});

describe("unwrapItem", () => {
  it("unwraps a single-item envelope", () => {
    expect(unwrapItem({ success: true, data: { id: 1 } })).toEqual({ id: 1 });
  });

  it("returns the value itself when there's no envelope", () => {
    expect(unwrapItem({ id: 1 })).toEqual({ id: 1 });
  });
});

describe("unwrapMeta", () => {
  it("extracts pagination meta when present", () => {
    const meta = { page: 1, limit: 10, total: 30, totalPages: 3 };

    expect(unwrapMeta({ success: true, data: [], meta })).toEqual(meta);
  });

  it("returns undefined when meta is absent (non-paginated endpoints)", () => {
    expect(unwrapMeta({ success: true, data: [] })).toBeUndefined();
  });
});
