import { createReducer } from "@reduxjs/toolkit"
import { setUpdateProject } from "./action"

interface projectInterface {
  project: any
}

const initialState: projectInterface = {
  project: null
}

export const projectReducer = createReducer(initialState, (builder) => {
  builder.addCase(setUpdateProject, (state, { payload }) => {
    state.project = payload
  })
})
