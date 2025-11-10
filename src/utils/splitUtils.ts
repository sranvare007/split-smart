import AsyncStorage from '@react-native-async-storage/async-storage';
import { Split } from '../types/split';

const SPLITS_STORAGE_KEY = '@workout_splits';

/**
 * Load all splits from storage
 */
export const loadSplits = async (): Promise<Split[]> => {
  try {
    const splitsJson = await AsyncStorage.getItem(SPLITS_STORAGE_KEY);
    if (splitsJson) {
      return JSON.parse(splitsJson);
    }
    return [];
  } catch (error) {
    console.error('Error loading splits:', error);
    return [];
  }
};

/**
 * Save splits to storage
 */
export const saveSplits = async (splits: Split[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(SPLITS_STORAGE_KEY, JSON.stringify(splits));
  } catch (error) {
    console.error('Error saving splits:', error);
    throw error; // Re-throw so callers can handle it
  }
};

/**
 * Get the active split
 */
export const getActiveSplit = (splits: Split[]): Split | null => {
  return splits.find((split) => split.isActive) || null;
};

/**
 * Check if today is a holiday based on weekly holidays
 */
export const isTodayHoliday = (weeklyHolidays: number[]): boolean => {
  const today = new Date().getDay(); // 0-6 for Sunday-Saturday
  return weeklyHolidays.includes(today);
};

/**
 * Get today's workout from active split
 * Returns null if today is a holiday or no active split
 */
export const getTodaysWorkout = (split: Split | null): {
  muscleGroups: string;
  dayNumber: number;
} | null => {
  if (!split || split.days.length === 0) {
    return null;
  }

  // Check if today is a holiday
  if (isTodayHoliday(split.weeklyHolidays)) {
    return null;
  }

  // Get current day from the split cycle
  const currentDay = split.days[split.currentDayIndex];
  return currentDay || null;
};

/**
 * Update the active split by advancing to next workout day
 */
export const advanceToNextDay = (split: Split): Split => {
  const nextIndex = (split.currentDayIndex + 1) % split.days.length;
  return {
    ...split,
    currentDayIndex: nextIndex,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Go back to previous workout day
 */
export const goToPreviousDay = (split: Split): Split => {
  const prevIndex =
    split.currentDayIndex === 0
      ? split.days.length - 1
      : split.currentDayIndex - 1;
  return {
    ...split,
    currentDayIndex: prevIndex,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Reset split to day 1
 */
export const resetSplit = (split: Split): Split => {
  return {
    ...split,
    currentDayIndex: 0,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Create a new split
 */
export const createSplit = (
  name: string,
  days: Array<{ dayNumber: number; muscleGroups: string }>,
  weeklyHolidays: number[]
): Split => {
  return {
    id: Date.now().toString(),
    name,
    days,
    weeklyHolidays,
    isActive: false,
    currentDayIndex: 0,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Set a split as active and deactivate all others
 */
export const setActiveSplit = (splits: Split[], splitId: string): Split[] => {
  return splits.map((split) => ({
    ...split,
    isActive: split.id === splitId,
  }));
};

/**
 * Delete a split
 */
export const deleteSplit = (splits: Split[], splitId: string): Split[] => {
  return splits.filter((split) => split.id !== splitId);
};

/**
 * Update a split
 */
export const updateSplit = (splits: Split[], updatedSplit: Split): Split[] => {
  return splits.map((split) =>
    split.id === updatedSplit.id ? updatedSplit : split
  );
};

/**
 * Format date for display
 */
export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};
