import { useFriendStore } from '../../store/useFriendStore';
import { useMemo } from 'react';
import { FriendAvatar } from '../avatar/FriendAvatar';
import { formatDateShort, getDuration } from '../../utils/date-utils';
import { RELATIONSHIP_LABELS, RELATIONSHIP_COLORS } from '../../types';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

export function StatsPage() {
  const friends = useFriendStore(s => s.friends);

  const total = friends.length;
  const currentYear = new Date().getFullYear();
  const thisYearCount = friends.filter(f => f.met_date.startsWith(String(currentYear))).length;

  const friendsByYear = useMemo(() => {
    const map: Record<string, number> = {};
    friends.forEach(f => {
      const y = f.met_date.slice(0, 4);
      map[y] = (map[y] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([year, count]) => ({ year, count }));
  }, [friends]);

  const longestFriendships = useMemo(() => {
    return [...friends]
      .sort((a, b) => a.met_date.localeCompare(b.met_date))
      .slice(0, 5);
  }, [friends]);

  const tagDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    friends.forEach(f => f.tags.forEach(t => { map[t] = (map[t] || 0) + 1; }));
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));
  }, [friends]);

  const relationshipDist = useMemo(() => {
    const map: Record<string, number> = {};
    friends.forEach(f => { map[f.relationship] = (map[f.relationship] || 0) + 1; });
    return Object.entries(map).map(([key, value]) => ({
      name: RELATIONSHIP_LABELS[key as keyof typeof RELATIONSHIP_LABELS],
      value,
      color: RELATIONSHIP_COLORS[key as keyof typeof RELATIONSHIP_COLORS],
    }));
  }, [friends]);

  const longestYear = longestFriendships[0]
    ? getDuration(longestFriendships[0].met_date)
    : '0';

  if (!useFriendStore.getState().initialized) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-warm-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-5xl mb-4">📊</div>
        <h1 className="text-xl font-semibold text-warm-text mb-2">暂无数据</h1>
        <p className="text-sm text-warm-muted">添加朋友后统计数据将在这里展示</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-warm-text mb-6">统计</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-card p-5 shadow-card">
          <p className="text-3xl font-semibold text-warm-primary">{total}</p>
          <p className="text-sm text-warm-muted mt-1">总朋友</p>
        </div>
        <div className="bg-white rounded-card p-5 shadow-card">
          <p className="text-3xl font-semibold text-warm-accent">{thisYearCount}</p>
          <p className="text-sm text-warm-muted mt-1">今年新朋友</p>
        </div>
        <div className="bg-white rounded-card p-5 shadow-card">
          <p className="text-3xl font-semibold text-[#C9B1FF]">{longestYear}</p>
          <p className="text-sm text-warm-muted mt-1">最久友谊</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yearly chart */}
        <div className="bg-white rounded-card p-5 shadow-card">
          <h2 className="text-sm font-semibold text-warm-muted uppercase tracking-wider mb-4">每年新朋友</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={friendsByYear}>
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#9C8B7A' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#9C8B7A' }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #EDE0D4', fontSize: 13 }}
                formatter={(value: number) => [`${value} 位`, '新朋友']}
              />
              <Bar dataKey="count" fill="#D4826A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Relationship distribution */}
        <div className="bg-white rounded-card p-5 shadow-card">
          <h2 className="text-sm font-semibold text-warm-muted uppercase tracking-wider mb-4">关系分布</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={relationshipDist}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
              >
                {relationshipDist.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #EDE0D4', fontSize: 13 }}
                formatter={(value: number, name: string) => [`${value} 位`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {relationshipDist.map(entry => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-warm-muted">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}
              </div>
            ))}
          </div>
        </div>

        {/* Longest friendships */}
        <div className="bg-white rounded-card p-5 shadow-card">
          <h2 className="text-sm font-semibold text-warm-muted uppercase tracking-wider mb-4">认识最久 Top 5</h2>
          <div className="space-y-3">
            {longestFriendships.map((f, i) => (
              <div key={f.id} className="flex items-center gap-3">
                <span className="text-xs font-medium text-warm-muted w-4">{i + 1}.</span>
                <FriendAvatar friend={f} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-warm-text truncate">{f.name}</p>
                  <p className="text-xs text-warm-muted">
                    认识 {getDuration(f.met_date)} · {formatDateShort(f.met_date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tag distribution */}
        <div className="bg-white rounded-card p-5 shadow-card">
          <h2 className="text-sm font-semibold text-warm-muted uppercase tracking-wider mb-4">标签分布</h2>
          {tagDistribution.length === 0 ? (
            <p className="text-sm text-warm-muted">暂无标签</p>
          ) : (
            <div className="space-y-3">
              {tagDistribution.map(tag => {
                const maxVal = tagDistribution[0].value;
                const pct = (tag.value / maxVal) * 100;
                return (
                  <div key={tag.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-warm-text">{tag.name}</span>
                      <span className="text-warm-muted">{tag.value}</span>
                    </div>
                    <div className="h-2 bg-warm-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-warm-primary rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
