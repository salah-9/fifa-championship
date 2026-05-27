import { useState } from 'react';
import { useChampionship } from '../../context/ChampionshipContext';
import { Check } from 'lucide-react';

export default function MatchCard({ match, title }) {
  const { teams, submitScore } = useChampionship();

  const [score1, setScore1] = useState(match?.score1 ?? '');
  const [score2, setScore2] = useState(match?.score2 ?? '');
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);

  if (!match) return null;

  const team1 = teams?.find(t => t.id === match.team1);
  const team2 = teams?.find(t => t.id === match.team2);

  const handleSave = () => {
    if (score1 === '' || score2 === '') return;
    const s1 = parseInt(score1, 10);
    const s2 = parseInt(score2, 10);
    if (s1 === s2) {
      setShowPenaltyModal(true);
    } else {
      submitScore(match.id, s1, s2);
    }
  };

  const handlePenaltyWin = (winnerId) => {
    setShowPenaltyModal(false);
    submitScore(match.id, parseInt(score1, 10), parseInt(score2, 10), winnerId);
  };

  return (
    <div className="bg-bg-card border border-border rounded-xl p-3 w-56 sm:w-64 shadow-lg relative shrink-0">
      {title && (
        <p className="text-xs text-text-secondary text-center mb-3 uppercase tracking-widest font-bold">{title}</p>
      )}

      <div className="flex flex-col gap-2">
        {/* Time 1 */}
        <div className={`flex items-center justify-between p-2 rounded-lg ${match.winner === match.team1 ? 'bg-accent-green/10 border border-accent-green/30' : 'bg-bg-primary'}`}>
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xl">{team1?.emoji || '❔'}</span>
            <span className="text-xs sm:text-sm font-bold text-white truncate">{team1?.name || 'A Definir'}</span>
          </div>
          <input
            type="number"
            value={score1}
            onChange={(e) => setScore1(e.target.value)}
            disabled={match.locked || !team1 || !team2 || match.winner}
            className="w-11 h-9 bg-bg-card border border-border rounded text-center text-white font-bold focus:border-accent-green outline-none touch-manipulation"
          />
        </div>

        {/* Time 2 */}
        <div className={`flex items-center justify-between p-2 rounded-lg ${match.winner === match.team2 ? 'bg-accent-green/10 border border-accent-green/30' : 'bg-bg-primary'}`}>
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xl">{team2?.emoji || '❔'}</span>
            <span className="text-xs sm:text-sm font-bold text-white truncate">{team2?.name || 'A Definir'}</span>
          </div>
          <input
            type="number"
            value={score2}
            onChange={(e) => setScore2(e.target.value)}
            disabled={match.locked || !team1 || !team2 || match.winner}
            className="w-11 h-9 bg-bg-card border border-border rounded text-center text-white font-bold focus:border-accent-green outline-none touch-manipulation"
          />
        </div>
      </div>

      {!match.locked && team1 && team2 && score1 !== '' && score2 !== '' && !match.winner && (
        <button
          onClick={handleSave}
          className="mt-3 w-full min-h-[40px] bg-accent-green/20 text-accent-green hover:bg-accent-green hover:text-black transition-colors py-1.5 rounded-lg flex items-center justify-center"
        >
          <Check size={18} />
        </button>
      )}

      {showPenaltyModal && (
        <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-4 rounded-xl z-20">
          <p className="text-accent-yellow text-sm font-bold mb-3 text-center">Empate! Vencedor nos pênaltis:</p>
          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={() => handlePenaltyWin(team1.id)}
              className="bg-bg-primary hover:bg-accent-yellow/20 border border-accent-yellow/50 text-white py-2.5 rounded-lg text-sm font-bold truncate px-2 transition-colors"
            >
              {team1.emoji} {team1.name}
            </button>
            <button
              onClick={() => handlePenaltyWin(team2.id)}
              className="bg-bg-primary hover:bg-accent-yellow/20 border border-accent-yellow/50 text-white py-2.5 rounded-lg text-sm font-bold truncate px-2 transition-colors"
            >
              {team2.emoji} {team2.name}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
