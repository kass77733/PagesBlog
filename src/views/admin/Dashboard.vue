<template>
  <div class="admin-dashboard">
    <!-- 顶部导航 -->
    <div class="admin-header">
      <h1 class="admin-title">管理后台</h1>
      <div class="admin-actions">
        <router-link to="/admin/articles/new" class="btn btn-primary">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          新建文章
        </router-link>
        <button class="btn btn-secondary" @click="handleLogout">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          退出登录
        </button>
      </div>
    </div>

    <div class="admin-content">
      <!-- 侧边栏导航 -->
      <nav class="admin-sidebar">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/admin" class="nav-link" active-class="active">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              仪表盘
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/articles" class="nav-link" active-class="active">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
              </svg>
              文章管理
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/comments" class="nav-link" active-class="active">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              评论管理
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/settings" class="nav-link" active-class="active">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              系统设置
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- 主要内容区域 -->
      <main class="admin-main">
        <!-- 这里渲染子路由 -->
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'

const router = useRouter()
const blogStore = useBlogStore()

// 计算属性
const articles = computed(() => blogStore.articles)
const comments = computed(() => blogStore.comments)
const categories = computed(() => blogStore.categories)
const tags = computed(() => blogStore.tags)

// 方法
function handleLogout() {
  if (confirm('确定要退出登录吗？')) {
    blogStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.admin-dashboard {
  height: calc(100vh - 64px); /* 减去头部高度 */
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

.admin-title {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-color);
}

.admin-actions {
  display: flex;
  gap: 1rem;
}

.admin-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.admin-sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  border-bottom: 1px solid var(--border-color);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: var(--text-color);
  transition: var(--transition);
}

.nav-link:hover,
.nav-link.active {
  background: #f8f9fa;
  color: var(--primary-color);
  border-left: 3px solid var(--primary-color);
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.admin-main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  display: flex;
  overflow: hidden;
  transition: var(--transition);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-content {
  flex: 1;
  padding: 1rem;
}

.stat-title {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: var(--text-light);
  font-weight: 500;
}

.stat-value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
}

.section-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: var(--text-color);
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
  display: inline-block;
}

.recent-activity {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.activity-item:hover {
  background: #f8f9fa;
}

.activity-icon {
  width: 40px;
  height: 40px;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  flex-shrink: 0;
}

.activity-icon svg {
  width: 20px;
  height: 20px;
}

.activity-content {
  flex: 1;
}

.activity-title {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: var(--text-color);
  font-weight: 500;
}

.activity-description {
  margin: 0 0 0.25rem 0;
  color: var(--text-light);
  font-size: 0.9rem;
}

.activity-time {
  color: var(--text-light);
  font-size: 0.8rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .admin-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .admin-content {
    flex-direction: column;
  }
  
  .admin-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }
  
  .admin-main {
    padding: 1rem;
  }
  
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
  
  .admin-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>