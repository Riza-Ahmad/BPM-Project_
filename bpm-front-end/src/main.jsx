import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/Styles.css";
import "./assets/css/Tampilan.css";
import "./assets/js/Main.js";
import "sweetalert2"

import "@flaticon/flaticon-uicons/css/regular/rounded.css";
import "@flaticon/flaticon-uicons/css/bold/rounded.css";
import "@flaticon/flaticon-uicons/css/brands/all.css";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
