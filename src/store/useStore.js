import { create } from 'zustand';

const useStore = create((set) => ({
  movement: 0,
  setMovement: (direction) => set({ movement: direction }),
  
  activeProject: null, 
  setActiveProject: (project) => set({ activeProject: project }),

  // YENİ EKLENEN KISIM: Oyun başladı mı?
  started: false,
  setStarted: (status) => set({ started: status }),
}));

export default useStore;