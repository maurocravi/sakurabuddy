import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ArrangeExercise as ArrangeEx, Word } from "../../data/types";
import { useSpeech } from "../../hooks/useSpeech";
import { Button } from "../Button";

type Props = {
  exercise: ArrangeEx;
  showRomaji: boolean;
  onResult: (correct: boolean) => void;
};

type Status = "idle" | "correct" | "wrong";

function SortableWord({
  word,
  showRomaji,
  status,
  onTapAudio,
}: {
  word: Word;
  showRomaji: boolean;
  status: Status;
  onTapAudio: (w: Word) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: word.jp });

  const border =
    status === "correct"
      ? "var(--success)"
      : status === "wrong"
        ? "var(--error)"
        : "rgba(0,0,0,0.08)";

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      onClick={() => onTapAudio(word)}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        borderColor: border,
        touchAction: "none",
        zIndex: isDragging ? 10 : undefined,
        boxShadow: isDragging
          ? "0 14px 30px rgba(87,75,144,0.3)"
          : "0 4px 14px rgba(255,107,107,0.12)",
      }}
      className="flex cursor-grab touch-none select-none flex-col items-center rounded-2xl border-2 bg-surface px-4 py-2.5 active:cursor-grabbing"
    >
      <span className="font-jp text-2xl font-bold text-ink">{word.jp}</span>
      {showRomaji && (
        <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">
          {word.romaji}
        </span>
      )}
    </button>
  );
}

export function ArrangeExercise({ exercise, showRomaji, onResult }: Props) {
  const { speak } = useSpeech();
  const [order, setOrder] = useState<Word[]>(exercise.words);
  const [status, setStatus] = useState<Status>("idle");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } }),
  );

  const fullSentence = useMemo(() => exercise.correctOrder.join(""), [exercise.correctOrder]);

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setOrder((prev) => {
      const from = prev.findIndex((w) => w.jp === active.id);
      const to = prev.findIndex((w) => w.jp === over.id);
      return arrayMove(prev, from, to);
    });
    setStatus("idle");
  }

  function check() {
    const correct = order.every((w, i) => w.jp === exercise.correctOrder[i]);
    setStatus(correct ? "correct" : "wrong");
    if (correct) speak(fullSentence);
    setTimeout(() => onResult(correct), correct ? 900 : 800);
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {/* Frase objetivo en español → toca para oír la frase completa en japonés */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => speak(fullSentence)}
        className="flex flex-col items-center gap-1 rounded-3xl bg-surface px-8 py-5 shadow-[0_10px_30px_rgba(87,75,144,0.14)]"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-muted">
          Arma esta frase
        </span>
        <span className="text-xl font-bold text-ink">{exercise.targetEs}</span>
        <span className="mt-0.5 text-xs text-muted">🔊 tocar para oírla en japonés</span>
      </motion.button>

      {/* Pool ordenable */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order.map((w) => w.jp)} strategy={horizontalListSortingStrategy}>
          <div className="flex flex-wrap items-center justify-center gap-2.5 rounded-3xl border-2 border-dashed border-black/[0.08] bg-black/[0.015] px-4 py-5">
            {order.map((w) => (
              <SortableWord
                key={w.jp}
                word={w}
                showRomaji={showRomaji}
                status={status}
                onTapAudio={(word) => speak(word.jp)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <p className="text-xs text-muted">Arrastra las palabras al orden correcto</p>

      <Button onClick={check} full disabled={status === "correct"}>
        Comprobar
      </Button>
    </div>
  );
}
