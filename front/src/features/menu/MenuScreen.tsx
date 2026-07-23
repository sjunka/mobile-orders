import { Button, ScrollView, Spinner, Text, YStack } from 'tamagui'

import type { Product } from '../../types/menu'
import { formatPrice } from '../../utils/price'
import { useMenu } from './useMenu'

export function MenuScreen() {
  const { data: menu, isPending, isError, refetch } = useMenu()

  if (isPending) {
    return (
      <YStack flex={1} items="center" justify="center">
        <Spinner size="large" accessibilityLabel="Loading menu" />
      </YStack>
    )
  }

  if (isError) {
    return (
      <YStack flex={1} items="center" justify="center" gap="$4" p="$4">
        <Text>Couldn't load the menu.</Text>
        <Button onPress={() => refetch()}>Try again</Button>
      </YStack>
    )
  }

  return (
    <ScrollView flex={1}>
      <YStack gap="$2" p="$4">
        {menu.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}
      </YStack>
    </ScrollView>
  )
}

function ProductRow({ product }: { product: Product }) {
  return (
    <YStack
      gap="$1"
      p="$3"
      borderWidth={1}
      borderColor="$borderColor"
      rounded="$4"
    >
      <Text fontWeight="600">{product.name}</Text>
      <Text color="$color10">{formatPrice(product.basePrice)}</Text>
    </YStack>
  )
}
