import React from "react"
import { DesignEditorContext } from "../contexts/DesignEditor"

export default function uselsOpenPreview() {
  const { isOpenPreview, onClosePreview, onOpenPreview, switchPage, setSwitchPage } =
    React.useContext(DesignEditorContext)
  return { isOpenPreview, onClosePreview, onOpenPreview, switchPage, setSwitchPage }
}
