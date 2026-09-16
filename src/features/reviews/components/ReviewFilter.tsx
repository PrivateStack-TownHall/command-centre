import { LayoutGrid, List, Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface ReviewFilterProps {
  search: string;
  application: string;
  rating: string;
  sort: string;
  view: "grid" | "list";

  onSearchChange: (value: string) => void;
  onApplicationChange: (value: string) => void;
  onRatingChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onViewChange: (view: "grid" | "list") => void;
}

function ReviewFilter({
  search,
  application,
  rating,
  sort,
  view,
  onSearchChange,
  onApplicationChange,
  onRatingChange,
  onSortChange,
  onViewChange,
}: ReviewFilterProps) {
  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        gap-3
        rounded-xl
        border
        border-slate-200
        bg-white
        p-3
        shadow-sm
      "
    >
      <div className="relative min-w-[280px] flex-1">
        <Search
          className="
            absolute
            left-3
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-slate-400
          "
        />

        <Input
          placeholder="Search reviews, products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 rounded-xl pl-10"
        />
      </div>

      <select
        value={application}
        onChange={(e) => onApplicationChange(e.target.value)}
        className="
          h-11
          min-w-[170px]
          rounded-xl
          border
          border-slate-200
          bg-white
          px-3
          text-sm
        "
      >
        <option value="">All Applications</option>
        <option value="kings-brew">☕ Kings Brew</option>
        <option value="castle-kitchen">🥩 Castle Kitchen</option>
        <option value="byte-burger">🍔 Byte Burger</option>
        <option value="quantum-mart">🛒 Quantum Mart</option>
        <option value="trade-hub">🏪 Trade Hub</option>
      </select>

      <select
        value={rating}
        onChange={(e) => onRatingChange(e.target.value)}
        className="
          h-11
          min-w-[150px]
          rounded-xl
          border
          border-slate-200
          bg-white
          px-3
          text-sm
        "
      >
        <option value="">All Ratings</option>
        <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
        <option value="4">⭐⭐⭐⭐ 4 Stars</option>
        <option value="3">⭐⭐⭐ 3 Stars</option>
        <option value="2">⭐⭐ 2 Stars</option>
        <option value="1">⭐ 1 Star</option>
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="
          h-11
          min-w-[160px]
          rounded-xl
          border
          border-slate-200
          bg-white
          px-3
          text-sm
        "
      >
        <option value="latest">Latest Reviews</option>
        <option value="oldest">Oldest Reviews</option>
        <option value="highest">Highest Rating</option>
        <option value="lowest">Lowest Rating</option>
      </select>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onViewChange("grid")}
          className={`flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors ${
            view === "grid"
              ? "bg-slate-900 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          Grid
        </button>

        <button
          onClick={() => onViewChange("list")}
          className={`flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors ${
            view === "list"
              ? "bg-slate-900 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <List className="h-4 w-4" />
          List
        </button>
      </div>
    </div>
  );
}

export default ReviewFilter;
