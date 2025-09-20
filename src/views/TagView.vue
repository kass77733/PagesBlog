<template>
  <div class="tag-page">
    <div class="page-header">
      <h1 class="page-title">标签：{{ tagName }}</h1>
      <p class="page-subtitle">共 {{ articles.length }} 篇文章</p>
    </div>

    <div class="articles-container">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在加载文章...</p>
      </div>

      <div v-else-if="articles.length > 0" class="articles-grid">
        <ArticleCard 
          v-for="article in articles" 
          :key="article.id"
          :article="article"
        />
      </div>

      <div v-else class="empty-state">
        <p>该标签下暂无文章</p>
        <router-link to="/" class="btn btn-primary">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import ArticleCard from '@/components/ArticleCard.vue'

const route = useRoute()
const blogStore = useBlogStore()

const tagName = computed(() => route.params.tag as string)
const loading = ref(false)

const articles = computed(() => {
  return blogStore.articles.filter(article => 
    article.tags.includes(tagName.value)
  )
})

async function loadArticles() {
  loading.value = true
  try {
    await blogStore.fetchArticles(1, 100) // 获取所有文章进行筛选
  } catch (error) {
    console.error('加载文章失败:', error)
  } finally {
    loading.value = false
  }
}

watch(() => route.params.tag, () => {
  loadArticles()
})

onMounted(() => {
  loadArticles()
})
</script>

<style scoped>
.tag-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.page-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: var(--text-color);
}

.page-subtitle {
  margin: 0;
  color: var(--text-light);
}

.articles-container {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
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
  color: var(--text-light);
}

@media (max-width: 768px) {
  .articles-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .page-header {
    padding: 1rem;
  }
  
  .articles-container {
    padding: 1rem;
  }
}
</style>