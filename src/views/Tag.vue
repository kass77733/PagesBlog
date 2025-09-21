<template>
  <div class="tag-page">
    <!-- 面包屑导航 -->
    <nav class="breadcrumb">
      <router-link to="/">首页</router-link>
      <span class="separator">/</span>
      <span>标签</span>
      <span class="separator">/</span>
      <span class="current">{{ tagName }}</span>
    </nav>

    <!-- 标签头部 -->
    <div class="tag-header">
      <h1 class="tag-title">
        <span class="title-text">#{{ tagName }}</span>
        <span class="article-count">({{ articles.length }} 篇文章)</span>
      </h1>
      <p class="tag-description">包含此标签的所有文章</p>
    </div>

    <!-- 文章列表 -->
    <div class="articles-section">
      <!-- 文章卡片网格 -->
      <div class="articles-grid" v-if="!loading && articles.length > 0">
        <ArticleCard 
          v-for="article in articles" 
          :key="article.id"
          :article="article"
        />
      </div>

      <!-- 加载状态 -->
      <div v-else-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在加载文章...</p>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p>该标签下暂无文章</p>
        <router-link to="/" class="btn btn-primary">返回首页</router-link>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import ArticleCard from '@/components/ArticleCard.vue'
import Pagination from '@/components/Pagination.vue'

const route = useRoute()
const blogStore = useBlogStore()

// 计算属性
const tagName = computed(() => route.params.name as string)
const articles = computed(() => blogStore.articles)
const loading = computed(() => blogStore.loading)
const pagination = computed(() => blogStore.pagination)

// 方法
function handlePageChange(page: number) {
  if (tagName.value) {
    blogStore.fetchArticlesByTag(tagName.value, page)
  }
}

// 生命周期
onMounted(async () => {
  if (tagName.value) {
    await blogStore.fetchArticlesByTag(tagName.value, 1)
  }
})

// 监听路由参数变化
watch(
  () => route.params.name,
  async (newTag) => {
    if (newTag) {
      await blogStore.fetchArticlesByTag(newTag as string, 1)
    }
  }
)
</script>

<style scoped>
.tag-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.breadcrumb {
  padding: 1rem 0;
  font-size: 0.9rem;
  color: var(--text-light);
}

.breadcrumb a {
  color: var(--primary-color);
  text-decoration: none;
  transition: var(--transition);
}

.breadcrumb a:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

.separator {
  margin: 0 0.5rem;
  color: var(--text-light);
}

.current {
  color: var(--text-color);
  font-weight: 500;
}

.tag-header {
  text-align: center;
  margin: 2rem 0;
  padding: 2rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.tag-title {
  margin: 0 0 1rem 0;
  font-size: 2rem;
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.title-text {
  color: var(--primary-color);
}

.article-count {
  font-size: 1.25rem;
  color: var(--text-light);
  font-weight: normal;
}

.tag-description {
  color: var(--text-light);
  margin: 0;
  font-size: 1.1rem;
}

.articles-section {
  margin-bottom: 2rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
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
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  color: var(--text-light);
}

.empty-state p {
  color: var(--text-light);
  margin-bottom: 1.5rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .tag-page {
    padding: 0 0.5rem;
  }
  
  .tag-header {
    padding: 1rem;
    margin: 1rem 0;
  }
  
  .tag-title {
    font-size: 1.5rem;
  }
  
  .article-count {
    font-size: 1rem;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>