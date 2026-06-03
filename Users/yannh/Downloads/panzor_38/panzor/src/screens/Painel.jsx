// Painel.jsx — workspace do empreendedor. Dados reais, sem demo.
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { api, helpers } from '../lib/db.js'
import { Brand, Icon, money, useWide } from './shared.jsx'
import { Splash } from './Dono.jsx'
import { getAppearance, setAppearance, subscribe } from '../lib/appearance.js'

function statusPill(s) {
  const map = { Ativo: ['var(--up-bg)', 'var(--up)'], Trial: ['var(--info-bg)', 'var(--info)'], Inadimplente: ['var(--down-bg)', 'var(--down)'] };
  const [bg, c] = map[s] || ['var(--panel-2)', 'var(--tx-2)'];
  return <span className="mono" style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 5, background: bg, color: c }}>{s}</span>;
}
function Toggle({ on, onClick }) {
  return <button onClick={onClick} style={{ width: 42, height: 24, borderRadius: 99, border: '1px solid var(--line)', background: on ? 'var(--ac)' : 'var(--panel-3)', position: 'relative', cursor: 'pointer', transition: '.15s', flexShrink: 0 }}>
    <span style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 18, height: 18, borderRadius: 99, background: '#fff', transition: '.15s' }} /></button>;
}
function EmptySection({ icon, title, sub }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center' }}>
      <span style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--panel-2)', border: '1px solid var(--line)', display: 'inline-grid', placeItems: 'center', marginBottom: 14 }}>
        <Icon name={icon} size={26} color="var(--tx-3)" /></span>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tx)', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13.5, color: 'var(--tx-2)', lineHeight: 1.6, maxWidth: 320, margin: '0 auto' }}>{sub}</div>
    </div>
  );
}

const NAV = [
  { id: 'operacao', label: 'Operação', icon: 'list', group: null },
  { id: '_analises', label: 'ANÁLISES', group: 'header' },
  { id: 'bi-geral',    label: 'Visão geral',      icon: 'dash',     group: 'analises' },
  { id: 'bi-agenda',   label: 'Agenda',            icon: 'calendar', group: 'analises' },
  { id: 'bi-clientes', label: 'Clientes',          icon: 'users',    group: 'analises' },
  { id: 'bi-valores',  label: 'Valores & repasse', icon: 'money',    group: 'analises' },
  { id: '_mais', label: 'MAIS', group: 'header' },
  { id: 'link',   label: 'Meu link',       icon: 'pin',  group: 'mais' },
  { id: 'config', label: 'Configurações',  icon: 'gear', group: 'mais' },
  { id: '_gestao', label: 'GESTÃO', group: 'header' },
  { id: 'funcionarios', label: 'Funcionários', icon: 'users',    group: 'gestao' },
  { id: 'horarios',     label: 'Horários',     icon: 'calendar', group: 'gestao' },
];

