import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shuffle, AlertTriangle, RotateCcw, ChevronRight, Check } from 'lucide-react'
import { useChampionship } from '../context/ChampionshipContext'
import { generateBracket } from '../utils/bracket'
import { useNavigate } from 'react-router-dom'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Sorteio() {
  const { teams, championship, startChampionship, resetChampionship } = useChampionship()
  const navigate = useNavigate()

  const [selected, setSelected] = useState([])
  const [sortedMatches, setSortedMatches] = useState(null)
  const [animating, setAnimating] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const hasActiveChampionship = championship?.status === 'in_progress' || championship?.status === 'finished'

  function toggleTeam(team) {
    if (hasActiveChampionship) return
    setSelected((prev) =>
      prev.find((t) => t.id === team.id)
        ? prev.filter((t) => t.id !== team.id)
        : prev.length < 8
        ? [...prev, team]
        : prev
    )
    setSortedMatches(null)
  }

  async function handleSort() {
    if (selected.length !== 8) return
    setAnimating(true)
    setSortedMatches(null)

    await new Promise((r) => setTimeout(r, 600))

    const shuffled = shuffle(selected)
    const matches = [
      [shuffled[0], shuffled[7]],
      [shuffled[1], shuffled[6]],
      [shuffled[2], shuffled[5]],
      [shuffled[3], shuffled[4]],
    ]
    setSortedMatches({ shuffled, matches })
    setAnimating(false)
  }

  function handleConfirm() {
    if (!sortedMatches) return
    const bracket = generateBracket(sortedMatches.shuffled)
    startChampionship(bracket)
    setConfirmed(true)
    setTimeout(() => navigate('/chaveamento'), 1200)
  }

  function handleReset() {
    resetChampionship()
    setShowResetModal(false)
    setSelected([])
    setSortedMatches(null)
    setConfirmed(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl text-white tracking-wide">SORTEIO</h1>
          <p className="text-[#8888aa] text-sm">Selecione 8 times para o campeonato</p>
        </div>
        {hasActiveChampionship && (
          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-2 border border-[#ff4444]/50 text-[#ff4444] px-4 py-2 rounded-lg hover:bg-[#ff4444]/10 transition-colors text-sm"
          >
            <RotateCcw size={15} /> Resetar Campeonato
          </button>
        )}
      </div>

      {/* Reset Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#12121a] border border-[#ff4444]/30 rounded-2xl p-6 max-w-sm w-full mx-4 text-center"
            >
              <AlertTriangle className="mx-auto text-[#ff4444] mb-3" size={36} />
              <h2 className="font-display text-2xl text-white mb-2">RESETAR CAMPEONATO?</h2>
              <p className="text-[#8888aa] text-sm mb-6">
                Todo o progresso do campeonato atual será perdido. Os times cadastrados serão mantidos.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 border border-[#2a2a3a] text-[#8888aa] py-2.5 rounded-xl hover:text-white hover:border-[#8888aa] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-[#ff4444] text-white font-semibold py-2.5 rounded-xl hover:bg-[#dd2222] transition-colors"
                >
                  Resetar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active championship warning */}
      {hasActiveChampionship && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#f5c518]/10 border border-[#f5c518]/30 rounded-xl p-4 mb-6 flex items-center gap-3"
        >
          <AlertTriangle className="text-[#f5c518] shrink-0" size={20} />
          <div>
            <p className="text-[#f5c518] font-medium text-sm">Campeonato em andamento</p>
            <p className="text-[#8888aa] text-xs">Para iniciar um novo sorteio, você precisa resetar o campeonato atual.</p>
          </div>
          <button
            onClick={() => navigate('/chaveamento')}
            className="ml-auto flex items-center gap-1 text-[#00ff87] text-sm font-medium hover:underline shrink-0"
          >
            Ver bracket <ChevronRight size={14} />
          </button>
        </motion.div>
      )}

      {/* Team Selection */}
      {!hasActiveChampionship && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[#8888aa] text-sm">
              <span className={selected.length === 8 ? 'text-[#00ff87] font-semibold' : 'text-white font-semibold'}>
                {selected.length}/8
              </span>{' '}
              times selecionados
            </p>
          </div>

          {teams.length < 8 && (
            <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-6 text-center mb-6">
              <p className="text-[#8888aa]">Cadastre ao menos 8 times para realizar o sorteio.</p>
              <button
                onClick={() => navigate('/cadastro')}
                className="mt-3 text-[#00ff87] text-sm hover:underline"
              >
                Ir para Cadastro de Times
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
            {teams.map((team) => {
              const isSelected = selected.some((t) => t.id === team.id)
              return (
                <motion.button
                  key={team.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleTeam(team)}
                  className={`relative p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-[#00ff87] bg-[#00ff87]/10'
                      : 'border-[#2a2a3a] bg-[#12121a] hover:border-[#3a3a4a]'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-[#00ff87] rounded-full flex items-center justify-center">
                      <Check size={11} className="text-black" />
                    </span>
                  )}
                  <div className="text-2xl mb-1">{team.emoji}</div>
                  <p className="font-display text-sm tracking-wide truncate" style={{ color: isSelected ? '#00ff87' : 'white' }}>
                    {team.name}
                  </p>
                  {team.players?.filter(Boolean).length > 0 && (
                    <p className="text-[#8888aa] text-xs truncate">{team.players.filter(Boolean).join(' · ')}</p>
                  )}
                </motion.button>
              )
            })}
          </div>

          {selected.length === 8 && !sortedMatches && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSort}
                disabled={animating}
                className="inline-flex items-center gap-3 bg-[#00ff87] text-black font-bold px-8 py-3.5 rounded-2xl text-lg hover:bg-[#00dd77] transition-colors disabled:opacity-50"
              >
                <Shuffle size={22} className={animating ? 'animate-spin' : ''} />
                {animating ? 'Sorteando...' : 'Realizar Sorteio!'}
              </motion.button>
            </motion.div>
          )}
        </>
      )}

      {/* Sorted Results */}
      <AnimatePresence>
        {sortedMatches && !hasActiveChampionship && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="font-display text-2xl text-[#f5c518] tracking-wide text-center">CONFRONTOS SORTEADOS</h2>
            <p className="text-[#8888aa] text-sm text-center mb-4">Winner Bracket — Oitavas de Final</p>

            <div className="grid sm:grid-cols-2 gap-3">
              {sortedMatches.matches.map(([a, b], i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12 }}
                  className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4 flex items-center gap-3"
                >
                  <span className="font-display text-[#8888aa] text-lg w-6 text-center">{i + 1}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xl">{a.emoji}</span>
                    <span className="font-display text-sm tracking-wide" style={{ color: a.color }}>{a.name}</span>
                  </div>
                  <span className="text-[#8888aa] font-display text-sm">VS</span>
                  <div className="flex-1 flex items-center gap-2 justify-end">
                    <span className="font-display text-sm tracking-wide" style={{ color: b.color }}>{b.name}</span>
                    <span className="text-xl">{b.emoji}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3 mt-6 justify-center">
              <button
                onClick={handleSort}
                className="flex items-center gap-2 border border-[#2a2a3a] text-[#8888aa] px-5 py-2.5 rounded-xl hover:text-white hover:border-[#8888aa] transition-colors"
              >
                <Shuffle size={16} /> Sortear Novamente
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleConfirm}
                disabled={confirmed}
                className="flex items-center gap-2 bg-[#00ff87] text-black font-bold px-6 py-2.5 rounded-xl hover:bg-[#00dd77] transition-colors disabled:opacity-60"
              >
                {confirmed ? <><Check size={18} /> Confirmado!</> : <><Check size={18} /> Confirmar e Gerar Bracket</>}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
