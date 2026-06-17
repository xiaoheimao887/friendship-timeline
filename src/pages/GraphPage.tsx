import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFriendStore } from '../store/useFriendStore';
import { fetchAllConnections } from '../services/connectionService';
import type { Connection } from '../types';

const SVG_W = 800;
const SVG_H = 500;

export function GraphPage() {
  const friends = useFriendStore(s => s.friends);
  const navigate = useNavigate();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; friend: typeof friends[0] } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });

  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => { panRef.current = pan; }, [pan]);

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
    if (friends.length > 0) load();
    else setLoading(false);
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

  // Initialize circular layout when node count changes
  useEffect(() => {
    if (nodes.length === 0) return;
    const cx = SVG_W / 2, cy = SVG_H / 2, radius = Math.min(180, nodes.length * 25);
    const pos: Record<string, { x: number; y: number }> = {};
    nodes.forEach((n, i) => {
      const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
      pos[n.id] = { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
    });
    positionsRef.current = pos;
    setPositions(pos);
  }, [nodes.length]);

  // Convert screen pixel coords to world coords (accounts for viewBox mapping + pan/zoom)
  const screenToWorld = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const svgPt = pt.matrixTransform(ctm.inverse());
    return {
      x: (svgPt.x - panRef.current.x) / zoomRef.current,
      y: (svgPt.y - panRef.current.y) / zoomRef.current,
    };
  }, []);

  const nodeDragRef = useRef<{
    nodeId: string;
    startX: number;
    startY: number;
    mouseWorldX: number;
    mouseWorldY: number;
  } | null>(null);

  const panDragRef = useRef<{
    startPanX: number;
    startPanY: number;
    startSvgX: number;
    startSvgY: number;
  } | null>(null);

  // Global mouse handlers for drag & pan
  useEffect(() => {
    const handleMove = (ev: MouseEvent) => {
      const nd = nodeDragRef.current;
      if (nd) {
        if (!ev.buttons) {
          nodeDragRef.current = null;
          setDraggingId(null);
          return;
        }
        const world = screenToWorld(ev.clientX, ev.clientY);
        const dx = world.x - nd.mouseWorldX;
        const dy = world.y - nd.mouseWorldY;
        const newX = Math.max(30, Math.min(SVG_W - 30, nd.startX + dx));
        const newY = Math.max(30, Math.min(SVG_H - 30, nd.startY + dy));
        positionsRef.current = { ...positionsRef.current, [nd.nodeId]: { x: newX, y: newY } };
        setPositions(positionsRef.current);
        return;
      }

      const pd = panDragRef.current;
      if (pd) {
        if (!ev.buttons) {
          panDragRef.current = null;
          return;
        }
        const svg = svgRef.current;
        if (!svg) return;
        const pt = svg.createSVGPoint();
        pt.x = ev.clientX;
        pt.y = ev.clientY;
        const ctm = svg.getScreenCTM();
        if (!ctm) return;
        const svgPt = pt.matrixTransform(ctm.inverse());
        const newPan = {
          x: pd.startPanX + svgPt.x - pd.startSvgX,
          y: pd.startPanY + svgPt.y - pd.startSvgY,
        };
        panRef.current = newPan;
        setPan(newPan);
      }
    };

    const handleUp = () => {
      if (nodeDragRef.current) {
        nodeDragRef.current = null;
        setDraggingId(null);
      }
      panDragRef.current = null;
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [screenToWorld]);

  // Wheel zoom centered on cursor
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const svgPt = pt.matrixTransform(ctm.inverse());

    const worldX = (svgPt.x - panRef.current.x) / zoomRef.current;
    const worldY = (svgPt.y - panRef.current.y) / zoomRef.current;

    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.2, Math.min(3, zoomRef.current * factor));

    const newPan = {
      x: svgPt.x - worldX * newZoom,
      y: svgPt.y - worldY * newZoom,
    };
    zoomRef.current = newZoom;
    panRef.current = newPan;
    setZoom(newZoom);
    setPan(newPan);
  }, []);

  const resetView = useCallback(() => {
    zoomRef.current = 1;
    panRef.current = { x: 0, y: 0 };
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  if (!useFriendStore.getState().initialized || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-warm-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-warm-text">🔗 关系图谱</h1>
          <p className="text-sm text-warm-muted">
            共 {nodes.length} 位朋友，{edges.length} 条关联 · 滚轮缩放 · 拖拽背景平移 · 拖拽节点调整位置
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-warm-muted">{Math.round(zoom * 100)}%</span>
          {(zoom !== 1 || pan.x !== 0 || pan.y !== 0) && (
            <button onClick={resetView} className="text-xs text-warm-primary hover:underline">
              重置视图
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-card shadow-card overflow-hidden relative" style={{ maxWidth: 800 }}>
        <svg
          ref={svgRef}
          width="100%"
          height="600"
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="select-none"
          style={{ cursor: draggingId ? 'grabbing' : 'grab' }}
          onWheel={handleWheel}
          onMouseDown={(e) => {
            if (e.button !== 0) return;
            const svg = svgRef.current;
            if (!svg) return;
            const pt = svg.createSVGPoint();
            pt.x = e.clientX;
            pt.y = e.clientY;
            const ctm = svg.getScreenCTM();
            if (!ctm) return;
            const svgPt = pt.matrixTransform(ctm.inverse());
            panDragRef.current = {
              startPanX: panRef.current.x,
              startPanY: panRef.current.y,
              startSvgX: svgPt.x,
              startSvgY: svgPt.y,
            };
          }}
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
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
                    e.stopPropagation();
                    const world = screenToWorld(e.clientX, e.clientY);
                    const nodePos = positionsRef.current[n.id];
                    if (!nodePos) return;
                    nodeDragRef.current = {
                      nodeId: n.id,
                      startX: nodePos.x,
                      startY: nodePos.y,
                      mouseWorldX: world.x,
                      mouseWorldY: world.y,
                    };
                    setDraggingId(n.id);
                  }}
                  onMouseEnter={(e) => {
                    const rect = svgRef.current?.getBoundingClientRect();
                    if (rect) setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top - 10, friend: n });
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
          </g>
        </svg>

        {tooltip && (
          <div className="absolute bg-white rounded-card-sm shadow-card border border-warm-border/50 px-3 py-2 pointer-events-none z-10"
            style={{ left: tooltip.x + 5, top: tooltip.y - 50 }}>
            <p className="text-sm font-medium text-warm-text whitespace-nowrap">{tooltip.friend.nickname}</p>
            <button
              onClick={() => navigate(`/friends/${tooltip.friend.id}`)}
              onMouseEnter={() => setTooltip(tooltip)}
              className="text-xs text-warm-primary hover:underline mt-0.5 pointer-events-auto"
            >
              查看档案 →
            </button>
          </div>
        )}
      </div>

      {edges.length === 0 && nodes.length > 0 && (
        <p className="text-sm text-warm-muted mt-4 text-center">
          还没有建立朋友之间的关联，在朋友详情页中添加关联吧
        </p>
      )}
    </div>
  );
}
