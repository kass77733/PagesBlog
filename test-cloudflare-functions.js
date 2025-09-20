// Cloudflare Functions 测试脚本
// 保存为 test-cloudflare-functions.js 并使用 Node.js 运行: node test-cloudflare-functions.js

async function testFunctions() {
  const baseUrl = 'https://sky.lozone.qzz.io';
  
  console.log('=== Cloudflare Functions 测试 ===\n');
  
  // 测试 1: GET /functions/config
  console.log('1. 测试 GET /functions/config');
  try {
    const response = await fetch(`${baseUrl}/functions/config`);
    console.log(`   状态码: ${response.status}`);
    console.log(`   Content-Type: ${response.headers.get('content-type')}`);
    
    if (response.headers.get('content-type')?.includes('application/json')) {
      const data = await response.json();
      console.log(`   响应数据:`, JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log(`   响应内容 (非JSON): ${text.substring(0, 100)}...`);
    }
  } catch (error) {
    console.log(`   错误: ${error.message}`);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // 测试 2: GET /functions/categories
  console.log('2. 测试 GET /functions/categories');
  try {
    const response = await fetch(`${baseUrl}/functions/categories`);
    console.log(`   状态码: ${response.status}`);
    console.log(`   Content-Type: ${response.headers.get('content-type')}`);
    
    if (response.headers.get('content-type')?.includes('application/json')) {
      const data = await response.json();
      console.log(`   响应数据:`, JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log(`   响应内容 (非JSON): ${text.substring(0, 100)}...`);
    }
  } catch (error) {
    console.log(`   错误: ${error.message}`);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // 测试 3: GET /functions/articles
  console.log('3. 测试 GET /functions/articles?page=1&pageSize=5');
  try {
    const response = await fetch(`${baseUrl}/functions/articles?page=1&pageSize=5`);
    console.log(`   状态码: ${response.status}`);
    console.log(`   Content-Type: ${response.headers.get('content-type')}`);
    
    if (response.headers.get('content-type')?.includes('application/json')) {
      const data = await response.json();
      console.log(`   响应数据:`, JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log(`   响应内容 (非JSON): ${text.substring(0, 100)}...`);
    }
  } catch (error) {
    console.log(`   错误: ${error.message}`);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // 测试 4: POST /functions/config (需要认证)
  console.log('4. 测试 POST /functions/config (需要 ADMIN_TOKEN)');
  try {
    // 注意：请将 YOUR_ADMIN_TOKEN 替换为实际的管理员令牌
    const adminToken = 'YOUR_ADMIN_TOKEN';
    
    const response = await fetch(`${baseUrl}/functions/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        siteName: '测试博客',
        description: '通过测试脚本更新的描述',
        themeColor: '#FF5733'
      })
    });
    
    console.log(`   状态码: ${response.status}`);
    console.log(`   Content-Type: ${response.headers.get('content-type')}`);
    
    if (response.headers.get('content-type')?.includes('application/json')) {
      const data = await response.json();
      console.log(`   响应数据:`, JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log(`   响应内容 (非JSON): ${text.substring(0, 100)}...`);
    }
  } catch (error) {
    console.log(`   错误: ${error.message}`);
  }
}

// 运行测试
testFunctions();