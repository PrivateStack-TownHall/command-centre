import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

import { PATHS } from "@/app/routes/paths";

import type { CommandCentreApplication } from "../types/command-centre.type";

interface RecentReviewsProps {
  applications: CommandCentreApplication[];
}

function RecentReviews({ applications }: RecentReviewsProps) {
  const reviews = applications
    .flatMap((app) =>
      app.reviews.map((review: any) => ({ ...review, application: app.name })),
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500" />
          <div>
            <h2 className="font-semibold">Recent Reviews</h2>
            <p className="text-sm text-slate-500">Latest customer reviews.</p>
          </div>
        </div>

        <Link
          to={PATHS.REVIEWS}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View All Reviews
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {reviews.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          No reviews yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-2 pr-2">#</th>
                <th className="pb-2 pr-2">Customer</th>
                <th className="pb-2 pr-2">Rating</th>
                <th className="pb-2 pr-2">Comment</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reviews.map((review: any) => (
                <tr key={`${review.application}-${review.id}`}>
                  <td className="py-2.5 pr-2 font-medium">#{review.id}</td>
                  <td className="py-2.5 pr-2 text-slate-600">
                    {review.user?.fullName ?? "Anonymous"}
                  </td>
                  <td className="py-2.5 pr-2">
                    <div className="flex">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="max-w-[220px] truncate py-2.5 pr-2 text-slate-500">
                    {review.comment}
                  </td>
                  <td className="py-2.5 text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecentReviews;
