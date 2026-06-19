import { motion } from "motion/react";
import type { Word } from "../data/types";
import { useSpeech } from "../hooks/useSpeech";

type WordTileProps = {
  word: Word;
  showRomaji?: boolean;
  showEs?: boolean;
  onTap?: () => void;
  className?: string;
};

/** Tile de palabra: reproduce el audio japonés al tocar. */
export function WordTile({
  word,
  showRomaji = true,
  showEs = false,
  onTap,
  className = "",
}: WordTileProps) {
  const { speak } = useSpeech();

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        speak(word.jp);
        onTap?.();
      }}
      className={`group flex flex-col items-center justify-center gap-0.5 rounded-2xl border border-black/[0.05] bg-surface px-4 py-3 shadow-[0_4px_14px_rgba(255,107,107,0.1)] transition-shadow hover:shadow-[0_8px_22px_rgba(255,107,107,0.18)] ${className}`}
    >
      <span className="font-jp text-2xl font-bold text-ink">{word.jp}</span>
      {showRomaji && (
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          {word.romaji}
        </span>
      )}
      {showEs && <span className="text-sm text-muted">{word.es}</span>}
      <span className="mt-0.5 text-[11px] text-muted opacity-0 transition-opacity group-hover:opacity-100">
        🔊 tocar
      </span>
    </motion.button>
  );
}
