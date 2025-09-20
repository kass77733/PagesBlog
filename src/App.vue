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
import HeaderNav from '@/components/HeaderNav.vue'
import FooterNav from '@/components/FooterNav.vue'
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