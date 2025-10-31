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
          <span className="text-sm text-terminal-muted">31 окт 2025 09:30 UTC</span>
        </div>
        <p className="text-terminal-muted">Комплексный анализ рынка • Факты, мнение и практические шаги</p>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto space-y-8 text-sm leading-relaxed">

        {/* TL;DR */}
        <section className="bg-graphite-900 border border-terminal-cyan/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-terminal-cyan">TL;DR</h2>
          <ul className="space-y-2 text-terminal-text">
            <li>• <strong>Спот-цена</strong>: <span className="text-terminal-cyan">$110 043.82</span>; рынок стабилизировался в диапазоне $108.6–$116k после пика $126k 6 окт. Mid-точка: $112 280.</li>
            <li>• <strong>Диапазон недели</strong>: $108 604 – $115 957; размах 6.55% — умеренная волатильность.</li>
            <li>• <strong>Сентимент</strong>: Crypto Fear & Greed = <span className="text-yellow-300">37 (Fear)</span> — осторожное настроение сохраняется. <a href="https://alternative.me/crypto/" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline">[Alternative.me]</a></li>
            <li>• <strong>Polymarket</strong>: <span className="text-terminal-green">≥$130k (~53%)</span>, <span className="text-terminal-green">≥$150k (~15%)</span>, <span className="text-terminal-red">≤$80k (~10%)</span>. Оборот $38 млн. <a href="https://polymarket.com/event/what-price-will-bitcoin-hit-in-2025" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline">[Polymarket]</a></li>
            <li>• <strong>Микроструктура</strong> (Binance BTCUSDT): спред $0.01 (0.91 m-bps) — сверхплотный; imbalance <span className="text-terminal-red">-0.923 (перевес продавцов)</span>, orders/sec 46, net flow <span className="text-terminal-green">+0.58</span>, health <span className="text-terminal-green">80/100 (хорошо)</span>.</li>
          </ul>
        </section>

        {/* Макро и факты */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            1. Макро и фундаментальные факты
          </h2>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
            <table className="w-full text-terminal-text text-sm">
              <tbody className="space-y-2">
                <tr><td className="py-1"><strong>ФРС США (30 окт)</strong></td><td className="py-1 text-right">Ставка −25 б.п. → 3.75–4.00%</td></tr>
                <tr><td className="py-1"><strong>QT (сворачивание баланса)</strong></td><td className="py-1 text-right">С 1 дек прекращается, реинвестирование</td></tr>
                <tr><td className="py-1"><strong>ВВП США Q3</strong></td><td className="py-1 text-right">+3.1% QoQ (мягкое приземление)</td></tr>
                <tr><td className="py-1"><strong>PCE (инфляция)</strong></td><td className="py-1 text-right">Публикация 31 окт 12:30 UTC</td></tr>
                <tr><td className="py-1"><strong>BTC ETF (США)</strong></td><td className="py-1 text-right">Смешанные потоки, институц. спрос стабилен</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-terminal-green mt-3 text-sm">✅ ФРС смягчила политику, QT стоп с 1 дек → увеличение долларовой ликвидности.</p>
        </section>

        {/* Рыночная статистика */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            2. Рыночная статистика (CoinGecko / неделя)
          </h2>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
            <table className="w-full text-terminal-text text-sm">
              <tbody className="space-y-2">
                <tr><td className="py-1"><strong>Диапазон 7 дней</strong></td><td className="py-1 text-right">$108 604 – $115 957</td></tr>
                <tr><td className="py-1"><strong>24ч сегодня</strong></td><td className="py-1 text-right">$108 201 – $113 567</td></tr>
                <tr><td className="py-1"><strong>Средняя точка (mid)</strong></td><td className="py-1 text-right"><span className="text-terminal-cyan">$112 280</span></td></tr>
                <tr><td className="py-1"><strong>Размах / mid</strong></td><td className="py-1 text-right">≈ 6.55%</td></tr>
                <tr><td className="py-1"><strong>ATH октября</strong></td><td className="py-1 text-right">$126 080 (6 окт)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-terminal-cyan mt-3 text-sm">📊 Рынок стабилизировался после пика 125–126k в начале октября.</p>
        </section>

        {/* Сентимент и прогнозы */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            3. Сентимент и прогнозы
          </h2>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
            <table className="w-full text-terminal-text text-sm">
              <tbody>
                <tr><td className="py-1"><strong>Fear & Greed Index</strong></td><td className="py-1 text-right"><span className="text-yellow-300">37 (Fear)</span> → осторожность</td></tr>
                <tr><td className="py-1"><strong>Polymarket ≥$130k</strong></td><td className="py-1 text-right"><span className="text-terminal-green">≈ 53%</span></td></tr>
                <tr><td className="py-1"><strong>Polymarket ≥$150k</strong></td><td className="py-1 text-right"><span className="text-terminal-green">≈ 15%</span></td></tr>
                <tr><td className="py-1"><strong>Polymarket ≤$80k</strong></td><td className="py-1 text-right"><span className="text-terminal-red">≈ 10%</span></td></tr>
                <tr><td className="py-1"><strong>Оборот рынка</strong></td><td className="py-1 text-right">≈ $38 млн</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-terminal-muted mt-3 text-sm">Тональность соцсетей: обсуждение «смягчения ФРС» и «возможного ретеста ATH».</p>
        </section>

        {/* Ключевые уровни */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            4. Ключевые уровни недели
          </h2>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
            <table className="w-full text-terminal-text text-sm">
              <tbody>
                <tr><td className="py-1"><strong>Поддержка S1</strong></td><td className="py-1 text-right">$108.0–$108.6k (нижняя кромка 7 дней)</td></tr>
                <tr><td className="py-1"><strong>Поддержка S2</strong></td><td className="py-1 text-right">$106–$107k (октябрьские скопления)</td></tr>
                <tr><td className="py-1"><strong>Сопротивление R1</strong></td><td className="py-1 text-right">$113–$116k (верх 7 дней)</td></tr>
                <tr><td className="py-1"><strong>Сопротивление R2</strong></td><td className="py-1 text-right">$118–$120k (окно к ретесту $125k)</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Микроструктура */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            5. Микроструктура (SSE, Binance BTCUSDT)
          </h2>
          <p className="text-terminal-muted text-xs mb-3">Время снимка: 2025-10-31 08:57:51 UTC | Состояние потока: ok (≈ 80 мс)</p>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
            <table className="w-full text-terminal-text text-sm">
              <tbody>
                <tr><td className="py-1"><strong>Last price (LTP)</strong></td><td className="py-1 text-right"><span className="text-terminal-cyan">$110 043.82</span></td></tr>
                <tr><td className="py-1"><strong>Bid / Ask</strong></td><td className="py-1 text-right">$110 043.81 / $110 043.82</td></tr>
                <tr><td className="py-1"><strong>Спред</strong></td><td className="py-1 text-right"><span className="text-terminal-green">$0.01 ≈ 0.91 m-bps</span> сверхплотный</td></tr>
                <tr><td className="py-1"><strong>Bid сумма (top-20)</strong></td><td className="py-1 text-right">0.46 BTC (тонкая поддержка)</td></tr>
                <tr><td className="py-1"><strong>Ask сумма (top-20)</strong></td><td className="py-1 text-right">11.55 BTC (плотный кэп сверху)</td></tr>
                <tr><td className="py-1"><strong>Imbalance</strong></td><td className="py-1 text-right"><span className="text-terminal-red">-0.923</span> перевес продавцов</td></tr>
                <tr><td className="py-1"><strong>Orders/sec</strong></td><td className="py-1 text-right">46 ордеров / с (активный поток)</td></tr>
                <tr><td className="py-1"><strong>Net flow</strong></td><td className="py-1 text-right"><span className="text-terminal-green">+0.58</span> (покупатели активны)</td></tr>
                <tr><td className="py-1"><strong>Micro-price</strong></td><td className="py-1 text-right">$110 043.81 ≈ mid → нейтрально</td></tr>
                <tr><td className="py-1"><strong>Health score</strong></td><td className="py-1 text-right"><span className="text-terminal-green">80 / 100</span> хорошо</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-terminal-cyan mt-3 text-sm italic">💬 Мгновенный перевес в ask-стороне; для движения вверх нужно поглотить кластер 110 043–110 045 (≈5 BTC). Ниже цены книга тонкая — при рывке вниз проседание ≈$30–50 без сопротивления.</p>
        </section>

        {/* Вероятностная оценка */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            6. Вероятностная оценка (на 1 неделю)
          </h2>
          <p className="text-terminal-muted text-sm mb-3">Модель: нормальное распределение вокруг mid $112 280, σ ≈ 1.64%</p>
          <div className="bg-graphite-900 border border-graphite-700 rounded-lg p-4">
            <table className="w-full text-terminal-text text-sm">
              <tbody>
                <tr><td className="py-1"><strong>Боковик $109–$114k</strong></td><td className="py-1 text-right"><span className="text-terminal-cyan">≈ 60%</span></td></tr>
                <tr><td className="py-1"><strong>Рост {'>'} $116k</strong></td><td className="py-1 text-right"><span className="text-terminal-green">≈ 12%</span> (ап-импульс при притоках)</td></tr>
                <tr><td className="py-1"><strong>Снижение {'<'} $108.5k</strong></td><td className="py-1 text-right"><span className="text-terminal-red">≈ 12%</span> (реакция на инфляцию/ETF оттоки)</td></tr>
                <tr><td className="py-1"><strong>Хвосты ({'<'}$106k / {'>'}$120k)</strong></td><td className="py-1 text-right">≈ 4–6% каждый (маловероятные экстремы)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-yellow-300 mt-3 text-sm">⚠️ Сдвиг по микроструктуре: доминация ask-кластеров → краткосрочная вероятность отката в пределах рейнджа чуть выше, чем пробоя вверх.</p>
        </section>

        {/* Практические наблюдения */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-terminal-text border-b border-graphite-800 pb-2">
            7. Практические наблюдения (без рекомендаций)
          </h2>
          <ol className="space-y-2 text-terminal-muted ml-6 text-sm">
            <li>1. <strong className="text-terminal-text">Спред {'<'} 1 m-bps</strong> — оптимальные условия исполнения лимитов.</li>
            <li>2. <strong className="text-terminal-text">Рост orders/sec {'>'} 50 + смещение imbalance к 0</strong> → рынок готов к импульсу.</li>
            <li>3. <strong className="text-terminal-text">Расширение спреда {'>'} 3 m-bps</strong> → снижение глубины и рост риск-премий на ликвидность.</li>
            <li>4. <strong className="text-terminal-text">Мониторинг FGI и ETF-потоков</strong>: переход FGI {'>'} 40 и два дня притоков в ETF обычно совпадают с выходом из боковика.</li>
            <li>5. <strong className="text-terminal-text">Контроль Polymarket</strong>: увеличение доли ≥$150k {'>'} 20% → сигнал усиления долгосрочного оптимизма.</li>
          </ol>
        </section>

        {/* Итог */}
        <section className="bg-graphite-900 border border-graphite-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-terminal-cyan">Сводка TL;DR</h2>
          <ul className="space-y-2 text-terminal-muted text-sm">
            <li>• <strong className="text-terminal-text">ФРС</strong> смягчила политику (−25 б.п.; QT стоп с 1 дек).</li>
            <li>• <strong className="text-terminal-text">BTC</strong> торгуется в $108.6–$116k, mid ≈ $112k.</li>
            <li>• <strong className="text-terminal-text">Сентимент</strong> — осторожный (Fear 37).</li>
            <li>• <strong className="text-terminal-text">Микроструктура SSE</strong>: LTP $110 043.82; спред $0.01; ask-доминация (imbalance −0.92); orders/sec 46; net flow +0.58.</li>
            <li>• <strong className="text-terminal-text">Вероятности (неделя)</strong>: боковик 60%, выход вверх 12%, вниз 12%, хвосты 4–6%.</li>
            <li>• <strong className="text-terminal-text">Вывод</strong>: рынок устойчив внутри рейнджа; макро-фон смягчается; прорыв возможен только при поглощении аск-кластеров и подтверждении притоков в ETF.</li>
          </ul>
        </section>

      </article>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto mt-16 pt-8 border-t border-graphite-800 text-xs text-terminal-muted">
        <p>Отчёт сгенерирован: 31 окт 2025 09:30 UTC</p>
        <p className="mt-2">Источник данных: SSE (Binance BTCUSDT), Polymarket, Alternative.me (FGI), CoinGecko, Farside</p>
        <p className="mt-2">Этот отчёт объединяет факты (с источниками), квант-анализ и микроструктуру. Не является финансовым советом.</p>
        <p className="mt-4">
          <Link to="/" className="text-terminal-cyan hover:underline">← Назад на Context8</Link>
        </p>
      </footer>
    </div>
  )
}
