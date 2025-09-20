# 部署配置

## Cloudflare Pages 环境变量设置

在 Cloudflare Pages 控制台中设置以下环境变量：

### 必需的环境变量

1. **ADMIN_USERNAME** - 管理员用户名
   - 默认值: `admin`
   - 建议设置为自定义值

2. **ADMIN_PASSWORD** - 管理员密码  
   - 默认值: `admin123`
   - 建议设置为强密码

3. **ADMIN_TOKEN** - 管理员访问令牌
   - 默认值: `admin-token-2024`
   - 建议设置为随机生成的强令牌

### 设置步骤

1. 登录 Cloudflare Pages 控制台
2. 选择你的项目
3. 进入 Settings > Environment variables
4. 添加以上环境变量
5. 重新部署项目

### 安全建议

- 使用强密码和随机令牌
- 定期更换凭据
- 不要在代码中硬编码凭据