<template>
  <div class="article-detail-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载文章...</p>
    </div>

    <!-- 文章内容 -->
    <article v-else-if="currentArticle" class="article-content">
      <!-- 文章头部 -->
      <header class="article-header">
        <div class="article-meta-top">
          <router-link 
            :to="`/category/${currentArticle.category}`"
            class="category-tag"
          >
            {{ currentArticle.category }}
          </router-link>
        </div>

        <h1 class="article-title">{{ currentArticle.title }}</h1>

        <div class="article-meta">
          <span class="meta-item">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            {{ formatDate(currentArticle.createdAt) }}
          </span>
          
          <span class="meta-item">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M2 6h20M2 12h20M2 18h20"/>
            </svg>
            {{ readingTime }}
          </span>
          
          <span class="meta-item" v-if="currentArticle.tags.length">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            <span v-for="(tag, index) in currentArticle.tags" :key="tag">
              <router-link :to="`/tag/${tag}`">#{{ tag }}</router-link>
              <span v-if="index < currentArticle.tags.length - 1">, </span>
            </span>
          </span>
        </div>
      </header>

      <!-- 封面图片 -->
      <div class="article-cover" v-if="currentArticle.cover">
        <img 
          :src="currentArticle.cover" 
          :alt="currentArticle.title"
          class="cover-image"
          @error="onImageError"
        >
      </div>

      <!-- 文章正文 -->
      <div class="article-body" v-html="renderedContent"></div>

      <!-- 文章底部 -->
      <footer class="article-footer">
        <!-- 标签 -->
        <div class="article-tags" v-if="currentArticle.tags.length">
          <span class="tags-label">标签：</span>
          <router-link 
            v-for="tag in currentArticle.tags" 
            :key="tag"
            :to="`/tag/${tag}`"
            class="tag-link"
          >
            #{{ tag }}
          </router-link>
        </div>

        <!-- 分享按钮 -->
        <div class="article-share">
          <span class="share-label">分享：</span>
          <button class="share-btn" @click="shareTo('weibo')" title="分享到微博">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 7.563c.818 0 1.482.664 1.482 1.48 0 .818-.664 1.482-1.482 1.482-.817 0-1.48-.664-1.48-1.482 0-.816.663-1.48 1.48-1.48zm-3.74 10.18c-2.572 0-4.813-1.61-5.582-3.938h2.89c.634.986 1.724 1.618 2.953 1.618 1.88 0 3.403-1.523 3.403-3.403 0-1.88-1.523-3.403-3.403-3.403-1.23 0-2.32.632-2.953 1.618h-2.89c.77-2.328 3.01-3.938 5.582-3.938 3.24 0 5.87 2.63 5.87 5.87 0 3.24-2.63 5.87-5.87 5.87z"/>
            </svg>
          </button>
          <button class="share-btn" @click="copyLink" title="复制链接">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          </button>
        </div>
      </footer>
    </article>

    <!-- 404 状态 -->
    <div v-else class="not-found">
      <svg class="not-found-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
      <h2>文章未找到</h2>
      <p>抱歉，您访问的文章不存在或已被删除。</p>
      <router-link to="/" class="btn btn-primary">返回首页</router-link>
    </div>

    <!-- 评论区 -->
    <Comments 
      v-if="currentArticle"
      :article-id="currentArticle.id"
      :comments="comments"
      @submit="handleAddComment"
      @delete="handleDeleteComment"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import { renderMarkdown, formatDate as formatDateUtil } from '@/utils'
import Comments from '@/components/Comments.vue'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

// 计算属性
const currentArticle = computed(() => blogStore.currentArticle)
const comments = computed(() => blogStore.comments)
const loading = computed(() => blogStore.loading)

const renderedContent = computed(() => {
  return currentArticle.value ? renderMarkdown(currentArticle.value.content) : ''
})

