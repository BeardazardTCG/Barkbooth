"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";

type Feedback = { id: number; message: string } | null;
type FeedbackActions = { notify: (message: string) => void; dismiss: () => void };
const FeedbackContext = createContext<FeedbackActions>({ notify: () => undefined, dismiss: () => undefined });

export function FormFeedbackProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notify = useCallback((message: string) => {
    setFeedback({ id: Date.now(), message });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setFeedback(null), 6000);
  }, []);
  const dismiss = useCallback(() => setFeedback(null), []);
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return <FeedbackContext.Provider value={{ notify, dismiss }}>
    {children}
    {feedback && <div key={feedback.id} role="status" aria-live="polite" aria-atomic="true" className="fixed bottom-24 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl bg-green-800 px-5 py-4 font-bold text-white shadow-soft lg:bottom-6">
      {feedback.message}
    </div>}
  </FeedbackContext.Provider>;
}

export function useFormFeedback() {
  return useContext(FeedbackContext);
}
