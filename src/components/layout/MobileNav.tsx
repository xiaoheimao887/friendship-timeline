import { NavLink, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', icon: '🏠', label: '时间线' },
  { to: '/friends', icon: '👥', label: '朋友' },
  { to: '/map', icon: '🗺', label: '地图' },
  { to: '/stats', icon: '📊', label: '统计' },
];

export function MobileNav() {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-warm-border/50 z-40 px-2 pb-safe">
        <div className="flex items-center justify-around py-1">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-2 rounded-btn transition-colors ${
                  isActive ? 'text-warm-primary' : 'text-warm-muted'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px]">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile add FAB */}
      <button
        onClick={() => navigate('/friends/new')}
        className="md:hidden fixed right-5 bottom-20 z-50 w-14 h-14 bg-warm-primary text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-warm-primary/90 transition-colors"
      >
        +
      </button>
    </>
  );
}
