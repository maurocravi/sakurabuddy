import { AnimatePresence } from "motion/react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { CharacterSelect } from "./pages/CharacterSelect";
import { LevelMap } from "./pages/LevelMap";
import { Lesson } from "./pages/Lesson";
import { Victory } from "./pages/Victory";

export function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/personaje" element={<CharacterSelect />} />
        <Route path="/niveles" element={<LevelMap />} />
        <Route path="/leccion/:id" element={<Lesson />} />
        <Route path="/victoria/:id" element={<Victory />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </AnimatePresence>
  );
}
