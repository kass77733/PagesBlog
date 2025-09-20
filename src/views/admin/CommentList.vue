<template>
  <div class="admin-comments">
    <div class="admin-header">
      <h1 class="admin-title">评论管理</h1>
      <div class="admin-actions">
        <button 
          class="btn btn-secondary"
          @click="refreshComments"
          :disabled="loading"
        >
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          刷新
        </button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comments-table-container">
      <table class="comments-table">
        <thead>
          <tr>
            <th>文章</th>
            <th>评论者</th>
            <th>内容</th>
            <th>时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comment in allComments" :key="comment.id">
            <td>
              <div class="article-info">
                <router-link 
                  v-if="getArticleById(comment.articleId)"
                  :to="`/article/${comment.articleId}`"
                  class="article-link"
                >
                  {{ getArticleById(comment.articleId)?.title }}
                </router-link>
                <span v-else>文章已删除</span>
              </div>
            </td>
            <td>
              <div class="commenter-info">
                <div class="avatar-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <span class="commenter-name">{{ comment.nickname }}</span>
              </div>
            </td>
            <td>
              <div class="comment-content">
                {{ comment.content }}
              </div>
            </td>
            <td>{{ formatDate(comment.createdAt) }}</td>
            <td>
              <div class="actions">
                <button 
                  class="action-btn delete-btn"
                  @click="handleDelete(comment.articleId, comment.id)"
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

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在加载评论...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="allComments.length === 0" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
        <p>暂无评论</p>
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
import { useBlogStore } from '@/stores/blog'
import Pagination from '@/components/Pagination.vue'
import { formatDate as formatDateUtil } from '@/utils'
import type { Comment, Article } from '@/types'

const blogStore = useBlogStore()

// 响应式数据
const allComments = ref<Comment[]>([])
const loading = ref(false)

// 计算属性
const articles = computed(() => blogStore.articles)
const pagination = computed(() => blogStore.pagination)

// 方法
function formatDate(date: string) {
  return formatDateUtil(date)
}

function getArticleById(articleId: string): Article | undefined {
  return articles.value.find(article => article.id === articleId)
}

async function refreshComments() {
  loading.value = true
  try {
    // 获取所有文章
    await blogStore.fetchArticles(1, 100)
    
    // 获取所有文章的评论
    const comments = []
    for (const article of articles.value) {
      try {
        await blogStore.fetchComments(article.id)
        comments.push(...blogStore.comments)
      } catch (error) {
        console.error(`获取文章 ${article.id} 的评论失败:`, error)
      }
    }
    
    // 按时间排序
    allComments.value = comments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  } catch (error) {
    console.error('刷新评论失败:', error)
  } finally {
    loading.value = false
  }
}

async function handleDelete(articleId: string, commentId: string) {
  if (confirm('确定要删除这条评论吗？')) {
    try {
      await blogStore.deleteComment(articleId, commentId)
      // 从列表中移除
      allComments.value = allComments.value.filter(comment => comment.id !== commentId)
    } catch (error) {
      console.error('删除评论失败:', error)
      alert('删除评论失败，请重试')
    }
  }
}

function handlePageChange(page: number) {
  // 分页逻辑
  console.log('切换到第', page, '页')
}

// 生命周期
onMounted(async () => {
  await refreshComments()
})
</script>

<style scoped>
.admin-comments {
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

.comments-table-container {
  overflow-x: auto;
}

.comments-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.comments-table th,
.comments-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.comments-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: var(--text-color);
  position: sticky;
  top: 0;
}

.article-info {
  min-width: 150px;
}

.article-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-link:hover {
  text-decoration: underline;
}

.commenter-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar-placeholder {
  width: 32px;
  height: 32px;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
  flex-shrink: 0;
}

.avatar-placeholder svg {
  width: 16px;
  height: 16px;
}

.commenter-name {
  font-weight: 500;
}

.comment-content {
  max-width: 300px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
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

.delete-btn:hover {
  background: #fff5f5;
  color: #e74c3c;
  border-color: #e74c3c;
}

.action-btn svg {
  width: 16px;
  height: 16px;
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

/* 移动端适配 */
@media (max-width: 768px) {
  .admin-comments {
    padding: 1rem;
  }
  
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .comments-table {
    font-size: 0.85rem;
  }
  
  .comments-table th,
  .comments-table td {
    padding: 0.5rem;
  }
  
  .comment-content {
    max-width: 150px;
  }
  
  .article-info {
    min-width: 100px;
  }
}
</style>