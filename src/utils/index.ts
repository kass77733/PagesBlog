import MarkdownIt from 'markdown-it'

// 初始化 Markdown 渲染器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

/**
 * 渲染 Markdown 内容
 */
export function renderMarkdown(content: string): string {
  return md.render(content)
}

/**
 * 生成唯一 ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * 格式化日期
 */
export function formatDate(date: string | Date, format = 'YYYY-MM-DD HH:mm'): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
}

/**
 * 相对时间
 */
export function timeAgo(date: string | Date): string {
  const now = new Date()
  const past = new Date(date)
  const diff = now.getTime() - past.getTime()

  const minute = 60 * 1000
  const hour = minute * 60
  const day = hour * 24
  const week = day * 7
  const month = day * 30
  const year = day * 365

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)} 分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)} 小时前`
  } else if (diff < week) {
    return `${Math.floor(diff / day)} 天前`
  } else if (diff < month) {
    return `${Math.floor(diff / week)} 周前`
  } else if (diff < year) {
    return `${Math.floor(diff / month)} 个月前`
  } else {
    return `${Math.floor(diff / year)} 年前`
  }
}

/**
 * 截取文本摘要
 */
export function excerptText(text: string, length = 100): string {
  // 移除 Markdown 标记
  const plainText = text
    .replace(/#{1,6}\s+/g, '') // 标题
    .replace(/\*\*(.*?)\*\*/g, '$1') // 粗体
    .replace(/\*(.*?)\*/g, '$1') // 斜体
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 链接
    .replace(/`(.*?)`/g, '$1') // 行内代码
    .replace(/```[\s\S]*?```/g, '') // 代码块
    .replace(/>\s+/g, '') // 引用
    .replace(/\n/g, ' ') // 换行
    .trim()

  return plainText.length > length ? plainText.slice(0, length) + '...' : plainText
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 深拷贝
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    Object.keys(obj).forEach(key => {
      clonedObj[key as keyof T] = deepClone(obj[key as keyof T])
    })
    return clonedObj
  }
  return obj
}

/**
 * 本地存储封装
 */
export const storage = {
  set(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('localStorage set error:', error)
    }
  },

  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch (error) {
      console.error('localStorage get error:', error)
      return defaultValue || null
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('localStorage remove error:', error)
    }
  },

  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('localStorage clear error:', error)
    }
  }
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证 URL 格式
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 生成随机颜色
 */
export function randomColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * 文件大小格式化
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 获取文件扩展名
 */
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}