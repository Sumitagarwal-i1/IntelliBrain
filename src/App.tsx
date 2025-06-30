import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AuthGuard } from './components/AuthGuard'
import { Landing } from './pages/Landing'
import { App as AppPage } from './pages/App'
import { BriefDetail } from './pages/BriefDetail'
import { Dashboard } from './pages/Dashboard'
import { Settings } from './pages/Settings'
import { Docs } from './pages/Docs'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/app" element={
            <AuthGuard>
              <AppPage />
            </AuthGuard>
          } />
          <Route path="/brief/:id" element={
            <AuthGuard>
              <BriefDetail />
            </AuthGuard>
          } />
          <Route path="/dashboard" element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } />
          <Route path="/settings" element={
            <AuthGuard>
              <Settings />
            </AuthGuard>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App