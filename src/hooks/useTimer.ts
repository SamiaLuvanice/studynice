import { useState, useEffect, useCallback, useRef } from 'react';

type TimerState = 'idle' | 'running' | 'paused' | 'finished';

interface TimerSession {
  goalId: string;
  startedAt: number;
  accumulatedSeconds: number;
  lastResumeAt: number | null;
  state: TimerState;
}

const STORAGE_KEY = 'studynice-timer-session';

export function useTimer() {
  const [session, setSession] = useState<TimerSession | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as TimerSession;
        // If timer was running when page was closed, calculate elapsed time
        if (parsed.state === 'running' && parsed.lastResumeAt) {
          const elapsed = Math.floor((Date.now() - parsed.lastResumeAt) / 1000);
          return {
            ...parsed,
            accumulatedSeconds: parsed.accumulatedSeconds + elapsed,
            lastResumeAt: Date.now(),
          };
        }
        return parsed;
      }
    } catch {
      // Invalid stored data, start fresh
    }
    return null;
  });

  const [displaySeconds, setDisplaySeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Persist session to localStorage
  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  // Update display timer
  const updateDisplay = useCallback(() => {
    if (!session) {
      setDisplaySeconds(0);
      return;
    }

    if (session.state === 'running' && session.lastResumeAt) {
      const elapsed = Math.floor((Date.now() - session.lastResumeAt) / 1000);
      setDisplaySeconds(session.accumulatedSeconds + elapsed);
    } else {
      setDisplaySeconds(session.accumulatedSeconds);
    }
  }, [session]);

  // Set up interval for running timer
  useEffect(() => {
    if (session?.state === 'running') {
      updateDisplay();
      intervalRef.current = window.setInterval(updateDisplay, 1000);
    } else {
      updateDisplay();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [session?.state, updateDisplay]);

  const start = useCallback((goalId: string) => {
    const now = Date.now();
    setSession({
      goalId,
      startedAt: now,
      accumulatedSeconds: 0,
      lastResumeAt: now,
      state: 'running',
    });
  }, []);

  const pause = useCallback(() => {
    setSession((prev) => {
      if (!prev || prev.state !== 'running') return prev;
      const elapsed = prev.lastResumeAt
        ? Math.floor((Date.now() - prev.lastResumeAt) / 1000)
        : 0;
      return {
        ...prev,
        accumulatedSeconds: prev.accumulatedSeconds + elapsed,
        lastResumeAt: null,
        state: 'paused',
      };
    });
  }, []);

  const resume = useCallback(() => {
    setSession((prev) => {
      if (!prev || prev.state !== 'paused') return prev;
      return {
        ...prev,
        lastResumeAt: Date.now(),
        state: 'running',
      };
    });
  }, []);

  const stop = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      // If running, calculate final elapsed time
      if (prev.state === 'running' && prev.lastResumeAt) {
        const elapsed = Math.floor((Date.now() - prev.lastResumeAt) / 1000);
        return {
          ...prev,
          accumulatedSeconds: prev.accumulatedSeconds + elapsed,
          lastResumeAt: null,
          state: 'finished',
        };
      }
      return {
        ...prev,
        lastResumeAt: null,
        state: 'finished',
      };
    });
  }, []);

  const reset = useCallback(() => {
    setSession(null);
    setDisplaySeconds(0);
  }, []);

  const getSessionData = useCallback(() => {
    if (!session) return null;
    return {
      goalId: session.goalId,
      startedAt: new Date(session.startedAt),
      durationSeconds: displaySeconds,
    };
  }, [session, displaySeconds]);

  return {
    state: session?.state || 'idle',
    goalId: session?.goalId || null,
    displaySeconds,
    start,
    pause,
    resume,
    stop,
    reset,
    getSessionData,
    hasActiveSession: session !== null && session.state !== 'idle',
  };
}

export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function secondsToMinutes(seconds: number): number {
  // Round up to nearest minute (minimum 1 minute if any time recorded)
  return seconds > 0 ? Math.ceil(seconds / 60) : 0;
}
