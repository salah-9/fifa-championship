import MatchCard from './MatchCard';
export default function LowerBracket({ lb }) {
  if (!lb) return null;
  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-4">{lb.round1.map(m => <MatchCard key={m.id} match={m} title="R1" />)}</div>
      <div className="flex flex-col gap-4">{lb.round2.map(m => <MatchCard key={m.id} match={m} title="R2" />)}</div>
      <div className="flex flex-col gap-4">{lb.semis.map(m => <MatchCard key={m.id} match={m} title="Semis" />)}</div>
      <div className="flex flex-col gap-4"><MatchCard match={lb.final} title="Final Lower" /></div>
    </div>
  );
}