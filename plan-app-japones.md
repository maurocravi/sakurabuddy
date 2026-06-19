# Plan: App de japonés con personajes anime (MVP)

## Visión general

App web para aprender japonés con un personaje acompañante estilo anime. El usuario elige su compañero, avanza por niveles de ejercicios, y el personaje reacciona en tiempo real con burbujas de diálogo. Sin login — todo persiste en `localStorage`.

---

## Stack técnico

| Capa | Decisión | Por qué |
|---|---|---|
| Framework | **React + Vite** | Sin backend ni SSR necesario; TanStack Start es overkill para localStorage |
| Estilos | **Tailwind v4 + CSS custom properties** | Tokens semánticos propios, sin depender de shadcn para una UI tan visual |
| Routing | **React Router v7** | Ligero, familiar, suficiente para 4 rutas |
| Drag & drop | **@dnd-kit/core + @dnd-kit/sortable** | Accesible, sin jQuery |
| Animaciones | **motion** (ex Framer Motion) | Entradas, feedback, transiciones de pantalla |
| Confeti | **canvas-confetti** | Solo se carga al completar nivel |
| Audio | **Web Speech API** (nativa) | TTS gratuito, sin API key, disponible en todos los navegadores modernos |
| Persistencia | **localStorage** via hook `useProgress` | Sin backend en MVP |
| Package manager | **bun** | Más rápido, compatible con todo el stack |

> **Nota sobre audio**: Web Speech API es gratis y está disponible en el browser. No dejarlo para "futuro" — se agrega en el MVP con mínimo esfuerzo y le da vida a la app desde el día uno.

---

## Diseño visual

### Paleta Electric Coral
```
--primary:     #ff6b6b   (coral)
--primary-dark:#ee5a70   (coral oscuro, hover)
--accent:      #574b90   (violeta profundo)
--accent-mid:  #c44569   (magenta, intermediario)
--bg:          #fffaf8   (blanco cálido, no puro)
--surface:     #ffffff
--text-primary:#2d2d2d
--text-muted:  #8a8a9a
```

Gradiente primario: `linear-gradient(135deg, #ff6b6b, #574b90)` — botones CTA y barras de progreso.  
Sombras coloreadas: `box-shadow: 0 8px 24px rgba(255,107,107,0.25)` en tarjetas activas.

### Tipografía
- **Outfit** (700) → títulos, UI bold, texto japonés en romaji
- **Inter** (400/500) → cuerpo, instrucciones, feedback
- **Noto Sans JP** → texto en hiragana/kanji (siempre presente, carga via Google Fonts)

### Vibe
Tarjetas grandes con `border-radius: 20px`, sombras suaves coloreadas, micro-animaciones en botones (scale 0.97 en active), sacudida en error, pop + confeti en acierto. Burbujas de diálogo estilo manga con cola apuntando al personaje.

### Signature element
El **personaje reacciona visualmente** al resultado de cada ejercicio — no solo cambia el mensaje, sino que la imagen hace un pequeño bounce (correcto) o head-shake (incorrecto) con motion. Es el elemento que hace memorable la app y la diferencia de Duolingo.

---

## Pantallas y rutas

```
/                  → Landing con el personaje animado + botón "Empezar"
/personaje         → Selección de Haru o Yuki con preview de personalidad
/niveles           → Mapa de niveles con progreso, locks y streak
/leccion/:id       → Ejercicios secuenciales + personaje en sidebar/top
/victoria/:id      → Pantalla de celebración con confeti
```

---

## Personajes

### Haru y Yuki
Retratos PNG generados con IA (gpt-image-2, fondo transparente, estilo anime colorido).  
Durante el desarrollo, usar **placeholders SVG/CSS** para no bloquear implementación.

```tsx
// Componente central de la app
<Companion
  character="haru" | "yuki"
  mood="happy" | "cheer" | "sad" | "neutral" | "thinking"
  message="¡Excelente! Sabía que podías."
  speaking={true}  // activa animación de boca/expresión
/>
```

