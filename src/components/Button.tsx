import { motion } from "motion/react";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "soft";
  disabled?: boolean;
  full?: boolean;
  className?: string;
  type?: "button" | "submit";
};

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  full = false,
  className = "",
  type = "button",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-[15px] font-bold font-display transition-shadow disabled:opacity-40 disabled:cursor-not-allowed select-none";

  const variants: Record<string, string> = {
    primary: "text-white shadow-[0_8px_24px_rgba(255,107,107,0.35)]",
    soft: "bg-white text-ink border border-black/[0.06] shadow-[0_4px_14px_rgba(87,75,144,0.1)]",
    ghost: "bg-transparent text-muted hover:text-ink",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={`${base} ${variants[variant]} ${full ? "w-full" : ""} ${className}`}
      style={variant === "primary" ? { background: "var(--gradient)" } : undefined}
    >
      {children}
    </motion.button>
  );
}
