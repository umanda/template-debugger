import React from "react"
import * as api from "../services/api"

export function useTokenInterceptor() {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const token = localStorage.getItem("token")

  React.useEffect(() => {
    if (!isLoaded) {
      setIsLoaded(true)
    }
    const authInterceptor = api.base.interceptors.request.use((r) => {
      r.headers["Authorization"] = `Bearer ${token!==null ? token : "drawify"}`
      return r
    })
    return () => {
      api.base.interceptors.request.eject(authInterceptor)
    }
  }, [])
  return isLoaded
}
