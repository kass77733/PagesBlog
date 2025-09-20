<template>
  <header class="header">
    <div class="header-container">
      <!-- Logo 和站点名称 -->
      <div class="logo-section">
        <router-link to="/" class="logo-link">
          <div class="logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L20 9L13.09 15.74L12 22L10.91 15.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <span class="site-title">{{ config.siteName }}</span>
        </router-link>
      </div>

      <!-- 主导航 -->
      <nav class="main-nav" :class="{ 'nav-open': mobileNavOpen }">
        <router-link 
          to="/" 
          class="nav-link"
          @click="closeMobileNav"
        >
          首页
        </router-link>
        
        <div class="dropdown" @mouseenter="showCategoryDropdown = true" @mouseleave="showCategoryDropdown = false" @click="toggleCategoryDropdown">
          <span class="nav-link dropdown-trigger">
            分类
            <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <div class="dropdown-menu" v-show="showCategoryDropdown">
            <router-link 
              v-for="category in categories" 
              :key="category"
              :to="`/category/${category}`"
              class="dropdown-item"
              @click="closeMobileNav"
            >
              {{ category }}
            </router-link>
          </div>
        </div>

        <!-- 搜索框 -->
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索文章..."
            class="search-input"
            @keyup.enter="handleSearch"
          >
          <button class="search-btn" @click="handleSearch">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- 管理员入口 -->
        <router-link 
          v-if="!isAuthenticated" 
          to="/login" 
          class="nav-link admin-link"
          @click="closeMobileNav"
        >
          登录
        </router-link>
        <div v-else class="dropdown" @mouseenter="showAdminDropdown = true" @mouseleave="showAdminDropdown = false" @click="toggleAdminDropdown">
          <span class="nav-link dropdown-trigger admin-link">
            管理
            <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <div class="dropdown-menu" v-show="showAdminDropdown">
            <router-link to="/admin" class="dropdown-item" @click="closeMobileNav">仪表盘</router-link>
            <router-link to="/admin/articles" class="dropdown-item" @click="closeMobileNav">文章管理</router-link>
            <router-link to="/admin/comments" class="dropdown-item" @click="closeMobileNav">评论管理</router-link>
            <router-link to="/admin/settings" class="dropdown-item" @click="closeMobileNav">系统设置</router-link>
            <button class="dropdown-item logout-btn" @click="handleLogout">退出登录</button>
          </div>
        </div>
      </nav>

      <!-- 移动端菜单按钮 -->
      <button class="mobile-menu-btn" @click="toggleMobileNav">
        <span class="hamburger-line" :class="{ active: mobileNavOpen }"></span>
        <span class="hamburger-line" :class="{ active: mobileNavOpen }"></span>
        <span class="hamburger-line" :class="{ active: mobileNavOpen }"></span>
      </button>
    </div>

    <!-- 移动端遮罩 -->
    <div 
      v-if="mobileNavOpen" 
      class="mobile-overlay" 
      @click="closeMobileNav"
    ></div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'

const router = useRouter()
const blogStore = useBlogStore()

// 响应式数据
const searchQuery = ref('')
const mobileNavOpen = ref(false)
const showCategoryDropdown = ref(false)
const showAdminDropdown = ref(false)

// 计算属性
const config = computed(() => blogStore.config)
const categories = computed(() => blogStore.categories)
const isAuthenticated = computed(() => blogStore.isAuthenticated)

// 方法
function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'search',
      query: { q: searchQuery.value.trim() }
    })
    searchQuery.value = ''
    closeMobileNav()
  }
}

function toggleMobileNav() {
  mobileNavOpen.value = !mobileNavOpen.value
}

function closeMobileNav() {
  mobileNavOpen.value = false
  showCategoryDropdown.value = false
  showAdminDropdown.value = false
}

function toggleCategoryDropdown() {
  if (window.innerWidth <= 768) {
    showCategoryDropdown.value = !showCategoryDropdown.value
  }
}

function toggleAdminDropdown() {
  if (window.innerWidth <= 768) {
    showAdminDropdown.value = !showAdminDropdown.value
  }
}

function handleLogout() {
  blogStore.logout()
  router.push('/')
  closeMobileNav()
}

// 生命周期
onMounted(async () => {
  await blogStore.fetchConfig()
  await blogStore.fetchCategories()
})
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--text-color);
  gap: 0.75rem;
}

.logo {
  width: 32px;
  height: 32px;
  color: var(--primary-color);
  transition: var(--transition);
}

.logo:hover {
  transform: rotate(15deg) scale(1.1);
}

.site-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-link.router-link-active {
  color: var(--primary-color);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-color);
  border-radius: 1px;
}

.admin-link {
  color: var(--primary-color);
  font-weight: 600;
}

.dropdown {
  position: relative;
}

.dropdown-trigger {
  cursor: pointer;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  transition: var(--transition);
}

.dropdown:hover .dropdown-icon {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 0.5rem 0;
  min-width: 120px;
  z-index: 1000;
}

.dropdown-item {
  display: block;
  padding: 0.5rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  transition: var(--transition);
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f8f9fa;
  color: var(--primary-color);
}

.logout-btn {
  color: #e74c3c;
}

.logout-btn:hover {
  background: #fff5f5;
  color: #c0392b;
}

.search-box {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 20px;
  overflow: hidden;
  transition: var(--transition);
}

.search-box:focus-within {
  background: white;
  box-shadow: 0 0 0 2px rgba(135, 206, 235, 0.2);
}

.search-input {
  border: none;
  background: none;
  padding: 0.5rem 1rem;
  outline: none;
  font-size: 0.9rem;
  width: 200px;
}

.search-btn {
  border: none;
  background: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--text-light);
  transition: var(--transition);
  display: flex;
  align-items: center;
}

.search-btn:hover {
  color: var(--primary-color);
}

.search-btn svg {
  width: 18px;
  height: 18px;
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

.hamburger-line {
  width: 24px;
  height: 2px;
  background: var(--text-color);
  transition: var(--transition);
}

.hamburger-line.active:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger-line.active:nth-child(2) {
  opacity: 0;
}

.hamburger-line.active:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.mobile-overlay {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* 移动端样式 */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }

  .main-nav {
    position: fixed;
    top: 64px;
    right: 0;
    width: 280px;
    height: calc(100vh - 64px);
    background: white;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 2rem 0;
    box-shadow: var(--shadow);
    transform: translateX(100%);
    transition: var(--transition);
  }

  .main-nav.nav-open {
    transform: translateX(0);
  }

  .nav-link {
    padding: 1rem 2rem;
    border-bottom: 1px solid var(--border-color);
  }

  .nav-link:hover {
    background: #f8f9fa;
  }

  .dropdown-menu {
    position: static;
    box-shadow: none;
    border: none;
    background: #f8f9fa;
    margin: 0;
    display: block;
  }
  
  .dropdown {
    display: block;
  }

  .dropdown-item {
    padding: 0.75rem 3rem;
  }

  .search-box {
    margin: 0 2rem;
    border-radius: var(--border-radius);
  }

  .search-input {
    width: 100%;
  }
}
</style>