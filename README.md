# Split Smart - Workout Split Tracker

A React Native workout split tracking app with a bold, dark aesthetic perfect for gym-goers.

## Features

- **Track Workout Splits**: Create custom workout splits with muscle groups for each day
- **Automatic Day Progression**: Split automatically advances based on calendar days
- **Smart Date Tracking**: App intelligently handles multi-day gaps and rest days
- **Multiple Splits**: Manage multiple workout programs (only one active at a time)
- **Weekly Rest Days**: Configure specific days of the week as rest days (e.g., Sundays)
- **Manual Adjustments**: Skip forward, go back, or reset your split cycle if you miss days
- **Today's Workout**: See your current workout at a glance with date display
- **Offline First**: All data stored locally, no internet required
- **Dark Theme**: Bold, vibrant design with electric blue, orange, and red accents
- **Custom Fonts**: Bebas Neue for headings, Montserrat for UI elements
- **Custom Icons**: Dumbbell-themed app icons

## Tech Stack

- **React Native** 0.81.4
- **Expo** 54.0.7
- **TypeScript** 5.9.2
- **React Navigation** 7.x
- **AsyncStorage** for data persistence
- **Google Fonts** (Bebas Neue, Montserrat)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- For iOS: macOS with Xcode
- For Android: Android Studio with SDK

### Installation

1. Clone the repository:

```bash
git clone https://github.com/sranvare007/split-smart.git
cd split-smart
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

### Running the App

#### Development Builds (Required to see custom icons and fonts)

For **Android**:

```bash
npx expo run:android
```

For **iOS** (macOS only):

```bash
npx expo run:ios
```

#### Web Preview

```bash
npm run web
```

**Important**: Custom app icons only appear in native builds, not in the Metro bundler or Expo Go app.

## Seeing Your Custom Icons

After generating or modifying icons, you **must rebuild** the native app:

```bash
# If you modified the icon SVG, regenerate PNG files first
npm run generate-icons

# Then rebuild for your platform
npx expo run:android  # For Android
# or
npx expo run:ios      # For iOS
```

The icons are embedded into the native app at build time, so simply refreshing the Metro bundler won't update them.

## Project Structure

```
split-smart/
├── src/
│   ├── App.tsx                 # Root app component with font loading
│   ├── navigation/             # Navigation configuration
│   │   ├── index.tsx           # Tab and stack navigators
│   │   └── screens/            # All app screens
│   │       ├── Home.tsx        # Today's workout display + auto-advance logic
│   │       ├── Splits.tsx      # Manage all splits
│   │       └── AddEditSplit.tsx # Create/edit splits
│   ├── types/                  # TypeScript type definitions
│   │   └── split.ts           # Split & SplitDay interfaces
│   ├── utils/                  # Utility functions
│   │   └── splitUtils.ts      # Core split logic:
│   │                          #  - loadSplits/saveSplits (AsyncStorage)
│   │                          #  - getActiveSplit/getTodaysWorkout
│   │                          #  - advanceToNextDay/goToPreviousDay
│   │                          #  - autoAdvanceSplitIfNeeded (date-based)
│   │                          #  - Date calculation helpers
│   └── constants/              # App-wide constants
│       └── theme.ts           # Colors, fonts, spacing, typography
├── assets/                     # App assets
│   ├── icon.svg               # Source icon (editable)
│   ├── icon.png               # App icon (1024x1024)
│   ├── adaptive-icon.png      # Android adaptive icon
│   ├── splash-icon.png        # Splash screen
│   └── favicon.png            # Web favicon
└── scripts/
    └── generate-icons.js      # Icon generation script (SVG to PNG)
```

### Key Files Explained

**src/utils/splitUtils.ts** - Core Business Logic

```typescript
// Storage functions
loadSplits(): Promise<Split[]>          // Load from AsyncStorage
saveSplits(splits): Promise<void>       // Save to AsyncStorage

