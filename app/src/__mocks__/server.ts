import { setupServer } from 'msw/node'

import { handlers } from './handlers'

export const initServerMocks = async () => {
  const server = setupServer(...handlers)
  server.listen()
}
