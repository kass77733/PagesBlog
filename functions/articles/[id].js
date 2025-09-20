function verifyToken(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.substring(7);
  const adminToken = env?.ADMIN_TOKEN || 'admin-token-2024';
  return token === adminToken;
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function onRequestGet(context) {
  const { params, env } = context;
  const id = params.id;
  
  try {
    const articleData = await env.BLOG_DATA.get(`articles:${id}`);
    
    if (!articleData) {
      return new Response(
        JSON.stringify({ success: false, message: "文章不存在" }),
        { 
          status: 404, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          } 
        }
      );
    }
    
    const article = JSON.parse(articleData);
    
    return new Response(
      JSON.stringify({ success: true, data: article }),
      {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "获取文章失败" }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        } 
      }
    );
  }
}

export async function onRequestPut(context) {
  const { request, params, env } = context;
  const id = params.id;
  
  if (!verifyToken(request, env)) {
    return new Response(
      JSON.stringify({ success: false, message: "未授权访问" }),
      { 
        status: 401, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        } 
      }
    );
  }
  
  try {
    const updateData = await request.json();
    
    const existingData = await env.BLOG_DATA.get(`articles:${id}`);
    if (!existingData) {
      return new Response(
        JSON.stringify({ success: false, message: "文章不存在" }),
        { 
          status: 404, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          } 
        }
      );
    }
    
    const existingArticle = JSON.parse(existingData);
    const updatedArticle = {
      ...existingArticle,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await env.BLOG_DATA.put(`articles:${id}`, JSON.stringify(updatedArticle));
    
    return new Response(
      JSON.stringify({ success: true, data: updatedArticle }),
      {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "更新文章失败" }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        } 
      }
    );
  }
}