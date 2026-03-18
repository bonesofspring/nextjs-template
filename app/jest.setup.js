import '@testing-library/jest-dom'
import 'isomorphic-fetch'
import { TextDecoder, TextEncoder } from 'util'
import { BroadcastChannel } from 'worker_threads'

import { ReadableStream, TransformStream, WritableStream } from 'web-streams-polyfill'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.ReadableStream = ReadableStream
global.TransformStream = TransformStream
global.WritableStream = WritableStream
global.BroadcastChannel = BroadcastChannel

if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  class MockIntersectionObserver {
    observe() {}

    unobserve() {}

    disconnect() {}

    takeRecords() {
      return []
    }
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  })

  Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  })
}
