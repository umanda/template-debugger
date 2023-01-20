import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import * as api from "../../services/api"
import { IProject } from "../../interfaces/editor"

export const setUpdateProject = createAction<IProject>("projects/setUpdateProject")

export const updateProject = createAsyncThunk<any, any, { rejectValue: void }>(
  "projects/updateProject",
  async (args, { dispatch, rejectWithValue }) => {
    try {
      const project = await api.updateProject(args)
      dispatch(setUpdateProject(project))
      return project
    } catch (error) {}
  }
)
