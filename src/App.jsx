import React, { useState } from 'react'
import PortfolioTab from './components/PortfolioTab'
import WatchlistTab from './components/WatchlistTab'
import AltTab from './components/AltTab'

const TABS = [
  { key: 'portfolio', label: 'Portfolio Allocator', icon: 'briefcase' },
  { key: 'watchlist', label: 'Weekly Watchlist', icon: 'eye' },
  { key: 'alternatives', label: 'Alt Investments', icon: 'building-bank' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('portfolio')

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Top nav */}
      <header style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: '0 1.5rem',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, background: '#1D9E75',
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <i className="ti ti-chart-line" style={{ fontSize: 20, color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>India Investment Advisor</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>AI-powered · NSE/BSE · Fundamentals-first</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
            <div style={{ fontWeight: 500 }}>{dateStr}</div>
            <div>{timeStr} IST</div>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '0 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', gap: 0 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              padding: '14px 20px',
              fontSize: 13, fontWeight: activeTab === t.key ? 600 : 400,
              color: activeTab === t.key ? '#1D9E75' : 'var(--text-muted)',
              background: 'none', border: 'none',
              borderBottom: `2px solid ${activeTab === t.key ? '#1D9E75' : 'transparent'}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
              transition: 'all .15s', whiteSpace: 'nowrap'
            }}>
              <i className={`ti ti-${t.icon}`} style={{ fontSize: 15 }} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '1.5rem' }}>
        {activeTab === 'portfolio' && <PortfolioTab />}
        {activeTab === 'watchlist' && <WatchlistTab />}
        {activeTab === 'alternatives' && <AltTab />}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '1rem 1.5rem',
        marginTop: '2rem',
        textAlign: 'center',
        fontSize: 11,
        color: 'var(--text-faint)',
        lineHeight: 1.7
      }}>
        <i className="ti ti-alert-circle" style={{ fontSize: 11, marginRight: 4 }} />
        This tool is for research and educational purposes only. It is not SEBI-registered investment advice.
        Always consult a qualified financial advisor before investing. Past performance does not guarantee future results.
      </footer>
    </div>
  )
}
