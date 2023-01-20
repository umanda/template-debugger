import { createReducer } from "@reduxjs/toolkit"
import { setRecentColor } from "./action"

export interface colorState {
  color: string[]
}

const initialState: colorState = {
  color: ["#9EA6A8"]
}

export const colorReducer = createReducer(initialState, (builder) => {
  builder.addCase(setRecentColor, (state, { payload }) => {
    if (state.color.length <= 6) {
      state.color = [payload].concat(state.color)
    } else {
      state.color = [payload].concat(state.color.filter((c, index) => index <= 5))
    }
  })
})
