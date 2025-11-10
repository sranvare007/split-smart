# Split Smart - Workout Split Tracker

A React Native workout split tracking app with a bold, dark aesthetic perfect for gym-goers.

## Features

- **Track Workout Splits**: Create custom workout splits with muscle groups for each day
- **Multiple Splits**: Manage multiple workout programs (only one active at a time)
- **Weekly Rest Days**: Configure specific days of the week as rest days (e.g., Sundays)
- **Manual Adjustments**: Skip forward, go back, or reset your split cycle if you miss days
- **Today's Workout**: See your current workout at a glance with date display
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
│   │       ├── Home.tsx        # Today's workout display
│   │       ├── Splits.tsx      # Manage all splits
│   │       └── AddEditSplit.tsx # Create/edit splits
│   ├── types/                  # TypeScript type definitions
│   │   └── split.ts           # Split data structures
│   ├── utils/                  # Utility functions
│   │   └── splitUtils.ts      # Split logic and storage
│   └── constants/              # App-wide constants
│       └── theme.ts           # Colors, fonts, spacing
├── assets/                     # App assets
│   ├── icon.svg               # Source icon (editable)
│   ├── icon.png               # App icon (1024x1024)
│   ├── adaptive-icon.png      # Android adaptive icon
│   ├── splash-icon.png        # Splash screen
│   └── favicon.png            # Web favicon
└── scripts/
    └── generate-icons.js      # Icon generation script
```

## Customization

### Colors

Edit `src/constants/theme.ts`:

```typescript
export const Colors = {
  primary: '#00D4FF',    // Electric Blue
  secondary: '#FF6B35',  // Orange
  tertiary: '#FF0055',   // Red
  background: '#0a0a0a', // Dark background
  // ... more colors
};
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

## App Usage

1. **First Launch**: App shows "No Active Split" message
2. **Create Split**:
   - Tap "MANAGE SPLITS"
   - Tap "+ ADD NEW SPLIT"
   - Enter split name (e.g., "Push Pull Legs")
   - Add days with muscle groups
   - Select weekly rest days (e.g., Sunday)
   - Tap "CREATE SPLIT"
3. **Activate Split**: Tap "ACTIVATE" on your split
4. **View Workout**: Home screen shows today's workout
5. **Adjust Split**: Use BACK/NEXT/RESET buttons if you miss days

## Data Storage

All data is stored locally using AsyncStorage:
- Split configurations
- Active split selection
- Current day position
- No server or account required

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
