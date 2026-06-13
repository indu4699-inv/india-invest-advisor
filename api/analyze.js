export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

    // Handle both parsed objects and raw string bodies safely
    const bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4000,
        system: bodyData.system,
        messages: bodyData.messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Anthropic Error: ${errorText}` });
    }

    const anthropicData = await response.json();
    
    // CRITICAL: Forward the exact nested text block your frontend expects
    // This replicates what your local Vite proxy setup was outputting
    if (anthropicData.content && anthropicData.content[0]) {
      return res.status(200).json({
        content: [{ text: anthropicData.content[0].text }]
      });
    }

    return res.status(200).json(anthropicData);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
