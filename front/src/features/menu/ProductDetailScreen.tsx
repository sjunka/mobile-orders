import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useState } from 'react'
import { ScrollView, XStack, YStack } from 'tamagui'

import {
  Body,
  Card,
  Display,
  Hero,
  PrimaryButton,
  SecondaryButton,
  Screen,
} from '../../components/ui'
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
    <Screen>
      <ScrollView flex={1} contentContainerStyle={{ pb: 24 }}>
        <Hero
          eyebrow="On the menu"
          title={product.name}
          subtitle={formatPrice(product.basePrice)}
          image={require('../../../assets/ui/hero-product.png')}
          height={170}
        />

        {product.modifiers.length > 0 && (
          <YStack gap={10} p={16}>
            <Body small tone="soft" letterSpacing={1.5}>
              EXTRAS
            </Body>
            {product.modifiers.map((m) => {
              const on = selectedIds.has(m.id)
              return (
                <Card
                  key={m.id}
                  onPress={() => toggle(m.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  bg={on ? '$coral' : '$surfaceCard'}
                  pressStyle={{ opacity: 0.85 }}
                  p={14}
                >
                  <XStack justify="space-between" items="center">
                    <Body strong color={on ? '$onPrimary' : '$ink'}>
                      {m.label}
                    </Body>
                    <Body small color={on ? '$onPrimary' : '$muted'}>
                      {formatDelta(m.priceDelta)}
                    </Body>
                  </XStack>
                </Card>
              )
            })}
          </YStack>
        )}

        <XStack items="center" gap={16} px={16} pt={8}>
          <Body strong flex={1}>
            Quantity
          </Body>
          <SecondaryButton
            circular
            size="$3"
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity === 1}
            accessibilityLabel="Decrease quantity"
          >
            −
          </SecondaryButton>
          <Display size="sm" width={28} text="center">
            {quantity}
          </Display>
          <SecondaryButton
            circular
            size="$3"
            onPress={() => setQuantity((q) => q + 1)}
            accessibilityLabel="Increase quantity"
          >
            +
          </SecondaryButton>
        </XStack>
      </ScrollView>

      <YStack
        p={16}
        gap={12}
        borderTopWidth={1}
        borderColor="$hairline"
        bg="$canvas"
        pb={28}
      >
        <XStack justify="space-between" items="center">
          <Body tone="muted">Total</Body>
          <Display testID="line-price" size="md">
            {formatPrice(total)}
          </Display>
        </XStack>
        <PrimaryButton
          onPress={() => {
            addLine(product, selected, quantity)
            // Back to the menu so the guest keeps shopping; the header shows the count.
            navigation.goBack()
          }}
        >
          Add to cart
        </PrimaryButton>
      </YStack>
    </Screen>
  )
}

// A delta can be negative (e.g. "no cheese"), so don't hardcode the plus.
function formatDelta(cents: number): string {
  return cents < 0 ? `-${formatPrice(-cents)}` : `+${formatPrice(cents)}`
}
