// NEW YEAR 2025 - auto-hide after Jan 7
export function NewYearDecorations() {
  const hideDate = new Date('2025-01-08T00:00:00');
  if (new Date() >= hideDate) return null;

  return (
    <div className="ny-decorations" id="nyDecorations">
      {['❄', '❅', '❆', '❄', '❅', '❆', '❄', '❅', '❆', '❄'].map((s, i) => (
        <span key={i} className="snowflake">{s}</span>
      ))}
      <div className="garland" />
    </div>
  );
}
