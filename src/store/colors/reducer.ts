import { createReducer } from "@reduxjs/toolkit"
import { setRecentColor } from "./action"

export interface colorState {
  color: string[]
}

const initialState: colorState = {
  color: []
}

export const colorReducer = createReducer(initialState, (builder) => {
  builder.addCase(setRecentColor, (state, { payload }) => {
    const resolve = [payload].concat(state.color)
    const dataArr = new Set(resolve)
    state.color = [...dataArr].filter((c, index) => index < 14)
  })
})
