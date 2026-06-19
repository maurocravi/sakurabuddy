import { motion } from "motion/react";
import { useState } from "react";
import type { ChooseExercise as ChooseEx } from "../../data/types";
import { useSpeech } from "../../hooks/useSpeech";

type Props = {
  exercise: ChooseEx;
  showRomaji: boolean;
  onResult: (correct: boolean) => void;
};

export function ChooseExercise({ exercise, showRomaji, onResult }: Props) {
  const { speak } = useSpeech();
  const [picked, setPicked] = useState<string | null>(null);
  const locked = picked !== null;

  function handlePick(romaji: string) {
    if (locked) return;
    setPicked(romaji);
    const correct = romaji === exercise.answer;
    speak(exercise.prompt.jp);
    // pequeña pausa para que se vea el estado de la opción
    setTimeout(() => onResult(correct), 700);
  }

  return (
    <div className="flex w-full flex-col items-center gap-7">
      {/* Palabra objetivo en japonés (tocar = audio) */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => speak(exercise.prompt.jp)}
        className="flex flex-col items-center gap-1 rounded-3xl bg-surface px-10 py-6 shadow-[0_10px_30px_rgba(255,107,107,0.16)]"
      >
        <span className="font-jp text-5xl font-bold text-ink">{exercise.prompt.jp}</span>
        {showRomaji && (
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            {exercise.prompt.romaji}
          </span>
        )}
        <span className="mt-1 text-xs text-muted">🔊 tocar para escuchar</span>
      </motion.button>

      <p className="text-sm font-medium text-muted">¿Qué significa?</p>

      {/* Opciones en español */}
      <div className="grid w-full grid-cols-2 gap-3">
        {exercise.options.map((opt) => {
          const isPicked = picked === opt.romaji;
          const isCorrect = opt.romaji === exercise.answer;
          let state = "idle";
          if (locked && isCorrect) state = "correct";
          else if (isPicked && !isCorrect) state = "wrong";

          return (
            <motion.button
              key={opt.romaji}
              type="button"
              disabled={locked}
              whileTap={locked ? undefined : { scale: 0.96 }}
              onClick={() => handlePick(opt.romaji)}
              animate={state === "wrong" ? { x: [0, -8, 8, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border-2 px-4 py-4 text-base font-semibold capitalize transition-colors"
              style={{
                borderColor:
                  state === "correct"
                    ? "var(--success)"
                    : state === "wrong"
                      ? "var(--error)"
                      : "rgba(0,0,0,0.06)",
                background:
                  state === "correct"
                    ? "var(--success-soft)"
                    : state === "wrong"
                      ? "var(--error-soft)"
                      : "var(--surface)",
                color:
                  state === "correct"
                    ? "var(--success)"
                    : state === "wrong"
                      ? "var(--error)"
                      : "var(--text-primary)",
              }}
            >
              {opt.es}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
