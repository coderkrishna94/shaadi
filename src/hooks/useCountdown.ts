import { useState, useEffect } from 'react';

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

export function useCountdown(targetDate: string, targetTime?: string): CountdownValues {
  const getTarget = () => {
    const dateStr = targetDate || '2026-10-14';
    const timeStr = targetTime || '7:00 PM';
    // Parse time string
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    let hours = 0;
    let minutes = 0;
    if (match) {
      hours = parseInt(match[1]);
      minutes = parseInt(match[2]);
      const period = match[3]?.toUpperCase();
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
    }
    const d = new Date(dateStr);
    d.setHours(hours, minutes, 0, 0);
    return d.getTime();
  };

  const calculate = (): CountdownValues => {
    const target = getTarget();
    if (isNaN(target)) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: false };
    }

    const now = Date.now();
    const diff = target - now;

    if (isNaN(diff) || diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isComplete: false,
    };
  };

  const [countdown, setCountdown] = useState<CountdownValues>(calculate);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculate());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, targetTime]);

  return countdown;
}
