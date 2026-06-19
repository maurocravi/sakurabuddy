import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { Companion } from "../components/Companion";
import { Button } from "../components/Button";
import { useProgressContext } from "../hooks/ProgressContext";

export function Landing() {
  const navigate = useNavigate();
  const [progress] = useProgressContext();

  // Si ya eligió personaje, lo usamos para dar la bienvenida
  const character = progress.character ?? "yuki";
  const hasStarted = progress.character !== null;

  return (
    <PageShell className="justify-between">
      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-5xl">🌸</span>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink">
            Sakura
          </h1>
          <p className="max-w-xs text-[15px] leading-relaxed text-muted">
            Aprende japonés con tu compañero favorito. Niveles cortos, audio real y
            mucho ánimo.
          </p>
        </motion.div>

        <Companion
          character={character}
          mood="cheer"
          size="lg"
          message={hasStarted ? "¡Qué bueno verte de nuevo!" : "¡Hola! ¿Empezamos juntos?"}
        />
      </div>

      <div className="flex flex-col gap-3 pb-2">
        <Button full onClick={() => navigate(hasStarted ? "/niveles" : "/personaje")}>
          {hasStarted ? "Seguir aprendiendo →" : "Empezar →"}
        </Button>
        {hasStarted && (
          <Button variant="ghost" full onClick={() => navigate("/personaje")}>
            Cambiar de compañero
          </Button>
        )}
      </div>
    </PageShell>
  );
}
