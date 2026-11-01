import { Route, Routes, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import NewProjectPage from './pages/NewProjectPage.jsx'
import MyProjectsPage from './pages/MyProjectsPage.jsx'
import ProjectDetailPage from './pages/ProjectDetailPage.jsx'
import ProjectEditPage from './pages/ProjectEditPage.jsx'
import TemplatesPage from './pages/TemplatesPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/new-project" element={<NewProjectPage />} />
          <Route path="/my-projects" element={<MyProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/projects/:id/edit" element={<ProjectEditPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
