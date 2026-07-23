import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Button, Text, YStack } from 'tamagui'

import type { RootStackParamList } from '../../navigation/types'
import { formatPrice } from '../../utils/price'

type Props = NativeStackScreenProps<RootStackParamList, 'Confirmation'>

export function ConfirmationScreen({ route, navigation }: Props) {
  const { orderId, total } = route.params

  return (
    <YStack flex={1} items="center" justify="center" gap="$3" p="$4">
      <Text fontSize="$8" fontWeight="600">
        Order confirmed
      </Text>
      <Text color="$color10">{orderId}</Text>
      <Text testID="order-total" fontSize="$6">
        {formatPrice(total)}
      </Text>
      <Button onPress={() => navigation.popToTop()}>Back to menu</Button>
    </YStack>
  )
}
