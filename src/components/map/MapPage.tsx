import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useFriendStore } from '../../store/useFriendStore';
import { FriendAvatar } from '../avatar/FriendAvatar';
import { TagBadge } from '../tags/TagBadge';
import { Link } from 'react-router-dom';
import { formatDateShort } from '../../utils/date-utils';
import { EmptyState } from '../ui/EmptyState';

export function MapPage() {
  const friends = useFriendStore(s => s.friends);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const placed = useMemo(() => {
    let result = friends.filter(f => f.met_place_lat && f.met_place_lng);
    if (selectedTag) {
      result = result.filter(f => f.tags.includes(selectedTag));
    }
    return result;
  }, [friends, selectedTag]);

  const allTags = Array.from(new Set(friends.flatMap(f => f.tags))).sort();
  const unplaced = friends.filter(f => !f.met_place_lat);

  if (!useFriendStore.getState().initialized) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-warm-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-xl font-semibold text-warm-text">地图</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-warm-muted">
            已标注 {placed.length}/{friends.filter(f => f.met_place_lat).length} 位
          </span>
        </div>
      </div>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
              selectedTag === tag
                ? 'bg-warm-primary text-white'
                : 'bg-warm-primaryLight/60 text-warm-primary hover:bg-warm-primaryLight'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="flex-1 rounded-card overflow-hidden border border-warm-border/50">
        {placed.length === 0 ? (
          <div className="h-full flex items-center justify-center bg-white">
            <EmptyState
              icon="🗺"
              title="还没有标记地点"
              description={unplaced.length > 0 ? `${unplaced.length} 位朋友还没有标注认识地点，编辑档案添加吧` : '添加朋友时填写认识地点即可在地图上显示'}
            />
          </div>
        ) : (
          <MapContainer
            center={[20, 0]}
            zoom={2}
            className="h-full w-full"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {placed.map(friend => (
              <Marker
                key={friend.id}
                position={[friend.met_place_lat!, friend.met_place_lng!]}
              >
                <Popup>
                  <div className="flex items-center gap-2 min-w-[150px]">
                    <FriendAvatar friend={friend} size="sm" />
                    <div>
                      <Link to={`/friends/${friend.id}`} className="font-medium text-sm text-warm-primary hover:underline">
                        {friend.nickname}
                      </Link>
                      <p className="text-xs text-warm-muted">{formatDateShort(friend.met_date)}</p>
                      {friend.met_place_name && (
                        <p className="text-xs text-warm-muted">{friend.met_place_name}</p>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {unplaced.length > 0 && (
        <p className="text-xs text-warm-muted mt-3 text-center">
          {unplaced.length} 位朋友未标注地点
        </p>
      )}
    </div>
  );
}
