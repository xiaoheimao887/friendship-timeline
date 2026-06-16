import { create } from 'zustand';
import type { Friend, FriendFormData } from '../types';
import * as friendService from '../services/friendService';

interface FriendStore {
  friends: Friend[];
  loading: boolean;
  initialized: boolean;
  pinHash: string | null;

  setPinHash: (hash: string) => void;
  loadFriends: (pinHash: string) => Promise<void>;
  addFriend: (data: FriendFormData) => Promise<Friend>;
  updateFriend: (id: string, data: Partial<FriendFormData>) => Promise<void>;
  removeFriend: (id: string) => Promise<void>;
  getFriend: (id: string) => Friend | undefined;
}

export const useFriendStore = create<FriendStore>((set, get) => ({
  friends: [],
  loading: false,
  initialized: false,
  pinHash: null,

  setPinHash: (hash: string) => {
    set({ pinHash: hash });
  },

  loadFriends: async (pinHash: string) => {
    set({ loading: true });
    try {
      const friends = await friendService.fetchFriends(pinHash);
      set({ friends, loading: false, initialized: true, pinHash });
    } catch (error) {
      console.error('Failed to load friends:', error);
      set({ friends: [], loading: false, initialized: true });
    }
  },

  addFriend: async (data: FriendFormData) => {
    const { pinHash } = get();
    if (!pinHash) throw new Error('Not authenticated');
    const friend = await friendService.createFriend({ ...data, pin_hash: pinHash });
    set(state => ({ friends: [friend, ...state.friends] }));
    return friend;
  },

  updateFriend: async (id: string, data: Partial<FriendFormData>) => {
    const updated = await friendService.updateFriend(id, data);
    set(state => ({
      friends: state.friends.map(f => (f.id === id ? updated : f)),
    }));
  },

  removeFriend: async (id: string) => {
    await friendService.deleteFriend(id);
    set(state => ({
      friends: state.friends.filter(f => f.id !== id),
    }));
  },

  getFriend: (id: string) => {
    return get().friends.find(f => f.id === id);
  },
}));
