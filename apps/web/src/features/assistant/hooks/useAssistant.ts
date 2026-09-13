import { useCallback, useState } from 'react';
import { askAssistant, type AssistantSource } from '../../../services/assistantService';

export type AssistantMessage = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  sources?: AssistantSource[];
};

type Status = 'idle' | 'loading' | 'error' | 'limited';

export const useAssistant = (lang: string) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [status, setStatus] = useState<Status>('idle');

  const ask = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || status === 'loading') return;
      setMessages((current) => [...current, { id: Date.now(), role: 'user', text: trimmed }]);
      setStatus('loading');
      try {
        const { answer, sources } = await askAssistant(trimmed, lang);
        setMessages((current) => [
          ...current,
          { id: Date.now() + 1, role: 'assistant', text: answer, sources },
        ]);
        setStatus('idle');
      } catch (error) {
        setStatus(error instanceof Error && error.message === 'RATE_LIMITED' ? 'limited' : 'error');
      }
    },
    [lang, status]
  );

  const reset = useCallback(() => {
    setMessages([]);
    setStatus('idle');
  }, []);

  return { messages, status, ask, reset };
};
