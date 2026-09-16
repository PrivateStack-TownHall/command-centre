import { useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";

interface DateRangePickerProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
}

function formatDate(value: string): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function DateRangePicker({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const label =
    dateFrom && dateTo
      ? `${formatDate(dateFrom)} - ${formatDate(dateTo)}`
      : "All dates";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
      >
        <CalendarDays className="h-4 w-4 text-slate-400" />
        {label}
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

          <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500">
                  From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => onDateFromChange(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => onDateToChange(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-primary"
                />
              </div>

              {(dateFrom || dateTo) && (
                <button
                  onClick={() => {
                    onDateFromChange("");
                    onDateToChange("");
                  }}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Clear dates
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DateRangePicker;
