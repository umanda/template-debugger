import { RootState } from "../store"

export const selectUser = (state: RootState) => state.user.user
export const selectListDrawifiers = (state: RootState) => state.editor.userDrawifiers.listDrawifier
