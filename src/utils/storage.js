const TEAMS_KEY = 'fifa_teams'
const CHAMPIONSHIP_KEY = 'fifa_championship'
const PLAYERS_KEY = 'fifa_players'

export const storage = {
  getTeams: () => {
    try { return JSON.parse(localStorage.getItem(TEAMS_KEY)) || [] } catch { return [] }
  },
  saveTeams: (teams) => localStorage.setItem(TEAMS_KEY, JSON.stringify(teams)),

  getChampionship: () => {
    try { return JSON.parse(localStorage.getItem(CHAMPIONSHIP_KEY)) || null } catch { return null }
  },
  saveChampionship: (c) => localStorage.setItem(CHAMPIONSHIP_KEY, JSON.stringify(c)),
  resetChampionship: () => localStorage.removeItem(CHAMPIONSHIP_KEY),

  getPlayers: () => {
    try { return JSON.parse(localStorage.getItem(PLAYERS_KEY)) || [] } catch { return [] }
  },
  savePlayers: (players) => localStorage.setItem(PLAYERS_KEY, JSON.stringify(players)),
}
