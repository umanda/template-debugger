import { RootState } from "../store"

export const selectColors = (state: RootState) => state.editor.colors
