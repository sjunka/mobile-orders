import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ScrollView, Spinner, XStack, YStack } from 'tamagui'

import { Badge, Body, Card, Display, PrimaryButton, Screen, SecondaryButton } from '../../components/ui'
import { cancelOrder, listOrders } from '../../services/order'
import type { Menu } from '../../types/menu'
import type { OperatorOrder, OrderLineRequest } from '../../types/order'
import { formatPrice } from '../../utils/price'
import { useMenu } from '../menu/useMenu'

/**
 * The operator's list of every order. Unauthenticated and reachable by any
 * guest — see `back/docs/adr/0003`.
 */
export function OrdersScreen() {
  const { data: menu } = useMenu()
  const {
    data: orders,
    isPending,
    isError,
    refetch,
  } = useQuery({ queryKey: ['orders'], queryFn: listOrders })

  if (isPending) {
    return (
      <Screen items="center" justify="center">
        <Spinner size="large" color="$coral" accessibilityLabel="Loading orders" />
      </Screen>
    )
  }

  if (isError) {
    return (
      <Screen items="center" justify="center" gap="$4" p="$4">
        <Display size="sm">Couldn't load the orders.</Display>
        <PrimaryButton onPress={() => refetch()}>Try again</PrimaryButton>
      </Screen>
    )
  }

  if (orders.length === 0) {
    return (
      <Screen items="center" justify="center" p="$4">
        <Display size="sm">No orders yet.</Display>
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView flex={1} contentContainerStyle={{ pb: 32 }}>
        <YStack gap={12} p={16}>
          {orders.map((order) => (
            <OrderRow key={order.orderId} order={order} menu={menu} />
          ))}
        </YStack>
      </ScrollView>
    </Screen>
  )
}

function OrderRow({ order, menu }: { order: OperatorOrder; menu?: Menu }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const cancel = useMutation({
    mutationFn: () => cancelOrder(order.orderId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  })
  const cancelled = order.status === 'cancelled'

  return (
    <Card
      opacity={cancelled ? 0.5 : 1}
      pressStyle={{ bg: '$surfaceCreamStrong' }}
      onPress={() => setOpen(!open)}
      accessibilityRole="button"
      accessibilityLabel={`Order ${order.orderId} for ${order.guest.name}`}
    >
      <XStack justify="space-between" items="center" gap={12}>
        <Display size="sm" flex={1}>
          {order.guest.name}
        </Display>
        <Body strong>{formatPrice(order.total)}</Body>
      </XStack>

      <XStack items="center" gap={8}>
        <Body small tone="muted" flex={1}>
          {order.orderId}
        </Body>
        <Badge>{order.status}</Badge>
        {/* Immediate — no confirmation dialog. Cancelling is one-way. */}
        {!cancelled && (
          <SecondaryButton
            size="$2"
            onPress={(event) => {
              event.stopPropagation()
              cancel.mutate()
            }}
          >
            Cancel
          </SecondaryButton>
        )}
      </XStack>

      {open && (
        <YStack gap={4} mt={8}>
          {/* Index key: a placed order's lines never reorder, and carry no id. */}
          {order.lines.map((line, index) => (
            <Body key={index} small>
              {describeLine(line, menu)}
            </Body>
          ))}
        </YStack>
      )}
    </Card>
  )
}

/** Order lines are references only, so the menu is what turns them into words. */
function describeLine(line: OrderLineRequest, menu?: Menu): string {
  const product = menu?.find((candidate) => candidate.id === line.productId)
  const modifiers = line.modifierIds.map(
    (id) => product?.modifiers.find((m) => m.id === id)?.label ?? id,
  )
  const name = product?.name ?? line.productId

  return `${line.quantity} × ${name}${modifiers.length ? ` — ${modifiers.join(', ')}` : ''}`
}
