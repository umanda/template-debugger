import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import { IDrawifier, ISearchDrawifier, SigninDto, SignupDto, User } from "../../interfaces/user"
import * as api from "../../services/api"
import { clearResourceComposite, clearResourceUpload } from "../resources/action"

export const setUser = createAction<User>("user/setUser")
export const removeUser = createAction<void>("user/setremoveUser")
export const setUpdateProfile = createAction<Partial<User>>("user/setupdateProfile")
export const setListDrawifiers = createAction<IDrawifier[]>("drawifier/setListDrawifiers")
export const setReduceFreeRequest = createAction<number>("user/setReduceFreeRequest")

export const signInByToken = createAsyncThunk<any, string, { rejectValue: boolean }>(
  "user/signInByToken",
  async (args, { dispatch, rejectWithValue }) => {
    try {
      const user: any = await api.signInByToken(args)
      dispatch(setUser({ ...user, token: args }))
      return user
    } catch (err: any) {
      return err
    }
  }
)

export const signin = createAsyncThunk<any, SigninDto, { rejectValue: boolean }>(
  "user/signin",
  async (args, { dispatch, rejectWithValue }) => {
    try {
      const user: any = await api.signin(args)
      dispatch(setUser({ ...user, email: args.email }))
      //const me = await api.userMe()
      //dispatch(setUser({ ...user, ...me }))
      //const plan = api.getsubscriptionMe()
      return user
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const signup = createAsyncThunk<any, SignupDto, { rejectValue: boolean }>(
  "user/signup",
  async (args, { dispatch, rejectWithValue }) => {
    try {
      await api.signup(args)
      const signIn: SigninDto = { email: args.email, password: args.password }
      const user: any = await api.signin(signIn)
      dispatch(setUser(user))
      return true
    } catch (error) {
      return rejectWithValue(false)
    }
  }
)

export const getListDrawifiers = createAsyncThunk<void, Partial<ISearchDrawifier>, any>(
  "drawifier/getListDrawifiers",
  async (args, { dispatch }) => {
    try {
      const listDrawifiers: any = await api.listDrawifier(args)
      dispatch(setListDrawifiers(listDrawifiers))
      return listDrawifiers
    } catch (err) {
      null
    }
  }
)

export const logout = createAsyncThunk<any, void, { rejectValue: boolean }>(
  "user/logout",
  async (_, { dispatch, rejectWithValue }) => {
    localStorage.setItem("token", "")
    try {
      dispatch(removeUser())
      dispatch(clearResourceComposite([]))
      dispatch(clearResourceUpload([]))
      return true
    } catch (error: any) {
      return rejectWithValue(false)
    }
  }
)

export const reduceFreeRequest = createAsyncThunk<any, number, { rejectValue: boolean }>(
  "user/freeRequest",
  async (count, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setReduceFreeRequest(count))
      return true
    } catch (error: any) {
      return rejectWithValue(false)
    }
  }
)


// For app

export const signOut = createAsyncThunk<any, void, { rejectValue: boolean }>(
  "user/signOut",
  async (_, { dispatch, rejectWithValue }) => {
    localStorage.setItem("token", "")
    try {
      dispatch(removeUser())
      return true
    } catch (error: any) {
      return rejectWithValue(false)
    }
  }
)