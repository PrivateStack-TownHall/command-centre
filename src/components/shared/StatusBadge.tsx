import { motion } from "framer-motion";

type Status = "online" | "offline" | "warning" | "maintenance";

interface StatusBadgeProps {
  status: Status;
}

const statusConfig = {
  online: {
    label: "Online",
    color: "#22C55E",
    bg: "#DCFCE7",
  },

  offline: {
    label: "Offline",
    color: "#DC2626",
    bg: "#FEE2E2",
  },

  warning: {
    label: "Warning",
    color: "#F59E0B",
    bg: "#FEF3C7",
  },

  maintenance: {
    label: "Maintenance",
    color: "#6366F1",
    bg: "#E0E7FF",
  },
};

function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      className="
        inline-flex
        items-center
        gap-2

        rounded-full

        px-3
        py-1

        text-xs
        font-semibold
      "
      style={{
        backgroundColor: config.bg,
        color: config.color,
      }}
    >
      <motion.span
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="h-2 w-2 rounded-full"
        style={{
          backgroundColor: config.color,
        }}
      />

      {config.label}
    </motion.div>
  );
}

export default StatusBadge;
