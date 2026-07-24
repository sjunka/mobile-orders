import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Platform } from 'react-native'
import { Text, View } from 'tamagui'

import { claudeColors } from '../../tamagui.config'
import { CartIcon } from '../components/ui'
import { CartScreen } from '../features/cart/CartScreen'
import { CheckoutScreen } from '../features/checkout/CheckoutScreen'
import { ConfirmationScreen } from '../features/checkout/ConfirmationScreen'
import { MenuScreen } from '../features/menu/MenuScreen'
import { ProductDetailScreen } from '../features/menu/ProductDetailScreen'
import { useCart } from '../store/cart'
import type { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

const screenOptions = {
  headerStyle: { backgroundColor: claudeColors.canvas },
  headerTintColor: claudeColors.ink,
  headerShadowVisible: false,
  headerTitleStyle: {
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
    fontWeight: '400' as const,
    fontSize: 19,
    color: claudeColors.ink,
  },
  contentStyle: { backgroundColor: claudeColors.canvas },
}

function CartButton({ onPress }: { onPress: () => void }) {
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.quantity, 0))
  return (
    <View
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Cart"
      p={4}
      pressStyle={{ opacity: 0.6 }}
    >
      <CartIcon color={claudeColors.ink} />
      {count > 0 && (
        <View
          position="absolute"
          t={-2}
          r={-4}
          minW={18}
          height={18}
          rounded={9999}
          bg="$coral"
          items="center"
          justify="center"
          px={5}
        >
          <Text color="$onPrimary" fontSize={11} fontWeight="500">
            {count}
          </Text>
        </View>
      )}
    </View>
  )
}

export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Menu" screenOptions={screenOptions}>
      <Stack.Screen
        name="Menu"
        component={MenuScreen}
        options={({ navigation }) => ({
          title: 'Menu',
          headerRight: () => <CartButton onPress={() => navigation.navigate('Cart')} />,
        })}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={({ route }) => ({ title: route.params.product.name })}
      />
      <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
      <Stack.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        options={{ title: 'Confirmation', headerBackVisible: false }}
      />
    </Stack.Navigator>
  )
}
