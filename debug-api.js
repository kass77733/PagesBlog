// API 路由问题调试脚本

console.log('=== 调试 Cloudflare Functions 路由问题 ===\n');

// 模拟 URL 解析逻辑
function testUrlParsing() {
  console.log('1. 测试 URL 解析逻辑:');
  
  const testUrls = [
    '/functions/config',
    '/functions/config/',
    '/functions/articles',
    '/functions/categories',
    '/functions/tags'
  ];
  
  testUrls.forEach(url => {
    const path = url.replace(/^\/functions/, "");
    const pathParts = path.split("/").filter(Boolean);
    console.log(`   URL: ${url}`);
    console.log(`   解析后路径: "${path}"`);
    console.log(`   路径部分: [${pathParts.join(', ')}]`);
    console.log('   ---');
  });
}

// 检查 config.ts 路由逻辑
function testConfigRouting() {
  console.log('\n2. 检查 config.ts 路由逻辑:');
  
  const configLogic = `
  // 检查是否是 /functions/config 路径
  if (path === "/functions/config" || path === "/functions/config/") {
    switch (request.method) {
      case "GET":
        return getConfig(request, env);
      case "POST":
        return updateConfig(request, env);
      default:
        return new Response(
          JSON.stringify({ success: false, message: \`不允许的方法: \${request.method}\` }),
          { status: 405 }
        );
    }
  }
  `;
  
  console.log('   config.ts 中的路由逻辑:');
  console.log('   ' + configLogic.split('\n').join('\n   '));
}

// 检查 taxonomy.ts 路由逻辑
function testTaxonomyRouting() {
  console.log('\n3. 检查 taxonomy.ts 路由逻辑:');
  
  const taxonomyLogic = `
  // 解析路径，去除 /functions 前缀
  const path = url.pathname.replace(/^\/functions/, "");
  const pathParts = path.split("/").filter(Boolean);
  
  // 处理不同的路由
  switch (request.method) {
    case "GET":
      if (pathParts.length === 1 && pathParts[0] === "categories") {
        // GET /functions/categories - 获取所有分类
        return getCategories(request, env);
      } else if (pathParts.length === 1 && pathParts[0] === "tags") {
        // GET /functions/tags - 获取所有标签
        return getTags(request, env);
      }
      break;
  }
  `;
  
  console.log('   taxonomy.ts 中的路由逻辑:');
  console.log('   ' + taxonomyLogic.split('\n').join('\n   '));
}

// 运行测试
testUrlParsing();
testConfigRouting();
testTaxonomyRouting();

console.log('\n4. 问题分析:');
console.log('   - config.ts 使用完整路径匹配: "/functions/config"');
console.log('   - taxonomy.ts 使用路径部分匹配: 去除前缀后检查 pathParts');
console.log('   - 这两种不同的路由处理方式可能导致不一致的行为');

console.log('\n5. 建议的解决方案:');
console.log('   统一所有 Functions 的路由处理逻辑，使用相同的模式');
console.log('   推荐使用路径部分匹配的方式，更灵活且一致');

console.log('\n=== 调试完成 ===');