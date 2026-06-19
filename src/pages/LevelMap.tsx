import { motion } from "motion/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { Companion } from "../components/Companion";
import { lessons } from "../data/lessons";
import { useProgressContext } from "../hooks/ProgressContext";

export function LevelMap() {
  const navigate = useNavigate();
  const [progress, actions] = useProgressContext();

  // Sin personaje elegido → al selector
  useEffect(() => {
    if (!progress.character) navigate("/personaje", { replace: true });
  }, [progress.character, navigate]);

  if (!progress.character) return null;

  const completedCount = progress.completedLessons.length;

  function isUnlocked(unlockAfter?: string) {
    if (!unlockAfter) return true;
    return actions.isCompleted(unlockAfter);
  }

  return (
    <PageShell>
      {/* Header con streak */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-ink">Tus niveles</h2>
          <p className="text-sm text-muted">
            {completedCount}/{lessons.length} completados
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-2 shadow-[0_4px_14px_rgba(255,107,107,0.15)]">
          <span className="text-lg">🔥</span>
          <span className="font-display text-lg font-extrabold text-ink">
            {progress.currentStreak}
          </span>
        </div>
      </header>

      {/* Compañero saludando */}
      <div className="mb-6 flex justify-center">
        <Companion
          character={progress.character}
          mood="neutral"
          size="md"
          bubbleSide="right"
          message={completedCount === 0 ? "¡Vamos por el primero!" : "¿Qué practicamos hoy?"}
        />
      </div>

      {/* Lista de niveles */}
      <div className="flex flex-col gap-3">
        {lessons.map((lesson, i) => {
          const done = actions.isCompleted(lesson.id);
          const unlocked = isUnlocked(lesson.unlockAfter);

          return (
            <motion.button
              key={lesson.id}
              type="button"
              disabled={!unlocked}
              whileTap={unlocked ? { scale: 0.98 } : undefined}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => unlocked && navigate(`/leccion/${lesson.id}`)}
              className="flex items-center gap-4 rounded-3xl border border-black/[0.05] bg-surface p-4 text-left disabled:opacity-55"
              style={{
                boxShadow: done
                  ? "0 8px 22px rgba(43,182,115,0.18)"
                  : "0 6px 18px rgba(255,107,107,0.1)",
              }}
            >
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl"
                style={{
                  background: unlocked ? "var(--gradient)" : "rgba(0,0,0,0.05)",
                }}
              >
                {unlocked ? lesson.emoji : "🔒"}
              </div>
              <div className="flex flex-1 flex-col">
                <span className="flex items-center gap-2">
                  <span className="font-display text-lg font-bold text-ink">
                    {lesson.title}
                  </span>
                  <span className="font-jp text-sm text-muted">{lesson.titleJp}</span>
                </span>
                <span className="text-[13px] text-muted">
                  {lesson.exercises.length} ejercicios · {lesson.words.length} palabras
                </span>
              </div>
              {done ? (
                <span className="text-xl text-success">✅</span>
              ) : unlocked ? (
                <span className="font-display text-xl font-bold text-primary">→</span>
              ) : null}
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={() => navigate("/personaje")}
        className="mx-auto mt-8 text-sm font-semibold text-muted hover:text-ink"
      >
        Cambiar de compañero
      </button>
    </PageShell>
  );
}
