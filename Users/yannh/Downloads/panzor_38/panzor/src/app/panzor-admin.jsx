// panzor-admin.jsx — Visão 1: Dono do Panzor (plataforma SaaS)
// Reusa KPI, Panel, DeltaPill, TrendArea (globais de owner-1)

const PZ_NAV = [
  { id: 'geral', label: 'Visão geral', icon: 'dash' },
  { id: 'empreendedores', label: 'Empreendedores', icon: 'users', badge: String(BUSINESSES.length) },
  { id: 'planos', label: 'Planos & receita', icon: 'money' },
  { id: 'mensagens', label: 'Mensageria', icon: 'chat' },
];

function PanzorSidebar({ active, onNav, ownerName, ownerEmail }) {
  return (
    <div style={{ width: 236, background: 'var(--bg-2)', flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '20px 14px', borderRight: '1px solid var(--line)' }}>
      <div style={{ padding: '0 8px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Mark size={32} />
        <div>
          <div style={{ fontFamily: "'Crimson Pro',serif", fontWeight: 600, fontSize: 20, color: 'var(--tx)', lineHeight: 1 }}>Panzor</div>
          <div className="mono" style={{ fontSize: 8.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--ac)', marginTop: 3 }}>console · plataforma</div>
        </div>
      </div>
      <div className="mono" style={{ fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--tx-3)', padding: '22px 10px 8px' }}>Plataforma</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {PZ_NAV.map(n => {
          const on = active === n.id;
          return (
            <button key={n.id} onClick={() => onNav(n.id)} style={{
              display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
              border: 'none', textAlign: 'left', fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: on ? 600 : 500,
              background: on ? 'var(--ac-soft)' : 'transparent', color: on ? 'var(--ac)' : 'var(--tx-2)', boxShadow: on ? 'inset 2px 0 0 var(--ac)' : 'none',
            }}>
              <Icon name={n.icon} size={18} color={on ? 'var(--ac)' : 'var(--tx-3)'} /> <span style={{ flex: 1 }}>{n.label}</span>
              {n.badge && <span className="mono" style={{ fontSize: 10.5, color: on ? 'var(--ac)' : 'var(--tx-3)', background: on ? 'var(--ac-soft-2)' : 'var(--panel-2)', padding: '2px 7px', borderRadius: 6 }}>{n.badge}</span>}
            </button>
          );
        })}
      </nav>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', borderTop: '1px solid var(--line)' }}>
        <span style={{ width: 34, height: 34, borderRadius: 99, background: 'var(--ac)', color: '#0a0b0d', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13 }}>{(ownerName||'YH').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}</span>
        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--tx)' }}>{ownerName || 'Dono'}</div><div style={{ fontSize: 10.5, color: 'var(--tx-3)' }}>{ownerEmail || ''}</div></div>
      </div>
    </div>
  );
}

function statusBadge(s) {
  const map = { Ativo: ['var(--up-bg)', 'var(--up)'], Trial: ['var(--info-bg)', 'var(--info)'], Inadimplente: ['var(--down-bg)', 'var(--down)'] };
  const [bg, c] = map[s] || ['var(--panel-2)', 'var(--tx-2)'];
  return <span style={{ fontSize: 11.5, fontWeight: 600, padding: '3px 9px', borderRadius: 6, background: bg, color: c }} className="mono">{s}</span>;
}

