import type { ReactNode } from "react";

import { motion } from "framer-motion";

interface EntityFormProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

function EntityForm({
  title,
  description,
  children,
  actions,
}: EntityFormProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        rounded-md
        border
        bg-white
        p-6
        shadow-sm
      "
    >
      <div className="mb-6">
        <h2
          className="
            text-lg
            font-semibold
          "
        >
          {title}
        </h2>

        {description && (
          <p
            className="
              mt-1
              text-sm
              text-muted-foreground
            "
          >
            {description}
          </p>
        )}
      </div>

      <div className="space-y-4">{children}</div>

      {actions && (
        <div
          className="
            mt-6
            flex
            justify-end
            gap-2
          "
        >
          {actions}
        </div>
      )}
    </motion.div>
  );
}

export default EntityForm;
