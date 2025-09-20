#!/bin/bash
# 打包脚本 for Linux/macOS

echo "开始打包博客系统..."

# 1. 清理之前的构建
echo "正在清理..."
rm -rf dist
rm -f blog-dist.zip

# 2. 安装依赖（如果需要）
echo "正在检查依赖..."
npm install

# 3. 构建生产版本
echo "正在构建生产版本..."
npm run build

# 4. 检查构建是否成功
if [ ! -d "dist" ]; then
    echo "构建失败！"
    exit 1
fi

echo "构建成功！"

# 5. 创建 ZIP 文件
echo "正在创建 ZIP 文件..."
zip -r blog-dist.zip dist

echo "打包完成！"
echo ""
echo "生成的文件："
echo "- dist/ 目录包含所有构建文件"
echo "- blog-dist.zip 是打包的压缩文件"
echo ""
echo "要部署到 Cloudflare Pages，请将代码推送到 Git 仓库并按照 DEPLOYMENT.md 中的说明操作。"