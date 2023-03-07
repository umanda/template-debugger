import React from "react"
import { Context } from "../context"

export function useIsCropping() {
  const { isCropping } = React.useContext(Context)
  return isCropping
}
