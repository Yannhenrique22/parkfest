// router.jsx — rotas do app (3 portas de entrada + página pública por negócio).
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './screens/Landing.jsx'
import Dono from './screens/Dono.jsx'
import Entrar from './screens/Entrar.jsx'
import Contratar from './screens/Contratar.jsx'
import Painel from './screens/Painel.jsx'
import PublicBooking from './screens/PublicBooking.jsx'
import Variacoes from './screens/Variacoes.jsx'
import AuthCallback from './screens/AuthCallback.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Variacoes />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dono" element={<Navigate to="/" replace />} />
        <Route path="/entrar" element={<Entrar />} />
        <Route path="/contratar" element={<Contratar />} />
        <Route path="/painel" element={<Painel />} />
        <Route path="/b/:slug" element={<PublicBooking />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
