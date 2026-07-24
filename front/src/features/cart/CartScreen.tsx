import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ScrollView, XStack, YStack } from 'tamagui'

import {
  Body,
  Card,
  CartIcon,
  Display,
  Hero,
  PrimaryButton,
  SecondaryButton,
  Screen,
} from '../../components/ui'
import type { RootStackParamList } from '../../navigation/types'
import { useCart } from '../../store/cart'
import type { CartLine } from '../../types/cart'
import { cartTotal, formatPrice } from '../../utils/price'

export function CartScreen() {
  const lines = useCart((s) => s.lines)
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  if (lines.length === 0) {
    return (
      <Screen>
        <Hero
          eyebrow="Your bag"
          title="Nothing here yet"
          image={require('../../../assets/ui/hero-cart.png')}
        />
        <YStack flex={1} items="center" justify="center" gap={16} p="$4">
          <CartIcon color="#8e8b82" />
          <Display size="md">Your cart is empty.</Display>
          <SecondaryButton onPress={() => navigation.popToTop()}>Browse the menu</SecondaryButton>
        </YStack>
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView flex={1} contentContainerStyle={{ pb: 16 }}>
        <Hero
          eyebrow="Your bag"
          title={`${lines.length} ${lines.length === 1 ? 'item' : 'items'}`}
          subtitle="Change quantities before you pay."
          image={require('../../../assets/ui/hero-cart.png')}
          height={170}
        />
        <YStack gap={12} p={16}>
          {lines.map((line) => (
            <CartLineRow key={line.id} line={line} />
          ))}
        </YStack>
      </ScrollView>

      <YStack p={16} pb={28} gap={12} borderTopWidth={1} borderColor="$hairline" bg="$canvas">
        <XStack justify="space-between" items="center">
          <Body tone="muted">Total</Body>
          <Display testID="cart-total" size="md">
            {formatPrice(cartTotal(lines))}
          </Display>
        </XStack>
        <PrimaryButton onPress={() => navigation.navigate('Checkout')}>Checkout</PrimaryButton>
      </YStack>
    </Screen>
  )
}

function CartLineRow({ line }: { line: CartLine }) {
  const setQuantity = useCart((s) => s.setQuantity)
  const removeLine = useCart((s) => s.removeLine)

  return (
    <Card gap={10}>
      <XStack justify="space-between" items="center" gap={12}>
        <Display size="sm" flex={1}>
          {line.product.name}
        </Display>
        <Body strong testID={`line-price-${line.id}`}>
          {formatPrice(line.price)}
        </Body>
      </XStack>

      {line.modifiers.length > 0 && (
        <Body small tone="muted">
          {line.modifiers.map((m) => m.label).join(', ')}
        </Body>
      )}

      <XStack items="center" gap={12}>
        <SecondaryButton
          circular
          size="$3"
          onPress={() => setQuantity(line.id, line.quantity - 1)}
          accessibilityLabel={`Decrease ${line.product.name} quantity`}
        >
          −
        </SecondaryButton>
        <Body strong width={24} text="center">
          {line.quantity}
        </Body>
        <SecondaryButton
          circular
          size="$3"
          onPress={() => setQuantity(line.id, line.quantity + 1)}
          accessibilityLabel={`Increase ${line.product.name} quantity`}
        >
          +
        </SecondaryButton>
        <SecondaryButton
          size="$3"
          ml="auto"
          color="$muted"
          onPress={() => removeLine(line.id)}
          accessibilityLabel={`Remove ${line.product.name}`}
        >
          Remove
        </SecondaryButton>
      </XStack>
    </Card>
  )
}
