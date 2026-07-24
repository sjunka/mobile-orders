import { Image, Platform, StyleSheet, type ImageSourcePropType } from 'react-native'
import { Button, styled, Text, View, YStack } from 'tamagui'

/** Editorial serif for display headlines — the brand's voice (DESIGN-claude.md). */
const serif = Platform.select({ ios: 'Georgia', default: 'serif' })

/** Display headline: serif, weight 400, negative tracking. Never bold. */
export const Display = styled(Text, {
  fontFamily: serif as never,
  fontWeight: '400',
  color: '$ink',
  variants: {
    size: {
      lg: { fontSize: 34, lineHeight: 38, letterSpacing: -1 },
      md: { fontSize: 26, lineHeight: 31, letterSpacing: -0.5 },
      sm: { fontSize: 21, lineHeight: 25, letterSpacing: -0.3 },
    },
  } as const,
  defaultVariants: { size: 'md' },
})

/** Running text. */
export const Body = styled(Text, {
  color: '$bodyText',
  fontSize: 16,
  lineHeight: 25,
  variants: {
    tone: {
      muted: { color: '$muted' },
      soft: { color: '$mutedSoft' },
      error: { color: '$error' },
    },
    strong: { true: { color: '$ink', fontWeight: '500' } },
    small: { true: { fontSize: 14, lineHeight: 22 } },
  } as const,
})

/** Page floor — cream canvas on every screen. */
export const Screen = styled(YStack, {
  flex: 1,
  bg: '$canvas',
})

/** Cream content card, one step darker than canvas. No shadow — color-block first. */
export const Card = styled(YStack, {
  bg: '$surfaceCard',
  rounded: 12,
  p: 16,
  gap: 6,
})

/** The signature coral CTA. */
export const PrimaryButton = styled(Button, {
  bg: '$coral',
  color: '$onPrimary',
  fontWeight: '500',
  fontSize: 16,
  height: 52,
  rounded: 8,
  borderWidth: 0,
  pressStyle: { bg: '$coralActive' },
  disabledStyle: { bg: '$coralDisabled', opacity: 0.7 },
})

/** Cream button with hairline outline. */
export const SecondaryButton = styled(Button, {
  bg: '$canvas',
  color: '$ink',
  fontWeight: '500',
  borderWidth: 1,
  borderColor: '$hairline',
  rounded: 8,
  pressStyle: { bg: '$surfaceCard' },
})

/** Small pill label. `coral` for the loud variant. */
export const Badge = styled(Text, {
  bg: '$coralSoft',
  color: '$coralActive',
  borderWidth: 1,
  borderColor: '$coral',
  fontSize: 13,
  fontWeight: '500',
  rounded: 9999,
  px: 12,
  py: 4,
  variants: {
    coral: {
      true: {
        bg: '$coral',
        color: '$onPrimary',
        fontSize: 12,
        letterSpacing: 1.5,
      },
    },
  } as const,
})

type HeroProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  image: ImageSourcePropType
  /** `coral` inverts the type for the coral-backed artwork. */
  tone?: 'cream' | 'coral'
  height?: number
}

/**
 * Editorial hero band: illustration on its own cream (or coral) ground, headline
 * underneath on the same ground so the type never fights the art. The art is
 * decorative — screen readers skip it and read the headline instead.
 */
export function Hero({ eyebrow, title, subtitle, image, tone = 'cream', height = 150 }: HeroProps) {
  const onCoral = tone === 'coral'
  return (
    <YStack bg={onCoral ? '$coral' : '$surfaceSoft'} pb={20}>
      <Image
        source={image}
        style={[styles.heroImage, { height }]}
        resizeMode="cover"
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <YStack px={20} gap={4}>
        {eyebrow && (
          <Body
            small
            letterSpacing={1.5}
            // Ink on coral, bold — the eyebrow has to stay readable over the warm ground.
            color={onCoral ? '$ink' : '$mutedSoft'}
            fontWeight={onCoral ? '700' : '400'}
          >
            {eyebrow.toUpperCase()}
          </Body>
        )}
        <Display size="lg" color={onCoral ? '$onPrimary' : '$ink'}>
          {title}
        </Display>
        {subtitle && (
          <Body small color={onCoral ? '$onPrimary' : '$muted'}>
            {subtitle}
          </Body>
        )}
      </YStack>
    </YStack>
  )
}

const styles = StyleSheet.create({ heroImage: { width: '100%' } })

/**
 * Cart glyph drawn from Views — no icon dependency for one icon.
 * Basket + handle + two wheels inside a 24×24 box.
 */
export function CartIcon({ color = '#141413' }: { color?: string }) {
  return (
    <View width={24} height={24} items="center" justify="flex-end" pb={1}>
      <View
        width={11}
        height={7}
        borderWidth={2}
        borderBottomWidth={0}
        borderColor={color as never}
        borderTopLeftRadius={5}
        borderTopRightRadius={5}
        mb={-1}
      />
      <View
        width={19}
        height={11}
        borderWidth={2}
        borderColor={color as never}
        borderBottomLeftRadius={4}
        borderBottomRightRadius={4}
        borderTopLeftRadius={2}
        borderTopRightRadius={2}
      />
      <View flexDirection="row" gap={7} mt={1.5}>
        <View width={3} height={3} rounded={9999} bg={color as never} />
        <View width={3} height={3} rounded={9999} bg={color as never} />
      </View>
    </View>
  )
}
