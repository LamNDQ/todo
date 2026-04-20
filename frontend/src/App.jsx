import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { store } from './redux/store'
import { fetchMe } from './redux/authSlice'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import TodoPage from './pages/TodoPage'
import WeatherPage from './pages/WeatherPage'
import WikipediaPage from './pages/WikipediaPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminPage from './pages/AdminPage'
import './styles/global.css'

// Inner app — needs Redux access
function AppContent() {
  const dispatch = useDispatch()
  const { accessToken, initialized } = useSelector((s) => s.auth)

  // On first load, re-hydrate user from token
  useEffect(() => {
    if (accessToken && !initialized) {
      dispatch(fetchMe())
    } else if (!accessToken) {
      // Mark as initialized so ProtectedRoute doesn't show spinner forever
      store.dispatch({ type: 'auth/fetchMe/rejected' })
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected layout routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Navigate to="/todo" replace />} />
                    <Route path="/todo" element={<TodoPage />} />
                    <Route path="/weather" element={<WeatherPage />} />
                    <Route path="/wikipedia" element={<WikipediaPage />} />
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminPage />
                        </AdminRoute>
                      }
                    />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App
