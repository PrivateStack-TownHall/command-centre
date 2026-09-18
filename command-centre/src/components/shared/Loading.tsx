import { motion } from "framer-motion";

interface LoadingProps {
  label?: string;
  variant?: "inline" | "page";
}

const dotTransition = (delay: number) => ({
  duration: 0.9,
  repeat: Infinity,
  ease: "easeInOut" as const,
  delay,
});

function Loading({ label = "Loading...", variant = "inline" }: LoadingProps) {
  return (
    <div
      className={
        variant === "page"
          ? "flex min-h-screen w-full flex-col items-center justify-center gap-5 bg-slate-50"
          : "flex min-h-[400px] w-full flex-col items-center justify-center gap-5"
      }
    >
      <div className="flex items-end gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-3.5 w-3.5 rounded-full bg-gradient-to-br from-blue-600 via-sky-500 to-amber-500"
            animate={{
              y: ["0%", "-90%", "0%"],
              opacity: [0.6, 1, 0.6],
            }}
            transition={dotTransition(i * 0.15)}
          />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-sm font-medium text-muted-foreground"
      >
        {label}
      </motion.p>
    </div>
  );
}

export default Loading;
