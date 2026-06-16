import { create } from 'zustand';
import type { RelationshipStatus } from '../types';

interface FilterStore {
  searchQuery: string;
  selectedTags: string[];
  dateRange: [string, string] | null;
  relationshipFilter: RelationshipStatus | 'all';
  timelineZoom: 'month' | 'quarter' | 'year';

  setSearchQuery: (q: string) => void;
  toggleTag: (tag: string) => void;
  setDateRange: (range: [string, string] | null) => void;
  setRelationshipFilter: (status: RelationshipStatus | 'all') => void;
  setTimelineZoom: (zoom: 'month' | 'quarter' | 'year') => void;
  resetFilters: () => void;
}

const initialState = {
  searchQuery: '',
  selectedTags: [] as string[],
  dateRange: null as [string, string] | null,
  relationshipFilter: 'all' as RelationshipStatus | 'all',
  timelineZoom: 'month' as 'month' | 'quarter' | 'year',
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  toggleTag: (tag) =>
    set((state) => ({
      selectedTags: state.selectedTags.includes(tag)
        ? state.selectedTags.filter((t) => t !== tag)
        : [...state.selectedTags, tag],
    })),
  setDateRange: (dateRange) => set({ dateRange }),
  setRelationshipFilter: (relationshipFilter) => set({ relationshipFilter }),
  setTimelineZoom: (timelineZoom) => set({ timelineZoom }),
  resetFilters: () => set(initialState),
}));
