import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { YStack } from 'tamagui'

import { Badge, Body, Display, Hero, PrimaryButton, Screen } from '../../components/ui'
import type { RootStackParamList } from '../../navigation/types'
import { formatPrice } from '../../utils/price'

type Props = NativeStackScreenProps<RootStackParamList, 'Confirmation'>

export function ConfirmationScreen({ route, navigation }: Props) {
  const { orderId, total } = route.params

  return (
    <Screen>
      {/* Coral band — the one full-bleed coral moment in the flow. */}
      <Hero
        eyebrow="Paid"
        title="Order confirmed"
        subtitle="We're firing up the grill."
        image={require('../../../assets/ui/hero-confirmation.png')}
        tone="coral"
        height={200}
      />

      <YStack flex={1} justify="center" items="center" gap={20} p={16}>
        <YStack items="center" gap={4}>
          <Body small tone="soft" letterSpacing={1.5}>
            TOTAL
          </Body>
          <Display testID="order-total" size="lg">
            {formatPrice(total)}
          </Display>
        </YStack>

        <YStack items="center" gap={6}>
          <Badge>Order {orderId}</Badge>
        </YStack>
      </YStack>

      <YStack p={16} pb={28}>
        <PrimaryButton onPress={() => navigation.popToTop()}>Back to menu</PrimaryButton>
      </YStack>
    </Screen>
  )
}
