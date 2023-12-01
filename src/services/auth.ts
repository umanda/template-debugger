import axios from "axios"

const API_URL = import.meta.env.VITE_API_CONNECTION

export const register = (username: string, email: string, password: string) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password
  })
}

export const login = (email: string, password: string) => {
  let data = {
    user: {},
    token: null,
    status: null,
    error: false,
    message: null
  }

  return axios
    .post(API_URL + "/signin", {
      email,
      password
    })
    .then((response) => {
      if (response.data.customer) {
        data.user = response.data.customer
        data.token = response.data.customer.token
        data.status = 200
        return data
      }
    })
    .catch(function (error) {
      data.message = error?.response?.data?.message
      data.status = error?.response?.status
      data.error = true
      return data
    })
}

export const logout = () => {
  localStorage.removeItem("user")
  localStorage.removeItem("token")
}

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user")
  if (userStr) return JSON.parse(userStr)
  return null
}

export const whitelist = (email: string, password: string) => {
  return axios.post(API_URL + "/signup", {
    email,
    password
  })
}

export default function authHeader() {
  const userStr = localStorage.getItem("user")
  let user = null
  if (userStr) user = JSON.parse(userStr)

  if (user && user.accessToken) {
    return { Authorization: "Bearer " + user.accessToken } // for Spring Boot back-end
    // return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
  } else {
    return { Authorization: "" } // for Spring Boot back-end
    // return { 'x-access-token': null }; // for Node Express back-end
  }
}
