// owner-1.jsx — Reserva (visão dono): BI escuro denso — sidebar, topbar, painel, agenda
// Exporta: Sidebar, Topbar, KPI, DashboardScreen, AgendaScreen

const OWNER_NAV = [
  { id: 'painel', label: 'Visão geral', icon: 'dash' },
  { id: 'agenda', label: 'Agenda', icon: 'calendar', badge: '12' },
  { id: 'clientes', label: 'Clientes', icon: 'users', badge: '318' },
  { id: 'valores', label: 'Valores & repasse', icon: 'money' },
  { id: 'config', label: 'Configurações', icon: 'gear' },
];

function Sidebar({ seg, active, onNav, ownerName, ownerEmail, businessName, M: _M }) {
  const M = typeof window !== 'undefined' && window.innerWidth < 700;
  const displayName = businessName || seg.venue.name;
  return (
    <div style={{ width: M ? 56 : 236, background: 'var(--bg-2)', flexShrink: 0, display: 'flex', flexDirection: 'column', padding: M ? '12px 6px' : '20px 14px', borderRight: '1px solid var(--line)', overflowY: 'auto' }}>
      <div style={{ padding: '0 8px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Mark size={M ? 26 : 32} />
        {!M && <div>
          <div style={{ fontFamily: "'Crimson Pro',serif", fontWeight: 600, fontSize: 20, color: 'var(--tx)', lineHeight: 1 }}>Panzor</div>
          <div className="mono" style={{ fontSize: 8.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--tx-3)', marginTop: 3 }}>business · analytics</div>
        </div>}
      </div>

      <button style={{ margin: M ? '12px 0 4px' : '20px 0 6px', padding: M ? '8px 6px' : '11px 12px', borderRadius: 12, background: 'var(--panel)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: M ? 0 : 11, cursor: 'pointer', textAlign: 'left', justifyContent: M ? 'center' : 'flex-start' }}>
        <span style={{ width: 36, height: 36, borderRadius: 9, background: seg.accent, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={seg.icon} size={19} color="#fff" /></span>
        {!M && <span style={{ minWidth: 0, flex: 1 }}>
          <span style={{ color: 'var(--tx)', fontWeight: 600, fontSize: 13, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</span>
          <span style={{ color: 'var(--tx-3)', fontSize: 10.5 }}>{seg.label}</span>
        </span>}
        {!M && <Icon name="chevD" size={14} color="var(--tx-3)" />}
      </button>

      <div className="mono" style={{ fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--tx-3)', padding: '16px 10px 8px' }}>Análises</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {OWNER_NAV.map(n => {
          const on = active === n.id;
          return (
            <button key={n.id} onClick={() => onNav(n.id)} style={{
              display: 'flex', alignItems: 'center', gap: M ? 0 : 11, padding: M ? '10px 6px' : '10px 12px', borderRadius: 10, cursor: 'pointer',
              border: 'none', textAlign: 'left', fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: on ? 600 : 500,
              background: on ? 'var(--ac-soft)' : 'transparent', color: on ? 'var(--ac)' : 'var(--tx-2)', transition: '.15s',
              justifyContent: M ? 'center' : 'flex-start',
              boxShadow: on ? 'inset 2px 0 0 var(--ac)' : 'none',
            }}>
              <Icon name={n.icon} size={18} color={on ? 'var(--ac)' : 'var(--tx-3)'} />
              {!M && <span style={{ flex: 1 }}>{n.label}</span>}
              {!M && n.badge && <span className="mono" style={{ fontSize: 10.5, color: on ? 'var(--ac)' : 'var(--tx-3)', background: on ? 'var(--ac-soft-2)' : 'var(--panel-2)', padding: '2px 7px', borderRadius: 6 }}>{n.badge}</span>}
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: M ? 0 : 10, padding: '10px 8px', borderTop: '1px solid var(--line)', justifyContent: M ? 'center' : 'flex-start' }}>
        <span style={{ width: 34, height: 34, borderRadius: 99, background: 'var(--warn)', color: '#1a1206', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13 }}>JM</span>
        {!M && <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--tx)' }}>{ownerName || 'Empreendedor'}</div><div style={{ fontSize: 10.5, color: 'var(--tx-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ownerEmail || ''}</div></div>}
        {!M && <button onClick={() => onNav('setup')} title="Refazer configuração" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><Icon name="gear" size={16} color="var(--tx-3)" /></button>}
      </div>
    </div>
  );
}

function Topbar({ seg, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px', borderBottom: '1px solid var(--line)', background: 'var(--bg-2)' }}>
      <div className="mono" style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--tx-3)', flexShrink: 0 }}>
        Análises <span style={{ margin: '0 6px' }}>/</span> <span style={{ color: 'var(--tx)' }}>{title}</span>
      </div>
      <div style={{ flex: 1, maxWidth: 420, display: 'flex', alignItems: 'center', gap: 9, background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 10, padding: '9px 13px', marginLeft: 'auto' }}>
        <Icon name="user" size={15} color="var(--tx-3)" />
        <span style={{ flex: 1, color: 'var(--tx-3)', fontSize: 13 }}>Buscar reservas, clientes, quadras…</span>
        <span className="mono" style={{ fontSize: 11, color: 'var(--tx-3)', border: '1px solid var(--line)', borderRadius: 5, padding: '1px 6px' }}>⌘K</span>
      </div>
      <span className="pill" style={{ flexShrink: 0 }}><Icon name="calendar" size={13} color="var(--tx-2)" /> 2 · Jun · 2026</span>
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        {['bell', 'info'].map(ic => <button key={ic} style={{ width: 36, height: 36, borderRadius: 9, border: '1px solid var(--line)', background: 'var(--panel)', display: 'grid', placeItems: 'center', cursor: 'pointer', position: 'relative' }}><Icon name={ic} size={17} color="var(--tx-2)" />{ic === 'bell' && <span style={{ position: 'absolute', top: 8, right: 9, width: 6, height: 6, borderRadius: 9, background: 'var(--ac)' }}></span>}</button>)}
      </div>
    </div>
  );
}

function DeltaPill({ v, invert }) {
  const up = v >= 0; const good = invert ? !up : up;
  return <span className={'delta ' + (good ? 'up' : 'down')}><Icon name="trend" size={12} color={good ? 'var(--up)' : 'var(--down)'} style={{ transform: up ? 'none' : 'scaleY(-1)' }} />{up ? '+' : ''}{v.toLocaleString('pt-BR')}{typeof v === 'number' ? '%' : ''}</span>;
}

function KPI({ label, value, sub, delta, invert, icon, accent }) {
  return (
    <div className="panel" style={{ padding: '16px 18px', boxShadow: 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--tx-3)' }}>{label}</span>
        <Icon name={icon} size={16} color={accent || 'var(--tx-3)'} />
      </div>
      <div className="num" style={{ fontSize: 27, fontWeight: 500, marginTop: 12, color: 'var(--tx)', letterSpacing: '-.01em' }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 9 }}>
        {delta != null && <DeltaPill v={delta} invert={invert} />}
        <span style={{ fontSize: 11.5, color: 'var(--tx-3)' }}>{sub}</span>
      </div>
    </div>
  );
}

function Panel({ title, right, children, pad = true, sub }) {
  return (
    <div className="panel" style={{ boxShadow: 'none', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {title && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', borderBottom: '1px solid var(--line)' }}>
        <div><div style={{ fontWeight: 600, fontSize: 14, color: 'var(--tx)' }}>{title}</div>{sub && <div style={{ fontSize: 11.5, color: 'var(--tx-3)', marginTop: 1 }}>{sub}</div>}</div>
        {right}
      </div>}
      <div style={{ padding: pad ? 18 : 0, flex: 1 }}>{children}</div>
    </div>
  );
}

// ── dados BI (por segmento) ──────────────────────────────────
const BI = {
  quadras: {
    rows: [
      { code: 'BT', name: 'Beach Tênis', val: 38420, d: 22.4, n: 412 },
      { code: 'VP', name: 'Vôlei de Praia', val: 18900, d: 9.1, n: 286 },
      { code: 'FV', name: 'Futevôlei', val: 14260, d: 14.8, n: 198 },
      { code: 'FS', name: 'Futsal', val: 9870, d: -3.2, n: 246 },
      { code: 'S7', name: 'Society 7', val: 3270, d: 1.1, n: 142 },
    ],
    top: [['CR', 'Camila Rocha', 4120], ['LS', 'Letícia Souza', 3980], ['PL', 'Patrícia Lima', 3110], ['DM', 'Diego Martins', 2740], ['RN', 'Rafael Nunes', 2210], ['BA', 'Bruno Almeida', 1890]],
  },
  beleza: {
    rows: [
      { code: 'CO', name: 'Coloração', val: 28800, d: 18.2, n: 132 },
      { code: 'CF', name: 'Corte feminino', val: 16640, d: 7.4, n: 214 },
      { code: 'ES', name: 'Escova', val: 11700, d: 11.0, n: 168 },
      { code: 'HI', name: 'Hidratação', val: 8910, d: -2.1, n: 121 },
      { code: 'CM', name: 'Corte masculino', val: 6320, d: 5.6, n: 198 },
    ],
    top: [['LS', 'Letícia Souza', 2980], ['CR', 'Camila Rocha', 2410], ['PL', 'Patrícia Lima', 2110], ['BA', 'Bruna Castro', 1740], ['DM', 'Daniela M.', 1510], ['RN', 'Renata N.', 1290]],
  },
  festas: {
    rows: [
      { code: 'CA', name: 'Casamento', val: 84000, d: 24.0, n: 12 },
      { code: 'AN', name: 'Aniversário', val: 42000, d: 12.3, n: 28 },
      { code: 'CP', name: 'Corporativo', val: 33600, d: 16.8, n: 14 },
      { code: 'FO', name: 'Formatura', val: 16800, d: -4.0, n: 6 },
    ],
    top: [['GE', 'Grupo Eventos SA', 18400], ['MC', 'Marina C.', 12200], ['JT', 'João T.', 9800], ['RF', 'Rafael F.', 8400], ['LM', 'Lúcia M.', 7100], ['PE', 'Pedro E.', 5600]],
  },
};

// ── PAINEL (BI denso) ────────────────────────────────────────
function DashboardScreen({ seg }) {
  const bi = BI[seg.id];
  const total = bi.rows.reduce((a, b) => a + b.val, 0);
  const occ = [42, 55, 48, 60, 45, 58, 72, 86, 94, 80, 100, 88, 64, 40];
  const hours = Array.from({ length: 14 }, (_, i) => i + 8);
  const trend = [38, 41, 39, 46, 44, 52, 49, 58, 55, 63, 67, 72];
  const channels = [
    { name: 'Pago online', val: Math.round(total * 0.62), pct: 62, c: seg.accent },
    { name: 'Pago no local', val: Math.round(total * 0.38), pct: 38, c: 'var(--info)' },
  ];

  return (
    <div className="scroll fade" style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 40px', background: 'var(--bg)' }}>
      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
        <KPI label="Faturamento · mês" value={money(total, { cents: false })} delta={18.4} sub="vs. mai" icon="money" accent="var(--ac)" />
        <KPI label="Reservas · mês" value={bi.rows.reduce((a, b) => a + b.n, 0).toLocaleString('pt-BR')} delta={6.2} sub="vs. mai" icon="calendar" />
        <KPI label="Ocupação média" value="74,3%" delta={5.1} sub="pts" icon="trend" accent="var(--ac)" />
        <KPI label="Ticket médio" value={money(112.4)} delta={3.8} sub="vs. mai" icon="card" />
        <KPI label="No-show" value="4,2%" delta={-1.1} invert sub="pts · melhor" icon="shield" />
      </div>

      {/* main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: 14, marginTop: 14 }}>
        {/* esquerda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Panel title={`Faturamento por ${seg.id === 'beleza' ? 'serviço' : seg.id === 'festas' ? 'evento' : 'modalidade'}`} sub="Período: maio → junho · 2026" right={<span className="chip" style={{ fontSize: 12 }}><Icon name="filter" size={13} /> Mês</span>} pad={false}>
            <table className="dtable">
              <thead><tr><th>Categoria</th><th style={{ textAlign: 'right' }}>Reservas</th><th style={{ textAlign: 'right' }}>Faturamento</th><th style={{ textAlign: 'right' }}>Variação</th><th style={{ width: 90 }}>Share</th></tr></thead>
              <tbody>
                {bi.rows.map(r => (
                  <tr key={r.code}>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span className="code">{r.code}</span><b style={{ fontWeight: 600 }}>{r.name}</b></div></td>
                    <td className="num" style={{ textAlign: 'right', color: 'var(--tx-2)' }}>{r.n}</td>
                    <td className="num" style={{ textAlign: 'right', fontWeight: 600 }}>{money(r.val, { cents: false })}</td>
                    <td style={{ textAlign: 'right' }}><DeltaPill v={r.d} /></td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><div style={{ flex: 1, height: 6, borderRadius: 4, background: 'var(--panel-3)', overflow: 'hidden' }}><div style={{ width: (r.val / total * 100) + '%', height: '100%', background: seg.accent, borderRadius: 4 }} /></div><span className="num" style={{ fontSize: 11, color: 'var(--tx-3)', width: 30, textAlign: 'right' }}>{Math.round(r.val / total * 100)}%</span></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 18px', borderTop: '1px solid var(--line)', background: 'var(--panel-2)' }}>
              <span className="mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--tx-3)' }}>Total</span>
              <span className="num" style={{ fontWeight: 700, fontSize: 15 }}>{money(total, { cents: false })}</span>
            </div>
          </Panel>

          <Panel title="Ocupação por horário" sub="Hoje · % de slots reservados">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 128 }}>
              {occ.map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
                  <span className="num" style={{ fontSize: 9, color: v >= 90 ? seg.accent : 'var(--tx-3)' }}>{v}</span>
                  <div title={v + '%'} style={{ width: '100%', height: v, borderRadius: 4, background: v >= 90 ? seg.accent : 'var(--panel-3)', transition: '.3s' }}></div>
                  <span className="num" style={{ fontSize: 9, color: 'var(--tx-3)' }}>{hours[i]}h</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* direita */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Panel title="Canais de pagamento" sub="Como o cliente pagou">
            {channels.map(c => (
              <div key={c.name} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5 }}><span style={{ width: 11, height: 11, borderRadius: 3, background: c.c }}></span>{c.name}</span>
                  <span className="num" style={{ fontSize: 13.5, fontWeight: 600 }}>{money(c.val, { cents: false })} <span style={{ color: 'var(--tx-3)', fontWeight: 400 }}>{c.pct}%</span></span>
                </div>
                <div style={{ height: 8, borderRadius: 5, background: 'var(--panel-3)', overflow: 'hidden' }}><div style={{ width: c.pct + '%', height: '100%', background: c.c, borderRadius: 5 }} /></div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 16, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line-2)' }}>
              {[['whatsapp', 'WhatsApp', '88'], ['chat', 'SMS', '24'], ['mail', 'E-mail', '88']].map(([ic, l, n]) => (
                <div key={l} style={{ flex: 1, textAlign: 'center' }}>
                  <Icon name={ic} size={18} color="var(--tx-2)" style={{ margin: '0 auto' }} />
                  <div className="num" style={{ fontSize: 19, fontWeight: 600, marginTop: 6 }}>{n}</div>
                  <div className="mono" style={{ fontSize: 9, color: 'var(--tx-3)', textTransform: 'uppercase' }}>{l}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Top clientes" sub="Por valor no período" pad={false}>
            <div>
              {bi.top.map(([code, name, val], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 18px', borderTop: i ? '1px solid var(--line-2)' : 'none' }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--tx-3)', width: 16 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="code" style={{ color: 'var(--ac)', borderColor: 'color-mix(in srgb, var(--ac) 42%, transparent)', background: 'var(--ac-soft)' }}>{code}</span>
                  <span style={{ flex: 1, fontSize: 13.5 }}>{name}</span>
                  <span className="num" style={{ fontSize: 13.5, fontWeight: 600 }}>{money(val, { cents: false })}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Evolução · 12 semanas" sub="Faturamento semanal (R$ mil)">
            <TrendArea data={trend} accent={seg.accent} />
          </Panel>
        </div>
      </div>
    </div>
  );
}

function TrendArea({ data, accent }) {
  const w = 360, h = 90, max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / (max - min)) * (h - 14) - 7]);
  const line = pts.map(p => p.join(',')).join(' ');
  const area = `0,${h} ` + line + ` ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 90, display: 'block' }} preserveAspectRatio="none">
      <defs><linearGradient id="ta" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={accent} stopOpacity=".35" /><stop offset="1" stopColor={accent} stopOpacity="0" /></linearGradient></defs>
      <polygon points={area} fill="url(#ta)" />
      <polyline points={line} fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.filter((_, i) => i === pts.length - 1).map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill={accent} />)}
    </svg>
  );
}

// ── AGENDA (grade horários × recursos) ───────────────────────
function AgendaScreen({ seg }) {
  const [day, setDay] = React.useState(0);
  const hours = seg.slotKind === 'period' ? seg.periods.map(p => p.time) : Array.from({ length: 14 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);
  const busyAt = (ri, hi) => ((day * 5 + ri * 7 + hi * 3) % 10) < 4;
  const whoAt = (ri, hi) => USERS[(ri * 3 + hi + day) % USERS.length].name.split(' ')[0];

  return (
    <div className="scroll fade" style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 40px', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {DAYS.slice(0, 8).map(d => {
          const on = day === d.i;
          return <button key={d.i} onClick={() => setDay(d.i)} className={'chip' + (on ? ' active' : '')} style={{ padding: '9px 14px' }}><b style={{ fontWeight: 700 }}>{d.wd}</b> {d.day}/{DAYS[d.i].mo}</button>;
        })}
      </div>

      <Panel title={DAYS[day].full} sub={`${seg.resources.length} ${seg.noun.toLowerCase()}s · grade do dia`} pad={false} right={
        <div style={{ display: 'flex', gap: 14, fontSize: 11.5 }} className="mono">
          <span style={{ color: 'var(--tx-3)' }}><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, border: '1px solid var(--line)', verticalAlign: -1, marginRight: 5 }}></span>Livre</span>
          <span style={{ color: 'var(--tx-3)' }}><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: seg.accent, verticalAlign: -1, marginRight: 5 }}></span>Reservado</span>
        </div>}>
        <div style={{ overflowX: 'auto' }} className="scroll">
          <div style={{ display: 'grid', gridTemplateColumns: `72px repeat(${seg.resources.length}, minmax(150px,1fr))`, minWidth: 'min-content' }}>
            <div style={{ padding: '10px', borderBottom: '1px solid var(--line)' }}></div>
            {seg.resources.map(r => (
              <div key={r.id} style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)', borderLeft: '1px solid var(--line-2)' }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: 'var(--tx-3)' }}>{r.meta}</div>
              </div>
            ))}
            {hours.map((hh, hi) => (
              <React.Fragment key={hh}>
                <div className="num" style={{ padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: 12, color: 'var(--tx-3)', borderBottom: '1px solid var(--line-2)', minHeight: 50 }}>{hh}</div>
                {seg.resources.map((r, ri) => {
                  const busy = busyAt(ri, hi);
                  return (
                    <div key={r.id} style={{ borderBottom: '1px solid var(--line-2)', borderLeft: '1px solid var(--line-2)', padding: 5, minHeight: 50 }}>
                      {busy ? (
                        <div style={{ height: '100%', minHeight: 40, borderRadius: 7, background: 'var(--ac-soft-2)', borderLeft: `3px solid var(--ac)`, padding: '6px 9px' }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>{whoAt(ri, hi)}</div>
                          <div className="num" style={{ fontSize: 10, color: 'var(--tx-3)' }}>{money(hi >= 10 ? seg.peakPrice : seg.basePrice, { cents: false })}</div>
                        </div>
                      ) : (
                        <div className="emptycell" style={{ height: '100%', minHeight: 40, borderRadius: 7, border: '1px dashed var(--line)', display: 'grid', placeItems: 'center', color: 'var(--tx-3)', cursor: 'pointer' }}>
                          <Icon name="plus" size={14} color="var(--tx-3)" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}

window.Sidebar = Sidebar;
window.Topbar = Topbar;
window.KPI = KPI;
window.Panel = Panel;
window.DeltaPill = DeltaPill;
window.DashboardScreen = DashboardScreen;
window.AgendaScreen = AgendaScreen;
window.TrendArea = TrendArea;
window.OWNER_NAV = OWNER_NAV;
