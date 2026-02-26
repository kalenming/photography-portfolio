# 摄影作品集管理系统

个人摄影作品展示和管理网站，支持作品上传、EXIF解析、三维分类（时间/地点/类别）。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **数据库**: Vercel Postgres
- **文件存储**: Vercel Blob
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图标**: Lucide React

## 功能特性

- ✅ 作品上传（支持 JPEG/RAW/TIFF）
- ✅ EXIF 自动解析（拍摄时间、GPS、相机参数）
- ✅ 缩略图自动生成
- ✅ 三维分类（时间/地点/类别）
- ✅ 全屏画廊浏览
- ✅ 响应式设计

## 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入本地数据库配置

# 初始化数据库
npx prisma db push

# 启动开发服务器
npm run dev
```

## 部署到 Vercel

### 1. 创建 GitHub 仓库

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/photography-portfolio.git
git push -u origin main
```

### 2. 在 Vercel 创建项目

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Add New Project"
3. 导入你的 GitHub 仓库
4. 点击 Deploy（先不要部署，需要配置存储）

### 3. 创建 Vercel Postgres 数据库

1. 进入项目控制台
2. 点击 "Storage" 标签
3. 点击 "Create Database"
4. 选择 "Postgres"
5. 选择区域（建议选择离你最近的）
6. 创建完成后，环境变量会自动添加

### 4. 创建 Vercel Blob 存储

1. 在 Storage 页面点击 "Create Database"
2. 选择 "Blob"
3. 创建完成后，`BLOB_READ_WRITE_TOKEN` 会自动添加

### 5. 初始化数据库

在 Vercel 项目设置中，添加一个构建命令：

```bash
npx prisma db push
```

或者在本地使用 Vercel CLI：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 链接项目
vercel link

# 拉取环境变量
vercel env pull .env.local

# 推送数据库 schema
npx prisma db push
```

### 6. 重新部署

在 Vercel 控制台点击 "Redeploy"

## 环境变量说明

| 变量名 | 说明 | 来源 |
|--------|------|------|
| `POSTGRES_PRISMA_URL` | Prisma 连接 URL | Vercel Postgres 自动配置 |
| `POSTGRES_URL_NON_POOLING` | 直连 URL | Vercel Postgres 自动配置 |
| `BLOB_READ_WRITE_TOKEN` | Blob 存储令牌 | Vercel Blob 自动配置 |

## 分类说明

### 主题分类
风光 | 人像 | 街拍 | 静物 | 建筑 | 纪实 | 微距 | 夜景 | 黑白 | 其他

### 时间分类
自动从 EXIF 提取拍摄时间，按年/月/日层级组织

### 地点分类
手动输入或从 GPS 坐标解析

## 许可证

MIT
