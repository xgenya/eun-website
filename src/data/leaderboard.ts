// 排行榜数据类型与静态兜底数据
// 生产数据来自 EUN Bot API：/api/eun/leaderboard （见 src/app/api/eun/leaderboard/route.ts）
// 当接口不可用或名单为空时，前端会降级使用本文件中的 PLAYERS 作为占位

export type PlayerStats = {
  name: string
  playtime: number // 分钟（服务端已从 tick 折算）
  mined: number // 破坏方块数
  elytra: number // 鞘翅飞行距离（米，服务端已从 cm 折算）
  deaths: number // 死亡次数
  kills: number // 击杀数
}

// 静态兜底数据（数值仅为占位；生产由 API 覆盖）
export const PLAYERS: PlayerStats[] = [
  { name: 'Rem_0000',      playtime: 12540, mined: 38901, elytra: 245000, deaths: 42,  kills: 1523 },
  { name: 'zhang1322',     playtime: 8760,  mined: 28765, elytra: 180000, deaths: 67,  kills: 892 },
  { name: 'CreeperHunter', playtime: 6420,  mined: 21456, elytra: 132000, deaths: 23,  kills: 2341 },
  { name: 'DiamondMiner',  playtime: 5890,  mined: 89012, elytra: 90000,  deaths: 89,  kills: 456 },
  { name: 'BuilderPro',    playtime: 4560,  mined: 12345, elytra: 55000,  deaths: 15,  kills: 234 },
  { name: 'RedstoneKing',  playtime: 3980,  mined: 23456, elytra: 78000,  deaths: 34,  kills: 567 },
  { name: 'ExplorerX',     playtime: 3450,  mined: 15678, elytra: 210000, deaths: 156, kills: 1234 },
  { name: 'FarmMaster',    playtime: 2890,  mined: 34567, elytra: 20000,  deaths: 12,  kills: 89 },
  { name: 'NetherWalker',  playtime: 2340,  mined: 7890,  elytra: 45000,  deaths: 234, kills: 3456 },
  { name: 'SkyBuilder',    playtime: 1890,  mined: 4567,  elytra: 68000,  deaths: 8,   kills: 123 },
]

export type LeaderboardType = {
  id: string
  title: string
  icon: string
  field: keyof Omit<PlayerStats, 'name'>
  format: (value: number) => string
  desc: string
}

const fmtNum = (v: number) => v.toLocaleString('zh-CN')

export const LEADERBOARDS: LeaderboardType[] = [
  {
    id: 'playtime',
    title: '在线时长',
    icon: '⏱️',
    field: 'playtime',
    format: (v) => {
      const hours = Math.floor(v / 60)
      const mins = v % 60
      return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
    },
    desc: '累计在线游戏时间',
  },
  {
    id: 'mined',
    title: '破坏方块',
    icon: '⛏️',
    field: 'mined',
    format: fmtNum,
    desc: '挖掘方块的总数量',
  },
  {
    id: 'kills',
    title: '击杀数',
    icon: '⚔️',
    field: 'kills',
    format: (v) => `${fmtNum(v)} 只`,
    desc: '累计击杀数',
  },
  {
    id: 'elytra',
    title: '鞘翅飞行',
    icon: '🪶',
    field: 'elytra',
    format: (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)} km` : `${v} m`),
    desc: '鞘翅飞行累计距离',
  },
  {
    id: 'deaths',
    title: '死亡次数',
    icon: '💀',
    field: 'deaths',
    format: (v) => `${v} 次`,
    desc: '累计死亡次数',
  },
]