**Moods necesarios por pantalla:**
- `neutral` → estado idle, pantalla de niveles
- `cheer` → al entrar a una lección nueva
- `thinking` → durante el ejercicio (el usuario está respondiendo)
- `happy` → respuesta correcta
- `sad` → respuesta incorrecta (no enojado, solo empático)
- `cheer` (intenso) → al completar nivel

El personaje elegido se persiste en localStorage y aparece en **todas** las pantallas posteriores.

---

## Contenido (MVP: 4 niveles)

### Nivel 1 — Colores (いろ)
| Japonés | Romaji | Español |
|---|---|---|
| あか | aka | rojo |
| あお | ao | azul |
| きいろ | kiiro | amarillo |
| しろ | shiro | blanco |
| くろ | kuro | negro |
| みどり | midori | verde |

### Nivel 2 — Números (すうじ)
いち、に、さん、し、ご、ろく、なな、はち、きゅう、じゅう (1–10)

### Nivel 3 — Palabras básicas (ことば)
みず (agua), いえ (casa), ねこ (gato), いぬ (perro), ほん (libro), たべもの (comida), ともだち (amigo), たいよう (sol)

### Nivel 4 — Frases simples (かいわ)
Frases con estructura は + です: "わたしは がくせい です", "そらは あおい です", etc.

> El nivel 4 introduce el primer contenido gramatical real — importante para que el usuario sienta progreso hacia conversación.

---

## Flujo de una lección

```
1. Pantalla de review
   └── Grid de todas las palabras del nivel con audio al tocar
   └── Toggle "ocultar romaji" para nivel intermedio
   └── Botón "¡Listo, practicar!"

2. Ejercicios secuenciales (6–8 por nivel)
   └── Barra de progreso + corazones (3 vidas)
   └── Personaje en estado "thinking"
   └── Al acertar → feedback inmediato + personaje "happy"
   └── Al fallar → feedback amable + personaje "sad" + opción reintentar
   └── Perder los 3 corazones → "intentémoslo de nuevo" (reinicia nivel)

3. Pantalla de victoria
   └── Confeti canvas-confetti
   └── Personaje en modo "cheer" con animación bounce
   └── Frase motivadora del personaje
   └── Botón "Siguiente nivel" o "Volver al mapa"
```

---

## Tipos de ejercicio

### 1. Elegir traducción (`ChooseExercise`)
Muestra una palabra en hiragana (+ romaji opcional), 4 opciones en español. Audio al tocar la palabra japonesa.

```ts
type ChooseExercise = {
  type: "choose";
  prompt: Word;        // la palabra en japonés
  options: Word[];     // 4 opciones (1 correcta + 3 distractores)
  answer: string;      // el romaji correcto
}
```

### 2. Armar frase (`ArrangeExercise`)
Pool de palabras en hiragana+romaji que el usuario arrastra al orden correcto. Audio al tocar cada palabra. La frase objetivo se muestra en español.

```ts
type ArrangeExercise = {
  type: "arrange";
  targetEs: string;          // "El cielo es azul"
  words: Word[];             // pool (respuesta + distractores mezclados)
  correctOrder: string[];    // ["そらは", "あおい", "です"]
}
```

**Feedback de audio:**
- Tocar palabra en el pool → reproduce esa palabra
- Tocar la frase objetivo en español → reproduce la frase completa en japonés
- Al completar correctamente → reproduce la frase completa

---

## Tipos de datos

```ts
// src/data/types.ts

export type Word = {
  jp: string;       // hiragana o kanji
  romaji: string;
  es: string;
  audio?: string;   // opcional: path a archivo .mp3 custom en el futuro
};

export type ChooseExercise = {
  type: "choose";
  prompt: Word;
  options: Word[];
  answer: string;
};

export type ArrangeExercise = {
  type: "arrange";
  targetEs: string;
  words: Word[];
  correctOrder: string[];
};

export type Exercise = ChooseExercise | ArrangeExercise;

export type Lesson = {
  id: string;
  title: string;
  titleJp: string;    // título en hiragana
  emoji: string;
  exercises: Exercise[];
  unlockAfter?: string; // id de la lección previa requerida
};
```

