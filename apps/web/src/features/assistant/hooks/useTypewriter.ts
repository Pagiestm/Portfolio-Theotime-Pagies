import { useEffect, useMemo, useState } from 'react';

const STEP_MS = 28;

/**
 * Positions où le texte peut être coupé sans casser un lien Markdown : un
 * `[libellé](url)` est révélé d'un bloc, sinon on verrait sa syntaxe brute le
 * temps qu'il s'écrive. Le reste avance mot par mot.
 */
const revealPoints = (text: string): number[] => {
  const points: number[] = [];
  const token = /\[[^\]]+\]\([^)\s]+\)|\S+\s*/g;
  for (const match of text.matchAll(token)) {
    points.push((match.index ?? 0) + match[0].length);
  }
  if (points[points.length - 1] !== text.length) points.push(text.length);
  return points;
};

/**
 * Révèle `text` progressivement quand `enabled` est vrai, tout d'un coup sinon.
 * `done` reste faux tant que l'écriture court, pour retenir ce qui doit
 * attendre la fin (les sources, par exemple).
 */
export const useTypewriter = (text: string, enabled: boolean) => {
  const points = useMemo(() => revealPoints(text), [text]);
  const [step, setStep] = useState(enabled ? 0 : points.length);

  useEffect(() => {
    if (!enabled || step >= points.length) return;
    const timer = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(timer);
  }, [enabled, step, points.length]);

  const done = step >= points.length;
  return { visible: done ? text : text.slice(0, points[step - 1] ?? 0), done };
};