// Split management
getActiveSplit(splits): Split | null    // Find active split
getTodaysWorkout(split): Workout | null // Get current day's workout
advanceToNextDay(split): Split          // Move to next in cycle
goToPreviousDay(split): Split           // Move to previous in cycle

// Automatic advancement (NEW)
autoAdvanceSplitIfNeeded(split): Promise<Split>
  // 1. Gets last access date from storage
  // 2. Calculates calendar days passed
  // 3. Advances split for each non-holiday day
  // 4. Returns updated split

// Date helpers
getDaysBetween(start, end): number      // Calendar days difference
isDayOfWeekHoliday(day, holidays): bool // Check if day is rest day
```

**src/navigation/screens/Home.tsx** - Main Screen

```typescript
// On screen focus:
loadData() {
  1. Load splits from AsyncStorage
  2. Get active split
  3. Auto-advance if dates changed (autoAdvanceSplitIfNeeded)
  4. Save updated split if changed
  5. Determine if today is rest day
  6. Display current workout
}

// Manual controls:
handleNextDay()     // User clicks NEXT →
handlePreviousDay() // User clicks ← BACK
handleReset()       // User clicks ↻ RESET
```

**src/types/split.ts** - Data Models

```typescript
interface Split {
  id: string // Unique identifier
  name: string // "Push Pull Legs"
  days: SplitDay[] // Array of workout days
  weeklyHolidays: number[] // [0,6] = Sunday & Saturday
  isActive: boolean // Only one can be true
  currentDayIndex: number // Position in cycle (0-indexed)
  lastUpdated: string // ISO date string
}

interface SplitDay {
  dayNumber: number // Display number (1-6)
  muscleGroups: string // "Chest, Shoulders, Triceps"
}
```

## Customization

### Colors

Edit `src/constants/theme.ts`:

```typescript
export const Colors = {
  primary: '#00D4FF', // Electric Blue
  secondary: '#FF6B35', // Orange
  tertiary: '#FF0055', // Red
  background: '#0a0a0a', // Dark background
  // ... more colors
}
```

### Fonts

Fonts are configured in `src/constants/theme.ts` and loaded in `src/App.tsx`:

- **Bebas Neue**: Bold headings and workout titles
- **Montserrat**: Body text and UI elements (Regular, Medium, SemiBold, Bold)

### Icons

1. Edit `assets/icon.svg` with your preferred SVG editor
2. Run `npm run generate-icons` to regenerate PNG files
3. Rebuild the app: `npx expo run:android` or `npx expo run:ios`

## Building for Production

### Using EAS Build (Recommended)

1. Install EAS CLI:

```bash
npm install -g eas-cli
```

2. Login to Expo:

```bash
eas login
```

3. Configure EAS:

```bash
eas build:configure
```

4. Build for your platform:

```bash
# Android APK/AAB
eas build --platform android --profile production

