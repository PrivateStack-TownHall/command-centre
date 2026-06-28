import { Moon, Map } from "lucide-react";

import { motion } from "framer-motion";
import { APPLICATIONS } from "@/lib/constants";

import ecosystemMapButton from "@/assets/images/ecosystem-map-button.png";

function AppHeader() {
  return (
    <motion.header
      initial={{
        opacity: 0,
        y: -20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className="flex items-center justify-between border-b border-slate-200/60 bg-white/80 p-3"
    >
      {/* LEFT */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 px-2">
          Available Services
        </span>

        <div className="flex max-w-[750px] gap-2 overflow-x-auto scrollbar-none p-2">
          {APPLICATIONS.map((app) => (
            <motion.a
              key={app.id}
              href={app.url}
              target="_blank"
              rel="noreferrer"
              whileHover={{
                y: -2,
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="shrink-0 rounded-md px-2 py-1 text-xs font-medium transition-all"
              style={{
                backgroundColor: `${app.color}20`,
                color: app.color,
                border: `1px solid ${app.color}40`,
              }}
            >
              {app.emoji} {app.name}
            </motion.a>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{
            scale: 0.95,
          }}
          className="relative flex h-10 w-20 items-center rounded-full bg-slate-200 p-1"
        >
          <motion.div
            layout
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md"
          >
            <Moon size={16} />
          </motion.div>
        </motion.button>
        <motion.button
          whileHover={{
            scale: 1.03,
            y: -2,
          }}
          whileTap={{
            scale: 0.98,
          }}
          className="group relative overflow-hidden rounded-xl border border-blue-200 bg-white shadow-md"
        >
          <img
            src={ecosystemMapButton}
            alt="Ecosystem Map"
            className="h-16 w-44 object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-transparent" />

          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <p className="text-xs font-medium text-white/80">Interactive</p>

            <h3 className="text-sm font-bold text-white">Ecosystem Map</h3>
          </div>

          <motion.div
            animate={{
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute right-3 top-3 h-2 w-2 rounded-full bg-green-400"
          />
        </motion.button>
      </div>
    </motion.header>
  );
}

export default AppHeader;
