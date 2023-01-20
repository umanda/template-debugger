import { RootState } from "../store"

export const selectFonts = (state: RootState) => state.editor.fonts.fonts
export const selectListUseFonts = (state: RootState) => state.editor.useFonts.fonts
export const selectCategoryFonts = (state: RootState) => state.editor.categoryFonts.fonts
