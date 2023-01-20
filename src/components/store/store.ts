import { configureStore } from "@reduxjs/toolkit"
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, persistStore } from "redux-persist"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import rootReducer from "./root-reducer"

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
