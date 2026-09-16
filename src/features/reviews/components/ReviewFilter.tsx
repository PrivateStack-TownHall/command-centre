import { LayoutGrid, List, Search, Star } from "lucide-react";

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
        bg-slate-50/50
        p-3
      "
    >
      <div className="relative min-w-[300px] flex-1">
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
          className="pl-10"
        />
      </div>

      <select
        value={application}
        onChange={(e) => onApplicationChange(e.target.value)}
        className="
          h-10
          min-w-[180px]
          rounded-md
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
          h-10
          min-w-[180px]
          rounded-md
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
          h-10
          min-w-[180px]
          rounded-md
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

      <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
        <button
          onClick={() => onViewChange("grid")}
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
            view === "grid"
              ? "bg-primary text-white"
              : "text-slate-500 hover:bg-slate-100"
          }`}
          aria-label="Grid view"
        >
          <LayoutGrid className="h-4 w-4" />
        </button>

        <button
          onClick={() => onViewChange("list")}
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
            view === "list"
              ? "bg-primary text-white"
              : "text-slate-500 hover:bg-slate-100"
          }`}
          aria-label="List view"
        >
          <List className="h-4 w-4" />
        </button>
      </div>

      <div
        className="
          flex
          items-center
          gap-2
          rounded-lg
          bg-amber-50
          px-3
          py-2
          text-sm
          font-medium
          text-amber-700
        "
      >
        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
        Customer Feedback
      </div>
    </div>
  );
}

export default ReviewFilter;
