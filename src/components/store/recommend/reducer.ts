import { createReducer } from "@reduxjs/toolkit"
import { IResolveRecommend } from "../../interfaces/editor"
import { setListResourceRecommend, setListTemplateRecomend } from "./action"

interface listRecommendInterface {
  resource: IResolveRecommend
  template: IResolveRecommend
}

const listRecommendInitialState: listRecommendInterface = {
  resource: { words: [] },
  template: { words: [] }
}

export const listRecomendReducer = createReducer(listRecommendInitialState, (builder) => {
  builder.addCase(setListResourceRecommend, (state, { payload }) => {
    state.resource = payload
  })
  builder.addCase(setListTemplateRecomend, (state, { payload }) => {
    state.template = payload
  })
})
