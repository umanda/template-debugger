import { RootState } from "../store"

export const selectProject = (state: RootState) => state.editor.project.project