# iOS
eas build --platform ios --profile production
```

## How It Works

### Understanding Workout Splits

A workout split is a program that divides your training across multiple days. For example, a **Push/Pull/Legs** split:

- **Day 1**: Push (Chest, Shoulders, Triceps)
- **Day 2**: Pull (Back, Biceps)
- **Day 3**: Legs (Quads, Hamstrings, Calves)

The split cycles continuously. After Day 3, you return to Day 1 and repeat.

### Automatic Split Advancement

Split Smart automatically tracks which day you're on based on **calendar days**, not gym sessions:

**Example 1: Regular Progression**

- Monday: App shows "Day 1: Push"
- Tuesday: App automatically shows "Day 2: Pull"
- Wednesday: App automatically shows "Day 3: Legs"
- Thursday: App automatically shows "Day 1: Push" (cycle restarts)

**Example 2: Multi-Day Gaps**

- Monday: You see "Day 1: Push" and work out
- You don't open the app Tuesday-Thursday
- Friday: App automatically shows "Day 5" (4 days advanced)

**Example 3: Rest Days**

- You configure Sunday as a weekly rest day
- Saturday: "Day 6: Arms"
- Sunday: "REST DAY" (no advancement)
- Monday: "Day 1: Chest" (advancement resumes)

### How Date Tracking Works

The app uses intelligent calendar-based tracking:

1. **First Access**: When you first activate a split, it saves the current date
2. **Daily Use**: Each time you open the app:
   - Compares current date to last access date
   - Calculates calendar days that passed
   - Advances split for each **non-rest day**
   - Updates the last access date

3. **Rest Day Logic**:
   - Weekly rest days (e.g., Sunday) don't advance the split
   - If you skip 7 days with Sunday as rest, split advances 6 times
   - Rest days are based on day of week, not split position

4. **Automatic vs Manual**:
   - **Automatic**: Happens when calendar days pass
   - **Manual**: Use BACK/NEXT buttons for missed gym days or schedule changes

### Split Cycle Management

**Current Day Index**: The app tracks your position in the split cycle (0-indexed internally, displayed as 1-indexed)

**Example with 6-Day Split**:

```
Days: [Day 1, Day 2, Day 3, Day 4, Day 5, Day 6]
Index:    0      1      2      3      4      5

