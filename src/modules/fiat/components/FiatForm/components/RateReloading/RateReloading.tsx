import { useState, useEffect } from 'react';

export const RateReloading = ({
  interval = 60000,
  size = 16,
  bgColor = '#2A2C34',
  progressColor = '#CDD0DB',
  progressWidth = 16
}) => {
  const [timeLeft, setTimeLeft] = useState(interval);

  useEffect(() => {
    const decrement = 1000; // Decrease every second

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - decrement, 0));
    }, decrement);

    const resetTimer = setInterval(() => {
      setTimeLeft(interval);
    }, interval);

    return () => {
      clearInterval(timer);
      clearInterval(resetTimer);
    };
  }, [interval]);

  const progress = (timeLeft / interval) * 283; // Map to strokeDashoffset
  const sizeClass = `${size}px`;
  const radius = 50 - progressWidth / 2; // Adjust radius based on stroke width
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: sizeClass, height: sizeClass }}
    >
      <svg
        className="transform -rotate-90"
        viewBox="0 0 100 100"
        style={{ width: sizeClass, height: sizeClass }}
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={bgColor}
          strokeWidth={progressWidth}
          fill="transparent"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={progressColor}
          strokeWidth={progressWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={(progress / 283) * circumference}
          className="transition-all duration-1000"
        />
      </svg>
      {/*<span*/}
      {/*  className="absolute font-bold"*/}
      {/*  style={{ fontSize: `${size / 4}px`, color: progressColor }}*/}
      {/*>*/}
      {/*  {Math.ceil(timeLeft / 1000)}s*/}
      {/*</span>*/}
    </div>
  );
};
