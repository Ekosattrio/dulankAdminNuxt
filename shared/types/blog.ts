// blog.ts — type/interface untuk domain blog (auto-import shared/types)
// Dibuat oleh refactor Nuxt 4: interface dipisah dari halaman ke folder tersendiri.

export interface Blog {
  id: number;
  title: string;
  category: string;
  status: "Active" | "Inactive";
  date: string;
  author: string;
  image: string;
  excerpt: string;
  tags: string[];
  content: string;
}

export interface BlogCategory {
  id: number
  name: string
  createdDate: string
  status: 'Active' | 'Inactive'
}

export interface BlogComment {
  id: number
  comment: string
  createdDate: string
  rating: number
  blogTitle: string
  author: string
  status: 'Publish' | 'Unpublish'
}

export interface BlogTag {
  id: number
  name: string
  createdDate: string
  status: 'Active' | 'Inactive'
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string
  message: string
  date: string
  status: 'Pending' | 'Answered'
}

export interface FAQItem {
  id: number
  question: string
  answer: string
  category: string
}

export interface FooterLink {
  text: string
  href: string
}
