import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useState } from 'react'
import { Button, Separator, Text, XStack, YStack } from 'tamagui'

import type { RootStackParamList } from '../../navigation/types'
import { useCart } from '../../store/cart'
import { formatPrice, linePrice } from '../../utils/price'

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>

export function ProductDetailScreen({ route, navigation }: Props) {
  const { product } = route.params
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [quantity, setQuantity] = useState(1)
  const addLine = useCart((s) => s.addLine)

  const selected = product.modifiers.filter((m) => selectedIds.has(m.id))
  const total = linePrice(product.basePrice, selected, quantity)

  const toggle = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (!next.delete(id)) next.add(id)
      return next
    })

  return (
    <YStack flex={1} gap="$4" p="$4">
      <YStack gap="$1">
        <Text fontSize="$6" fontWeight="600">
          {product.name}
        </Text>
        <Text color="$color10">{formatPrice(product.basePrice)}</Text>
      </YStack>

      <YStack gap="$2">
        {product.modifiers.map((m) => {
          const on = selectedIds.has(m.id)
          return (
            <Button
              key={m.id}
              onPress={() => toggle(m.id)}
              bg={on ? '$color5' : undefined}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
            >
              <XStack flex={1} justify="space-between">
                <Text>{m.label}</Text>
                <Text>{formatDelta(m.priceDelta)}</Text>
              </XStack>
            </Button>
          )
        })}
      </YStack>

      <XStack items="center" gap="$4">
        <Text>Quantity</Text>
        <Button
          circular
          onPress={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={quantity === 1}
          accessibilityLabel="Decrease quantity"
        >
          −
        </Button>
        <Text fontSize="$5">{quantity}</Text>
        <Button
          circular
          onPress={() => setQuantity((q) => q + 1)}
          accessibilityLabel="Increase quantity"
        >
          +
        </Button>
      </XStack>

      <Separator />

      <Text testID="line-price" fontSize="$6" fontWeight="600">
        {formatPrice(total)}
      </Text>

      <Button
        theme="accent"
        onPress={() => {
          addLine(product, selected, quantity)
          // Back to the menu so the guest keeps shopping; the header shows the count.
          navigation.goBack()
        }}
      >
        Add to cart
      </Button>
    </YStack>
  )
}

// A delta can be negative (e.g. "no cheese"), so don't hardcode the plus.
function formatDelta(cents: number): string {
  return cents < 0 ? `-${formatPrice(-cents)}` : `+${formatPrice(cents)}`
}
