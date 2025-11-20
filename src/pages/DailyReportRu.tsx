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
          <span className="text-sm text-terminal-muted">20 ноя 2025 09:30 UTC</span>
        </div>
        <p className="text-terminal-muted">Комплексный анализ рынка • Факты, мнение и практические шаги</p>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto space-y-8 text-sm leading-relaxed">

        {/* TL;DR */}
        <section className="bg-graphite-900 border border-terminal-cyan/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-terminal-cyan">TL;DR</h2>
          <ul className="space-y-2 text-terminal-text">
            <li>• <strong>Цена</strong>: BTC <span className="text-terminal-red">ниже $90k</span> после октябрьского ATH ≈ $126k, потеряв ~30% от пика и стерев прибыль 2025 года.</li>
            <li>• <strong>Капитализация</strong>: За ~6 недель крипторынок потерял <span className="text-terminal-red">&gt; $1 трлн</span>.</li>
            <li>• <strong>Технический анализ</strong>: Зафиксирован <span className="text-terminal-red">«death cross»</span> (50/200 MA) — одна из глубочайших коррекций с 2017 года.</li>
            <li>• <strong>LunarCrush сентимент</strong>: Galaxy Score ≈ 67 (умеренно бычий), Sentiment 76% позитив, Mentions ~289k (↑1.8x), Social Dominance 30% (при среднем 17%).</li>
            <li>• <strong>Polymarket</strong>: ≈62% на закрытие 2025 <span className="text-terminal-red">ниже $90k</span> — консенсус смещён к затяжной коррекции.</li>
          </ul>
        </section>

        {/* 1. Что говорит рынок */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            1. Что сейчас говорит рынок (цена + макро-сентимент)
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-terminal-cyan mb-2">Факты</h3>
              <ul className="space-y-2 text-terminal-muted ml-4">
                <li>• BTC после октябрьского ATH ≈ <span className="text-terminal-text">$126k</span> ушёл ниже <span className="text-terminal-red">$90k</span>, потеряв почти <span className="text-terminal-red">30%</span> от пика и стерев прибыль 2025 года. <span className="text-xs">[Reuters, Moneycontrol]</span></li>
                <li>• Падение BTC за ~6 недель срезало с крипторынка <span className="text-terminal-red">&gt; $1 трлн</span> капитализации. <span className="text-xs">[Coinlive, Tom's Hardware]</span></li>
                <li>• В новостях отмечают <span className="text-terminal-red">«death cross»</span> (пересечение 50/200 MA сверху вниз) и одну из самых глубоких коррекций с 2017 года. <span className="text-xs">[CoinDesk]</span></li>
              </ul>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded p-4">
              <h3 className="text-base font-semibold text-yellow-300 mb-2">💭 Моё мнение</h3>
              <p className="text-terminal-muted">
                С точки зрения классики циклов: мы уже не «локальный откат», а полноценная фаза перезагрузки плечей и ожиданий — сила тренда вниз сейчас больше, чем у среднего «здорового» отката.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Соцсети и сентимент */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            2. Соцсети и сентимент (LunarCrush)
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-terminal-cyan mb-3">Факты по данным LunarCrush (MCP)</h3>
              <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
                <table className="w-full text-terminal-text text-sm">
                  <tbody>
                    <tr><td className="py-1"><strong>Galaxy Score™</strong></td><td className="py-1 text-right"><span className="text-terminal-green">≈ 67</span> при среднем ~60 → умеренно бычья комбинация</td></tr>
                    <tr><td className="py-1"><strong>Sentiment</strong></td><td className="py-1 text-right"><span className="text-terminal-green">≈ 76%</span> позитивных упоминаний (средний ~79%)</td></tr>
                    <tr><td className="py-1"><strong>Mentions</strong></td><td className="py-1 text-right"><span className="text-terminal-cyan">≈ 289k</span> за 24h при среднем ~160k → рост <span className="text-terminal-green">~1.8x</span></td></tr>
                    <tr><td className="py-1"><strong>Creators</strong></td><td className="py-1 text-right">≈ 101k уникальных авторов за сутки</td></tr>
                    <tr><td className="py-1"><strong>Social Dominance</strong></td><td className="py-1 text-right"><span className="text-terminal-cyan">≈ 30%</span> при среднем ~17% → BTC доминирует инфополе</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded p-4">
              <h3 className="text-base font-semibold text-yellow-300 mb-2">💭 Моё мнение</h3>
              <div className="space-y-2 text-terminal-muted text-sm">
                <p>
                  <strong className="text-terminal-text">По цене</strong> — жёсткий «risk-off» и перезагрузка плечей.
                </p>
                <p>
                  <strong className="text-terminal-text">По соцсетям</strong> — не капитуляция, а истеричный интерес: рекордная активность, но sentiment только слегка сполз с «эйфории» к «осторожному бычьему».
                </p>
                <p>
                  Это типичная картинка: <span className="text-terminal-red">паника в цене при живом интересе к нарративу</span> → хороший фон для среднесрочных контртрендовых идей, но не гарантия мгновенного разворота.
                </p>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-700/30 rounded p-4">
              <h3 className="text-base font-semibold text-blue-300 mb-2">🔮 Предположение</h3>
              <p className="text-terminal-muted text-sm">
                Если соц-активность останется высокой, а цена ещё какое-то время постоит/прольётся ниже, мы увидим фазу <span className="text-terminal-cyan">«аккумуляции под негативный инфошум»</span> — классический фундамент для следующей ноги вверх.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Деривативы, ETF и левередж */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            3. Деривативы, ETF и левередж (через новости)
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-terminal-cyan mb-2">Факты</h3>
              <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
                <ul className="space-y-2 text-terminal-muted text-sm">
                  <li>• СМИ фиксируют сильное падение BTC на фоне:</li>
                  <li className="ml-4">— снижения inflows в спотовые ETF и разворота в оттоки</li>
                  <li className="ml-4">— <span className="text-terminal-red">«death cross»</span> на дневках</li>
                  <li className="ml-4">— ужесточения ожиданий по ставкам ФРС и общего «risk-off» в акциях/AI-секторе</li>
                  <li className="text-xs">→ [CoinDesk, The Guardian]</li>
                  <li className="mt-2">• Отмечаются <span className="text-terminal-red">миллиардные ликвидации плеча</span> и одна из самых глубоких 43-дневных просадок BTC с 2017 года. <span className="text-xs">[Tom's Hardware]</span></li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded p-4">
              <h3 className="text-base font-semibold text-yellow-300 mb-2">💭 Моё мнение</h3>
              <div className="space-y-2 text-terminal-muted text-sm">
                <p>
                  Это не «спекулянты ушли из рынка», а наоборот — <span className="text-terminal-text">слишком много плеча + ETF-потоки + макро одновременно ударили в одну сторону</span>.
                </p>
                <p>
                  Пока ETF-оттоки не развернутся и кривая фандинга/перпетов не нормализуется, любой отскок вверх — <span className="text-terminal-red">скорее шорт-квизы, чем устойчивый тренд</span>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Polymarket */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            4. Polymarket: как толпа оценивает сценарии по BTC
          </h2>

          <div className="space-y-4">
            <p className="text-terminal-muted italic text-sm">
              Собираем картину только из зафиксированных чисел (не додумывая между точками).
            </p>

            {/* 4.1 Долгосрочный 2025 */}
            <div>
              <h3 className="text-base font-semibold text-terminal-cyan mb-3">4.1. Долгосрочный 2025</h3>
              <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-terminal-text font-semibold mb-2">Факт (март 2025):</p>
                    <p className="text-terminal-muted mb-2">Рынок Polymarket по ценам BTC в 2025 году оценивал: <span className="text-xs">[Bitget]</span></p>
                    <table className="w-full text-terminal-muted text-sm ml-4">
                      <tbody>
                        <tr><td className="py-1">≥ $120k в 2025</td><td className="py-1 text-right"><span className="text-terminal-green">≈ 51%</span></td></tr>
                        <tr><td className="py-1">≥ $130k</td><td className="py-1 text-right"><span className="text-terminal-green">≈ 40%</span></td></tr>
                        <tr><td className="py-1">≥ $150k</td><td className="py-1 text-right"><span className="text-terminal-cyan">≈ 27%</span></td></tr>
                        <tr><td className="py-1">≥ $200k</td><td className="py-1 text-right">≈ 17%</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <p className="text-terminal-text font-semibold mb-2">Факт (середина лета):</p>
                    <p className="text-terminal-muted mb-2">Отдельный рынок Polymarket давал: <span className="text-xs">[CryptoSlate]</span></p>
                    <table className="w-full text-terminal-muted text-sm ml-4">
                      <tbody>
                        <tr><td className="py-1">BTC &gt; $120k в 2025</td><td className="py-1 text-right"><span className="text-terminal-green">~75%</span></td></tr>
                        <tr><td className="py-1">&gt; $130k</td><td className="py-1 text-right"><span className="text-terminal-green">55%</span></td></tr>
                        <tr><td className="py-1">&gt; $150k</td><td className="py-1 text-right">33%</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded p-4 mt-3">
                <p className="text-yellow-300 font-semibold text-sm mb-1">💭 Моё мнение</p>
                <p className="text-terminal-muted text-sm">
                  Весна–лето 2025: рынок ставок был явно в режиме <span className="text-terminal-cyan">«extended bull»</span> — высокий консенсус на продолжение роста, при том что эти уровни позже действительно были достигнуты.
                </p>
              </div>
            </div>

            {/* 4.2 Актуальные ставки */}
            <div>
              <h3 className="text-base font-semibold text-terminal-cyan mb-3">4.2. Актуальные ставки (конец 2025)</h3>
              <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-terminal-text font-semibold mb-2">Факт (сейчас):</p>
                    <p className="text-terminal-muted">
                      Polymarket-рынки дают <span className="text-terminal-red">≈62% шанс</span>, что BTC закончит 2025 год <span className="text-terminal-red">ниже $90k</span>. <span className="text-xs">[KuCoin]</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-terminal-text font-semibold mb-2">Факт (весна 2025):</p>
                    <p className="text-terminal-muted">
                      Polymarket давал &lt;&lt;10% на $200k к концу марта и наибольший вес сценариям ≤ $75k, то есть без сверхбычьего продолжения прямо тогда. <span className="text-xs">[reubenabati.com.ng]</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded p-4 mt-3">
                <p className="text-yellow-300 font-semibold text-sm mb-1">💭 Моё мнение</p>
                <p className="text-terminal-muted text-sm">
                  Ставки Polymarket сейчас смещены в сторону <span className="text-terminal-red">затяжной коррекции</span> (закрытие года &lt; $90k), но не отменяют сценарии нового ATH позже.
                </p>
                <p className="text-terminal-muted text-sm mt-2">
                  Хорошо видно переоценку ожиданий: от весеннего «120–150k+ почти неизбежно» до текущего «скорее флет/снижение вокруг 90k».
                </p>
              </div>

              <div className="bg-blue-900/20 border border-blue-700/30 rounded p-4 mt-3">
                <p className="text-blue-300 font-semibold text-sm mb-1">🔮 Предположение</p>
                <p className="text-terminal-muted text-sm">
                  Если к концу года BTC удержится выше 90k, мы можем увидеть резкий перезаход денег в Polymarket-рынки с пересборкой вероятностей под новый бычий сценарий — <span className="text-terminal-cyan">материал для отдельного трейда «против текущего консенсуса»</span>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="bg-graphite-900 border border-graphite-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-terminal-cyan">Сводка</h2>
          <ul className="space-y-2 text-terminal-muted text-sm">
            <li>• <strong className="text-terminal-text">Цена</strong>: BTC потерял ~30% от ATH ($126k → &lt;$90k), рынок стер &gt;$1 трлн капы.</li>
            <li>• <strong className="text-terminal-text">Техника</strong>: Death cross зафиксирован, глубочайшая коррекция с 2017.</li>
            <li>• <strong className="text-terminal-text">Социалка</strong>: Рекордная активность (289k mentions, 1.8x от среднего), но sentiment умеренно позитивный (76%) — паника в цене при живом интересе.</li>
            <li>• <strong className="text-terminal-text">Деривативы</strong>: Миллиардные ликвидации плеча, ETF-оттоки, макро risk-off. Отскоки вверх — скорее шорт-квизы.</li>
            <li>• <strong className="text-terminal-text">Polymarket</strong>: Консенсус развернулся — 62% на закрытие года &lt;$90k (против весеннего «75% на &gt;$120k»).</li>
            <li>• <strong className="text-terminal-text">Вывод</strong>: Не локальный откат, а полноценная фаза перезагрузки. Высокая соц-активность при падении цены — классический сетап для аккумуляции перед следующей ногой вверх, но разворот не гарантирован в ближайшие недели.</li>
          </ul>
        </section>

      </article>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto mt-16 pt-8 border-t border-graphite-800 text-xs text-terminal-muted">
        <p>Отчёт сгенерирован: 20 ноя 2025 09:30 UTC</p>
        <p className="mt-2">Источник данных: Reuters, Moneycontrol, Coinlive, Tom's Hardware, CoinDesk, The Guardian, LunarCrush (MCP), Polymarket, Bitget, CryptoSlate, KuCoin</p>
        <p className="mt-2">Этот отчёт объединяет факты (с источниками), качественный анализ и оценку сентимента. Не является финансовым советом.</p>
        <p className="mt-4">
          <Link to="/" className="text-terminal-cyan hover:underline">← Назад на Context8</Link>
        </p>
      </footer>
    </div>
  )
}
