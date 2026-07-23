import { Button, ScrollView, Separator, Text, XStack, YStack } from 'tamagui'

import { useCart } from '../../store/cart'
import type { CartLine } from '../../types/cart'
import { cartTotal, formatPrice } from '../../utils/price'

export function CartScreen() {
  const lines = useCart((s) => s.lines)

  if (lines.length === 0) {
    return (
      <YStack flex={1} items="center" justify="center">
        <Text>Your cart is empty.</Text>
      </YStack>
    )
  }

  return (
    <ScrollView flex={1}>
      <YStack gap="$3" p="$4">
        {lines.map((line) => (
          <CartLineRow key={line.id} line={line} />
        ))}

        <Separator />

        <XStack justify="space-between">
          <Text fontSize="$6" fontWeight="600">
            Total
          </Text>
          <Text testID="cart-total" fontSize="$6" fontWeight="600">
            {formatPrice(cartTotal(lines))}
          </Text>
        </XStack>
      </YStack>
    </ScrollView>
  )
}

function CartLineRow({ line }: { line: CartLine }) {
  const setQuantity = useCart((s) => s.setQuantity)
  const removeLine = useCart((s) => s.removeLine)

  return (
    <YStack gap="$2" p="$3" borderWidth={1} borderColor="$borderColor" rounded="$4">
      <XStack justify="space-between">
        <Text fontWeight="600">{line.product.name}</Text>
        <Text testID={`line-price-${line.id}`}>{formatPrice(line.price)}</Text>
      </XStack>

      {line.modifiers.length > 0 && (
        <Text color="$color10">{line.modifiers.map((m) => m.label).join(', ')}</Text>
      )}

      <XStack items="center" gap="$3">
        <Button
          circular
          onPress={() => setQuantity(line.id, line.quantity - 1)}
          accessibilityLabel={`Decrease ${line.product.name} quantity`}
        >
          −
        </Button>
        <Text>{line.quantity}</Text>
        <Button
          circular
          onPress={() => setQuantity(line.id, line.quantity + 1)}
          accessibilityLabel={`Increase ${line.product.name} quantity`}
        >
          +
        </Button>
        <Button
          ml="auto"
          onPress={() => removeLine(line.id)}
          accessibilityLabel={`Remove ${line.product.name}`}
        >
          Remove
        </Button>
      </XStack>
    </YStack>
  )
}
