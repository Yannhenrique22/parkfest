// shell.jsx — Reserva: shell de apresentação (Brief · Cliente · Mensagens · Dono) + variações
const { useState, useEffect, useLayoutEffect, useRef } = React;

const PALETTES = {
  laranja: { '--ac': '#F97316', '--ac-dark': '#EA670C', '--ac-soft': '#2a1708', '--ac-soft-2': '#3a2210' },
  esmeralda: { '--ac': '#2FC18A', '--ac-dark': '#1f9d6e', '--ac-soft': '#0f2b20', '--ac-soft-2': '#143a2a' },
  indigo: { '--ac': '#5B8DEF', '--ac-dark': '#4574d6', '--ac-soft': '#14223f', '--ac-soft-2': '#1b2f54' },
  vinho: { '--ac': '#E0567B', '--ac-dark': '#c23e62', '--ac-soft': '#2c1320', '--ac-soft-2': '#3e1a2c' },
};
const PAL_LABEL = { laranja: 'Laranja', esmeralda: 'Esmeralda', indigo: 'Índigo', vinho: 'Vinho' };
const THEME_CLASS = { black: '', grafite: 'theme-grafite', claro: 'theme-claro' };

// ── scaler ───────────────────────────────────────────────────
function Fit({ w, h, children }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const calc = () => { const aw = el.clientWidth - 8, ah = el.clientHeight - 8; setScale(Math.min(aw / w, ah / h, 1)); };
    const ro = new ResizeObserver(calc); ro.observe(el); calc();
    return () => ro.disconnect();
  }, [w, h]);
  return (
    <div ref={ref} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: 'center center', flexShrink: 0 }}>{children}</div>
    </div>
  );
}

