import AsyncStorage from '@react-native-async-storage/async-storage';
import { Split } from '../types/split';

const SPLITS_STORAGE_KEY = '@workout_splits';
const LAST_ACCESS_DATE_KEY = '@last_access_date';

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

/**
 * Get the last access date from storage
 */
export const getLastAccessDate = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(LAST_ACCESS_DATE_KEY);
  } catch (error) {
    console.error('Error getting last access date:', error);
    return null;
  }
};

/**
 * Save the current date as last access date
 */
export const saveLastAccessDate = async (): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    await AsyncStorage.setItem(LAST_ACCESS_DATE_KEY, today.toISOString());
  } catch (error) {
    console.error('Error saving last access date:', error);
  }
};

/**
 * Get the day of week for a given date (0-6 for Sunday-Saturday)
 */
const getDayOfWeek = (date: Date): number => {
  return date.getDay();
};

/**
 * Calculate calendar days between two dates
 */
const getDaysBetween = (startDate: Date, endDate: Date): number => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const diffTime = end.getTime() - start.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Check if a specific day of week is a holiday
 */
const isDayOfWeekHoliday = (dayOfWeek: number, weeklyHolidays: number[]): boolean => {
  return weeklyHolidays.includes(dayOfWeek);
};

/**
 * Auto-advance split based on calendar days passed since last access
 * Only advances on non-holiday days
 */
export const autoAdvanceSplitIfNeeded = async (split: Split): Promise<Split> => {
  try {
    const lastAccessDateStr = await getLastAccessDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If no last access date, save today and return split as-is
    if (!lastAccessDateStr) {
      await saveLastAccessDate();
      return split;
    }

    const lastAccessDate = new Date(lastAccessDateStr);
    lastAccessDate.setHours(0, 0, 0, 0);

    // Calculate days passed
    const daysPassed = getDaysBetween(lastAccessDate, today);

    // If no days passed (same day), return split as-is
    if (daysPassed <= 0) {
      return split;
    }

    // Advance split for each non-holiday day that passed
    let updatedSplit = { ...split };

    for (let i = 1; i <= daysPassed; i++) {
      const dateToCheck = new Date(lastAccessDate);
      dateToCheck.setDate(dateToCheck.getDate() + i);
      const dayOfWeek = getDayOfWeek(dateToCheck);

      // Only advance if the day is not a holiday
      if (!isDayOfWeekHoliday(dayOfWeek, split.weeklyHolidays)) {
        updatedSplit = advanceToNextDay(updatedSplit);
      }
    }

    // Save today as the new last access date
    await saveLastAccessDate();

    return updatedSplit;
  } catch (error) {
    console.error('Error auto-advancing split:', error);
    return split; // Return original split on error
  }
};
