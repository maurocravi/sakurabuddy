import { useCallback, useEffect, useRef } from "react";

/**
 * TTS japonés vía Web Speech API (nativa, sin API key).
 * Las voces se cargan async en algunos navegadores, así que las
 * cacheamos y reintentamos en el evento `voiceschanged`.
 */
export function useSpeech() {
  const jpVoice = useRef<SpeechSynthesisVoice | null>(null);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;

    const pickVoice = () => {
      const voices = synth.getVoices();
      jpVoice.current =
        voices.find((v) => v.lang.replace("_", "-").startsWith("ja")) ?? null;
    };

    pickVoice();
    synth.addEventListener("voiceschanged", pickVoice);
    return () => synth.removeEventListener("voiceschanged", pickVoice);
  }, [supported]);

  const speak = useCallback(
    (text: string, opts?: { rate?: number; pitch?: number }) => {
      if (!supported) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      if (jpVoice.current) utt.voice = jpVoice.current;
      utt.lang = "ja-JP";
      utt.rate = opts?.rate ?? 0.85;
      utt.pitch = opts?.pitch ?? 1.0;
      synth.speak(utt);
    },
    [supported],
  );

  return { speak, supported };
}
