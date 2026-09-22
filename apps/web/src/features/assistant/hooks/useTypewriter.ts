import { useEffect, useMemo, useState } from 'react';

const STEP_MS = 28;

const revealPoints = (text: string): number[] => {
  const points: number[] = [];
  const token = /\[[^\]]+\]\([^)\s]+\)|\S+\s*/g;
  for (const match of text.matchAll(token)) {
    points.push((match.index ?? 0) + match[0].length);
  }
  if (points[points.length - 1] !== text.length) points.push(text.length);
  return points;
};

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
