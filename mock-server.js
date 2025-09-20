// mock-server.js
// 本地开发服务器模拟器，用于模拟 Cloudflare Functions API

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002; // 修改端口号避免冲突

// 中间件
app.use(cors());
app.use(express.json());

// 模拟数据存储
let articles = [
  {
    id: '1',
    title: '第一篇文章',
    content: '这是第一篇文章的内容',
    summary: '第一篇文章摘要',
    tags: ['技术', 'Vue'],
    category: '技术',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    title: '第二篇文章',
    content: '这是第二篇文章的内容',
    summary: '第二篇文章摘要',
    tags: ['生活'],
    category: '生活',
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z'
  }
];

let comments = {
  '1': [
    {
      id: '1-1',
      articleId: '1',
      nickname: '用户1',
      content: '这是第一条评论',
      createdAt: '2023-01-01T01:00:00.000Z'
    }
  ]
};

let categories = ['技术', '生活', '杂谈'];
let tags = ['Vue', 'React', 'Cloudflare', '生活'];
let config = {
  siteName: '天空蓝博客',
  description: '一个现代化的个人博客系统',
  themeColor: '#87CEEB'
};

// 模拟 Cloudflare Functions API 路由
app.get('/functions/articles', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedArticles = articles.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedArticles,
    pagination: {
      page,
      pageSize,
      total: articles.length,
      totalPages: Math.ceil(articles.length / pageSize)
    }
  });
});

app.get('/functions/articles/:id', (req, res) => {
  const article = articles.find(a => a.id === req.params.id);
  if (article) {
    res.json({
      success: true,
      data: article
    });
  } else {
    res.status(404).json({
      success: false,
      message: '文章不存在'
    });
  }
});

app.post('/functions/articles', (req, res) => {
  const newArticle = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  articles.push(newArticle);
  
  // 更新分类
  if (req.body.category && !categories.includes(req.body.category)) {
    categories.push(req.body.category);
  }
  
  // 更新标签
  if (req.body.tags && Array.isArray(req.body.tags)) {
    req.body.tags.forEach(tag => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
  }
  
  res.status(201).json({
    success: true,
    data: newArticle
  });
});

app.put('/functions/articles/:id', (req, res) => {
  const index = articles.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    const updatedArticle = {
      ...articles[index],
      ...req.body,
      id: articles[index].id,
      createdAt: articles[index].createdAt,
      updatedAt: new Date().toISOString()
    };
    
    articles[index] = updatedArticle;
    
    res.json({
      success: true,
      data: updatedArticle
    });
  } else {
    res.status(404).json({
      success: false,
      message: '文章不存在'
    });
  }
});

app.delete('/functions/articles/:id', (req, res) => {
  const index = articles.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    articles.splice(index, 1);
    // 同时删除相关评论
    delete comments[req.params.id];
    
    res.json({
      success: true,
      message: '文章删除成功'
    });
  } else {
    res.status(404).json({
      success: false,
      message: '文章不存在'
    });
  }
});

app.get('/functions/articles/category/:category', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  
  const filteredArticles = articles.filter(a => a.category === decodeURIComponent(req.params.category));
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedArticles,
    pagination: {
      page,
      pageSize,
      total: filteredArticles.length,
      totalPages: Math.ceil(filteredArticles.length / pageSize)
    }
  });
});

app.get('/functions/articles/tag/:tag', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  
  const filteredArticles = articles.filter(a => a.tags.includes(decodeURIComponent(req.params.tag)));
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedArticles,
    pagination: {
      page,
      pageSize,
      total: filteredArticles.length,
      totalPages: Math.ceil(filteredArticles.length / pageSize)
    }
  });
});

app.get('/functions/articles/search', (req, res) => {
  const query = req.query.q || '';
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  
  const filteredArticles = articles.filter(a => {
    const lowerQuery = query.toLowerCase();
    return (
      a.title.toLowerCase().includes(lowerQuery) ||
      a.summary.toLowerCase().includes(lowerQuery) ||
      a.content.toLowerCase().includes(lowerQuery)
    );
  });
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedArticles,
    pagination: {
      page,
      pageSize,
      total: filteredArticles.length,
      totalPages: Math.ceil(filteredArticles.length / pageSize)
    }
  });
});

// 评论相关 API
app.get('/functions/comments/:articleId', (req, res) => {
  const articleComments = comments[req.params.articleId] || [];
  res.json({
    success: true,
    data: articleComments
  });
});

app.post('/functions/comments/:articleId', (req, res) => {
  const articleId = req.params.articleId;
  // 检查文章是否存在
  const article = articles.find(a => a.id === articleId);
  if (!article) {
    return res.status(404).json({
      success: false,
      message: '文章不存在'
    });
  }
  
  const newComment = {
    id: `${articleId}-${Date.now()}`,
    articleId,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  if (!comments[articleId]) {
    comments[articleId] = [];
  }
  
  comments[articleId].push(newComment);
  
  res.status(201).json({
    success: true,
    data: newComment
  });
});

app.delete('/functions/comments/:articleId/:commentId', (req, res) => {
  const { articleId, commentId } = req.params;
  
  if (comments[articleId]) {
    const index = comments[articleId].findIndex(c => c.id === commentId);
    if (index !== -1) {
      comments[articleId].splice(index, 1);
      
      res.json({
        success: true,
        message: '评论删除成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '评论不存在'
      });
    }
  } else {
    res.status(404).json({
      success: false,
      message: '评论不存在'
    });
  }
});

// 配置相关 API
app.get('/functions/config', (req, res) => {
  res.json({
    success: true,
    data: config
  });
});

app.post('/functions/config', (req, res) => {
  config = {
    ...config,
    ...req.body
  };
  
  res.json({
    success: true,
    data: config
  });
});

// 分类和标签 API
app.get('/functions/categories', (req, res) => {
  res.json({
    success: true,
    data: categories
  });
});

app.post('/functions/categories', (req, res) => {
  if (Array.isArray(req.body.categories)) {
    categories = req.body.categories;
    res.json({
      success: true,
      data: categories
    });
  } else {
    res.status(400).json({
      success: false,
      message: '分类数据格式不正确'
    });
  }
});

app.get('/functions/tags', (req, res) => {
  res.json({
    success: true,
    data: tags
  });
});

app.post('/functions/tags', (req, res) => {
  if (Array.isArray(req.body.tags)) {
    tags = req.body.tags;
    res.json({
      success: true,
      data: tags
    });
  } else {
    res.status(400).json({
      success: false,
      message: '标签数据格式不正确'
    });
  }
});

// 身份验证相关
app.post('/functions/auth/verify', (req, res) => {
  // 在本地开发环境中，我们接受任何 token
  res.json({
    success: true,
    data: { valid: true }
  });
});

// 为所有其他请求提供静态文件（模拟生产环境）
app.use(express.static(path.join(__dirname, 'dist')));

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/functions/*`);
});