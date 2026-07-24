import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { TamaguiProvider } from 'tamagui'

import { RootNavigator } from './src/navigation/RootNavigator'
import { tamaguiConfig } from './tamagui.config'

const queryClient = new QueryClient()

export default function App() {
  return (
    // Cream canvas only — no dark theme designed yet (DESIGN-claude.md).
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </QueryClientProvider>
      <StatusBar style="dark" />
    </TamaguiProvider>
  )
}
