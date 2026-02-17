# Context8 Landing Page — Design & Copy Decisions

**Date**: 2026-02-12
**Status**: Finalized
**Final artifact**: Implemented in `src/pages/Landing.tsx` (amber Daily Disagree style)

---

## 1. Design Process

### Phase 1: Initial Concepts (3 mockups)

Three fundamentally different design directions were created in parallel:

| Mockup | Style | Key Idea |
|--------|-------|----------|
| `terminal-hacker.html` | Matrix/hacker terminal | Green-on-black, scanline effects, typewriter |
| `brutal-minimal.html` | White neobrutalism | Thick borders, offset shadows, Inter 900 |
| `data-glass.html` | Glassmorphism | Blurred glass cards, gradients, translucent |

**User feedback**: Liked terminal-hacker. Wanted brutal-minimal in dark theme. Requested a completely different 3rd concept.

### Phase 2: Dark Variants (2 mockups)

| Mockup | Style |
|--------|-------|
| `brutal-dark.html` | Neobrutalism converted to dark theme |
| `war-room.html` | Military command center — new concept |

**User feedback**: War room is good, but yellow is too bright ("слишком яркий жёлтый"). Wanted 3 color variations with muted tones.

### Phase 3: War Room Color Variations (3 mockups)

| Mockup | Palette |
|--------|---------|
| `war-room-v1.html` | Muted amber (#C49A3C) |
| `war-room-v2.html` | Cool steel (#7B8FA0) |
| `war-room-v3.html` | Phosphor green (#4CAF50) |

**User feedback**: Liked the direction. Wanted professional designers + web researchers + Bloomberg terminal aesthetic.

### Phase 4: Design Studio (2 researchers + 3 designers)

Full team with web research capability:

**Researchers** (WebSearch):
- `research-trading-ui.md` — Bloomberg Terminal DNA, TradingView/Deribit/Bybit palettes, 50+ reference links
- `research-trader-ux.md` — F-pattern for data, amber vs red for urgency, colorblind-safe palettes

**Designers** (using UI/UX Pro Max skill):

| Mockup | Direction | Score (avg) |
|--------|-----------|-------------|
| `bloomberg-pure.html` | Pure Bloomberg terminal (orange headers, dense data) | **7.8** |
| `modern-terminal.html` | Linear/Vercel SaaS + Bloomberg data | 6.6 |
| `radar-ops.html` | Evolved war-room with 3-panel Bloomberg | **7.4** |

### Phase 5: Focus Group #1 (5 personas, 11 mockups)

| Persona | Role | Top Pick |
|---------|------|----------|
| Alex | Quant trader | bloomberg-pure (9/10) |
| Dima | Crypto degen | bloomberg-pure (9/10) |
| Sarah | Fund manager | bloomberg-pure (9/10) |
| Marcus | Developer | modern-terminal (9/10) |
| Yuki | UX designer | modern-terminal (8/10) |

**Key insight**: Split between traders (bloomberg-pure) and dev/UX (modern-terminal).

**Yuki's recommendation**: Hybrid — modern-terminal page structure + bloomberg-pure data tables + brutal-dark hero typography.

### Phase 6: Hybrid Variants (3 mockups)

Built per Yuki's formula:

| Mockup | Accent Color | Font Pair |
|--------|-------------|-----------|
| `hybrid-teal.html` | Teal (#2DD4BF) | Inter + JetBrains Mono |
| `hybrid-amber.html` | Warm amber (#C49A3C) | Inter + JetBrains Mono |
| `hybrid-orange.html` | Bloomberg orange (#FF8C00) | Inter + IBM Plex Mono |

### Phase 7: Focus Group #2 (5 personas, 3 hybrids)

| Persona | #1 Pick | Score |
|---------|---------|-------|
| Alex (quant) | Orange | 8/10 |
| Dima (degen) | Orange | 9/10 |
| Sarah (fund) | Amber | 8/10 |
| Marcus (dev) | Orange | 8/10 |
| Yuki (UX) | Amber | 9/10 |

**Result**: Orange won popular vote 3:2, but Amber won institutional + UX votes.

**Yuki's final verdict**: "hybrid-amber ships" with cherry-picks from orange:
1. Orange's headline style ("Crypto signals that fight each other" + accent line)
2. Orange's API section (terminal dots + "Developer Experience" title)
3. Brighter bull/bear colors (#5C9A72 -> #4CAF78, #B54545 -> #C94D4D)

### Phase 8: Final Amber + Cherry-Picks

Applied Yuki's recommendations to `hybrid-amber.html`. This became the final design base.

---

## 2. Why Amber Won Over Orange

| Factor | Amber | Orange |
|--------|-------|--------|
| Warmth | Warm, inviting, premium feel | Cold, aggressive, Bloomberg-corporate |
| Eye fatigue | Muted amber is comfortable for long sessions | Bright orange strains on dark bg |
| Differentiation | Unique — no crypto product uses this palette | Looks like every Bloomberg clone |
| Institutional trust | Sarah (fund manager) preferred amber | — |
| UX quality | Yuki (UX designer) scored amber 9/10 | Yuki scored orange 7/10 |
| WCAG AA | All text passes 4.5:1 contrast | Bright green/red tags are borderline |

---

## 3. Copy Process

### Brand Studio Team (6 agents)

**Phase 1** — 5 agents in parallel:

| Agent | Role | Output |
|-------|------|--------|
| market-researcher | Competitor positioning research | `copy/research-market.md` |
| copy-researcher | SaaS landing page best practices | `copy/research-copy.md` |
| brand-strategist | Positioning framework | `copy/strategy.md` |
| growth-marketer | Conversion analysis | `copy/growth-marketing.md` |
| copywriter | 3 complete copy variants | `copy/copywriter-drafts.md` |

**Phase 2** — Creative Director:
- Read all 5 documents
- Identified 9 points of disagreement
- Resolved each with reasoned verdict
- Produced final copy deck: `copy/FINAL-COPY.md`

### 9 Debates Resolved

| # | Question | Winner | Verdict |
|---|----------|--------|---------|
| 1 | Audience | Strategist | Semi-pro traders primary, devs secondary |
| 2 | Headline | Copywriter (Variant A) | "Your signals agree. That's the problem." |
| 3 | "The Daily Disagree" | Strategist | Killed — sounds like podcast, not API |
| 4 | Tone | Strategist + Copywriter blend | Precise, direct, knowing |
| 5 | CTA text | Copy researcher | "Get API Key" (no "free" in button) |
| 6 | Stats | Growth marketer | 23 / <200ms / 5 min |
| 7 | Feature cards | CD compromise | Keep all 3 as different TYPES of conflict |
| 8 | Pricing | CD | Don't show on landing page |
| 9 | Accent line | Strategist | "Agreement is noise. Conflict is signal." |

---

## 4. Why This Copy

### Headline: "Your signals agree. That's the problem."

- Problem-first (describes THEIR pain, not OUR product)
- Contrast formula (proven by Supabase's "Build in a weekend. Scale to millions.")
- 7 words — fits mobile, memorable
- Indicts the reader's current tools without naming them
- Beat 4 alternatives including "Crypto signals that fight each other" (which describes our product, not their problem)

### Tagline: "Agreement is noise. Conflict is signal."

- Inverts expectations (agreement = bad, conflict = good)
- Positions every single-signal competitor as "noise"
- Works as standalone tagline AND as accent line
- Restates the product architecture in 6 words

### Stats: 23 / <200ms / 5 min (not 23 / 6 / 1)

- Answers 3 visitor questions: scale, speed, ease
- "6 Conflicts Daily" is too niche (visitors don't know what a "conflict" means yet)
- "1 API Key" wastes a stat slot on something obvious
- "<200ms" and "5 min" build developer credibility

### Bottom CTA: "Stop trading on consensus."

- Imperative, challenges the reader
- Creates urgency without hype
- "consensus" ties back to the headline's "agree"

---

## 5. Final Positioning

**Statement**: For active crypto traders who monitor multiple signals, Context8 is the intelligence API that surfaces where the market disagrees with itself.

**Tagline**: Agreement is noise. Conflict is signal.

**Tone**: Precise. Direct. Knowing. ("Like a senior trader at a prop desk pointing at the screens. Not selling. Not teaching. Just showing.")

**Primary audience**: Semi-pro crypto traders ($50K-$2M) who already use TradingView and manually cross-reference signal sources.

**Philosophical hook**: Every signal product reduces uncertainty into one answer. Context8 treats uncertainty itself as the product.

---

## 6. Key Competitive Insight

From market research: **zero competitors position around conflict between signals**. The entire crypto analytics space is saturated with:
- "On-chain analytics" (Glassnode, CryptoQuant)
- "Smart money tracking" (Nansen, Arkham)
- "Actionable insights" (Token Metrics)
- "Social sentiment" (LunarCrush)

No one says "here's where the market disagrees with itself." This is confirmed whitespace.

---

## 7. File Inventory

### Final artifacts
- `src/pages/Landing.tsx` — current implementation (design + copy)

### Research
- See commit history before 2026-02-17 for archived HTML mockups and copy deck (removed from repo).

### All mockups (chronological)
Archived; removed from repo during cleanup.
