'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import styles from './leaderboard.module.css'
import Navbar from './Navbar'
import PlayerAvatar from './PlayerAvatar'
import { PLAYERS, LEADERBOARDS, LeaderboardType, PlayerStats } from '../data/leaderboard'

const PARTICLES = [
  { left: '8%',  delay: '0s',   duration: '12s', size: 3 },
  { left: '20%', delay: '2.4s', duration: '9s',  size: 2 },
  { left: '35%', delay: '5s',   duration: '14s', size: 4 },
  { left: '50%', delay: '1.2s', duration: '11s', size: 2 },
  { left: '63%', delay: '7s',   duration: '10s', size: 3 },
  { left: '78%', delay: '3.6s', duration: '13s', size: 2 },
  { left: '90%', delay: '0.8s', duration: '15s', size: 3 },
]

function formatPlaytime(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

function SkinModel({ username, size = 150 }: { username: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const viewerRef = useRef<any>(null)

  useEffect(() => {
    let mounted = true
    
    async function initViewer() {
      if (!canvasRef.current || viewerRef.current) return
      
      const skinview3d = await import('skinview3d')
      if (!mounted || !canvasRef.current) return
      
      const viewer = new skinview3d.SkinViewer({
        canvas: canvasRef.current,
        width: size,
        height: size * 1.5,
        skin: `https://mc-heads.net/skin/${username}`,
      })
      
      viewer.autoRotate = false
      viewer.zoom = 0.9
      viewer.camera.position.set(0, 5, 40)
      viewer.renderer.setClearColor(0x000000, 0)
      
      viewer.animation = new skinview3d.IdleAnimation()
      
      viewerRef.current = viewer
    }
    
    initViewer()
    
    return () => {
      mounted = false
      if (viewerRef.current) {
        viewerRef.current.dispose()
        viewerRef.current = null
      }
    }
  }, [username, size])

  return (
    <canvas 
      ref={canvasRef} 
      className={styles.skinCanvas}
      style={{ width: size, height: size * 1.5 }}
    />
  )
}

function TopPodium({ players }: { players: PlayerStats[] }) {
  const top3 = useMemo(() => 
    [...players].sort((a, b) => b.playtime - a.playtime).slice(0, 3),
    [players]
  )

  const podiumOrder = [top3[1], top3[0], top3[2]]

  return (
    <div className={styles.heroPodium}>
      <div className={styles.podiumTitle}>
        <span className={styles.podiumIcon}>⏱️</span>
        <h2>在线时长排行榜</h2>
      </div>
      <div className={styles.podiumStage}>
        {podiumOrder.map((p, i) => {
          if (!p) return null
          const actualRank = i === 1 ? 0 : i === 0 ? 1 : 2
          const heights = [140, 180, 100]
          const medals = ['🥈', '🥇', '🥉']
          
          return (
            <div key={p.name} className={`${styles.podiumPlayer} ${styles[`podiumRank${actualRank + 1}`]}`}>
              <div className={styles.podiumMedalLarge}>{medals[i]}</div>
              <div className={styles.podiumInfo}>
                <span className={styles.podiumPlayerName}>{p.name}</span>
                <span className={styles.podiumPlayerTime}>{formatPlaytime(p.playtime)}</span>
              </div>
              <div className={styles.skinWrapper}>
                <SkinModel username={p.name} size={120} />
              </div>
              <div 
                className={styles.podiumBase} 
                style={{ height: heights[i] }}
              >
                <span className={styles.podiumRankNum}>{actualRank + 1}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function LeaderboardCard({ 
  board, 
  players,
  isActive,
  onClick 
}: { 
  board: LeaderboardType
  players: PlayerStats[]
  isActive: boolean
  onClick: () => void
}) {
  const sorted = useMemo(() => 
    [...players].sort((a, b) => (b[board.field] as number) - (a[board.field] as number)).slice(0, 3),
    [players, board.field]
  )

  return (
    <div 
      className={`${styles.boardCard} ${isActive ? styles.boardCardActive : ''}`}
      onClick={onClick}
    >
      <div className={styles.boardHeader}>
        <span className={styles.boardIcon}>{board.icon}</span>
        <h3 className={styles.boardTitle}>{board.title}</h3>
      </div>
      <div className={styles.boardPreview}>
        {sorted.map((p, i) => (
          <div key={p.name} className={styles.previewItem}>
            <span className={styles.previewRank}>{i + 1}</span>
            <PlayerAvatar
              username={p.name}
              size={24}
              className={styles.previewAvatar}
            />
            <span className={styles.previewName}>{p.name}</span>
            <span className={styles.previewValue}>{board.format(p[board.field] as number)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FullLeaderboard({ board, players }: { board: LeaderboardType; players: PlayerStats[] }) {
  const sorted = useMemo(() => 
    [...players].sort((a, b) => (b[board.field] as number) - (a[board.field] as number)),
    [players, board.field]
  )

  return (
    <div className={styles.fullBoard}>
      <div className={styles.fullHeader}>
        <span className={styles.fullIcon}>{board.icon}</span>
        <div>
          <h2 className={styles.fullTitle}>{board.title}</h2>
          <p className={styles.fullDesc}>{board.desc}</p>
        </div>
      </div>
      
      <div className={styles.restList}>
        {sorted.map((p, i) => (
          <div key={p.name} className={`${styles.restItem} ${i < 3 ? styles[`topItem${i + 1}`] : ''}`}>
            <span className={styles.restRank}>
              {i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}
            </span>
            <PlayerAvatar
              username={p.name}
              size={40}
              className={styles.restAvatar}
            />
            <span className={styles.restName}>{p.name}</span>
            <span className={styles.restValue}>{board.format(p[board.field] as number)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LeaderboardPage() {
  const [activeBoard, setActiveBoard] = useState<string>(LEADERBOARDS[0].id)
  // 榜单按 order 分别缓存到客户端；playtime 用于首页 podium
  const [byOrder, setByOrder] = useState<Record<string, PlayerStats[]>>({})
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState<'api' | 'loading' | 'fallback'>('loading')

  const currentBoard = LEADERBOARDS.find(b => b.id === activeBoard) || LEADERBOARDS[0]

  // 首次挂载：并发拉 playtime（podium 用）+ 当前 tab 对应 order
  useEffect(() => {
    let cancelled = false
    setLoading(true)

    async function fetchOrder(order: string): Promise<PlayerStats[] | null> {
      try {
        const r = await fetch(`/api/eun/leaderboard?limit=50&order=${order}`)
        const d = await r.json()
        if (d?.ok && Array.isArray(d.players) && d.players.length > 0) {
          return d.players as PlayerStats[]
        }
      } catch {
        /* ignore */
      }
      return null
    }

    const initialOrders = new Set(['playtime', currentBoard.field])
    Promise.all(
      Array.from(initialOrders).map(async (o) => [o, await fetchOrder(o)] as const),
    ).then((entries) => {
      if (cancelled) return
      const next: Record<string, PlayerStats[]> = {}
      let anySuccess = false
      for (const [o, list] of entries) {
        if (list) {
          next[o] = list
          anySuccess = true
        }
      }
      setByOrder(next)
      setLoading(false)
      setSource(anySuccess ? 'api' : 'fallback')
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 切 tab 时若该 order 未缓存则按需拉
  useEffect(() => {
    const order = currentBoard.field
    if (byOrder[order]) return
    let cancelled = false
    fetch(`/api/eun/leaderboard?limit=50&order=${order}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return
        if (d?.ok && Array.isArray(d.players) && d.players.length > 0) {
          setByOrder((prev) => ({ ...prev, [order]: d.players as PlayerStats[] }))
        }
      })
      .catch(() => {
        /* ignore */
      })
    return () => {
      cancelled = true
    }
  }, [currentBoard.field, byOrder])

  const podiumPlayers = byOrder['playtime'] ?? (source === 'fallback' ? PLAYERS : [])
  const activePlayers = byOrder[currentBoard.field] ?? (source === 'fallback' ? PLAYERS : [])

  return (
    <div className={styles.container}>
      <div className={styles.particles} aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className={styles.particle}
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              width: p.size,
              height: p.size,
            }}
          />
        ))}
      </div>

      <Navbar />

      <main className={styles.page}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>LEADERBOARD</span>
          <h1 className={styles.title}>玩家排行榜</h1>
          <p className={styles.subtitle}>
            数据由 Plan 统计，展示服务器内各项数据排名
          </p>
        </header>

        {/* Hero Podium - Playtime */}
        <section className={styles.heroSection}>
          <TopPodium players={podiumPlayers} />
        </section>

        {/* Board Selector */}
        <section className={styles.boardGrid}>
          {LEADERBOARDS.map(board => (
            <LeaderboardCard
              key={board.id}
              board={board}
              players={byOrder[board.field] ?? podiumPlayers}
              isActive={activeBoard === board.id}
              onClick={() => setActiveBoard(board.id)}
            />
          ))}
        </section>

        {/* Full Leaderboard */}
        <section className={styles.section}>
          <FullLeaderboard board={currentBoard} players={activePlayers} />
        </section>

        {/* Data Notice */}
        <section className={styles.noticeSection}>
          <p className={styles.noticeText}>
            {loading
              ? '数据加载中…'
              : source === 'api'
                ? '数据实时来自 EUN Bot API · 仅供娱乐参考'
                : '当前展示为示例占位数据 · 仅供娱乐参考'}
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <span className={styles.footerLogo}>EUN</span>
        <p className={styles.footerText}>© 2026 EUN Server · All rights reserved</p>
      </footer>
    </div>
  )
}
