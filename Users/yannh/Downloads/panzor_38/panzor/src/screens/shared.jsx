// shared.jsx — helpers de UI das telas novas (usa o design system existente).
import React from 'react'

export const money = (n, o) => (window.money ? window.money(n, o) : 'R$ ' + n);
export const Icon = (p) => React.createElement(window.Icon, p);

export function Brand({ size = 22 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
      <img src="/assets/panzor-logo.png" alt="Panzor" width={Math.round(size * 1.55)} height={Math.round(size * 1.55)}
        style={{ borderRadius: Math.round(size * 0.4), display: 'block', objectFit: 'cover', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.06)' }} />
      <span style={{ fontFamily: "'Crimson Pro',serif", fontWeight: 600, fontSize: size, letterSpacing: '-.02em', color: 'var(--tx)' }}>Panzor</span>
    </div>
  );
}

// largura da janela (para layouts responsivos sem media query em estilo inline)
export function useWide(bp = 760) {
  const [wide, setWide] = React.useState(typeof window !== 'undefined' ? window.innerWidth >= bp : true);
  React.useEffect(() => {
    const onR = () => setWide(window.innerWidth >= bp);
    window.addEventListener('resize', onR); return () => window.removeEventListener('resize', onR);
  }, [bp]);
  return wide;
}

export function Field({ label, value, onChange, placeholder, type = 'text', ...rest }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} {...rest} />
    </div>
  );
}

export function PasswordField({ label, value, onChange, placeholder }) {
  const [show, setShow] = React.useState(false);
  return (
    <div className="field">
      <label>{label}</label>
      <div style={{ position: 'relative' }}>
        <input type={show ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder}
          style={{ paddingRight: 42 }} />
        <button type="button" onClick={() => setShow(s => !s)}
          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--tx-2)', lineHeight: 0 }}>
          {show
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          }
        </button>
      </div>
    </div>
  );
}
export function useAsync() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const run = React.useCallback(async (fn) => {
    setLoading(true); setError('');
    try { return await fn(); }
    catch (e) { setError(e.message || 'Algo deu errado.'); throw e; }
    finally { setLoading(false); }
  }, []);
  return { loading, error, setError, run };
}

// barra de topo simples (brand à esquerda, ações à direita)
export function GateTop({ right }) {
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderBottom: '1px solid var(--line)', background: 'var(--bg-2)' }}>
      <Brand size={19} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{right}</div>
    </header>
  );
}