Monday (Index 0) → Day 1
Tuesday (Index 1) → Day 2
...
Saturday (Index 5) → Day 6
Sunday (REST DAY) → Day 6 (no advancement)
Monday (Index 0) → Day 1 (cycle restarts)
```

## App Usage

### Initial Setup

1. **First Launch**: App shows "No Active Split" message
2. **Create Your First Split**:
   - Tap "MANAGE SPLITS"
   - Tap "+ ADD NEW SPLIT"
   - Enter split name (e.g., "Push Pull Legs")
   - Add workout days with muscle groups:
     - Day 1: "Chest, Shoulders, Triceps"
     - Day 2: "Back, Biceps"
     - Day 3: "Legs, Abs"
   - Select weekly rest days (e.g., check "Sunday")
   - Tap "CREATE SPLIT"
3. **Activate Split**: Tap "ACTIVATE" on your newly created split
4. **Start Training**: Home screen shows today's workout

### Daily Workflow

**Normal Day**:

- Open app → See today's workout automatically
- Complete your workout
- Close app

**Rest Day (Weekly Holiday)**:

- Open app → See "REST DAY" message
- Split doesn't advance
- Enjoy your recovery day

**Missed Gym Day**:

- Used BACK button to repeat the same workout
- Or continue with automatic progression

**Coming Back After Days Off**:

- Open app → Split automatically advances for each non-rest day that passed
- Adjust manually if needed using BACK/NEXT buttons

### Managing Splits

**Creating Multiple Splits**:

```
Example Setup:
1. "Strength Focus" - 4-day upper/lower
2. "Hypertrophy" - 6-day PPL
3. "Maintenance" - 3-day full body
```

- Create as many as you want
- Only one can be active at a time
- Switch between them anytime

**Editing Splits**:

- Tap "MANAGE SPLITS"
- Tap on any split
- Modify days, muscle groups, or rest days
- Save changes

**Deleting Splits**:

- Swipe left on any split
- Confirm deletion
- Cannot delete if it's the only split

### Manual Controls

**NEXT → Button**:

- Manually advance to next day in cycle
- Use when: You missed a gym day and want to skip ahead

**← BACK Button**:

- Go back to previous day in cycle
- Use when: You want to repeat a workout

**↻ RESET TO DAY 1**:

- Returns split to the first day
- Use when: Starting a new training phase or deload week

## Use Cases & Examples

### Use Case 1: 6-Day PPL with Sunday Rest

**Setup**:

- Split: Push, Pull, Legs, Push, Pull, Legs (6 days)
- Rest Day: Sunday

**Week 1**:

- Mon: Push (Day 1)
- Tue: Pull (Day 2)
- Wed: Legs (Day 3)
- Thu: Push (Day 4)
- Fri: Pull (Day 5)
- Sat: Legs (Day 6)
- Sun: REST DAY

**Week 2**:

- Mon: Push (Day 1) - cycle restarts
- Continues...

### Use Case 2: Vacation Recovery

**Scenario**: You go on vacation for 10 days

**Before Vacation**: Last workout was "Day 3: Legs" on June 1st

**During Vacation**: App not opened

**Return**: Open app on June 12th

- App calculates: 11 calendar days passed
- Minus rest days: Let's say 1 Sunday = 10 workout days
- Split advanced 10 times through 6-day cycle
- Shows: "Day 1: Push" (10 % 6 = 4, wraps to Day 1 after cycling)

**Action**:

- Use "RESET TO DAY 1" to start fresh
- Or continue with shown workout

### Use Case 3: Flexible Training

**Scenario**: You train 4x/week but want a 5-day split

**Setup**:

- Split: Chest, Back, Legs, Shoulders, Arms (5 days)
- Rest Days: None (let calendar advance naturally)

**Reality**:

- You typically rest Wed, Sat, Sun
- But weeks vary based on schedule

**Behavior**:

- Split advances every calendar day
- Miss 2 days? Automatically skips ahead
- Train 2 days in a row? Follows natural progression
- Total flexibility without manual tracking

## Data Storage

All data is stored locally using AsyncStorage:

**Stored Information**:

- **@workout_splits**: Array of all your splits
  - Split name, days, muscle groups
  - Active status (boolean)
  - Current day index (position in cycle)
  - Weekly holidays (rest days)
  - Last updated timestamp
- **@last_access_date**: Last date app was opened
  - Used for automatic split advancement
  - Normalized to start of day (00:00:00)

**Data Persistence**:

- No server, no cloud sync
- No account required
- Data survives app restarts
- Persists across app updates

**Privacy**:

- All data stays on your device
- No internet connection required
- No analytics or tracking
- No data sharing

**Backup**:

- Data stored in AsyncStorage (React Native)
- Android: Backed up if device backup enabled
- iOS: Included in iCloud backup if enabled
- Reinstalling app will clear data (no cloud sync)

## Troubleshooting

### Icons Not Showing

**Problem**: Icons appear as default Expo icon
**Solution**: Rebuild the native app

```bash
npx expo run:android  # or npx expo run:ios
```

Icons are embedded at build time and won't update with hot reload.

### Fonts Not Loading

**Problem**: Text appears in system font
**Solution**:

1. Ensure dependencies are installed: `npm install`
2. Clear cache: `npx expo start --clear`
3. Check that `App.tsx` waits for fonts before rendering

### Build Errors

**Solutions**:

```bash
# Clear node modules
rm -rf node_modules && npm install

# Clear Expo cache
npx expo start --clear

# Clean prebuild
npx expo prebuild --clean
```

### AsyncStorage Errors

**Problem**: Data not persisting
**Solution**: Ensure `@react-native-async-storage/async-storage` is installed and linked properly in native builds.

### Split Not Auto-Advancing

**Problem**: Split stays on same day after date change
**Solution**:

1. Check that you're running the latest version with auto-advance feature
2. Verify split is activated (Home.tsx:42-71)
3. Check console for errors in `autoAdvanceSplitIfNeeded`
4. Try manual advancement (NEXT button) to test basic functionality

### Wrong Day After Multi-Day Gap

**Problem**: Split shows unexpected day after not opening app for several days
**Expected**: This is normal behavior - split advances for each calendar day
**Solution**:

- Use "RESET TO DAY 1" if you want to start fresh
- Use "BACK" button to go to desired day
- Or continue with shown workout (split has advanced correctly)

## Scripts

- `npm start` - Start Metro bundler
- `npm run web` - Run on web browser
- `npm run android` - Build and run on Android
- `npm run ios` - Build and run on iOS (macOS only)
- `npm run generate-icons` - Regenerate app icons from SVG

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Author

sranvare007

---

Built with React Native, Expo, and React Navigation
