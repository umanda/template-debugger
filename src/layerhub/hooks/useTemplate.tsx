import React from "react"
import { Context } from "../context"

export function useTemplate() {
  const { template } = React.useContext(Context)

  return template
}
