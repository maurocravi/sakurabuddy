import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { Companion } from "../components/Companion";
import { Button } from "../components/Button";
import { Hearts } from "../components/Hearts";
import { ProgressBar } from "../components/ProgressBar";
import { WordTile } from "../components/WordTile";
import { ChooseExercise } from "../components/exercises/ChooseExercise";
import { ArrangeExercise } from "../components/exercises/ArrangeExercise";
import { getCharacter } from "../data/characters";
import { getLesson } from "../data/lessons";
import type { Mood } from "../data/types";
import { useProgressContext } from "../hooks/ProgressContext";

type Phase = "review" | "play";

export function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [progress, actions] = useProgressContext();
  const lesson = getLesson(id);

  const [phase, setPhase] = useState<Phase>("review");
  const [index, setIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [attempt, setAttempt] = useState(0); // fuerza remontaje del ejercicio al reintentar
  const [mood, setMood] = useState<Mood>("thinking");
  const [feedback, setFeedback] = useState<string | null>(null);

  const character = progress.character ?? "yuki";
  const profile = getCharacter(character);

  const total = lesson?.exercises.length ?? 0;
  const exercise = lesson?.exercises[index];

  const reviewMessage = useMemo(
    () => "Mira las palabras, tócalas para oírlas y cuando estés listo, ¡practicamos!",
    [],
  );

  // Mensaje "thinking" estable por ejercicio/intento (evita parpadeo de la burbuja)
  const idleMessage = useMemo(() => {
    const pool = profile.lines.thinking;
    return pool[Math.floor(Math.random() * pool.length)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character, index, attempt]);

  if (!lesson) {
    return (
      <PageShell className="items-center justify-center">
        <p className="text-muted">Lección no encontrada.</p>
        <Button onClick={() => navigate("/niveles")}>Volver al mapa</Button>
      </PageShell>
    );
  }

  function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function handleResult(correct: boolean) {
    if (correct) {
      setMood("happy");
      setFeedback(pick(profile.lines.happy));
      setTimeout(() => {
        if (index + 1 >= total) {
          actions.completeLesson(lesson!.id);
          navigate(`/victoria/${lesson!.id}`);
        } else {
          setIndex((i) => i + 1);
          setMood("thinking");
          setFeedback(null);
          setAttempt((a) => a + 1);
        }
      }, 1100);
      return;
    }

    // Incorrecto: pierde una vida
    const remaining = hearts - 1;
    setHearts(remaining);
    setMood("sad");

    if (remaining <= 0) {
      setFeedback("¡Casi! Reiniciemos este nivel juntos 💪");
      setTimeout(() => {
        setIndex(0);
        setHearts(3);
        setMood("thinking");
        setFeedback(null);
        setAttempt((a) => a + 1);
      }, 1500);
    } else {
      setFeedback(pick(profile.lines.sad));
      setTimeout(() => {
        setMood("thinking");
        setFeedback(null);
        setAttempt((a) => a + 1); // remonta el mismo ejercicio para reintentar
      }, 1300);
    }
  }

  // -------------------------------------------------------------- REVIEW
  if (phase === "review") {
    return (
      <PageShell>
        <header className="mb-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/niveles")}
            className="text-2xl text-muted hover:text-ink"
            aria-label="Volver"
          >
            ←
          </button>
          <div>
            <h2 className="font-display text-xl font-extrabold text-ink">
              {lesson.emoji} {lesson.title}
            </h2>
            <span className="font-jp text-sm text-muted">{lesson.titleJp}</span>
          </div>
        </header>

        <div className="mb-5 flex justify-center">
          <Companion character={character} mood="cheer" size="md" message={reviewMessage} />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-muted">Vocabulario</span>
          <button
            onClick={actions.toggleRomaji}
            className="rounded-full border border-black/[0.08] bg-surface px-3 py-1.5 text-xs font-semibold text-ink"
          >
            {progress.romajiVisible ? "Ocultar romaji" : "Mostrar romaji"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {lesson.words.map((w) => (
            <WordTile key={w.jp} word={w} showRomaji={progress.romajiVisible} showEs />
          ))}
        </div>

        <div className="mt-7">
          <Button full onClick={() => setPhase("play")}>
            ¡Listo, practicar! →
          </Button>
        </div>
      </PageShell>
    );
  }

  // ---------------------------------------------------------------- PLAY
  return (
    <PageShell aurora={false}>
      {/* Barra superior: progreso + vidas */}
      <header className="mb-5 flex items-center gap-4">
        <button
          onClick={() => navigate("/niveles")}
          className="text-2xl text-muted hover:text-ink"
          aria-label="Salir"
        >
          ✕
        </button>
        <div className="flex-1">
          <ProgressBar value={index} total={total} />
        </div>
        <Hearts count={hearts} />
      </header>

      {/* Compañero reaccionando */}
      <div className="mb-6 flex justify-center">
        <Companion
          character={character}
          mood={mood}
          size="md"
          bubbleSide="right"
          message={feedback ?? idleMessage}
        />
      </div>

      {/* Ejercicio (remonta con attempt para reintentos limpios) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${index}-${attempt}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="flex flex-1 flex-col justify-center"
        >
          {exercise?.type === "choose" && (
            <ChooseExercise
              exercise={exercise}
              showRomaji={progress.romajiVisible}
              onResult={handleResult}
            />
          )}
          {exercise?.type === "arrange" && (
            <ArrangeExercise
              exercise={exercise}
              showRomaji={progress.romajiVisible}
              onResult={handleResult}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <p className="mt-4 text-center text-xs text-muted">
        Ejercicio {index + 1} de {total}
      </p>
    </PageShell>
  );
}
