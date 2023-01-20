import { combineReducers } from "@reduxjs/toolkit"
import { colorReducer } from "./colors/reducer"
import { categoryFontsReducer, fontsReducer, listUseFontsReducer } from "./fonts/reducer"
import { listRecomendReducer } from "./recommend/reducer"
import { resourcesImagesReducer, resourcesShapeReducer, uploadsReducer } from "./resources/reducer"
import { listTemplateReducer } from "./templates/reducer"
import { listDrawifiersReducer, userReducer } from "./user/reducer"

const rootReducer = combineReducers({
  user: userReducer,
  editor: combineReducers({
    listRecommend: listRecomendReducer,
    listTemplates: listTemplateReducer,
    uploads: uploadsReducer,
    fonts: fontsReducer,
    categoryFonts: categoryFontsReducer,
    useFonts: listUseFontsReducer,
    resourcesShapes: resourcesShapeReducer,
    userDrawifiers: listDrawifiersReducer,
    resourcesImages: resourcesImagesReducer,
    colors: colorReducer
  })
})
export default rootReducer
