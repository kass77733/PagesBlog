# 打包和部署指南

## 打包项目

### 1. 构建生产版本

要打包博客系统，请运行以下命令：

```bash
npm run build
```

这个命令会：
1. 使用 Vite 构建优化的生产版本
2. 生成所有必要的文件到 `dist/` 目录
3. 生成 Service Worker 文件以支持 PWA 功能

### 2. 构建输出文件

构建完成后，`dist/` 目录将包含以下内容：
- `index.html` - 主页面
- `assets/` - 包含所有 CSS、JavaScript 和图片资源
- `manifest.json` - PWA 应用清单文件
- `sw.js` - Service Worker 文件
- 其他静态资源

### 3. 文件大小信息

构建后的文件总大小约为 352KB，其中最大的文件是：
1. `markdown-47e3efb7.js` - 103KB (markdown 渲染器)
2. `vendor-80a1028f.js` - 93KB (Vue 和其他第三方库)
3. `index-bd5750ad.js` - 30KB (主应用代码)

## 打包为压缩文件

### 创建 ZIP 文件

要将构建后的文件打包为 ZIP 文件以便部署：

```bash
# Windows PowerShell
Compress-Archive -Path dist\* -DestinationPath blog-dist.zip

# 或者使用 tar 命令
tar -a -c -f blog-dist.zip dist
```

### 创建 TAR.GZ 文件

在 Linux 或 macOS 上：

```bash
tar -czvf blog-dist.tar.gz -C dist .
```

## 部署选项

### 1. 部署到 Cloudflare Pages (推荐)

1. 将代码推送到 GitHub 或 GitLab 仓库
2. 登录到 Cloudflare Dashboard
3. 导航到 Workers & Pages > Pages > Create
4. 选择连接到 Git
5. 选择您的仓库
6. 配置构建设置：
   - 构建命令: `npm run build`
   - 构建输出目录: `dist`
7. 添加环境变量：
   - `ADMIN_TOKEN`: 您的管理员令牌
8. 绑定 KV Namespace：
   - 变量名: `BLOG_DATA`
   - KV namespace: 选择或创建一个 KV namespace
9. 点击保存并部署

### 2. 部署到其他静态托管服务

#### Netlify
1. 将代码推送到 Git 仓库
2. 在 Netlify 控制台创建新站点
3. 选择您的仓库
4. 设置构建命令为 `npm run build`
5. 设置发布目录为 `dist`

#### Vercel
1. 将代码推送到 Git 仓库
2. 在 Vercel 控制台导入项目
3. 选择您的仓库
4. 设置构建命令为 `npm run build`
5. 设置输出目录为 `dist`

### 3. 部署到自己的服务器

1. 将 `dist/` 目录中的所有文件上传到您的 Web 服务器
2. 配置 Web 服务器（如 Nginx、Apache）指向这些文件
3. 注意：您需要单独处理后端 API，因为静态托管不支持 Cloudflare Functions

## 环境变量配置

在部署时，请确保设置以下环境变量：

- `ADMIN_TOKEN`: 管理员登录令牌（用于后台管理）
- `BLOG_DATA`: Cloudflare KV Namespace 绑定（用于数据存储）

## 验证部署

部署完成后，您应该能够通过浏览器访问您的博客，并且：

1. 首页正常显示
2. 可以浏览文章
3. PWA 功能正常（可安装为应用）
4. 后台管理功能正常（使用正确的 ADMIN_TOKEN）

## 故障排除

### 构建失败
- 确保 Node.js 版本兼容（建议使用 LTS 版本）
- 删除 `node_modules` 目录并重新安装依赖
- 检查 TypeScript 配置是否有错误

### 部署后页面无法访问
- 检查 Web 服务器配置
- 确保所有静态资源路径正确
- 验证域名解析设置

### PWA 功能不工作
- 确保网站通过 HTTPS 访问
- 检查 `manifest.json` 文件是否正确
- 验证 Service Worker 是否正确注册

## 后续维护

1. 定期更新依赖包以获取安全补丁
2. 备份 Cloudflare KV 中的数据
3. 监控网站性能和错误日志
4. 根据需要添加新功能或优化现有功能