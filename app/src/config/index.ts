import process from 'process'

export const IS_API_MOCKING_ENABLED = process.env.NEXT_PUBLIC_IS_API_MOCKING_ENABLED === '1'
