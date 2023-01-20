import { IDesign } from "@layerhub-pro/types"
import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import { SearchTemplateDto } from "../../interfaces/editor"
import * as api from "../../services/api"

export const setListTemplates = createAction<IDesign[]>("templates/setListTemplates")
export const setListFavoriteTemplates = createAction<IDesign[]>("templates/setListFavoriteTemplates")
export const setMakeFavoriteTemplate = createAction<IDesign>("project/setMakeFavoriteTemplate")

export const getListFavoriteTemplates = createAsyncThunk<any, SearchTemplateDto, { rejectValue: void }>(
  "templates/getListFavoriteTemplates",
  async (args, { dispatch, rejectWithValue }) => {
    try {
      const templates: any = await api.getListPublicTemplates(args)
      dispatch(setListFavoriteTemplates(templates))
      return templates
    } catch (error) {}
  }
)

export const getListPublicTemplates = createAsyncThunk<any, SearchTemplateDto, { rejectValue: void }>(
  "templates/getListPublicTemplates",
  async (args, { dispatch, rejectWithValue }) => {
    try {
      const templates: any = await api.getListPublicTemplates(args)
      dispatch(setListTemplates(templates))
      return templates
    } catch (error) {}
  }
)
export const makeFavoriteTemplate = createAsyncThunk<any, IDesign, { rejectValue: void }>(
  "templates/makeFavoriteTemplates",
  async (args, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setMakeFavoriteTemplate(args))
      const templates: any = await api.getLikeTemplate(args.id)
      return true
    } catch (error) {}
  }
)
