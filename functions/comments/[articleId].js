function verifyToken(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.substring(7);
  return token === 'admin-token-2024';
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function onRequestGet(context) {
  const { params, env } = context;
  const articleId = params.articleId;
  
  try {
    const commentsData = await env.BLOG_DATA.get(`comments:${articleId}`);
    const comments = commentsData ? JSON.parse(commentsData) : [];
    
    return new Response(
      JSON.stringify({ success: true, data: comments }),
      {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "获取评论失败" }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        } 
      }
    );
  }
}

export async function onRequestPost(context) {
  const { request, params, env } = context;
  const articleId = params.articleId;
  
  try {
    const commentData = await request.json();
    const id = Date.now().toString();
    const comment = {
      id,
      articleId,
      ...commentData,
      createdAt: new Date().toISOString()
    };
    
    const existingData = await env.BLOG_DATA.get(`comments:${articleId}`);
    const comments = existingData ? JSON.parse(existingData) : [];
    comments.push(comment);
    
    await env.BLOG_DATA.put(`comments:${articleId}`, JSON.stringify(comments));
    
    return new Response(
      JSON.stringify({ success: true, data: comment }),
      {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "创建评论失败" }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        } 
      }
    );
  }
}

export async function onRequestDelete(context) {
  const { request, params, env } = context;
  const articleId = params.articleId;
  const url = new URL(request.url);
  const commentId = url.pathname.split('/').pop();
  
  if (!verifyToken(request, env)) {
    return new Response(
      JSON.stringify({ success: false, message: "未授权访问" }),
      { 
        status: 401, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        } 
      }
    );
  }
  
  try {
    const existingData = await env.BLOG_DATA.get(`comments:${articleId}`);
    if (!existingData) {
      return new Response(
        JSON.stringify({ success: false, message: "评论不存在" }),
        { 
          status: 404, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          } 
        }
      );
    }
    
    const comments = JSON.parse(existingData);
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    
    await env.BLOG_DATA.put(`comments:${articleId}`, JSON.stringify(updatedComments));
    
    return new Response(
      JSON.stringify({ success: true, message: "评论删除成功" }),
      {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "删除评论失败" }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        } 
      }
    );
  }
}