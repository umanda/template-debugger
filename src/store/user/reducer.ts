import { createReducer } from "@reduxjs/toolkit"
import { Drawifier, IDrawifier, User } from "../../interfaces/user"
import { removeUser, setListDrawifiers, setReduceFreeRequest, setUpdateProfile, setUser } from "./action"

export interface UserState {
  user: User | Drawifier | null
}

const initialState: UserState = {
  user: null
}

export const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(setUser, (state, { payload }) => {
    state.user = payload
  })
  builder.addCase(removeUser, (state) => {
    state.user = null
  })
  builder.addCase(setUpdateProfile, (state, { payload }) => {
    state.user = { ...state.user, ...(payload as Required<User>) }
  }),
    builder.addCase(setReduceFreeRequest, (state, { payload }) => {
      state.user.count_free_requests = payload
      state.user = { ...state.user }
    })
})

interface ListDrawifiersState {
  listDrawifier: IDrawifier[]
}

const listDrawifierInitialState: ListDrawifiersState = {
  listDrawifier: []
}

export const listDrawifiersReducer = createReducer(listDrawifierInitialState, (builder) => {
  builder.addCase(setListDrawifiers, (state, { payload }) => {
    state.listDrawifier = payload
  })
})