// ============================================================
// BRIEF
// ============================================================
function Brief({ onGoto }) {
  const flow = [
    { ic: 'pin', t: 'Vitrine', d: 'O cliente abre o espaço, vê fotos, modalidades e preço.' },
    { ic: 'user', t: 'Cadastro rápido', d: 'Google, Microsoft ou e-mail + nome, celular e CPF.' },
    { ic: 'calendar', t: 'Marcar horário', d: 'Escolhe dia, quadra/profissional/espaço e horário livre.' },
    { ic: 'card', t: 'Pagar', d: 'Online (reserva garantida) ou no local — o cliente decide.' },
    { ic: 'bell', t: 'Confirmar & lembrar', d: 'Confirmação no dia e lembrete na véspera com a taxa.' },
  ];
  const screens = [
    ['Dono · Panzor', 'panzor', 'Sua visão: empreendedores contratantes, MRR, planos e churn.'],
    ['Empreendedor', 'empreendedor', 'Seu cliente: contrata (segmento → plano → conta) e gerencia o negócio.'],
    ['Usuário', 'usuario', 'Marca horário em segundos — no celular ou no desktop.'],
  ];
  return (
    <div className="scroll" style={{ width: '100%', height: '100%', overflowY: 'auto', background: 'var(--cream)' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '44px 28px 80px' }}>
        {/* hero */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '44px 48px', background: 'linear-gradient(140deg, #0b0d11 0%, var(--ac-dark) 170%)', position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--line)' }}>
            <div style={{ position: 'absolute', right: -30, top: -30, opacity: .1 }}><Icon name="calendar" size={220} color="#fff" stroke={.8} /></div>
            <span className="mono" style={{ color: 'var(--mint)', fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase' }}>Proposta de produto · 2026</span>
            <h1 className="serif" style={{ color: '#fff', fontSize: 64, lineHeight: .95, margin: '14px 0 0', letterSpacing: '-.03em' }}>Panzor</h1>
            <p style={{ color: 'rgba(255,255,255,.78)', fontSize: 20, lineHeight: 1.45, maxWidth: 560, margin: '16px 0 0' }}>
              O agendador <span style={{ color: 'var(--mint)', fontStyle: 'italic', fontFamily: "'Crimson Pro',serif" }}>versátil</span> que marca horários de quadra, salão e espaço de festa — com confirmação automática e repasse transparente.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 26, flexWrap: 'wrap' }}>
              <button className="btn" style={{ background: 'var(--mint)', color: '#06120d' }} onClick={() => onGoto('usuario')}>Abrir app do usuário <Icon name="arrowR" size={17} color="#06120d" /></button>
              <button className="btn btn-ghost" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', borderColor: 'rgba(255,255,255,.25)' }} onClick={() => onGoto('empreendedor')}>Ver visão do empreendedor</button>
            </div>
          </div>
        </div>

        {/* dois mundos */}
        <div style={{ marginTop: 40 }}>
          <span className="kicker">Um sistema, dois mundos</span>
          <h2 className="serif" style={{ fontSize: 32, margin: '8px 0 18px' }}>O dono escolhe o segmento. As telas se adaptam.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {Object.values(SEGMENTS).map(s => (
              <div key={s.id} className="card" style={{ padding: 20, boxShadow: 'none' }}>
                <span style={{ width: 46, height: 46, borderRadius: 12, background: s.accent, display: 'grid', placeItems: 'center' }}><Icon name={s.icon} size={24} color="#fff" /></span>
                <div className="serif" style={{ fontSize: 20, margin: '14px 0 4px' }}>{s.label}</div>
                <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5 }}>{s.venue.tagline}</div>
                <div className="mono" style={{ fontSize: 11, color: s.accent, marginTop: 12, textTransform: 'uppercase', letterSpacing: '.08em' }}>agenda por {s.noun.toLowerCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* fluxo */}
        <div style={{ marginTop: 44 }}>
          <span className="kicker">O fluxo do cliente</span>
          <h2 className="serif" style={{ fontSize: 32, margin: '8px 0 18px' }}>Da vitrine ao lembrete, em 5 passos.</h2>
          <div className="card" style={{ padding: '8px 24px', boxShadow: 'none' }}>
            {flow.map((f, i) => (
              <div key={f.t} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '16px 0', borderTop: i ? '1px solid var(--rule-2)' : 'none' }}>
                <span className="serif" style={{ fontSize: 30, color: 'var(--green)', fontStyle: 'italic', width: 36, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--green-50)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={f.ic} size={21} color="var(--green-dark)" /></span>
                <div><div style={{ fontWeight: 600, fontSize: 16 }}>{f.t}</div><div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 1 }}>{f.d}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* sistema visual */}
        <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="card" style={{ padding: 24, boxShadow: 'none' }}>
            <span className="kicker">Tipografia</span>
            <div className="serif" style={{ fontSize: 40, margin: '12px 0 2px' }}>Crimson Pro</div>
            <div style={{ fontSize: 16, marginBottom: 10 }}>DM Sans · interface</div>
            <div className="mono" style={{ fontSize: 13, color: 'var(--muted)' }}>DM MONO · ETIQUETAS</div>
          </div>
          <div className="card" style={{ padding: 24, boxShadow: 'none' }}>
            <span className="kicker">Paleta</span>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              {['var(--ac)', '#0a0b0d', '#ffffff', 'var(--ac-dark)', 'var(--mint)', 'var(--panel-2)'].map((c, i) => (
                <div key={i} style={{ width: 44, height: 44, borderRadius: 11, background: c, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.12)' }}></div>
              ))}
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 14, lineHeight: 1.5 }}>Laranja, preto e branco como base. Troque a cor da marca nas <b>Variações</b> para testar outras paletas.</div>
          </div>
        </div>

        {/* telas */}
        <div style={{ marginTop: 44 }}>
          <span className="kicker">As três visões</span>
          <h2 className="serif" style={{ fontSize: 32, margin: '8px 0 18px' }}>Um produto, três perfis.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {screens.map(([t, k, d]) => (
              <button key={k} className="card" style={{ padding: 20, boxShadow: 'none', textAlign: 'left', cursor: 'pointer' }} onClick={() => onGoto(k)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="serif" style={{ fontSize: 19 }}>{t}</div>
                  <Icon name="arrowR" size={18} color="var(--green)" />
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5, marginTop: 8 }}>{d}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SHELL
// ============================================================
function Shell() {
  const [scene, setScene] = useState(() => localStorage.getItem('reserva_scene') || 'brief');
  const [segKey, setSegKey] = useState(() => localStorage.getItem('reserva_seg') || 'quadras');
  const [fee, setFee] = useState(() => parseInt(localStorage.getItem('reserva_fee') || '50'));
  const [layout, setLayout] = useState(() => localStorage.getItem('reserva_layout') || 'grade');
  const [palette, setPalette] = useState(() => localStorage.getItem('reserva_pal_v2') || 'laranja');
  const [theme, setTheme] = useState(() => localStorage.getItem('reserva_theme') || 'black');
  const [showVar, setShowVar] = useState(false);
  const [lastBooking, setLastBooking] = useState(null);
  const [empView, setEmpView] = useState('entry');   // entry | panel
  const [userView, setUserView] = useState('app');    // app | desktop | mensagens

  useEffect(() => { localStorage.setItem('reserva_scene', scene); }, [scene]);
  useEffect(() => { localStorage.setItem('reserva_seg', segKey); }, [segKey]);
  useEffect(() => { localStorage.setItem('reserva_fee', fee); }, [fee]);
  useEffect(() => { localStorage.setItem('reserva_layout', layout); }, [layout]);
  useEffect(() => { localStorage.setItem('reserva_theme', theme); const c = document.documentElement.classList; c.remove('theme-grafite', 'theme-claro'); if (THEME_CLASS[theme]) c.add(THEME_CLASS[theme]); }, [theme]);
  useEffect(() => {
    localStorage.setItem('reserva_pal_v2', palette);
    const p = PALETTES[palette]; Object.entries(p).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  }, [palette]);

  const seg = SEGMENTS[segKey];
  const openMessages = (b) => { setLastBooking(b); if (b && b.seg) setSegKey(b.seg); setScene('usuario'); setUserView('mensagens'); };

  const SCENES = [['brief', 'Visão geral', 'info'], ['panzor', 'Dono · Panzor', 'shield'], ['empreendedor', 'Empreendedor', 'dash'], ['usuario', 'Usuário', 'phone']];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', color: 'var(--tx)' }}>
      {/* TOP BAR */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '12px 22px', background: 'var(--bg-2)', borderBottom: '1px solid var(--rule)', flexShrink: 0, zIndex: 30 }}>
        <Wordmark size={20} />
        <div className="tabbar">
          {SCENES.map(([k, l, ic]) => (
            <button key={k} className={scene === k ? 'on' : ''} onClick={() => setScene(k)}><Icon name={ic} size={16} color={scene === k ? '#06120d' : 'var(--muted)'} /> {l}</button>
          ))}
        </div>
        <button onClick={() => setShowVar(v => !v)} className="chip" style={{ padding: '9px 15px', borderColor: showVar ? 'var(--green)' : 'var(--rule)', color: showVar ? 'var(--green-dark)' : 'var(--ink-2)' }}>
          <Icon name="gear" size={16} color={showVar ? 'var(--green)' : 'var(--muted)'} /> Variações
        </button>
      </header>

      {/* VARIATIONS BAR */}
      {showVar && (
        <div className="fade" style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '12px 24px', background: 'var(--paper-2)', borderBottom: '1px solid var(--rule)', flexShrink: 0, flexWrap: 'wrap' }}>
          <VarGroup label="Segmento (telas)">
            {Object.values(SEGMENTS).map(s => <Seg key={s.id} on={segKey === s.id} onClick={() => setSegKey(s.id)} icon={s.icon}>{s.short}</Seg>)}
          </VarGroup>
          <VarGroup label="Marca (cor)">
            {Object.keys(PALETTES).map(p => (
              <button key={p} onClick={() => setPalette(p)} title={PAL_LABEL[p]} style={{ width: 26, height: 26, borderRadius: 8, cursor: 'pointer', background: PALETTES[p]['--ac'], border: palette === p ? '2px solid var(--tx)' : '2px solid transparent', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.12)' }}></button>
            ))}
          </VarGroup>
          <VarGroup label="Layout dos horários">
            {[['grade', 'Grade'], ['lista', 'Lista'], ['compacto', 'Compacto']].map(([k, l]) => <Seg key={k} on={layout === k} onClick={() => setLayout(k)}>{l}</Seg>)}
          </VarGroup>
          <VarGroup label="Fundo">
            {[['black', 'Black'], ['grafite', 'Grafite'], ['claro', 'Claro']].map(([k, l]) => <Seg key={k} on={theme === k} onClick={() => setTheme(k)}>{l}</Seg>)}
          </VarGroup>
        </div>
      )}

      {/* SUB-TOGGLE (por persona) */}
      {(scene === 'empreendedor' || scene === 'usuario') && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 24px', background: 'var(--bg-2)', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
          <span className="mono" style={{ fontSize: 10.5, color: 'var(--tx-3)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
            {scene === 'empreendedor' ? 'Empreendedor (seu cliente)' : 'Usuário final'}
          </span>
          <div className="tabbar" style={{ padding: 4 }}>
            {(scene === 'empreendedor'
              ? [['entry', 'Contratar', 'plus'], ['panel', 'Painel do negócio', 'dash']]
              : [['app', 'App · celular', 'phone'], ['desktop', 'Desktop', 'court'], ['mensagens', 'Mensagens', 'chat']]
            ).map(([k, l, ic]) => {
              const on = scene === 'empreendedor' ? empView === k : userView === k;
              const setV = scene === 'empreendedor' ? setEmpView : setUserView;
              return <button key={k} className={on ? 'on' : ''} onClick={() => setV(k)} style={{ fontSize: 13, padding: '7px 14px' }}><Icon name={ic} size={14} color={on ? '#06120d' : 'var(--muted)'} /> {l}</button>;
            })}
          </div>
        </div>
      )}

      {/* STAGE */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        {scene === 'brief' && <Brief onGoto={(s) => setScene(s)} />}

        {scene === 'panzor' && (
          <div style={{ height: '100%', display: 'grid', placeItems: 'center', padding: 16 }}>
            <Fit w={1200} h={780}>
              <ChromeWindow width={1200} height={780} url="console.panzor.app" tabs={[{ title: 'Panzor · Console' }]}>
                <PanzorAdmin />
              </ChromeWindow>
            </Fit>
            <SceneNote><b>Sua visão</b> (dono do Panzor): todos os empreendedores contratantes, MRR, planos e saúde da carteira.</SceneNote>
          </div>
        )}

        {scene === 'empreendedor' && (
          <div style={{ height: '100%', display: 'grid', placeItems: 'center', padding: 16 }}>
            <Fit w={1200} h={780}>
              <ChromeWindow width={1200} height={780} url={empView === 'entry' ? 'app.panzor.app/contratar' : 'app.panzor.app/painel'} tabs={[{ title: empView === 'entry' ? 'Panzor · Contratar' : 'Panzor · Painel' }]}>
                {empView === 'entry'
                  ? <EmpreendedorEntry initialSeg={segKey} onDone={(s) => { setSegKey(s); setEmpView('panel'); }} />
                  : <OwnerApp segKey={segKey} fee={fee} setFee={setFee} onPickSegment={setSegKey} startPhase="app" onReconfig={() => setEmpView('entry')} />}
              </ChromeWindow>
            </Fit>
            <SceneNote>{empView === 'entry'
              ? <>Entrada do empreendedor: escolhe <b>segmento → plano → conta</b> e abre o painel.</>
              : <>Painel do negócio do empreendedor — Agenda, Clientes, Valores & repasse.</>}</SceneNote>
          </div>
        )}

        {scene === 'usuario' && userView === 'desktop' && (
          <div style={{ height: '100%', display: 'grid', placeItems: 'center', padding: 16 }}>
            <Fit w={1200} h={780}>
              <ChromeWindow width={1200} height={780} url={`${seg.venue.name.toLowerCase().replace(/[^a-z]+/g, '')}.panzor.app`} tabs={[{ title: seg.venue.name + ' · Reservar' }]}>
                <DesktopBooking segKey={segKey} fee={fee} />
              </ChromeWindow>
            </Fit>
            <SceneNote>Versão <b>desktop</b> do agendamento — mesma reserva rápida, layout web em duas colunas.</SceneNote>
          </div>
        )}

        {scene === 'usuario' && userView === 'app' && (
          <div style={{ height: '100%', display: 'grid', placeItems: 'center', padding: 16 }}>
            <Fit w={402} h={844}>
              <IOSDevice dark><CustomerApp segKey={segKey} fee={fee} layout={layout} onOpenMessages={openMessages} /></IOSDevice>
            </Fit>
            <SceneNote>App do usuário (celular) — abre pelo link, <b>cadastra e marca em segundos</b>. Toque em <b>Reservar horário</b>.</SceneNote>
          </div>
        )}

        {scene === 'usuario' && userView === 'mensagens' && (
          <div style={{ height: '100%', display: 'grid', placeItems: 'center', padding: 16 }}>
            <Fit w={402} h={844}>
              <IOSDevice dark><MessagesScene segKey={(lastBooking && lastBooking.seg) || segKey} sel={lastBooking && lastBooking.sel} pay={(lastBooking && lastBooking.pay) || 'online'} fee={fee} /></IOSDevice>
            </Fit>
            <SceneNote>Alterne <b>Confirmação</b> / <b>Lembrete</b> e <b>WhatsApp · SMS · E-mail</b> nos controles inferiores.</SceneNote>
          </div>
        )}
      </div>
    </div>
  );
}

function VarGroup({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>{label}</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>{children}</div>
    </div>
  );
}
function Seg({ on, onClick, icon, children }) {
  return <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 9, cursor: 'pointer', border: `1px solid ${on ? 'var(--ac)' : 'var(--rule)'}`, background: on ? 'var(--ac)' : 'var(--panel)', color: on ? '#06120d' : 'var(--ink-2)', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600 }}>
    {icon && <Icon name={icon} size={14} color={on ? '#06120d' : 'var(--muted)'} />}{children}</button>;
}
function SceneNote({ children }) {
  return <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', maxWidth: 560, textAlign: 'center', fontSize: 12.5, color: 'var(--tx-2)', background: 'rgba(10,12,16,.85)', backdropFilter: 'blur(6px)', padding: '7px 16px', borderRadius: 99, border: '1px solid var(--line)', pointerEvents: 'none' }}>{children}</div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<Shell />);
