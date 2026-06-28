import { Star } from "lucide-react";

import type { CommandCentreApplication } from "../types/command-centre.type";

interface RecentReviewsProps {
  applications: CommandCentreApplication[];
}

function RecentReviews({ applications }: RecentReviewsProps) {
  const reviews = applications
    .flatMap((app) =>
      app.reviews.map((review: any) => ({
        ...review,
        application: app.name,
        emoji: app.emoji,
      })),
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Star className="h-5 w-5 text-amber-500" />

        <div>
          <h2 className="font-semibold">Recent Reviews</h2>

          <p className="text-sm text-slate-500">Latest customer reviews.</p>
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((review: any) => (
          <div
            key={`${review.application}-${review.id}`}
            className="rounded-xl border border-slate-100 p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{review.emoji}</span>

                <span className="font-medium">{review.application}</span>
              </div>

              <div className="flex">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            </div>

            <p className="text-sm text-slate-600">{review.comment}</p>

            <p className="mt-2 text-xs text-slate-400">
              {new Date(review.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentReviews;
