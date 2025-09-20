<template>
  <div class="search-page">
    <!-- 搜索头部 -->
    <div class="search-header">
      <div class="search-container">
        <div class="search-input-wrapper">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索文章..."
            class="search-input"
            @keyup.enter="handleSearch"
          >
          <button class="search-button" @click="handleSearch">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>
        
        <div class="search-info" v-if="searchQuery">
          <span>搜索 "{{ searchQuery }}"</span>
          <span v-if="!loading">，找到 {{ articles.length }} 篇文章</span>
        </div>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div class="search-results">
      <!-- 文章列表 -->
      <div class="articles-section" v-if="searchQuery">
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
          <p>正在搜索文章...</p>
        </div>

        <!-- 空状态 -->
        <div v-else-if="searchQuery && !loading" class="empty-state">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p>没有找到与 "{{ searchQuery }}" 相关的文章</p>
          <p class="suggestion">试试其他关键词，或<a href="#" @click="clearSearch">清空搜索</a></p>
        </div>

        <!-- 分页 -->
        <Pagination 
          v-if="pagination.totalPages > 1"
          :current-page="pagination.page"
          :total-pages="pagination.totalPages"
          @update:page="handlePageChange"
        />
      </div>

      <!-- 初始状态 -->
      <div v-else class="initial-state">
        <svg class="search-illustration" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <h2>搜索文章</h2>
        <p>在上方输入框中输入关键词，搜索您感兴趣的文章</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import ArticleCard from '@/components/ArticleCard.vue'
import Pagination from '@/components/Pagination.vue'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

// 响应式数据
const searchQuery = ref('')

// 计算属性
const articles = computed(() => blogStore.articles)
const loading = computed(() => blogStore.loading)
const pagination = computed(() => blogStore.pagination)

// 方法
function handleSearch() {
  if (searchQuery.value.trim()) {
    // 更新 URL 查询参数
    router.push({
      query: { q: searchQuery.value.trim() }
    })
    
    // 执行搜索
    blogStore.searchArticles(searchQuery.value.trim(), 1)
  }
}

function clearSearch() {
  searchQuery.value = ''
  router.push({ query: {} })
}

function handlePageChange(page: number) {
  if (searchQuery.value) {
    blogStore.searchArticles(searchQuery.value, page)
  }
}

// 监听路由变化
watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery && typeof newQuery === 'string') {
      searchQuery.value = newQuery
      blogStore.searchArticles(newQuery, 1)
    } else {
      searchQuery.value = ''
    }
  },
  { immediate: true }
)

// 生命周期
onMounted(() => {
  // 如果 URL 中有查询参数，执行搜索
  if (route.query.q && typeof route.query.q === 'string') {
    searchQuery.value = route.query.q
    blogStore.searchArticles(route.query.q, 1)
  }
})
</script>

<style scoped>
.search-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.search-header {
  margin: 2rem 0;
  padding: 2rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-input-wrapper {
  position: relative;
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  font-size: 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(135, 206, 235, 0.2);
}

.search-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: var(--primary-color);
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button:hover {
  background: var(--primary-dark);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: white;
}

.search-info {
  text-align: center;
  color: var(--text-light);
  font-size: 0.9rem;
}

.search-results {
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
  margin-bottom: 1rem;
}

.suggestion {
  font-size: 0.9rem;
}

.suggestion a {
  color: var(--primary-color);
  text-decoration: none;
  margin-left: 0.5rem;
  transition: var(--transition);
}

.suggestion a:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

.initial-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.search-illustration {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  color: var(--primary-color);
}

.initial-state h2 {
  margin: 0 0 1rem 0;
  color: var(--text-color);
}

.initial-state p {
  color: var(--text-light);
  margin: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .search-page {
    padding: 0 0.5rem;
  }
  
  .search-header {
    padding: 1rem;
    margin: 1rem 0;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>