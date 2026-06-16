export type RelationshipStatus = 'close' | 'regular' | 'occasional' | 'lost';

export const RELATIONSHIP_LABELS: Record<RelationshipStatus, string> = {
  close: '亲密好友',
  regular: '常联系',
  occasional: '偶尔联系',
  lost: '已失联',
};

export const RELATIONSHIP_COLORS: Record<RelationshipStatus, string> = {
  close: '#7FB3A0',
  regular: '#D4826A',
  occasional: '#E8C87A',
  lost: '#B0B0B0',
};

export interface Milestone {
  id: string;
  friend_id: string;
  date: string;
  title: string;
  description?: string;
  created_at: string;
}

export interface Friend {
  id: string;
  nickname: string;
  name?: string;
  avatar_url?: string;
  tags: string[];
  met_date: string;
  met_place_name?: string;
  met_place_lat?: number;
  met_place_lng?: number;
  met_story: string;
  relationship: RelationshipStatus;
  created_at: string;
  updated_at: string;
}

export interface FriendFormData {
  nickname: string;
  name?: string;
  avatar_url?: string;
  tags: string[];
  met_date: string;
  met_place_name?: string;
  met_place_lat?: number;
  met_place_lng?: number;
  met_story: string;
  relationship: RelationshipStatus;
}

export interface MilestoneFormData {
  date: string;
  title: string;
  description?: string;
}

export interface FilterState {
  searchQuery: string;
  selectedTags: string[];
  dateRange: [string, string] | null;
  relationshipFilter: RelationshipStatus | 'all';
}
