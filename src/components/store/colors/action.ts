import { createAction, createAsyncThunk } from "@reduxjs/toolkit"

export const setRecentColor = createAction<any>("color/setRecentColor")

export const getRecentColor = createAsyncThunk<any, string, any>(
  "color/getRecentColor",
  async (args, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setRecentColor(args))
      return true
    } catch (err) {
      rejectWithValue(false)
    }
  }
)
