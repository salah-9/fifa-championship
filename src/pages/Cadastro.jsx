import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Check, X, Users } from 'lucide-react'
import { useChampionship } from '../context/ChampionshipContext'

const EMOJIS = ['⚽', '🏆', '🦁', '🐯', '🦊', '🐺', '🦅', '🔥', '⚡', '🌪️', '💎', '👑', '🛡️', '⚔️', '🎯', '🚀']
const COLORS = ['#00ff87', '#f5c518', '#ff4444', '#4488ff', '#ff44ff', '#ff8800', '#00ffff', '#ff0088']

function TeamForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [emoji, setEmoji] = useState(initial?.emoji || '⚽')
  const [color, setColor] = useState(initial?.color || '#00ff87')
  const [players, setPlayers] = useState(initial?.players || ['', ''])
  const [error, setError] = useState('')

  const { teams } = useChampionship()

  function submit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return setError('Nome do time é obrigatório')
    const duplicate = teams.some((t) => t.name.toLowerCase() === trimmed.toLowerCase() && t.id !== initial?.id)
    if (duplicate) return setError('Já existe um time com esse nome')
    const filteredPlayers = players.map((p) => p.trim()).filter(Boolean)
    onSave({ name: trimmed, emoji, color, players: filteredPlayers })
  }

  return (
    <form onSubmit={submit} className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-5 space-y-4">
      <div>
        <label className="text-xs text-[#8888aa] uppercase tracking-wider mb-1 block">Nome do Time</label>
        <input
          value={name}
          onChange={(e) => { setName(e.target.value); setError('') }}
          placeholder="Ex: Real Madrid"
          className="w-full bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00ff87] transition-colors"
        />
        {error && <p className="text-[#ff4444] text-xs mt-1">{error}</p>}
      </div>

      <div>
        <label className="text-xs text-[#8888aa] uppercase tracking-wider mb-2 block">Escudo (Emoji)</label>
        <div className="flex flex-wrap gap-2">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`w-9 h-9 rounded-lg text-xl transition-all ${emoji === e ? 'bg-[#00ff87]/20 border-2 border-[#00ff87] scale-110' : 'bg-[#0a0a0f] border border-[#2a2a3a] hover:border-[#00ff87]/50'}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-[#8888aa] uppercase tracking-wider mb-2 block">Cor do Time</label>
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              className={`w-7 h-7 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#12121a]' : 'hover:scale-110'}`}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-[#8888aa] uppercase tracking-wider mb-2 block">Jogadores (opcional)</label>
        {players.map((p, i) => (
          <input
            key={i}
            value={p}
            onChange={(e) => {
              const next = [...players]
              next[i] = e.target.value
              setPlayers(next)
            }}
            placeholder={`Jogador ${i + 1}`}
            className="w-full bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00ff87] transition-colors mb-2"
          />
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="flex items-center gap-2 bg-[#00ff87] text-black font-semibold px-4 py-2 rounded-lg hover:bg-[#00dd77] transition-colors"
        >
          <Check size={16} /> Salvar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 border border-[#2a2a3a] text-[#8888aa] px-4 py-2 rounded-lg hover:text-white hover:border-[#8888aa] transition-colors"
        >
          <X size={16} /> Cancelar
        </button>
      </div>
    </form>
  )
}

function TeamCard({ team, onEdit, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4 flex items-center gap-4 group hover:border-[#3a3a4a] transition-colors"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
        style={{ backgroundColor: `${team.color}22`, border: `2px solid ${team.color}44` }}
      >
        {team.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display text-xl tracking-wide" style={{ color: team.color }}>
          {team.name}
        </p>
        {team.players?.filter(Boolean).length > 0 && (
          <p className="text-[#8888aa] text-xs flex items-center gap-1 mt-0.5">
            <Users size={11} />
            {team.players.filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(team)}
          className="p-2 rounded-lg border border-[#2a2a3a] text-[#8888aa] hover:text-[#f5c518] hover:border-[#f5c518]/50 transition-colors"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => onDelete(team.id)}
          className="p-2 rounded-lg border border-[#2a2a3a] text-[#8888aa] hover:text-[#ff4444] hover:border-[#ff4444]/50 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </motion.div>
  )
}

export default function Cadastro() {
  const { teams, addTeam, updateTeam, deleteTeam } = useChampionship()
  const [showForm, setShowForm] = useState(false)
  const [editingTeam, setEditingTeam] = useState(null)

  function handleSave(data) {
    if (editingTeam) {
      updateTeam(editingTeam.id, data)
      setEditingTeam(null)
    } else {
      addTeam(data)
      setShowForm(false)
    }
  }

  function handleEdit(team) {
    setEditingTeam(team)
    setShowForm(false)
  }

  function handleDelete(id) {
    if (confirm('Remover este time?')) deleteTeam(id)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl text-white tracking-wide">TIMES</h1>
          <p className="text-[#8888aa] text-sm">{teams.length} time{teams.length !== 1 ? 's' : ''} cadastrado{teams.length !== 1 ? 's' : ''}</p>
        </div>
        {!showForm && !editingTeam && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#00ff87] text-black font-semibold px-4 py-2.5 rounded-xl hover:bg-[#00dd77] transition-colors"
          >
            <Plus size={18} /> Novo Time
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {(showForm || editingTeam) && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4"
          >
            <TeamForm
              initial={editingTeam}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditingTeam(null) }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {teams.map((team) =>
            editingTeam?.id === team.id ? (
              <motion.div key={`edit-${team.id}`} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TeamForm
                  initial={team}
                  onSave={handleSave}
                  onCancel={() => setEditingTeam(null)}
                />
              </motion.div>
            ) : (
              <TeamCard key={team.id} team={team} onEdit={handleEdit} onDelete={handleDelete} />
            )
          )}
        </AnimatePresence>

        {teams.length === 0 && !showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-[#8888aa]"
          >
            <div className="text-5xl mb-4">⚽</div>
            <p className="text-lg font-medium">Nenhum time cadastrado</p>
            <p className="text-sm mt-1">Clique em "Novo Time" para começar</p>
          </motion.div>
        )}
      </div>

      {teams.length > 0 && (
        <p className="text-center text-xs text-[#8888aa] mt-8">
          Você precisa de exatamente 8 times para iniciar um campeonato
        </p>
      )}
    </div>
  )
}
