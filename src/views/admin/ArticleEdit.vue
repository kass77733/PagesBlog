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
            <div class="markdown-toolbar">
              <div class="toolbar-group">
                <button type="button" class="toolbar-btn" @click="insertMarkdown('**', '**')" title="粗体">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
                  </svg>
                </button>
                <button type="button" class="toolbar-btn" @click="insertMarkdown('*', '*')" title="斜体">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z"/>
                  </svg>
                </button>
                <button type="button" class="toolbar-btn" @click="insertMarkdown('~~', '~~')" title="删除线">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.24 8.75c-.26-.48-.39-1.03-.39-1.67 0-.61.13-1.16.4-1.67.26-.5.63-.93 1.11-1.29.48-.35 1.05-.63 1.7-.83.66-.19 1.39-.29 2.18-.29.81 0 1.54.11 2.21.34.66.22 1.23.54 1.69.94.47.4.83.88 1.08 1.43.25.55.38 1.15.38 1.81h-3.01c0-.31-.05-.59-.15-.85-.09-.27-.24-.49-.44-.68-.2-.19-.45-.33-.75-.44-.3-.1-.66-.16-1.06-.16-.39 0-.74.04-1.03.13-.29.09-.53.21-.72.36-.19.16-.33.34-.43.55-.1.21-.15.43-.15.66 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.05-.08-.11-.17-.15-.25zM21 12v-2H3v2h9.62c.18.07.4.14.55.2.37.17.66.34.87.51.21.17.35.36.43.57.07.2.11.43.11.69 0 .23-.05.45-.14.66-.09.2-.23.37-.42.53-.19.15-.42.26-.71.35-.29.08-.63.13-1.01.13-.43 0-.83-.04-1.18-.13-.35-.09-.65-.22-.89-.39-.25-.17-.44-.37-.58-.61-.14-.24-.21-.51-.21-.81H8.4c0 .55.08 1.13.24 1.58.16.45.37.85.65 1.21.28.35.6.66.98.92.37.26.78.48 1.22.65.44.17.9.3 1.38.39.48.08.96.13 1.44.13.8 0 1.53-.09 2.18-.28.65-.19 1.21-.45 1.67-.78.46-.33.82-.73 1.07-1.2.25-.47.38-.99.38-1.58 0-.69-.23-1.29-.68-1.79z"/>
                  </svg>
                </button>
                <button type="button" class="toolbar-btn" @click="insertMarkdown('`', '`')" title="行内代码">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                  </svg>
                </button>
              </div>
              
              <div class="toolbar-divider"></div>
              
              <div class="toolbar-group">
                <button type="button" class="toolbar-btn" @click="insertMarkdown('# ', '')" title="标题1">
                  H1
                </button>
                <button type="button" class="toolbar-btn" @click="insertMarkdown('## ', '')" title="标题2">
                  H2
                </button>
                <button type="button" class="toolbar-btn" @click="insertMarkdown('### ', '')" title="标题3">
                  H3
                </button>
              </div>
              
              <div class="toolbar-divider"></div>
              
              <div class="toolbar-group">
                <button type="button" class="toolbar-btn" @click="insertList('- ')" title="无序列表">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
                  </svg>
                </button>
                <button type="button" class="toolbar-btn" @click="insertList('1. ')" title="有序列表">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
                  </svg>
                </button>
                <button type="button" class="toolbar-btn" @click="insertMarkdown('- [ ] ', '')" title="任务列表">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,10H2V12H14V10M14,6H2V8H14V6M2,16H10V14H2V16M21.5,11.5L23,13L16,20L11.5,15.5L13,14L16,17L21.5,11.5Z"/>
                  </svg>
                </button>
              </div>
              
              <div class="toolbar-divider"></div>
              
              <div class="toolbar-group">
                <button type="button" class="toolbar-btn" @click="insertMarkdown('> ', '')" title="引用">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                  </svg>
                </button>
                <button type="button" class="toolbar-btn" @click="insertCodeBlock()" title="代码块">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 3C6.9 3 6 3.9 6 5v14c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7l-4-4H8zm0 2h6v4h4v10H8V5z"/>
                    <path d="M10 15l-2-2 2-2v4zm4-4l2 2-2 2v-4z"/>
                  </svg>
                </button>
                <button type="button" class="toolbar-btn" @click="insertTable()" title="表格">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,3V21H21V3H3M19,19H5V5H19V19M6.5,7.5H9.5V10.5H6.5V7.5M11,7.5H14V10.5H11V7.5M15.5,7.5H18.5V10.5H15.5V7.5M6.5,12H9.5V15H6.5V12M11,12H14V15H11V12M15.5,12H18.5V15H15.5V12M6.5,16.5H9.5V19.5H6.5V16.5M11,16.5H14V19.5H11V16.5M15.5,16.5H18.5V19.5H15.5V16.5Z"/>
                  </svg>
                </button>
              </div>
              
              <div class="toolbar-divider"></div>
              
              <div class="toolbar-group">
                <button type="button" class="toolbar-btn" @click="insertMarkdown('[', '](url)')" title="链接">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H6.9C3.29 7 .4 9.89.4 13.5s2.89 6.5 6.5 6.5h4v-1.9H6.9c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9.1-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c3.61 0 6.5-2.89 6.5-6.5S20.71 7 17.1 7z"/>
                  </svg>
                </button>
                <button type="button" class="toolbar-btn" @click="insertMarkdown('![', '](url)')" title="图片">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                </button>
                <button type="button" class="toolbar-btn" @click="insertMarkdown('---\n', '')" title="分割线">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13H5v-2h14v2z"/>
                  </svg>
                </button>
              </div>
              
              <div class="toolbar-divider"></div>
              
              <div class="toolbar-group">
                <button type="button" class="toolbar-btn" @click="undoAction()" title="撤销" :disabled="!canUndo">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
                  </svg>
                </button>
                <button type="button" class="toolbar-btn" @click="redoAction()" title="重做" :disabled="!canRedo">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/>
                  </svg>
                </button>
              </div>
            </div>
            <textarea
              ref="contentTextarea"
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
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
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
const contentTextarea = ref<HTMLTextAreaElement | null>(null)
const activeTab = ref<'write' | 'preview'>('write')
const saving = ref(false)
const error = ref('')

