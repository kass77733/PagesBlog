// 文章类型
export interface Article {
  id: string
  title: string
  content: string
  cover?: string
  summary: string
  tags: string[]
  category: string
  createdAt: string
  updatedAt?: string
}

// 评论类型
export interface Comment {
  id: string
  articleId: string
  nickname: string
  avatar?: string
  content: string
  createdAt: string
}

// 博客配置类型
export interface BlogConfig {
  siteName: string
  description: string
  themeColor: string
  bannerImage?: string
  githubUrl?: string
  twitterUrl?: string
  adminToken?: string
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}

// 分页类型
export interface PaginationInfo {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo
}