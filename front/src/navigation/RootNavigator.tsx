import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { MenuScreen } from '../features/menu/MenuScreen'
import type { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Menu">
      <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'Menu' }} />
    </Stack.Navigator>
  )
}
