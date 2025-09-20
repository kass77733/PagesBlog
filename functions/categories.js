function verifyAdminToken(request, env) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return false;
  
  const token = authHeader.replace("Bearer ", "");
  const adminToken = env.ADMIN_TOKEN || "default-admin-token";
  return token === adminToken;
}

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
    const categoriesData = await env.BLOG_DATA.get("categories");
    const categories = categoriesData ? JSON.parse(categoriesData) : [];
    
    return new Response(
      JSON.stringify({ success: true, data: categories }),
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
      JSON.stringify({ success: false, message: "获取分类失败" }),
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
  
  if (!verifyAdminToken(request, env)) {
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
    
    if (!Array.isArray(data.categories)) {
      return new Response(
        JSON.stringify({ success: false, message: "分类数据格式不正确" }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          } 
        }
      );
    }
    
    await env.BLOG_DATA.put("categories", JSON.stringify(data.categories));
    
    return new Response(
      JSON.stringify({ success: true, data: data.categories }),
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
      JSON.stringify({ success: false, message: "更新分类失败" }),
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