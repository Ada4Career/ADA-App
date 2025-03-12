'use client';

import { useEffect, useState } from 'react';

interface CircularProgressIndicatorProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  colors?: string[];
  segments?: number[];
  text?: string;
  animate?: boolean;
  animationDuration?: number;
}

export function CircularProgressIndicator({
  percentage,
  size = 120,
  strokeWidth = 10,
  colors = ['#8b5cf6', '#3b82f6', '#ec4899'],
  segments = [0.3, 0.4, 0.3],
  text = 'Match',
  animate = true,
  animationDuration = 1000,
}: CircularProgressIndicatorProps) {
  const [progress, setProgress] = useState(0);
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  // Animation effect
  useEffect(() => {
    if (!animate) {
      setProgress(clampedPercentage);
      return;
    }

    let startTimestamp: number;
    const startValue = progress;
    const duration = animationDuration;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;

      const nextProgress =
        elapsed >= duration
          ? clampedPercentage
          : startValue +
            (clampedPercentage - startValue) * (elapsed / duration);

      setProgress(nextProgress);

      if (elapsed < duration) {
        window.requestAnimationFrame(step);
      }
    };

    const animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [clampedPercentage, animate, animationDuration]);

  // Calculate values for SVG
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Validate segments
  const normalizedSegments = [...segments];
  const segmentsSum = normalizedSegments.reduce(
    (sum, segment) => sum + segment,
    0
  );
  if (Math.abs(segmentsSum - 1) > 0.001) {
    // Normalize segments to sum to 1
    for (let i = 0; i < normalizedSegments.length; i++) {
      normalizedSegments[i] = normalizedSegments[i] / segmentsSum;
    }
  }

  // Calculate segment offsets
  const segmentOffsets = normalizedSegments.reduce(
    (acc: number[], segment, index) => {
      const prevOffset = index > 0 ? acc[index - 1] : 0;
      acc.push(prevOffset + segment);
      return acc;
    },
    []
  );

  // Ensure we have enough colors for all segments
  const extendedColors = [...colors];
  while (extendedColors.length < normalizedSegments.length) {
    extendedColors.push(colors[extendedColors.length % colors.length]);
  }

  return (
    <div className='relative flex items-center justify-center'>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className='transform -rotate-90'
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        role='progressbar'
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill='transparent'
          stroke='rgba(255, 255, 255, 0.1)'
          strokeWidth={strokeWidth}
        />

        {/* Segment circles */}
        {normalizedSegments.map((segment, index) => {
          const offset = index > 0 ? segmentOffsets[index - 1] : 0;
          const segmentProgress =
            Math.min(segment, Math.max(0, progress / 100 - offset)) / segment;

          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill='transparent'
              stroke={extendedColors[index]}
              strokeWidth={strokeWidth}
              strokeDasharray={`${
                circumference * segment * segmentProgress
              } ${circumference}`}
              strokeDashoffset={-circumference * offset}
              strokeLinecap='round'
            />
          );
        })}
      </svg>

      <div className='absolute flex flex-col items-center justify-center text-white'>
        <span className='text-3xl font-bold'>{Math.round(progress)}%</span>
        {text && <span className='text-sm'>{text}</span>}
      </div>
    </div>
  );
}
