import MatchCard from './MatchCard';
export default function WinnerBracket({ wb }) {
  if (!wb) return null;
  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-4">{wb.round_of_8.map(m => <MatchCard key={m.id} match={m} title="Quartas" />)}</div>
      <div className="flex flex-col gap-4 justify-center">{wb.semis.map(m => <MatchCard key={m.id} match={m} title="Semis" />)}</div>
      <div className="flex flex-col gap-4 justify-center"><MatchCard match={wb.final} title="Final" /></div>
    </div>
  );
}