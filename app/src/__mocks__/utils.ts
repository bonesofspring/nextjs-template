import { HttpResponse } from 'msw'

export const getResponseWithCode = (code: number) =>
  HttpResponse.json('', {
    status: code,
  })
