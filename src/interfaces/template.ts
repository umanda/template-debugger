import { IDesign } from "@layerhub-pro/types"

export interface IShareTemplateDTO {
  type: string
  image: string
  email?: string
}

export interface IExportProjectNoLogin {
  type: string
  payload: IDesign
}

export interface listProjectsDTO {
  page: number
  limit: number
  query: {
    ids: string
    imported: boolean
    names: string
  }
}

export interface ShareTemplate {
  type: string
  image: string | undefined
  email: string
}

export interface IGetPreview{
  has_preview:boolean
  url:string
}