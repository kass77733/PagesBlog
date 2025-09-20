<template>
  <div class="article-editor">
    <div class="editor-header">
      <h1 class="editor-title">{{ isEditing ? '编辑文章' : '新建文章' }}</h1>
      <div class="editor-actions">
        <button 
          class="btn btn-secondary"
          @click="handlePreview"
          :disabled="saving"
        >
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          预览
        </button>
        <button 
          class="btn btn-primary"
          @click="handleSave"
          :disabled="saving"
        >
          <span v-if="saving" class="loading"></span>
          {{ saving ? '保存中...' : '保存文章' }}
        </button>
      </div>
    </div>

    <form @submit.prevent="handleSave" class="editor-form">
      <!-- 基本信息 -->
      <div class="form-section">
        <h2 class="section-title">基本信息</h2>
        
        <div class="form-group">
          <label for="title" class="form-label">文章标题 *</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            class="form-control"
            placeholder="请输入文章标题"
            required
          >
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="category" class="form-label">分类 *</label>
            <select
              id="category"
              v-model="form.category"
              class="form-control"
              required
            >
              <option value="">请选择分类</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="cover" class="form-label">封面图片 URL</label>
            <input
              id="cover"
              v-model="form.cover"
              type="url"
              class="form-control"
              placeholder="https://example.com/cover.jpg"
            >
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">标签</label>
          <div class="tags-input">
            <div class="tags-container">
              <span 
                v-for="tag in form.tags" 
                :key="tag"
                class="tag"
              >
                {{ tag }}
                <button 
                  type="button"
                  class="remove-tag"
                  @click="removeTag(tag)"
                >
                  ×
                </button>
              </span>
              <input
                ref="tagInput"
                v-model="newTag"
                type="text"
                class="tag-input"
                placeholder="输入标签后按回车添加"
                @keyup.enter="addTag"
                @keyup.comma="addTag"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 内容编辑 -->
      <div class="form-section">
        <h2 class="section-title">文章内容</h2>
        
        <div class="editor-tabs">
          <button 
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'write' }"
            @click="activeTab = 'write'"
          >
            编写
          </button>
          <button 
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'preview' }"
            @click="activeTab = 'preview'"
          >
            预览
          </button>
        </div>
        
        <div class="editor-content">
          <div v-show="activeTab === 'write'" class="write-tab">
            <textarea
              v-model="form.content"
              class="form-control textarea"
              placeholder="使用 Markdown 语法编写文章内容..."
              required
            ></textarea>
          </div>
          
          <div v-show="activeTab === 'preview'" class="preview-tab">
            <div class="preview-content" v-html="renderedContent"></div>
          </div>
        </div>
      </div>

      <!-- 摘要 -->
      <div class="form-section">
        <h2 class="section-title">文章摘要</h2>
        
        <div class="form-group">
          <label class="form-label">自动生成摘要</label>
          <div class="summary-preview">
            {{ autoSummary }}
          </div>
          <button 
            type="button"
            class="btn btn-secondary btn-sm"
            @click="useAutoSummary"
          >
            使用自动生成的摘要
          </button>
        </div>
        
        <div class="form-group">
          <label for="summary" class="form-label">自定义摘要</label>
          <textarea
            id="summary"
            v-model="form.summary"
            class="form-control textarea"
            placeholder="请输入文章摘要，留空将使用自动生成的摘要"
            rows="3"
          ></textarea>
        </div>
      </div>
    </form>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import { renderMarkdown, excerptText } from '@/utils'
import type { Article } from '@/types'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

// 响应式数据
const form = ref({
  title: '',
  content: '',
  cover: '',
  summary: '',
  tags: [] as string[],
  category: ''
})

const newTag = ref('')
const tagInput = ref<HTMLInputElement | null>(null)
const activeTab = ref<'write' | 'preview'>('write')
const saving = ref(false)
const error = ref('')

// 计算属性
const isEditing = computed(() => !!route.params.id)
const categories = computed(() => blogStore.categories)
const renderedContent = computed(() => renderMarkdown(form.value.content))
const autoSummary = computed(() => excerptText(form.value.content, 100))

