import {
  MessageSquareText,
  Star,
  TrendingUp,
  Package,
  Award,
  Smile,
} from "lucide-react";

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
      label: "Reviews",
      value: totalReviews.toLocaleString(),
      icon: MessageSquareText,
      color: "bg-blue-50 text-blue-600",
    },

    {
      label: "Rating",
      value: averageRating.toFixed(1),
      icon: Star,
      color: "bg-amber-50 text-amber-600",
    },

    {
      label: "Products",
      value: totalProducts.toLocaleString(),
      icon: Package,
      color: "bg-violet-50 text-violet-600",
    },

    {
      label: "Satisfaction",
      value: `${satisfaction}%`,
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-600",
    },

    {
      label: "Top Rated",
      value: averageRating >= 4.5 ? "Excellent" : "Good",
      icon: Award,
      color: "bg-orange-50 text-orange-600",
    },

    {
      label: "Sentiment",
      value: satisfaction >= 90 ? "Positive" : "Neutral",
      icon: Smile,
      color: "bg-pink-50 text-pink-600",
    },
  ];

  return (
    <div
      className="
        grid
        grid-cols-2
        gap-3
        xl:grid-cols-6
      "
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              shadow-sm
              transition-all
              hover:shadow-md
            "
          >
            <div
              className={`
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                ${stat.color}
              `}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p
                className="
                  truncate
                  text-xs
                  font-medium
                  uppercase
                  tracking-wide
                  text-slate-500
                "
              >
                {stat.label}
              </p>

              <h3
                className="
                  text-xl
                  font-bold
                  text-slate-900
                "
              >
                {stat.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ReviewStats;
