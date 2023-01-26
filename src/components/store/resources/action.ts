import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import * as api from "../../services/api"
import mime from "mime"
import {
  ICreateComponent,
  interfaceUploads,
  IResolveComponent,
  IResource,
  IUpload,
  querySearchUpload,
  SearchResourceDto,
  Uploading
} from "../../interfaces/editor"
import { uniqueFilename } from "../../utils/unique"

export const clearResourceComposite = createAction<[]>("resources/clearResourceComposite")
export const clearResourceUpload = createAction<[]>("uploads/clearResourceUpload")
export const setResourcesImages = createAction<IResource[]>("resources/setResourcesImages")
export const setListFavoriteResources = createAction<IResource[]>("resources/setListFavoriteResources")
export const setMakeFavoriteResource = createAction<IResource>("resources/setMakeFavoriteResource")
export const setResourcesShapes = createAction<IResource[]>("resources/setResourcesShapes")
export const setUploads = createAction<interfaceUploads[]>("uploads/setUploads")
export const setUploading = createAction<Uploading>("uploads/setUploading")
export const closeUploading = createAction("uploads/closeUploading")
export const deleteResource = createAction<IUpload>("uploads/deleteResource")
export const addResourceComposite = createAction<IResolveComponent>("resources/addResourceComposite")
export const setIdDeleteResourceComposite = createAction<string>("resources/setIdDeleteResourceComposite")
export const setListResourceComposite = createAction<IResolveComponent>("resources/setResourceComposite")

export const getFavoritedResources = createAsyncThunk<void, SearchResourceDto, any>(
  "resources/getFavoritedResources",
  async (args, { dispatch }) => {
    try {
      const favorites: any = await api.getListResourcesImages(args)
      dispatch(setListFavoriteResources(favorites))
      return favorites
    } catch (error) {}
  }
)
export const getListResourcesImages = createAsyncThunk<void, SearchResourceDto, any>(
  "resource/getListResourcesImages",
  async (args, { dispatch }) => {
    try {
      const resources: any = await api.getListResourcesImages(args)
      dispatch(setResourcesImages(resources))
      return resources
    } catch (err) {}
  }
)
export const makeFavoriteResource = createAsyncThunk<any, IResource, { rejectValue: void }>(
  "resources/favoriteResource",
  async (args, { dispatch }) => {
    try {
      dispatch(setMakeFavoriteResource(args))
      const resolve = await api.favoriteResource(args.id)
    } catch (error) {}
  }
)

export const getListResourcesShapes = createAsyncThunk<void, Partial<SearchResourceDto>, any>(
  "resource/getListResourcesShapes",
  async (args, { dispatch }) => {
    try {
      const resources: any = await api.resourceSearchShapes(args)
      dispatch(setResourcesShapes(resources))
      return resources
    } catch (err) {}
  }
)

export const getUploads = createAsyncThunk<void, never, { rejectValue: Record<string, string[]> }>(
  "uploads/getUploads",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const uploads = await api.getUploads()
      dispatch(setUploads(uploads))
    } catch (err: any) {
      rejectWithValue(err)
    }
  }
)

export const uploadFile = createAsyncThunk<void, { file: File; nameFile: string }, any>(
  "uploads/uploadFile",
  async (args, { dispatch }) => {
    const file = args.file
    setUploading({
      progress: 0,
      status: "IN_PROGRESS"
    })
    const updatedFileName = uniqueFilename(file.name)
    const updatedFile = new File([file], updatedFileName)
    const response = await api.getSignedURLForUpload({ filename: updatedFileName, operation: "upload" })
    const contentType = mime.getType(updatedFileName) as string
    const typeFile = updatedFileName.split(".")
    const save: any = await api.getSave({ id: typeFile[0], name: args.nameFile, type: typeFile[1], url: response.url })
    dispatch(setUploads([save.image]))
    await axios.put(response.signed_url, updatedFile, {
      headers: { "Content-Type": contentType },
      onUploadProgress: (progressEvent: any) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setUploading({
          progress: percentCompleted,
          status: "IN_PROGRESS"
        })
      }
    })
    dispatch(closeUploading())
    return save.image
  }
)

export const uploadFiles = createAsyncThunk<void, querySearchUpload, any>(
  "uploads/uploadFiles",
  async (args, { dispatch }) => {
    try {
      const resolve: any = dispatch(setUploads(await api.updateUploadFile(args)))
      return resolve
    } catch (err) {
      alert(err)
    }
  }
)

export const deleteUploadFile = createAsyncThunk<void, IUpload, any>(
  "uploads/deleteUploadFile",
  async (args, { dispatch }) => {
    try {
      dispatch(deleteResource(args))
      await api.deleteUploadFile(args.id)
    } catch (err) {
      alert(err)
    }
  }
)

export const createResourceComposite = createAsyncThunk<void, ICreateComponent, any>(
  "resources/createResourceComposite",
  async (props, { dispatch }) => {
    try {
      const resolve: any = await api.createResourceComposite(props)
      dispatch(addResourceComposite(resolve))
      return resolve
    } catch (err) {
      return err
    }
  }
)

export const getListResourcesComposite = createAsyncThunk<void, any, any>(
  "resources/getListResourcesComposite",
  async (props, { dispatch }) => {
    try {
      const resolve: any = await api.listResourceComposite(props)
      dispatch(setListResourceComposite(resolve))
      return resolve
    } catch (err) {
      return []
    }
  }
)

export const deleteResourceComposite = createAsyncThunk<void, string, any>(
  "resources/setDeleteResourceComposite",
  async (props, { dispatch }) => {
    try {
      dispatch(setIdDeleteResourceComposite(props))
      const resolve: any = await api.deleteResourceComposite(props)
      return resolve
    } catch (err) {
      return err
    }
  }
)
