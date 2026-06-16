import { NavLink } from 'react-router-dom';
import { useFriendStore } from '../../store/useFriendStore';

const NAV_ITEMS = [
  { to: '/', icon: '🏠', label: '时间线' },
  { to: '/friends', icon: '👥', label: '朋友' },
  { to: '/map', icon: '🗺', label: '地图' },
  { to: '/stats', icon: '📊', label: '统计' },
];

export function Sidebar() {
  const friends = useFriendStore(s => s.friends);

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-warm-sidebar border-r border-warm-border/50 p-5 shrink-0 sticky top-0">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-warm-text">友谊时间线</h1>
        <p className="text-xs text-warm-muted mt-1">记录每一段相遇</p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm transition-colors ${
                isActive
                  ? 'bg-white text-warm-primary font-medium shadow-card-sm'
                  : 'text-warm-text hover:bg-white/50'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="pt-4 border-t border-warm-border/50 space-y-2">
        <p className="text-xs text-warm-muted">
          共 {friends.length} 位朋友
        </p>
        <button
          onClick={() => {
            localStorage.removeItem('pinHash');
            window.location.reload();
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-btn text-xs text-warm-muted hover:text-red-400 hover:bg-white/50 transition-colors w-full"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 10.5L12.5 7L9 3.5" />
            <path d="M12.5 7H4" />
            <path d="M4 12.5H2.5C1.95 12.5 1.5 12.05 1.5 11.5V2.5C1.5 1.95 1.95 1.5 2.5 1.5H4" />
          </svg>
          退出登录
        </button>
      </div>
    </aside>
  );
}
