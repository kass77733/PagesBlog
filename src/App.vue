<template>
  <div id="app">
    <HeaderNav />
    <main class="main-content">
      <router-view />
    </main>
    <FooterNav />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useBlogStore } from '@/stores/blog'
import HeaderNav from '@/components/HeaderNav.vue'
import FooterNav from '@/components/FooterNav.vue'

const blogStore = useBlogStore()

function updateThemeColor(color: string) {
  document.documentElement.style.setProperty('--primary-color', color)
  const darkColor = adjustBrightness(color, -20)
  document.documentElement.style.setProperty('--primary-dark', darkColor)
}

function adjustBrightness(hex: string, percent: number) {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
}

onMounted(async () => {
  // 初始化时获取配置并应用主题颜色
  await blogStore.fetchConfig()
  if (blogStore.config.themeColor) {
    updateThemeColor(blogStore.config.themeColor)
  }
})
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.main-content {
  flex: 1;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
}
</style>