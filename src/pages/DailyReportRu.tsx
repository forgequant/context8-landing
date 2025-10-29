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
          <span className="text-sm text-terminal-muted">29 окт 2025</span>
        </div>
        <p className="text-terminal-muted">Комплексный анализ рынка • Факты, мнение и практические шаги</p>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto space-y-8 text-sm leading-relaxed">

        {/* TL;DR */}
        <section className="bg-graphite-900 border border-terminal-cyan/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-terminal-cyan">TL;DR</h2>
          <ul className="space-y-2 text-terminal-text">
            <li>• <strong>Спот-цена</strong>: ~$113–114k, дневная волатильность умеренная; рынок ждёт макро-триггеры (ФРС, новости по США–Китай). <a href="https://www.barrons.com/articles/bitcoin-price-ethereum-crypto-today-813f945c" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline">[barrons.com]</a></li>
            <li>• <strong>Новости/потоки</strong>: после пика ~$125k в начале октября интерес к спот-ETF остаётся высоким (IBIT в топе по притокам в октябре). <a href="https://www.tomshardware.com/tech-industry/cryptocurrency/bitcoin-rockets-to-all-time-high-of-over-usd125-000-rise-fueled-by-increase-in-u-s-equities-and-interest-in-bitcoin-etfs" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline">[Tom's Hardware]</a></li>
            <li>• <strong>Сентимент</strong>: Crypto Fear & Greed = <span className="text-yellow-300">37 (Fear)</span> — осторожный рынок. <a href="https://alternative.me/crypto/" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline">[Alternative.me]</a></li>
            <li>• <strong>Polymarket</strong>: наиболее вероятный таргет 2025 — <span className="text-terminal-green">≥$130k (~52%)</span>, <span className="text-terminal-green">≥$150k (~15%)</span>; распределение ставок миллионное. <a href="https://polymarket.com/event/what-price-will-bitcoin-hit-in-2025" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline">[Polymarket]</a></li>
            <li>• <strong>Микроструктура</strong> (Binance BTCUSDT, real-time): спред ~$0.01 (0.88 мбпс), дисбаланс bid/ask ≈1.76 в пользу покупателей; общий «здоровье» <span className="text-yellow-300">55.9/100 (Fair)</span> — торговать лимитами.</li>
          </ul>
        </section>

        {/* Рынок и цена */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            1. Рынок и цена (факты)
          </h2>
          <div className="space-y-3 text-terminal-muted">
            <p>• <strong className="text-terminal-text">Текущий диапазон</strong>: ~$112–116k; публикации за сегодня фиксируют ~<strong className="text-terminal-cyan">$113k</strong>. Движение связано с ожиданиями по ставке ФРС и новостями по США–Китай.</p>
            <p>• <strong className="text-terminal-text">ATH 2025</strong>: в начале октября BTC обновлял максимум <strong className="text-terminal-cyan">~$125–126k</strong> на фоне притоков в спот-ETF.</p>
            <p>• <strong className="text-terminal-text">Фон ETF</strong>: в октябре IBIT (BlackRock) несколько раз лидировал по дневным/недельным притокам; совокупные притоки в спот-ETF за октябрь — миллиарды USD.</p>
            <p>• <strong className="text-terminal-text">Рынок страха/жадности</strong>: <strong className="text-yellow-300">FGI=37 (Fear)</strong> — после коррекции настроение умеренно-негативное, без паники.</p>
          </div>
        </section>

        {/* Новости */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            2. Новости кратко (факты)
          </h2>
          <div className="space-y-3 text-terminal-muted">
            <p>• <strong className="text-terminal-text">Сегодня</strong>: откат основных криптоактивов, BTC ~−1% за сутки; триггеры — макроожидания (ФРС, геоэкономика США–Китай).</p>
            <p>• <strong className="text-terminal-text">Октябрь</strong>: волна притоков в спот-ETF (IBIT лидирует), на пике поддерживала рывок к ~125k.</p>
            <p>• <strong className="text-terminal-text">Регуляторика</strong>: SEC допустила in-kind процедуры для крипто-ETP (структурно положительно для эффективности фондов).</p>
          </div>
        </section>

        {/* Polymarket */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            3. Polymarket — рыночные вероятности (факты)
          </h2>
          <div className="space-y-3 text-terminal-muted">
            <p>Актуальный крупный рынок: <strong className="text-terminal-cyan">"What price will Bitcoin hit in 2025?"</strong></p>
            <p>Срез вероятностей по «ступеням» (площадка использует <strong>Binance BTCUSDT</strong> как источник для резолва):</p>
            <ul className="space-y-2 ml-6">
              <li>• <strong className="text-terminal-green">≥$130k</strong>: ~<strong>52%</strong></li>
              <li>• <strong className="text-terminal-green">≥$150k</strong>: ~<strong>15%</strong></li>
              <li>• Более «далёкие» бины (≥$170k, ≥$200k): однозначно ниже 10%</li>
              <li>• Общий торговый объём рынка: <strong>$38М+</strong></li>
            </ul>
            <p className="text-yellow-300 italic">Мнение: Полезно как «квотирование» консенсуса, но это условная вероятность, чувствительная к переоценке хайпа/новостей и ликвидности конкретного рынка.</p>
          </div>
        </section>

        {/* Сентимент */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            4. Сентимент и позиционирование (факты → вывод)
          </h2>
          <div className="space-y-3 text-terminal-muted">
            <p>• <strong className="text-yellow-300">FGI=37</strong> указывает на «пугливые покупки» и склонность рынка к <strong>реакциям на новости</strong>, а не к устойчивому тренду.</p>
            <p>• <strong className="text-terminal-text">ETF-потоки</strong> остаются нетривиальным драйвером спота и вторичного спроса (эффект «медленного насоса» при устойчивых притоках).</p>
            <p className="text-terminal-cyan italic mt-4">Моё мнение: базовый сценарий — диапазонная торговля $110–118k с уклоном вверх при положительных макро-сюрпризах/притоках в ETF; прорыв выше $118–120k при объёмах откроет дорогу к ретесту $125k.</p>
          </div>
        </section>

        {/* Микроструктура */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            5. Микроструктура BTCUSDT (Binance) — «сейчас»
          </h2>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4 space-y-3 text-terminal-muted">
            <p className="text-terminal-cyan font-semibold">Ключевые метрики (в момент генерации отчёта):</p>
            <ul className="space-y-2 ml-6">
              <li>• <strong>LTP</strong>: <span className="text-terminal-cyan">$113 459.08</span>, 24ч: <span className="text-terminal-red">−1.234%</span>, High/Low: $116 086 / $112 100, 24ч объём: 15 854 BTC</li>
              <li>• <strong>Спред</strong>: <span className="text-terminal-green">$0.01 (0.88 мбпс)</span> — очень плотный</li>
              <li>• <strong>Дисбаланс стакана</strong> (Top-20): <span className="text-terminal-green">1.757</span> — перекос в сторону бидов (buy pressure)</li>
              <li>• <strong>Поток заявок</strong> (60s): bid 8.17 vs ask 6.63 орд/с; Net Flow +1.53 орд/с</li>
              <li>• <strong>CVD</strong> (краткосрок): <span className="text-terminal-green">+33.7</span> — накопление</li>
              <li>• <strong>Health-score</strong>: <span className="text-yellow-300">55.9/100 (Fair)</span>; рекомендации движка: лимитные ордера, тесно следить за лентой</li>
              <li>• <strong>Аномалии</strong>: не обнаружены</li>
            </ul>
            <p className="text-terminal-cyan italic mt-4">Вывод (моё мнение): краткосрочно перевес покупателей при умеренной глубине. Хорош для скальпа в диапазоне; для импульса вверх нужен всплеск объёма через верхнюю треть дня.</p>
          </div>
        </section>

        {/* Уровни/сценарии */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            6. Уровни/сценарии (рабочие для розничного трейдера)
          </h2>
          <div className="space-y-4 text-terminal-muted">
            <div>
              <p className="text-terminal-cyan font-semibold mb-2">Уровни (spot, округлённо):</p>
              <ul className="space-y-2 ml-6">
                <li>• <strong>Поддержки</strong>: $112.1k (дневной минимум), $110k (круглый/сентимент), $108–109k (плотности по агрегаторам за октябрь)</li>
                <li>• <strong>Сопротивления</strong>: $116k (сегодняшняя верхняя граница), $118–120k (ключ к импульсу), $125–126k (ATH/зона продаж)</li>
              </ul>
            </div>
            <div>
              <p className="text-terminal-cyan font-semibold mb-2">Сценарии:</p>
              <ol className="space-y-3 ml-6">
                <li><strong className="text-terminal-text">1. Рейндж $110–118k</strong> (база, 40–60% вероятности по новостному фону). Тактика: отбой от границ/середины, take-profit частями, защита за экстремумом.</li>
                <li><strong className="text-terminal-text">2. Прорыв вверх {'>'}$120k</strong> на объёме/новостях → быстрый тест $123–125k; зафиксировать часть и переводить стоп.</li>
                <li><strong className="text-terminal-text">3. Пробой вниз {'<'}$110k</strong> при негативном макро/ликвидациях → ускорение к $106–108k (зона спроса прошлого месяца).</li>
              </ol>
            </div>
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
          <h2 className="text-xl font-semibold mb-4 text-terminal-cyan">Итог (моё мнение)</h2>
          <div className="space-y-3 text-terminal-muted">
            <p>• Пока <strong className="text-terminal-green">нейтрально-бычий боковик</strong>: без новых притоков/макро-катализаторов рынок склонен «пилить».</p>
            <p>• Для <strong className="text-terminal-text">розничного трейдера</strong> сейчас рациональны: рейндж-стратегии, частичная фиксация профита, дисциплина стопов, следование за ETF-потоками и microstructure-сигналами (дисбаланс, всплески объёма).</p>
            <p>• <strong className="text-terminal-cyan">Допущение</strong>: если ФРС/новости по США–Китай без «негатива» и притоки в ETF сохранятся, окно для ретеста $118–125k в ближайшие недели остаётся открытым; негатив по ставкам/политике — риск теста $108–110k.</p>
          </div>
        </section>

      </article>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto mt-16 pt-8 border-t border-graphite-800 text-xs text-terminal-muted">
        <p>Отчёт сгенерирован: 29 окт 2025 • Часовой пояс: Asia/Singapore</p>
        <p className="mt-2">Этот отчёт объединяет факты (с источниками), мнение и допущения. Не является финансовым советом.</p>
        <p className="mt-4">
          <Link to="/" className="text-terminal-cyan hover:underline">← Назад на Context8</Link>
        </p>
      </footer>
    </div>
  )
}
