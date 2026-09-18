import { badgeVariants, type BadgeColor } from "@/lib/badge-variants";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  description?: string;
  badgeName?: string;
  badgeColor?: BadgeColor;
  badgeEmoji?: string;
}

function PageHeader({
  title,
  description,
  badgeName,
  badgeColor = "mart",
  badgeEmoji,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <h1
          className="
            bg-gradient-to-r
            from-blue-600
            via-sky-500
            to-amber-500
            bg-clip-text
            text-2xl
            font-bold
            tracking-tight
            text-transparent
          "
        >
          {title}
        </h1>

        {badgeName && (
          <span
            className={`
             ml-2
            inline-flex
            items-center
            gap-1.5
            rounded-md
            px-3
            py-1
            text-xs
            font-semibold
            shadow-sm
              ${badgeVariants[badgeColor]}
            `}
          >
            {badgeEmoji && <span>{badgeEmoji}</span>}

            <span>{badgeName}</span>
          </span>
        )}
      </div>

      {description && (
        <p
          className="
            mt-2
            max-w-3xl
            text-sm
            text-muted-foreground
          "
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}

export default PageHeader;
