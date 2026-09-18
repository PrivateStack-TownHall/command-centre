import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

/**
 * Fields we never want to show as a raw column (internal ids, audit
 * timestamps, secrets). Extend this list if a new backend leaks something
 * similar.
 */
export const HIDDEN_FIELDS = new Set([
  "password",
  "passwordHash",
  "refreshToken",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "userId",
]);

export function humanize(key: string): string {
  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ");

  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function isImageField(key: string, value: unknown): value is string {
  if (typeof value !== "string") return false;

  return (
    /image|photo|avatar|thumbnail|picture/i.test(key) ||
    /\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i.test(value)
  );
}

function isCurrencyField(key: string): boolean {
  return /price|amount|cost|salary|total|fee/i.test(key);
}

function isDateField(key: string, value: unknown): boolean {
  if (typeof value !== "string") return false;

  return /date|_at$|At$/i.test(key) && !Number.isNaN(Date.parse(value));
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function renderValue(key: string, value: unknown): ReactNode {
  if (value === null || value === undefined || value === "") {
    return <span className="text-slate-400">—</span>;
  }

  if (isImageField(key, value)) {
    return (
      <img
        src={value}
        alt={key}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "https://placehold.co/64x64";
        }}
        className="h-10 w-10 rounded-lg object-cover shadow-sm"
      />
    );
  }

  if (typeof value === "boolean") {
    return value ? (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
        Yes
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">No</Badge>
    );
  }

  if (typeof value === "number" && isCurrencyField(key)) {
    return (
      <span className="font-semibold text-emerald-600">
        {formatCurrency(value)}
      </span>
    );
  }

  if (isDateField(key, value)) {
    return <span>{formatDate(value as string)}</span>;
  }

  // A nested relation object — show its `.name` (or similar) if it has one,
  // instead of "[object Object]".
  if (typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    const label = record.name ?? record.title ?? record.label;

    return <span>{typeof label === "string" ? label : "—"}</span>;
  }

  if (Array.isArray(value)) {
    return <span className="text-slate-500">{value.length} item(s)</span>;
  }

  return <span>{String(value)}</span>;
}

/**
 * Inspects a single sample row and generates a reasonable column for every
 * field on it. Field "type" (currency, date, image, boolean, plain text)
 * is inferred from the field name and value — no per-app config needed.
 * Call this with useMemo against the first row of whatever the API
 * actually returned, so columns automatically adapt if the backend's
 * shape changes.
 */
export function createAutoColumns<T extends Record<string, unknown>>(
  sample: T,
): ColumnDef<T>[] {
  return Object.keys(sample)
    .filter((key) => !HIDDEN_FIELDS.has(key))
    .filter((key) => !Array.isArray(sample[key])) // skip raw relation arrays
    .map((key) => ({
      accessorKey: key,
      header: humanize(key),
      cell: ({ row }) => renderValue(key, row.original[key as keyof T]),
    }));
}
