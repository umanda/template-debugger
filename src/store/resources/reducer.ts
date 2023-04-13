import { createReducer } from "@reduxjs/toolkit"
import {
  addResourceComposite,
  addUpload,
  clearResourceComposite,
  clearResourceUpload,
  closeUploading,
  deleteResource,
  setIdDeleteResourceComposite,
  setListFavoriteResources,
  setListResourceComposite,
  setMakeFavoriteResource,
  setResourcesImages,
  setResourcesShapes,
  setUploading,
  setUploads
} from "./action"
import lodash from "lodash"
import { interfaceUploads, IResolveComponent, IResource, Uploading } from "../../interfaces/editor"

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
  builder.addCase(addUpload, (state, { payload }) => {
    state.uploads = payload.concat(state.uploads)
  })
})
interface ListResourceComposite {
  resources: IResolveComponent[]
}

const initialListResourceComposite: ListResourceComposite = {
  resources: []
}

export const listResourceCompositeReducer = createReducer(initialListResourceComposite, (builder) => {
  builder.addCase(setListResourceComposite, (state, { payload }) => {
    state.resources = lodash.uniqBy(state.resources.concat(payload), "id")
  })
  builder.addCase(addResourceComposite, (state, { payload }) => {
    state.resources = state.resources.concat(payload)
  })
  builder.addCase(setIdDeleteResourceComposite, (state, { payload }) => {
    state.resources = state.resources?.filter((e) => e.id !== payload)
  })
  builder.addCase(clearResourceComposite, (state, { payload }) => {
    state.resources = payload
  })
})
