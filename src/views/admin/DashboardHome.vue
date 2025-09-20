<template>
  <div class="dashboard-home">
    <!-- 统计卡片 -->
    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-icon" style="background: #3498db;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3 class="stat-title">文章总数</h3>
          <p class="stat-value">{{ articles.length }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: #2ecc71;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3 class="stat-title">评论总数</h3>
          <p class="stat-value">{{ totalComments }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: #e74c3c;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3 class="stat-title">分类数量</h3>
          <p class="stat-value">{{ categories.length }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: #f39c12;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3 class="stat-title">标签数量</h3>
          <p class="stat-value">{{ tags.length }}</p>
        </div>
      </div>
    </div>

    <!-- 最新文章 -->
    <div class="recent-articles">
      <h2 class="section-title">最新文章</h2>
      <div class="articles-list">
        <div v-for="article in recentArticles" :key="article.id" class="article-item">
          <div class="article-info">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-meta">{{ formatDate(article.createdAt) }} · {{ article.category }}</p>
          </div>
          <div class="article-actions">
            <router-link :to="`/admin/articles/${article.id}/edit`" class="btn btn-sm btn-secondary">
              编辑
            </router-link>
            <router-link :to="`/article/${article.id}`" class="btn btn-sm btn-outline" target="_blank">
              查看
            </router-link>
          </div>
        </div>
        <div v-if="articles.length === 0" class="empty-state">
          <p>暂无文章</p>
          <router-link to="/admin/articles/new" class="btn btn-primary">创建第一篇文章</router-link>
        </div>
      </div>
    </div>

    <!-- 最新评论 -->
    <div class="recent-comments">
      <h2 class="section-title">最新评论</h2>
      <div class="comments-list">
        <div v-for="comment in recentComments" :key="comment.id" class="comment-item">
          <div class="comment-info">
            <h4 class="comment-author">{{ comment.nickname }}</h4>
            <p class="comment-content">{{ comment.content }}</p>
            <p class="comment-meta">{{ formatDate(comment.createdAt) }} · 在《{{ getArticleTitle(comment.articleId) }}》中</p>
          </div>
        </div>
        <div v-if="recentComments.length === 0" class="empty-state">
          <p>暂无评论</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useBlogStore } from '@/stores/blog'
import { formatDate as formatDateUtil } from '@/utils'

const blogStore = useBlogStore()

const articles = computed(() => blogStore.articles)
const categories = computed(() => blogStore.categories)
const tags = computed(() => blogStore.tags)
const recentComments = computed(() => blogStore.recentComments || [])

const recentArticles = computed(() => articles.value.slice(0, 5))

const totalComments = computed(() => {
  return recentComments.value.length
})

function formatDate(date: string) {
  return formatDateUtil(date)
}

function getArticleTitle(articleId: string) {
  const article = articles.value.find(a => a.id === articleId)
  return article?.title || '文章已删除'
}

onMounted(async () => {
  await Promise.all([
    blogStore.fetchArticles(1, 20),
    blogStore.fetchCategories(),
    blogStore.fetchTags()
  ])
  await blogStore.fetchRecentComments()
})
</script>

<style scoped>
.dashboard-home {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  display: flex;
  overflow: hidden;
  transition: var(--transition);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-content {
  flex: 1;
  padding: 1rem;
}

.stat-title {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: var(--text-light);
  font-weight: 500;
}

.stat-value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
}

.section-title {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: var(--text-color);
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
  display: inline-block;
}

.recent-articles, .recent-comments {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
}

.articles-list, .comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.article-item:hover {
  background: #f8f9fa;
}

.article-info {
  flex: 1;
}

.article-title {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: var(--text-color);
}

.article-meta {
  margin: 0;
  color: var(--text-light);
  font-size: 0.9rem;
}

.article-actions {
  display: flex;
  gap: 0.5rem;
}

.comment-item {
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.comment-item:hover {
  background: #f8f9fa;
}

.comment-author {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: var(--text-color);
}

.comment-content {
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.comment-meta {
  margin: 0;
  color: var(--text-light);
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-light);
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.btn-outline:hover {
  background: var(--border-color);
}

@media (max-width: 768px) {
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
  
  .article-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .article-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>