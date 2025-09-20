@echo off
REM 打包脚本 for Windows

echo 开始打包博客系统...

REM 1. 清理之前的构建
echo 正在清理...
if exist dist rmdir /s /q dist
if exist blog-dist.zip del blog-dist.zip

REM 2. 安装依赖（如果需要）
echo 正在检查依赖...
npm install

REM 3. 构建生产版本
echo 正在构建生产版本...
npm run build

REM 4. 检查构建是否成功
if not exist dist (
    echo 构建失败！
    exit /b 1
)

echo 构建成功！

REM 5. 创建 ZIP 文件
echo 正在创建 ZIP 文件...
powershell Compress-Archive -Path dist\* -DestinationPath blog-dist.zip

echo 打包完成！
echo.
echo 生成的文件：
echo - dist/ 目录包含所有构建文件
echo - blog-dist.zip 是打包的压缩文件
echo.
echo 要部署到 Cloudflare Pages，请将代码推送到 Git 仓库并按照 DEPLOYMENT.md 中的说明操作。