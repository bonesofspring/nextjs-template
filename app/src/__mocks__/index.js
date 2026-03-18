import { setupWorker } from 'msw/browser'

import { handlers } from './handlers'

export const initBrowserMocks = async () => {
  const worker = setupWorker(...handlers)
  await worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js',
      options: {
        scope: '/',
      },
    },
    onUnhandledRequest(request, print) {
      if (request.url.includes('/_next/') || request.url.includes('/__nextjs')) {
        return
      }

      print.warning()
    },
  })
}
