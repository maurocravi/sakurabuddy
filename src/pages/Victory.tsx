import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { Companion } from "../components/Companion";
import { Button } from "../components/Button";
import { lessons, getLesson } from "../data/lessons";
import { useProgressContext } from "../hooks/ProgressContext";
import { useSpeech } from "../hooks/useSpeech";

export function Victory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [progress] = useProgressContext();
  const { speak } = useSpeech();

  const lesson = getLesson(id);
  const character = progress.character ?? "yuki";

  const currentIdx = lessons.findIndex((l) => l.id === id);
  const next = currentIdx >= 0 ? lessons[currentIdx + 1] : undefined;

  // Confeti al montar
  useEffect(() => {
    const fire = (x: number) =>
      confetti({
        particleCount: 70,
        spread: 70,
        startVelocity: 45,
        origin: { x, y: 0.6 },
        colors: ["#ff6b6b", "#574b90", "#c44569", "#ffd166"],
      });
    fire(0.3);
    setTimeout(() => fire(0.7), 200);
    setTimeout(() => fire(0.5), 400);
    speak("やったね"); // "¡lo lograste!"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!lesson) {
    return (
      <PageShell className="items-center justify-center">
        <Button onClick={() => navigate("/niveles")}>Volver al mapa</Button>
      </PageShell>
    );
  }

  return (
    <PageShell className="justify-center text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="flex flex-col items-center gap-4"
      >
        <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-primary">
          ¡Nivel completado!
        </span>
        <h2 className="font-display text-3xl font-extrabold text-ink">
          {lesson.emoji} {lesson.title}
        </h2>

        <Companion
          character={character}
          mood="cheer"
          size="lg"
          message="¡Lo lograste! Estoy súper orgulloso de ti 🎉"
        />

        <div className="mt-2 flex items-center gap-2 rounded-full bg-surface px-4 py-2 shadow-[0_6px_18px_rgba(255,107,107,0.18)]">
          <span className="text-lg">🔥</span>
          <span className="font-display font-bold text-ink">
            Racha de {progress.currentStreak}{" "}
            {progress.currentStreak === 1 ? "día" : "días"}
          </span>
        </div>
      </motion.div>

      <div className="mt-10 flex w-full flex-col gap-3">
        {next ? (
          <Button full onClick={() => navigate(`/leccion/${next.id}`)}>
            Siguiente nivel: {next.title} →
          </Button>
        ) : (
          <p className="text-sm font-medium text-muted">
            ¡Completaste todos los niveles del MVP! 🌸 Pronto habrá más.
          </p>
        )}
        <Button variant="soft" full onClick={() => navigate("/niveles")}>
          Volver al mapa
        </Button>
      </div>
    </PageShell>
  );
}
