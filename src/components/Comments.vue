<template>
  <div class="comments-section">
    <h3 class="comments-title">评论 ({{ comments.length }})</h3>
    
    <!-- 评论表单 -->
    <div class="comment-form" v-if="!articleId || !readOnly">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <input
            v-model="form.nickname"
            type="text"
            placeholder="昵称 *"
            class="form-control"
            required
          >
        </div>
        
        <div class="form-group">
          <textarea
            v-model="form.content"
            placeholder="写下你的评论 *"
            class="form-control textarea"
            required
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            <span v-if="submitting" class="loading"></span>
            {{ submitting ? '提交中...' : '发表评论' }}
          </button>
        </div>
      </form>
    </div>
    
    <!-- 评论列表 -->
    <div class="comments-list" v-if="comments.length">
      <div 
        v-for="comment in comments" 
        :key="comment.id"
        class="comment-item"
      >
        <div class="comment-avatar">
          <div class="avatar-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
        </div>
        
        <div class="comment-content">
          <div class="comment-header">
            <div class="comment-author">{{ comment.nickname }}</div>
            <div class="comment-date">{{ formatDate(comment.createdAt) }}</div>

          </div>
          
          <div class="comment-text">
            {{ comment.content }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- 无评论提示 -->
    <div v-else class="no-comments">
      <p>还没有评论，快来抢沙发吧！</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Comment } from '@/types'
import { useBlogStore } from '@/stores/blog'
import { formatDate } from '@/utils'

interface Props {
  articleId?: string
  comments: Comment[]
  readOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readOnly: false
})

const emit = defineEmits<{
  (e: 'submit', comment: Omit<Comment, 'id' | 'createdAt'>): void
  (e: 'delete', commentId: string): void
}>()

const blogStore = useBlogStore()

// 表单数据
const form = ref({
  nickname: '',
  content: ''
})

const submitting = ref(false)

// 计算属性
const isAuthenticated = computed(() => blogStore.isAuthenticated)

// 方法
async function handleSubmit() {
  if (!props.articleId) return
  
  submitting.value = true
  
  try {
    const commentData = {
      articleId: props.articleId,
      nickname: form.value.nickname,
      content: form.value.content
    }
    
    emit('submit', commentData)
    
    // 重置表单
    form.value.nickname = ''
    form.value.content = ''
  } catch (error) {
    console.error('发表评论失败:', error)
  } finally {
    submitting.value = false
  }
}

function handleDelete(commentId: string) {
  if (confirm('确定要删除这条评论吗？')) {
    emit('delete', commentId)
  }
}
</script>

<style scoped>
.comments-section {
  margin-top: 3rem;
  padding: 2rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.comments-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  color: var(--text-color);
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
  display: inline-block;
}

.comment-form {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.comment-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-avatar {
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 48px;
  height: 48px;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
}

.avatar-placeholder svg {
  width: 24px;
  height: 24px;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.comment-author {
  font-weight: 600;
  color: var(--text-color);
}

.comment-date {
  color: var(--text-light);
  font-size: 0.9rem;
}

.delete-btn {
  margin-left: auto;
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: var(--transition);
  display: flex;
  align-items: center;
}

.delete-btn:hover {
  background: #fff5f5;
  color: #c0392b;
}

.delete-btn svg {
  width: 16px;
  height: 16px;
}

.comment-text {
  line-height: 1.6;
  color: var(--text-color);
  white-space: pre-wrap;
}

.no-comments {
  text-align: center;
  padding: 2rem;
  color: var(--text-light);
}

.no-comments p {
  margin: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .comments-section {
    padding: 1rem;
  }
  
  .comment-item {
    gap: 0.75rem;
  }
  
  .avatar-placeholder {
    width: 40px;
    height: 40px;
  }
  
  .comment-header {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .delete-btn {
    margin-left: 0;
  }
}
</style>