import { RootState } from "../store"

export const selectListRecommendResource = (state: RootState) => state.editor.listRecommend.resource
export const selectListRecommendTemplate = (state: RootState) => state.editor.listRecommend.template
