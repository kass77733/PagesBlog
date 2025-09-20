#!/bin/bash

# 测试 Cloudflare Functions 是否正常工作
echo "测试 Cloudflare Functions..."

# 测试 1: 检查是否返回 JSON 数据
echo "1. 测试 GET /functions/config"
curl -v https://sky.lozone.qzz.io/functions/config

echo -e "\n========================================\n"

# 测试 2: 检查分类 API
echo "2. 测试 GET /functions/categories"
curl -v https://sky.lozone.qzz.io/functions/categories

echo -e "\n========================================\n"

# 测试 3: 检查文章列表 API
echo "3. 测试 GET /functions/articles?page=1&pageSize=5"
curl -v https://sky.lozone.qzz.io/functions/articles?page=1&pageSize=5