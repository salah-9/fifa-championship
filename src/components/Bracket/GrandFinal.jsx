import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import MatchCard from './MatchCard';
import { Trophy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChampionship } from '../../context/ChampionshipContext';

export default function GrandFinal({ match }) {
  const { teams } = useChampionship();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (match?.winner) {
      setShowModal(true);
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#f5c518', '#00ff87', '#ffffff']
      });
    }
  }, [match?.winner]);

  if (!match) return null;

  const championTeam = teams.find(t => t.id === match.winner);

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="font-display text-2xl text-accent-yellow tracking-widest mb-6 flex items-center gap-2 glow-yellow">
        <Trophy size={28} className="text-accent-yellow" />
        GRANDE FINAL
      </div>
      
      <div className="w-80">
        <MatchCard match={match} title="Match Final" />
      </div>

      <AnimatePresence>
        {showModal && championTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-bg-card border-2 border-accent-yellow p-8 rounded-2xl max-w-md w-full text-center relative glow-yellow"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-text-secondary hover:text-white"
              >
                <X size={24} />
              </button>

              <Trophy size={64} className="text-accent-yellow mx-auto mb-4" />
              <h2 className="font-display text-4xl mb-2 text-white">CAMPEÃO!</h2>
              
              <div 
                className="text-6xl my-6"
                style={{ textShadow: `0 0 20px ${championTeam.color || '#f5c518'}80` }}
              >
                {championTeam.emoji}
              </div>
              
              <h3 className="font-display text-3xl mb-6 text-accent-yellow">
                {championTeam.name}
              </h3>

              {championTeam.players && championTeam.players.length > 0 && (
                <div className="bg-bg-primary p-4 rounded-lg border border-border">
                  <p className="text-sm text-text-secondary mb-2 uppercase tracking-wider font-bold">Jogadores</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {championTeam.players.map((p, i) => (
                      <span key={i} className="bg-bg-card-hover px-3 py-1 rounded-md text-white font-medium">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}