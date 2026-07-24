import { useState } from 'react'
import { YStack } from 'tamagui'

import { Body, Card } from '../../components/ui'
import { startRecording, stopRecording } from '../../services/recorder'
import { resolveCartAdditions, sendUtterance } from '../../services/utterance'
import { useCart } from '../../store/cart'
import type { Menu } from '../../types/menu'

type Status = 'idle' | 'recording' | 'sending'

const label: Record<Status, string> = {
  idle: 'Hold to talk',
  recording: 'Recording…',
  sending: 'Adding to cart…',
}

const PERMISSION_DENIED = 'Microphone permission denied'
// Both mean the press was too short to produce audio — a no-op, not an error.
const NO_AUDIO = new Set(['Not recording', 'Recording produced no file'])

function messageFor(error: unknown): string {
  if (error instanceof Error && error.message.startsWith('Request failed:')) {
    return 'Something went wrong on our end — try again.'
  }
  return "Couldn't reach the server — nothing was ordered."
}

/** Hold-to-talk control: records while held, uploads and adds to cart on release. See ADR-0004. */
export function VoiceButton({ menu }: { menu: Menu }) {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const addLine = useCart((s) => s.addLine)

  function handlePressIn() {
    setStatus('recording')
    startRecording().catch((error: unknown) => {
      setStatus('idle')
      if (error instanceof Error && error.message === PERMISSION_DENIED) {
        setMessage('Voice needs microphone access.')
      } else {
        setMessage(messageFor(error))
      }
    })
  }

  async function handlePressOut() {
    if (status !== 'recording') return
    setStatus('sending')
    try {
      const uri = await stopRecording()
      const response = await sendUtterance(uri)
      const resolved = resolveCartAdditions(response, menu)
      for (const { product, modifiers, quantity } of resolved.additions) {
        addLine(product, modifiers, quantity)
      }
      if (resolved.additions.length === 0 && resolved.unresolved.length === 0) {
        setMessage("Didn't catch that — try speaking again.")
      } else if (resolved.unresolved.length > 0) {
        setMessage(`Couldn't find: ${resolved.unresolved.join(', ')}`)
      } else {
        setMessage(null)
      }
    } catch (error) {
      if (error instanceof Error && NO_AUDIO.has(error.message)) {
        // Press too fast to record anything — silent no-op, no request went out.
      } else {
        setMessage(messageFor(error))
      }
    } finally {
      setStatus('idle')
    }
  }

  return (
    <YStack gap={8}>
      <Card
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel="Hold to talk"
        accessibilityState={{ busy: status !== 'idle' }}
        items="center"
        bg={status === 'recording' ? '$coral' : '$surfaceCard'}
        pressStyle={{ bg: '$coralActive' }}
      >
        <Body strong={status !== 'idle'} color={status === 'recording' ? '$onPrimary' : '$ink'}>
          {label[status]}
        </Body>
      </Card>

      {message != null && <Body color="$muted">{message}</Body>}
    </YStack>
  )
}
