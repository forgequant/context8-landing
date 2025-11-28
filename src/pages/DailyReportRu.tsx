import { Link } from 'react-router-dom'

// Progress bar для визуализации сентимента
function SentimentBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-terminal-muted">{label}</span>
        <span className="text-terminal-green font-semibold">{value}%</span>
      </div>
      <div className="h-2 bg-graphite-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-terminal-green to-terminal-cyan rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

// Карточка метрики
function MetricCard({ label, value, change, isPositive }: {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}) {
  return (
    <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-4 hover:border-terminal-cyan/30 transition-colors">
      <div className="text-xs text-terminal-muted uppercase tracking-wider mb-1">{label}</div>
      <div className="text-xl font-bold text-terminal-text font-mono">{value}</div>
      {change && (
        <div className={`text-xs mt-1 ${isPositive ? 'text-terminal-green' : 'text-terminal-red'}`}>
          {isPositive ? '↑' : '↓'} {change}
        </div>
      )}
    </div>
  )
}

// Бейдж для нарративов
function Badge({ children, variant = 'default' }: {
  children: React.ReactNode;
  variant?: 'default' | 'hot' | 'cold' | 'neutral';
}) {
  const variants = {
    default: 'bg-terminal-cyan/20 text-terminal-cyan border-terminal-cyan/30',
    hot: 'bg-terminal-green/20 text-terminal-green border-terminal-green/30',
    cold: 'bg-terminal-red/20 text-terminal-red border-terminal-red/30',
    neutral: 'bg-graphite-800 text-terminal-muted border-graphite-700',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-mono rounded border ${variants[variant]}`}>
      {children}
    </span>
  )
}

// Строка актива для таблицы
function AssetRow({
  symbol,
  change24h,
  change7d,
  social,
  sentiment,
  comment,
  isPositive
}: {
  symbol: string;
  change24h: string;
  change7d: string;
  social: string;
  sentiment: string;
  comment: string;
  isPositive: boolean;
}) {
  return (
    <tr className="border-b border-graphite-800 hover:bg-graphite-800/50 transition-colors">
      <td className="py-3 px-2">
        <span className={`font-bold font-mono ${isPositive ? 'text-terminal-green' : 'text-terminal-red'}`}>
          {symbol}
        </span>
      </td>
      <td className={`py-3 px-2 font-mono text-sm ${isPositive ? 'text-terminal-green' : 'text-terminal-red'}`}>
        {change24h}
      </td>
      <td className={`py-3 px-2 font-mono text-sm ${change7d.startsWith('+') ? 'text-terminal-green' : 'text-terminal-red'}`}>
        {change7d}
      </td>
      <td className="py-3 px-2 text-sm text-terminal-cyan">{social}</td>
      <td className="py-3 px-2 text-sm">
        <span className="text-terminal-green">{sentiment}</span>
      </td>
      <td className="py-3 px-2 text-xs text-terminal-muted max-w-[200px]">{comment}</td>
    </tr>
  )
}

// Индикатор риска
function RiskIndicator({ level, label }: { level: 'low' | 'medium' | 'high'; label: string }) {
  const colors = {
    low: 'bg-terminal-green',
    medium: 'bg-yellow-500',
    high: 'bg-terminal-red',
  }
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${colors[level]} animate-pulse`} />
      <span className="text-sm text-terminal-muted">{label}</span>
    </div>
  )
}

