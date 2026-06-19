import type { Character, Mood } from "./types";
import haruImg from "../assets/haru.png";
import yukiImg from "../assets/yuki.png";

export type CharacterProfile = {
  id: Character;
  name: string;
  img: string;
  tagline: string;
  personality: string;
  accent: string; // color de acento del personaje
  // Frases de ejemplo por mood (UI en español, el personaje habla en japonés via TTS)
  lines: Record<Mood, string[]>;
};

export const characters: Record<Character, CharacterProfile> = {
  yuki: {
    id: "yuki",
    name: "Yuki",
    img: yukiImg,
    tagline: "Enérgica y motivadora",
    personality:
      "Siempre con una sonrisa. Celebra cada acierto como si fuera enorme y te empuja a seguir.",
    accent: "#ff6b6b",
    lines: {
      neutral: ["¿Lista para hoy?", "¡Vamos a aprender juntas!", "Estoy contigo ✨"],
      cheer: ["¡Tú puedes con esto!", "¡A darlo todo!", "¡Confío en ti!"],
      thinking: ["Tómate tu tiempo…", "Mmm, ¿cuál será?", "Tú piénsalo con calma"],
      happy: ["¡Perfecto! ✨", "¡Sabía que podías!", "¡Increíble!"],
      sad: ["Tranqui, casi", "No pasa nada, ¡otra vez!", "¡Casi casi! Inténtalo de nuevo"],
    },
  },
  haru: {
    id: "haru",
    name: "Haru",
    img: haruImg,
    tagline: "Tranquilo y alentador",
    personality:
      "Relajado y paciente. Te explica con calma y te recuerda que el error es parte de aprender.",
    accent: "#574b90",
    lines: {
      neutral: ["¿Empezamos?", "Paso a paso, ¿va?", "Aquí estoy contigo"],
      cheer: ["Vamos con calma y firmes", "Tú tranquilo, lo tienes", "¡Buen momento para esto!"],
      thinking: ["Piénsalo bien…", "Sin prisa", "¿Cuál crees que es?"],
      happy: ["¡Eso es!", "Genial, bien hecho", "Lo clavaste 👏"],
      sad: ["No te preocupes", "Equivocarse ayuda a aprender", "Respira e inténtalo otra vez"],
    },
  },
};

export function getCharacter(id: Character): CharacterProfile {
  return characters[id];
}
