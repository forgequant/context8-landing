# Context8 Landing Page -- Growth Marketing / Conversion Analysis

## Pre-Analysis Note

There are TWO versions of Context8 in play. The **live page** (context8.markets) sells an MCP server with 26 tools. The **brief** describes a pivot to an API-first product with 23 AI modules and a "conflict detection" mechanic. My analysis covers the brief's vision (the new positioning) but flags where the live page diverges, because any copy we ship must match what the product actually does on day one.

---

## 1. Funnel Analysis

### Who lands on this page?

| Source | % est. | Mental state | Objection |
|--------|--------|-------------|-----------|
| Crypto Twitter / X | 40% | Saw a tweet about "signals that fight each other." Curious, skeptical. Attention span: 8 seconds. | "Another AI scam predicting pumps." |
| Dev communities (HN, Reddit /r/algotrading, Discord) | 25% | Looking for structured data. Has tried CoinGecko API, Messari, Santiment. Wants clean REST. | "What's different from Santiment API? Pricing?" |
| Organic search ("crypto API", "crypto trading signals API") | 20% | High intent. Comparing 3-5 options in tabs right now. | "Is this reliable? Who's behind it? What's the uptime?" |
| Referral / word of mouth | 15% | Already trusts the referrer. Wants to evaluate quickly and decide. | "How fast can I ship this?" |

### What's the ONE action we want?

**Primary**: Get an API key (email capture + activation in one step).

Not "sign up." Not "learn more." The API key IS the activation event. Once someone has a key and makes their first call, retention becomes a product problem, not a marketing one.

**Secondary**: Star/clone the GitHub repo (for developers who need to evaluate before committing).

---

## 2. Hero Section -- Conversion Audit

### Current headline candidates from the brief:

**"Crypto signals that fight each other."**
- Clarity: 4/10. A first-time visitor doesn't know what this means. It's clever, but clever kills conversion when people don't understand the product category yet.
- Desire: 7/10. Once you understand it, it's intriguing. The problem is the "once."
- Believability: 5/10. Feels like copywriting, not a product promise.
- Verdict: Strong *second* line. Terrible H1.

**"That's the alpha."**
- Clarity: 2/10. Meaningless to anyone outside crypto degen circles. Alienates the quant/dev audience entirely.
- Desire: 6/10 for crypto natives, 1/10 for everyone else.
- Believability: 3/10. Every crypto product says this.
- Verdict: Kill it. This is t-shirt copy, not conversion copy.

**"23 independent AI modules. When they disagree, you profit."**
- Clarity: 7/10. You understand the mechanic in one read. "23 modules" is concrete. "Disagree" is the hook.
- Desire: 8/10. The disagreement-as-alpha concept is genuinely novel.
- Believability: 6/10. "You profit" is a promise the product can't guarantee. Compliance risk.
- Verdict: Closest to shippable. Needs de-risking.

### Alternative headlines (ranked by projected conversion impact):

**Option A: "23 AI modules. One API call. See where the market contradicts itself."**
- Why it works: Concrete number (23), concrete action (one API call), concrete benefit (contradictions = opportunity). No profit promises. The word "contradicts" does the work "disagree" does, but feels more analytical and less hype-y. Speaks to both traders and developers.

**Option B: "The crypto API that shows you conflict, not consensus."**
- Why it works: Positions against competitors ("consensus" = every other signal service). "Conflict" is the differentiator. Short. Scannable. Works for the 3-second test. Developer-friendly language ("API").

**Option C: "Crypto intelligence from 23 independent sources. When they clash, that's your edge."**
- Why it works: "Intelligence" positions up-market (quant funds, serious traders). "Independent sources" builds credibility -- not one model, 23. "Clash" is more visceral than "disagree." "Edge" is the universal trader word for alpha without the compliance baggage.

**My pick: Option A** for H1, with **Option B** as the accent/subheadline.

### Stats boxes: "23 / 6 / 1"

Current: 23 Modules / 6 Conflicts Daily / 1 API Key

- "23 Modules" -- KEEP. Specific numbers convert. This is good.
- "6 Conflicts Daily" -- CHANGE. "6" feels low. Traders want volume. Also, "daily" is vague. Better: **"Real-time conflict detection"** or if you can justify a bigger number: **"150+ signals/day"** (23 modules x ~7 assets = 150+ data points).
- "1 API Key" -- WEAK. "1" doesn't communicate value, it communicates simplicity, which is good but not stat-box worthy. Better: **"< 200ms response"** (latency matters to developers) or **"5 min to first signal"** (time-to-value matters to everyone).

