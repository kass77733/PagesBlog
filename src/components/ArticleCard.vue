<template>
  <article class="article-card" :class="{ 'card-large': large, 'reverse': large && reverse }">
    <!-- 封面图片 -->
    <div class="card-image" v-if="article.cover">
      <router-link :to="`/article/${article.id}`" class="image-link">
        <img 
          :src="article.cover" 
          :alt="article.title"
          class="cover-image"
          loading="lazy"
          @error="onImageError"
        >
        <div class="image-overlay">
          <svg class="read-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
        </div>
      </router-link>
    </div>

    <!-- 文章内容 -->
    <div class="card-content">
      <!-- 分类标签 -->
      <div class="article-meta-top">
        <router-link 
          :to="`/category/${article.category}`"
          class="category-tag"
        >
          {{ article.category }}
        </router-link>
      </div>

      <!-- 标题 -->
      <h2 class="article-title">
        <router-link :to="`/article/${article.id}`" class="title-link">
          {{ article.title }}
        </router-link>
      </h2>

      <!-- 摘要 -->
      <p class="article-summary">{{ article.summary }}</p>

      <!-- 标签 -->
      <div class="article-tags" v-if="article.tags.length">
        <router-link 
          v-for="tag in article.tags" 
          :key="tag"
          :to="`/tag/${tag}`"
          class="tag-link"
        >
          #{{ tag }}
        </router-link>
      </div>

      <!-- 底部信息 -->
      <div class="article-footer">
        <div class="article-meta">
          <span class="meta-item">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            {{ formatDate(article.createdAt) }}
          </span>
          
          <span class="meta-item" v-if="readingTime">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M2 6h20M2 12h20M2 18h20"/>
            </svg>
            {{ readingTime }}
          </span>
        </div>

        <router-link 
          :to="`/article/${article.id}`"
          class="read-more-btn"
        >
          阅读全文
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </router-link>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Article } from '@/types'
import { formatDate as formatDateUtil } from '@/utils'

interface Props {
  article: Article
  large?: boolean
  reverse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  large: false,
  reverse: false
})

// 计算属性
const readingTime = computed(() => {
  const wordsPerMinute = 200
  const wordCount = props.article.content.length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} 分钟阅读`
})

// 方法
function formatDate(date: string) {
  return formatDateUtil(date, 'MM-DD')
}

function onImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-image.jpg' // 可以设置一个默认图片
}
</script>

<style scoped>
.article-card {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: var(--transition);
  height: 200px;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

.card-large {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 0;
  height: 200px;
}

.card-large.reverse {
  grid-template-columns: 1fr 300px;
}

.card-image {
  position: relative;
  overflow: hidden;
  background: #f8f9fa;
  width: 300px;
  height: 200px;
}

.card-large .card-image {
  width: 100%;
  height: 100%;
}

.image-link {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: var(--transition);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition);
}

.image-link:hover .cover-image {
  transform: scale(1.05);
}

.image-link:hover .image-overlay {
  opacity: 1;
}

.read-icon {
  width: 48px;
  height: 48px;
  color: white;
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  height: 100%;
  overflow: hidden;
}

.article-meta-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--primary-color);
  color: white;
  font-size: 0.8rem;
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
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
}

.card-large .article-title {
  font-size: 1.5rem;
}

.title-link {
  color: var(--text-color);
  text-decoration: none;
  transition: var(--transition);
}

.title-link:hover {
  color: var(--primary-color);
}

.article-summary {
  color: var(--text-light);
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: var(--transition);
}

.tag-link:hover {
  color: var(--primary-dark);
  transform: translateY(-1px);
}

.article-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--text-light);
  font-size: 0.85rem;
}

.meta-icon {
  width: 16px;
  height: 16px;
}

.read-more-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: var(--transition);
  white-space: nowrap;
}

.read-more-btn:hover {
  color: var(--primary-dark);
  gap: 0.5rem;
}

.btn-icon {
  width: 16px;
  height: 16px;
  transition: var(--transition);
}

.read-more-btn:hover .btn-icon {
  transform: translateX(2px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .card-large {
    grid-template-columns: 1fr;
  }
  
  .article-title {
    font-size: 1.1rem;
  }
  
  .card-large .article-title {
    font-size: 1.25rem;
  }
  
  .article-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .article-meta {
    gap: 0.75rem;
  }
}
</style>