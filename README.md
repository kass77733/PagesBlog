# 天空蓝博客

一个现代化、响应式的个人静态博客系统，采用 Vue 3 + Vite 构建，部署在 Cloudflare Pages 上，使用 Cloudflare KV 作为数据存储。

## 功能特性

### 前台功能
- 🏠 首页文章卡片展示
- 📖 文章详情页（Markdown 渲染）
- 💬 评论系统
- 📂 分类和标签浏览
- 🔍 文章搜索
- 📱 响应式设计，支持移动端

### 后台功能
- 🔐 管理员登录（Token 验证）
- 📝 文章管理（增删改查）
- 💬 评论管理
- 🏷️ 分类/标签管理
- ⚙️ 系统配置

### 技术特性
- 🚀 基于 Vue 3 + Vite 构建
- ☁️ 部署在 Cloudflare Pages
- 💾 使用 Cloudflare KV 存储数据
- 📱 PWA 支持（可安装为 Web App）
- 🎨 现代化 UI 设计（天空蓝主题）

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **样式**: CSS3 + CSS 变量
- **Markdown 渲染**: markdown-it
- **部署平台**: Cloudflare Pages
- **数据存储**: Cloudflare KV
- **PWA**: Workbox + Vite PWA 插件

## 本地开发

### 环境要求
- Node.js >= 16
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发模式

#### 仅前端开发（默认 Vite 开发服务器）
```bash
npm run dev
```

#### 前端 + 模拟 API 服务器（推荐）
```bash
npm run dev:both
```

这将同时启动：
- Vite 开发服务器（http://localhost:3000）
- 模拟 API 服务器（http://localhost:3001）

详细信息请参考 [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md)。

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 部署到 Cloudflare Pages

1. 将代码推送到 GitHub/GitLab
2. 在 Cloudflare Pages 控制台创建新项目
3. 连接您的 Git 仓库
4. 设置构建配置：
   - 构建命令: `npm run build`
   - 构建输出目录: `dist`
5. 绑定 KV Namespace:
   - 变量名称: `BLOG_DATA`
   - KV namespace: (选择或创建一个 KV namespace)

## Cloudflare KV 数据结构

### 文章
- Key: `articles:{id}`
- Value: 文章 JSON 对象

### 评论
- Key: `comments:{articleId}`
- Value: 评论数组

### 分类
- Key: `categories`
- Value: 分类数组

### 标签
- Key: `tags`
- Value: 标签数组

### 配置
- Key: `config`
- Value: 配置对象

## PWA 功能

本博客支持 PWA（渐进式 Web 应用），具有以下特性：
- 可安装为桌面/移动应用
- 离线访问缓存的文章
- 后台自动更新
- 响应式设计适配各种设备

## 目录结构

```
.
├── src/                 # 源代码目录
│   ├── assets/          # 静态资源
│   ├── components/      # Vue 组件
│   ├── router/          # 路由配置
│   ├── stores/          # Pinia 状态管理
│   ├── types/           # TypeScript 类型定义
│   ├── utils/           # 工具函数
│   └── views/           # 页面视图
├── functions/           # Cloudflare Functions
├── public/              # 静态公共资源
│   └── _routes.json     # Cloudflare Pages 路由配置
└── dist/                # 构建输出目录
```

## 开发指南

### 添加新功能
1. 在 `src/views/` 中创建新页面组件
2. 在 `src/router/index.ts` 中添加路由
3. 如需 API 支持，在 `functions/` 中添加相应的函数

### 自定义主题
- 修改 `src/assets/css/main.css` 中的 CSS 变量
- 更新 `public/manifest.json` 中的主题颜色

## 故障排除

### API 请求失败

如果部署后遇到 `SyntaxError: Unexpected token '<'` 错误，通常是由于 API 请求没有正确路由到 Cloudflare Functions。请确保：

1. `public/_routes.json` 文件存在且配置正确
2. Cloudflare Pages 项目已正确绑定 KV Namespace
3. Functions 文件结构正确

详细的问题解决方法请参考 [DEPLOYMENT_ISSUES.md](DEPLOYMENT_ISSUES.md) 文件。

### PWA 功能问题

1. 检查 `manifest.json` 是否正确配置
2. 确保 Service Worker 文件存在且正确
3. 验证 HTTPS 是否已启用（Cloudflare Pages 自动提供 HTTPS）

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。