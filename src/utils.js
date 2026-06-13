export async function callClaude(userPrompt, systemPrompt) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || `HTTP ${response.status}`)
  }

  const data = await response.json()
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error))

  const text = (data.content || []).map(b => b.text || '').join('')
  const clean = text.replace(/```json|```/g, '').trim()

  try {
    return JSON.parse(clean)
  } catch {
    const match = clean.match(/\{[\s\S]*\}/)
    if (match) {
      try { return JSON.parse(match[0]) } catch {}
    }
    const fixedMatch = clean.match(/\{[\s\S]*/)
    if (fixedMatch) {
      let partial = fixedMatch[0]
      let openBraces = 0, openBrackets = 0
      for (const ch of partial) {
        if (ch === '{') openBraces++
        if (ch === '}') openBraces--
        if (ch === '[') openBrackets++
        if (ch === ']') openBrackets--
      }
      while (openBrackets > 0) { partial += ']'; openBrackets-- }
      while (openBraces > 0) { partial += '}'; openBraces-- }
      try { return JSON.parse(partial) } catch {}
    }
    throw new Error('Could not parse AI response')
  }
}

export function today() {
  return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatINR(n) {
  const num = Number(n)
  if (!n || isNaN(num)) return '₹—'
  if (num >= 10000000) return '₹' + (num / 10000000).toFixed(1) + ' Cr'
  if (num >= 100000) return '₹' + (num / 100000).toFixed(1) + ' L'
  return '₹' + num.toLocaleString('en-IN')
}

export function getRiskMeta(score) {
  if (score <= 3) return { label: 'Low risk', color: '#1D9E75', bg: 'rgba(29,158,117,0.1)', text: '#0F6E56' }
  if (score <= 6) return { label: 'Medium risk', color: '#EF9F27', bg: '#FAEEDA', text: '#854F0B' }
  return { label: 'High risk', color: '#E24B4A', bg: '#FCEBEB', text: '#A32D2D' }
}

export const PALETTE = [
  '#1D9E75','#185FA5','#EF9F27','#D4537E',
  '#534AB7','#D85A30','#639922','#BA7517','#0F6E56','#A32D2D'
]