export default function Painel() {
  const nav = useNavigate();
  const [biz, setBiz] = React.useState(undefined);
  const [sess, setSess] = React.useState(null);
  const [bookings, setBookings] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const [tab, setTab] = React.useState('operacao');
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [layout, setLayout] = React.useState(getAppearance().layout);
  const wide = useWide(768);

  React.useEffect(() => subscribe(s => setLayout(s.layout)), []);

  const reload = (id) => Promise.all([api.book.listFor(id), api.cust.listFor(id)]).then(([b, c]) => { setBookings(b); setCustomers(c); });

  React.useEffect(() => {
    api.auth.session().then((s) => {
      if (!s || s.role !== 'entrepreneur') { nav('/entrar'); return; }
      if (!s.businessId) { nav('/contratar'); return; }
      setSess(s);
      api.biz.byId(s.businessId).then((b) => { if (!b) { nav('/contratar'); return; } setBiz(b); reload(b.id); });
    });
  }, []);

  if (biz === undefined) return <Splash />;

  const seg = window.SEGMENTS[biz.segment];
  const link = `${window.location.origin}/b/${biz.slug}`;
  const fee = biz.config.fee;
  const chargeCancel = biz.config.chargeCancel !== false;

  const setFee = (v) => { setBiz(b => ({ ...b, config: { ...b.config, fee: v } })); api.biz.updateConfig(biz.id, { fee: v }); };
  const setWindow = (v) => { setBiz(b => ({ ...b, config: { ...b.config, window: v } })); api.biz.updateConfig(biz.id, { window: v }); };
  const toggleCh = (k) => { const ch = { ...biz.config.channels, [k]: !biz.config.channels[k] }; setBiz(b => ({ ...b, config: { ...b.config, channels: ch } })); api.biz.updateConfig(biz.id, { channels: ch }); };
  const toggleCC = () => { const v = !chargeCancel; setBiz(b => ({ ...b, config: { ...b.config, chargeCancel: v } })); api.biz.updateConfig(biz.id, { chargeCancel: v }); };
  const setLogo = (v) => { setBiz(b => ({ ...b, config: { ...b.config, logo: v } })); api.biz.updateConfig(biz.id, { logo: v }); };
  const copy = () => { navigator.clipboard?.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1600); };
  const logout = async () => { try { await api.auth.logout(); } catch(e) {} window.location.replace('/'); };
  const selectLayout = (v) => { setLayout(v); setAppearance({ layout: v }); };
  const handleNav = (id) => { setTab(id); setMobileOpen(false); };

  const fat = bookings.reduce((a, b) => a + (b.price || 0), 0);
  const online = bookings.filter(b => b.pay === 'online').length;
  const ticket = bookings.length ? Math.round(fat / bookings.length) : 0;
  const KPI = window.KPI, Panel = window.Panel;
  const isBI = tab.startsWith('bi-');
  const biTabMap = { 'bi-geral': 'geral', 'bi-agenda': 'agenda', 'bi-clientes': 'clientes', 'bi-valores': 'valores' };

  // ── SIDEBAR ─────────────────────────────────────────────
  const Sidebar = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-2)', borderRight: '1px solid var(--line)' }}>

      {/* Logo Panzor — sempre visível */}
      <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
        <Brand size={17} />
      </div>

      {/* Negócio */}
      <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          {biz.config.logo
            ? <img src={biz.config.logo} style={{ width: 32, height: 32, borderRadius: 9, objectFit: 'cover', flexShrink: 0 }} alt="" />
            : <span style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--ac)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={seg.icon} size={17} color="#0a0b0d" /></span>
          }
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{biz.name}</div>
            <div style={{ marginTop: 2 }}>{statusPill(biz.status)}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '6px 8px', overflowY: 'auto' }}>
        {NAV.map(item => {
          if (item.group === 'header') return (
            <div key={item.id} className="mono" style={{ fontSize: 9.5, letterSpacing: '.12em', color: 'var(--tx-3)', padding: '12px 8px 3px', textTransform: 'uppercase' }}>{item.label}</div>
          );
          const on = tab === item.id;
          return (
            <button key={item.id} onClick={() => handleNav(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', width: '100%',
              borderRadius: 10, cursor: 'pointer', marginBottom: 1, border: 'none',
              fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: on ? 600 : 500,
              background: on ? 'var(--ac-soft)' : 'transparent', color: on ? 'var(--ac)' : 'var(--tx-2)', transition: '.12s',
              minHeight: 40,
            }}>
              <Icon name={item.icon} size={16} color={on ? 'var(--ac)' : 'var(--tx-3)'} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Rodapé — usuário real */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--line)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ width: 30, height: 30, borderRadius: 99, background: 'var(--ac)', color: '#0a0b0d', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
            {(sess?.name || sess?.email || 'U')[0].toUpperCase()}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sess?.name || sess?.email || '—'}</div>
            <div style={{ fontSize: 10.5, color: 'var(--tx-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sess?.email || ''}</div>
          </div>
          <button onClick={logout} title="Sair" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, minWidth: 32, minHeight: 32 }}>
            <Icon name="arrowL" size={16} color="var(--tx-2)" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>

      {wide && <aside style={{ width: 220, flexShrink: 0 }}><Sidebar /></aside>}

      {!wide && mobileOpen && <>
        <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 40 }} />
        <aside style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 260, zIndex: 50 }}><Sidebar /></aside>
      </>}

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* topbar */}
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--line)', background: 'var(--bg-2)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, minHeight: 48 }}>
          {!wide && (
            <button onClick={() => setMobileOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, minWidth: 36, minHeight: 36 }}>
              <Icon name="list" size={20} color="var(--tx-2)" />
            </button>
          )}
          <span className="mono" style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--tx-2)' }}>
            {NAV.find(n => n.id === tab)?.label || 'Painel'}
          </span>
          {tab === 'operacao' && (
            <button className="chip" style={{ fontSize: 12, marginLeft: 'auto', minHeight: 34 }} onClick={() => reload(biz.id)}>
              <Icon name="trend" size={13} /> Atualizar
            </button>
          )}
        </div>

        <div className="scroll" style={{ flex: 1, overflowY: 'auto', padding: wide ? '20px 24px 60px' : '14px 14px 60px' }}>

          {/* ── OPERAÇÃO ── */}
          {tab === 'operacao' && (
            <div className="fade">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12 }}>
                <KPI label="Reservas" value={String(bookings.length)} sub="pelo link" icon="calendar" accent="var(--ac)" />
                <KPI label="Faturamento" value={money(fat, { cents: false })} sub="soma" icon="money" />
                <KPI label="Ticket médio" value={money(ticket, { cents: false })} sub="por reserva" icon="trend" accent="var(--ac)" />
                <KPI label="Pagas online" value={String(online)} sub={`${bookings.length - online} no local`} icon="card" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: wide ? '1.6fr 1fr' : '1fr', gap: 14, marginTop: 14 }}>
                <Panel title="Reservas recebidas" sub={`${bookings.length} no total`} pad={false}>
                  {bookings.length === 0
                    ? <EmptySection icon="calendar" title="Nenhuma reserva ainda" sub="Compartilhe seu link com clientes para receber a primeira reserva." />
                    : <div style={{ overflowX: 'auto' }}><table className="dtable">
                        <thead><tr><th>Data</th><th>Horário</th><th>Cliente</th><th>Pgto</th><th style={{ textAlign: 'right' }}>Valor</th></tr></thead>
                        <tbody>{bookings.map(b => (
                          <tr key={b.id}>
                            <td style={{ color: 'var(--tx-2)' }}>{window.DAYS?.[b.date]?.full || '—'}</td>
                            <td className="num">{b.slot}</td>
                            <td>{b.customer?.name || 'Cliente'}</td>
                            <td><span className="mono" style={{ fontSize: 11, color: b.pay === 'online' ? 'var(--up)' : 'var(--tx-2)' }}>{b.pay === 'online' ? 'online' : 'local'}</span></td>
                            <td className="num" style={{ textAlign: 'right', fontWeight: 600 }}>{money(b.price, { cents: false })}</td>
                          </tr>
                        ))}</tbody>
                      </table></div>
                  }
                </Panel>
                {wide && (
                  <Panel title="Config. rápida">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <Toggle on={chargeCancel} onClick={toggleCC} />
                      <span style={{ fontSize: 13.5 }}>Taxa cancelamento {chargeCancel ? `${fee}%` : '— inativa'}</span>
                    </div>
                    <div className="rule" style={{ margin: '12px 0' }} />
                    <div className="kicker" style={{ marginBottom: 8 }}>Canais de aviso</div>
                    {[['wpp', 'whatsapp', 'WhatsApp'], ['sms', 'chat', 'SMS'], ['email', 'mail', 'E-mail']].map(([k, ic, l]) => (
                      <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0' }}>
                        <Icon name={ic} size={16} color="var(--tx-2)" /><span style={{ flex: 1, fontSize: 13 }}>{l}</span><Toggle on={biz.config.channels[k]} onClick={() => toggleCh(k)} />
                      </div>
                    ))}
                  </Panel>
                )}
              </div>
            </div>
          )}

          {/* ── ANÁLISES (dados reais) ── */}
          {isBI && <AnalyticsSection tab={biTabMap[tab]} bookings={bookings} customers={customers} fat={fat} online={online} ticket={ticket} seg={seg} wide={wide} link={link} />}

          {/* ── MEU LINK ── */}
          {tab === 'link' && (
            <div className="fade">
              <Panel title="Seu link de reservas" sub="Compartilhe com clientes — é por aqui que eles marcam horário.">
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                  <div className="mono" style={{ flex: 1, minWidth: 160, display: 'flex', alignItems: 'center', padding: '11px 13px', borderRadius: 11, background: 'var(--panel-2)', border: '1px solid var(--line)', fontSize: 13, color: 'var(--tx)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{link}</div>
                  <button className="btn btn-dark" style={{ minHeight: 44 }} onClick={copy}><Icon name={copied ? 'check' : 'edit'} size={15} color={copied ? 'var(--up)' : 'var(--tx)'} /> {copied ? 'Copiado!' : 'Copiar'}</button>
                  <a className="btn btn-primary" href={link} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', minHeight: 44 }}>Abrir <Icon name="arrowR" size={15} color="#06120d" /></a>
                </div>
              </Panel>
            </div>
          )}

          {/* ── FUNCIONÁRIOS ── */}
          {tab === 'funcionarios' && <FuncionariosSection bizId={biz.id} seg={seg} />}

          {/* ── HORÁRIOS ── */}
          {tab === 'horarios' && <HorariosSection bizId={biz.id} />}


          {tab === 'config' && (
            <div className="fade">
              <div style={{ display: 'grid', gridTemplateColumns: wide ? '1fr 1fr' : '1fr', gap: 14 }}>

                <Panel title="Logo do negócio" sub="Aparece no topo do painel.">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                    <div style={{ width: 72, height: 72, borderRadius: 16, background: 'var(--panel-2)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      {biz.config.logo ? <img src={biz.config.logo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="logo" /> : <Icon name={seg.icon} size={30} color="var(--tx-3)" />}
                    </div>
                    <div>
                      <label className="btn btn-ghost" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 44 }}>
                        <Icon name="edit" size={15} /> Enviar logo
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                          const f = e.target.files[0]; if (!f) return;
                          const r = new FileReader();
                          r.onload = (ev) => setLogo(ev.target.result);
                          r.readAsDataURL(f);
                        }} />
                      </label>
                      {biz.config.logo && <button className="btn btn-ghost" style={{ marginLeft: 8, color: 'var(--down)', minHeight: 44 }} onClick={() => setLogo(null)}>Remover</button>}
                      <p style={{ fontSize: 12, color: 'var(--tx-2)', margin: '8px 0 0' }}>PNG ou JPG · recomendado 400×400px</p>
                    </div>
                  </div>
                </Panel>

                <Panel title="Taxa de cancelamento">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <Toggle on={chargeCancel} onClick={toggleCC} />
                    <span style={{ fontSize: 14, color: 'var(--tx-2)' }}>{chargeCancel ? 'Ativa' : 'Desativada'}</span>
                  </div>
                  {chargeCancel && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <input type="range" min="0" max="100" value={fee} onChange={(e) => setFee(parseInt(e.target.value))} style={{ flex: 1 }} />
                      <span className="serif" style={{ fontSize: 24, width: 56, textAlign: 'right' }}>{fee}%</span>
                    </div>
                  )}
                  <div className="rule" style={{ margin: '14px 0' }} />
                  <div className="kicker" style={{ marginBottom: 8 }}>Janela</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[12, 24, 48].map((h) => <button key={h} className={'chip' + (biz.config.window === h ? ' active' : '')} style={{ minHeight: 36 }} onClick={() => setWindow(h)}>{h}h antes</button>)}
                  </div>
                </Panel>

                <Panel title="Canais de aviso">
                  {[['wpp', 'whatsapp', 'WhatsApp'], ['sms', 'chat', 'SMS'], ['email', 'mail', 'E-mail']].map(([k, ic, l]) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--line)', minHeight: 44 }}>
                      <Icon name={ic} size={18} color="var(--tx-2)" /><span style={{ flex: 1, fontSize: 14 }}>{l}</span><Toggle on={biz.config.channels[k]} onClick={() => toggleCh(k)} />
                    </div>
                  ))}
                </Panel>

                {/* Endereço */}
                <Panel title="Endereço do negócio" sub="Aparece na página de reservas dos clientes.">
                  <div className="field" style={{ marginBottom: 0 }}>
                    <input
                      value={biz.config.address || ''}
                      onChange={(e) => setBiz(b => ({ ...b, config: { ...b.config, address: e.target.value } }))}
                      onBlur={(e) => api.biz.updateConfig(biz.id, { address: e.target.value })}
                      placeholder="Ex: Rua das Flores, 123 — São Paulo"
                      style={{ width: '100%' }}
                    />
                  </div>
                </Panel>

                {/* Serviços */}
                <ServicosConfig
                  services={biz.config.services || []}
                  onChange={(svcs) => { setBiz(b => ({ ...b, config: { ...b.config, services: svcs } })); api.biz.updateConfig(biz.id, { services: svcs }); }}
                />

                <Panel title="Layout dos horários na página pública" sub="Afeta como clientes veem os horários disponíveis no celular.">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 12 }}>
                    {[
                      ['grade', 'Grade', 3],
                      ['lista', 'Lista', 1],
                      ['compacto', 'Compacto', 4],
                    ].map(([k, l, cols]) => {
                      const SLOTS = ['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00'];
                      const shown = k === 'compacto' ? 8 : k === 'lista' ? 4 : 6;
                      const on = layout === k;
                      return (
                        <button key={k} onClick={() => selectLayout(k)} style={{
                          border: `2px solid ${on ? 'var(--ac)' : 'var(--line)'}`, borderRadius: 12, padding: '10px 8px', cursor: 'pointer',
                          background: on ? 'var(--ac-soft)' : 'var(--panel-2)', transition: '.12s',
                        }}>
                          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 3, marginBottom: 8 }}>
                            {SLOTS.slice(0, shown).map((s, i) => (
                              <div key={i} style={{
                                borderRadius: 5, padding: cols === 1 ? '3px 6px' : '4px 2px', fontSize: cols === 1 ? 9 : 8,
                                textAlign: 'center', fontFamily: "'DM Mono',monospace",
                                background: i === 1 ? 'var(--ac)' : 'var(--panel-3)', color: i === 1 ? '#0a0b0d' : 'var(--tx-2)',
                                whiteSpace: 'nowrap', overflow: 'hidden',
                              }}>{s}</div>
                            ))}
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: on ? 'var(--ac)' : 'var(--tx)' }}>{l}</div>
                        </button>
                      );
                    })}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--tx-2)' }}>
                    Abra <a href={link} target="_blank" rel="noreferrer" style={{ color: 'var(--ac)', fontWeight: 600 }}>seu link</a> para ver o resultado no celular.
                  </p>
                </Panel>

              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// ── ANALYTICS COM DADOS REAIS ─────────────────────────────────────────────────
