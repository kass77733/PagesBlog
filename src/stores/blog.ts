import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Article, Comment, BlogConfig } from '@/types'
import api from '@/utils/api'

// 博客状态管理
export const useBlogStore = defineStore('blog', () => {
  // 状态
  const articles = ref<Article[]>([])
  const currentArticle = ref<Article | null>(null)
  const comments = ref<Comment[]>([])
  const categories = ref<string[]>([])
  const tags = ref<string[]>([])
  const config = ref<BlogConfig>({
    siteName: '天空蓝博客',
    description: '一个现代化的个人博客系统',
    themeColor: '#87CEEB'
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 分页信息
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  })

  // 认证状态
  const isAuthenticated = ref(!!localStorage.getItem('adminToken'))
  
  // 计算属性

  const recentArticles = computed(() => {
    return articles.value.slice(0, 5)
  })

  const articlesByCategory = computed(() => {
    const grouped: Record<string, Article[]> = {}
    articles.value.forEach(article => {
      if (!grouped[article.category]) {
        grouped[article.category] = []
      }
      grouped[article.category].push(article)
    })
    return grouped
  })

  // Actions
  async function fetchArticles(page = 1, pageSize = 10) {
    loading.value = true
    error.value = null
    try {
      const response = await api.articles.getList(page, pageSize)
      if (response.success && response.data) {
        articles.value = response.data
        if (response.pagination) {
          pagination.value = response.pagination
        }
      }
    } catch (err) {
      error.value = '获取文章列表失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchArticle(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await api.articles.getById(id)
      if (response.success && response.data) {
        currentArticle.value = response.data
      }
    } catch (err) {
      error.value = '获取文章详情失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createArticle(articleData: Omit<Article, 'id' | 'createdAt'>) {
    loading.value = true
    error.value = null
    try {
      const response = await api.articles.create(articleData)
      if (response.success && response.data) {
        articles.value.unshift(response.data)
        return response.data
      }
    } catch (err) {
      error.value = '创建文章失败'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateArticle(id: string, articleData: Partial<Article>) {
    loading.value = true
    error.value = null
    try {
      const response = await api.articles.update(id, articleData)
      if (response.success && response.data) {
        const index = articles.value.findIndex(article => article.id === id)
        if (index !== -1) {
          articles.value[index] = response.data
        }
        if (currentArticle.value?.id === id) {
          currentArticle.value = response.data
        }
        return response.data
      }
    } catch (err) {
      error.value = '更新文章失败'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteArticle(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await api.articles.delete(id)
      if (response.success) {
        articles.value = articles.value.filter(article => article.id !== id)
        if (currentArticle.value?.id === id) {
          currentArticle.value = null
        }
      }
    } catch (err) {
      error.value = '删除文章失败'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchComments(articleId: string) {
    loading.value = true
    error.value = null
    try {
      const response = await api.comments.getByArticleId(articleId)
      if (response.success && response.data) {
        comments.value = response.data
      }
    } catch (err) {
      error.value = '获取评论失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createComment(commentData: Omit<Comment, 'id' | 'createdAt'>) {
    loading.value = true
    error.value = null
    try {
      const response = await api.comments.create(commentData)
      if (response.success && response.data) {
        comments.value.push(response.data)
        return response.data
      }
    } catch (err) {
      error.value = '发表评论失败'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteComment(articleId: string, commentId: string) {
    loading.value = true
    error.value = null
    try {
      const response = await api.comments.delete(articleId, commentId)
      if (response.success) {
        comments.value = comments.value.filter(comment => comment.id !== commentId)
      }
    } catch (err) {
      error.value = '删除评论失败'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    try {
      const response = await api.taxonomy.getCategories()
      if (response.success && response.data) {
        categories.value = response.data
      }
    } catch (err) {
      console.error('获取分类失败:', err)
    }
  }

  async function fetchTags() {
    try {
      const response = await api.taxonomy.getTags()
      if (response.success && response.data) {
        tags.value = response.data
      }
    } catch (err) {
      console.error('获取标签失败:', err)
    }
  }

  async function updateCategories(newCategories: string[]) {
    try {
      const response = await api.taxonomy.updateCategories(newCategories)
      if (response.success && response.data) {
        categories.value = response.data
      }
    } catch (err) {
      console.error('更新分类失败:', err)
      throw err
    }
  }

  async function updateTags(newTags: string[]) {
    try {
      const response = await api.taxonomy.updateTags(newTags)
      if (response.success && response.data) {
        tags.value = response.data
      }
    } catch (err) {
      console.error('更新标签失败:', err)
      throw err
    }
  }

  async function fetchConfig() {
    try {
      const response = await api.config.get()
      if (response.success && response.data) {
        config.value = response.data
      }
    } catch (err) {
      console.error('获取配置失败:', err)
    }
  }

  async function updateConfig(configData: Partial<BlogConfig>) {
    loading.value = true
    error.value = null
    try {
      const response = await api.config.update(configData)
      if (response.success && response.data) {
        config.value = response.data
        return response.data
      }
    } catch (err) {
      error.value = '更新配置失败'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function searchArticles(query: string, page = 1) {
    loading.value = true
    error.value = null
    try {
      const response = await api.articles.search(query, page)
      if (response.success && response.data) {
        articles.value = response.data
        if (response.pagination) {
          pagination.value = response.pagination
        }
      }
    } catch (err) {
      error.value = '搜索文章失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // 清除错误
  function clearError() {
    error.value = null
  }

  // 登录
  async function login(username: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const response = await api.auth.login(username, password)
      if (response.success && response.token) {
        localStorage.setItem('adminToken', response.token)
        isAuthenticated.value = true
        return true
      }
      return false
    } catch (err) {
      error.value = '登录失败'
      console.error(err)
      return false
    } finally {
      loading.value = false
    }
  }

  // 登出
  function logout() {
    localStorage.removeItem('adminToken')
    isAuthenticated.value = false
    currentArticle.value = null
  }

  return {
    // 状态
    articles,
    currentArticle,
    comments,
    categories,
    tags,
    config,
    loading,
    error,
    pagination,
    
    // 计算属性
    isAuthenticated,
    recentArticles,
    articlesByCategory,
    
    // 方法
    fetchArticles,
    fetchArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    fetchComments,
    createComment,
    deleteComment,
    fetchCategories,
    fetchTags,
    updateCategories,
    updateTags,
    fetchConfig,
    updateConfig,
    searchArticles,
    clearError,
    login,
    logout,
  }
})