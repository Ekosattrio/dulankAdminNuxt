export interface Blog {
  id: string
  title: string
  slug: string
  category: string
  tags: string[]
  author: string
  publishedAt: string
  status: 'Active' | 'Inactive'
  viewsCount: number
  commentsCount: number
  image: string
  excerpt: string
  content: string
}

export interface BlogFormData {
  id?: string
  title: string
  slug?: string
  category: string
  tags: string[] | string
  author?: string
  publishedAt?: string
  status: 'Active' | 'Inactive'
  image?: string
  excerpt?: string
  content?: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string
  postCount: number
  status: 'Active' | 'Inactive'
  createdDate: string
}

export interface BlogCategoryFormData {
  id?: string
  name: string
  slug?: string
  description?: string
  postCount?: number
  status: 'Active' | 'Inactive'
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  description: string
  taggedPosts: number
  createdDate: string
}

export interface BlogTagFormData {
  id?: string
  name: string
  slug?: string
  description?: string
  taggedPosts?: number
}

export interface BlogComment {
  id: string
  blogId?: string
  blogTitle: string
  commenterName: string
  email: string
  commentBody: string
  rating?: number
  createdDate: string
  status: 'Approved' | 'Pending' | 'Spam'
}

export interface BlogCommentFormData {
  id?: string
  blogId?: string
  blogTitle: string
  commenterName: string
  email: string
  commentBody: string
  rating?: number
  status: 'Approved' | 'Pending' | 'Spam'
}
