import { useParams } from 'react-router-dom'

export function DailyReportView() {
  const { date } = useParams<{ date: string }>()
  return (
    <div className="text-terminal-muted text-sm font-mono">
      <p>Report: {date ?? 'latest'}</p>
    </div>
  )
}
