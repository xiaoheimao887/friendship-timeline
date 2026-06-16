import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useFriendStore } from '../../store/useFriendStore';
import { FriendAvatar } from '../avatar/FriendAvatar';
import { Link } from 'react-router-dom';
import { formatDateShort } from '../../utils/date-utils';
import { EmptyState } from '../ui/EmptyState';

function createMarkerIcon(color: string, letter: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 28px; height: 28px;
      background: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 600; color: white;
    ">${letter}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

function createMeetIcon(nickname: string) {
  const letter = nickname.charAt(0);
  return createMarkerIcon('#D4826A', letter);
}

function createLocationIcon(nickname: string) {
  const letter = nickname.charAt(0);
  return createMarkerIcon('#7FB3A0', letter);
}

export function MapPage() {
  const friends = useFriendStore(s => s.friends);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredFriends = useMemo(() => {
    if (!selectedTag) return friends;
    return friends.filter(f => f.tags.includes(selectedTag));
  }, [friends, selectedTag]);

  const markers = useMemo(() => {
    const result: { type: 'meet' | 'current'; friend: typeof friends[0]; lat: number; lng: number }[] = [];

    filteredFriends.forEach(f => {
      if (f.met_place_lat && f.met_place_lng) {
        result.push({ type: 'meet', friend: f, lat: f.met_place_lat, lng: f.met_place_lng });
      }
      if (f.current_location_lat && f.current_location_lng) {
        result.push({ type: 'current', friend: f, lat: f.current_location_lat, lng: f.current_location_lng });
      }
    });

    return result;
  }, [filteredFriends]);

  const allTags = Array.from(new Set(friends.flatMap(f => f.tags))).sort();
  const hasAnyLocation = friends.some(f => f.met_place_lat || f.current_location_lat);

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
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-warm-muted">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4826A]" /> 认识地点
          </span>
          <span className="flex items-center gap-1.5 text-xs text-warm-muted">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7FB3A0]" /> 所在地
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
        {!hasAnyLocation ? (
          <div className="h-full flex items-center justify-center bg-white">
            <EmptyState
              icon="🗺"
              title="还没有标记地点"
              description="添加朋友时填写地点并搜索真实位置即可在地图上显示"
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
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {markers.map((m, i) => (
              <Marker
                key={`${m.friend.id}-${m.type}-${i}`}
                position={[m.lat, m.lng]}
                icon={m.type === 'meet' ? createMeetIcon(m.friend.nickname) : createLocationIcon(m.friend.nickname)}
              >
                <Popup>
                  <div className="flex items-center gap-2 min-w-[160px]">
                    <FriendAvatar friend={m.friend} size="sm" />
                    <div>
                      <Link to={`/friends/${m.friend.id}`} className="font-medium text-sm text-warm-primary hover:underline block">
                        {m.friend.nickname}
                      </Link>
                      <p className="text-xs text-warm-muted mt-0.5">
                        {m.type === 'meet' ? '📍 ' : '📌 '}
                        {m.type === 'meet' ? (m.friend.met_place_name || '认识地点') : (m.friend.current_location_name || '所在地')}
                      </p>
                      {m.type === 'meet' && (
                        <p className="text-xs text-warm-muted">{formatDateShort(m.friend.met_date)}</p>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {hasAnyLocation && (
        <p className="text-xs text-warm-muted mt-3 text-center">
          共 {markers.length} 个标记 / {friends.length} 位朋友
        </p>
      )}
    </div>
  );
}
