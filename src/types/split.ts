export interface SplitDay {
  dayNumber: number
  muscleGroups: string
}

export interface Split {
  id: string
  name: string
  days: SplitDay[]
  weeklyHolidays: number[] // 0-6 for Sunday-Saturday
  isActive: boolean
  currentDayIndex: number // Which day in the split cycle we're on
  lastUpdated: string // ISO date string
}

export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