// 方法
function addTag() {
  const tag = newTag.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
    newTag.value = ''
    
    // 重新聚焦输入框
    nextTick(() => {
      if (tagInput.value) {
        tagInput.value.focus()
      }
    })
  }
}

function removeTag(tag: string) {
  form.value.tags = form.value.tags.filter(t => t !== tag)
}

function useAutoSummary() {
  form.value.summary = autoSummary.value
}

function handlePreview() {
  activeTab.value = 'preview'
}

async function handleSave() {
  if (!form.value.title || !form.value.content || !form.value.category) {
    error.value = '请填写必填字段'
    return
  }

  saving.value = true
  error.value = ''

  try {
    // 如果没有自定义摘要，使用自动生成的摘要
    const summary = form.value.summary || autoSummary.value
    
    const articleData = {
      ...form.value,
      summary
    }

    if (isEditing.value) {
      // 更新文章
      await blogStore.updateArticle(route.params.id as string, articleData)
    } else {
      // 创建文章
      await blogStore.createArticle(articleData)
    }

    // 保存成功，返回文章列表
    router.push('/admin/articles')
  } catch (err) {
    error.value = isEditing.value ? '更新文章失败' : '创建文章失败'
    console.error('保存文章失败:', err)
  } finally {
    saving.value = false
  }
}

// 生命周期
onMounted(async () => {
  // 获取分类列表
  await blogStore.fetchCategories()
  
  // 如果是编辑模式，获取文章详情
  if (isEditing.value) {
    const articleId = route.params.id as string
    await blogStore.fetchArticle(articleId)
    
    if (blogStore.currentArticle) {
      const article = blogStore.currentArticle
      form.value = {
        title: article.title,
        content: article.content,
        cover: article.cover || '',
        summary: article.summary,
        tags: [...article.tags],
        category: article.category
      }
    }
  }
})
</script>

<style scoped>
.article-editor {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--primary-color);
}

.editor-title {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-color);
}

.editor-actions {
  display: flex;
  gap: 1rem;
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.tags-input {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 0.5rem;
  min-height: 44px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.tag-input {
  flex: 1;
  border: none;
  outline: none;
  min-width: 150px;
  padding: 0.25rem;
}

.remove-tag {
  background: none;
  border: none;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding: 0 0.25rem;
  margin-left: 0.25rem;
  border-radius: 50%;
  transition: var(--transition);
}

.remove-tag:hover {
  background: rgba(255, 255, 255, 0.2);
}

.editor-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1rem;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: var(--text-light);
  transition: var(--transition);
}

.tab-btn:hover {
  color: var(--text-color);
}

.tab-btn.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.editor-content {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.write-tab .textarea {
  border: none;
  border-radius: 0;
  min-height: 400px;
  resize: vertical;
}

.preview-tab {
  min-height: 400px;
  padding: 1rem;
  background: white;
}

.preview-content {
  line-height: 1.8;
}

.preview-content :deep(h1) {
  font-size: 2rem;
  margin: 1.5rem 0 1rem;
}

.preview-content :deep(h2) {
  font-size: 1.75rem;
  margin: 1.25rem 0 1rem;
}

.preview-content :deep(h3) {
  font-size: 1.5rem;
  margin: 1rem 0 0.75rem;
}

.preview-content :deep(p) {
  margin-bottom: 1rem;
}

.preview-content :deep(ul),
.preview-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.preview-content :deep(li) {
  margin-bottom: 0.5rem;
}

.preview-content :deep(blockquote) {
  border-left: 4px solid var(--primary-color);
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  background: #f8f9fa;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
}

.summary-preview {
  background: #f8f9fa;
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 1rem;
  min-height: 60px;
  color: var(--text-light);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #fff5f5;
  color: #c0392b;
  border-radius: var(--border-radius);
  text-align: center;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .article-editor {
    padding: 1rem;
  }
  
  .editor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .write-tab .textarea {
    min-height: 300px;
  }
  
  .preview-tab {
    min-height: 300px;
  }
}
</style>