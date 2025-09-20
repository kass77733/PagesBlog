@echo off
echo 测试 Cloudflare Functions 是否正常工作

echo.
echo 1. 测试 GET /functions/config
curl -v https://sky.lozone.qzz.io/functions/config

echo.
echo ========================================
echo.

echo 2. 测试 GET /functions/categories
curl -v https://sky.lozone.qzz.io/functions/categories

echo.
echo ========================================
echo.

echo 3. 测试 GET /functions/articles?page=1^&pageSize=5
curl -v https://sky.lozone.qzz.io/functions/articles?page=1^&pageSize=5

pause