export function DailyReportRu() {
  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono px-4 md:px-6 py-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <Link to="/" className="text-sm text-terminal-cyan hover:underline mb-4 inline-block">
          ← Назад на главную
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-terminal-cyan">Ежедневный обзор рынка</h1>
            <p className="text-terminal-muted text-sm mt-1">Крипто-аналитика • Социальные сигналы • Ключевые нарративы</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-terminal-cyan/10 border border-terminal-cyan/30 rounded text-terminal-cyan text-sm">
              28 ноября 2025
            </span>
            <span className="px-3 py-1 bg-terminal-green/10 border border-terminal-green/30 rounded text-terminal-green text-sm">
              LIVE
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-6xl mx-auto space-y-8">

        {/* Key Metrics Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Уникальные авторы"
            value="249 766"
            change="7.1% за 24ч"
            isPositive={false}
          />
          <MetricCard
            label="Сентимент рынка"
            value="82%"
            change="1-2% vs среднего"
            isPositive={true}
          />
          <MetricCard
            label="DeFi вовлечённость"
            value="53M"
            change="19% за неделю"
            isPositive={false}
          />
          <MetricCard
            label="AI креаторы"
            value="—"
            change="9.7% за 24ч"
            isPositive={false}
          />
        </section>

        {/* Executive Summary */}
        <section className="bg-graphite-900 border border-terminal-cyan/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-terminal-cyan flex items-center gap-2">
            <span className="w-2 h-2 bg-terminal-cyan rounded-full animate-pulse" />
            Ключевые выводы
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-terminal-red mt-1">▼</span>
                <p className="text-sm text-terminal-muted">
                  <strong className="text-terminal-text">Соц. активность снизилась</strong> — уникальных авторов на 7.1% меньше (249 766 vs прошлые 24ч)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-terminal-green mt-1">▲</span>
                <p className="text-sm text-terminal-muted">
                  <strong className="text-terminal-text">Сентимент бычий</strong> — 82% позитива (на 1-2% выше недельного/месячного среднего)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">◆</span>
                <p className="text-sm text-terminal-muted">
                  <strong className="text-terminal-text">Ценовое действие смешанное</strong> — узкий breadth, концентрация в privacy-монетах (новости ZEC ETF)
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-terminal-cyan mt-1">●</span>
                <p className="text-sm text-terminal-muted">
                  <strong className="text-terminal-text">BTC ETF притоки восстановились</strong>, в то время как Solana ETF — оттоки
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-terminal-red mt-1">!</span>
                <p className="text-sm text-terminal-muted">
                  <strong className="text-terminal-text">Аномалии:</strong> Upbit взлом на $36M в Solana; даунгрейд Tether от S&P
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-terminal-green mt-1">★</span>
                <p className="text-sm text-terminal-muted">
                  <strong className="text-terminal-text">Ключевые нарративы:</strong> Privacy coins, экосистема Solana, партнёрства Chainlink
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sentiment Visualization */}
        <section className="bg-graphite-900 border border-graphite-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-terminal-text">Обзор сентимента</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <SentimentBar value={82} label="Общий рынок" />
            <SentimentBar value={84} label="DeFi сектор" />
            <SentimentBar value={83} label="AI сектор" />
          </div>
        </section>

        {/* Narratives & Sectors */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2 flex items-center gap-2">
            <span className="text-terminal-cyan">02</span> Нарративы и секторы
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Privacy Coins Card */}
            <div className="bg-graphite-900 border border-terminal-green/30 rounded-lg p-4 hover:border-terminal-green/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-terminal-green">Privacy Coins</h3>
                <Badge variant="hot">+1000% ZEC</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Активы</span>
                  <span className="text-terminal-text">ZEC, DASH, XMR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Катализатор</span>
                  <span className="text-terminal-cyan">Заявка Grayscale ETF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Соц. сигнал</span>
                  <span className="text-terminal-green">↑ Всплеск</span>
                </div>
              </div>
            </div>

            {/* Solana Ecosystem Card */}
            <div className="bg-graphite-900 border border-yellow-500/30 rounded-lg p-4 hover:border-yellow-500/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-yellow-400">Экосистема Solana</h3>
                <Badge variant="neutral">Смешанно</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Активы</span>
                  <span className="text-terminal-text">SOL ($140), MON</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-muted">События</span>
                  <span className="text-terminal-red">Взлом $36M, оттоки ETF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Соц. сигнал</span>
                  <span className="text-terminal-cyan">↑ Mentions, ↓ Engagement</span>
                </div>
              </div>
            </div>

            {/* DeFi Card */}
            <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4 hover:border-terminal-cyan/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-terminal-cyan">DeFi</h3>
                <Badge variant="default">84% сентимент</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Активы</span>
                  <span className="text-terminal-text">SOL, ETH, XRP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Вовлечённость</span>
                  <span className="text-terminal-red">↓ 19%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Упоминания</span>
                  <span className="text-terminal-green">↑ 9.4%</span>
                </div>
              </div>
            </div>

            {/* AI Card */}
            <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4 hover:border-terminal-cyan/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-purple-400">AI сектор</h3>
                <Badge variant="default">83% сентимент</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Активы</span>
                  <span className="text-terminal-text">AIOZ (+5%), NAO</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Фокус</span>
                  <span className="text-terminal-cyan">Chainlink, Bittensor</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Объём</span>
                  <span className="text-terminal-muted">Низкий</span>
                </div>
              </div>
            </div>

            {/* Bitcoin Ecosystem Card */}
            <div className="bg-graphite-900 border border-orange-500/30 rounded-lg p-4 hover:border-orange-500/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-orange-400">Экосистема Bitcoin</h3>
                <Badge variant="hot">Притоки ETF</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Катализатор</span>
                  <span className="text-terminal-green">Резерв BTC в Техасе</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-muted">ETF потоки</span>
                  <span className="text-terminal-green">↑ Восстановились</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-muted">Доминация</span>
                  <span className="text-terminal-cyan">Стабильно</span>
                </div>
              </div>
            </div>

            {/* Declining Card */}
            <div className="bg-graphite-900 border border-terminal-red/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-terminal-red">В упадке</h3>
                <Badge variant="cold">Снижение</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-terminal-muted">
                  <span className="text-terminal-red">↓</span> Мемкоины/pump-fun
                </div>
                <div className="text-terminal-muted">
                  <span className="text-terminal-red">↓</span> Layer-1 (кроме SOL)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Movers */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2 flex items-center gap-2">
            <span className="text-terminal-cyan">03</span> Топ движений
          </h2>

          {/* Positive Movers */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-terminal-green mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-terminal-green/20 flex items-center justify-center">↑</span>
              Растущие
            </h3>
            <div className="bg-graphite-900 border border-graphite-800 rounded-lg overflow-hidden overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-graphite-800 text-terminal-muted text-xs uppercase">
                  <tr>
                    <th className="py-2 px-2 text-left">Тикер</th>
                    <th className="py-2 px-2 text-left">24ч</th>
                    <th className="py-2 px-2 text-left">7д</th>
                    <th className="py-2 px-2 text-left">Соц.</th>
                    <th className="py-2 px-2 text-left">Сентимент</th>
                    <th className="py-2 px-2 text-left">Комментарий</th>
                  </tr>
                </thead>
                <tbody>
                  <AssetRow symbol="ZEC" change24h="N/A (взлёт)" change7d="-30% после ралли" social="Высокий" sentiment="Бычий" comment="Заявка Grayscale ETF — ралли 1000%" isPositive={true} />
                  <AssetRow symbol="AIOZ" change24h="+4.95%" change7d="+16.3%" social="+45% mentions" sentiment="84%" comment="DePIN/AI интеграция; AltRank #132" isPositive={true} />
                  <AssetRow symbol="SOL" change24h="→ $140" change7d="N/A" social="Высокий" sentiment="Смешанный" comment="ETF/токенизация несмотря на взлом" isPositive={true} />
                  <AssetRow symbol="ISP" change24h="+14.3%" change7d="+30.8%" social="+138% engmt" sentiment="78%" comment="Покупки китов; Galaxy 79.5" isPositive={true} />
                  <AssetRow symbol="VR" change24h="+0.7%" change7d="+6.9%" social="-58% engmt" sentiment="98%" comment="Метавселенная AI-инструменты; Galaxy 78.6" isPositive={true} />
                </tbody>
              </table>
            </div>
          </div>

          {/* Negative Movers */}
          <div>
            <h3 className="text-sm font-semibold text-terminal-red mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-terminal-red/20 flex items-center justify-center">↓</span>
              Падающие
            </h3>
            <div className="bg-graphite-900 border border-graphite-800 rounded-lg overflow-hidden overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-graphite-800 text-terminal-muted text-xs uppercase">
                  <tr>
                    <th className="py-2 px-2 text-left">Тикер</th>
                    <th className="py-2 px-2 text-left">24ч</th>
                    <th className="py-2 px-2 text-left">7д</th>
                    <th className="py-2 px-2 text-left">Соц.</th>
                    <th className="py-2 px-2 text-left">Сентимент</th>
                    <th className="py-2 px-2 text-left">Комментарий</th>
                  </tr>
                </thead>
                <tbody>
                  <AssetRow symbol="DDD" change24h="0%" change7d="-55.6%" social="Низкий" sentiment="N/A" comment="Резкое падение при Galaxy 100" isPositive={false} />
                  <AssetRow symbol="EMC" change24h="-12.3%" change7d="-5.7%" social="+72% engmt" sentiment="67%" comment="Страхи скама перевешивают AI-промо" isPositive={false} />
                  <AssetRow symbol="NAO" change24h="+0.1%" change7d="+0.9%" social="+300-467%" sentiment="N/A" comment="Низкий объём при Galaxy 100" isPositive={false} />
                  <AssetRow symbol="USHI" change24h="-1.4%" change7d="-0.1%" social="+217% mentions" sentiment="67%" comment="Слабая ликвидность" isPositive={false} />
                  <AssetRow symbol="MON" change24h="Дамп" change7d="N/A" social="Скандал" sentiment="Смешанный" comment="После запуска; Hayes: 'send to zero'" isPositive={false} />
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Social & Influencer Highlights */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2 flex items-center gap-2">
            <span className="text-terminal-cyan">04</span> Социалка и инфлюенсеры
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Top Influencers */}
            <div className="space-y-3">
              <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-terminal-cyan">@MEXC_Official</span>
                  <span className="text-xs text-terminal-muted">1.7M подписчиков</span>
                </div>
                <div className="text-sm text-terminal-muted">115 постов • 8.7M вовлечённости</div>
                <Badge variant="hot">Бычий DeFi</Badge>
              </div>

              <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-terminal-cyan">@WatcherGuru</span>
                  <span className="text-xs text-terminal-muted">2M+ вовлечённости</span>
                </div>
                <div className="text-sm text-terminal-muted">Притоки ETF, ZEC ETF, взломы Solana</div>
                <Badge variant="neutral">Смешанно</Badge>
              </div>

              <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-terminal-red">@CryptoHayes</span>
                  <span className="text-xs text-terminal-muted">816K вовлечённости</span>
                </div>
                <div className="text-sm text-terminal-muted">Медвежий по MON: "send to zero"</div>
                <Badge variant="cold">Медведь MON</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-terminal-cyan">@lookonchain</span>
                  <span className="text-xs text-terminal-muted">1M+ вовлечённости</span>
                </div>
                <div className="text-sm text-terminal-muted">Покупки китов $ENA, низкие резервы XRP</div>
                <Badge variant="neutral">Аналитика</Badge>
              </div>

              <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-terminal-cyan">@solana</span>
                  <span className="text-xs text-terminal-muted">195K вовлечённости</span>
                </div>
                <div className="text-sm text-terminal-muted">"Amazon для финансов" — оборонительно</div>
                <Badge variant="default">Защита</Badge>
              </div>

              <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-terminal-green">DeFi посты</span>
                  <span className="text-xs text-terminal-muted">Фокус на Chainlink</span>
                </div>
                <div className="text-sm text-terminal-muted">Рост Solana, страховка приватности ZEC</div>
                <Badge variant="hot">84% бычьих</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Risks & Observations */}
        <section className="bg-graphite-900 border border-terminal-red/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-terminal-red flex items-center gap-2">
            <span className="text-2xl">⚠</span> Риски и наблюдения на завтра
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-terminal-red/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-terminal-red text-sm">1</span>
                </div>
                <div>
                  <RiskIndicator level="high" label="Всплеск Privacy (ZEC)" />
                  <p className="text-sm text-terminal-muted mt-1">Ралли 1000% + хайп ETF — риск отката при слабой ликвидности</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-terminal-red/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-terminal-red text-sm">2</span>
                </div>
                <div>
                  <RiskIndicator level="high" label="Давление на Solana" />
                  <p className="text-sm text-terminal-muted mt-1">Взлом Upbit $36M + оттоки ETF; следить за on-chain объёмами</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-500 text-sm">3</span>
                </div>
                <div>
                  <RiskIndicator level="medium" label="Пена после запуска Monad" />
                  <p className="text-sm text-terminal-muted mt-1">93% аирдроп-кошельков продали; критика Hayes усиливает давление</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-500 text-sm">4</span>
                </div>
                <div>
                  <RiskIndicator level="medium" label="Даунгрейд Tether S&P" />
                  <p className="text-sm text-terminal-muted mt-1">Опасения по BTC/gold экспозиции могут перейти на стейблы/DeFi</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-terminal-muted/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-terminal-muted text-sm">5</span>
                </div>
                <div>
                  <RiskIndicator level="low" label="Низкая уверенность" />
                  <p className="text-sm text-terminal-muted mt-1">Снижение соц. трендов — низкая conviction; следить за BTC ETF потоками</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-terminal-green/10 rounded-lg p-3 -mx-3">
                <div className="w-8 h-8 rounded-full bg-terminal-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-terminal-green text-sm">+</span>
                </div>
                <div>
                  <span className="text-terminal-green font-semibold text-sm">Бычьи якоря</span>
                  <p className="text-sm text-terminal-muted mt-1">Резерв BTC в Техасе, накопление Chainlink — макро поддержка</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats Footer */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4 py-6 border-t border-graphite-800">
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-terminal-cyan">82%</div>
            <div className="text-xs text-terminal-muted">Сентимент рынка</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-terminal-red">-7.1%</div>
            <div className="text-xs text-terminal-muted">Активность авторов</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-terminal-green">+9.4%</div>
            <div className="text-xs text-terminal-muted">DeFi упоминания</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-terminal-red">-19%</div>
            <div className="text-xs text-terminal-muted">DeFi вовлечённость</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-orange-400">$36M</div>
            <div className="text-xs text-terminal-muted">Взлом Upbit</div>
          </div>
        </section>

      </article>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-8 pt-8 border-t border-graphite-800 text-xs text-terminal-muted">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <p>Отчёт сгенерирован: 28 ноября 2025 • UTC</p>
            <p className="mt-1">Источники: LunarCrush, CoinGecko, Grayscale, Polymarket, On-chain аналитика</p>
          </div>
          <div className="text-right">
            <p>Отчёт объединяет факты, соц. сигналы и анализ сентимента.</p>
            <p className="mt-1 text-terminal-red">Не является финансовым советом.</p>
          </div>
        </div>
        <p className="mt-6">
          <Link to="/" className="text-terminal-cyan hover:underline">← Назад на Context8</Link>
        </p>
      </footer>
    </div>
  )
}
