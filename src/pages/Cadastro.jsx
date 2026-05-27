import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Check, X, Shuffle, ChevronRight, ArrowRight } from 'lucide-react'
import { useChampionship } from '../context/ChampionshipContext'
import { useNavigate } from 'react-router-dom'

const EMOJIS = ['⚽', '🏆', '🦁', '🐯', '🦊', '🐺', '🦅', '🔥', '⚡', '🌪️', '💎', '👑', '🛡️', '⚔️', '🎯', '🚀']
const COLORS = ['#00ff87', '#f5c518', '#ff4444', '#4488ff', '#ff44ff', '#ff8800', '#00ffff', '#ff0088']

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function TeamForm({ initial, existingTeams, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [emoji, setEmoji] = useState(initial?.emoji || '⚽')
  const [color, setColor] = useState(initial?.color || '#00ff87')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return setError('Nome obrigatório')
    const duplicate = existingTeams.some(
      (t) => t.name.toLowerCase() === trimmed.toLowerCase() && t.id !== initial?.id
    )
    if (duplicate) return setError('Nome já existe')
    onSave({ name: trimmed, emoji, color, players: initial?.players || [] })
  }

  return (
    <form onSubmit={submit} className="bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl p-4 space-y-3">
      <div>
        <input
          value={name}
          onChange={(e) => { setName(e.target.value); setError('') }}
          placeholder="Nome do time"
          autoFocus
          className="w-full bg-[#12121a] border border-[#2a2a3a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00ff87] transition-colors text-sm"
        />
        {error && <p className="text-[#ff4444] text-xs mt-1">{error}</p>}
      </div>

      <div>
        <p className="text-xs text-[#8888aa] uppercase tracking-wider mb-1.5">Escudo</p>
        <div className="flex flex-wrap gap-1.5">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`w-8 h-8 rounded-lg text-lg transition-all ${
                emoji === e
                  ? 'bg-[#00ff87]/20 border-2 border-[#00ff87] scale-110'
                  : 'bg-[#12121a] border border-[#2a2a3a] hover:border-[#00ff87]/50'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-[#8888aa] uppercase tracking-wider mb-1.5">Cor</p>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              className={`w-7 h-7 rounded-full transition-transform ${
                color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0f]' : 'hover:scale-110'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex items-center gap-1.5 bg-[#00ff87] text-black font-semibold px-3 py-1.5 rounded-lg text-sm hover:bg-[#00dd77] transition-colors"
        >
          <Check size={14} /> Salvar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 border border-[#2a2a3a] text-[#8888aa] px-3 py-1.5 rounded-lg text-sm hover:text-white transition-colors"
        >
          <X size={14} /> Cancelar
        </button>
      </div>
    </form>
  )
}

export default function Cadastro() {
  const { teams, players, addTeam, updateTeam, deleteTeam, addPlayer, deletePlayer, saveTeams } = useChampionship()
  const navigate = useNavigate()

  const [showTeamForm, setShowTeamForm] = useState(false)
  const [editingTeam, setEditingTeam] = useState(null)
  const [newPlayerName, setNewPlayerName] = useState('')
  const [drawResult, setDrawResult] = useState(null)
  const [drawAnimating, setDrawAnimating] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  function handleSaveTeam(data) {
    if (editingTeam) {
      updateTeam(editingTeam.id, data)
      setEditingTeam(null)
    } else {
      addTeam(data)
      setShowTeamForm(false)
    }
    setDrawResult(null)
  }

  function handleDeleteTeam(id) {
    if (confirm('Remover este time?')) {
      deleteTeam(id)
      setDrawResult(null)
    }
  }

  function handleAddPlayer(e) {
    e.preventDefault()
    const name = newPlayerName.trim()
    if (!name) return
    addPlayer(name)
    setNewPlayerName('')
    setDrawResult(null)
  }

  function handleDeletePlayer(id) {
    deletePlayer(id)
    setDrawResult(null)
  }

  async function handleDraw() {
    setDrawAnimating(true)
    setDrawResult(null)
    await new Promise((r) => setTimeout(r, 600))
    const shuffled = shuffleArray(players)
    const result = teams.map((team, i) => ({ team, player: shuffled[i] || null }))
    setDrawResult(result)
    setDrawAnimating(false)
  }

  function handleConfirm() {
    if (!drawResult) return
    const updatedTeams = teams.map((team) => {
      const pair = drawResult.find((r) => r.team.id === team.id)
      return { ...team, players: pair?.player ? [pair.player.name] : [] }
    })
    saveTeams(updatedTeams)
    setConfirmed(true)
    setTimeout(() => navigate('/sorteio'), 900)
  }

  const canDraw = teams.length > 0 && players.length > 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display text-4xl text-white tracking-wide">CADASTRO</h1>
        <p className="text-[#8888aa] text-sm mt-1">
          Cadastre os times e jogadores, sorteie quem joga com qual time
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {/* ── Times ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-display text-xl text-white tracking-wide">TIMES</h2>
              <p className="text-[#8888aa] text-xs">
                {teams.length} cadastrado{teams.length !== 1 ? 's' : ''}
              </p>
            </div>
            {!showTeamForm && !editingTeam && (
              <button
                onClick={() => setShowTeamForm(true)}
                className="flex items-center gap-1.5 bg-[#00ff87] text-black font-semibold px-3 py-1.5 rounded-lg text-sm hover:bg-[#00dd77] transition-colors"
              >
                <Plus size={15} /> Novo Time
              </button>
            )}
          </div>

          <AnimatePresence mode="popLayout">
            {showTeamForm && (
              <motion.div
                key="new-team-form"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-3"
              >
                <TeamForm
                  existingTeams={teams}
                  onSave={handleSaveTeam}
                  onCancel={() => setShowTeamForm(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {teams.map((team) =>
                editingTeam?.id === team.id ? (
                  <motion.div
                    key={`edit-${team.id}`}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <TeamForm
                      initial={team}
                      existingTeams={teams}
                      onSave={handleSaveTeam}
                      onCancel={() => setEditingTeam(null)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={team.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-3 flex items-center gap-3 group hover:border-[#3a3a4a] transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                      style={{ backgroundColor: `${team.color}22`, border: `2px solid ${team.color}44` }}
                    >
                      {team.emoji}
                    </div>
                    <span
                      className="font-display text-base tracking-wide flex-1 truncate"
                      style={{ color: team.color }}
                    >
                      {team.name}
                    </span>
                    <div className="flex gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingTeam(team); setShowTeamForm(false) }}
                        className="p-1.5 rounded-lg border border-[#2a2a3a] text-[#8888aa] hover:text-[#f5c518] hover:border-[#f5c518]/50 transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="p-1.5 rounded-lg border border-[#2a2a3a] text-[#8888aa] hover:text-[#ff4444] hover:border-[#ff4444]/50 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </motion.div>
                )
              )}
            </AnimatePresence>
            {teams.length === 0 && !showTeamForm && (
              <p className="text-center py-10 text-[#8888aa] text-sm">Nenhum time cadastrado</p>
            )}
          </div>
        </div>

        {/* ── Jogadores ── */}
        <div>
          <div className="mb-3">
            <h2 className="font-display text-xl text-white tracking-wide">JOGADORES</h2>
            <p className="text-[#8888aa] text-xs">
              {players.length} cadastrado{players.length !== 1 ? 's' : ''}
            </p>
          </div>

          <form onSubmit={handleAddPlayer} className="flex gap-2 mb-3">
            <input
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Nome do jogador"
              className="flex-1 bg-[#12121a] border border-[#2a2a3a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00ff87] transition-colors"
            />
            <button
              type="submit"
              disabled={!newPlayerName.trim()}
              className="flex items-center gap-1 bg-[#00ff87] text-black font-semibold px-3 py-2 rounded-lg text-sm hover:bg-[#00dd77] transition-colors disabled:opacity-40"
            >
              <Plus size={16} />
            </button>
          </form>

          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {players.map((player, i) => (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-3 flex items-center gap-3 group hover:border-[#3a3a4a] transition-colors"
                >
                  <span className="w-5 text-center text-[#8888aa] text-xs font-mono shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-white text-sm font-medium truncate">{player.name}</span>
                  <button
                    onClick={() => handleDeletePlayer(player.id)}
                    className="p-1.5 rounded-lg border border-[#2a2a3a] text-[#8888aa] hover:text-[#ff4444] hover:border-[#ff4444]/50 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {players.length === 0 && (
              <p className="text-center py-10 text-[#8888aa] text-sm">Nenhum jogador cadastrado</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Sorteio ── */}
      {canDraw && (
        <div className="border-t border-[#2a2a3a] pt-8">
          <div className="text-center mb-6">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDraw}
              disabled={drawAnimating}
              className="inline-flex items-center gap-3 bg-[#f5c518] text-black font-bold px-8 py-3.5 rounded-2xl text-lg hover:bg-[#e0b300] transition-colors disabled:opacity-50"
            >
              <Shuffle size={22} className={drawAnimating ? 'animate-spin' : ''} />
              {drawAnimating ? 'Sorteando...' : 'Sortear Jogadores para Times'}
            </motion.button>
            <p className="text-[#8888aa] text-xs mt-2">
              {teams.length} time{teams.length !== 1 ? 's' : ''} · {players.length} jogador{players.length !== 1 ? 'es' : ''}
              {players.length < teams.length && (
                <span className="text-[#f5c518]">
                  {' '}· {teams.length - players.length} time{teams.length - players.length !== 1 ? 's' : ''} ficarão sem jogador
                </span>
              )}
            </p>
          </div>

          <AnimatePresence>
            {drawResult && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="font-display text-xl text-[#f5c518] tracking-wide text-center">
                  RESULTADO DO SORTEIO
                </h3>

                <div className="grid sm:grid-cols-2 gap-2">
                  {drawResult.map(({ team, player }, i) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-3 flex items-center gap-2"
                    >
                      <span className="text-white text-sm font-medium flex-1 truncate min-w-0">
                        {player
                          ? player.name
                          : <span className="text-[#8888aa] italic text-xs">sem jogador</span>
                        }
                      </span>
                      <ArrowRight size={13} className="text-[#8888aa] shrink-0" />
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-base shrink-0"
                        style={{ backgroundColor: `${team.color}22`, border: `1.5px solid ${team.color}55` }}
                      >
                        {team.emoji}
                      </div>
                      <span
                        className="font-display text-sm tracking-wide truncate min-w-0 max-w-[90px]"
                        style={{ color: team.color }}
                      >
                        {team.name}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 justify-center mt-6">
                  <button
                    onClick={handleDraw}
                    className="flex items-center gap-2 border border-[#2a2a3a] text-[#8888aa] px-5 py-2.5 rounded-xl hover:text-white hover:border-[#8888aa] transition-colors text-sm"
                  >
                    <Shuffle size={15} /> Sortear Novamente
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleConfirm}
                    disabled={confirmed}
                    className="flex items-center gap-2 bg-[#00ff87] text-black font-bold px-6 py-2.5 rounded-xl hover:bg-[#00dd77] transition-colors disabled:opacity-60 text-sm"
                  >
                    {confirmed
                      ? <><Check size={15} /> Confirmado!</>
                      : <><ChevronRight size={15} /> Confirmar e Sortear Confrontos</>
                    }
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