**Proposed stats:**
| 23 | < 200ms | 5 min |
|---|---|---|
| AI Modules | API Response | To First Signal |

These hit the three things a developer evaluates: breadth (23), performance (200ms), ease (5 min).

---

## 3. CTA Optimization

### "Get API Key" -- Grade: B-

It's clear and action-oriented. But it's cold. It assumes the visitor already wants an API key. For top-of-funnel traffic (crypto twitter), they don't know what they'd do with one yet.

**Better primary CTAs:**
1. **"Get Free API Key"** -- adds "free" which is the highest-converting word in SaaS. Low risk.
2. **"Try It Free"** -- simpler, less technical. Better for non-dev audience.
3. **"Start Building Free"** -- for the dev audience. Implies action, not just acquisition.

**My pick: "Get Free API Key"** -- it's specific (API key, not vague "access"), it's free, it's one action.

### Free tier framing:

"No credit card" is table stakes. Everyone says it. Still include it, but don't lead with it.

**Best free tier framing:** "1,000 calls/month free. No credit card. Ship in 5 minutes."

Why: "1,000 calls" is generous and specific. "5 minutes" gives a time-to-value promise. This is better than "Free forever" which sounds desperate and raises questions about sustainability.

### Secondary CTA: "View Docs"

"View Docs" is fine for developers but it's a leak in the funnel. You're giving people an exit ramp before they've converted.

**Better options:**
1. **"See Live Example"** -- show, don't tell. Link to a live API response or interactive demo.
2. **"View API Response"** -- curiosity-driven. What does the data actually look like?
3. **"Explore the API"** -- if docs are interactive (Swagger/Playground).

**My pick: "See Live Example"** -- it's lower commitment than docs and higher engagement.

### Bottom CTA:

"Get your API key" is fine but generic. The bottom CTA should overcome the objection that survived the entire page scroll.

**Better bottom CTAs:**
1. **"Start with 1,000 free calls"** -- restate the offer, overcome price objection.
2. **"Get your API key in 30 seconds"** -- overcome effort objection.
3. **"Join [X] teams using Context8"** -- social proof, if you have the numbers.

### Button text style:

Short punchy wins. Every extra word on a button reduces click-through. Max 4 words.

---

## 4. Feature Cards -- What Sells?

### Current 3: Conflict Detection, Crowded Trades, Divergence Watch

**Conflict Detection** -- KEEP. This IS the product. It's the differentiator. Lead with it.

**Crowded Trades** -- KEEP. This is the most immediately actionable feature. Traders lose money on crowded trades constantly. Pain point is real and visceral. "Z-score rankings of overleveraged positions" is chef's kiss for the quant audience.

**Divergence Watch** -- MERGE or REFRAME. "Sentiment says one thing, price says another" is really just another way of saying "conflict detection." Having two features that sound like the same thing dilutes both. Reframe as: **"Regime Detection"** -- macro regime analysis (risk-on/risk-off/transitional). This is a different, complementary signal.

### What's MISSING:

1. **"One REST Call" card** -- The simplicity of the API is a feature. One endpoint, full scorecard. This should be a card, not buried in docs. Developers evaluate APIs by complexity first.

2. **Integration logos** -- Not as feature cards, but ABOVE the feature cards. "Works with:" + logos for Python, JavaScript, cURL, and any trading platforms. Reduces "will this work with my stack?" friction to zero.

3. **Sample API response** -- Show the actual JSON. Developers decide based on response shape. The Bloomberg-style scorecard visual is great for traders, but devs want to see `{ "verdict": "BEARISH", "score": 4.2, "conviction": 7 }`.

### Should you show social proof instead?

Not instead. In addition. But only if you have real numbers. "Used by 47 trading teams" is good. "Trusted by traders worldwide" is empty. If you don't have numbers yet, skip social proof entirely. Fake-feeling social proof is worse than none.

---

## 5. Trust & Credibility Gaps

### What's missing:

1. **Who built this?** The page has zero human presence. No founder, no team, no "About." Crypto is full of anonymous scam projects. A name and face (even just a Twitter/X handle) dramatically increases trust. The brief mentions this is a solo project -- lean into that. "Built by [name], ex-[credible thing]" is more trustworthy than a faceless brand.

2. **API status / uptime.** A real-time status badge or "99.X% uptime" claim. Developers won't integrate an API they can't trust to be available.

3. **Data sources disclosure.** "Where does the data come from?" is the #1 question a skeptical trader will have. List the sources: Binance, CoinGlass, LunarCrush, etc. Transparency = trust.

4. **Track record / backtest.** "When modules disagreed on BTC last Tuesday, here's what happened." One concrete example is worth more than 100 words of feature description. If you can show a historical case where conflict detection preceded a major move, that's your most powerful trust asset.

