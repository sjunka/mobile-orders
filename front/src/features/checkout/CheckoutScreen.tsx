import { zodResolver } from '@hookform/resolvers/zod'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm, type Control } from 'react-hook-form'
import { Input, ScrollView, XStack, YStack } from 'tamagui'
import { z } from 'zod'

import { Body, Card, Display, Hero, PrimaryButton, Screen } from '../../components/ui'
import { checkoutDefaults } from '../../mocks/guest'
import type { RootStackParamList } from '../../navigation/types'
import { createOrder, toOrderLines } from '../../services/order'
import { useCart } from '../../store/cart'
import { cartTotal, formatPrice } from '../../utils/price'

const schema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.email('Enter a valid email.'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Enter a 16-digit card number.'),
})

type Fields = z.infer<typeof schema>

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>

export function CheckoutScreen({ navigation }: Props) {
  const lines = useCart((s) => s.lines)
  const clear = useCart((s) => s.clear)
  // For the button only. The charged total is the server's — see back ADR-0002.
  const total = cartTotal(lines)

  const queryClient = useQueryClient()

  const { control, handleSubmit } = useForm<Fields>({
    resolver: zodResolver(schema),
    defaultValues: checkoutDefaults(),
  })

  const checkout = useMutation({
    mutationFn: (fields: Fields) => createOrder({ ...fields, lines: toOrderLines(lines) }),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] }) // the new order belongs in the operator list
      // Replace, so the back gesture can't land on a checkout for a paid order.
      navigation.replace('Confirmation', order)
      clear() // after the swap, or Checkout re-renders as "Pay $0.00" first
    },
  })

  return (
    <Screen>
      <ScrollView flex={1} contentContainerStyle={{ pb: 20 }}>
        <Hero
          eyebrow="Last step"
          title="Almost there"
          subtitle="Where should we send the receipt?"
          image={require('../../../assets/ui/hero-checkout.png')}
          height={170}
        />

        <Card gap={16} p={20} m={16}>
          <Field control={control} name="name" label="Name" autoComplete="name" />
          <Field
            control={control}
            name="email"
            label="Email"
            autoComplete="email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Field
            control={control}
            name="cardNumber"
            label="Card number"
            autoComplete="cc-number"
            keyboardType="number-pad"
          />
        </Card>

        {checkout.isError && (
          <Body tone="error" px={16}>
            {checkout.error.message}
          </Body>
        )}
      </ScrollView>

      <YStack p={16} pb={28} gap={12} borderTopWidth={1} borderColor="$hairline" bg="$canvas">
        <XStack justify="space-between" items="center">
          <Body tone="muted">Total</Body>
          <Display size="md">{formatPrice(total)}</Display>
        </XStack>
        <PrimaryButton
          disabled={checkout.isPending}
          onPress={handleSubmit((fields) => checkout.mutate(fields))}
        >
          {`Pay ${formatPrice(total)}`}
        </PrimaryButton>
      </YStack>
    </Screen>
  )
}

type FieldProps = {
  control: Control<Fields>
  name: keyof Fields
  label: string
} & Pick<React.ComponentProps<typeof Input>, 'autoComplete' | 'keyboardType' | 'autoCapitalize'>

function Field({ control, name, label, ...inputProps }: FieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <YStack gap={6}>
          <Body small strong>
            {label}
          </Body>
          <Input
            accessibilityLabel={label}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            bg="$canvas"
            color="$ink"
            height={44}
            rounded={8}
            borderWidth={1}
            borderColor={fieldState.error ? '$error' : '$hairline'}
            focusStyle={{ borderColor: '$coral' }}
            {...inputProps}
          />
          {fieldState.error && (
            <Body small tone="error">
              {fieldState.error.message}
            </Body>
          )}
        </YStack>
      )}
    />
  )
}
