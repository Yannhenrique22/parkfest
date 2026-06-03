// main.jsx — ponto de entrada do APP real (substitui o shell de apresentação).
import './app/styles.css'
import './_globals.js'

// módulos de design (registram componentes em window.* — usados pelas telas):
import './app/data.jsx'
import './app/customer-1.jsx'
import './app/customer-2.jsx'
import './app/customer-desktop.jsx'
import './app/owner-1.jsx'
import './app/owner-2.jsx'
import './app/panzor-admin.jsx'
import './app/empreendedor.jsx'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { initAppearance } from './lib/appearance.js'
import App from './router.jsx'

initAppearance()
createRoot(document.getElementById('root')).render(<App />)
