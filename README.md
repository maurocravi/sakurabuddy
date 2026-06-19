# 🌸 Sakura — App de japonés con compañero anime

App web para aprender japonés con un personaje acompañante (Haru o Yuki) que reacciona
en tiempo real a tus respuestas. Sin login: todo el progreso vive en `localStorage`.

## Stack

- **React 19 + Vite + TypeScript**
- **Tailwind v4** (+ CSS custom properties en `src/styles/tokens.css`)
- **React Router v7** — 5 rutas
- **@dnd-kit** — ejercicio de armar frases (drag & drop accesible)
- **motion** — animaciones de personaje, transiciones de pantalla
- **canvas-confetti** — celebración al completar nivel
- **Web Speech API** — audio japonés (TTS nativo, sin API key)

## Cómo correr

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # build de producción a dist/
pnpm preview    # sirve el build
```

## Estructura

```
src/
├── assets/            haru.png, yuki.png (1 retrato por personaje)
├── components/        Companion, Button, ProgressBar, Hearts, WordTile, PageShell
│   └── exercises/     ChooseExercise, ArrangeExercise
├── data/              types.ts, lessons.ts (4 niveles), characters.ts
├── hooks/             useProgress, ProgressContext, useSpeech
├── pages/             Landing, CharacterSelect, LevelMap, Lesson, Victory
└── styles/            tokens.css
```

## Notas de diseño

- **Moods sin múltiples imágenes**: cada personaje tiene un solo retrato. Los 5 moods
  (`neutral`, `thinking`, `cheer`, `happy`, `sad`) se logran con animaciones de motion
  (bounce, head-shake, float) + filtros CSS + halo de color. Es el _signature element_:
  el personaje reacciona visualmente a cada respuesta.
- **Audio**: la Web Speech API carga voces de forma asíncrona; `useSpeech` cachea la voz
  japonesa y reintenta en `voiceschanged`. Si el sistema no tiene voz `ja-JP` instalada,
  la app sigue funcionando (solo no suena). En macOS conviene instalar la voz "Kyoko".

## Rutas

| Ruta | Pantalla |
|---|---|
| `/` | Landing con el personaje animado |
| `/personaje` | Selección de Haru o Yuki |
| `/niveles` | Mapa de niveles con locks, progreso y streak |
| `/leccion/:id` | Review + ejercicios secuenciales + vidas |
| `/victoria/:id` | Celebración con confeti |

## Fuera de alcance (futuro)

Login/sync, kanji JLPT, escritura de trazos, modo escucha, modo voz, leaderboard.
