import { createContext, useContext, useState, useCallback } from 'react';
import { storage } from '../utils/storage';
import { advanceBracket, determineWinner } from '../utils/bracket';

const ChampionshipContext = createContext(null);

export function ChampionshipProvider({ children }) {
  const [teams, setTeamsState] = useState(() => storage.getTeams());
  const [championship, setChampionshipState] = useState(() => storage.getChampionship());

  const saveChampionship = useCallback((c) => {
    setChampionshipState(c);
    storage.saveChampionship(c);
  }, []);

  const startChampionship = useCallback((newChampionship) => {
    saveChampionship(newChampionship);
  }, [saveChampionship]);

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
      championship,
      startChampionship,
      submitScore,
    }}>
      {children}
    </ChampionshipContext.Provider>
  );
}

// ESTA É A ÚNICA VEZ QUE ESSA FUNÇÃO DEVE APARECER NO ARQUIVO
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