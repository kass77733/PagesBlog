// src/utils/pwaRegister.ts
import { registerSW } from 'virtual:pwa-register'

// 每小时检查一次更新
const intervalMS = 60 * 60 * 1000

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('有新内容可用，请刷新页面以获取最新版本')
    // 可以显示一个提示让用户选择是否刷新
    if (confirm('有新版本可用，是否立即更新？')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('应用已可以离线使用')
  },
  onRegistered(swRegistration) {
    console.log('SW registered: ', swRegistration)
    
    // 定期检查更新
    if (swRegistration?.active && intervalMS > 0) {
      setInterval(() => {
        swRegistration.update()
      }, intervalMS)
    }
  },
  onRegisterError(error) {
    console.log('SW registration error', error)
  }
})

// 手动检查更新的函数
export function checkForUpdates() {
  updateSW()
}

// 离线状态检测
window.addEventListener('online', () => {
  console.log('网络已连接')
  document.body.classList.remove('offline')
})

window.addEventListener('offline', () => {
  console.log('网络已断开')
  document.body.classList.add('offline')
  
  // 显示离线提示
  const offlineToast = document.createElement('div')
  offlineToast.className = 'offline-toast'
  offlineToast.textContent = '当前处于离线状态'
  document.body.appendChild(offlineToast)
  
  // 3秒后自动隐藏提示
  setTimeout(() => {
    if (offlineToast.parentNode) {
      offlineToast.parentNode.removeChild(offlineToast)
    }
  }, 3000)
})

// 添加离线提示样式
const style = document.createElement('style')
style.textContent = `
  .offline-toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 10000;
    font-size: 14px;
  }
  
  body.offline .offline-indicator {
    display: block;
  }
  
  .offline-indicator {
    display: none;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 10px;
    text-align: center;
    margin: 10px 0;
    color: #6c757d;
  }
`
document.head.appendChild(style)