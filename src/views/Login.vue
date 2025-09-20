<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1 class="login-title">管理员登录</h1>
          <p class="login-subtitle">请输入您的管理员账号</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username" class="form-label">用户名</label>
            <input
              id="username"
              v-model="username"
              type="text"
              class="form-control"
              placeholder="请输入用户名"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">密码</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-control"
              placeholder="请输入密码"
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
          <p>默认在Page环境变量中</p>
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
const username = ref('')
const password = ref('')
const submitting = ref(false)
const error = ref('')

// 方法
async function handleLogin() {
  if (!username.value.trim() || !password.value.trim()) {
    error.value = '请输入用户名和密码'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    const success = await blogStore.login(username.value.trim(), password.value.trim())
    
    if (success) {
      // 登录成功，跳转到管理后台
      await router.push('/admin')
    } else {
      error.value = '用户名或密码错误'
    }
  } catch (err) {
    error.value = '登录失败，请检查网络连接'
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

.form-group {
  margin-bottom: 1rem;
}

.form-group:last-of-type {
  margin-bottom: 0;
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