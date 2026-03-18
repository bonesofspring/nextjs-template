import { render } from '@testing-library/react'
import { Provider } from 'react-redux'

import type { ReactNode, ReactElement } from 'react'

import { store } from '@/store'

interface IWrapperProps {
  children: ReactNode
}

export const renderWithProviders = (ui: ReactElement, { ...renderOptions }) => {
  const Wrapper = ({ children }: IWrapperProps) => <Provider store={store}>{children}</Provider>

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
