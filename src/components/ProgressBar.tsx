import { motion } from "motion/react";

export function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total === 0 ? 0 : Math.min(100, (value / total) * 100);
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-black/[0.06]">
      <motion.div
        className="h-full rounded-full"
        style={{ background: "var(--gradient)" }}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 200, damping: 28 }}
      />
    </div>
  );
}
