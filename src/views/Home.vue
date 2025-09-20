<template>
  <div class="home-page">
    <!-- 顶部横幅 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">{{ config.siteName }}</h1>
        <p class="hero-subtitle">{{ config.description }}</p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">{{ articles.length }}</span>
            <span class="stat-label">文章</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ categories.length }}</span>
            <span class="stat-label">分类</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ tags.length }}</span>
            <span class="stat-label">标签</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-container">
      <div class="content-area">
        <!-- 文章列表 -->
        <div class="articles-section">
          <div class="section-header">
            <h2 class="section-title">最新文章</h2>
          </div>

          <!-- 文章卡片网格 -->
          <div class="articles-grid" v-if="!loading">
            <ArticleCard 
              v-for="(article, index) in displayedArticles" 
              :key="article.id"
              :article="article"
              :large="true"
              :reverse="index % 2 === 1"
            />
          </div>

          <!-- 加载状态 -->
          <div v-else class="loading-container">
            <div class="loading-spinner"></div>
            <p>正在加载文章...</p>
          </div>

          <!-- 空状态 -->
          <div v-if="!loading && articles.length === 0" class="empty-state">
            <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <p>暂无文章</p>
          </div>

          <!-- 分页 -->
          <Pagination 
            v-if="pagination.totalPages > 1"
            :current-page="pagination.page"
            :total-pages="pagination.totalPages"
            @update:page="handlePageChange"
          />
        </div>
      </div>

      <!-- 侧边栏 -->
      <aside class="sidebar">
        <!-- 分类 -->
        <div class="sidebar-card">
          <h3 class="sidebar-title">分类</h3>
          <div class="category-list">
            <router-link 
              v-for="category in categories" 
              :key="category"
              :to="`/category/${category}`"
              class="category-item"
            >
              <span class="category-name">{{ category }}</span>
              <span class="category-count">{{ getArticlesCountByCategory(category) }}</span>
            </router-link>
          </div>
        </div>

        <!-- 标签云 -->
        <div class="sidebar-card">
          <h3 class="sidebar-title">标签云</h3>
          <div class="tag-cloud">
            <router-link 
              v-for="tag in tags" 
              :key="tag"
              :to="`/tag/${tag}`"
              class="tag-cloud-item"
              :style="{ fontSize: getTagFontSize(tag) }"
            >
              {{ tag }}
            </router-link>
          </div>
        </div>

        <!-- 最新评论 -->
        <div class="sidebar-card">
          <h3 class="sidebar-title">最新评论</h3>
          <div class="recent-comments">
            <div class="comment-item" v-for="comment in recentComments" :key="comment.id">
              <div class="comment-author">{{ comment.nickname }}</div>
              <div class="comment-content">{{ comment.content }}</div>
              <div class="comment-meta">在《{{ getArticleTitle(comment.articleId) }}》中</div>
            </div>
            <div v-if="recentComments.length === 0" class="no-comments">
              暂无评论
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useBlogStore } from '@/stores/blog'
import ArticleCard from '@/components/ArticleCard.vue'
import Pagination from '@/components/Pagination.vue'

const blogStore = useBlogStore()



// 计算属性
const config = computed(() => blogStore.config)
const articles = computed(() => blogStore.articles)
const categories = computed(() => blogStore.categories)
const tags = computed(() => blogStore.tags)
const loading = computed(() => blogStore.loading)
const pagination = computed(() => blogStore.pagination)
const recentComments = computed(() => blogStore.recentComments || [])

const displayedArticles = computed(() => articles.value)

// 方法
function getArticlesCountByCategory(category: string) {
  return articles.value.filter(article => article.category === category).length
}

function getTagFontSize(tag: string) {
  // 根据标签使用频率调整字体大小
  const count = articles.value.filter(article => 
    article.tags.includes(tag)
  ).length
  
  const minSize = 0.9
  const maxSize = 1.4
  const maxCount = Math.max(1, ...articles.value.map(a => a.tags.length))
  
  const size = minSize + (count / maxCount) * (maxSize - minSize)
  return `${size}rem`
}

function getArticleTitle(articleId: string) {
  const article = articles.value.find(a => a.id === articleId)
  return article?.title || '文章已删除'
}



function handlePageChange(page: number) {
  blogStore.fetchArticles(page, pagination.value.pageSize)
}

// 生命周期
onMounted(async () => {
  // 获取初始数据
  await Promise.all([
    blogStore.fetchArticles(1, 10),
    blogStore.fetchCategories(),
    blogStore.fetchTags(),
    blogStore.fetchConfig()
  ])
  
  // 获取最新评论
  await blogStore.fetchRecentComments()
  
  // 设置Banner背景图片
  if (config.value.bannerImage) {
    const heroSection = document.querySelector('.hero-section') as HTMLElement
    if (heroSection) {
      heroSection.style.backgroundImage = `linear-gradient(135deg, rgba(135, 206, 235, 0.8) 0%, rgba(93, 173, 226, 0.8) 100%), url(${config.value.bannerImage})`
    }
  }
})
</script>

<style scoped>
.home-page {
  width: 100%;
}

.hero-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, #5dade2 100%);
  background-size: cover;
  background-position: center;
  color: white;
  padding: 4rem 1rem;
  text-align: center;
  margin-bottom: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  border-radius: var(--border-radius);
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 1.25rem;
  margin: 0 0 2rem 0;
  opacity: 0.9;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.content-area {
  flex: 1;
}

.articles-section {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--primary-color);
}

.section-title {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-color);
}

.sort-select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: white;
  font-size: 0.9rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
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

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-light);
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
}

.sidebar-title {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: var(--text-color);
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  text-decoration: none;
  color: var(--text-color);
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.category-item:hover {
  background: #f8f9fa;
  color: var(--primary-color);
}

.category-name {
  font-weight: 500;
}

.category-count {
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-cloud-item {
  color: var(--primary-color);
  text-decoration: none;
  transition: var(--transition);
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius);
}

.tag-cloud-item:hover {
  background: #f8f9fa;
  color: var(--primary-dark);
  transform: translateY(-1px);
}

.recent-comments {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-item {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: var(--border-radius);
}

.comment-author {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.comment-content {
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.comment-meta {
  font-size: 0.8rem;
  color: var(--text-light);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-stats {
    gap: 1rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .main-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .articles-section {
    padding: 1rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .articles-grid {
    gap: 1rem;
  }
}
</style>