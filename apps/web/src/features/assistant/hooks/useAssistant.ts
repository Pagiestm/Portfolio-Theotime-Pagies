import { useCallback, useState } from 'react';
import {
  askAssistant,
  AssistantError,
  type AssistantErrorCode,
  type AssistantSource,
} from '../../../services/assistantService';

export type AssistantMessage = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  sources?: AssistantSource[];
};

type Status = 'idle' | 'loading' | 'error';

export const useAssistant = (lang: string) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  /** La cause du dernier échec, pour choisir le message à afficher. */
  const [errorCode, setErrorCode] = useState<AssistantErrorCode | null>(null);

  const ask = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || status === 'loading') return;
      setMessages((current) => [...current, { id: Date.now(), role: 'user', text: trimmed }]);
      setStatus('loading');
      setErrorCode(null);
      try {
        const { answer, sources } = await askAssistant(trimmed, lang);
        setMessages((current) => [
          ...current,
          { id: Date.now() + 1, role: 'assistant', text: answer, sources },
        ]);
        setStatus('idle');
      } catch (error) {
        setErrorCode(error instanceof AssistantError ? error.code : 'unavailable');
        setStatus('error');
      }
    },
    [lang, status]
  );

  const reset = useCallback(() => {
    setMessages([]);
    setStatus('idle');
    setErrorCode(null);
  }, []);

  return { messages, status, errorCode, ask, reset };
};
