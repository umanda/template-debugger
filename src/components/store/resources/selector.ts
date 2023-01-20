import { RootState } from "../store"

export const selectResourceImages = (state: RootState) => state.editor.resourcesImages
export const selectResourceShapes = (state: RootState) => state.editor.resourcesShapes
export const selectUploads = (state: RootState) => state.editor.uploads.uploads
