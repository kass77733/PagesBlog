// API测试脚本
const baseUrl = 'http://localhost:3000';

// 测试配置API
async function testConfig() {
  console.log('🧪 测试配置API...');
  try {
    const response = await fetch(`${baseUrl}/config`);
    const data = await response.json();
    console.log('✅ 配置API响应:', response.status, data);
  } catch (error) {
    console.log('❌ 配置API错误:', error.message);
  }
}

// 测试文章列表API
async function testArticles() {
  console.log('🧪 测试文章列表API...');
  try {
    const response = await fetch(`${baseUrl}/articles`);
    const data = await response.json();
    console.log('✅ 文章API响应:', response.status, data);
  } catch (error) {
    console.log('❌ 文章API错误:', error.message);
  }
}

// 测试分类API
async function testCategories() {
  console.log('🧪 测试分类API...');
  try {
    const response = await fetch(`${baseUrl}/categories`);
    const data = await response.json();
    console.log('✅ 分类API响应:', response.status, data);
  } catch (error) {
    console.log('❌ 分类API错误:', error.message);
  }
}

// 测试标签API
async function testTags() {
  console.log('🧪 测试标签API...');
  try {
    const response = await fetch(`${baseUrl}/tags`);
    const data = await response.json();
    console.log('✅ 标签API响应:', response.status, data);
  } catch (error) {
    console.log('❌ 标签API错误:', error.message);
  }
}

// 测试认证API
async function testAuth() {
  console.log('🧪 测试认证API...');
  try {
    const response = await fetch(`${baseUrl}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: 'test-token' })
    });
    const data = await response.json();
    console.log('✅ 认证API响应:', response.status, data);
  } catch (error) {
    console.log('❌ 认证API错误:', error.message);
  }
}

// 运行所有测试
async function runTests() {
  console.log('🚀 开始API测试...\n');
  
  await testConfig();
  console.log('');
  
  await testArticles();
  console.log('');
  
  await testCategories();
  console.log('');
  
  await testTags();
  console.log('');
  
  await testAuth();
  console.log('');
  
  console.log('✨ 测试完成！');
}

// 执行测试
runTests();