// Variacoes.jsx — botão flutuante global que abre as variações visuais.
// Cor da marca · layout dos horários · fundo (tema). Sem seletor de segmento:
// a tela já sabe o segmento; aqui só se ajusta a aparência.
import React from 'react'
import { Icon } from './shared.jsx'
import { getAppearance, setAppearance, subscribe, BRANDS } from '../lib/appearance.js'

function Row({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--tx)', marginBottom: 9, opacity: .8 }}>{label}</div>
      {children}
    </div>
  );
}
function Seg({ on, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '8px 10px', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 600,
      fontFamily: "'DM Sans',sans-serif", transition: '.15s',
      border: `1px solid ${on ? 'var(--ac)' : 'var(--line)'}`,
      background: on ? 'var(--ac)' : 'var(--panel-2)', color: on ? '#0a0b0d' : 'var(--tx)',
    }}>{children}</button>
  );
}

export default function Variacoes() {
  const [open, setOpen] = React.useState(false);
  const [a, setA] = React.useState(getAppearance());
  React.useEffect(() => subscribe(setA), []);
  const upd = (patch) => setAppearance(patch);

  return (
    <>
      <button onClick={() => setOpen((o) => !o)} title="Variações de aparência"
        style={{
          position: 'fixed', right: 18, bottom: 18, zIndex: 60, display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 15px', borderRadius: 999, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 600,
          background: 'var(--panel)', color: 'var(--tx)', border: `1px solid ${open ? 'var(--ac)' : 'var(--line)'}`,
          boxShadow: '0 10px 30px -12px rgba(0,0,0,.6)',
        }}>
        <Icon name="sun" size={17} color={open ? 'var(--ac)' : 'var(--tx-2)'} /> Variações
      </button>

      {open && (
        <div className="fade" style={{
          position: 'fixed', right: 18, bottom: 70, zIndex: 60, width: 300, padding: 18,
          borderRadius: 16, background: 'var(--panel)', border: '1px solid var(--line)',
          boxShadow: '0 24px 60px -24px rgba(0,0,0,.7)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span className="serif" style={{ fontSize: 18, color: 'var(--tx)' }}>Variações</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}><Icon name="x" size={18} color="var(--tx-2)" /></button>
          </div>

          <Row label="Cor da marca">
            <div style={{ display: 'flex', gap: 10 }}>
              {BRANDS.map(([id, ac]) => (
                <button key={id} onClick={() => upd({ brand: id })} title={id} style={{
                  width: 30, height: 30, borderRadius: 9, cursor: 'pointer', background: ac,
                  border: a.brand === id ? '2px solid var(--tx)' : '2px solid transparent',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.15)',
                }} />
              ))}
            </div>
          </Row>

          <Row label="Layout dos horários">
            <div style={{ display: 'flex', gap: 6 }}>
              {[['grade', 'Grade'], ['lista', 'Lista'], ['compacto', 'Compacto']].map(([k, l]) => (
                <Seg key={k} on={a.layout === k} onClick={() => upd({ layout: k })}>{l}</Seg>
              ))}
            </div>
          </Row>

          <Row label="Fundo">
            <div style={{ display: 'flex', gap: 6 }}>
              {[['black', 'Black'], ['grafite', 'Grafite'], ['claro', 'Claro']].map(([k, l]) => (
                <Seg key={k} on={a.theme === k} onClick={() => upd({ theme: k })}>{l}</Seg>
              ))}
            </div>
          </Row>

          <p style={{ margin: '4px 0 0', fontSize: 11.5, color: 'var(--tx-2)', lineHeight: 1.5 }}>
            O layout dos horários afeta a página pública de reservas no celular.
          </p>
        </div>
      )}
    </>
  );
}
