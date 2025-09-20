// 测试 Cloudflare Functions 的简单脚本
async function testConfigAPI() {
  const baseUrl = 'https://sky.lozone.qzz.io';
  
  console.log('测试 GET /functions/config');
  try {
    const getConfigResponse = await fetch(`${baseUrl}/functions/config`);
    console.log('GET Response Status:', getConfigResponse.status);
    const getConfigData = await getConfigResponse.json();
    console.log('GET Response Data:', getConfigData);
  } catch (error) {
    console.error('GET Error:', error);
  }
  
  console.log('\n测试 POST /functions/config (需要认证)');
  try {
    // 这里需要替换为您的实际 ADMIN_TOKEN
    const adminToken = 'YOUR_ADMIN_TOKEN_HERE';
    
    const postConfigResponse = await fetch(`${baseUrl}/functions/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        siteName: '测试博客',
        description: '测试描述',
        themeColor: '#FF0000'
      })
    });
    
    console.log('POST Response Status:', postConfigResponse.status);
    const postConfigData = await postConfigResponse.json();
    console.log('POST Response Data:', postConfigData);
  } catch (error) {
    console.error('POST Error:', error);
  }
}

// 运行测试
testConfigAPI();