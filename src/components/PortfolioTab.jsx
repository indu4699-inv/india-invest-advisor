import React, { useState, useRef, useEffect } from 'react'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import { callClaude, today, formatINR, getRiskMeta, PALETTE } from '../utils'
import { Spinner, ErrorBox, EmptyState, Card, FinGrid, RiskBar, WarnBox, Badge, SectionLabel } from './UI'

Chart.register(ArcElement, Tooltip, Legend)

const SYSTEM = `You are an Indian equity analyst. Respond ONLY with valid JSON. Keep responses concise.`

export default function PortfolioTab() {
  const [amount, setAmount] = useState('')
  const [risk, setRisk] = useState('')
  const [horizon, setHorizon] = useState('5Y')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (data?.picks && chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy()
      chartInstance.current = new Chart(chartRef.current, {
        type: 'doughnut',
        data: {
          labels: data.picks.map(p => p.name),
          datasets: [{ data: data.picks.map(p => p.allocation), backgroundColor: PALETTE.slice(0, data.picks.length), borderWidth: 0 }]
        },
        options: { responsive: false, cutout: '70%', plugins: { legend: { display: false } } }
      })
    }
    return () => { if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null } }
  }, [data])

  async function analyze() {
    if (!risk) { setError('Please select a risk level.'); return }
    setLoading(true); setError(null); setData(null)
    try {
      const result = await callClaude(
        `${today()}, ${risk} risk, ${horizon}, ${amount ? '₹'+amount : 'no amount'}.
Give 5 Indian stocks. JSON:
{"summary":"one sentence","picks":[{"name":"X","ticker":"X","sector":"X","allocation":20,"expectedCAGR":"15%","riskScore":5,"pe":"20x","revenueGrowth":"20%","roe":"15%","debtEquity":"0.5x","thesis":"one sentence","watchOut":"one risk"}]}
Allocations must sum to 100.`,
        SYSTEM
      )
      setData(result)
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  const riskOptions = [
    { key: 'conservative', label: 'Conservative', icon: 'shield', desc: 'Large-caps, steady returns' },
    { key: 'moderate', label: 'Moderate', icon: 'shield-half', desc: 'Balanced growth & stability' },
    { key: 'aggressive', label: 'Aggressive', icon: 'flame', desc: 'High growth, higher volatility' },
  ]

  return (
    <div>
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <SectionLabel>Investment amount</SectionLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0 12px', height: 44 }}>
              <span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 500 }}>₹</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 500000" style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: 'var(--text)', flex: 1 }} />
            </div>
            {amount && <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 4 }}>{formatINR(amount)}</div>}
          </div>
          <div>
            <SectionLabel>Investment horizon</SectionLabel>
            <div style={{ display: 'flex', gap: 6 }}>
              {['1Y','3Y','5Y','10Y'].map(h => (
                <button key={h} onClick={() => setHorizon(h)} style={{ flex: 1, padding: '10px 0', fontSize: 13, fontWeight: 500, border: `1.5px solid ${horizon === h ? 'var(--blue)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', background: horizon === h ? 'var(--blue-light)' : 'transparent', color: horizon === h ? 'var(--blue)' : 'var(--text-muted)', transition: 'all .15s' }}>{h}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '1.25rem' }}>
          <SectionLabel>Risk level — select one</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {riskOptions.map(r => (
              <button key={r.key} onClick={() => setRisk(r.key)} style={{ padding: '12px 10px', textAlign: 'left', border: `1.5px solid ${risk === r.key ? 'var(--green)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', background: risk === r.key ? 'var(--green-light)' : 'var(--bg-muted)', transition: 'all .15s', cursor: 'pointer' }}>
                <i className={`ti ti-${r.icon}`} style={{ fontSize: 20, color: risk === r.key ? 'var(--green)' : 'var(--text-muted)', display: 'block', marginBottom: 6 }} />
                <div style={{ fontSize: 13, fontWeight: 500, color: risk === r.key ? 'var(--green)' : 'var(--text)' }}>{r.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{r.desc}</div>
              </button>
            ))}
          </div>
        </div>
        <button onClick={analyze} disabled={loading} style={{ marginTop: '1.25rem', width: '100%', padding: '12px', background: loading ? 'var(--bg-muted)' : 'var(--green)', color: loading ? 'var(--text-muted)' : '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: loading ? 'not-allowed' : 'pointer' }}>
          <i className="ti ti-sparkles" />
          {loading ? 'Analyzing market…' : 'Analyze & Build Portfolio'}
        </button>
      </Card>

      {error && <ErrorBox message={error} />}
      {loading && <Spinner text="Building your portfolio…" />}

      {!loading && data && (
        <div className="fade-in">
          {data.summary && (
            <Card style={{ marginBottom: '1rem', borderLeft: '3px solid var(--green)', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-muted)' }}>{data.summary}</div>
            </Card>
          )}
          {data.picks?.length > 0 && (
            <Card style={{ marginBottom: '1rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <canvas ref={chartRef} width={120} height={120} role="img" aria-label="Allocation chart" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                {data.picks.map((p, i) => (
                  <div key={p.ticker} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: PALETTE[i % PALETTE.length], flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 12, color: 'var(--text-muted)' }}>{p.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{p.allocation}%</span>
                    {amount && <span style={{ fontSize: 11, color: 'var(--green)' }}>{formatINR(Math.round(p.allocation / 100 * Number(amount)))}</span>}
                  </div>
                ))}
              </div>
            </Card>
          )}
          {data.picks?.map((p, i) => {
            const rm = getRiskMeta(p.riskScore)
            return (
              <Card key={p.ticker || i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{p.ticker} · {p.sector}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {amount && <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--green)' }}>{formatINR(Math.round(p.allocation / 100 * Number(amount)))}</div>}
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.allocation}%</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  <Badge bg={rm.bg} color={rm.text}>{rm.label}</Badge>
                  <Badge bg="var(--green-light)" color="var(--green-dark)"><i className="ti ti-trending-up" style={{ fontSize: 10 }} /> {p.expectedCAGR} CAGR</Badge>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, borderLeft: '2px solid var(--green)', paddingLeft: 10, marginBottom: 10 }}>{p.thesis}</div>
                <FinGrid items={[{ label: 'P/E', value: p.pe }, { label: 'Rev growth', value: p.revenueGrowth }, { label: 'ROE', value: p.roe }, { label: 'Debt/Eq', value: p.debtEquity }]} />
                <RiskBar score={p.riskScore} />
                {p.watchOut && <WarnBox>{p.watchOut}</WarnBox>}
              </Card>
            )
          })}
        </div>
      )}
      {!loading && !data && !error && <EmptyState icon="chart-pie" title="Ready to build your portfolio" desc={"Enter amount, pick risk level and horizon,\nthen click Analyze & Build Portfolio."} />}
    </div>
  )
}
