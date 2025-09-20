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

// Token 验证函数
function verifyToken(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.substring(7);
  const adminToken = env?.ADMIN_TOKEN || 'admin-token-2024';
  return token === adminToken;
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
  
  try {
    const list = await env.BLOG_DATA.list({ prefix: "articles:" });
    const keys = list.keys.map(key => key.name);
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedKeys = keys.slice(startIndex, endIndex);
    
    const articles = [];
    for (const key of paginatedKeys) {
      const articleData = await env.BLOG_DATA.get(key);
      if (articleData) {
        articles.push(JSON.parse(articleData));
      }
    }
    
    articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return new Response(
      JSON.stringify({
        success: true,
        data: articles,
        pagination: {
          page,
          pageSize,
          total: keys.length,
          totalPages: Math.ceil(keys.length / pageSize)
        }
      }),
      {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "获取文章列表失败" }),
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
  
  if (!verifyToken(request, env)) {
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
    const articleData = await request.json();
    const id = Date.now().toString();
    const article = {
      id,
      ...articleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await env.BLOG_DATA.put(`articles:${id}`, JSON.stringify(article));
    
    return new Response(
      JSON.stringify({ success: true, data: article }),
      {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "创建文章失败" }),
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

export async function onRequestPut(context) {
  const { request, env } = context;
  
  if (!verifyToken(request, env)) {
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
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
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
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        } 
      }
    );
  }
}

export async function onRequestDelete(context) {
  const { request, env } = context;
  
  if (!verifyToken(request, env)) {
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
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    await env.BLOG_DATA.delete(`articles:${id}`);
    
    return new Response(
      JSON.stringify({ success: true, message: "文章删除成功" }),
      {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "删除文章失败" }),
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