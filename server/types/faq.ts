export interface FaqItem {
  id: string
  question: string
  category: string
  answer: string
  status: 'Active' | 'Inactive'
  order: number
  createdDate?: string
}

export interface FaqFormData {
  id?: string
  question: string
  category: string
  answer: string
  status?: 'Active' | 'Inactive'
  order?: number
}

export interface FaqCategory {
  id: string
  name: string
  slug: string
  description?: string
  questionsCount?: number
  status: 'Active' | 'Inactive'
  createdDate?: string
}

export interface FaqCategoryFormData {
  id?: string
  name: string
  slug?: string
  description?: string
  status?: 'Active' | 'Inactive'
}
