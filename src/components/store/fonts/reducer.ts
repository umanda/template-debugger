import { createReducer } from "@reduxjs/toolkit"
import { ICategoryFonts, IFont } from "../../interfaces/editor"
import { setCategoryFonts, setFonts, setListUseFonts, setUseFont } from "./action"

export interface FontsState {
  fonts: IFont[]
}

const initialState: FontsState = {
  fonts: []
}

export const fontsReducer = createReducer(initialState, (builder) => {
  builder.addCase(setFonts, (state, { payload }) => {
    state.fonts = payload
  })
})

export const listUseFontsReducer = createReducer(initialState, (builder) => {
  builder.addCase(setListUseFonts, (state, { payload }) => {
    state.fonts = payload
  })
  builder.addCase(setUseFont, (state, { payload }) => {
    state.fonts = state.fonts.concat(payload)
  })
})

export interface CategoryFontsState {
  fonts: ICategoryFonts | null
}

const CategoryFontsState: CategoryFontsState = {
  fonts: null
}

export const categoryFontsReducer = createReducer(CategoryFontsState, (builder) => {
  builder.addCase(setCategoryFonts, (state, { payload }) => {
    state.fonts = payload
  })
})
