import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

function SearchField({ value, onChange, placeholder }: SearchFieldProps) {
  return (
    <div className="relative min-w-[240px] flex-1">
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      />

      <Input
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-xl border-slate-200 bg-white pl-10 focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/30"
      />
    </div>
  );
}

export default SearchField;