function AnalyticsSection({ tab, bookings, customers, fat, online, ticket, seg, wide, link }) {
  const KPI = window.KPI, Panel = window.Panel;

  if (bookings.length === 0 && tab !== 'clientes') {
    return (
      <div className="fade" style={{ textAlign: 'center', padding: '60px 24px' }}>
        <EmptySection icon="dash" title="Sem dados ainda"
          sub={<>Compartilhe seu link com clientes para receber reservas e ver os dados aqui.<br /><br /><a href={link} target="_blank" rel="noreferrer" style={{ color: 'var(--ac)', fontWeight: 600 }}>Abrir link de reservas →</a></>} />
      </div>
    );
  }

  if (tab === 'clientes' && customers.length === 0) {
    return <div className="fade"><EmptySection icon="users" title="Nenhum cliente ainda" sub="Os clientes que reservarem pelo link serão exibidos aqui automaticamente." /></div>;
  }

  // ── Visão Geral ──
  if (tab === 'geral') {
    // Agrupa por recurso/serviço
    const byResource = {};
    bookings.forEach(b => {
      const key = b.resourceName || b.service || 'Sem nome';
      if (!byResource[key]) byResource[key] = { reservas: 0, fat: 0 };
      byResource[key].reservas++;
      byResource[key].fat += (b.price || 0);
    });
    const topRes = Object.entries(byResource).sort((a, b) => b[1].fat - a[1].fat).slice(0, 6);
    const pctOnline = bookings.length ? Math.round((online / bookings.length) * 100) : 0;

    return (
      <div className="fade">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 16 }}>
          <KPI label="Faturamento" value={money(fat, { cents: false })} sub="total acumulado" icon="money" accent="var(--ac)" />
          <KPI label="Reservas" value={String(bookings.length)} sub="realizadas" icon="calendar" />
          <KPI label="Ticket médio" value={money(ticket, { cents: false })} sub="por reserva" icon="trend" accent="var(--ac)" />
          <KPI label="Pagas online" value={`${pctOnline}%`} sub={`${online} de ${bookings.length}`} icon="card" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: wide ? '1.6fr 1fr' : '1fr', gap: 14 }}>
          <Panel title={`Top ${seg.noun}s / Serviços`} sub="Por faturamento acumulado" pad={false}>
            <table className="dtable">
              <thead><tr><th>{seg.noun}</th><th>Reservas</th><th style={{ textAlign: 'right' }}>Faturamento</th></tr></thead>
              <tbody>{topRes.map(([k, v]) => (
                <tr key={k}><td style={{ fontWeight: 600 }}>{k}</td><td className="num">{v.reservas}</td><td className="num" style={{ textAlign: 'right' }}>{money(v.fat, { cents: false })}</td></tr>
              ))}</tbody>
            </table>
          </Panel>
          <Panel title="Canais de pagamento">
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--tx-2)' }}>Online</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{pctOnline}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 99, background: 'var(--panel-3)', overflow: 'hidden' }}>
                <div style={{ width: `${pctOnline}%`, height: '100%', background: 'var(--ac)', borderRadius: 99 }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--tx-2)' }}>No local</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{100 - pctOnline}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 99, background: 'var(--panel-3)', overflow: 'hidden' }}>
                <div style={{ width: `${100 - pctOnline}%`, height: '100%', background: 'var(--info)', borderRadius: 99 }} />
              </div>
            </div>
          </Panel>
        </div>
      </div>
    );
  }

  // ── Agenda ──
  if (tab === 'agenda') {
    const byDate = {};
    bookings.forEach(b => {
      const d = b.date ?? 0;
      if (!byDate[d]) byDate[d] = [];
      byDate[d].push(b);
    });
    const days = window.DAYS || {};
    return (
      <div className="fade">
        {Object.entries(byDate).sort(([a], [b]) => Number(a) - Number(b)).map(([d, bks]) => (
          <Panel key={d} title={days[Number(d)]?.full || `Dia ${d}`} sub={`${bks.length} reserva${bks.length > 1 ? 's' : ''}`} pad={false} style={{ marginBottom: 14 }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="dtable">
                <thead><tr><th>Horário</th><th>{seg.noun}</th><th>Cliente</th><th>Pgto</th><th style={{ textAlign: 'right' }}>Valor</th></tr></thead>
                <tbody>{bks.map(b => (
                  <tr key={b.id}>
                    <td className="num">{b.slot}</td>
                    <td>{b.resourceName || '—'}{b.service ? ` · ${b.service}` : ''}</td>
                    <td>{b.customer?.name || 'Cliente'}</td>
                    <td><span className="mono" style={{ fontSize: 11, color: b.pay === 'online' ? 'var(--up)' : 'var(--tx-2)' }}>{b.pay === 'online' ? 'online' : 'local'}</span></td>
                    <td className="num" style={{ textAlign: 'right', fontWeight: 600 }}>{money(b.price, { cents: false })}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Panel>
        ))}
      </div>
    );
  }

  // ── Clientes ──
  if (tab === 'clientes') {
    return (
      <div className="fade">
        <Panel title="Clientes" sub={`${customers.length} cadastrados`} pad={false}>
          <div style={{ overflowX: 'auto' }}>
            <table className="dtable">
              <thead><tr><th>Nome</th><th>Contato</th><th>CPF</th><th>Origem</th></tr></thead>
              <tbody>{customers.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td style={{ color: 'var(--tx-2)' }}>{c.phone || c.email || '—'}</td>
                  <td className="num" style={{ color: 'var(--tx-2)' }}>{c.cpf || '—'}</td>
                  <td><span className="mono" style={{ fontSize: 11, color: 'var(--tx-2)' }}>{c.via}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </Panel>
      </div>
    );
  }

  // ── Valores & Repasse ──
  if (tab === 'valores') {
    const fatOnline = bookings.filter(b => b.pay === 'online').reduce((a, b) => a + (b.price || 0), 0);
    const fatLocal = fat - fatOnline;
    const byRes = {};
    bookings.forEach(b => {
      const key = b.resourceName || b.service || 'Outros';
      if (!byRes[key]) byRes[key] = 0;
      byRes[key] += (b.price || 0);
    });
    return (
      <div className="fade">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 16 }}>
          <KPI label="Total" value={money(fat, { cents: false })} sub="acumulado" icon="money" accent="var(--ac)" />
          <KPI label="Online" value={money(fatOnline, { cents: false })} sub={`${online} reservas`} icon="card" />
          <KPI label="No local" value={money(fatLocal, { cents: false })} sub={`${bookings.length - online} reservas`} icon="money" />
          <KPI label="Ticket médio" value={money(ticket, { cents: false })} sub="por reserva" icon="trend" accent="var(--ac)" />
        </div>
        <Panel title={`Faturamento por ${seg.noun.toLowerCase()}`} pad={false}>
          <table className="dtable">
            <thead><tr><th>{seg.noun}</th><th style={{ textAlign: 'right' }}>Faturamento</th><th style={{ textAlign: 'right' }}>Share</th></tr></thead>
            <tbody>{Object.entries(byRes).sort((a,b) => b[1]-a[1]).map(([k,v]) => (
              <tr key={k}><td style={{ fontWeight: 600 }}>{k}</td><td className="num" style={{ textAlign: 'right' }}>{money(v, { cents: false })}</td><td className="num" style={{ textAlign: 'right', color: 'var(--tx-2)' }}>{fat > 0 ? Math.round(v/fat*100) : 0}%</td></tr>
            ))}</tbody>
          </table>
        </Panel>
      </div>
    );
  }

  return null;
}

// ── Gerenciamento de Serviços ─────────────────────────────────────────────────
function ServicosConfig({ services, onChange }) {
  const Panel = window.Panel;
  const [newName, setNewName] = React.useState('');
  const [newPrice, setNewPrice] = React.useState('');
  const [error, setError] = React.useState('');

  const add = () => {
    const name = newName.trim();
    const price = parseInt(newPrice.replace(/\D/g, ''));
    if (!name) { setError('Nome obrigatório'); return; }
    if (!price || price < 1) { setError('Preço inválido'); return; }
    const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
    onChange([...services, { id, name, price }]);
    setNewName(''); setNewPrice(''); setError('');
  };

  const remove = (id) => onChange(services.filter(s => s.id !== id));

  return (
    <Panel title="Serviços oferecidos" sub="Estes serviços aparecem para seus clientes na hora de reservar.">
      {services.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          {services.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--line)' }}>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{s.name}</span>
              <span className="mono" style={{ fontSize: 13, color: 'var(--tx-2)' }}>{money(s.price, { cents: false })}</span>
              <button onClick={() => remove(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--down)' }}>
                <Icon name="trash" size={15} color="var(--down)" />
              </button>
            </div>
          ))}
        </div>
      )}
      {services.length === 0 && (
        <p style={{ fontSize: 13, color: 'var(--tx-2)', marginBottom: 12, lineHeight: 1.5 }}>
          Nenhum serviço cadastrado. Adicione abaixo — eles substituem os serviços de exemplo na sua página.
        </p>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div className="field" style={{ flex: 2, minWidth: 140, marginBottom: 0 }}>
          <label>Nome do serviço</label>
          <input value={newName} onChange={e => { setNewName(e.target.value); setError(''); }} placeholder="Ex: Corte feminino" />
        </div>
        <div className="field" style={{ flex: 1, minWidth: 100, marginBottom: 0 }}>
          <label>Preço (R$)</label>
          <input value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="Ex: 90" inputMode="numeric" />
        </div>
        <button className="btn btn-primary" style={{ minHeight: 44, flexShrink: 0 }} onClick={add}>
          <Icon name="plus" size={15} color="#0a0b0d" /> Adicionar
        </button>
      </div>
      {error && <p style={{ fontSize: 12, color: 'var(--down)', marginTop: 6 }}>{error}</p>}
    </Panel>
  );
}

// ── FUNCIONÁRIOS ─────────────────────────────────────────────────────────────
function FuncionariosSection({ bizId, seg }) {
  const Panel = window.Panel;
  const [staff, setStaff] = React.useState([]);
  const [form, setForm] = React.useState({ name: '', role: '' });
  const [photo, setPhoto] = React.useState(null);
  const [err, setErr] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api.resources.listFor(bizId).then(r => { setStaff(r); setLoading(false); });
  }, [bizId]);

  const add = async () => {
    if (!form.name.trim()) { setErr('Nome obrigatório'); return; }
    const saved = await api.resources.save(bizId, {
      name: form.name.trim(), role: form.role.trim() || seg.label, photo
    });
    if (saved) setStaff(s => [...s, saved]);
    setForm({ name: '', role: '' }); setPhoto(null); setErr('');
  };
  const remove = async (id) => {
    await api.resources.remove(id);
    setStaff(s => s.filter(x => x.id !== id));
  };

  return (
    <div className="fade">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 16 }}>
        {staff.map(p => (
          <div key={p.id} className="panel" style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10, position: 'relative' }}>
            <button onClick={() => remove(p.id)} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--down)', padding: 4 }}>
              <Icon name="trash" size={14} color="var(--down)" />
            </button>
            <div style={{ width: 64, height: 64, borderRadius: 99, overflow: 'hidden', background: 'var(--ac)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              {p.photo
                ? <img src={p.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                : <span style={{ color: '#0a0b0d', fontWeight: 700, fontSize: 22 }}>{p.name[0].toUpperCase()}</span>
              }
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: 'var(--tx-2)' }}>{p.role}</div>
            </div>
          </div>
        ))}

        {/* Card de adicionar */}
        <div className="panel" style={{ padding: 16, border: '2px dashed var(--line)', boxShadow: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="kicker" style={{ marginBottom: 4 }}>Novo funcionário</div>

          {/* Upload foto */}
          <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 56, height: 56, borderRadius: 99, overflow: 'hidden', background: 'var(--panel-2)', border: '2px dashed var(--line)', display: 'grid', placeItems: 'center' }}>
              {photo
                ? <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                : <Icon name="edit" size={20} color="var(--tx-3)" />
              }
            </div>
            <span style={{ fontSize: 11, color: 'var(--tx-2)' }}>Foto (opcional)</span>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
              const f = e.target.files[0]; if (!f) return;
              const r = new FileReader(); r.onload = ev => setPhoto(ev.target.result); r.readAsDataURL(f);
            }} />
          </label>

          <div className="field" style={{ marginBottom: 0 }}>
            <label>Nome</label>
            <input value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErr(''); }} placeholder="Ex: Marina Alves" />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Especialidade</label>
            <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder={`Ex: ${seg.label}`} />
          </div>
          {err && <p style={{ fontSize: 11.5, color: 'var(--down)', margin: 0 }}>{err}</p>}
          <button className="btn btn-primary btn-block" style={{ minHeight: 40 }} onClick={add}>
            <Icon name="plus" size={14} color="#0a0b0d" /> Adicionar
          </button>
        </div>
      </div>


    </div>
  );
}

