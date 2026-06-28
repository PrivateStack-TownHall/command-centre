import { User, Star } from "lucide-react";

import type { Review } from "../types/review.type";

interface ReviewCardProps {
  review: Review;
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-200
        bg-white
        p-4
      "
    >
      <div className="flex items-start gap-3">
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-slate-100
          "
        >
          <User className="h-5 w-5 text-slate-500" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold">Customer #{review.userId}</p>

            <div className="flex items-center gap-1">
              {Array.from({ length: review.rating }).map((_, index) => (
                <Star
                  key={index}
                  className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
          </div>

          <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
