import axios from "axios"
import { IDrawifier, ISearchDrawifier, SigninDto, SignupDto, User } from "../interfaces/user"
import {
  IDesign,
  IFont,
  interfaceUploads,
  ListRecentDto,
  IResource,
  SearchResourceDto,
  IProject,
  ISearchRecommend,
  SearchTemplateDto,
  querySearchUpload,
  ICreateComponent,
  ISubscriptionMe
} from "../interfaces/editor"
import { IExportProjectNoLogin, listProjectsDTO, ShareTemplate } from "../interfaces/template"
import { IListComments, SaveCommentDTO } from "../interfaces/comment"

const base = axios.create({
  baseURL: "https://backend.drawify.net/v1/",
  withCredentials: true
})

export const signup = (props: SignupDto): Promise<User> => {
  return new Promise((resolve, reject) => {
    base
      .post("/signup", props)
      .then(({ data }: any) => {
        const user = data.user as User
        resolve(user)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

export const signInByToken = (token: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    const bodyParameters = {
      key: "value"
    }
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    base
      .post("/signin/token", bodyParameters, config)
      .then(({ data }: any) => {
        resolve(data.user)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

export const makeMagicLink = (props: string): Promise<{ url: string }> => {
  return new Promise((resolve, reject) => {
    base
      .get(`/projects/${props}/magic-link`)
      .then(({ data }: any) => {
        resolve(data)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

export const getUseFont = (props: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    base
      .put(`/fonts/${props}/use`)
      .then(({ data }: any) => {
        const use = data
        resolve(use)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

export const getCategoryFonts = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    base
      .get(`/fonts/categories`)
      .then(({ data }: any) => {
        resolve(data)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

export const getListRecommend = (props: ISearchRecommend): Promise<any> => {
  return new Promise((resolve, reject) => {
    base
      .post(`/es/recommend`, props)
      .then(({ data }: any) => {
        resolve(data)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

export const getComments = (props: any): Promise<IListComments> => {
  return new Promise((resolve, reject) => {
    base
      .post("/comments/search", props)
      .then(({ data }: any) => {
        resolve(data)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

export const getUseUploads = (props: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    base
      .put(`/uploads/${props}/use`)
      .then(({ data }: any) => {
        resolve(data)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

export const getRecentUploads = (props: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    base
      .post(`/uploads/used`, props)
      .then(({ data }: any) => {
        resolve(data)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

export const getFavouritesUploads = (props: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    base
      .post(`/uploads/favorite`, props)
      .then(({ data }: any) => {
        resolve(data)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

export const getSaveComment = (props: SaveCommentDTO): Promise<any> => {
  return new Promise((resolve, reject) => {
    base
      .post("/comments", props)
      .then(({ data }: any) => {
        const comments = data.user as User
        resolve(comments)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

export const getDeleteComment = (props: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    base
      .delete("/comments/" + props)
      .then(({ data }: any) => {
        const comments = data.user as User
        resolve(comments)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

export const listFonts = (props: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    base
      .post("/fonts/search", props)
      .then(({ data }) => {
        const response = data
        resolve(response)
      })
      .catch((err: any) => {
        null
      })
  })
}

export const createResourceComposite = (props: ICreateComponent): Promise<any> => {
  return new Promise((resolve, reject) => {
    base
      .post("/components", props)
      .then(({ data }) => {
        const response = data.resource
        resolve(response)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

export const listResourceComposite = (props: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    base
      .post("/components/search", props)
      .then(({ data }) => {
        const response = data.resources
        resolve(response)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

export const deleteResourceComposite = (props: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    base
      .delete(`/components/${props}`)
      .then(({ data }) => {
        const response = data
        resolve(response)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

export const getFonts = (): Promise<IFont[]> => {
  return new Promise((resolve, reject) => {
    base
      .post("/fonts/search", {
        page: 1,
        query: {
          drawify: true
        }
      })
      .then(({ data }) => {
        resolve(data.fonts)
      })
      .catch((err: any) => {
        null
      })
  })
}

export const getListUseFonts = (): Promise<IFont[]> => {
  return new Promise((resolve, reject) => {
    base
      .get("/fonts/used")
      .then(({ data }) => {
        resolve(data.fonts)
      })
      .catch((err: any) => {
        null
      })
  })
}

//getListProjects
export const getProjects = (props: Partial<listProjectsDTO>): Promise<IProject[]> => {
  return new Promise((resolve, reject) => {
    base
      .post("/projects/search", props)
      .then(({ data }: any) => {
        resolve(data.projects)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

export const listDrawifier = (props: Partial<ISearchDrawifier>): Promise<IDrawifier> => {
  return new Promise((resolve, reject) => {
    base
      .post("/drawifier/search", props)
      .then(({ data }: any) => {
        resolve(data)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

export const deleteUploadFile = (props: any) => {
  return new Promise((resolve, reject) => {
    base
      .delete("/uploads/" + props)
      .then(({ data }) => {
        resolve(data)
      })
      .catch((err) => null)
  })
}

export const updateProject = (props: any) => {
  return new Promise<IProject>((resolve, reject) => {
    base
      .post("/projects", props)
      .then(({ data }) => {
        resolve(data.project)
      })
      .catch((err) => reject(err))
  })
}

export const getShareTemplate = (props: any) => {
  return new Promise<ShareTemplate>((resolve, reject) => {
    base
      .post("/projects/share", props)
      .then(({ data }) => {
        resolve(data)
      })
      .catch((err) => reject(err))
  })
}

export const deleteProject = (props: any) => {
  return new Promise((resolve, reject) => {
    base
      .delete("/projects/" + props)
      .then(({ data }) => {
        resolve(data)
      })
      .catch((err) => reject(err))
  })
}

export const getExportProject = (props: any): Promise<{ url: string }> => {
  return new Promise((resolve, reject) => {
    base
      .post("/projects/export", props)
      .then(({ data }) => {
        resolve(data)
      })
      .catch((err) => reject(err))
  })
}

export const makeExportProjectNoLogin = (props: IExportProjectNoLogin): Promise<{ url: string }> => {
  return new Promise((resolve, reject) => {
    base
      .post("/projects/download", props)
      .then(({ data }) => {
        resolve(data)
      })
      .catch((err) => reject(err))
  })
}

export const duplicateTemplate = (props: any) => {
  return new Promise((resolve, reject) => {
    base
      .post("/api", props)
      .then(({ data }) => {
        resolve(data)
      })
      .catch((err) => reject(err))
  })
}

export const getUploads = (): Promise<interfaceUploads[]> => {
  return new Promise((resolve, reject) => {
    base
      .put("/user", {})
      .then(({ data }) => {
        resolve(data)
      })
      .catch((err) => reject(err))
  })
}

export const getSignedURLForUpload = (props: {
  filename: string
  operation: string
}): Promise<{ signed_url: string; url: string }> => {
  return new Promise((resolve, reject) => {
    base
      .post("/uploads/signed", props)
      .then(({ data }) => {
        resolve(data)
      })
      .catch((err) => null)
  })
}

export const getSave = (props: {
  id: string
  name: string
  type: string
  url: string
}): Promise<{ image: { id: string; name: string; type: string; url: string } }> => {
  return new Promise((resolve, reject) => {
    base
      .post("/uploads", props)
      .then(({ data }) => {
        resolve(data)
      })
      .catch((err) => null)
  })
}

export const updateUploadFile = (prop?: querySearchUpload): Promise<interfaceUploads[]> => {
  return new Promise((resolve, reject) => {
    base
      .post("/uploads/search", prop)
      .then(({ data }) => {
        resolve(data.uploads)
      })
      .catch((err) => null)
  })
}

export const userMe = (): Promise<User> => {
  return new Promise((resolve, reject) => {
    base
      .get("/user/me")
      .then(({ data }: any) => {
        resolve(data.user)
      })
      .catch((e) => reject(e))
  })
}

export const oldSignIn = (props: Partial<SigninDto>): Promise<User> => {
  return new Promise((resolve, reject) => {
    base
      .post("/old/signIn", props)
      .then(({ data }) => {
        console.log(data)
        resolve(data.user)
      })
      .catch((err) => reject(err))
  })
}

export const signin = (props: Partial<SigninDto>): Promise<User> => {
  return new Promise((resolve, reject) => {
    base
      .post("/signin", props)
      .then(({ data }) => {
        resolve(data.user)
      })
      .catch((err) => reject(err))
  })
}

export const getsubscriptionMe = (): Promise<ISubscriptionMe> => {
  return new Promise((resolve, reject) => {
    base
      .get("/subscription/me")
      .then(({ data }) => {
        resolve(data)
      })
      .catch((err) => reject(err))
  })
}

export const getListPublicTemplates = (props: SearchTemplateDto): Promise<IDesign[]> => {
  return new Promise((resolve, reject) => {
    base
      .post("/es/templates", props)
      .then(({ data }: any) => {
        resolve(data.templates)
      })
      .catch(null)
  })
}

export const getLikeTemplate = (id: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    base
      .put(`/templates/${id}/favorite`)
      .then(({ data }: any) => {
        resolve(data)
      })
      .catch(null)
  })
}

export const getListFavoritedTemplates = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    base
      .get(`/templates/favorite`)
      .then(({ data }: any) => {
        resolve(data.templates)
      })
      .catch(null)
  })
}

export const getProjectById = (props: { id: string; owner_id?: string }): Promise<IDesign> => {
  return new Promise((resolve, reject) => {
    if (props.owner_id) {
      base
        .get(`/projects/${props.id}?owner_id=${props.owner_id}`)
        .then(({ data }: any) => {
          resolve(data.project)
        })
        .catch((err) => {
          reject(err)
        })
    } else {
      base
        .get("/projects/" + props.id)
        .then(({ data }: any) => {
          resolve(data.project)
        })
        .catch((err) => {
          reject(err)
        })
    }
  })
}

export const getTemplate = (props: string) => {
  return new Promise((resolve, reject) => {
    base
      .get("/templates/" + props)
      .then(({ data }: any) => {
        resolve(data)
      })
      .catch(null)
  })
}

export const getUseTemplate = (prop: string) => {
  return new Promise((resolve, reject) => {
    base.put(`/templates/${prop}/use`).then(({ data }: any) => {
      resolve(data)
    })
  })
}

export const getTemplateById = (id: string): Promise<IDesign> => {
  return new Promise((resolve, reject) => {
    base
      .get(`/templates/${id}`)
      .then(({ data }) => {
        resolve(data.template)
      })
      .catch(null)
  })
}

export const resourceSearchShapes = (props: Partial<SearchResourceDto>) => {
  return new Promise((resolve, reject) => {
    base
      .post("/es/resource", props)
      .then(({ data }: any) => {
        const resources = data.resources as IResource[]
        resolve(resources)
      })
      .catch(null)
  })
}

export const searchResources = (props: Partial<SearchResourceDto>): Promise<IResource[]> => {
  return new Promise((resolve, reject) => {
    base
      .post("/es/resource", props)
      .then(({ data }) => {
        resolve(data.resources)
      })
      .catch(null)
  })
}

export const recentResource = (idResource: String) => {
  return new Promise(() => {
    base.put("/resource/" + idResource + "/use")
  })
}

export const favoriteResource = (id: string) => {
  return new Promise(() => {
    base.put("/resource/" + id + "/favorite")
  })
}

export const getListResourcesImages = (props: Partial<SearchResourceDto>) => {
  return new Promise((resolve, reject) => {
    base
      .post("/es/resource", props)
      .then(({ data }) => {
        resolve(data.resources)
      })
      .catch(reject)
  })
}

export const listRecentResource = () => {
  return new Promise((resolve, reject) => {
    base.get("/resource/used").then(({ data }: any) => {
      data.listRecentResources as ListRecentDto[]
      resolve(data.resources)
    })
  })
}

export const logout = () => {
  return new Promise((resolve, reject) => {
    base
      .post("/signout")
      .then(resolve)
      .catch((err) => reject(err))
  })
}