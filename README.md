# 天空蓝博客

一个现代化、响应式的个人静态博客系统，采用 Vue 3 + Vite 构建，部署在 Cloudflare Pages 上，使用 Cloudflare KV 作为数据存储。

## 功能特性

### 前台功能
- 🏠 首页文章卡片展示
- 📖 文章详情页（Markdown 渲染）
- 💬 评论系统
- 📂 分类和标签浏览
- 🔍 文章搜索（支持标题、内容、分类、标签搜索）
- 📱 响应式设计，完美支持移动端
- 🖼️ 自定义 Banner 背景图片
- 🔗 可配置的社交媒体链接

### 后台功能
- 🔐 管理员登录（Token 验证）
- 📊 仪表盘（统计信息、最新文章、最新评论）
- 📝 文章管理（增删改查，支持 Markdown 编辑器）
- 💬 评论管理（查看、删除评论）
- 🏷️ 分类/标签管理
- ⚙️ 系统配置（站点信息、主题颜色、社交链接等）

### 技术特性
- 🚀 基于 Vue 3 + Vite 构建
- ☁️ 部署在 Cloudflare Pages
- 💾 使用 Cloudflare KV 存储数据
- 📱 PWA 支持（可安装为 Web App）
- 🎨 可自定义主题颜色
- ✏️ 轻量级 Markdown 编辑器

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

### 1. 基础部署
1. 将代码推送到 GitHub/GitLab
2. 在 Cloudflare Pages 控制台创建新项目
3. 连接您的 Git 仓库
4. 设置构建配置：
   - 构建命令: `npm run build`
   - 构建输出目录: `dist`
5. 绑定 KV Namespace:
   - 变量名称: `BLOG_DATA`
   - KV namespace: (选择或创建一个 KV namespace)

### 2. 环境变量配置
在 Cloudflare Pages 控制台的 Settings > Environment variables 中设置以下变量：

#### 必需的环境变量
- `ADMIN_USERNAME` - 管理员用户名（默认: admin）
- `ADMIN_PASSWORD` - 管理员密码（默认: admin123）
- `ADMIN_TOKEN` - 管理员访问令牌（默认: admin-token-2024）

#### 安全建议
- 使用强密码和随机令牌
- 定期更换凭据
- 不要在代码中硬编码凭据

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

## 系统配置

部署完成后，访问 `/login` 页面使用管理员账号登录，然后进入系统设置页面进行配置：

### 基本设置
- **博客名称**: 网站标题
- **博客描述**: 网站描述（用于 SEO）
- **主题颜色**: 自定义网站主色调
- **Banner图片URL**: 首页横幅背景图片

### 社交媒体
- **GitHub链接**: 显示在页脚的 GitHub 链接
- **Twitter链接**: 显示在页脚的 Twitter 链接

### 内容管理
- **分类管理**: 添加/删除文章分类
- **标签管理**: 添加/删除文章标签

## 使用指南

### 文章编辑
- 支持 Markdown 语法
- 内置轻量级编辑器工具栏
- 实时预览功能
- 自动生成文章摘要

### 评论系统
- 访客可以发表评论
- 管理员可以在后台管理评论
- 支持删除不当评论

## 故障排除

### 常见问题

1. **登录失败**: 检查环境变量是否正确设置
2. **API 请求失败**: 确保 KV Namespace 正确绑定
3. **主题颜色不生效**: 清除浏览器缓存后重试
4. **移动端菜单问题**: 确保使用最新版本的代码

### 数据备份

建议定期备份 Cloudflare KV 中的数据：
- 文章数据: `articles:*`
- 评论数据: `comments:*`
- 配置数据: `config`, `categories`, `tags`

## 更新日志

### v2.0.0
- ✨ 新增仪表盘统计功能
- ✨ 新增 Markdown 编辑器工具栏
- ✨ 新增自定义 Banner 图片功能
- ✨ 新增社交媒体链接配置
- ✨ 优化移动端体验
- ✨ 新增主题颜色自定义功能
- 🐛 修复搜索功能
- 🐛 修复评论管理功能
- 🐛 修复各种 API 接口问题

### v1.0.0
- 🎉 初始版本发布
- ✨ 基础博客功能
- ✨ 文章管理
- ✨ 评论系统
- ✨ PWA 支持

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。

## 致谢

感谢以下技术和服务：
- [Vue.js](https://vuejs.org/) - 前端框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Cloudflare Pages](https://pages.cloudflare.com/) - 部署平台
- [Cloudflare KV](https://developers.cloudflare.com/workers/runtime-apis/kv/) - 数据存储