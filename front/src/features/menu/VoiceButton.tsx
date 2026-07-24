import { useState } from 'react'

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

/** Hold-to-talk control: records while held, uploads and adds to cart on release. See ADR-0004. */
export function VoiceButton({ menu }: { menu: Menu }) {
  const [status, setStatus] = useState<Status>('idle')
  const addLine = useCart((s) => s.addLine)

  function handlePressIn() {
    setStatus('recording')
    startRecording().catch(() => setStatus('idle'))
  }

  async function handlePressOut() {
    if (status !== 'recording') return
    setStatus('sending')
    try {
      const uri = await stopRecording()
      const response = await sendUtterance(uri)
      for (const { product, modifiers, quantity } of resolveCartAdditions(response, menu)) {
        addLine(product, modifiers, quantity)
      }
    } catch {
      // Failure handling is ticket #43 — swallow so a bad upload doesn't crash the button.
    } finally {
      setStatus('idle')
    }
  }

  return (
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
  )
}
