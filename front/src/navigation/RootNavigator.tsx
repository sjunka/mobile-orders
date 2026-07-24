import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
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

// A ring that swells out of the icon, once every few seconds, while the cart holds more than one item.
function CartPulse() {
  const wave = useSharedValue(0)

  useEffect(() => {
    wave.value = withRepeat(
      withDelay(1600, withTiming(1, { duration: 1400, easing: Easing.out(Easing.quad) })),
      -1,
      false,
    )
    return () => cancelAnimation(wave)
  }, [wave])

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(wave.value, [0, 1], [0.7, 1.9]) }],
    opacity: interpolate(wave.value, [0, 0.15, 1], [0, 0.28, 0]),
  }))

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 9999,
          borderWidth: 1.5,
          borderColor: claudeColors.ink,
        },
        style,
      ]}
    />
  )
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
      {count > 1 && <CartPulse />}
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
