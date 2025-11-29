// src/hooks/useQuestionTimer.ts
import * as React from "react";

interface UseQuestionTimerArgs {
  isActive: boolean;
  questionIndex: number | null;
  questionTimeLimitSeconds: number;
  onTimeExpired: () => void;
}

interface UseQuestionTimerResult {
  timeLeft: number | null;
  clearTimer: () => void;
}

export const useQuestionTimer = ({
  isActive,
  questionIndex,
  questionTimeLimitSeconds,
  onTimeExpired,
}: UseQuestionTimerArgs): UseQuestionTimerResult => {
  const [timeLeft, setTimeLeft] = React.useState<number | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const clearTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeLeft(null);
  }, []);

  React.useEffect(() => {
    if (!isActive || questionIndex === null) {
      clearTimer();
      return;
    }

    // fresh timer for each active question
    clearTimer();
    setTimeLeft(questionTimeLimitSeconds);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return prev;
        if (prev <= 1) {
          clearTimer();
          // match previous behaviour: call expiry on next tick
          setTimeout(() => {
            onTimeExpired();
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimer();
    };
  }, [
    isActive,
    questionIndex,
    questionTimeLimitSeconds,
    onTimeExpired,
    clearTimer,
  ]);

  return { timeLeft, clearTimer };
};
