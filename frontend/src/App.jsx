import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { store } from './redux/store'
import Sidebar from './components/Sidebar'
import TodoPage from './pages/TodoPage'
import WeatherPage from './pages/WeatherPage'
import WikipediaPage from './pages/WikipediaPage'
import './styles/global.css'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/todo" replace />} />
              <Route path="/todo" element={<TodoPage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/wikipedia" element={<WikipediaPage />} />
            </Routes>
          </main>
        </div>
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
    </Provider>
  )
}

export default App
