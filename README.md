# India Investment Advisor

AI-powered Indian stock market investment advisor. Fundamentals-first, long-term focus.
Covers all NSE/BSE sectors, all market caps, domestic + international news context.

## Three tabs
- **Portfolio Allocator** — Enter amount, risk level, horizon → get a full portfolio with allocation, CAGR estimates, financials, risk score
- **Weekly Watchlist** — 10 high-conviction picks curated each week with 5Y and 10Y thesis
- **Alt Investments** — MFs, REITs, ETFs, IPOs, SGBs, NPS, fixed income, NFOs

---

## Deploy in 5 steps

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Add your Anthropic API key
```bash
cp .env.example .env
```
Open `.env` and replace `sk-ant-your-key-here` with your actual key from console.anthropic.com

### Step 3 — Test locally (optional)
```bash
npm run dev
```
Open http://localhost:5173 — everything should work.

### Step 4 — Deploy to Vercel
Install Vercel CLI if you haven't:
```bash
npm install -g vercel
```

Deploy:
```bash
vercel
```
Follow the prompts (link to your Vercel account, create new project).

### Step 5 — Add your API key to Vercel
After deploying, go to:
**Vercel dashboard → Your project → Settings → Environment Variables**

Add:
- Key: `ANTHROPIC_API_KEY`
- Value: your `sk-ant-...` key
- Environment: Production, Preview, Development (check all three)

Then redeploy:
```bash
vercel --prod
```

Your app is now live at `https://your-project-name.vercel.app`

---

## Notes
- The API key is stored securely in Vercel — never exposed to the browser
- All AI calls go through `/api/analyze` (a serverless edge function)
- Watchlist picks are cached in the browser for the week and refresh every Monday
- Starred stocks persist in localStorage

## Cost estimate
Each analysis call uses ~1,500–3,000 tokens. At Anthropic's current pricing, running this daily costs well under ₹50/month for personal use.