const readingTime = computed(() => {
  if (!currentArticle.value) return ''
  const wordsPerMinute = 200
  const wordCount = currentArticle.value.content.length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} 分钟阅读`
})

// 方法
function formatDate(date: string) {
  return formatDateUtil(date)
}

function onImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-image.jpg'
}

async function handleAddComment(commentData: any) {
  try {
    await blogStore.createComment(commentData)
  } catch (error) {
    console.error('发表评论失败:', error)
    alert('发表评论失败，请重试')
  }
}

async function handleDeleteComment(commentId: string) {
  if (!currentArticle.value) return
  
  try {
    await blogStore.deleteComment(currentArticle.value.id, commentId)
  } catch (error) {
    console.error('删除评论失败:', error)
    alert('删除评论失败，请重试')
  }
}

function shareTo(platform: string) {
  const url = window.location.href
  const title = currentArticle.value?.title || ''
  
  switch (platform) {
    case 'weibo':
      // 微博分享
      const weiboUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
      window.open(weiboUrl, '_blank')
      break
  }
}

function copyLink() {
  const url = window.location.href
  navigator.clipboard.writeText(url).then(() => {
    alert('链接已复制到剪贴板')
  }).catch(() => {
    alert('复制失败，请手动复制链接')
  })
}

// 生命周期
onMounted(async () => {
  const articleId = route.params.id as string
  
  if (articleId) {
    // 获取文章详情
    await blogStore.fetchArticle(articleId)
    
    // 如果文章存在，获取评论
    if (blogStore.currentArticle) {
      await blogStore.fetchComments(articleId)
    }
  }
})
</script>

<style scoped>
.article-detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(135, 206, 235, 0.3);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.article-content {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
  margin-bottom: 2rem;
}

.article-header {
  margin-bottom: 2rem;
}

.article-meta-top {
  margin-bottom: 1rem;
}

.category-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--primary-color);
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 20px;
  text-decoration: none;
  transition: var(--transition);
}

.category-tag:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.article-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: var(--text-color);
  line-height: 1.3;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  color: var(--text-light);
  font-size: 0.9rem;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-icon {
  width: 16px;
  height: 16px;
}

.article-cover {
  margin: 2rem 0;
  border-radius: var(--border-radius);
  overflow: hidden;
  background: #f8f9fa;
}

.cover-image {
  width: 100%;
  height: auto;
  display: block;
  max-height: 400px;
  object-fit: cover;
}

.article-body {
  margin: 2rem 0;
  line-height: 1.8;
}

.article-body :deep(h1) {
  font-size: 2rem;
  margin: 2rem 0 1rem;
  color: var(--text-color);
}

.article-body :deep(h2) {
  font-size: 1.75rem;
  margin: 1.75rem 0 1rem;
  color: var(--text-color);
}

.article-body :deep(h3) {
  font-size: 1.5rem;
  margin: 1.5rem 0 1rem;
  color: var(--text-color);
}

.article-body :deep(p) {
  margin-bottom: 1rem;
  color: var(--text-color);
}

.article-body :deep(ul),
.article-body :deep(ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.article-body :deep(li) {
  margin-bottom: 0.5rem;
}

.article-body :deep(blockquote) {
  border-left: 4px solid var(--primary-color);
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  background: #f8f9fa;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
}

.article-body :deep(code) {
  background: #f8f9fa;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.9em;
}

.article-body :deep(pre) {
  background: #2d3748;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: var(--border-radius);
  overflow-x: auto;
  margin: 1rem 0;
}

.article-body :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
}

.article-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--border-radius);
  margin: 1rem 0;
}

.article-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.article-body :deep(th),
.article-body :deep(td) {
  border: 1px solid var(--border-color);
  padding: 0.5rem;
  text-align: left;
}

.article-body :deep(th) {
  background: #f8f9fa;
  font-weight: 600;
}

.article-footer {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.tags-label {
  font-weight: 500;
  color: var(--text-color);
}

.tag-link {
  color: var(--primary-color);
  text-decoration: none;
  transition: var(--transition);
}

.tag-link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

.article-share {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.share-label {
  font-weight: 500;
  color: var(--text-color);
}

.share-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  color: var(--text-color);
}

.share-btn:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

.share-btn svg {
  width: 20px;
  height: 20px;
}

.not-found {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.not-found-icon {
  width: 48px;
  height: 48px;
  color: #e74c3c;
  margin-bottom: 1rem;
}

.not-found h2 {
  margin: 0 0 1rem 0;
  color: var(--text-color);
}

.not-found p {
  color: var(--text-light);
  margin-bottom: 1.5rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .article-detail-page {
    padding: 0 0.5rem;
  }
  
  .article-content {
    padding: 1rem;
  }
  
  .article-title {
    font-size: 1.5rem;
  }
  
  .article-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .article-footer {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>