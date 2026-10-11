// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from "./context/ThemeContext.jsx";
import './styles/global.css'
import App from './App.jsx'
import { Toaster } from "react-hot-toast"

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster position='top-right' reverseOrder={false}></Toaster>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
);
