import { combineReducers } from "@reduxjs/toolkit"
import { PersistConfig } from "redux-persist"
import persistReducer from "redux-persist/es/persistReducer"
import { colorReducer } from "./colors/reducer"
import { categoryFontsReducer, fontsReducer, listUseFontsReducer } from "./fonts/reducer"
import { listRecomendReducer } from "./recommend/reducer"
import {
  listResourceCompositeReducer,
  resourcesImagesReducer,
  resourcesShapeReducer,
  uploadsReducer
} from "./resources/reducer"
import { listTemplateReducer } from "./templates/reducer"
import { listDrawifiersReducer, userReducer, UserState } from "./user/reducer"
import storage from "redux-persist/lib/storage"

const usersPersistConfig: PersistConfig<UserState> = {
  key: "user",
  storage
}

const rootReducer = combineReducers({
  user: persistReducer(usersPersistConfig, userReducer),
  editor: combineReducers({
    listRecommend: listRecomendReducer,
    listTemplates: listTemplateReducer,
    uploads: uploadsReducer,
    fonts: fontsReducer,
    resourcesComposite: listResourceCompositeReducer,
    categoryFonts: categoryFontsReducer,
    useFonts: listUseFontsReducer,
    resourcesShapes: resourcesShapeReducer,
    userDrawifiers: listDrawifiersReducer,
    resourcesImages: resourcesImagesReducer,
    colors: colorReducer
  })
})
export default rootReducer
