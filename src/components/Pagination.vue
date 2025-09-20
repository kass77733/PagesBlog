<template>
  <div class="pagination" v-if="totalPages > 1">
    <button 
      class="pagination-btn"
      :disabled="currentPage === 1"
      @click="$emit('update:page', 1)"
    >
      首页
    </button>
    
    <button 
      class="pagination-btn"
      :disabled="currentPage === 1"
      @click="$emit('update:page', currentPage - 1)"
    >
      <svg class="pagination-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      上一页
    </button>
    
    <!-- 页码显示 -->
    <div class="page-numbers">
      <template v-for="page in visiblePages" :key="page">
        <button
          v-if="page !== '...'"
          class="pagination-btn page-number"
          :class="{ active: page === currentPage }"
          @click="$emit('update:page', page)"
        >
          {{ page }}
        </button>
        <span v-else class="pagination-ellipsis">{{ page }}</span>
      </template>
    </div>
    
    <button 
      class="pagination-btn"
      :disabled="currentPage === totalPages"
      @click="$emit('update:page', currentPage + 1)"
    >
      下一页
      <svg class="pagination-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </button>
    
    <button 
      class="pagination-btn"
      :disabled="currentPage === totalPages"
      @click="$emit('update:page', totalPages)"
    >
      末页
    </button>
    
    <!-- 页面信息 -->
    <div class="pagination-info">
      第 {{ currentPage }} 页，共 {{ totalPages }} 页
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
  maxVisiblePages?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxVisiblePages: 5
})

defineEmits<{
  (e: 'update:page', page: number): void
}>()

// 计算可见页码
const visiblePages = computed(() => {
  const pages: (number | '...')[] = []
  const { currentPage, totalPages, maxVisiblePages } = props
  
  if (totalPages <= maxVisiblePages) {
    // 如果总页数小于等于最大可见页数，显示所有页码
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // 否则计算要显示的页码
    const sidePages = Math.floor(maxVisiblePages / 2)
    let startPage = Math.max(1, currentPage - sidePages)
    let endPage = Math.min(totalPages, currentPage + sidePages)
    
    // 调整起始和结束页码，确保显示足够的页码
    if (startPage === 1) {
      endPage = maxVisiblePages
    } else if (endPage === totalPages) {
      startPage = totalPages - maxVisiblePages + 1
    }
    
    // 添加起始页码
    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) {
        pages.push('...')
      }
    }
    
    // 添加中间页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    // 添加结束页码
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }
  }
  
  return pages
})
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 2rem 0;
  padding: 1rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-color);
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  transform: translateY(-1px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  font-weight: 500;
}

.page-number {
  min-width: 40px;
  justify-content: center;
}

.pagination-ellipsis {
  padding: 0.5rem;
  color: var(--text-light);
}

.pagination-icon {
  width: 16px;
  height: 16px;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.pagination-info {
  color: var(--text-light);
  font-size: 0.9rem;
  margin-left: 1rem;
  white-space: nowrap;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .pagination {
    gap: 0.25rem;
    padding: 0.75rem;
  }
  
  .pagination-btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .pagination-info {
    margin-left: 0;
    font-size: 0.8rem;
    width: 100%;
    text-align: center;
    margin-top: 0.5rem;
  }
  
  .pagination-ellipsis {
    display: none;
  }
}
</style>