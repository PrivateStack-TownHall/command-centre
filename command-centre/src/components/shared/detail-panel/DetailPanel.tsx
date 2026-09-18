import type { ReactNode } from "react";

import { AnimatePresence, motion } from "framer-motion";

interface DetailPanelProps {
  isOpen: boolean;
  children: ReactNode;
}

function DetailPanel({ isOpen, children }: DetailPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{
            width: 0,
            opacity: 0,
          }}
          animate={{
            width: 420,
            opacity: 1,
          }}
          exit={{
            width: 0,
            opacity: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 28,
          }}
          className="
            overflow-hidden

            rounded-md

            border
            border-slate-200

            bg-white

            shadow-lg
          "
        >
          <div className="h-full overflow-y-auto">{children}</div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default DetailPanel;
