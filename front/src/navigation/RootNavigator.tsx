import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Button } from 'tamagui'

import { CartScreen } from '../features/cart/CartScreen'
import { CheckoutScreen } from '../features/checkout/CheckoutScreen'
import { ConfirmationScreen } from '../features/checkout/ConfirmationScreen'
import { MenuScreen } from '../features/menu/MenuScreen'
import { ProductDetailScreen } from '../features/menu/ProductDetailScreen'
import { useCart } from '../store/cart'
import type { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

function CartButton({ onPress }: { onPress: () => void }) {
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.quantity, 0))
  return (
    <Button size="$2" onPress={onPress} accessibilityLabel="Cart">
      Cart{count > 0 ? ` (${count})` : ''}
    </Button>
  )
}

export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Menu">
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
