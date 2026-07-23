import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Button, TamaguiProvider, Text, YStack } from 'tamagui'

import { tamaguiConfig } from './tamagui.config'

export default function App() {
  const colorScheme = useColorScheme()

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme ?? 'light'}>
      <SafeAreaProvider>
        <YStack flex={1} background="$background">
          <SafeAreaView style={{ flex: 1 }}>
            <YStack flex={1} items="center" justify="center" gap="$4">
              <Text fontSize="$6" fontWeight="600" color="$color">
                mobile-orders
              </Text>
              <Button>Tamagui ready</Button>
            </YStack>
          </SafeAreaView>
        </YStack>
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </TamaguiProvider>
  )
}
