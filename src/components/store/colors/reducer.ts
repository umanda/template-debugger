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
    if (state.color.length <= 5) {
      const resolve = [payload].concat(state.color)
      const dataArr = new Set(resolve)
      state.color = [...dataArr]
    } else {
      const resolve = [payload].concat(state.color.filter((c, index) => index <= 6))
      const dataArr = new Set(resolve)
      state.color = [...dataArr]
    }
  })
})
