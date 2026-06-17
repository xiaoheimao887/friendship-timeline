# 友谊时间线 (Friendship Timeline)

## 项目信息

- 路径: `D:\AI\claudecode\friendship-timeline`
- GitHub: `https://github.com/xiaoheimao887/friendship-timeline.git`
- Vercel: `https://friendship-timeline.vercel.app/`
- Cloudflare Pages: `https://friendship-timeline.pages.dev/`
- Supabase 项目: `gwkhjrmmhhcazwcfypli`

## 技术栈

React 18 + TypeScript + Vite 6 + Tailwind CSS + Zustand + Supabase + React Router v6 + Recharts + Leaflet + date-fns + react-hook-form + framer-motion

## 已实现功能

- ✅ PIN 码 + 二级密码双重登录（云端存储）
- ✅ 朋友 CRUD（昵称必填，名字选填）
- ✅ 10种卡通动物头像 + 自定义头像上传
- ✅ 里程碑事件记录
- ✅ 中文日期选择器（自定义下拉，年/月/日阿拉伯数字，年份倒序）
- ✅ 认识地点 + 所在地（LocationSearch 组件，Nominatim 搜索）
- ✅ 标签系统 + 筛选
- ✅ 地图模式（CARTO 温暖瓦片，自定义圆形标记，认识地点粉色首字，所在地绿色首字）
- ✅ 时间线主页（按年份展开，搜索过滤）
- ✅ 统计仪表盘（柱状图、饼图、Top5、标签分布）
- ✅ 生日记录 + 侧栏30天提醒（今天/明天/X天后）
- ✅ 关系图谱（手动建立关联 + SVG 力导向图可视化，拖拽节点）
- ✅ 退出登录
- ✅ Modal 圆角溢出修复
- ✅ 侧栏随内容延长
- ✅ 响应式布局，移动端底部导航 + 退出按钮

## 数据库 Supabase

### friends 表
id UUID, pin_hash TEXT, nickname TEXT NOT NULL, name TEXT, birthday DATE, avatar_url TEXT, tags TEXT[], met_date DATE NOT NULL, met_place_name TEXT, met_place_lat DOUBLE, met_place_lng DOUBLE, current_location_name TEXT, current_location_lat DOUBLE, current_location_lng DOUBLE, met_story TEXT NOT NULL, relationship TEXT (close/regular/occasional/lost), created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ

### milestones 表
id UUID, friend_id UUID REFERENCES friends, date DATE, title TEXT, description TEXT, created_at TIMESTAMPTZ

### connections 表
id UUID, friend_id_a UUID, friend_id_b UUID, relation_type TEXT, created_at TIMESTAMPTZ, UNIQUE(friend_id_a, friend_id_b)

### auth 表
id UUID, pin_hash TEXT UNIQUE, pin_key_hash TEXT, created_at TIMESTAMPTZ

## 部署

代码推送到 GitHub 后，Vercel 和 Cloudflare Pages 都会自动部署，无需额外操作。

## 工作流程

1. 用户提需求 →
2. 修改本地源代码 →
3. `npm run build` 验证编译通过 →
4. `git push` 推送到 GitHub →
5. Vercel + Cloudflare Pages 自动部署

## 沟通规则

- 每次任务完成后必须给用户反馈：✅ 完成 或 ❌ 失败，附带改动内容和结果
- git push 失败时告诉用户手动推送命令

## 环境

- Platform: Windows 11 (bash via Git for Windows)
- Node: `C:/Users/Administrator/Documents/Codex/env/node-v24.16.0-win-x64/node.exe`
- npm: `C:/Users/Administrator/Documents/Codex/env/node-v24.16.0-win-x64/npm.cmd`
- Git: `C:/Program Files/Git/bin/git.exe`
- Build: `npm run build` → 输出到 `dist/`
- Dev: `npm run dev` → localhost:3000
