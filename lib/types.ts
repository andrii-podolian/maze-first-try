export interface AuthorType {
  name: string | null
}

export interface BookType {
  id: number
  title: string
  coverImage: string | null
  author: AuthorType
}
