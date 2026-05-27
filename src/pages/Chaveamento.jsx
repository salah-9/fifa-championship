import { Navigate } from 'react-router-dom';
import { useChampionship } from '../context/ChampionshipContext';
import WinnerBracket from '../components/Bracket/WinnerBracket';
import LowerBracket from '../components/Bracket/LowerBracket';
import GrandFinal from '../components/Bracket/GrandFinal';

export default function Chaveamento() {
  const { championship } = useChampionship();
  if (!championship) return <Navigate to="/sorteio" replace />;

  return (
    <div className="p-6 flex flex-col gap-12 items-center">
      <h1 className="text-white text-3xl font-bold">CHAVEAMENTO</h1>
      <div className="w-full max-w-5xl flex flex-col gap-16">
        <WinnerBracket wb={championship.winner_bracket} />
        <div className="border-t border-gray-700 pt-10">
          <LowerBracket lb={championship.lower_bracket} />
        </div>
        <div className="flex justify-center">
          <GrandFinal match={championship.grand_final} />
        </div>
      </div>
    </div>
  );
}