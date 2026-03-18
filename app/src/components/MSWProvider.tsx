'use client'

import { type ReactNode, use } from 'react'

const mockingEnabledPromise =
  process.env.NEXT_PUBLIC_IS_API_MOCKING_ENABLED === '1' && typeof window !== 'undefined'
    ? import('../__mocks__').then((msw) => msw.initBrowserMocks())
    : Promise.resolve()

export const MSWProvider = ({ children }: { children: ReactNode }) => {
  use(mockingEnabledPromise)

  return children
}
