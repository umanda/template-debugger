import React from "react"
import { Context } from "../context"

export function useDragMode() {
  const { dragMode } = React.useContext(Context)

  return dragMode
}
