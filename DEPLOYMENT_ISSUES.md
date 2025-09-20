# Cloudflare Pages 部署问题解决总结

## 问题描述

在将博客系统部署到 Cloudflare Pages 后，控制台出现以下错误：

```
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

这个错误表明前端向后端 API 发起的请求没有正确路由到 Cloudflare Functions，而是返回了 HTML 页面（通常是首页）。

## 问题原因分析

经过分析，发现以下主要原因：

1. **缺少路由配置文件**：项目缺少 `public/_routes.json` 文件，该文件用于告诉 Cloudflare Pages 哪些路径应该路由到 Functions

2. **Functions 路由处理不正确**：Functions 中没有正确处理带有 `/functions` 前缀的路径

3. **CORS 配置不完整**：Functions 返回的响应缺少必要的 CORS 头，导致浏览器阻止请求

4. **API 请求路径处理不当**：前端代码中的 API 请求路径可能在不同环境下处理不一致

## 解决方案

### 1. 添加路由配置文件

创建 `public/_routes.json` 文件：

```json
{
  "version": 1,
  "include": ["/functions/*"],
  "exclude": []
}
```

这个文件告诉 Cloudflare Pages 将所有 `/functions/*` 路径的请求路由到 Cloudflare Functions。

### 2. 修复 Functions 路由处理

在每个 Functions 文件中，修改路径解析逻辑以正确处理 `/functions` 前缀：

```javascript
// 解析路径，去除 /functions 前缀
const path = url.pathname.replace(/^\/functions/, "");
const pathParts = path.split("/").filter(Boolean);
```

### 3. 完善 CORS 配置

为所有 Functions 添加完整的 CORS 头：

```javascript
headers: {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}
```

同时正确处理 OPTIONS 预检请求：

```javascript
// 处理预检请求
if (request.method === "OPTIONS") {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
```

### 4. 优化前端 API 请求处理

更新 `src/utils/api.ts` 文件，确保 API 请求路径处理更加健壮：

```javascript
// 根据环境确定 API 基础路径
const getApiBase = () => {
  return '/functions'
}

const API_BASE = getApiBase()
```

## 验证解决方案

1. 重新构建项目：`npm run build`
2. 部署到 Cloudflare Pages
3. 检查浏览器控制台是否还有错误
4. 验证 API 请求是否能正确返回 JSON 数据

## 预防措施

1. 在项目中始终包含 `public/_routes.json` 文件
2. 确保所有 Functions 都正确处理 CORS
3. 在部署前进行充分的本地测试
4. 使用浏览器开发者工具检查网络请求

## 结论

通过以上修改，成功解决了 Cloudflare Pages 部署后 API 请求失败的问题。关键是要理解 Cloudflare Pages 的路由机制，并正确配置 Functions 与前端之间的通信。