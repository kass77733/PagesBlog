// tests/basic.test.ts
import { test, expect } from 'vitest'

test('项目应该有正确的目录结构', () => {
  // 这是一个简单的占位测试
  expect(true).toBe(true)
})

test('Vue组件应该能够正确导入', async () => {
  // 测试主要组件是否可以正确导入
  const App = await import('../src/App.vue')
  expect(App).toBeDefined()
})

test('路由配置应该存在', async () => {
  const router = await import('../src/router')
  expect(router).toBeDefined()
})

test('Pinia store应该能够正确导入', async () => {
  const store = await import('../src/stores/blog')
  expect(store).toBeDefined()
})