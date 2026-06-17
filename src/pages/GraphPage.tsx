import { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFriendStore } from '../store/useFriendStore';
import { fetchAllConnections } from '../services/connectionService';
import type { Connection } from '../types';

export function GraphPage() {
  const friends = useFriendStore(s => s.friends);
  const navigate = useNavigate();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; friend: typeof friends[0] } | null>(null);
  const draggingRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    mouseX: number;
    mouseY: number;
    scaleX: number;
    scaleY: number;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const ids = friends.map(f => f.id);
        const data = await fetchAllConnections(ids);
        setConnections(data);
      } catch {} finally {
        setLoading(false);
      }
    };
    if (friends.length > 0) load(); else setLoading(false);
  }, [friends]);

  const { nodes, edges } = useMemo(() => {
    const edgeSet = new Set<string>();
    const edgeList: { source: string; target: string; label: string }[] = [];
    connections.forEach(c => {
      const key = [c.friend_id_a, c.friend_id_b].sort().join('-');
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edgeList.push({ source: c.friend_id_a, target: c.friend_id_b, label: c.relation_type });
      }
    });
    return { nodes: friends, edges: edgeList };
  }, [friends, connections]);

  const positionsRef = useRef<Record<string, { x: number; y: number }>>({});

  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);

  useEffect(() => {
    if (nodes.length === 0) return;
    const cx = 400, cy = 250, radius = Math.min(180, nodes.length * 25);
    const pos: Record<string, { x: number; y: number }> = {};
    nodes.forEach((n, i) => {
      const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
      pos[n.id] = { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
    });
    positionsRef.current = pos;
    setPositions(pos);
  }, [nodes.length]);

  useEffect(() => {
    const handler = (ev: MouseEvent) => {
      const d = draggingRef.current;
      if (!d) return;
      if (!ev.buttons) {
        draggingRef.current = null;
        setDraggingId(null);
        return;
      }
      const dx = (ev.clientX - d.mouseX) * d.scaleX;
      const dy = (ev.clientY - d.mouseY) * d.scaleY;
      const cur = positionsRef.current[d.id];
      if (!cur) return;
      const newPos = {
        x: Math.max(30, Math.min(770, cur.x + dx)),
        y: Math.max(30, Math.min(470, cur.y + dy)),
      };
      positionsRef.current = { ...positionsRef.current, [d.id]: newPos };
      setPositions(positionsRef.current);
      draggingRef.current = { ...d, mouseX: ev.clientX, mouseY: ev.clientY };
    };
    const upHandler = () => {
      if (draggingRef.current) {
        draggingRef.current = null;
        setDraggingId(null);
      }
    };
    document.addEventListener('mousemove', handler);
    document.addEventListener('mouseup', upHandler);
    return () => {
      document.removeEventListener('mousemove', handler);
      document.removeEventListener('mouseup', upHandler);
    };
  }, []);

  if (!useFriendStore.getState().initialized || loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-warm-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (friends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-5xl mb-4">🔗</div>
        <h1 className="text-xl font-semibold text-warm-text mb-2">暂无数据</h1>
        <p className="text-sm text-warm-muted">添加朋友并建立关联后，关系图谱将在这里展示</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-warm-text mb-4">🔗 关系图谱</h1>
      <p className="text-sm text-warm-muted mb-6">
        共 {nodes.length} 位朋友，{edges.length} 条关联 · 拖拽节点可调整位置
      </p>

      <div className="bg-white rounded-card shadow-card overflow-hidden relative" style={{ maxWidth: 800 }}>
        <svg width="100%" height="600" viewBox="0 0 800 500" className="select-none" style={{ cursor: draggingId ? 'grabbing' : 'grab' }}>
          {edges.map((e, i) => {
            const a = positions[e.source];
            const b = positions[e.target];
            if (!a || !b) return null;
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2 - 12;
            return (
              <g key={i}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#EDE0D4" strokeWidth="2" />
                <rect x={mx - e.label.length * 5 - 4} y={my - 8} width={e.label.length * 10 + 8} height={16} rx={4} fill="white" opacity={0.85} />
                <text x={mx} y={my + 4} textAnchor="middle" fill="#9C8B7A" fontSize="10">{e.label}</text>
              </g>
            );
          })}

          {nodes.map(n => {
            const pos = positions[n.id];
            if (!pos) return null;
            return (
              <g key={n.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  const svg = document.querySelector('svg')!;
                  const rect = svg.getBoundingClientRect();
                  draggingRef.current = {
                    id: n.id,
                    startX: pos.x,
                    startY: pos.y,
                    mouseX: e.clientX,
                    mouseY: e.clientY,
                    scaleX: 800 / rect.width,
                    scaleY: 500 / rect.height,
                  };
                  setDraggingId(n.id);
                }}
                onMouseEnter={(e) => {
                  const rect = document.querySelector('svg')!.getBoundingClientRect();
                  setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top - 10, friend: n });
                }}
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle cx={pos.x} cy={pos.y} r={draggingId === n.id ? 24 : 20} fill="#FEF0E6" stroke="#D4826A" strokeWidth="2" />
                <text x={pos.x} y={pos.y + 5} textAnchor="middle" fill="#D4826A" fontSize="12" fontWeight="600">{n.nickname.charAt(0)}</text>
                <text x={pos.x} y={pos.y + 35} textAnchor="middle" fill="#4A3728" fontSize="11">{n.nickname}</text>
              </g>
            );
          })}
        </svg>

        {tooltip && (
          <div className="absolute bg-white rounded-card-sm shadow-card border border-warm-border/50 px-3 py-2 pointer-events-none z-10" style={{ left: tooltip.x + 5, top: tooltip.y - 50 }}>
            <p className="text-sm font-medium text-warm-text whitespace-nowrap">{tooltip.friend.nickname}</p>
            <button onClick={() => navigate(`/friends/${tooltip.friend.id}`)} onMouseEnter={() => setTooltip(tooltip)}
              className="text-xs text-warm-primary hover:underline mt-0.5 pointer-events-auto">
              查看档案 →
            </button>
          </div>
        )}
      </div>

      {edges.length === 0 && nodes.length > 0 && (
        <p className="text-sm text-warm-muted mt-4 text-center">还没有建立朋友之间的关联，在朋友详情页中添加关联吧</p>
      )}
    </div>
  );
}
