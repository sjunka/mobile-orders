import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ScrollView, Spinner, XStack, YStack } from 'tamagui'

import { Badge, Body, Card, Display, Hero, PrimaryButton, Screen } from '../../components/ui'
import type { RootStackParamList } from '../../navigation/types'
import type { Product } from '../../types/menu'
import { formatPrice } from '../../utils/price'
import { useMenu } from './useMenu'

export function MenuScreen() {
  const { data: menu, isPending, isError, refetch } = useMenu()

  if (isPending) {
    return (
      <Screen items="center" justify="center">
        <Spinner size="large" color="$coral" accessibilityLabel="Loading menu" />
      </Screen>
    )
  }

  if (isError) {
    return (
      <Screen items="center" justify="center" gap="$4" p="$4">
        <Display size="sm">Couldn't load the menu.</Display>
        <PrimaryButton onPress={() => refetch()}>Try again</PrimaryButton>
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView flex={1} contentContainerStyle={{ pb: 32 }}>
        <Hero
          eyebrow="Open now"
          title="Today's menu"
          subtitle="Pick something, make it yours."
          image={require('../../../assets/ui/hero-menu.png')}
        />

        <YStack gap={12} p={16}>
          {menu.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </YStack>
      </ScrollView>
    </Screen>
  )
}

function ProductRow({ product }: { product: Product }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  return (
    <Card
      pressStyle={{ bg: '$surfaceCreamStrong' }}
      onPress={() => navigation.navigate('ProductDetail', { product })}
      accessibilityRole="button"
    >
      <XStack justify="space-between" items="center" gap={12}>
        <Display size="sm" flex={1}>
          {product.name}
        </Display>
        <Body strong>{formatPrice(product.basePrice)}</Body>
      </XStack>

      {product.modifiers.length > 0 && (
        <XStack gap={6} flexWrap="wrap" mt={4}>
          {product.modifiers.map((m) => (
            <Badge key={m.id} bg="$coralSoft" borderWidth={1} borderColor="$coralActive">
              {m.label}
            </Badge>
          ))}
        </XStack>
      )}
    </Card>
  )
}
