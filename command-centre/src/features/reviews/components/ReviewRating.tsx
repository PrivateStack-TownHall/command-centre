import { Star } from "lucide-react";

interface ReviewRatingProps {
  rating: number;
  totalReviews: number;
}

function ReviewRating({ rating, totalReviews }: ReviewRatingProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-5 w-5 ${
              index < Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300"
            }`}
          />
        ))}
      </div>

      <div>
        <p className="text-xl font-bold text-slate-900">{rating.toFixed(1)}</p>

        <p className="text-sm text-slate-500">{totalReviews} Reviews</p>
      </div>
    </div>
  );
}

export default ReviewRating;
