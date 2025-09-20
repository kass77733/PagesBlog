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