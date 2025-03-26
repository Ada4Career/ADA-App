'use client';

import React from 'react';

import { SkillScore } from '@/types/response/job';

interface SegmentedProgressBarProps {
  scoreBreakdown: SkillScore;
  height?: number;
  barClassName?: string;
  showLabels?: boolean;
  animated?: boolean;
}

export function SegmentedProgressBar({
  scoreBreakdown,
  height = 24,
  barClassName = 'rounded-full overflow-hidden',
  showLabels = true,
  animated = true,
}: SegmentedProgressBarProps) {
  // Define colors for each segment
  const colors = {
    skills: '#10b981', // green
    experience: '#3b82f6', // blue
    expectations: '#f59e0b', // amber
    accessibility: '#ec4899', // pink
  };

  // Calculate total score
  const totalScore = Object.values(scoreBreakdown).reduce(
    (sum, score) => sum + score,
    0
  );
  const maxPossibleScore = 100; // Assuming the max total score is 100

  // Calculate what percentage of the bar each segment should take
  const segments = [
    {
      name: 'Skills',
      score: scoreBreakdown.skills_score,
      color: colors.skills,
      percentage: (scoreBreakdown.skills_score / maxPossibleScore) * 100,
    },
    {
      name: 'Experience',
      score: scoreBreakdown.experience_score,
      color: colors.experience,
      percentage: (scoreBreakdown.experience_score / maxPossibleScore) * 100,
    },
    {
      name: 'Expectations',
      score: scoreBreakdown.expectations_score,
      color: colors.expectations,
      percentage: (scoreBreakdown.expectations_score / maxPossibleScore) * 100,
    },
    {
      name: 'Accessibility',
      score: scoreBreakdown.accessibility_score,
      color: colors.accessibility,
      percentage: (scoreBreakdown.accessibility_score / maxPossibleScore) * 100,
    },
  ];

  return (
    <div className='w-full'>
      <div className='mb-2'>
        <div className='flex justify-between items-center'>
          <span className='text-sm font-medium'>Score Breakdown</span>
          <span className='text-sm font-medium'>{totalScore}%</span>
        </div>
      </div>

      {/* Progress bar container */}
      <div className={`w-full h-${height} bg-gray-200 ${barClassName}`}>
        <div className='flex h-full'>
          {segments.map((segment, index) => (
            <div
              key={segment.name}
              style={{
                width: `${segment.percentage}%`,
                backgroundColor: segment.color,
                transition: animated ? 'width 1s ease-in-out' : 'none',
              }}
              className={`h-full ${index === 0 ? 'rounded-l-full' : ''} ${
                index === segments.length - 1 ? 'rounded-r-full' : ''
              }`}
              aria-valuenow={segment.score}
              aria-valuemin={0}
              aria-valuemax={100}
              role='progressbar'
              aria-label={`${segment.name} score: ${segment.score}%`}
            />
          ))}
        </div>
      </div>

      {/* Labels */}
      {showLabels && (
        <div className='flex justify-between mt-2'>
          {segments.map((segment) => (
            <div key={`label-${segment.name}`} className='flex items-center'>
              <div
                className='w-3 h-3 rounded-full mr-1'
                style={{ backgroundColor: segment.color }}
              />
              <span className='text-xs'>
                {segment.name}: {segment.score}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
