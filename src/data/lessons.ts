import type { Lesson, Word } from "./types";

// ---------------------------------------------------------------------------
// Vocabulario por nivel
// ---------------------------------------------------------------------------

const colors: Word[] = [
  { jp: "あか", romaji: "aka", es: "rojo" },
  { jp: "あお", romaji: "ao", es: "azul" },
  { jp: "きいろ", romaji: "kiiro", es: "amarillo" },
  { jp: "しろ", romaji: "shiro", es: "blanco" },
  { jp: "くろ", romaji: "kuro", es: "negro" },
  { jp: "みどり", romaji: "midori", es: "verde" },
];

const numbers: Word[] = [
  { jp: "いち", romaji: "ichi", es: "uno" },
  { jp: "に", romaji: "ni", es: "dos" },
  { jp: "さん", romaji: "san", es: "tres" },
  { jp: "し", romaji: "shi", es: "cuatro" },
  { jp: "ご", romaji: "go", es: "cinco" },
  { jp: "ろく", romaji: "roku", es: "seis" },
  { jp: "なな", romaji: "nana", es: "siete" },
  { jp: "はち", romaji: "hachi", es: "ocho" },
  { jp: "きゅう", romaji: "kyuu", es: "nueve" },
  { jp: "じゅう", romaji: "juu", es: "diez" },
];

const basics: Word[] = [
  { jp: "みず", romaji: "mizu", es: "agua" },
  { jp: "いえ", romaji: "ie", es: "casa" },
  { jp: "ねこ", romaji: "neko", es: "gato" },
  { jp: "いぬ", romaji: "inu", es: "perro" },
  { jp: "ほん", romaji: "hon", es: "libro" },
  { jp: "たべもの", romaji: "tabemono", es: "comida" },
  { jp: "ともだち", romaji: "tomodachi", es: "amigo" },
  { jp: "たいよう", romaji: "taiyou", es: "sol" },
];

// ---------------------------------------------------------------------------
// Helper: arma un ChooseExercise eligiendo 3 distractores del pool
// ---------------------------------------------------------------------------

function choose(prompt: Word, pool: Word[]) {
  const distractors = pool
    .filter((w) => w.romaji !== prompt.romaji)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const options = [prompt, ...distractors].sort(() => Math.random() - 0.5);
  return {
    type: "choose" as const,
    prompt,
    options,
    answer: prompt.romaji,
  };
}

// Palabras auxiliares para las frases del nivel 4
const wa: Word = { jp: "は", romaji: "wa", es: "(partícula)" };
const desu: Word = { jp: "です", romaji: "desu", es: "es" };
const watashi: Word = { jp: "わたし", romaji: "watashi", es: "yo" };
const gakusei: Word = { jp: "がくせい", romaji: "gakusei", es: "estudiante" };
const sora: Word = { jp: "そら", romaji: "sora", es: "cielo" };
const aoi: Word = { jp: "あおい", romaji: "aoi", es: "azul (adj.)" };
const neko: Word = { jp: "ねこ", romaji: "neko", es: "gato" };
const kawaii: Word = { jp: "かわいい", romaji: "kawaii", es: "lindo" };
const taiyou: Word = { jp: "たいよう", romaji: "taiyou", es: "sol" };
const akai: Word = { jp: "あかい", romaji: "akai", es: "rojo (adj.)" };

// ---------------------------------------------------------------------------
// Lecciones
// ---------------------------------------------------------------------------

export const lessons: Lesson[] = [
  {
    id: "colores",
    title: "Colores",
    titleJp: "いろ",
    emoji: "🎨",
    words: colors,
    exercises: colors.map((w) => choose(w, colors)),
  },
  {
    id: "numeros",
    title: "Números",
    titleJp: "すうじ",
    emoji: "🔢",
    unlockAfter: "colores",
    words: numbers,
    exercises: [
      numbers[0],
      numbers[2],
      numbers[4],
      numbers[5],
      numbers[7],
      numbers[8],
      numbers[9],
    ].map((w) => choose(w, numbers)),
  },
  {
    id: "palabras",
    title: "Palabras básicas",
    titleJp: "ことば",
    emoji: "💬",
    unlockAfter: "numeros",
    words: basics,
    exercises: basics.map((w) => choose(w, basics)),
  },
  {
    id: "frases",
    title: "Frases simples",
    titleJp: "かいわ",
    emoji: "🗣️",
    unlockAfter: "palabras",
    words: [watashi, gakusei, sora, aoi, neko, kawaii, taiyou, akai, desu],
    exercises: [
      {
        type: "arrange",
        targetEs: "Yo soy estudiante",
        words: [watashi, wa, gakusei, desu].sort(() => Math.random() - 0.5),
        correctOrder: ["わたし", "は", "がくせい", "です"],
      },
      {
        type: "arrange",
        targetEs: "El cielo es azul",
        words: [sora, wa, aoi, desu].sort(() => Math.random() - 0.5),
        correctOrder: ["そら", "は", "あおい", "です"],
      },
      {
        type: "arrange",
        targetEs: "El gato es lindo",
        words: [neko, wa, kawaii, desu].sort(() => Math.random() - 0.5),
        correctOrder: ["ねこ", "は", "かわいい", "です"],
      },
      {
        type: "arrange",
        targetEs: "El sol es rojo",
        words: [taiyou, wa, akai, desu].sort(() => Math.random() - 0.5),
        correctOrder: ["たいよう", "は", "あかい", "です"],
      },
    ],
  },
];

export function getLesson(id: string | undefined): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}
