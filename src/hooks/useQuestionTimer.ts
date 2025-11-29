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

/**
 * Fully stable countdown timer:
 * - Resets when questionIndex changes
 * - Stops when clearTimer() is called
 * - Calls onTimeExpired ONCE when reaching 0
 */
export const useQuestionTimer = (
  args: UseQuestionTimerArgs
): UseQuestionTimerResult => {
  const { isActive, questionIndex, questionTimeLimitSeconds, onTimeExpired } =
    args;

  const [timeLeft, setTimeLeft] = React.useState<number | null>(null);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const clearTimer = React.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimeLeft(null);
  }, []);

  React.useEffect(() => {
    // any change: wipe old timer
    clearTimer();

    // don't start timer unless game is active
    if (!isActive || questionIndex === null) return;

    // fresh countdown
    setTimeLeft(questionTimeLimitSeconds);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return prev;

        if (prev <= 1) {
          clearTimer();
          onTimeExpired();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [
    isActive,
    questionIndex,
    questionTimeLimitSeconds,
    onTimeExpired,
    clearTimer,
  ]);

  return { timeLeft, clearTimer };
};
