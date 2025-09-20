<template>
  <div class="admin-settings">
    <div class="admin-header">
      <h1 class="admin-title">系统设置</h1>
      <div class="admin-actions">
        <button 
          class="btn btn-primary"
          @click="handleSave"
          :disabled="saving"
        >
          <span v-if="saving" class="loading"></span>
          {{ saving ? '保存中...' : '保存设置' }}
        </button>
      </div>
    </div>

    <form @submit.prevent="handleSave" class="settings-form">
      <!-- 基本设置 -->
      <div class="form-section">
        <h2 class="section-title">基本设置</h2>
        
        <div class="form-group">
          <label for="siteName" class="form-label">博客名称</label>
          <input
            id="siteName"
            v-model="form.siteName"
            type="text"
            class="form-control"
            placeholder="请输入博客名称"
          >
        </div>
        
        <div class="form-group">
          <label for="description" class="form-label">博客描述</label>
          <textarea
            id="description"
            v-model="form.description"
            class="form-control textarea"
            placeholder="请输入博客描述"
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="themeColor" class="form-label">主题颜色</label>
          <div class="color-picker">
            <input
              id="themeColor"
              v-model="form.themeColor"
              type="color"
              class="color-input"
            >
            <input
              v-model="form.themeColor"
              type="text"
              class="form-control color-text"
              placeholder="#87CEEB"
            >
          </div>
        </div>
      </div>

      <!-- 分类管理 -->
      <div class="form-section">
        <h2 class="section-title">分类管理</h2>
        
        <div class="form-group">
          <label class="form-label">现有分类</label>
          <div class="tags-container">
            <span 
              v-for="category in form.categories" 
              :key="category"
              class="tag category-tag"
            >
              {{ category }}
              <button 
                type="button"
                class="remove-tag"
                @click="removeCategory(category)"
              >
                ×
              </button>
            </span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="newCategory" class="form-label">添加新分类</label>
          <div class="input-group">
            <input
              id="newCategory"
              v-model="newCategory"
              type="text"
              class="form-control"
              placeholder="输入新分类名称"
              @keyup.enter="addCategory"
            >
            <button 
              type="button"
              class="btn btn-secondary"
              @click="addCategory"
            >
              添加
            </button>
          </div>
        </div>
      </div>

      <!-- 标签管理 -->
      <div class="form-section">
        <h2 class="section-title">标签管理</h2>
        
        <div class="form-group">
          <label class="form-label">现有标签</label>
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
          </div>
        </div>
        
        <div class="form-group">
          <label for="newTag" class="form-label">添加新标签</label>
          <div class="input-group">
            <input
              id="newTag"
              v-model="newTag"
              type="text"
              class="form-control"
              placeholder="输入新标签名称"
              @keyup.enter="addTag"
            >
            <button 
              type="button"
              class="btn btn-secondary"
              @click="addTag"
            >
              添加
            </button>
          </div>
        </div>
      </div>

      <!-- 管理员设置 -->
      <div class="form-section">
        <h2 class="section-title">管理员设置</h2>
        
        <div class="form-group">
          <label for="adminToken" class="form-label">管理员 Token</label>
          <div class="input-group">
            <input
              id="adminToken"
              v-model="form.adminToken"
              :type="showToken ? 'text' : 'password'"
              class="form-control"
              placeholder="请输入管理员 Token"
            >
            <button 
              type="button"
              class="btn btn-secondary"
              @click="showToken = !showToken"
            >
              {{ showToken ? '隐藏' : '显示' }}
            </button>
          </div>
          <p class="form-help">用于登录管理后台的 Token，请妥善保管</p>
        </div>
      </div>
    </form>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- 成功提示 -->
    <div v-if="success" class="success-message">
      设置已保存成功！
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useBlogStore } from '@/stores/blog'
import type { BlogConfig } from '@/types'

const blogStore = useBlogStore()

// 响应式数据
const form = reactive({
  siteName: '',
  description: '',
  themeColor: '#87CEEB',
  categories: [] as string[],
  tags: [] as string[],
  adminToken: ''
})

const newCategory = ref('')
const newTag = ref('')
const showToken = ref(false)
const saving = ref(false)
const error = ref('')
const success = ref(false)

// 方法
function addCategory() {
  const category = newCategory.value.trim()
  if (category && !form.categories.includes(category)) {
    form.categories.push(category)
    newCategory.value = ''
  }
}

function removeCategory(category: string) {
  form.categories = form.categories.filter(c => c !== category)
}

function addTag() {
  const tag = newTag.value.trim()
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
    newTag.value = ''
  }
}

function removeTag(tag: string) {
  form.tags = form.tags.filter(t => t !== tag)
}

async function handleSave() {
  saving.value = true
  error.value = ''
  success.value = false

  try {
    // 保存博客配置
    await blogStore.updateConfig({
      siteName: form.siteName,
      description: form.description,
      themeColor: form.themeColor
    })

    // 保存分类和标签
    // 在实际应用中，这些应该通过 API 保存
    console.log('保存分类:', form.categories)
    console.log('保存标签:', form.tags)

    success.value = true
    
    // 3秒后隐藏成功提示
    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch (err) {
    error.value = '保存设置失败'
    console.error('保存设置失败:', err)
  } finally {
    saving.value = false
  }
}

// 生命周期
onMounted(async () => {
  // 获取当前配置
  await blogStore.fetchConfig()
  await blogStore.fetchCategories()
  await blogStore.fetchTags()
  
  // 初始化表单数据
  form.siteName = blogStore.config.siteName
  form.description = blogStore.config.description
  form.themeColor = blogStore.config.themeColor
  
  // 初始化分类和标签
  form.categories = [...blogStore.categories]
  form.tags = [...blogStore.tags]
  
  // 管理员 Token 不应该从服务器获取，这里只是示例
  form.adminToken = localStorage.getItem('adminToken') || ''
})
</script>

<style scoped>
.admin-settings {
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

.color-picker {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.color-input {
  width: 60px;
  height: 44px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
}

.color-text {
  flex: 1;
}

.input-group {
  display: flex;
  gap: 1rem;
}

.input-group .form-control {
  flex: 1;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
}

.category-tag {
  background: #3498db;
}

.form-help {
  margin: 0.5rem 0 0 0;
  color: var(--text-light);
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

.success-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #f0fff4;
  color: #27ae60;
  border-radius: var(--border-radius);
  text-align: center;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .admin-settings {
    padding: 1rem;
  }
  
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .color-picker {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .input-group {
    flex-direction: column;
  }
}
</style>