---

## Progreso (localStorage)

```ts
// src/hooks/useProgress.ts

type ProgressState = {
  character: "haru" | "yuki" | null;
  completedLessons: string[];
  currentStreak: number;
  lastPlayedDate: string | null;  // ISO date string para calcular streak
  romajiVisible: boolean;         // preferencia del usuario
};

// Hook simple con useState + useEffect
// No necesita useSyncExternalStore para este scope
export function useProgress(): [ProgressState, ProgressActions] { ... }
```

---

## Audio con Web Speech API

```ts
// src/hooks/useSpeech.ts

export function useSpeech() {
  const speak = (text: string, opts?: { rate?: number; pitch?: number }) => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    const jpVoice = synth.getVoices().find(v => v.lang.startsWith('ja'));
    if (jpVoice) utt.voice = jpVoice;
    utt.lang = 'ja-JP';
    utt.rate = opts?.rate ?? 0.85;
    utt.pitch = opts?.pitch ?? 1.0;
    synth.speak(utt);
  };
  return { speak };
}
```

El hook se usa en cualquier componente que necesite audio — palabras, frases, feedback del personaje.

---

## Estructura de carpetas

```
src/
├── assets/
│   ├── haru/
│   │   ├── happy.png
│   │   ├── sad.png
│   │   ├── cheer.png
│   │   ├── thinking.png
│   │   └── neutral.png
│   └── yuki/  (misma estructura)
│
├── components/
│   ├── Companion.tsx        # personaje + burbuja de diálogo
│   ├── ProgressBar.tsx
│   ├── Hearts.tsx           # vidas del nivel
│   ├── WordTile.tsx         # tile de palabra con audio al tocar
│   └── exercises/
│       ├── ChooseExercise.tsx
│       └── ArrangeExercise.tsx
│
├── data/
│   ├── types.ts
│   └── lessons.ts           # contenido estático de los 4 niveles
│
├── hooks/
│   ├── useProgress.ts
│   └── useSpeech.ts
│
├── pages/
│   ├── Landing.tsx
│   ├── CharacterSelect.tsx
│   ├── LevelMap.tsx
│   ├── Lesson.tsx
│   └── Victory.tsx
│
└── styles/
    └── tokens.css           # custom properties: colores, tipografía, radios
```

---

## Pasos de implementación (orden sugerido)

1. **Setup base** — `bun create vite`, instalar dependencias, tokens CSS, fuentes en `index.html`
2. **Datos** — `src/data/lessons.ts` con los 4 niveles completos
3. **Hook `useProgress`** y **`useSpeech`**
4. **Componente `<Companion>`** con placeholders SVG mientras no hay imágenes
5. **Rutas** con React Router — páginas vacías primero, navegación funcional
6. **`<ChooseExercise>`** — el más simple, probar el loop completo
7. **`<ArrangeExercise>`** — drag & drop con @dnd-kit
8. **Pantalla de victoria** con canvas-confetti
9. **Flujo review** previo a los ejercicios
10. **Sistema de vidas** (Hearts)
11. **Generar imágenes** de Haru y Yuki (reemplazar placeholders)
12. **Pulido final** — transiciones motion, responsivo móvil, animaciones de personaje

---

## Fuera de alcance (fases futuras)

- Login / sync entre dispositivos (Supabase)
- Kanji y niveles JLPT N5
- Ejercicio de escritura (canvas de trazos)
- Modo escucha (escuchar audio → elegir qué dice)
- Modo voz (Speech Recognition para responder hablando)
- Rachas diarias con notificaciones
- Leaderboard entre amigos
- Más personajes desbloqueables
