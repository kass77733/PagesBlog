# 本地开发指南

本指南将帮助您在本地环境中开发和测试博客系统，而无需依赖 Cloudflare 的实际部署环境。

## 本地开发环境设置

### 1. 安装依赖

确保您已经安装了所有必要的依赖：

```bash
npm install
```

### 2. 本地开发模式

我们提供了几种本地开发模式：

#### 模式一：仅前端开发（默认 Vite 开发服务器）
```bash
npm run dev
```
这将启动 Vite 开发服务器，通常在 http://localhost:3000

#### 模式二：前端 + 模拟 API 服务器
```bash
npm run dev:both
```
这将同时启动：
- Vite 开发服务器（http://localhost:3000）
- 模拟 API 服务器（http://localhost:3001）

### 3. 本地开发服务器功能

本地模拟服务器 (`mock-server.js`) 提供以下功能：

1. **完整的 API 模拟**：模拟所有 Cloudflare Functions API 端点
2. **数据持久化**：在服务器运行期间保持数据一致性
3. **CORS 支持**：正确处理跨域请求
4. **静态文件服务**：提供前端静态资源

## API 端点

本地模拟服务器提供以下 API 端点：

### 文章相关
- `GET /functions/articles` - 获取文章列表
- `GET /functions/articles/:id` - 获取单篇文章
- `POST /functions/articles` - 创建文章
- `PUT /functions/articles/:id` - 更新文章
- `DELETE /functions/articles/:id` - 删除文章
- `GET /functions/articles/category/:category` - 按分类获取文章
- `GET /functions/articles/tag/:tag` - 按标签获取文章
- `GET /functions/articles/search` - 搜索文章

### 评论相关
- `GET /functions/comments/:articleId` - 获取文章评论
- `POST /functions/comments/:articleId` - 添加评论
- `DELETE /functions/comments/:articleId/:commentId` - 删除评论

### 配置相关
- `GET /functions/config` - 获取配置
- `POST /functions/config` - 更新配置

### 分类和标签
- `GET /functions/categories` - 获取所有分类
- `POST /functions/categories` - 更新分类
- `GET /functions/tags` - 获取所有标签
- `POST /functions/tags` - 更新标签

### 身份验证
- `POST /functions/auth/verify` - 验证管理员 token

## 本地开发工作流程

### 1. 启动开发环境

```bash
# 启动前端和模拟 API 服务器
npm run dev:both
```

### 2. 访问应用

打开浏览器访问 http://localhost:3000

### 3. 测试 API 功能

您可以直接在浏览器中测试 API 端点：

```bash
# 获取文章列表
curl http://localhost:3001/functions/articles

# 获取单篇文章
curl http://localhost:3001/functions/articles/1

# 获取分类列表
curl http://localhost:3001/functions/categories
```

### 4. 管理员登录

在本地开发环境中，您可以使用任意 token 登录后台管理界面。默认情况下，任何 token 都会被验证为有效。

## 数据管理

### 模拟数据

本地模拟服务器包含以下初始数据：

1. **文章**：
   - 2 篇示例文章

2. **评论**：
   - 1 条示例评论

3. **分类**：
   - 技术
   - 生活
   - 杂谈

4. **标签**：
   - Vue
   - React
   - Cloudflare
   - 生活

5. **配置**：
   - 站点名称：天空蓝博客
   - 描述：一个现代化的个人博客系统
   - 主题色：#87CEEB

### 数据持久化

请注意，本地模拟服务器的数据仅在服务器运行期间保持。当服务器停止时，所有数据将丢失。如果需要持久化数据，您可以修改 `mock-server.js` 文件，将数据保存到文件或数据库中。

## 环境变量

本地开发环境支持以下环境变量：

- `ADMIN_TOKEN`：管理员 token（在本地开发中任何 token 都有效）

## 调试技巧

### 1. 查看 API 响应

使用浏览器开发者工具的 Network 面板查看 API 请求和响应。

### 2. 直接测试 API

使用 curl 或 Postman 直接测试 API 端点：

```bash
# 获取文章列表
curl http://localhost:3001/functions/articles

# 创建新文章
curl -X POST http://localhost:3001/functions/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"新文章","content":"文章内容","category":"技术","tags":["Vue"]}'
```

### 3. 查看服务器日志

本地模拟服务器会在控制台输出日志信息，帮助您调试问题。

## 部署前测试

在部署到 Cloudflare Pages 之前，建议：

1. 使用 `npm run build` 构建生产版本
2. 使用 `npm run preview` 预览生产版本
3. 确保所有功能在生产构建中正常工作

## 故障排除

### 1. API 请求失败

如果遇到 API 请求失败，请检查：

1. 确保 `npm run dev:both` 命令已正确启动
2. 检查浏览器开发者工具中的网络请求
3. 确认 API 端点 URL 是否正确

### 2. 端口冲突

如果端口 3000 或 3001 被占用，您可以修改 `vite.config.ts` 和 `mock-server.js` 中的端口配置。

### 3. 代理问题

如果遇到代理问题，请检查 `vite.config.ts` 中的代理配置是否正确。