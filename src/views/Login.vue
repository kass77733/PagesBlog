<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1 class="login-title">管理员登录</h1>
          <p class="login-subtitle">请输入您的管理员 Token</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="token" class="form-label">管理员 Token</label>
            <input
              id="token"
              v-model="token"
              type="password"
              class="form-control"
              placeholder="请输入您的管理员 Token"
              required
            >
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="submitting"
            >
              <span v-if="submitting" class="loading"></span>
              {{ submitting ? '登录中...' : '登录' }}
            </button>
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>

        <div class="login-footer">
          <p>忘记 Token？请联系博客管理员获取。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'

const router = useRouter()
const blogStore = useBlogStore()

// 响应式数据
const token = ref('')
const submitting = ref(false)
const error = ref('')

// 方法
async function handleLogin() {
  if (!token.value.trim()) {
    error.value = '请输入管理员 Token'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    // 验证 token（在实际应用中会调用 API 验证）
    // 这里我们假设任何非空 token 都是有效的
    blogStore.login(token.value.trim())
    
    // 登录成功，跳转到管理后台
    router.push('/admin')
  } catch (err) {
    error.value = '登录失败，请检查您的 Token 是否正确'
    console.error('登录失败:', err)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px - 100px); /* 减去头部和底部高度 */
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  color: var(--text-color);
}

.login-subtitle {
  margin: 0;
  color: var(--text-light);
  font-size: 1rem;
}

.login-form {
  margin-bottom: 1.5rem;
}

.form-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 500;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fff5f5;
  color: #c0392b;
  border-radius: var(--border-radius);
  text-align: center;
  font-size: 0.9rem;
}

.login-footer {
  text-align: center;
  color: var(--text-light);
  font-size: 0.9rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
}

.login-footer p {
  margin: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .login-page {
    padding: 1rem;
    min-height: calc(100vh - 64px - 50px);
  }
  
  .login-card {
    padding: 1.5rem;
  }
  
  .login-title {
    font-size: 1.5rem;
  }
}
</style>