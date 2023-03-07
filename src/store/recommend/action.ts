import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import { IResolveRecommend, ISearchRecommend } from "../../interfaces/editor"
import * as api from "../../services/api"

export const setListResourceRecommend = createAction<IResolveRecommend>("resources/setListResourceRecommend")
export const setListTemplateRecomend = createAction<IResolveRecommend>("resources/setListTemplateRecomend")

export const getListRecommend = createAsyncThunk<void, ISearchRecommend, any>(
  "resource/getListRecommend",
  async (args, { dispatch, rejectWithValue }) => {
    try {
      const resolve: any = await api.getListRecommend(args)
      args.index === "RESOURCE"
        ? dispatch(setListResourceRecommend(resolve))
        : dispatch(setListTemplateRecomend(resolve))
      return resolve
    } catch (err) {
      rejectWithValue(err)
    }
  }
)
