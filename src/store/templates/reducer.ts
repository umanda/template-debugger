import { IDesign } from "@layerhub-pro/types"
import { createReducer } from "@reduxjs/toolkit"
import { setListFavoriteTemplates, setListTemplates, setMakeFavoriteTemplate } from "./action"

export interface TemplateState {
  template: IDesign[]
  favorited: IDesign[]
}

const initialStateTemplate: TemplateState = {
  template: [],
  favorited: []
}

export const listTemplateReducer = createReducer(initialStateTemplate, (builder) => {
  builder.addCase(setListTemplates, (state, { payload }) => {
    state.template = state.template.concat(payload)
  })
  builder.addCase(setListFavoriteTemplates, (state, { payload }) => {
    state.favorited = state.favorited.concat(payload)
  })
  //setMakeFavoriteTemplate
  builder.addCase(setMakeFavoriteTemplate, (state, { payload }) => {
    if (state.favorited.find((obj) => obj.id === payload.id)) {
      state.favorited = state.favorited.filter((obj) => obj.id !== payload.id)
    } else {
      state.favorited = state.favorited.concat(payload)
    }
  })
})
