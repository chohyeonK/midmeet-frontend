import { create } from 'zustand';

interface PartyState {
  // 참여 시 필요한 데이터
  partyId: string | null;

  // 상태 저장 액션
  setPartyId: (partyId: string) => void;
  clearJoinInfo: () => void;
}

export const usePartyStore = create<PartyState>((set) => ({
  partyId: null,
  joinToken: null,

  setPartyId: (partyId) => set({ partyId }),

  clearJoinInfo() {
    set({
      partyId: null,
    });
  },
}));
