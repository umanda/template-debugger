import { createReducer } from "@reduxjs/toolkit"
import {
  clearResourceUpload,
  closeUploading,
  deleteResource,
  setListFavoriteResources,
  setMakeFavoriteResource,
  setResourcesImages,
  setResourcesShapes,
  setUploading,
  setUploads
} from "./action"
import lodash from "lodash"
import { interfaceUploads, IResource, Uploading } from "../../interfaces/editor"

interface ResourcesImagesState {
  resources: IResource[]
  favorited: IResource[]
}

const initialImagesState: ResourcesImagesState = {
  resources: [],
  favorited: []
}

export const resourcesImagesReducer = createReducer(initialImagesState, (builder) => {
  builder.addCase(setResourcesImages, (state, { payload }) => {
    state.resources = state.resources.concat(payload)
  })
  builder.addCase(setListFavoriteResources, (state, { payload }) => {
    state.favorited = state.favorited.concat(payload)
  })
  builder.addCase(setMakeFavoriteResource, (state, { payload }) => {
    if (state.favorited.find((obj) => obj.id === payload.id)) {
      state.favorited = state.favorited.filter((obj) => obj.id !== payload.id)
    } else {
      state.favorited = state.favorited.concat(payload)
    }
  })
})

interface ResourcesShapesState {
  resources: IResource[]
}

const initialShapesState: ResourcesShapesState = {
  resources: []
}

export const resourcesShapeReducer = createReducer(initialShapesState, (builder) => {
  builder.addCase(setResourcesShapes, (state, { payload }) => {
    state.resources = state.resources?.concat(payload)
  })
})
export interface UploadsState {
  uploads: interfaceUploads[]
  uploading: Uploading | null
}

const initialState: UploadsState = {
  uploads: [],
  uploading: null
}

export const uploadsReducer = createReducer(initialState, (builder) => {
  builder.addCase(setUploads, (state, { payload }) => {
    state.uploads = lodash.uniqBy(state.uploads.concat(payload), "id")
  })
  builder.addCase(setUploading, (state, { payload }) => {
    state.uploading = payload
  })
  builder.addCase(closeUploading, (state) => {
    state.uploading = null
  })
  builder.addCase(deleteResource, (state, { payload }) => {
    state.uploads = state.uploads.filter((e) => e.id !== payload.id)
  })
  builder.addCase(clearResourceUpload, (state, { payload }) => {
    state.uploads = payload
  })
})
