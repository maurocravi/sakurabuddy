import { AnimatePresence, motion } from "motion/react";

export function Hearts({ count, max = 3 }: { count: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const alive = i < count;
        return (
          <AnimatePresence mode="popLayout" key={i}>
            <motion.span
              key={alive ? "on" : "off"}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
              className="text-xl leading-none"
              style={{ filter: alive ? "none" : "grayscale(1) opacity(0.35)" }}
            >
              {alive ? "❤️" : "🤍"}
            </motion.span>
          </AnimatePresence>
        );
      })}
    </div>
  );
}
