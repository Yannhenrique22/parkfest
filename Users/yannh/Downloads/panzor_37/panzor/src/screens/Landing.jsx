import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Brand, useWide } from './shared.jsx'
import { Icon } from './shared.jsx'

const DOORS = [
  { to: '/entrar', icon: 'dash', kicker: 'Negócio', title: 'Sou empreendedor', desc: 'Contrate um plano, configure seu negócio e compartilhe o link de reservas com seus clientes.', cta: 'Entrar / criar conta' },
  { to: '/b/arena-beira-mar', icon: 'phone', kicker: 'Cliente', title: 'Quero marcar um horário', desc: 'Página pública de um negócio — é o link que o empreendedor compartilha com os clientes.', cta: 'Ver loja de exemplo' },
];

export default function Landing() {
  const nav = useNavigate();
  const wide = useWide(600);
  return (
    <div className="scroll" style={{ minHeight: '100vh', overflowY: 'auto', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: wide ? '48px 32px 80px' : '28px 18px 60px' }}>
        <Brand size={wide ? 22 : 19} />
        <div style={{ marginTop: wide ? 44 : 28, marginBottom: wide ? 28 : 20 }}>
          <span className="kicker">Plataforma de agendamento · 2026</span>
          <h1 className="serif" style={{ fontSize: wide ? 'clamp(36px,6vw,52px)' : 36, lineHeight: 1, margin: '12px 0 10px', letterSpacing: '-.02em', color: 'var(--tx)' }}>
            Quem está <span className="em-green">entrando</span>?
          </h1>
          <p style={{ color: 'var(--tx-2)', fontSize: wide ? 17 : 15, maxWidth: 520, lineHeight: 1.5, margin: 0 }}>
            Cada perfil tem o seu espaço — o empreendedor não vê o painel do dono, e o cliente final entra só pelo link da loja.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: wide ? 'repeat(2,1fr)' : '1fr', gap: 14 }}>
          {DOORS.map((d) => (
            <button key={d.to} className="card" onClick={() => nav(d.to)}
              style={{ textAlign: 'left', cursor: 'pointer', padding: wide ? 24 : 20, display: 'flex', flexDirection: 'column', gap: 12, transition: '.16s' }}>
              <span style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--ac)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon name={d.icon} size={24} color="#0a0b0d" />
              </span>
              <div>
                <div className="kicker" style={{ marginBottom: 4 }}>{d.kicker}</div>
                <div className="serif" style={{ fontSize: wide ? 22 : 19, color: 'var(--tx)' }}>{d.title}</div>
              </div>
              <p style={{ color: 'var(--tx-2)', fontSize: 14, lineHeight: 1.5, margin: 0, flex: 1 }}>{d.desc}</p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--ac)', fontWeight: 600, fontSize: 14 }}>
                {d.cta} <Icon name="arrowR" size={16} color="var(--ac)" />
              </span>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--tx-2)', letterSpacing: '.06em' }}>Yann Henrique · Panzor</span>
        </div>
      </div>
    </div>
  );
}
