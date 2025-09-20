# 部署指南

## 部署到 Cloudflare Pages 说明

## 部署步骤

1. 将代码推送到 GitHub 仓库
2. 在 Cloudflare Dashboard 中创建或配置 Pages 项目
3. 设置构建配置：
   - 构建命令: `npm run build`
   - 输出目录: `dist`
4. 设置环境变量：
   - `ADMIN_TOKEN`: 您的管理员令牌（用于保护管理 API）

## 重要配置

### 1. 路由配置
项目包含 `public/_routes.json` 文件，确保 Cloudflare Functions 路由正确：
```json
{
  "version": 1,
  "description": "Cloudflare Pages Routes Configuration",
  "include": ["/functions/*"],
  "exclude": []
}
```

### 2. Functions 结构
确保 `functions` 目录包含以下文件：
- `config.ts` - 博客配置管理
- `articles.ts` - 文章管理
- `comments.ts` - 评论管理
- `taxonomy.ts` - 分类和标签管理
- `auth.ts` - 身份验证
- `_middleware.ts` - 中间件

## 测试部署

部署完成后，您可以访问以下 URL 测试：

1. 获取配置：
   ```
   GET https://your-domain.pages.dev/functions/config
   ```

2. 更新配置（需要认证）：
   ```
   POST https://your-domain.pages.dev/functions/config
   Headers: 
     Authorization: Bearer YOUR_ADMIN_TOKEN
     Content-Type: application/json
   Body:
     {
       "siteName": "My Blog",
       "description": "My personal blog",
       "themeColor": "#87CEEB"
     }
   ```

## 故障排除

如果 Functions 不工作：

1. 检查 `_routes.json` 是否正确部署到根目录
2. 确保 Cloudflare Pages 项目设置正确
3. 验证环境变量是否已设置
4. 检查 Cloudflare Pages 构建日志是否有错误

## 本地开发

### 启动开发服务器

```bash
npm run dev
```

这将启动一个本地开发服务器，通常在 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

构建后的文件将位于 `dist/` 目录中

### 预览生产构建

```bash
npm run preview
```

这将在本地预览生产构建版本

## 环境配置

### 环境变量

- `ADMIN_TOKEN`: 管理员登录 Token
- `BLOG_DATA`: Cloudflare KV Namespace 绑定

### wrangler.toml 配置

如果你使用 wrangler 进行本地开发，确保配置文件包含：

```toml
name = "sky-blue-blog"
type = "javascript"
account_id = "your-account-id"
workers_dev = true

[vars]
ADMIN_TOKEN = "your-admin-token"

[[kv_namespaces]]
binding = "BLOG_DATA"
id = "your-kv-namespace-id"
```

## 数据初始化

首次部署后，你可能需要初始化一些基础数据：

### 1. 创建默认分类

通过 API 或直接在 KV 中添加：
Key: `categories`
Value: `["技术", "生活", "杂谈"]`

### 2. 创建默认标签

Key: `tags`
Value: `["Vue", "React", "Cloudflare"]`

### 3. 创建默认配置

Key: `config`
Value:
```json
{
  "siteName": "天空蓝博客",
  "description": "一个现代化的个人博客系统",
  "themeColor": "#87CEEB"
}
```

## 故障排除

### 构建失败

1. 检查构建日志中的错误信息
2. 确保所有依赖都已正确安装
3. 检查 `vite.config.ts` 配置是否正确

### API 请求失败

如果部署后遇到 `SyntaxError: Unexpected token '<'` 错误，通常是由于 API 请求没有正确路由到 Cloudflare Functions。请确保：

1. `public/_routes.json` 文件存在且配置正确
2. Cloudflare Pages 项目已正确绑定 KV Namespace
3. Functions 文件结构正确且正确处理了路由前缀
4. 所有 Functions 都正确设置了 CORS 头

### PWA 功能问题

1. 检查 `manifest.json` 是否正确配置
2. 确保 Service Worker 文件存在且正确
3. 验证 HTTPS 是否已启用（Cloudflare Pages 自动提供 HTTPS）

## 常见问题解决

详细的问题解决方法请参考 [DEPLOYMENT_ISSUES.md](DEPLOYMENT_ISSUES.md) 文件，其中包含了完整的故障排除指南。