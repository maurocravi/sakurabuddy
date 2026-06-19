export type Word = {
  jp: string; // hiragana o kanji
  romaji: string;
  es: string;
  audio?: string; // opcional: path a archivo .mp3 custom en el futuro
};

export type ChooseExercise = {
  type: "choose";
  prompt: Word; // la palabra en japonés
  options: Word[]; // 4 opciones (1 correcta + 3 distractores)
  answer: string; // el romaji correcto
};

export type ArrangeExercise = {
  type: "arrange";
  targetEs: string; // "El cielo es azul"
  words: Word[]; // pool (respuesta + distractores mezclados)
  correctOrder: string[]; // ["そらは", "あおい", "です"]
};

export type Exercise = ChooseExercise | ArrangeExercise;

export type Lesson = {
  id: string;
  title: string;
  titleJp: string; // título en hiragana
  emoji: string;
  words: Word[]; // vocabulario para la pantalla de review
  exercises: Exercise[];
  unlockAfter?: string; // id de la lección previa requerida
};

export type Character = "haru" | "yuki";
export type Mood = "neutral" | "cheer" | "thinking" | "happy" | "sad";
