import { IFrame, IScene } from "@layerhub-pro/types"

export interface IResource {
  drawifier: {
    name: string
    avatar: string
    id: string
  }
  id: string
  license: string
  name: string
  created_at: string
  url: string
  color: string[]
  updated_at: string
  category: string
  visibility: string
  preview: string
  tags: string[]
}
export interface Uploading {
  status: string
  progress: number
}
export interface ISubscriptionMe {
  subscription: {
    id: string
    plan: string
    amount: number
    startAt: number
    endAt: number
    canceledAt: number
    status: string
  }
}
export interface ICategoryFonts {
  categories: {
    public: string[]
    private: string[]
  }
}

export interface IFont {
  id: string
  family: string
  full_name: string
  style: string
  post_script_name: string
  preview: string
  url: string
  category: string
  status: string
  created_at: number
  language: string
  plan: string
}

export interface Recent {
  id: string
  name: string
  type: string
  url: string
}

export interface IResolveComponent {
  id: string
  name: string
  category: string
  component?: any
  preview: string
}

export interface IUpload {
  id: string
  contentType: string
  folder: string
  name: string
  type: string
  url: string
}

export interface IDesign {
  id: string
  name: string
  frame: IFrame
  type: string
  scenes: IScene[]
  previews: string[]
  metadata: {}
  colors?: string[]
  tags?: string[]
  imported?: boolean
}

export interface IResolveRecommend {
  words: string[]
}

export interface IFont {
  id: string
  family: string
  full_name: string
  style: string
  post_script_name: string
  preview: string
  url: string
  category: string
  status: string
  created_at: number
  language: string
  plan: string
}

export interface interfaceUploads {
  id: string
  name: string
  url: string
  type: string
}

export interface ListRecentDto {
  resources: {
    id: string
    name: string
    type: string
    url: string
    drawifier: {
      name: string
      avatar: any
    }
    last_used_at: number
  }
}

export interface SearchResourceDto {
  page?: number
  limit?: number
  query: {
    ids?: string[]
    drawifier_ids?: any[]
    names?: string[]
    suggested?: string[]
    tags?: string[]
    visibility?: string
    categories?: string[]
    colors?: string[]
    content?: string
    styles?: string[]
    favorited?: boolean
    used?: boolean
    type?: any
    keywords?: string[]
    notIds?: number[]
    is_published?: boolean
    text?: string
  }
  sorts?: string[]
}

export interface IProject {
  id: string
  description: string
  name: string
  size: number
  created_at: number
  updated_at: number
  scenes: IScene[]
  previews: any[]
}

export interface SearchTemplateDto {
  page?: number
  limit?: number
  query: {
    ids?: string[]
    drawifier_ids?: string[]
    names?: string[]
    suggested?: string[]
    tags?: string[]
    license?: string
    visibility?: string
    colors?: string[]
    styles?: string[]
    favorited?: boolean
    used?: boolean
    resource_ids?: string[]
    plans?: string[]
    is_published?: boolean
    keywords?: string[]
  }
  sorts?: string[]
}

export interface ISearchRecommend {
  index: string
  categories?: string[]
  words: string[]
}

export interface querySearchUpload {
  page?: number
  limit?: number
  query: {
    ids?: string[]
    names?: string[]
    types?: string[]
    used?: boolean
    favorite?: boolean
  }
}

export interface ICreateComponent {
  id: string
  name: string
  category: string
  types: string[]
  component: any
}
