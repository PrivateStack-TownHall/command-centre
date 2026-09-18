import { Briefcase, Star, Users, CircleCheck } from "lucide-react";

interface ReviewStatsProps {
  totalReviews: number;
  averageRating: number;
  totalProducts: number;
}

function ReviewStats({
  totalReviews,
  averageRating,
  totalProducts,
}: ReviewStatsProps) {
  const satisfaction = Math.round((averageRating / 5) * 100);

  const stats = [
    {
      label: "Products",
      value: totalProducts.toLocaleString(),
      icon: Briefcase,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Avg Rating",
      value: averageRating.toFixed(1),
      icon: Star,
      color: "bg-amber-50 text-amber-500",
    },
    {
      label: "Total Reviews",
      value: totalReviews.toLocaleString(),
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Satisfaction",
      value: `${satisfaction}%`,
      icon: CircleCheck,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div key={stat.label} className="flex items-center gap-2.5">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${stat.color}`}
            >
              <Icon className="h-4.5 w-4.5" />
            </div>

            <div>
              <p className="text-lg font-bold leading-none text-slate-900">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ReviewStats;
