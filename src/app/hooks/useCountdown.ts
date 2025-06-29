import { useEffect, useState } from "react";

export function useCountdown(targetDateStr: string | undefined) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!targetDateStr) return;

    const end = new Date(targetDateStr).getTime();

    function updateCountdown() {
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Đã kết thúc!");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${hours} giờ ${minutes} phút ${seconds < 10 ? "0" : ""}${seconds} giây`
      );
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDateStr]);

  return timeLeft;
}
