# 我的学术主页

**My homepage:** https://wyqmath.cn/

欢迎交流!

## 目录结构

```
├── index.html          # 主页（中英双语）
├── publications.html   # 论文发表列表
├── funzone.html        # 交互式数学科普页面
├── assets/             # 站点资源（样式 script.css、脚本 script.js、分享卡片图 og-image.jpg）
├── photos/             # 照片与机构 logo
├── pub/                # 论文与专利 PDF
├── cv/                 # LaTeX 简历与学术名片源文件
├── favicon.ico         # 站点图标（须位于根目录）
├── robots.txt          # 爬虫规则
└── sitemap.xml         # 站点地图
```

部署：push 到 GitHub 后由 Vercel 自动发布。

部署环境：项目根目录的 `package.json` 将 Node.js 固定为 `24.x`。Vercel 控制台的 Settings → Build and Deployment → Node.js Version 也可同步选择 `24.x`；版本设置会在新的部署中生效。
