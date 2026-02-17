import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Landing } from './pages/Landing'
import { Auth } from './pages/Auth'
import { NotFound } from './pages/NotFound'
import { Dashboard } from './pages/Dashboard'
import { ErrorBoundary } from './components/ErrorBoundary'
import { NewYearDecorations } from './components/NewYearDecorations'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AuthCallback } from './components/auth/AuthCallback'

// Lazy-load heavy routes for better performance
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })))
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })))
const AdminRoute = lazy(() => import('./components/admin/AdminRoute').then(m => ({ default: m.AdminRoute })))

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
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Dashboard layout with nested routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="report/latest" replace />} />
            <Route path="report/:date" element={<Suspense fallback={<LoadingFallback />}><DailyReportView /></Suspense>} />
            <Route path="report/:date/:asset" element={<Suspense fallback={<LoadingFallback />}><AssetDetail /></Suspense>} />
            <Route path="crowded" element={<Suspense fallback={<LoadingFallback />}><CrowdedTrades /></Suspense>} />
            <Route path="divergence" element={<Suspense fallback={<LoadingFallback />}><DivergenceWatchPage /></Suspense>} />
            <Route path="history" element={<Suspense fallback={<LoadingFallback />}><ReportHistory /></Suspense>} />
            <Route path="assets" element={<Suspense fallback={<LoadingFallback />}><Assets /></Suspense>} />
            <Route path="settings" element={<Suspense fallback={<LoadingFallback />}><DashboardSettings /></Suspense>} />
          </Route>

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <Analytics />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route path="/blog" element={<Suspense fallback={<LoadingFallback />}><BlogIndex /></Suspense>} />
          <Route path="/blog/what-is-mcp" element={<Suspense fallback={<LoadingFallback />}><WhatIsMcp /></Suspense>} />
          <Route path="/blog/ai-crypto-data-integration" element={<Suspense fallback={<LoadingFallback />}><AiCryptoData /></Suspense>} />
          <Route path="/blog/mcp-vs-rest-api" element={<Suspense fallback={<LoadingFallback />}><McpVsRestApi /></Suspense>} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
