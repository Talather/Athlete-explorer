import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import './styles/main.css'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-center" toastOptions={{
              duration: 5000,
              style: {
                background: '#363636',
                color: '#fff',
                padding: '16px',
                borderRadius: '10px',
              },
              success: {
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
            }} />
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
