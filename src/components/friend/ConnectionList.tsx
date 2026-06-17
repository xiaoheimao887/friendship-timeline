import { fetchConnections, createConnection, deleteConnection } from '../../services/connectionService';
import { useState, useEffect } from 'react';
import { useFriendStore } from '../../store/useFriendStore';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/ToastProvider';
import { CONNECTION_TYPES } from '../../types';
import type { Connection } from '../../types';

interface ConnectionListProps {
  friendId: string;
}

export function ConnectionList({ friendId }: ConnectionListProps) {
  const friends = useFriendStore(s => s.friends);
  const { showToast } = useToast();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState('');
  const [relationType, setRelationType] = useState(CONNECTION_TYPES[0]);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchConnections(friendId);
      setConnections(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [friendId]);

  const getConnectedFriend = (conn: Connection) => {
    const connectedId = conn.friend_id_a === friendId ? conn.friend_id_b : conn.friend_id_a;
    return friends.find(f => f.id === connectedId);
  };

  const availableFriends = friends.filter(f =>
    f.id !== friendId &&
    !connections.some(c =>
      (c.friend_id_a === f.id || c.friend_id_b === f.id)
    ) &&
    (search === '' || f.nickname.includes(search) || f.name?.includes(search))
  );

  const handleAdd = async () => {
    if (!selectedFriend) return;
    try {
      await createConnection(friendId, selectedFriend, relationType);
      showToast('已添加关联');
      setShowAdd(false);
      setSelectedFriend('');
      load();
    } catch {
      showToast('添加失败', 'error');
    }
  };

  const handleRemove = async (connId: string) => {
    try {
      await deleteConnection(connId);
      showToast('已解除关联');
      load();
    } catch {
      showToast('删除失败', 'error');
    }
  };

  if (loading) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-warm-muted uppercase tracking-wider">关联朋友</h2>
        <button onClick={() => setShowAdd(true)} className="text-xs text-warm-primary hover:text-warm-primary/80 transition-colors">
          + 添加关联
        </button>
      </div>

      {connections.length === 0 ? (
        <p className="text-sm text-warm-muted pl-4 border-l-2 border-warm-border py-2">还没有关联朋友</p>
      ) : (
        <div className="space-y-2">
          {connections.map(conn => {
            const cf = getConnectedFriend(conn);
            if (!cf) return null;
            return (
              <div key={conn.id} className="flex items-center justify-between pl-4 border-l-2 border-warm-primaryLight group">
                <div>
                  <span className="text-sm font-medium text-warm-text">{cf.nickname}</span>
                  <span className="text-xs text-warm-muted ml-2">— {conn.relation_type}</span>
                </div>
                <button onClick={() => handleRemove(conn.id)} className="text-xs text-warm-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                  解除
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="添加关联朋友">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-warm-text mb-1">搜索朋友</label>
            <input value={search} onChange={e => setSearch(e.target.value)} className="w-full px-3 py-2 rounded-btn border border-warm-border bg-white focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary text-sm" placeholder="输入名字搜索..." autoFocus />
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1">
            {availableFriends.map(f => (
              <button key={f.id} type="button" onClick={() => setSelectedFriend(f.id)}
                className={`w-full text-left px-3 py-2 rounded-btn text-sm transition-colors ${selectedFriend === f.id ? 'bg-warm-primaryLight text-warm-primary font-medium' : 'hover:bg-warm-bg text-warm-text'}`}>
                {f.nickname}
              </button>
            ))}
            {availableFriends.length === 0 && <p className="text-sm text-warm-muted text-center py-2">没有可选的朋友</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-text mb-1">关系类型</label>
            <select value={relationType} onChange={e => setRelationType(e.target.value)}
              className="w-full px-3 py-2 rounded-btn border border-warm-border bg-white focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary text-sm">
              {CONNECTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-btn border border-warm-border text-sm hover:bg-warm-bg transition-colors">取消</button>
            <button type="button" onClick={handleAdd} disabled={!selectedFriend} className="px-4 py-2 rounded-btn bg-warm-primary text-white text-sm hover:bg-warm-primary/90 transition-colors disabled:opacity-50">确认添加</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
