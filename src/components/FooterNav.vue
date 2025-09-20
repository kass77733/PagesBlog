<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <!-- 博客信息 -->
        <div class="footer-section">
          <h3 class="footer-title">{{ config.siteName }}</h3>
          <p class="footer-description">{{ config.description }}</p>
          <div class="social-links" v-if="config.githubUrl || config.twitterUrl || config.telegramUrl || config.facebookUrl || config.instagramUrl">
            <a v-if="config.githubUrl" :href="config.githubUrl" target="_blank" class="social-link" title="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a v-if="config.twitterUrl" :href="config.twitterUrl" target="_blank" class="social-link" title="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a v-if="config.telegramUrl" :href="config.telegramUrl" target="_blank" class="social-link" title="Telegram">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
            <a v-if="config.facebookUrl" :href="config.facebookUrl" target="_blank" class="social-link" title="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a v-if="config.instagramUrl" :href="config.instagramUrl" target="_blank" class="social-link" title="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>



        <!-- 最新文章 -->
        <div class="footer-section">
          <h4 class="footer-subtitle">最新文章</h4>
          <ul class="footer-links">
            <li v-for="article in recentArticles.slice(0, 3)" :key="article.id">
              <router-link :to="`/article/${article.id}`" class="footer-link">
                {{ article.title }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- 标签云 -->
        <div class="footer-section">
          <h4 class="footer-subtitle">热门标签</h4>
          <div class="tag-cloud">
            <router-link 
              v-for="tag in tags.slice(0, 8)" 
              :key="tag"
              :to="`/tag/${tag}`"
              class="footer-tag"
            >
              {{ tag }}
            </router-link>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="copyright">
          <p>&copy; {{ currentYear }} {{ config.siteName }}. All rights reserved.</p>
          <p class="powered-by">
            Powered by 
            <a href="https://vuejs.org" target="_blank" rel="noopener">Vue 3</a> 
            & 
            <a href="https://pages.cloudflare.com" target="_blank" rel="noopener">Cloudflare Pages</a>
          </p>
        </div>
        
        <!-- 回到顶部按钮 -->
        <button 
          v-show="showBackToTop"
          class="back-to-top"
          @click="scrollToTop"
          title="回到顶部"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
          </svg>
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useBlogStore } from '@/stores/blog'

const blogStore = useBlogStore()

// 响应式数据
const showBackToTop = ref(false)

// 计算属性
const config = computed(() => blogStore.config)
const categories = computed(() => blogStore.categories)
const tags = computed(() => blogStore.tags)
const recentArticles = computed(() => blogStore.recentArticles)
const currentYear = computed(() => new Date().getFullYear())

// 方法
function handleScroll() {
  showBackToTop.value = window.pageYOffset > 300
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 生命周期
onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  
  // 获取配置
  await blogStore.fetchConfig()
  
  // 如果还没有获取数据，则获取
  if (blogStore.categories.length === 0) {
    await blogStore.fetchCategories()
  }
  if (blogStore.tags.length === 0) {
    await blogStore.fetchTags()
  }
  if (blogStore.articles.length === 0) {
    await blogStore.fetchArticles(1, 5)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  margin-top: 4rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1rem 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin: 0;
}

.footer-subtitle {
  font-size: 1.1rem;
  font-weight: 500;
  color: #ecf0f1;
  margin: 0;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
  display: inline-block;
}

.footer-description {
  color: #bdc3c7;
  line-height: 1.6;
  margin: 0;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(135, 206, 235, 0.1);
  color: var(--primary-color);
  border-radius: 50%;
  transition: var(--transition);
  text-decoration: none;
}

.social-link:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

.social-link svg {
  width: 20px;
  height: 20px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  color: #bdc3c7;
  text-decoration: none;
  transition: var(--transition);
  padding: 0.25rem 0;
  display: block;
}

.footer-link:hover {
  color: var(--primary-color);
  padding-left: 0.5rem;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.footer-tag {
  padding: 0.25rem 0.75rem;
  background: rgba(135, 206, 235, 0.1);
  color: var(--primary-color);
  border-radius: 15px;
  font-size: 0.8rem;
  text-decoration: none;
  transition: var(--transition);
}

.footer-tag:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-1px);
}

.footer-bottom {
  border-top: 1px solid #34495e;
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  text-align: center;
  color: #95a5a6;
}

.copyright p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.powered-by a {
  color: var(--primary-color);
  text-decoration: none;
  transition: var(--transition);
}

.powered-by a:hover {
  color: white;
}

.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.back-to-top:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.back-to-top svg {
  width: 24px;
  height: 24px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }

  .back-to-top {
    bottom: 1rem;
    right: 1rem;
    width: 44px;
    height: 44px;
  }
}
</style>