export interface SaveCommentDTO {
  project_id: string
  scene_id: string | undefined
  text: string
}

export interface IListComments {
  comments: [
    {
      id: string
      text: string
      created_at: number
      updated_at: number
      user: {
        id: string
        name: string
        avatar: string
      }
    }
  ]
}
