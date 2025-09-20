export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    const configData = await env.BLOG_DATA.get("config");
    const config = configData 
      ? JSON.parse(configData) 
      : {
          siteName: "天空蓝博客",
          description: "一个现代化的个人博客系统",
          themeColor: "#87CEEB"
        };
    
    return new Response(
      JSON.stringify({ success: true, data: config }),
      { 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "获取配置失败" }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        } 
      }
    );
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ success: false, message: "未授权访问" }),
      { 
        status: 401, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        } 
      }
    );
  }
  const token = authHeader.substring(7);
  if (token !== 'admin-token-2024') {
    return new Response(
      JSON.stringify({ success: false, message: "未授权访问" }),
      { 
        status: 401, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        } 
      }
    );
  }
  
  try {
    const data = await request.json();
    
    const configData = await env.BLOG_DATA.get("config");
    const config = configData 
      ? JSON.parse(configData) 
      : {
          siteName: "天空蓝博客",
          description: "一个现代化的个人博客系统",
          themeColor: "#87CEEB"
        };
    
    const updatedConfig = { ...config, ...data };
    await env.BLOG_DATA.put("config", JSON.stringify(updatedConfig));
    
    return new Response(
      JSON.stringify({ success: true, data: updatedConfig }),
      { 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "更新配置失败" }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        } 
      }
    );
  }
}