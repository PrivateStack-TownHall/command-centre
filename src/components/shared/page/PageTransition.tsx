import type { ReactNode } from "react";

import { motion } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
}

function PageTransition({ children }: PageTransitionProps) {
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
      exit={{
        opacity: 0,
        y: -12,
      }}
      transition={{
        duration: 0.25,
      }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
