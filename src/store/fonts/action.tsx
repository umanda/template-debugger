import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import { ICategoryFonts, IFont } from "../../interfaces/editor"
import * as api from "../../services/api"

export const setFonts = createAction<IFont[]>("fonts/setFonts")
export const setListUseFonts = createAction<IFont[]>("fonts/setUseFonts")
export const setUseFont = createAction<IFont>("fonts/setUseFont")
export const setCategoryFonts = createAction<ICategoryFonts>("fonts/setCategoryFonts")

export const getFonts = createAsyncThunk<void, never, any>(
  "fonts/getFonts",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const fonts = await api.getFonts()
      dispatch(setFonts(fonts))
    } catch (err) {
      rejectWithValue(err)
    }
  }
)
export const getListUseFonts = createAsyncThunk<void, never, any>(
  "fonts/getUseFonts",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const fonts: any = await api.getListUseFonts()
      dispatch(setListUseFonts(fonts))
      return fonts
    } catch (err) {
      rejectWithValue(err)
    }
  }
)

export const getUseFont = createAsyncThunk<void, IFont, any>(
  "fonts/getUseFont",
  async (font, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setUseFont(font))
      await api.getUseFont(font.id)
    } catch (err) {
      rejectWithValue(err)
    }
  }
)

export const getCategoryFonts = createAsyncThunk<void, never, any>(
  "fonts/getUseFont",
  async (font, { dispatch, rejectWithValue }) => {
    try {
      const resolve = await api.getCategoryFonts()
      dispatch(setCategoryFonts(resolve))
      return resolve
    } catch (err) {
      rejectWithValue(err)
    }
  }
)
