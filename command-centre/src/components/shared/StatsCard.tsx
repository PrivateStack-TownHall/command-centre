import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
}

function StatCard({
  title,
  value,
  description,
  icon,
  color = "#2563EB",
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.01,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
        rounded-xl

        border
        border-white/50

        bg-white/80

        p-5

        backdrop-blur-xl

        shadow-sm
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className="
              text-sm
              font-medium
              text-muted-foreground
            "
          >
            {title}
          </p>

          <h3
            className="
              mt-2

              text-3xl
              font-bold
              tracking-tight
            "
            style={{
              color,
            }}
          >
            {value}
          </h3>

          {description && (
            <p
              className="
                mt-2

                text-xs
                text-muted-foreground
              "
            >
              {description}
            </p>
          )}
        </div>

        {icon && (
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center

              rounded-xl
            "
            style={{
              backgroundColor: `${color}15`,
              color,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default StatCard;
