import React, { useState } from 'react'
import { callClaude, today } from '../utils'
import { Spinner, ErrorBox, EmptyState, Card, Badge, SectionLabel } from './UI'

const SYSTEM = `You are a senior Indian investment advisor covering all asset classes — equities, debt, real estate, gold, and alternative instruments. You provide realistic, grounded data and analysis for the Indian market. Respond ONLY with valid JSON.`

function AltCard({ icon, iconColor, title, children }) {
  return (
    <Card style={{ height: '100%' }}>
      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 7 }}>
        <i className={`ti ti-${icon}`} style={{ fontSize: 16, color: iconColor }} />
        {title}
      </div>
      {children}
    </Card>
  )
}

function AltItem({ name, value, sub, positive }) {
  return (
    <div style={{
      padding: '8px 0', borderBottom: '1px solid var(--border)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
    }}>
      <div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{name}</div>
        {sub && <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 1 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: positive === false ? '#E24B4A' : '#1D9E75', textAlign: 'right' }}>
        {value}
      </div>
    </div>
  )
}

export default function AltTab() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  async function load() {
    setLoading(true); setError(null)
    try {
      const result = await callClaude(
        `Today is ${today()}. Provide a comprehensive, realistic overview of the Indian alternative investment landscape.

Return ONLY valid JSON:
{
  "marketPulse": "2-3 sentences: what's happening in the broader investment landscape today — rates, liquidity, risk appetite",
  "mutualFunds": [
    { "category": "Category name", "exampleFund": "Best fund in this category", "returns1Y": "28%", "returns3Y": "18%", "risk": "Moderate", "who": "Ideal for investors who…" }
  ],
  "reits": [
    { "name": "REIT/InvIT name", "ticker": "NSE symbol", "yield": "6.2%", "navChange": "+4% YTD", "type": "REIT or InvIT", "note": "1-line context" }
  ],
  "etfs": [
    { "name": "ETF name", "ticker": "NSE symbol", "returns1Y": "18%", "aum": "₹12,000 Cr", "type": "Index / Sector / Thematic / Gold" }
  ],
  "fixedIncome": [
    { "name": "Option name", "rate": "7.1% p.a.", "tenure": "5 years", "tax": "Tax-free / Taxable", "note": "Key feature" }
  ],
  "ipos": [
    {
      "name": "Company name",
      "sector": "sector",
      "priceBand": "450-480",
      "status": "Open / Upcoming / Recently Listed",
      "openClose": "dates or expected",
      "issueSize": "₹2,400 Cr",
      "gmp": "+₹45",
      "riskRating": "Low / Moderate / High",
      "businessSummary": "What the company does and why it's noteworthy in 1-2 sentences",
      "verdict": "Subscribe / Avoid / Neutral with 1-line reason"
    }
  ],
  "nps": [
    { "scheme": "NPS Tier 1 Equity - HDFC Pension", "returns3Y": "14%", "returns5Y": "12%", "note": "Best for long-term retirement" }
  ],
  "sgb": {
    "currentSpotGold": "₹X per gram",
    "status": "Open tranche / No active tranche",
    "nextTranche": "Expected dates if known",
    "interestRate": "2.5% p.a.",
    "taxBenefit": "Capital gains tax-free on maturity",
    "verdict": "1-sentence view on gold allocation in current environment"
  },
  "nfo": [
    { "name": "Fund name", "amc": "AMC name", "type": "Fund type", "closingDate": "date", "theme": "Why this NFO and is it worth considering" }
  ]
}

Use realistic current estimates for Indian market as of ${today()}. Include 4-5 MF categories, 3-4 REITs/InvITs, 4-5 ETFs, 4-5 fixed income options, 3-5 IPOs (mix of open and recent), 3 NPS options, and 2-3 NFOs.`,
        SYSTEM
      )
      setData(result)
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  const verdictColor = v => {
    if (!v) return 'var(--text-muted)'
    const l = v.toLowerCase()
    if (l.startsWith('subscribe')) return '#1D9E75'
    if (l.startsWith('avoid')) return '#E24B4A'
    return '#EF9F27'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <SectionLabel>Full investment landscape — updated daily</SectionLabel>
        <button onClick={load} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', fontSize: 13, fontWeight: 500,
          background: 'var(--green)', color: '#fff',
          border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer'
        }}>
          <i className="ti ti-refresh" style={{ fontSize: 14 }} />
          {data ? 'Refresh' : 'Load investment options'}
        </button>
      </div>

      {error && <ErrorBox message={error} />}
      {loading && <Spinner text="Gathering full Indian investment landscape…" />}

      {!loading && data && (
        <div className="fade-in">
          {/* Market pulse */}
          {data.marketPulse && (
            <Card style={{ marginBottom: '1rem', borderLeft: '3px solid var(--blue)', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-muted)' }}>{data.marketPulse}</div>
            </Card>
          )}

          {/* 2-col grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            {/* Mutual Funds */}
            {data.mutualFunds?.length > 0 && (
              <AltCard icon="chart-area" iconColor="#185FA5" title="Mutual fund categories">
                {data.mutualFunds.map(f => (
                  <div key={f.category} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{f.category}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1D9E75' }}>{f.returns1Y} 1Y</div>
                    </div>
                    {f.exampleFund && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>eg. {f.exampleFund}</div>}
                    {f.who && <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 1 }}>{f.who}</div>}
                  </div>
                ))}
              </AltCard>
            )}

            {/* REITs */}
            {data.reits?.length > 0 && (
              <AltCard icon="building" iconColor="#534AB7" title="REITs & InvITs">
                {data.reits.map(r => (
                  <div key={r.name} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 500 }}>{r.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{r.ticker} · {r.type}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#1D9E75' }}>{r.yield}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{r.navChange}</div>
                      </div>
                    </div>
                    {r.note && <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 2 }}>{r.note}</div>}
                  </div>
                ))}
              </AltCard>
            )}

            {/* ETFs */}
            {data.etfs?.length > 0 && (
              <AltCard icon="coins" iconColor="#BA7517" title="Index & thematic ETFs">
                {data.etfs.map(e => (
                  <AltItem key={e.name} name={`${e.name} (${e.ticker})`} value={`${e.returns1Y} 1Y`} sub={`${e.type} · AUM ${e.aum}`} />
                ))}
              </AltCard>
            )}

            {/* Fixed Income */}
            {data.fixedIncome?.length > 0 && (
              <AltCard icon="lock" iconColor="#1D9E75" title="Fixed income options">
                {data.fixedIncome.map(f => (
                  <AltItem key={f.name} name={f.name} value={f.rate} sub={`${f.tenure} · ${f.tax}`} />
                ))}
              </AltCard>
            )}
          </div>

          {/* IPOs full width */}
          {data.ipos?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <SectionLabel>Open & upcoming IPOs</SectionLabel>
              {data.ipos.map(ipo => (
                <Card key={ipo.name} style={{ marginBottom: 10, borderColor: ipo.status === 'Open' ? 'var(--blue)' : 'var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{ipo.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        {ipo.sector} · Price band: ₹{ipo.priceBand}
                        {ipo.openClose && ` · ${ipo.openClose}`}
                      </div>
                    </div>
                    <Badge
                      bg={ipo.status === 'Open' ? 'rgba(24,95,165,0.1)' : ipo.status === 'Recently Listed' ? 'var(--green-light)' : 'var(--bg-muted)'}
                      color={ipo.status === 'Open' ? '#185FA5' : ipo.status === 'Recently Listed' ? '#0F6E56' : 'var(--text-muted)'}
                    >{ipo.status}</Badge>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 10 }}>{ipo.businessSummary}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 10 }}>
                    {[
                      { label: 'GMP', value: ipo.gmp },
                      { label: 'Issue size', value: ipo.issueSize },
                      { label: 'Risk', value: ipo.riskRating },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)', padding: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                  {ipo.verdict && (
                    <div style={{ fontSize: 12, fontWeight: 600, color: verdictColor(ipo.verdict), display: 'flex', gap: 6 }}>
                      <i className="ti ti-gavel" style={{ fontSize: 12, marginTop: 1 }} />
                      Verdict: {ipo.verdict}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* NPS + SGB + NFO row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {/* NPS */}
            {data.nps?.length > 0 && (
              <AltCard icon="piggy-bank" iconColor="#D4537E" title="NPS funds">
                {data.nps.map(n => (
                  <div key={n.scheme} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, fontWeight: 500 }}>{n.scheme}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                      <span style={{ fontSize: 11, color: '#1D9E75' }}>{n.returns3Y} 3Y</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{n.returns5Y} 5Y</span>
                    </div>
                    {n.note && <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 2 }}>{n.note}</div>}
                  </div>
                ))}
              </AltCard>
            )}

            {/* SGB */}
            {data.sgb && (
              <AltCard icon="currency-rupee" iconColor="#EF9F27" title="Sovereign Gold Bonds">
                <AltItem name="Gold spot price" value={data.sgb.currentSpotGold} />
                <AltItem name="Interest rate" value={data.sgb.interestRate} sub="Paid semi-annually" />
                <AltItem name="Tranche status" value={data.sgb.status} />
                {data.sgb.nextTranche && <AltItem name="Next tranche" value={data.sgb.nextTranche} />}
                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  <i className="ti ti-check" style={{ fontSize: 11, color: '#1D9E75' }} /> {data.sgb.taxBenefit}
                </div>
                {data.sgb.verdict && (
                  <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>{data.sgb.verdict}</div>
                )}
              </AltCard>
            )}

            {/* NFOs */}
            {data.nfo?.length > 0 && (
              <AltCard icon="sparkles" iconColor="#534AB7" title="New Fund Offers (NFO)">
                {data.nfo.map(n => (
                  <div key={n.name} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{n.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{n.amc} · {n.type}</div>
                    {n.closingDate && <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>Closes: {n.closingDate}</div>}
                    {n.theme && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.4 }}>{n.theme}</div>}
                  </div>
                ))}
              </AltCard>
            )}
          </div>
        </div>
      )}

      {!loading && !data && !error && (
        <EmptyState icon="building-bank" title="Full alternative investment landscape" desc={"MFs, REITs, ETFs, SGBs, IPOs, NPS and more\nClick Load to see today's options across all asset classes."} />
      )}
    </div>
  )
}
