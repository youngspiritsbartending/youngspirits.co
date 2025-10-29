import { useMemo } from 'react';
import { TRANSITIONS } from '../config/designTokens';

const seededRandom = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

interface TransitionConfig {
  baseDelay?: number;
  staggerDelay?: number;
  minDuration?: number;
  maxDuration?: number;
}

const defaultConfig: TransitionConfig = {
  baseDelay: 0,
  staggerDelay: 0.05,
  minDuration: TRANSITIONS.organic.min,
  maxDuration: TRANSITIONS.organic.max,
};

const getTransitionDuration = (
  seed: string,
  index: number,
  config: TransitionConfig = defaultConfig
): { duration: string; delay: string } => {
  const { baseDelay = 0, staggerDelay = 0.05, minDuration = 0.6, maxDuration = 1.2 } = config;

  const seedValue = seededRandom(`${seed}-${index}`);
  const range = maxDuration - minDuration;
  const normalized = (seedValue % 1000) / 1000;
  const duration = minDuration + normalized * range;

  const delay = baseDelay + index * staggerDelay;

  return {
    duration: `${duration.toFixed(3)}s`,
    delay: `${delay.toFixed(3)}s`,
  };
};

export const getOrganicTransitionClass = (
  seed: string,
  index: number,
  config?: TransitionConfig
): string => {
  const { duration, delay } = getTransitionDuration(seed, index, config);
  return `transition-colors duration-[${duration}] delay-[${delay}]`;
};

export function useOrganicTransition(seed: string = '', config?: TransitionConfig) {
  const getTransitionClass = useMemo(() => {
    return (index: number): string => {
      return getOrganicTransitionClass(seed, index, config);
    };
  }, [seed, config]);

  return { getTransitionClass };
}
