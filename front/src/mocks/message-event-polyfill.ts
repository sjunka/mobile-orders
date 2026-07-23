// msw's WebSocket interceptor reaches for MessageEvent and BroadcastChannel the
// moment it loads, and Hermes has neither. The app only mocks HTTP, so stubs that
// construct without throwing are enough to get past the import.
type MessageEventInit = { data?: unknown; origin?: string; lastEventId?: string }

class EventStub {
  readonly type: string
  constructor(type: string) {
    this.type = type
  }
  preventDefault() {}
  stopPropagation() {}
  stopImmediatePropagation() {}
}

const g = globalThis as Record<string, unknown>

if (typeof g.MessageEvent === 'undefined') {
  const Base = (g.Event ?? EventStub) as typeof EventStub
  g.MessageEvent = class MessageEvent extends Base {
    readonly data: unknown
    readonly origin: string
    readonly lastEventId: string
    constructor(type: string, init: MessageEventInit = {}) {
      super(type)
      this.data = init.data ?? null
      this.origin = init.origin ?? ''
      this.lastEventId = init.lastEventId ?? ''
    }
  }
}

if (typeof g.BroadcastChannel === 'undefined') {
  g.BroadcastChannel = class BroadcastChannel {
    readonly name: string
    onmessage: unknown = null
    constructor(name: string) {
      this.name = name
    }
    postMessage() {}
    addEventListener() {}
    removeEventListener() {}
    close() {}
  }
}
