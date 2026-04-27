// Command constants
export const Commands = {
  PREFIX: '.',
  ADMIN: ['menu', 'status', 'bc', 'ban', 'kick', 'promote', 'demote'],
  ECONOMY: ['balance', 'daily', 'transfer', 'slot', 'casino', 'bet'],
  GROUP: ['welcome', 'antilink', 'tagall', 'setdesc', 'setname'],
  UTIL: ['ping', 'help', 'rules', 'play', 'song', 'video'],
  GAMES: ['ship', 'truth', 'dare', 'quiz', 'riddle'],
} as const;