5. **"Not financial advice" is necessary but insufficient.** Add: "Informational tool for research purposes. Past signals do not guarantee future results." This protects you legally AND paradoxically increases trust -- serious products have serious disclaimers.

### Does the Bloomberg-style scorecard build or hurt trust?

**Builds trust** -- significantly. It's the single most effective element on the page for the quant/pro audience. It says "this is real data, presented seriously" without words. The amber/dark aesthetic reinforces "professional tool, not meme coin casino."

However, it MUST show real data or clearly labeled sample data. A scorecard with obviously fake numbers ("BTC score: 9.7!") would destroy trust instantly. Use recent real data, even if it's delayed.

---

## 6. Pricing Psychology

### Free tier messaging:

**"Free tier. No credit card. Ship in minutes."** -- Grade: B+

"Ship in minutes" is strong. "No credit card" is expected. "Free tier" is bland.

**Better:** "1,000 API calls/month. Free forever. No credit card."

Why: Lead with the specific offer (1,000 calls), then the permanence (forever), then the friction reducer (no card). Specific > vague in every A/B test ever run.

### Should pricing be visible on the landing page?

**YES.** Hidden pricing creates friction and suspicion, especially in crypto where everything feels like a bait-and-switch. Show pricing on the landing page, but keep it simple:

- Free: $0 / 1,000 calls/month
- Pro: $29/month / 50,000 calls
- Enterprise: "Talk to us"

Three tiers max. The free tier does the conversion work. The paid tiers exist to anchor the free tier's perceived value.

### Price point concern:

The live site shows $8/mo for Pro. That's too cheap. It signals "toy product." Serious trading tools are $29-99/mo minimum. You can always discount ($29 -> $8/mo for early adopters) but the anchor price should be professional. "80% off for early access" is more compelling than "$8/mo."

---

## 7. Copy Priorities (Ranked 1-5)

### 1. Hero headline (HIGHEST IMPACT)

Current live headline ("Crypto intelligence for your AI assistant") is describing the category, not the differentiator. Change to something that communicates the conflict-detection mechanic in 3 seconds. This single change will impact bounce rate more than anything else on the page.

**Single highest-impact copy change:** Replace the H1 with "23 AI modules. One API call. See where the market contradicts itself."

### 2. CTA button text + free tier framing

"Get Started Free" (current live) is generic. "Get Free API Key" is specific and actionable. Pair with "1,000 calls/month free" below the button.

### 3. Add a concrete example / proof section

The page explains WHAT the product does but never shows WHAT HAPPENS when you use it. One real example: "On Jan 15, 18 of 23 modules were bearish on ETH. 5 were bullish. ETH dropped 12% in 48 hours." That's not financial advice -- it's a historical fact that demonstrates the product works.

### 4. Trust elements (founder identity + data sources)

Add a small "Built by [name]" + link to Twitter/X. List data sources. These are low-effort, high-trust changes.

### 5. Feature card rewrite (LOWEST RELATIVE IMPACT)

The feature cards matter but less than the above. People who scroll to features are already somewhat engaged. The hero, CTA, and trust elements are where you lose most visitors.

### What's wasted space:

- **The FAQ section** on the live page is too prominent. FAQs are a crutch for unclear copy. If the hero and features do their job, most FAQ questions become unnecessary. Move FAQ to a separate page or collapse it.
- **"That's the alpha"** accent line in the brief. Wasted real estate. Replace with a concrete value prop.
- **Roadmap section** on the live page showing "0/10 subscribers" -- this communicates "nobody uses this." Remove immediately. It's anti-social-proof.

### What's missing:

- **Mobile-first copy audit.** 60%+ of crypto twitter traffic is mobile. Every headline must work at 320px width. "23 independent AI modules. When they disagree, you profit." wraps awkwardly on mobile. Test all copy at small breakpoints.
- **Exit-intent or scroll-triggered offer.** When someone scrolls 75% of the page without clicking, show a subtle prompt: "Want to see a live signal? Enter your email." This captures leads who are interested but not ready to commit to an API key.

---

## Summary: Top 3 Changes That Will Move the Needle

1. **New H1**: "23 AI modules. One API call. See where the market contradicts itself." -- Communicates differentiator in 3 seconds.
2. **New CTA**: "Get Free API Key" + "1,000 calls/month free. No credit card." -- Specific, low-friction, high-value.
3. **Add one concrete example**: Show a real historical signal where module conflict preceded a market move. Proof converts. Claims don't.

Everything else is optimization. These three are the foundation.
