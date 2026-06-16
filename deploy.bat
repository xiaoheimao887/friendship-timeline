@echo off
cd /d D:\AI\claudecode\friendship-timeline
echo 正在构建...
call npm run build
if %errorlevel% neq 0 (
  echo 构建失败，按任意键退出
  pause >nul
  exit /b %errorlevel%
)
echo 构建成功，正在推送到 GitHub...
git add -A
git commit -m "update"
git push
if %errorlevel% neq 0 (
  echo 推送失败，请检查网络连接
  pause >nul
  exit /b %errorlevel%
)
echo 推送成功！Vercel 和 Cloudflare 将自动部署。
pause
