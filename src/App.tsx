import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Landing } from './pages/Landing'
import { Auth } from './pages/Auth'
import { ErrorBoundary } from './components/ErrorBoundary'
import { NewYearDecorations } from './components/NewYearDecorations'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AuthCallback } from './components/auth/AuthCallback'

// Lazy-load heavy routes for better performance
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const AccountDashboard = lazy(() => import('./pages/AccountDashboard').then(m => ({ default: m.AccountDashboard })))
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })))
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })))
const AdminRoute = lazy(() => import('./components/admin/AdminRoute').then(m => ({ default: m.AdminRoute })))
const DailyReport = lazy(() => import('./pages/DailyReport').then(m => ({ default: m.DailyReport })))
const DailyReportRu = lazy(() => import('./pages/DailyReportRu').then(m => ({ default: m.DailyReportRu })))

// Dashboard nested pages
const DailyReportView = lazy(() => import('./pages/DailyReportView').then(m => ({ default: m.DailyReportView })))
const AssetDetail = lazy(() => import('./pages/AssetDetail').then(m => ({ default: m.AssetDetail })))
const CrowdedTrades = lazy(() => import('./pages/CrowdedTrades').then(m => ({ default: m.CrowdedTrades })))
const DivergenceWatchPage = lazy(() => import('./pages/DivergenceWatchPage').then(m => ({ default: m.DivergenceWatchPage })))
const ReportHistory = lazy(() => import('./pages/ReportHistory').then(m => ({ default: m.ReportHistory })))
const Assets = lazy(() => import('./pages/Assets').then(m => ({ default: m.Assets })))
const DashboardSettings = lazy(() => import('./pages/DashboardSettings').then(m => ({ default: m.DashboardSettings })))

// Blog pages
const BlogIndex = lazy(() => import('./pages/blog/BlogIndex').then(m => ({ default: m.BlogIndex })))
const WhatIsMcp = lazy(() => import('./pages/blog/articles/WhatIsMcp').then(m => ({ default: m.WhatIsMcp })))
const AiCryptoData = lazy(() => import('./pages/blog/articles/AiCryptoData').then(m => ({ default: m.AiCryptoData })))
const McpVsRestApi = lazy(() => import('./pages/blog/articles/McpVsRestApi').then(m => ({ default: m.McpVsRestApi })))

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
      <NewYearDecorations />
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Dashboard layout with nested routes */}
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Navigate to="report/latest" replace />} />
              <Route path="report/:date" element={<DailyReportView />} />
              <Route path="report/:date/:asset" element={<AssetDetail />} />
              <Route path="crowded" element={<CrowdedTrades />} />
              <Route path="divergence" element={<DivergenceWatchPage />} />
              <Route path="history" element={<ReportHistory />} />
              <Route path="assets" element={<Assets />} />
              <Route path="settings" element={<DashboardSettings />} />
            </Route>

            {/* Legacy account dashboard */}
            <Route path="/account" element={<ProtectedRoute><AccountDashboard /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/reports/daily" element={<DailyReport />} />
            <Route path="/reports/daily-ru" element={<DailyReportRu />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/what-is-mcp" element={<WhatIsMcp />} />
            <Route path="/blog/ai-crypto-data-integration" element={<AiCryptoData />} />
            <Route path="/blog/mcp-vs-rest-api" element={<McpVsRestApi />} />
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
