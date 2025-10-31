import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Landing } from './pages/Landing'
import { Auth } from './pages/Auth'
import { ErrorBoundary } from './components/ErrorBoundary'

// Lazy-load heavy routes for better performance
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })))
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })))
const AdminRoute = lazy(() => import('./components/admin/AdminRoute').then(m => ({ default: m.AdminRoute })))
const DailyReport = lazy(() => import('./pages/DailyReport').then(m => ({ default: m.DailyReport })))
const DailyReportRu = lazy(() => import('./pages/DailyReportRu').then(m => ({ default: m.DailyReportRu })))

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-graphite-950 text-terminal-text font-mono flex items-center justify-center">
      <p className="text-terminal-cyan">Loading...</p>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports/daily" element={<DailyReport />} />
            <Route path="/reports/daily-ru" element={<DailyReportRu />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
