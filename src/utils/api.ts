// API 工具类
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { Article, Comment, BlogConfig, ApiResponse, PaginatedResponse } from '@/types'

// 基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 添加认证 token
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// 通用请求方法
const request = async (url: string, options: any = {}) => {
  try {
    const response = await apiClient({
      url,
      ...options,
    })
    return response
  } catch (error: any) {
    throw error
  }
}

// 文章相关 API
export const articleApi = {
  getList: (page = 1, pageSize = 10): Promise<PaginatedResponse<Article>> =>
    request(`/articles?page=${page}&pageSize=${pageSize}`),

  getById: (id: string): Promise<ApiResponse<Article>> =>
    request(`/articles/${id}`),

  create: (article: Omit<Article, 'id' | 'createdAt'>): Promise<ApiResponse<Article>> =>
    request('/articles', {
      method: 'POST',
      data: article,
    }),

  update: (id: string, article: Partial<Article>): Promise<ApiResponse<Article>> =>
    request(`/articles/${id}`, {
      method: 'PUT',
      data: article,
    }),

  delete: (id: string): Promise<ApiResponse<void>> =>
    request(`/articles/${id}`, {
      method: 'DELETE',
    }),

  getByCategory: (category: string, page = 1): Promise<PaginatedResponse<Article>> =>
    request(`/articles/category/${encodeURIComponent(category)}?page=${page}`),

  getByTag: (tag: string, page = 1): Promise<PaginatedResponse<Article>> =>
    request(`/articles/tag/${encodeURIComponent(tag)}?page=${page}`),

  search: (query: string, page = 1): Promise<PaginatedResponse<Article>> =>
    request(`/articles/search?q=${encodeURIComponent(query)}&page=${page}`),
}

// 评论相关 API
export const commentApi = {
  getByArticleId: (articleId: string): Promise<ApiResponse<Comment[]>> =>
    request(`/comments/${articleId}`),

  create: (comment: Omit<Comment, 'id' | 'createdAt'>): Promise<ApiResponse<Comment>> =>
    request(`/comments/${comment.articleId}`, {
      method: 'POST',
      data: comment,
    }),

  delete: (articleId: string, commentId: string): Promise<ApiResponse<void>> =>
    request(`/comments/${articleId}/${commentId}`, {
      method: 'DELETE',
    }),
}

// 配置相关 API
export const configApi = {
  get: (): Promise<ApiResponse<BlogConfig>> =>
    request('/config'),

  update: (config: Partial<BlogConfig>): Promise<ApiResponse<BlogConfig>> =>
    request('/config', {
      method: 'POST',
      data: config,
    }),
}

// 分类和标签相关 API
export const taxonomyApi = {
  getCategories: (): Promise<ApiResponse<string[]>> =>
    request('/categories'),

  getTags: (): Promise<ApiResponse<string[]>> =>
    request('/tags'),

  updateCategories: (categories: string[]): Promise<ApiResponse<string[]>> =>
    request('/categories', {
      method: 'POST',
      data: { categories },
    }),

  updateTags: (tags: string[]): Promise<ApiResponse<string[]>> =>
    request('/tags', {
      method: 'POST',
      data: { tags },
    }),
}

// 认证相关 API
export const authApi = {
  verify: (token: string): Promise<ApiResponse<{ valid: boolean }>> =>
    request('/auth/verify', {
      method: 'POST',
      data: { token },
    }),
}

export default {
  articles: articleApi,
  comments: commentApi,
  config: configApi,
  taxonomy: taxonomyApi,
  auth: authApi,
}