function PanzorAdmin({ businesses, ownerName, ownerEmail } = {}) {
  const BUSINESSES = (businesses && businesses.length) ? businesses : window.BUSINESSES;
  const [tab, setTab] = React.useState('geral');
  const M = typeof window !== 'undefined' && window.innerWidth < 700;
  const [q, setQ] = React.useState('');
  const mrr = BUSINESSES.filter(b => b.status !== 'Inadimplente').reduce((a, b) => a + b.mrr, 0);
  const ativos = BUSINESSES.filter(b => b.status === 'Ativo').length;
  const reservas = BUSINESSES.reduce((a, b) => a + b.reservas, 0);
  const gmv = reservas * 104; // ticket médio plataforma
  const trend = [12, 14, 15, 18, 21, 24, 26, 29, 31, 33, 36, mrr / 1000 + 2];

  const byPlan = PLANS.map(p => {
    const bs = BUSINESSES.filter(b => b.plan === p.name);
    return { name: p.name, count: bs.length, mrr: bs.reduce((a, b) => a + b.mrr, 0), c: p.accentVar };
  });
  const segs = [['Quadras', 'court'], ['Beleza', 'scissors'], ['Festas', 'party']].map(([name, icon]) => ({ name, icon, count: BUSINESSES.filter(b => b.seg === name).length }));
  const rows = BUSINESSES.filter(b => b.name.toLowerCase().includes(q.toLowerCase()));

  const titles = { geral: 'Visão geral', empreendedores: 'Empreendedores', planos: 'Planos & receita', mensagens: 'Mensageria' };
  const NAV = [['geral','dash'],['empreendedores','users'],['planos','money'],['mensagens','chat']];

  return (
    <div style={{ display: 'flex', flexDirection: M ? 'column' : 'row', height: '100%', background: 'var(--bg)' }}>
      {!M && <PanzorSidebar active={tab} onNav={setTab} ownerName={ownerName} ownerEmail={ownerEmail} />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {M && (
          <div style={{ display: 'flex', gap: 6, padding: '10px 12px', borderBottom: '1px solid var(--line)', background: 'var(--bg-2)', overflowX: 'auto' }}>
            {NAV.map(([k, ic]) => <button key={k} onClick={() => setTab(k)} className={tab === k ? 'chip active' : 'chip'} style={{ flexShrink: 0, fontSize: 12 }}><Icon name={ic} size={13} color={tab === k ? '#0a0b0d' : 'var(--tx-2)'} /> {titles[k]}</button>)}
          </div>
        )}
        {/* topbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: M ? '10px 14px' : '14px 24px', borderBottom: '1px solid var(--line)', background: 'var(--bg-2)' }}>
          <div className="mono" style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--tx-3)' }}>Plataforma <span style={{ margin: '0 6px' }}>/</span> <span style={{ color: 'var(--tx)' }}>{titles[tab]}</span></div>
          {!M && <><div style={{ flex: 1, maxWidth: 360, display: 'flex', alignItems: 'center', gap: 9, background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 10, padding: '9px 13px', marginLeft: 'auto' }}>
            <Icon name="users" size={15} color="var(--tx-3)" /><span style={{ flex: 1, color: 'var(--tx-3)', fontSize: 13 }}>Buscar empreendedores…</span>
          </div>
          <span className="pill"><Icon name="calendar" size={13} color="var(--tx-2)" /> Jun · 2026</span></>}
        </div>

        {tab === 'planos' ? <PlanosView byPlan={byPlan} mrr={mrr} /> : (
          <div className="scroll fade" style={{ flex: 1, overflowY: 'auto', padding: M ? '14px 12px 40px' : '20px 24px 40px' }}>
            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: M ? 'repeat(2,1fr)' : 'repeat(5,1fr)', gap: 12 }}>
              <KPI label="MRR" value={money(mrr, { cents: false })} delta={14.2} sub="receita recorrente" icon="trend" accent="var(--ac)" />
              <KPI label="Empreendedores" value={String(BUSINESSES.length)} delta={2} sub={`${ativos} ativos`} icon="users" />
              <KPI label="Reservas processadas" value={(reservas / 1000).toFixed(1).replace('.', ',') + 'k'} delta={9.7} sub="no mês" icon="calendar" accent="var(--ac)" />
              <KPI label="GMV transacionado" value={money(gmv, { cents: false })} delta={12.1} sub="volume bruto" icon="money" />
              <KPI label="Churn" value="2,1%" delta={-0.4} invert sub="pts · melhor" icon="shield" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : '1.5fr 1fr', gap: 14, marginTop: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Panel title="Empreendedores contratantes" sub={`${BUSINESSES.length} contas · ordenado por MRR`} right={<span className="chip" style={{ fontSize: 12 }}><Icon name="filter" size={13} /> Todos</span>} pad={false}>
                  <div style={{ overflowX: 'auto' }}>
                  <table className="dtable">
                    <thead><tr><th>Empreendedor</th><th>Segmento</th><th>Plano</th><th style={{ textAlign: 'right' }}>Reservas</th><th style={{ textAlign: 'right' }}>MRR</th><th>Status</th></tr></thead>
                    <tbody>
                      {BUSINESSES.slice().sort((a, b) => b.mrr - a.mrr).map(b => (
                        <tr key={b.code}>
                          <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span className="code" style={{ color: 'var(--ac)', borderColor: 'color-mix(in srgb, var(--ac) 42%, transparent)', background: 'var(--ac-soft)' }}>{b.code}</span><div><div style={{ fontWeight: 600 }}>{b.name}</div><div style={{ fontSize: 11, color: 'var(--tx-3)' }}>{b.city}</div></div></div></td>
                          <td style={{ color: 'var(--tx-2)' }}>{b.seg}</td>
                          <td><span className="mono" style={{ fontSize: 12 }}>{b.plan}</span></td>
                          <td className="num" style={{ textAlign: 'right', color: 'var(--tx-2)' }}>{b.reservas.toLocaleString('pt-BR')}</td>
                          <td className="num" style={{ textAlign: 'right', fontWeight: 600 }}>{money(b.mrr, { cents: false })}</td>
                          <td>{statusBadge(b.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </Panel>
                <Panel title="MRR · 12 meses" sub="receita recorrente mensal (R$ mil)"><TrendArea data={trend} accent="var(--ac)" /></Panel>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Panel title="Receita por plano">
                  {byPlan.map(p => (
                    <div key={p.name} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5 }}><span style={{ width: 11, height: 11, borderRadius: 3, background: p.c }}></span>{p.name} <span style={{ color: 'var(--tx-3)' }}>· {p.count}</span></span>
                        <span className="num" style={{ fontWeight: 600, fontSize: 13.5 }}>{money(p.mrr, { cents: false })}</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 5, background: 'var(--panel-3)', overflow: 'hidden' }}><div style={{ width: (p.mrr / mrr * 100) + '%', height: '100%', background: p.c, borderRadius: 5 }} /></div>
                    </div>
                  ))}
                </Panel>
                <Panel title="Empreendedores por segmento" pad={false}>
                  {segs.map((s, i) => (
                    <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', borderTop: i ? '1px solid var(--line-2)' : 'none' }}>
                      <span style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--panel-2)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center' }}><Icon name={s.icon} size={18} color="var(--ac)" /></span>
                      <span style={{ flex: 1, fontSize: 14 }}>{s.name}</span>
                      <div style={{ width: 90, height: 6, borderRadius: 4, background: 'var(--panel-3)', overflow: 'hidden' }}><div style={{ width: (s.count / BUSINESSES.length * 100) + '%', height: '100%', background: 'var(--ac)', borderRadius: 4 }} /></div>
                      <span className="num" style={{ width: 22, textAlign: 'right', fontWeight: 600 }}>{s.count}</span>
                    </div>
                  ))}
                </Panel>
                <Panel title="Saúde da carteira" pad={false}>
                  {[['Ativos', ativos, 'var(--up)'], ['Trial', BUSINESSES.filter(b => b.status === 'Trial').length, 'var(--info)'], ['Inadimplentes', BUSINESSES.filter(b => b.status === 'Inadimplente').length, 'var(--down)']].map(([l, n, c], i) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderTop: i ? '1px solid var(--line-2)' : 'none' }}>
                      <span style={{ width: 9, height: 9, borderRadius: 9, background: c }}></span><span style={{ flex: 1, fontSize: 13.5 }}>{l}</span><span className="num" style={{ fontWeight: 600 }}>{n}</span>
                    </div>
                  ))}
                </Panel>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PlanosView({ byPlan, mrr }) {
  return (
    <div className="scroll fade" style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {PLANS.map(p => (
          <div key={p.id} className="panel" style={{ padding: 22, boxShadow: 'none', position: 'relative', borderColor: p.popular ? 'var(--ac)' : 'var(--line)' }}>
            {p.popular && <span className="mono" style={{ position: 'absolute', top: -10, left: 22, fontSize: 10, background: 'var(--ac)', color: '#0a0b0d', padding: '3px 9px', borderRadius: 6, letterSpacing: '.08em', textTransform: 'uppercase' }}>{p.tag}</span>}
            <div style={{ fontFamily: "'Crimson Pro',serif", fontWeight: 600, fontSize: 24 }}>{p.name}</div>
            <div className="num" style={{ fontSize: 34, fontWeight: 500, marginTop: 6 }}>{money(p.price, { cents: false })}<span style={{ fontSize: 14, color: 'var(--tx-3)' }} className="mono"> /mês</span></div>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {p.feats.map(f => <div key={f} style={{ display: 'flex', gap: 9, alignItems: 'center', fontSize: 13.5, color: 'var(--tx-2)' }}><Icon name="check" size={15} color={p.accentVar} /> {f}</div>)}
            </div>
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--line-2)', display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--tx-3)' }}>
              <span>{byPlan.find(b => b.name === p.name).count} contas</span>
              <span className="num" style={{ color: 'var(--tx)', fontWeight: 600 }}>{money(byPlan.find(b => b.name === p.name).mrr, { cents: false })}/mês</span>
            </div>
          </div>
        ))}
      </div>
      <div className="panel" style={{ marginTop: 14, padding: 22, boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div><div className="kicker">receita recorrente total</div><div className="num serif" style={{ fontSize: 38, marginTop: 6 }}>{money(mrr, { cents: false })}<span style={{ fontSize: 16, color: 'var(--tx-3)' }} className="mono"> /mês</span></div></div>
        <div style={{ textAlign: 'right', fontSize: 13, color: 'var(--tx-2)', lineHeight: 1.6 }}>Projeção 12 meses<br /><span className="num serif" style={{ fontSize: 22, color: 'var(--ac)' }}>{money(mrr * 12, { cents: false })}</span></div>
      </div>
    </div>
  );
}

window.PanzorAdmin = PanzorAdmin;
