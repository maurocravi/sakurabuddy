import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { Button } from "../components/Button";
import { characters } from "../data/characters";
import type { Character } from "../data/types";
import { useProgressContext } from "../hooks/ProgressContext";
import { useSpeech } from "../hooks/useSpeech";

export function CharacterSelect() {
  const navigate = useNavigate();
  const [, actions] = useProgressContext();
  const { speak } = useSpeech();
  const [selected, setSelected] = useState<Character | null>(null);

  const list = Object.values(characters);

  function confirm() {
    if (!selected) return;
    actions.setCharacter(selected);
    speak("よろしく"); // "encantado/a"
    navigate("/niveles");
  }

  return (
    <PageShell className="justify-between">
      <div className="mb-2 text-center">
        <h2 className="font-display text-2xl font-extrabold text-ink">
          Elige tu compañero
        </h2>
        <p className="mt-1 text-sm text-muted">Te acompañará en cada lección</p>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-4">
        {list.map((c) => {
          const isSel = selected === c.id;
          return (
            <motion.button
              key={c.id}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(c.id)}
              className="flex items-center gap-4 rounded-3xl border-2 bg-surface p-4 text-left transition-all"
              style={{
                borderColor: isSel ? c.accent : "rgba(0,0,0,0.06)",
                boxShadow: isSel
                  ? `0 14px 34px ${c.accent}33`
                  : "0 6px 18px rgba(87,75,144,0.08)",
              }}
            >
              <motion.img
                src={c.img}
                alt={c.name}
                draggable={false}
                animate={isSel ? { y: [0, -8, 0] } : { y: 0 }}
                transition={isSel ? { duration: 1.2, repeat: Infinity } : {}}
                className="h-24 w-24 shrink-0 select-none rounded-2xl object-cover"
                style={{ background: `${c.accent}11` }}
              />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-display text-xl font-extrabold text-ink">
                    {c.name}
                  </span>
                  {isSel && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
                      style={{ background: c.accent }}
                    >
                      elegido
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold" style={{ color: c.accent }}>
                  {c.tagline}
                </span>
                <p className="text-[13px] leading-snug text-muted">{c.personality}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="pt-4">
        <Button full disabled={!selected} onClick={confirm}>
          {selected ? `Empezar con ${characters[selected].name} →` : "Elige uno para seguir"}
        </Button>
      </div>
    </PageShell>
  );
}
