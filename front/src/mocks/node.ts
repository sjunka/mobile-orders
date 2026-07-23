// MSW server for Jest (Node). Tests drive real screens; requests hit these handlers.
import { setupServer } from 'msw/node'

import { handlers } from './handlers'

export const server = setupServer(...handlers)
