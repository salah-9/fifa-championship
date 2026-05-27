import { NavLink } from 'react-router-dom'
import { Users, Shuffle, Trophy } from 'lucide-react'

const links = [
  { to: '/cadastro', label: 'Times', icon: Users },
  { to: '/sorteio', label: 'Sorteio', icon: Shuffle },
  { to: '/chaveamento', label: 'Bracket', icon: Trophy },
]

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur border-b border-[#2a2a3a]">
      <div className="max-w-screen-2xl mx-auto px-4 flex items-center justify-between h-14 sm:h-16">
        <span className="font-display text-[#00ff87] tracking-wider shrink-0 text-lg sm:text-2xl">
          <span className="hidden sm:inline">FIFA ⚡ CHAMPIONSHIP</span>
          <span className="sm:hidden">⚡ FIFA</span>
        </span>
        <div className="flex gap-0.5 sm:gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 sm:px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#00ff87]/10 text-[#00ff87]'
                    : 'text-[#8888aa] hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
