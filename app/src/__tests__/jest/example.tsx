import { waitFor } from '@testing-library/react'
import { useRouter } from 'next/router'

import { initServerMocks } from '@/__mocks__/server'
import { renderWithProviders } from '@/lib/utils/tests'
import { store } from '@/store'
import { Footer } from '@/ui/layouts/_shared/components/Footer'

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

// @ts-ignore
useRouter.mockReturnValue({
  query: {},
  push: () => {},
})

it('renders footer successfully', async () => {
  await initServerMocks()
  const { container } = renderWithProviders(<Footer />, { store })

  await waitFor(() => {
    expect(container).toBeInTheDocument()
  })
})
