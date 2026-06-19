import { motion } from "motion/react";
import type { ReactNode } from "react";

export function PageShell({
  children,
  className = "",
  aurora = true,
}: {
  children: ReactNode;
  className?: string;
  aurora?: boolean;
}) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className={`${aurora ? "bg-aurora" : ""} relative flex min-h-[100dvh] flex-col items-center ${className}`}
    >
      <div className="relative z-[1] flex w-full max-w-md flex-1 flex-col px-5 py-8">
        {children}
      </div>
    </motion.main>
  );
}
