export interface SigninDto {
  email: string
  password: string
}

export interface SignupDto extends SigninDto {
  first_name: string
  last_name: string
}
export interface User {
  avatar: string
  company_address: string
  country: string
  created_at: number
  first_name: string
  id: string
  last_name: string
  email: string
  following: number
  favorites: number
  downloaded: number
  plan?: string
}
export interface Drawifier extends User {}

export interface IDrawifier {
  id: string
  first_name: string
  last_name: string
  avatar: string
  cover: string
  followers: number
  country: string
}
export interface ISearchDrawifier {
  limit?: number
  page?: number
  query?: { names?: [string]; ids?: [string] }
}
