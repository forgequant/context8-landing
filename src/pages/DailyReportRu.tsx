import { Link } from 'react-router-dom'

export function DailyReportRu() {
  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono px-6 py-8">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-12">
        <Link to="/" className="text-sm text-terminal-cyan hover:underline mb-4 inline-block">
          ← Назад на главную
        </Link>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-terminal-cyan">Ежедневный отчёт по BTC</h1>
          <span className="text-sm text-terminal-muted">30 окт 2025 11:03 UTC</span>
        </div>
        <p className="text-terminal-muted">Комплексный анализ рынка • Факты, мнение и практические шаги</p>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto space-y-8 text-sm leading-relaxed">

        {/* TL;DR */}
        <section className="bg-graphite-900 border border-terminal-cyan/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-terminal-cyan">TL;DR</h2>
          <ul className="space-y-2 text-terminal-text">
            <li>• <strong>Спот-цена</strong>: <span className="text-terminal-cyan">$110 030</span>, <span className="text-terminal-red">-2.44%</span> за 24ч; рынок продолжает корректироваться от локального максимума $113.6k. Диапазон: $107 925–$113 643.</li>
            <li>• <strong>Объём</strong>: 26 722 BTC (~$2.96B) — стабильная активность, но приоритет перешёл к продавцам.</li>
            <li>• <strong>Сентимент</strong>: Crypto Fear & Greed = <span className="text-yellow-300">36 (Fear)</span> — устойчивое осторожное настроение. <a href="https://alternative.me/crypto/" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline">[Alternative.me]</a></li>
            <li>• <strong>Polymarket</strong>: наиболее вероятный таргет 2025 — <span className="text-terminal-green">≥$130k (~52%)</span>, <span className="text-terminal-green">≥$150k (~15%)</span>; вероятность выше $150k снизилась на фоне коррекции. <a href="https://polymarket.com/event/what-price-will-bitcoin-hit-in-2025" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline">[Polymarket]</a></li>
            <li>• <strong>Микроструктура</strong> (Binance BTCUSDT): спред $0.01 (0.91 мбпс), дисбаланс <span className="text-terminal-red">0.02 (доминирование продавцов)</span>, CVD <span className="text-terminal-red">-57.22</span>, health <span className="text-terminal-green">87.5/100 (Excellent)</span> — ликвидность высокая, безопасно для лимитных ордеров.</li>
          </ul>
        </section>

        {/* Рыночная сводка */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            1. Рыночная сводка (SSE / Binance)
          </h2>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
            <table className="w-full text-terminal-text text-sm">
              <tbody className="space-y-2">
                <tr><td className="py-1"><strong>Цена (LTP)</strong></td><td className="py-1 text-right"><span className="text-terminal-cyan">$110 030.29</span></td></tr>
                <tr><td className="py-1"><strong>Изменение 24ч</strong></td><td className="py-1 text-right"><span className="text-terminal-red">−2.44 %</span></td></tr>
                <tr><td className="py-1"><strong>Дневной диапазон</strong></td><td className="py-1 text-right">$107 925 – $113 643</td></tr>
                <tr><td className="py-1"><strong>Средневзвешенная (24ч)</strong></td><td className="py-1 text-right">$110 810</td></tr>
                <tr><td className="py-1"><strong>Объём 24ч</strong></td><td className="py-1 text-right">26 722 BTC (~$2.96B)</td></tr>
                <tr><td className="py-1"><strong>Дата отчёта</strong></td><td className="py-1 text-right text-terminal-muted">2025-10-30 11:03:07 UTC</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-yellow-300 mt-3 text-sm">🟡 Рынок продолжает корректироваться от локального максимума $113.6k; объёмы стабильные, но приоритет перешёл к продавцам.</p>
        </section>

        {/* Микроструктура */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            2. Микроструктура (стакан, потоки, баланс)
          </h2>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
            <table className="w-full text-terminal-text text-sm">
              <tbody>
                <tr><td className="py-1"><strong>Bid</strong></td><td className="py-1 text-right">$110 027.93 (0.0577 BTC)</td></tr>
                <tr><td className="py-1"><strong>Ask</strong></td><td className="py-1 text-right">$110 027.94 (8.8145 BTC)</td></tr>
                <tr><td className="py-1"><strong>Спред</strong></td><td className="py-1 text-right"><span className="text-terminal-green">$0.01 (0.91 мбпс) ✅ плотный</span></td></tr>
                <tr><td className="py-1"><strong>Imbalance (Top-20)</strong></td><td className="py-1 text-right"><span className="text-terminal-red">0.02 🔴 доминирование продавцов</span></td></tr>
                <tr><td className="py-1"><strong>CVD (дельта)</strong></td><td className="py-1 text-right"><span className="text-terminal-red">-57.22</span></td></tr>
                <tr><td className="py-1"><strong>Flow rate</strong></td><td className="py-1 text-right">Bid 6.68 / Ask 7.57 орд/с</td></tr>
                <tr><td className="py-1"><strong>Net flow</strong></td><td className="py-1 text-right"><span className="text-terminal-red">-0.88 орд/с → слабое давление продаж</span></td></tr>
                <tr><td className="py-1"><strong>Health-score</strong></td><td className="py-1 text-right"><span className="text-terminal-green">🟢 87.5/100 (Excellent)</span></td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-terminal-cyan mt-3 text-sm italic">💬 Микроструктура здорова, ликвидность высокая, но ордер-флоу перешёл в зону лёгкого sell-pressure. Торговля безопасна лимитами; вход «по рынку» может дать небольшой проскальзывающий эффект.</p>
        </section>

        {/* Профиль объёма */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            3. Профиль объёма и ликвидность (6-часовое окно)
          </h2>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
            <table className="w-full text-terminal-text text-sm">
              <tbody>
                <tr><td className="py-1"><strong>POC (точка контроля)</strong></td><td className="py-1 text-right text-terminal-cyan">$110 180</td></tr>
                <tr><td className="py-1"><strong>VAH / VAL</strong></td><td className="py-1 text-right">$111 227 / $109 546</td></tr>
                <tr><td className="py-1"><strong>Общий объём (6ч)</strong></td><td className="py-1 text-right">5 374 BTC</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-terminal-muted mt-3 text-sm">📈 Структура сбалансированная, POC близко к текущей цене → консолидация. Основной интерес покупателей в зоне $109.5–110.2k.</p>
        </section>

        {/* Новости и макрофон */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            4. Новости и макрофон (30 окт)
          </h2>
          <div className="space-y-3 text-terminal-muted">
            <p className="font-semibold text-terminal-text">Факты:</p>
            <ul className="space-y-2 ml-6">
              <li>• Рынок остывает после импульса выше $113k; за сутки −2.4%</li>
              <li>• Активность в спот-ETF (IBIT, FBTC) остаётся положительной, но темпы притока снижаются</li>
              <li>• <strong className="text-yellow-300">Crypto Fear & Greed Index: ~36 (Fear)</strong> — устойчивое осторожное настроение</li>
              <li>• Участники ждут макроданных США (PCE, инфляция) и риторики ФРС</li>
              <li>• На фондовых рынках — консолидация; корреляция BTC-NASDAQ сохраняется</li>
            </ul>
            <p className="text-terminal-cyan italic mt-3">Мнение: коррекция техническая, пока без панических сигналов. Долгосрочный фон остаётся бычьим при сохранении ETF-притоков.</p>
          </div>
        </section>

        {/* Polymarket */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            5. Polymarket (прогнозные вероятности)
          </h2>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
            <table className="w-full text-terminal-text text-sm">
              <tbody>
                <tr><td className="py-1"><strong>BTC ≥ $130 000 в 2025</strong></td><td className="py-1 text-right text-terminal-green">~52 %</td></tr>
                <tr><td className="py-1"><strong>BTC ≥ $150 000 в 2025</strong></td><td className="py-1 text-right text-terminal-green">~15 %</td></tr>
                <tr><td className="py-1"><strong>BTC ≥ $200 000 в 2025</strong></td><td className="py-1 text-right">{'<'} 5 %</td></tr>
                <tr><td className="py-1"><strong>Объём ставок</strong></td><td className="py-1 text-right">≈ $38 M</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-terminal-muted mt-3 text-sm">📊 Рынок прогнозов сохраняет умеренный оптимизм, но вероятность роста выше $150k снизилась на фоне коррекции.</p>
        </section>

        {/* Тактическая оценка */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            6. Тактическая оценка
          </h2>
          <div className="space-y-4 text-terminal-muted">
            <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
              <table className="w-full text-terminal-text text-sm">
                <tbody>
                  <tr><td className="py-1"><strong>Тренд (H4)</strong></td><td className="py-1 text-right">Коррекция в рамках диапазона</td></tr>
                  <tr><td className="py-1"><strong>Momentum</strong></td><td className="py-1 text-right text-yellow-300">Слабый, нейтрально-медвежий</td></tr>
                  <tr><td className="py-1"><strong>Сентимент</strong></td><td className="py-1 text-right text-yellow-300">Осторожный</td></tr>
                  <tr><td className="py-1"><strong>Ликвидность</strong></td><td className="py-1 text-right text-terminal-green">Высокая</td></tr>
                  <tr><td className="py-1"><strong>Микроструктура</strong></td><td className="py-1 text-right text-yellow-300">Здорова, но давление продавцов</td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <p className="text-terminal-cyan font-semibold mb-2">🎯 Рабочие сценарии:</p>
              <ol className="space-y-3 ml-6">
                <li><strong className="text-terminal-text">1. Базовый диапазон: $108k–$113k</strong> → сделки от границ, частичная фиксация</li>
                <li><strong className="text-terminal-text">2. Бычий сценарий:</strong> закрепление {'>'}$111.5k → цель $113–114k</li>
                <li><strong className="text-terminal-text">3. Медвежий сценарий:</strong> пробой {'<'}$108k → снижение к $105k</li>
              </ol>
            </div>
            <p className="text-terminal-cyan italic mt-3">📌 Тактика: использовать лимитные ордера, избегать входов на тонких объёмах, отслеживать ETF-потоки и CVD.</p>
          </div>
        </section>

        {/* Риск-менеджмент */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            7. Риск-менеджмент (практика)
          </h2>
          <ul className="space-y-2 text-terminal-muted ml-6">
            <li>• <strong className="text-terminal-text">Риск на сделку ≤0.5–1.0% капитала</strong>; R:R ≥1:2</li>
            <li>• <strong className="text-terminal-text">Инструмент</strong>: лимитные ордера (тонкий спред), избегать маркет-входов в моменты выхода новостей (slippage)</li>
            <li>• <strong className="text-terminal-text">Хедж/варианты</strong>: короткие perp-хеджи на прорывах, календарные колл-спрэды к событиям (ФРС/ETF-отчёты) — ограниченный риск</li>
            <li>• <strong className="text-terminal-text">Календарь</strong>: отслеживать даты ФРС/инфляции/заявления по ETF (притоки/оттоки)</li>
          </ul>
        </section>

        {/* Мониторинг */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            8. Что мониторить ежедневно (чек-лист)
          </h2>
          <ol className="space-y-2 text-terminal-muted ml-6">
            <li>1. <strong className="text-terminal-text">Спот-потоки ETF</strong> (IBIT, FBTC и др.) — притоки/оттоки и дневные объёмы</li>
            <li>2. <strong className="text-terminal-text">FGI</strong> (динамика дня-к-дню) — смена режима страха/жадности</li>
            <li>3. <strong className="text-terminal-text">Polymarket</strong> — сдвиг вероятностей по бинам ≥$130k/≥$150k (признак изменения коллективного ожидания)</li>
            <li>4. <strong className="text-terminal-text">Лента/стакан</strong> — дисбаланс и CVD на 1–5-мин окне (сигналы ускорения)</li>
            <li>5. <strong className="text-terminal-text">Макро-календарь</strong> (риск-ивенты) — решения ФРС, инфляция США, заголовки по США–Китай</li>
          </ol>
        </section>

        {/* Итог */}
        <section className="bg-graphite-900 border border-graphite-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-terminal-cyan">Итог для трейдера</h2>
          <div className="space-y-3 text-terminal-muted">
            <p>• BTC удерживается в <strong className="text-yellow-300">коррекционном боковике</strong>, при этом структура рынка остаётся <strong className="text-terminal-green">здоровой и ликвидной</strong>.</p>
            <p>• Доминирование продавцов краткосрочно, но фундаментальные риски ограничены.</p>
            <p>• Для <strong className="text-terminal-text">розничного трейдера</strong> рационально:</p>
            <ul className="ml-6 space-y-1 text-sm">
              <li>→ работать внутри диапазона $108–113k</li>
              <li>→ рисковать ≤ 1 % на сделку</li>
              <li>→ фиксировать частями при +1.5–2 %</li>
              <li>→ следить за изменением CVD и дисбаланса стакана ({'>'} 3 — сигнал разворота)</li>
            </ul>
          </div>
        </section>

      </article>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto mt-16 pt-8 border-t border-graphite-800 text-xs text-terminal-muted">
        <p>Отчёт сгенерирован: 30 окт 2025 11:03 UTC</p>
        <p className="mt-2">Источник данных: SSE (Binance BTCUSDT), Polymarket, Alternative.me (FGI), CoinGecko</p>
        <p className="mt-2">Этот отчёт объединяет факты (с источниками), мнение и допущения. Не является финансовым советом.</p>
        <p className="mt-4">
          <Link to="/" className="text-terminal-cyan hover:underline">← Назад на Context8</Link>
        </p>
      </footer>
    </div>
  )
}
