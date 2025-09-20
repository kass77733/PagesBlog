<template>
  <div class="admin-articles">
    <div class="admin-header">
      <h1 class="admin-title">文章管理</h1>
      <div class="admin-actions">
        <router-link to="/admin/articles/new" class="btn btn-primary">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          新建文章
        </router-link>
      </div>
    </div>

    <!-- 筛选和搜索 -->
    <div class="filters-section">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索文章标题..."
          class="form-control"
          @keyup.enter="handleSearch"
        >
        <button class="search-btn" @click="handleSearch">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
      </div>
      
      <div class="filter-controls">
        <select v-model="filterCategory" class="form-control">
          <option value="">所有分类</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        
        <select v-model="sortBy" class="form-control">
          <option value="newest">最新发布</option>
          <option value="oldest">最早发布</option>
        </select>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="articles-table-container">
      <table class="articles-table">
        <thead>
          <tr>
            <th>标题</th>
            <th>分类</th>
            <th>标签</th>
            <th>发布时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in filteredArticles" :key="article.id">
            <td>
              <div class="article-title-cell">
                <div class="article-cover" v-if="article.cover">
                  <img :src="article.cover" :alt="article.title">
                </div>
                <div class="article-info">
                  <router-link :to="`/article/${article.id}`" class="article-link">
                    {{ article.title }}
                  </router-link>
                  <div class="article-summary">{{ article.summary }}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="category-tag">{{ article.category }}</span>
            </td>
            <td>
              <div class="tags-container">
                <span 
                  v-for="tag in article.tags.slice(0, 3)" 
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
                <span v-if="article.tags.length > 3" class="tag more-tags">
                  +{{ article.tags.length - 3 }}
                </span>
              </div>
            </td>
            <td>{{ formatDate(article.createdAt) }}</td>
            <td>
              <div class="actions">
                <router-link 
                  :to="`/admin/articles/${article.id}/edit`"
                  class="action-btn edit-btn"
                  title="编辑"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </router-link>
                <button 
                  class="action-btn delete-btn"
                  @click="handleDelete(article.id)"
                  title="删除"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 空状态 -->
      <div v-if="filteredArticles.length === 0" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p v-if="searchQuery || filterCategory">没有找到符合条件的文章</p>
        <p v-else>暂无文章，<router-link to="/admin/articles/new">立即创建</router-link>第一篇文章</p>
      </div>
    </div>

    <!-- 分页 -->
    <Pagination 
      v-if="pagination.totalPages > 1"
      :current-page="pagination.page"
      :total-pages="pagination.totalPages"
      @update:page="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import Pagination from '@/components/Pagination.vue'
import { formatDate as formatDateUtil } from '@/utils'

const router = useRouter()
const blogStore = useBlogStore()

// 响应式数据
const searchQuery = ref('')
const filterCategory = ref('')
const sortBy = ref('newest')

// 计算属性
const articles = computed(() => blogStore.articles)
const categories = computed(() => blogStore.categories)
const pagination = computed(() => blogStore.pagination)
const loading = computed(() => blogStore.loading)

const filteredArticles = computed(() => {
  let result = [...articles.value]
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.summary.toLowerCase().includes(query)
    )
  }
  
  // 分类过滤
  if (filterCategory.value) {
    result = result.filter(article => article.category === filterCategory.value)
  }
  
  // 排序
  if (sortBy.value === 'oldest') {
    result.reverse()
  }
  
  return result
})

// 方法
function formatDate(date: string) {
  return formatDateUtil(date)
}

function handleSearch() {
  // 搜索逻辑已在计算属性中处理
}

function handlePageChange(page: number) {
  blogStore.fetchArticles(page, pagination.value.pageSize)
}

async function handleDelete(articleId: string) {
  if (confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
    try {
      await blogStore.deleteArticle(articleId)
      // 重新加载当前页数据
      await blogStore.fetchArticles(pagination.value.page, pagination.value.pageSize)
    } catch (error) {
      console.error('删除文章失败:', error)
      alert('删除文章失败，请重试')
    }
  }
}

// 生命周期
onMounted(async () => {
  await blogStore.fetchArticles(1, 10)
  await blogStore.fetchCategories()
})
</script>

<style scoped>
.admin-articles {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--primary-color);
}

.admin-title {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-color);
}

.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  flex: 1;
  max-width: 400px;
}

.search-box .form-control {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.search-btn {
  background: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-left: none;
  border-top-right-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  padding: 0 1rem;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  background: var(--primary-dark);
  border-color: var(--primary-dark);
}

.search-btn svg {
  width: 18px;
  height: 18px;
  color: white;
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.filter-controls .form-control {
  min-width: 150px;
}

.articles-table-container {
  overflow-x: auto;
}

.articles-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.articles-table th,
.articles-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.articles-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: var(--text-color);
  position: sticky;
  top: 0;
}

.article-title-cell {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.article-cover {
  width: 60px;
  height: 40px;
  border-radius: var(--border-radius);
  overflow: hidden;
  flex-shrink: 0;
  background: #f8f9fa;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-info {
  flex: 1;
  min-width: 0;
}

.article-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  display: block;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-link:hover {
  text-decoration: underline;
}

.article-summary {
  color: var(--text-light);
  font-size: 0.85rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.category-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--primary-color);
  color: white;
  font-size: 0.8rem;
  border-radius: 20px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 36px;
  height: 36px;
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

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

.edit-btn:hover {
  background: #f8f9fa;
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.delete-btn:hover {
  background: #fff5f5;
  color: #e74c3c;
  border-color: #e74c3c;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.empty-state {
  text-align: center;
  padding: 3rem;
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  color: var(--text-light);
}

.empty-state p {
  color: var(--text-light);
  margin: 0;
}

.empty-state a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.empty-state a:hover {
  text-decoration: underline;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .admin-articles {
    padding: 1rem;
  }
  
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .filters-section {
    flex-direction: column;
  }
  
  .search-box {
    max-width: 100%;
  }
  
  .filter-controls {
    width: 100%;
  }
  
  .articles-table {
    font-size: 0.85rem;
  }
  
  .articles-table th,
  .articles-table td {
    padding: 0.5rem;
  }
  
  .article-title-cell {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .article-cover {
    width: 100%;
    height: 80px;
  }
}
</style>