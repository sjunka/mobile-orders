import { zodResolver } from '@hookform/resolvers/zod'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useMutation } from '@tanstack/react-query'
import { Controller, useForm, type Control } from 'react-hook-form'
import { Button, Input, Separator, Text, YStack } from 'tamagui'
import { z } from 'zod'

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

  const { control, handleSubmit } = useForm<Fields>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', cardNumber: '' },
  })

  const payment = useMutation({
    mutationFn: (fields: Fields) => createOrder({ ...fields, lines: toOrderLines(lines) }),
    onSuccess: (order) => {
      // Replace, so the back gesture can't land on a checkout for a paid order.
      navigation.replace('Confirmation', order)
      clear() // after the swap, or Checkout re-renders as "Pay $0.00" first

    },
  })

  return (
    <YStack flex={1} gap="$4" p="$4">
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

      <Separator />

      {payment.isError && <Text color="$red10">{payment.error.message}</Text>}

      <Button
        theme="accent"
        disabled={payment.isPending}
        onPress={handleSubmit((fields) => payment.mutate(fields))}
      >
        {`Pay ${formatPrice(total)}`}
      </Button>
    </YStack>
  )
}

type FieldProps = {
  control: Control<Fields>
  name: keyof Fields
  label: string
} & Pick<
  React.ComponentProps<typeof Input>,
  'autoComplete' | 'keyboardType' | 'autoCapitalize'
>

function Field({ control, name, label, ...inputProps }: FieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <YStack gap="$2">
          <Text>{label}</Text>
          <Input
            accessibilityLabel={label}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            {...inputProps}
          />
          {fieldState.error && <Text color="$red10">{fieldState.error.message}</Text>}
        </YStack>
      )}
    />
  )
}
