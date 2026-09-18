import { useMemo, useState } from "react";
import { FileText } from "lucide-react";

interface Props {
  logs: any[];
  isLoading?: boolean;
}

type Level = "INFO" | "WARN" | "ERROR";

const LEVEL_STYLE: Record<Level, string> = {
  INFO: "bg-emerald-100 text-emerald-700",
  WARN: "bg-amber-100 text-amber-700",
  ERROR: "bg-red-100 text-red-700",
};

const LEVEL_DOT: Record<Level, string> = {
  INFO: "bg-emerald-500",
  WARN: "bg-amber-500",
  ERROR: "bg-red-500",
};

/**
 * The real /activities data has no severity field, so we infer one from
 * the log's own text — this is a heuristic derived from real content,
 * not a fabricated value. Defaults to INFO when nothing matches.
 */
function inferLevel(text: string): Level {
  const lower = text.toLowerCase();
  if (/error|failed|fail|timeout|disconnect/.test(lower)) return "ERROR";
  if (/warn|high|elevated|slow/.test(lower)) return "WARN";
  return "INFO";
}

const PER_PAGE_OPTIONS = [10, 20, 50];

export default function AuditLogsCard({ logs, isLoading }: Props) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const rows = useMemo(() => {
    return logs
      .map((log: any) => ({
        id: log.id,
        time: log.createdAt,
        level: inferLevel(`${log.title ?? ""} ${log.description ?? ""}`),
        service: log.application ?? "System",
        message: log.title ?? log.description ?? "-",
      }))
      .filter((row) => {
        const t = new Date(row.time).getTime();
        const matchFrom = !dateFrom || t >= new Date(dateFrom).getTime();
        const matchTo =
          !dateTo || t <= new Date(dateTo).getTime() + 86400000 - 1;
        return matchFrom && matchTo;
      })
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }, [logs, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paginatedRows = rows.slice(
    (safePage - 1) * perPage,
    safePage * perPage,
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-violet-600" />
          <h2 className="font-semibold">Audit Logs</h2>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
            className="w-[120px] bg-transparent text-xs outline-none"
          />
          <span className="text-slate-300">–</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
            className="w-[120px] bg-transparent text-xs outline-none"
          />
        </div>
      </div>

      {isLoading && (
        <div className="py-10 text-center text-sm text-slate-500">
          Loading audit logs...
        </div>
      )}

      {!isLoading && rows.length === 0 && (
        <div className="py-10 text-center text-sm text-slate-500">
          No activity logs to show right now.
        </div>
      )}

      {!isLoading && rows.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-2 pr-3">Time</th>
                  <th className="pb-2 pr-3">Level</th>
                  <th className="pb-2 pr-3">Service</th>
                  <th className="pb-2">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedRows.map((row) => (
                  <tr key={row.id}>
                    <td className="whitespace-nowrap py-2.5 pr-3 text-slate-500">
                      {new Date(row.time).toLocaleString("en-GB", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-2.5 pr-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${LEVEL_STYLE[row.level]}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${LEVEL_DOT[row.level]}`}
                        />
                        {row.level}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 font-medium text-slate-700">
                      {row.service}
                    </td>
                    <td className="py-2.5 text-slate-600">{row.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500">
              Showing {(safePage - 1) * perPage + 1}–
              {Math.min(safePage * perPage, rows.length)} of {rows.length} logs
            </p>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  disabled={safePage === 1}
                  onClick={() => setPage(safePage - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-sm disabled:opacity-40"
                >
                  ‹
                </button>
                <span className="px-2 text-sm font-medium text-slate-600">
                  {safePage} / {totalPages}
                </span>
                <button
                  disabled={safePage === totalPages}
                  onClick={() => setPage(safePage + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-sm disabled:opacity-40"
                >
                  ›
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                Show
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-md border border-slate-200 px-1.5 py-1 text-xs"
                >
                  {PER_PAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                per page
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
