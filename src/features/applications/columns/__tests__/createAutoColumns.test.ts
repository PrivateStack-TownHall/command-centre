import { createAutoColumns } from "@/features/applications/columns/createAutoColumns";

describe("createAutoColumns", () => {
  it("generates one column per visible field, in order", () => {
    const sample = { id: 1, name: "Espresso", price: 25000, isActive: true };

    const columns = createAutoColumns(sample);
    const keys = columns.map((c) => (c as { accessorKey: string }).accessorKey);

    expect(keys).toEqual(["id", "name", "price", "isActive"]);
  });

  it("humanizes camelCase field names into readable headers", () => {
    const sample = { fullName: "Jane Doe", hireDate: "2024-01-01" };

    const columns = createAutoColumns(sample);

    expect(columns[0].header).toBe("Full Name");
    expect(columns[1].header).toBe("Hire Date");
  });

  it("hides internal/sensitive fields", () => {
    const sample = {
      id: 1,
      name: "Jane",
      password: "secret",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-02",
    };

    const columns = createAutoColumns(sample);
    const keys = columns.map((c) => (c as { accessorKey: string }).accessorKey);

    expect(keys).toEqual(["id", "name"]);
  });

  it("skips raw relation arrays (e.g. images[], stocks[])", () => {
    const sample = { id: 1, name: "Product", images: [{ url: "a.png" }] };

    const columns = createAutoColumns(sample);
    const keys = columns.map((c) => (c as { accessorKey: string }).accessorKey);

    expect(keys).not.toContain("images");
  });

  it("produces a cell renderer for every column", () => {
    const sample = { id: 1, name: "Product" };

    const columns = createAutoColumns(sample);

    columns.forEach((column) => {
      expect(typeof column.cell).toBe("function");
    });
  });
});
