import { useState, useCallback } from 'react';

const STORAGE_KEY = 'pokedex-team';
const MAX_TEAM_SIZE = 6;

function getTeam(): number[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useTeam() {
  const [team, setTeam] = useState<number[]>(getTeam);

  const save = (next: number[]) => {
    setTeam(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addToTeam = useCallback((id: number) => {
    setTeam(prev => {
      if (prev.length >= MAX_TEAM_SIZE || prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFromTeam = useCallback((id: number) => {
    setTeam(prev => {
      const next = prev.filter(p => p !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isInTeam = useCallback((id: number) => team.includes(id), [team]);

  const clearTeam = useCallback(() => save([]), []);

  const reorder = useCallback((fromIndex: number, toIndex: number) => {
    setTeam(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { team, addToTeam, removeFromTeam, isInTeam, clearTeam, reorder, isFull: team.length >= MAX_TEAM_SIZE };
}
