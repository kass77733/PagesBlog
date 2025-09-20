# Cloudflare Pages 部署完整指南

## 重要提醒
您的网站目前返回的是 HTML 页面而不是 JSON 数据，这说明 Cloudflare Functions 没有被正确触发。

## 正确的部署步骤

### 1. GitHub 仓库设置
确保您的代码已推送到 GitHub 仓库

### 2. Cloudflare Pages 项目创建
1. 登录 Cloudflare Dashboard
2. 进入 Pages 项目
3. 点击 "Create a project"
4. 选择 "Connect to Git"
5. 选择您的 GitHub 仓库

### 3. 构建设置
- **Framework preset**: None
- **Build command**: `npm run build`
- **Build output directory**: `dist`

### 4. 环境变量设置
在 "Environment variables" 部分添加:
- `ADMIN_TOKEN`: 设置一个安全的随机字符串作为您的管理员令牌

### 5. KV Namespace 设置
1. 进入 Cloudflare Dashboard 的 "Workers & Pages" → "KV"
2. 创建一个新的 KV Namespace，命名为 `BLOG_DATA`
3. 在 Pages 项目的 "Settings" → "Functions" 中绑定 KV Namespace:
   - Variable name: `BLOG_DATA`
   - KV namespace: 选择您创建的 `BLOG_DATA`

### 6. 重要: Functions 路由设置
这是最关键的部分！在 Pages 项目的 "Settings" → "Functions" 中:

1. 确保启用了 Functions
2. 在 "Routes" 部分添加路由:
   - Route: `/functions/*`

## 验证部署

部署完成后，测试以下 URL 应该返回 JSON 数据而不是 HTML:

1. `https://your-domain.pages.dev/functions/config` (GET)
2. `https://your-domain.pages.dev/functions/categories` (GET)
3. `https://your-domain.pages.dev/functions/articles?page=1&pageSize=10` (GET)

## 常见问题排查

### 如果仍然返回 HTML 页面:
1. 检查 Cloudflare Pages 项目设置中的 Functions 是否已启用
2. 确认路由 `/functions/*` 已正确添加
3. 检查构建日志是否有错误
4. 确认 `public/_routes.json` 文件已正确部署

### 如果返回 404:
1. 检查 Functions 文件是否在 `functions` 目录中
2. 确认文件名和导出函数正确

## 本地测试

您可以使用以下命令本地测试 Functions:

```bash
# 安装 wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 本地开发模式
npm run dev:both
```

## 手动测试 API

```bash
# 获取配置
curl -X GET https://your-domain.pages.dev/functions/config

# 获取分类
curl -X GET https://your-domain.pages.dev/functions/categories

# 获取文章列表
curl -X GET https://your-domain.pages.dev/functions/articles?page=1&pageSize=10

# 更新配置 (需要认证)
curl -X POST https://your-domain.pages.dev/functions/config \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"siteName":"测试博客","description":"测试描述","themeColor":"#FF0000"}'
```