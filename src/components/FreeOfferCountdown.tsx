"use client";

import { useEffect, useState } from "react";

interface Props {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeTimeLeft(targetDate: string): TimeLeft {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export default function FreeOfferCountdown({ targetDate }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => computeTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(computeTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FFC857] tabular-nums">
      <span>{pad(timeLeft.days)}d</span>
      <span>{pad(timeLeft.hours)}h</span>
      <span>{pad(timeLeft.minutes)}m</span>
      <span>{pad(timeLeft.seconds)}s</span>
    </div>
  );
}
