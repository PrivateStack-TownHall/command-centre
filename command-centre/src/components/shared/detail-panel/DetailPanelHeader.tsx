import { X } from "lucide-react";

import { motion } from "framer-motion";

interface DetailPanelHeaderProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
}

function DetailPanelHeader({
  title,
  subtitle,
  onClose,
}: DetailPanelHeaderProps) {
  return (
    <div
      className="
        sticky
        top-0
        z-10

        border-b

        bg-white

        p-4
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2
            className="
              text-lg
              font-semibold
            "
          >
            {title}
          </h2>

          {subtitle && (
            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {subtitle}
            </p>
          )}
        </div>

        <motion.button
          whileHover={{
            rotate: 90,
            scale: 1.1,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={onClose}
          className="
            rounded-md

            p-2

            text-slate-500

            hover:bg-slate-100
          "
        >
          <X size={18} />
        </motion.button>
      </div>
    </div>
  );
}

export default DetailPanelHeader;
