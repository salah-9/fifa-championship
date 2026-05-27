const TEAMS_KEY = 'fifa_teams'
const CHAMPIONSHIP_KEY = 'fifa_championship'

export const storage = {
  getTeams: () => {
    try {
      const data = localStorage.getItem(TEAMS_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  saveTeams: (teams) => {
    localStorage.setItem(TEAMS_KEY, JSON.stringify(teams))
  },

  getChampionship: () => {
    try {
      const data = localStorage.getItem(CHAMPIONSHIP_KEY)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },

  saveChampionship: (championship) => {
    localStorage.setItem(CHAMPIONSHIP_KEY, JSON.stringify(championship))
  },

  resetChampionship: () => {
    localStorage.removeItem(CHAMPIONSHIP_KEY)
  },
}
