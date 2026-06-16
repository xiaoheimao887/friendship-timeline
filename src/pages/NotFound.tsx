export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-xl font-semibold text-warm-text mb-2">页面未找到</h1>
      <p className="text-sm text-warm-muted mb-6">你访问的页面不存在</p>
      <a href="/" className="px-4 py-2 rounded-btn bg-warm-primary text-white text-sm hover:bg-warm-primary/90 transition-colors">
        返回时间线
      </a>
    </div>
  );
}
