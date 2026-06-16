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
    <aside className="hidden md:flex flex-col w-60 h-screen bg-warm-sidebar border-r border-warm-border/50 p-5 shrink-0">
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

      <div className="pt-4 border-t border-warm-border/50">
        <p className="text-xs text-warm-muted">
          共 {friends.length} 位朋友
        </p>
      </div>
    </aside>
  );
}
