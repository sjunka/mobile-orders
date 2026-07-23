import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { TamaguiProvider } from 'tamagui'

import { enableMocks } from './src/mocks/enable'
import { RootNavigator } from './src/navigation/RootNavigator'
import { tamaguiConfig } from './tamagui.config'

const queryClient = new QueryClient()

export default function App() {
  const colorScheme = useColorScheme()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    enableMocks().finally(() => setReady(true))
  }, [])

  if (!ready) return null

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme ?? 'light'}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </QueryClientProvider>
      <StatusBar style="auto" />
    </TamaguiProvider>
  )
}
