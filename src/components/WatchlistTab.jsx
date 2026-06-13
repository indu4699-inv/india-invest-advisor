import React, { useState, useEffect } from 'react'
import { callClaude, today, getRiskMeta } from '../utils'
import { Spinner, ErrorBox, EmptyState, Card, FinGrid, RiskBar, WarnBox, Badge, SectionLabel } from './UI'

const SYSTEM = `You are a senior Indian equity research analyst specialising in long-term fundamental investing across NSE and BSE. You never recommend stocks based on momentum, social media buzz, or influencer picks. Every pick must have a genuine multi-year business thesis backed by earnings quality, competitive moat, and sector tailwind. Respond ONLY with valid JSON.`

function getWeekRange() {
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const fmt = d => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  return `${fmt(monday)} – ${fmt(sunday)}`
}

function getWeekKey() {
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
  return monday.toISOString().split('T')[0]
}

export default function WatchlistTab() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [starred, setStarred] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('starred') || '[]')) } catch { return new Set() }
  })
  const [weekKey] = useState(getWeekKey())

  useEffect(() => {
    const cached = localStorage.getItem(`watchlist-${weekKey}`)
    if (cached) {
      try { setData(JSON.parse(cached)) } catch {}
    }
  }, [weekKey])

  useEffect(() => {
    try { localStorage.setItem('starred', JSON.stringify([...starred])) } catch {}
  }, [starred])

  function toggleStar(ticker) {
    setStarred(prev => {
      const next = new Set(prev)
      next.has(ticker) ? next.delete(ticker) : next.add(ticker)
      return next
    })
  }

  async function loadWatchlist(force = false) {
    const cached = localStorage.getItem(`watchlist-${weekKey}`)
    if (cached && !force) { try { setData(JSON.parse(cached)); return } catch {} }

    setLoading(true); setError(null)
    try {
      const result = await callClaude(
        `Today is ${today()}. Week of ${getWeekRange()}.

Curate a weekly watchlist of 10 high-conviction Indian stocks for long-term investors (3–10 year horizon).

Scan the ENTIRE market — all sectors, all market caps. Factor in:
- Domestic macro: RBI policy, government capex, PLI schemes, upcoming elections/budgets
- International: US Fed, FII inflows/outflows, global supply chains, commodity cycles, China+1 theme
- Sector rotation: where are institutions allocating capital this quarter?
- Earnings quality: companies with consistent ROE >15%, improving margins, low debt
- Emerging structural themes: green energy, defence indigenisation, EV ecosystem, data centres, specialty chemicals, contract manufacturing, rural consumption

Return ONLY valid JSON:
{
  "weekSummary": "2-3 sentences on the week's key market themes and what to watch",
  "globalMacro": "Key international factors influencing Indian markets this week",
  "picks": [
    {
      "name": "Full company name",
      "ticker": "NSE symbol",
      "sector": "sector",
      "marketCap": "Large Cap / Mid Cap / Small Cap",
      "theme": "The structural theme this represents (e.g. Defence indigenisation, EV supply chain)",
      "growthPotential": "High / Very High / Exceptional",
      "riskScore": 4,
      "pe": "28x",
      "epsGrowth": "35% YoY",
      "roe": "22%",
      "promoterHolding": "62%",
      "weekPerf": "+8% YTD",
      "thesis": "Core investment case in 2 sentences — fundamentals and moat",
      "fiveYearThesis": "Why this company wins over 5 years — specific business case",
      "tenYearThesis": "The 10-year structural opportunity this company is positioned for",
      "newsSentiment": "positive / neutral / negative",
      "newsSummary": "Relevant recent news or development in 1 sentence",
      "riskFlags": "Key risk in 1 sentence"
    }
  ]
}

Mix: 4 large-caps, 4 mid-caps, 2 small-caps. No overlap with obvious Nifty50 names unless truly compelling. Include at least 2 from emerging/non-obvious sectors. Picks must survive without any momentum — fundamentals only.`,
        SYSTEM
      )
      setData(result)
      try { localStorage.setItem(`watchlist-${weekKey}`, JSON.stringify(result)) } catch {}
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  const sentimentColor = s => s === 'positive' ? '#1D9E75' : s === 'negative' ? '#E24B4A' : '#EF9F27'

  return (
    <div>
      {/* Header */}
      <Card style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Week of {getWeekRange()}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Refreshes every Monday · starred picks carry forward
          </div>
        </div>
        <button onClick={() => loadWatchlist(true)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', fontSize: 13, fontWeight: 500,
          background: 'var(--green)', color: '#fff',
          border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer'
        }}>
          <i className="ti ti-refresh" style={{ fontSize: 14 }} />
          {data ? 'Refresh picks' : 'Load this week\'s picks'}
        </button>
      </Card>

      {error && <ErrorBox message={error} />}
      {loading && <Spinner text="Scanning full market for this week's high-conviction picks…" />}

      {!loading && data && (
        <div className="fade-in">
          {/* Week context */}
          <Card style={{ marginBottom: '1rem', borderLeft: '3px solid var(--green)', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-muted)' }}>{data.weekSummary}</div>
            {data.globalMacro && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-faint)', display: 'flex', gap: 6 }}>
                <i className="ti ti-world" style={{ fontSize: 12, marginTop: 1, flexShrink: 0 }} />
                {data.globalMacro}
              </div>
            )}
          </Card>

          {/* Starred first */}
          {starred.size > 0 && (
            <div style={{ marginBottom: 8, fontSize: 11, color: 'var(--amber)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
              <i className="ti ti-star-filled" style={{ fontSize: 12 }} /> Starred picks shown first
            </div>
          )}

          {[...data.picks].sort((a, b) => {
            if (starred.has(a.ticker) && !starred.has(b.ticker)) return -1
            if (!starred.has(a.ticker) && starred.has(b.ticker)) return 1
            return 0
          }).map(p => {
            const rm = getRiskMeta(p.riskScore)
            const isStarred = starred.has(p.ticker)
            return (
              <Card key={p.ticker} style={{ marginBottom: 12, border: isStarred ? '1.5px solid var(--amber)' : undefined }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {p.ticker} · {p.sector} · {p.marketCap}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Badge bg="var(--green-light)" color="var(--green-dark)">{p.growthPotential} potential</Badge>
                    <button onClick={() => toggleStar(p.ticker)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: isStarred ? '#EF9F27' : 'var(--text-muted)', fontSize: 18, padding: 2
                    }} aria-label={isStarred ? 'Unstar' : 'Star'}>
                      <i className={`ti ti-star${isStarred ? '-filled' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Theme badge */}
                {p.theme && (
                  <div style={{ marginBottom: 8 }}>
                    <Badge bg="rgba(83,74,183,0.1)" color="#534AB7">
                      <i className="ti ti-bulb" style={{ fontSize: 10 }} />{p.theme}
                    </Badge>
                  </div>
                )}

                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, borderLeft: '2px solid var(--green)', paddingLeft: 10, marginBottom: 10 }}>
                  {p.thesis}
                </div>

                <FinGrid items={[
                  { label: 'P/E', value: p.pe },
                  { label: 'EPS growth', value: p.epsGrowth },
                  { label: 'ROE', value: p.roe },
                  { label: 'Promoter %', value: p.promoterHolding },
                ]} />

                {/* 5Y / 10Y thesis */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
                  <div style={{ background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)', padding: '8px 10px' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>5-year thesis</div>
                    <div style={{ fontSize: 12, lineHeight: 1.5 }}>{p.fiveYearThesis}</div>
                  </div>
                  <div style={{ background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)', padding: '8px 10px' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>10-year thesis</div>
                    <div style={{ fontSize: 12, lineHeight: 1.5 }}>{p.tenYearThesis}</div>
                  </div>
                </div>

                {/* News sentiment */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: sentimentColor(p.newsSentiment), flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.newsSummary}</span>
                </div>

                <RiskBar score={p.riskScore} />
                {p.riskFlags && <WarnBox>{p.riskFlags}</WarnBox>}
              </Card>
            )
          })}
        </div>
      )}

      {!loading && !data && !error && (
        <EmptyState icon="eye" title="Weekly growth watchlist" desc={"AI curates 10 high-conviction picks each week\nbased on fundamentals, news, and sector trends."} />
      )}
    </div>
  )
}