// ── HORÁRIOS ─────────────────────────────────────────────────────────────────
const DIAS_SEMANA = [
  { id: 0, label: 'Domingo',    short: 'Dom' },
  { id: 1, label: 'Segunda',    short: 'Seg' },
  { id: 2, label: 'Terça',      short: 'Ter' },
  { id: 3, label: 'Quarta',     short: 'Qua' },
  { id: 4, label: 'Quinta',     short: 'Qui' },
  { id: 5, label: 'Sexta',      short: 'Sex' },
  { id: 6, label: 'Sábado',     short: 'Sáb' },
];

const DEFAULT_HORARIOS = DIAS_SEMANA.reduce((acc, d) => ({
  ...acc,
  [d.id]: { open: d.id >= 1 && d.id <= 6, start: '09:00', end: '18:00', pause: false, pauseStart: '12:00', pauseEnd: '13:00' }
}), {});

function HorariosSection({ bizId }) {
  const Panel = window.Panel;
  const [horarios, setHorarios] = React.useState(DEFAULT_HORARIOS);
  const [saved, setSaved] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api.schedules.listFor(bizId).then(rows => {
      if (rows.length > 0) {
        const merged = { ...DEFAULT_HORARIOS };
        rows.forEach(r => { merged[r.dayId] = { open: r.open, start: r.start, end: r.end, pause: r.pause, pauseStart: r.pauseStart, pauseEnd: r.pauseEnd }; });
        setHorarios(merged);
      }
      setLoading(false);
    });
  }, [bizId]);

  const update = (id, field, value) => {
    setHorarios(h => ({ ...h, [id]: { ...h[id], [field]: value } }));
    setSaved(false);
  };

  const handleSave = async () => {
    await api.schedules.saveAll(bizId, horarios);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fade">
      <Panel title="Horários de funcionamento" sub="Configure os dias e horários em que seu negócio aceita reservas.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {DIAS_SEMANA.map(d => {
            const h = horarios[d.id];
            return (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--line)', flexWrap: 'wrap' }}>
                {/* Dia + toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 120 }}>
                  <button onClick={() => update(d.id, 'open', !h.open)} style={{ width: 38, height: 22, borderRadius: 99, border: '1px solid var(--line)', background: h.open ? 'var(--ac)' : 'var(--panel-3)', position: 'relative', cursor: 'pointer', transition: '.15s', flexShrink: 0 }}>
                    <span style={{ position: 'absolute', top: 2, left: h.open ? 17 : 2, width: 16, height: 16, borderRadius: 99, background: '#fff', transition: '.15s' }} />
                  </button>
                  <span style={{ fontSize: 13.5, fontWeight: h.open ? 600 : 400, color: h.open ? 'var(--tx)' : 'var(--tx-3)', minWidth: 70 }}>{d.label}</span>
                </div>

                {h.open ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', flex: 1 }}>
                    <input type="time" value={h.start} onChange={e => update(d.id, 'start', e.target.value)}
                      style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, padding: '4px 8px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--panel-2)', color: 'var(--tx)', cursor: 'pointer' }} />
                    <span style={{ color: 'var(--tx-3)', fontSize: 12 }}>até</span>
                    <input type="time" value={h.end} onChange={e => update(d.id, 'end', e.target.value)}
                      style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, padding: '4px 8px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--panel-2)', color: 'var(--tx)', cursor: 'pointer' }} />

                    <button onClick={() => update(d.id, 'pause', !h.pause)} className={'chip' + (h.pause ? ' active' : '')} style={{ fontSize: 12, minHeight: 30 }}>
                      {h.pause ? '✓ Pausa' : '+ Pausa almoço'}
                    </button>

                    {h.pause && (
                      <>
                        <input type="time" value={h.pauseStart} onChange={e => update(d.id, 'pauseStart', e.target.value)}
                          style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, padding: '4px 8px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--panel-2)', color: 'var(--tx-2)', cursor: 'pointer' }} />
                        <span style={{ color: 'var(--tx-3)', fontSize: 12 }}>—</span>
                        <input type="time" value={h.pauseEnd} onChange={e => update(d.id, 'pauseEnd', e.target.value)}
                          style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, padding: '4px 8px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--panel-2)', color: 'var(--tx-2)', cursor: 'pointer' }} />
                      </>
                    )}
                  </div>
                ) : (
                  <span style={{ fontSize: 13, color: 'var(--tx-3)', fontStyle: 'italic' }}>Fechado</span>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <button className="btn btn-primary" style={{ minHeight: 44, minWidth: 140 }} onClick={handleSave}>
            {saved ? <><Icon name="check" size={15} color="#0a0b0d" /> Salvo!</> : 'Salvar horários'}
          </button>
        </div>
      </Panel>

    </div>
  );
}
