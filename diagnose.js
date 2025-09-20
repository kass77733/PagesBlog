// 最终诊断脚本 - 用于确定 Cloudflare Functions 问题的根本原因

console.log('=== Cloudflare Functions 问题诊断 ===\n');

// 检查 1: 验证本地文件结构
console.log('1. 检查本地文件结构...');

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'functions/config.ts',
  'functions/articles.ts',
  'functions/comments.ts',
  'functions/taxonomy.ts',
  'functions/auth.ts',
  'functions/_middleware.ts',
  'public/_routes.json'
];

console.log('   检查必需的文件:');
requiredFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} (缺失)`);
  }
});

console.log('\n2. 检查 _routes.json 内容...');
const routesFile = path.join(__dirname, 'public/_routes.json');
if (fs.existsSync(routesFile)) {
  const routesContent = fs.readFileSync(routesFile, 'utf8');
  console.log('   _routes.json 内容:');
  console.log('   ' + routesContent.split('\n').join('\n   '));
}

console.log('\n3. 检查 Functions 目录内容...');
const functionsDir = path.join(__dirname, 'functions');
if (fs.existsSync(functionsDir)) {
  const functionsFiles = fs.readdirSync(functionsDir);
  console.log('   Functions 目录包含的文件:');
  functionsFiles.forEach(file => {
    console.log(`   - ${file}`);
  });
}

console.log('\n4. 诊断结论:');
console.log('   如果您的网站返回 HTML 页面而不是 JSON 数据，可能的原因:');
console.log('   a) Cloudflare Pages 项目未正确配置 Functions 路由');
console.log('   b) _routes.json 文件未正确部署到生产环境');
console.log('   c) Cloudflare Pages 项目设置中未启用 Functions 功能');
console.log('   d) KV Namespace 未正确绑定');

console.log('\n5. 建议的解决方案:');
console.log('   1. 登录 Cloudflare Dashboard');
console.log('   2. 进入您的 Pages 项目');
console.log('   3. 检查 Settings 中是否有关于 Functions 的配置选项');
console.log('   4. 确保构建后的 dist 目录包含 _routes.json 文件');
console.log('   5. 重新部署项目');

console.log('\n=== 诊断完成 ===');