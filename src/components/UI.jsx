import React from 'react'

export function Spinner({ text = 'Loading…' }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
      <div style={{
        width: 28, height: 28, border: '2.5px solid var(--border-med)',
        borderTopColor: 'var(--green)', borderRadius: '50%',
        animation: 'spin .7s linear infinite', margin: '0 auto 14px'
      }} />
      <div style={{ fontSize: 13 }}>{text}</div>
    </div>
  )
}

export function ErrorBox({ message }) {
  return (
    <div style={{
      background: 'var(--red-light)', color: '#A32D2D', padding: '12px 14px',
      borderRadius: 'var(--radius-md)', fontSize: 13, display: 'flex', gap: 8, alignItems: 'flex-start'
    }}>
      <i className="ti ti-alert-circle" style={{ fontSize: 16, marginTop: 1, flexShrink: 0 }} />
      <span>{message} — please try again.</span>
    </div>
  )
}

export function EmptyState({ icon, title, desc }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
      <i className={`ti ti-${icon}`} style={{ fontSize: 40, opacity: 0.25, display: 'block', marginBottom: 12 }} />
      <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, lineHeight: 1.7 }}>{desc}</div>
    </div>
  )
}

export function Badge({ children, bg, color }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 500,
      background: bg, color
    }}>
      {children}
    </span>
  )
}

export function Card({ children, style = {}, accent }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: accent ? `1.5px solid ${accent}` : '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '1rem 1.25rem',
      boxShadow: 'var(--shadow-sm)',
      ...style
    }}>
      {children}
    </div>
  )
}

export function FinGrid({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 10 }}>
      {items.map(({ label, value }) => (
        <div key={label} style={{
          background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)',
          padding: '8px 6px', textAlign: 'center'
        }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
        </div>
      ))}
    </div>
  )
}

export function RiskBar({ score }) {
  const { color } = getRiskMetaLocal(score)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 32 }}>Risk</span>
      <div style={{ flex: 1, height: 4, background: 'var(--bg-muted)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${score * 10}%`, height: '100%', background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 500, color, minWidth: 28, textAlign: 'right' }}>{score}/10</span>
    </div>
  )
}

function getRiskMetaLocal(score) {
  if (score <= 3) return { color: '#1D9E75' }
  if (score <= 6) return { color: '#EF9F27' }
  return { color: '#E24B4A' }
}

export function WarnBox({ children }) {
  return (
    <div style={{
      background: 'var(--amber-light)', color: '#854F0B',
      padding: '8px 10px', borderRadius: 'var(--radius-sm)',
      fontSize: 12, marginTop: 8, display: 'flex', gap: 6, alignItems: 'flex-start'
    }}>
      <i className="ti ti-alert-triangle" style={{ fontSize: 12, marginTop: 1, flexShrink: 0 }} />
      <span>{children}</span>
    </div>
  )
}

export function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
      textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10
    }}>
      {children}
    </div>
  )
}