// 编辑器历史记录
const history = ref<string[]>([])
const historyIndex = ref(-1)
const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < history.value.length - 1)

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

function saveToHistory() {
  if (history.value.length === 0 || history.value[historyIndex.value] !== form.value.content) {
    history.value = history.value.slice(0, historyIndex.value + 1)
    history.value.push(form.value.content)
    historyIndex.value = history.value.length - 1
    
    // 限制历史记录数量
    if (history.value.length > 50) {
      history.value.shift()
      historyIndex.value--
    }
  }
}

function insertMarkdown(before: string, after: string) {
  const textarea = contentTextarea.value
  if (!textarea) return
  
  saveToHistory()
  
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = form.value.content.substring(start, end)
  
  const newText = before + selectedText + after
  form.value.content = form.value.content.substring(0, start) + newText + form.value.content.substring(end)
  
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
  })
}

function insertList(prefix: string) {
  const textarea = contentTextarea.value
  if (!textarea) return
  
  saveToHistory()
  
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = form.value.content.substring(start, end)
  
  const lines = selectedText.split('\n')
  const newLines = lines.map(line => line.trim() ? prefix + line : line)
  const newText = newLines.join('\n')
  
  form.value.content = form.value.content.substring(0, start) + newText + form.value.content.substring(end)
  
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start, start + newText.length)
  })
}

function insertCodeBlock() {
  const textarea = contentTextarea.value
  if (!textarea) return
  
  saveToHistory()
  
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = form.value.content.substring(start, end)
  
  const codeBlock = `\n\`\`\`\n${selectedText || '请输入代码'}\n\`\`\`\n`
  form.value.content = form.value.content.substring(0, start) + codeBlock + form.value.content.substring(end)
  
  nextTick(() => {
    textarea.focus()
    const newStart = start + 5 // 在```后面
    textarea.setSelectionRange(newStart, newStart)
  })
}

function insertTable() {
  const textarea = contentTextarea.value
  if (!textarea) return
  
  saveToHistory()
  
  const start = textarea.selectionStart
  const table = `\n| 列1 | 列2 | 列3 |\n|------|------|------|\n| 内容1 | 内容2 | 内容3 |\n| 内容4 | 内容5 | 内容6 |\n`
  
  form.value.content = form.value.content.substring(0, start) + table + form.value.content.substring(start)
  
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + 3, start + 5) // 选中第一个列标题
  })
}

function undoAction() {
  if (canUndo.value) {
    historyIndex.value--
    form.value.content = history.value[historyIndex.value]
    nextTick(() => {
      if (contentTextarea.value) {
        contentTextarea.value.focus()
      }
    })
  }
}

function redoAction() {
  if (canRedo.value) {
    historyIndex.value++
    form.value.content = history.value[historyIndex.value]
    nextTick(() => {
      if (contentTextarea.value) {
        contentTextarea.value.focus()
      }
    })
  }
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
  
  // 初始化历史记录
  history.value = [form.value.content]
  historyIndex.value = 0
})

onUnmounted(() => {
  // 清理监听器
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

.markdown-toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: var(--border-color);
  margin: 0 0.25rem;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  transition: var(--transition);
  color: var(--text-color);
}

.toolbar-btn:hover:not(:disabled) {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar-btn svg {
  width: 16px;
  height: 16px;
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