'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './home.module.css'
import Navbar from './Navbar'
import {
  useHeroTyping,
  PARTICLES,
  TYPING_PHRASES,
  SERVER_START_DATE,
  ServerStatus,
  SkinPeekGroup,
  HardwareSection,
  WhyEunSection,
  GallerySection,
  CtaSection,
  AnimatedNumber,
  SignalBars,
} from './home'

export default function MCHomePage() {
  const [survival, setSurvival] = useState<ServerStatus>({ online: false, players: 0, maxPlayers: 0 })
  const [creative, setCreative] = useState<ServerStatus>({ online: false, players: 0, maxPlayers: 0 })
  const [loaded, setLoaded] = useState(false)
  const { displayed, phase } = useHeroTyping(TYPING_PHRASES)

  const anyOnline = survival.online || creative.online
  const avgPing = Math.round(((survival.pingMs ?? 0) + (creative.pingMs ?? 0)) / (survival.online && creative.online ? 2 : 1))
  
  const today = new Date()
  const daysRunning = Math.floor((today.getTime() - SERVER_START_DATE.getTime()) / (1000 * 60 * 60 * 24))

  useEffect(() => {
    fetch('/api/eun/status')
      .then((r) => r.json())
      .then((d) => {
        setSurvival(d.survival ?? { online: false, players: 0, maxPlayers: 0 })
        setCreative(d.creative ?? { online: false, players: 0, maxPlayers: 0 })
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  return (
    <div className={styles.container}>
      <SkinPeekGroup />
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.particles} aria-hidden="true">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className={styles.particle}
              style={{
                left: p.left,
                bottom: '-10px',
                width: p.size,
                height: p.size,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>

        <div className={styles.systemStatus}>
          <span className={styles.statusDot} style={{ background: anyOnline ? undefined : '#e05555' }} />
          {anyOnline ? 'SERVER ONLINE' : 'SERVER OFFLINE'}
          {loaded && anyOnline && avgPing > 0 && (
            <span className={styles.pingBadge}>{avgPing}ms</span>
          )}
        </div>
        <p className={styles.serverTag}>EUN SERVER</p>
        <h1 className={styles.heroTitle}>EUN</h1>
        <div className={styles.heroTyping} aria-live="polite">
          <span className={styles.heroTypingText}>{displayed}</span>
          <span className={`${styles.heroTypingCursor} ${phase === 'pause' ? styles.heroTypingCursorBlink : ''}`} aria-hidden="true" />
        </div>
        <p className={styles.heroSubtitle}>给热爱方块的人，一个落脚的地方</p>
        <p className={styles.heroDesc}>每段冒险都值得被认真对待，而你的篇章从这里翻开</p>

        <div className={styles.heroBtnGroup}>
          <Link href="/getting-started" className={styles.btnPrimary}>开始你的冒险</Link>
          <Link href="/docs" className={styles.btnSecondary}>了解更多</Link>
        </div>

        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            {loaded && survival.online && <SignalBars ping={survival.pingMs} />}
            <span className={styles.statValue}>
              {loaded ? <AnimatedNumber value={survival.players} /> : '--'}
            </span>
            <span className={styles.statLabel}>Survival</span>
            <span className={styles.statLabelSub}>生存服</span>
          </div>
          <div className={styles.statItem}>
            {loaded && creative.online && <SignalBars ping={creative.pingMs} />}
            <span className={styles.statValue}>
              {loaded ? <AnimatedNumber value={creative.players} /> : '--'}
            </span>
            <span className={styles.statLabel}>Creative</span>
            <span className={styles.statLabelSub}>创造服</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              <AnimatedNumber value={daysRunning} />
            </span>
            <span className={styles.statLabel}>Days Running</span>
            <span className={styles.statLabelSub}>运行天数</span>
          </div>
        </div>

        <div className={styles.scrollHint} aria-hidden="true">
          <span>SCROLL</span>
          <span className={styles.scrollArrow} />
        </div>
      </section>

      <div className={styles.grassDivider} aria-hidden="true" />
      <div className={styles.dirtDivider} aria-hidden="true" />

      <WhyEunSection />

      <div className={styles.dirtDivider} aria-hidden="true" />
      <div className={styles.grassDivider} aria-hidden="true" />

      <HardwareSection />

      <div className={styles.grassDivider} aria-hidden="true" />
      <div className={styles.dirtDivider} aria-hidden="true" />

      <GallerySection />

      <div className={styles.grassDivider} aria-hidden="true" />
      <div className={styles.dirtDivider} aria-hidden="true" />

      <CtaSection />

      <footer className={styles.footer}>
        <span className={styles.footerLogo}>EUN</span>
        <p className={styles.footerText}>© 2026 EUN Server · All rights reserved</p>
      </footer>
    </div>
  )
}
