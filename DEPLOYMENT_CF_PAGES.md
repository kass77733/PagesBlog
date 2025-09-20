# Cloudflare Pages 部署详细指南

## 部署前检查清单

在部署到 Cloudflare Pages 之前，请确保完成以下检查：

1. ✅ 代码已推送到 Git 仓库 (GitHub/GitLab)
2. ✅ [public/_routes.json](file:///d:/CodeProject/QoderCodePj/%E4%B8%AA%E4%BA%BA%E9%9D%99%E6%80%81%E5%8D%9A%E5%AE%A2/public/_routes.json) 文件存在且配置正确
3. ✅ 所有 Functions 文件已正确实现 CORS 头
4. ✅ API 请求路径已正确配置
5. ✅ KV Namespace 已创建

## 部署步骤

### 1. 创建 Cloudflare Pages 项目

1. 登录到 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 导航到 **Workers & Pages** > **Pages** > **Create**
3. 选择 **Connect to Git**

### 2. 连接 Git 仓库

1. 选择你的 Git 提供商（GitHub 或 GitLab）
2. 授权 Cloudflare 访问你的仓库
3. 选择包含博客代码的仓库

### 3. 配置构建设置

在 **Set up builds and deployments** 部分：

- **Project name**: `sky-blue-blog`（或你喜欢的名称）
- **Production branch**: `main`（或你的主分支）
- **Framework preset**: `Vite`
- **Build command**: `npm run build`
- **Build output directory**: `dist`

### 4. 环境变量设置

在 **Environment variables** 部分添加：

- `ADMIN_TOKEN`: 你的管理员 Token（用于后台登录）

### 5. KV Namespace 绑定

在 **Functions** 部分的 **KV namespace bindings** 中：

- **Variable name**: `BLOG_DATA`
- **KV namespace**: 选择一个现有的 KV namespace 或创建一个新的

### 6. 部署

1. 点击 **Save and Deploy**
2. Cloudflare 将自动从你的仓库拉取代码并开始构建

## 常见问题及解决方案

### 1. API 请求返回 HTML 而不是 JSON

**问题现象**：
```
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

**解决方案**：
1. 确保 [public/_routes.json](file:///d:/CodeProject/QoderCodePj/%E4%B8%AA%E4%BA%BA%E9%9D%99%E6%80%81%E5%8D%9A%E5%AE%A2/public/_routes.json) 文件存在且内容正确：
   ```json
   {
     "version": 1,
     "include": ["/functions/*"],
     "exclude": []
   }
   ```

2. 检查 Functions 文件中的路由解析是否正确处理 `/functions` 前缀

3. 确保所有 Functions 都正确设置了 CORS 头

### 2. CORS 错误

**问题现象**：
```
Access to fetch at 'https://your-site.pages.dev/functions/articles' from origin 'https://your-site.pages.dev' has been blocked by CORS policy
```

**解决方案**：
1. 确保所有 Functions 都设置了正确的 CORS 头：
   ```javascript
   headers: {
     "Content-Type": "application/json",
     "Access-Control-Allow-Origin": "*",
     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
     "Access-Control-Allow-Headers": "Content-Type, Authorization",
   }
   ```

2. 确保正确处理 OPTIONS 预检请求

### 3. KV 数据访问失败

**问题现象**：
```
Error: KV namespace binding not found
```

**解决方案**：
1. 检查 Cloudflare Pages 项目设置中的 KV Namespace 绑定
2. 确保变量名称为 `BLOG_DATA`
3. 确保绑定的 KV namespace 存在且正确

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

## 验证部署

部署完成后，通过以下方式验证系统是否正常工作：

1. 访问你的站点 URL，检查前端页面是否正常加载
2. 打开浏览器开发者工具，检查控制台是否有错误
3. 尝试访问 API 端点，如：
   - `https://your-site.pages.dev/functions/articles`
   - `https://your-site.pages.dev/functions/categories`
   - `https://your-site.pages.dev/functions/tags`
4. 检查响应是否为有效的 JSON 格式

## 更新部署

当你有代码更新时：

1. 将更改推送到 Git 仓库
2. Cloudflare Pages 会自动触发新的构建和部署
3. 或者在 Cloudflare Dashboard 中手动触发重新部署

## 监控和日志

1. 在 Cloudflare Dashboard 中查看部署状态
2. 检查构建日志以排查构建问题
3. 使用浏览器开发者工具检查网络请求和错误