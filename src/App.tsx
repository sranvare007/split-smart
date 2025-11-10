import { Assets as NavigationAssets } from '@react-navigation/elements'
import { DarkTheme } from '@react-navigation/native'
import { Asset } from 'expo-asset'
import { createURL } from 'expo-linking'
import * as SplashScreen from 'expo-splash-screen'
import * as React from 'react'
import { Navigation } from './navigation'
import { Colors } from './constants/theme'
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue'
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat'

Asset.loadAsync([...NavigationAssets, require('./assets/newspaper.png'), require('./assets/bell.png')])

SplashScreen.preventAutoHideAsync()

const prefix = createURL('/')

// Custom dark theme with bold colors
const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.cardBackground,
    text: Colors.textPrimary,
    border: Colors.border,
    notification: Colors.tertiary,
  },
}

export function App() {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  })

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <Navigation
      theme={CustomDarkTheme}
      linking={{
        enabled: 'auto',
        prefixes: [prefix],
      }}
    />
  )
}
