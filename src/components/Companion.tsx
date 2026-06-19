import { AnimatePresence, motion, type Variants } from "motion/react";
import { useEffect, useMemo } from "react";
import type { Character, Mood } from "../data/types";
import { getCharacter } from "../data/characters";
import { useSpeech } from "../hooks/useSpeech";

type Size = "sm" | "md" | "lg";

const sizeMap: Record<Size, number> = { sm: 96, md: 150, lg: 230 };

// Animaciones de cuerpo por mood — el "signature element"
const moodVariants: Variants = {
  neutral: { y: [0, -6, 0], rotate: 0, scale: 1, transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
  thinking: { rotate: [0, -3, 3, -3, 0], y: 0, scale: 1, transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } },
  cheer: { y: [0, -16, 0], scale: [1, 1.04, 1], rotate: 0, transition: { duration: 0.7, repeat: Infinity, ease: "easeInOut" } },
  happy: { y: [0, -22, 0, -10, 0], scale: [1, 1.08, 1], rotate: 0, transition: { duration: 0.7, ease: "easeOut" } },
  sad: { rotate: [0, -7, 7, -5, 0], y: [0, 6, 0], scale: 0.98, transition: { duration: 0.6, ease: "easeInOut" } },
};

// Filtros sutiles para reforzar la emoción con una sola imagen
const moodFilter: Record<Mood, string> = {
  neutral: "saturate(1) brightness(1)",
  thinking: "saturate(0.95) brightness(0.99)",
  cheer: "saturate(1.1) brightness(1.05)",
  happy: "saturate(1.15) brightness(1.07)",
  sad: "saturate(0.8) brightness(0.97)",
};

const moodGlow: Record<Mood, string> = {
  neutral: "rgba(255,107,107,0.18)",
  thinking: "rgba(87,75,144,0.18)",
  cheer: "rgba(255,107,107,0.3)",
  happy: "rgba(43,182,115,0.32)",
  sad: "rgba(138,138,154,0.22)",
};

type CompanionProps = {
  character: Character;
  mood?: Mood;
  message?: string;
  /** lee el mensaje (o una línea japonesa) en voz alta al cambiar */
  speaking?: boolean;
  /** texto japonés a vocalizar cuando speaking está activo */
  speakText?: string;
  size?: Size;
  className?: string;
  bubbleSide?: "top" | "right";
};

export function Companion({
  character,
  mood = "neutral",
  message,
  speaking = false,
  speakText,
  size = "md",
  className = "",
  bubbleSide = "top",
}: CompanionProps) {
  const profile = getCharacter(character);
  const px = sizeMap[size];
  const { speak } = useSpeech();

  // Mensaje por defecto según mood si no se pasa uno explícito
  const text = useMemo(() => {
    if (message !== undefined) return message;
    const pool = profile.lines[mood];
    return pool[Math.floor(Math.random() * pool.length)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, mood, character]);

  useEffect(() => {
    if (speaking && speakText) speak(speakText);
  }, [speaking, speakText, speak]);

  const bubble = text ? (
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        initial={{ opacity: 0, scale: 0.85, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: -8 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
        className={`relative max-w-[230px] rounded-2xl bg-white px-4 py-3 text-center text-[15px] font-medium leading-snug text-ink shadow-[0_8px_24px_rgba(87,75,144,0.18)] ${
          bubbleSide === "top" ? "" : "text-left"
        }`}
        style={{ fontFamily: "var(--font-body)" }}
      >
        {text}
        {/* Cola estilo manga apuntando al personaje */}
        {bubbleSide === "top" ? (
          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[1px] border-x-[10px] border-t-[12px] border-x-transparent border-t-white" />
        ) : (
          <span className="absolute right-full top-1/2 -translate-y-1/2 translate-x-[1px] border-y-[10px] border-r-[12px] border-y-transparent border-r-white" />
        )}
      </motion.div>
    </AnimatePresence>
  ) : null;

  const avatar = (
    <motion.div
      key={mood}
      variants={moodVariants}
      animate={mood}
      style={{ width: px, height: px }}
      className="relative shrink-0"
    >
      {/* Halo de color según mood */}
      <div
        className="absolute inset-0 rounded-full blur-2xl transition-colors duration-500"
        style={{ background: moodGlow[mood], transform: "scale(0.9)" }}
      />
      <img
        src={profile.img}
        alt={profile.name}
        draggable={false}
        className="relative h-full w-full select-none object-contain transition-[filter] duration-500 drop-shadow-[0_10px_18px_rgba(87,75,144,0.25)]"
        style={{ filter: moodFilter[mood] }}
      />
    </motion.div>
  );

  if (bubbleSide === "right") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {avatar}
        {bubble}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {bubble}
      {avatar}
    </div>
  );
}
