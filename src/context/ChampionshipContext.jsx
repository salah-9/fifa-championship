import { createContext, useContext, useState, useCallback } from 'react';
import { storage } from '../utils/storage';
import { advanceBracket, determineWinner } from '../utils/bracket';

const ChampionshipContext = createContext(null);

export function ChampionshipProvider({ children }) {
  const [teams, setTeamsState] = useState(() => storage.getTeams());
  const [players, setPlayersState] = useState(() => storage.getPlayers());
  const [championship, setChampionshipState] = useState(() => storage.getChampionship());

  const saveTeams = useCallback((t) => {
    setTeamsState(t);
    storage.saveTeams(t);
  }, []);

  const saveChampionship = useCallback((c) => {
    setChampionshipState(c);
    storage.saveChampionship(c);
  }, []);

  const addTeam = useCallback((data) => {
    setTeamsState((prev) => {
      const updated = [...prev, { id: crypto.randomUUID(), players: [], ...data }];
      storage.saveTeams(updated);
      return updated;
    });
  }, []);

  const updateTeam = useCallback((id, data) => {
    setTeamsState((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...data } : t));
      storage.saveTeams(updated);
      return updated;
    });
  }, []);

  const deleteTeam = useCallback((id) => {
    setTeamsState((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      storage.saveTeams(updated);
      return updated;
    });
  }, []);

  const addPlayer = useCallback((name) => {
    setPlayersState((prev) => {
      const updated = [...prev, { id: crypto.randomUUID(), name }];
      storage.savePlayers(updated);
      return updated;
    });
  }, []);

  const deletePlayer = useCallback((id) => {
    setPlayersState((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      storage.savePlayers(updated);
      return updated;
    });
  }, []);

  const startChampionship = useCallback((newChampionship) => {
    saveChampionship(newChampionship);
  }, [saveChampionship]);

  const resetChampionship = useCallback(() => {
    storage.resetChampionship();
    setChampionshipState(null);
  }, []);

  const submitScore = useCallback((matchId, score1, score2, penaltyWinner = null) => {
    if (!championship) return;
    const match = getAllMatches(championship).find((m) => m.id === matchId);
    if (!match) return;
    const updatedMatch = determineWinner(match, score1, score2, penaltyWinner);
    const updated = advanceBracket(championship, updatedMatch);
    saveChampionship(updated);
  }, [championship, saveChampionship]);

  return (
    <ChampionshipContext.Provider value={{
      teams,
      players,
      championship,
      saveTeams,
      addTeam,
      updateTeam,
      deleteTeam,
      addPlayer,
      deletePlayer,
      startChampionship,
      resetChampionship,
      submitScore,
    }}>
      {children}
    </ChampionshipContext.Provider>
  );
}

export function useChampionship() {
  const ctx = useContext(ChampionshipContext);
  if (!ctx) throw new Error('useChampionship must be used within ChampionshipProvider');
  return ctx;
}

function getAllMatches(c) {
  return [
    ...c.winner_bracket.round_of_8,
    ...c.winner_bracket.semis,
    c.winner_bracket.final,
    ...c.lower_bracket.round1,
    ...c.lower_bracket.round2,
    ...c.lower_bracket.semis,
    c.lower_bracket.final,
    c.grand_final,
  ];
}
