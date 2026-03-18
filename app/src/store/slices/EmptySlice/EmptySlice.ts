import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  someProp: null,
}

type TState = typeof initialState

interface IRootState {
  emptySlice: TState
}

export const emptySlice = createSlice({
  name: 'emptySlice',
  initialState,
  reducers: {},
})

export const somePropSelector = (state: IRootState) => state.emptySlice.someProp
