// customer-2.jsx — Reserva: booking, checkout, confirm + CustomerApp
// depende de customer-1.jsx (MobileTop, MobileFooter, SAFE_TOP) e data.jsx

// =====================================================================
// 3 · BOOKING
// =====================================================================
function Booking({ seg, sel, setSel, onContinue, onBack, layout = 'grade' }) {
  const slots = React.useMemo(() => genSlots(seg, sel.date ?? 0), [seg, sel.date]);
  const svc = seg.chooser.services && sel.service ? seg.chooser.services[sel.service] : null;
  const ready = sel.resource != null && sel.slot != null && (!seg.chooser.services || sel.service);

  const dayRef = React.useRef(null);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
      <div className="noscroll" style={{ flex: 1, overflowY: 'auto' }}>
        <MobileTop title={seg.venue.name} onBack={onBack} />

        {/* datas */}
        <div style={{ padding: '18px 0 0' }}>
          <div className="kicker" style={{ padding: '0 22px', marginBottom: 10 }}>Escolha o dia</div>
          <div className="noscroll" ref={dayRef} style={{ display: 'flex', gap: 9, overflowX: 'auto', padding: '0 22px 4px' }}>
            {DAYS.map(d => {
              const on = sel.date === d.i;
              return (
                <button key={d.i} onClick={() => setSel({ ...sel, date: d.i, slot: null })} style={{
                  flexShrink: 0, width: 58, padding: '11px 0', borderRadius: 14, cursor: 'pointer',
                  border: `1px solid ${on ? 'var(--green)' : 'var(--rule)'}`,
                  background: on ? 'var(--green)' : 'var(--panel-2)', color: on ? '#06120d' : 'var(--ink)',
                  textAlign: 'center', transition: '.15s',
                }}>
                  <div className="mono" style={{ fontSize: 11, textTransform: 'uppercase', opacity: .75 }}>{d.wd}</div>
                  <div className="serif" style={{ fontSize: 22, lineHeight: 1.1 }}>{d.day}</div>
                  <div className="mono" style={{ fontSize: 9.5, opacity: .7 }}>{d.mo}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* serviço (beleza) */}
        {seg.chooser.services && (
          <div style={{ padding: '22px 22px 0' }}>
            <div className="kicker" style={{ marginBottom: 10 }}>{seg.chooser.label}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {seg.chooser.options.map(o => (
                <button key={o} className={'chip' + (sel.service === o ? ' active' : '')} onClick={() => setSel({ ...sel, service: o })}>
                  {o} <span style={{ opacity: .7, fontSize: 12 }} className="mono">{money(seg.chooser.services[o].price, { cents: false })}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* recurso (quadra/profissional/espaço) */}
        <div style={{ padding: '22px 22px 0' }}>
          <div className="kicker" style={{ marginBottom: 10 }}>{seg.resourceLabel}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {seg.resources.map(r => {
              const on = sel.resource === r.id;
              return (
                <button key={r.id} onClick={() => setSel({ ...sel, resource: r.id, slot: null })} style={{
                  display: 'flex', alignItems: 'center', gap: 13, textAlign: 'left', cursor: 'pointer',
                  padding: '13px 15px', borderRadius: 14, transition: '.15s',
                  border: `1px solid ${on ? 'var(--green)' : 'var(--rule)'}`,
                  background: on ? 'var(--green-50)' : 'var(--panel-2)',
                }}>
                  <span style={{ width: 42, height: 42, borderRadius: 11, background: on ? 'var(--green)' : 'var(--panel-3)', border: '1px solid var(--rule)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Icon name={seg.icon} size={21} color={on ? '#fff' : seg.accent} />
                  </span>
                  <span style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15.5 }}>{r.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>{r.meta}</div>
                  </span>
                  <span style={{ width: 22, height: 22, borderRadius: 99, border: `2px solid ${on ? 'var(--green)' : 'var(--rule)'}`, display: 'grid', placeItems: 'center' }}>
                    {on && <span style={{ width: 11, height: 11, borderRadius: 99, background: 'var(--green)' }} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* horários */}
        <div style={{ padding: '24px 22px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div className="kicker">{seg.slotKind === 'period' ? 'Período' : 'Horário disponível'}</div>
            <div style={{ display: 'flex', gap: 14, fontSize: 11 }} className="mono">
              <span style={{ color: 'var(--muted)' }}><span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 3, border: '1px solid var(--rule)', marginRight: 5, verticalAlign: -1 }}></span>livre</span>
              <span style={{ color: 'var(--muted)' }}><span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 3, background: 'var(--rule-2)', marginRight: 5, verticalAlign: -1 }}></span>ocupado</span>
            </div>
          </div>
          {seg.slotKind === 'period' || layout === 'lista'
            ? <SlotList seg={seg} slots={slots} sel={sel} setSel={setSel} svc={svc} />
            : <SlotGrid slots={slots} sel={sel} setSel={setSel} svc={svc} cols={layout === 'compacto' ? 4 : 3} />}
        </div>
      </div>

      <MobileFooter>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: ready ? 12 : 0 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            {ready ? <>
              <b style={{ color: 'var(--ink)' }}>{DAYS[sel.date].full}</b> · {sel.slot}
              {svc && <> · {sel.service}</>}
            </> : 'Selecione dia, ' + seg.noun.toLowerCase() + ' e horário'}
          </div>
          {ready && <div className="serif" style={{ fontSize: 22 }}>{money(svc ? svc.price : slots.find(s => s.time === sel.slot).price, { cents: false })}</div>}
        </div>
        {ready && <button className="btn btn-primary btn-block" onClick={onContinue}>Continuar <Icon name="arrowR" size={18} color="#fff" /></button>}
      </MobileFooter>
    </div>
  );
}

// =====================================================================
// 4 · CHECKOUT
// =====================================================================
function Checkout({ seg, sel, pay, setPay, fee, onConfirm, onBack }) {
  const svc = seg.chooser.services && sel.service ? seg.chooser.services[sel.service] : null;
  const price = svc ? svc.price : genSlots(seg, sel.date).find(s => s.time === sel.slot).price;
  const res = seg.resources.find(r => r.id === sel.resource);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--paper-2)' }}>
      <div className="noscroll" style={{ flex: 1, overflowY: 'auto' }}>
        <MobileTop title="Revisar e pagar" onBack={onBack} />
        <div style={{ padding: '20px 18px 8px' }}>
          {/* resumo */}
          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', gap: 13 }}>
              <span style={{ width: 50, height: 50, borderRadius: 13, background: seg.accent, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon name={seg.icon} size={26} color="#fff" />
              </span>
              <div>
                <div className="serif" style={{ fontSize: 20, lineHeight: 1.1 }}>{seg.venue.name}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{res.name}{svc && <> · {sel.service}</>}</div>
              </div>
            </div>
            <div className="rule" style={{ margin: '16px 0' }}></div>
            {[
              ['calendar', 'Data', DAYS[sel.date].full],
              ['clock', seg.slotKind === 'period' ? 'Período' : 'Horário', sel.slot + (svc ? ` · ${svc.dur} min` : seg.slotKind === 'period' ? '' : ' – ' + nextHour(sel.slot))],
            ].map(([ic, k, val]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '7px 0' }}>
                <Icon name={ic} size={18} color="var(--muted)" />
                <span style={{ flex: 1, fontSize: 13, color: 'var(--muted)' }}>{k}</span>
                <b style={{ fontSize: 14.5 }}>{val}</b>
              </div>
            ))}
          </div>

          {/* pagamento */}
          <div className="kicker" style={{ margin: '22px 4px 10px' }}>Como prefere pagar?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <PayOption ic="card" t="Pagar agora" d="Cartão, Pix ou carteira digital" badge="Reserva garantida" on={pay === 'online'} onClick={() => setPay('online')} accent={seg.accent} />
            <PayOption ic="money" t="Pagar no local" d="Acerte direto no balcão, no dia" badge="" on={pay === 'local'} onClick={() => setPay('local')} accent={seg.accent} />
          </div>

          {pay === 'online' && (
            <div className="card fade" style={{ padding: 16, marginTop: 12, boxShadow: 'none' }}>
              <div className="field" style={{ marginBottom: 12 }}><label>Número do cartão</label><input placeholder="0000 0000 0000 0000" defaultValue="4012 8842 1009 7745" inputMode="numeric" /></div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="field" style={{ flex: 1, marginBottom: 0 }}><label>Validade</label><input placeholder="MM/AA" defaultValue="08/29" /></div>
                <div className="field" style={{ flex: 1, marginBottom: 0 }}><label>CVV</label><input placeholder="000" defaultValue="123" inputMode="numeric" /></div>
              </div>
            </div>
          )}

          {/* política de cancelamento */}
          <div style={{ marginTop: 16, padding: '13px 15px', borderRadius: 14, background: 'var(--amber-bg)', border: '1px solid rgba(242,163,60,.25)', display: 'flex', gap: 11 }}>
            <Icon name="info" size={18} color="var(--warn)" style={{ marginTop: 1, flexShrink: 0 }} />
            <div style={{ fontSize: 13, lineHeight: 1.5, color: '#e8c98c' }}>
              <b>Política de cancelamento.</b> Cancelamentos a partir de <b>{'\u00A0'}24h antes{'\u00A0'}</b> do horário têm taxa de <b>{fee}%</b> ({money(price * fee / 100, { cents: false })}). Antes disso, é grátis.
            </div>
          </div>
          <div style={{ height: 8 }} />
        </div>
      </div>

      <MobileFooter>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <span style={{ color: 'var(--muted)', fontSize: 14 }}>{pay === 'online' ? 'Total a pagar agora' : 'Total no local'}</span>
          <span className="serif" style={{ fontSize: 26 }}>{money(price)}</span>
        </div>
        <button className="btn btn-primary btn-block" onClick={onConfirm}>
          {pay === 'online' ? <>Pagar e confirmar</> : <>Confirmar reserva</>} <Icon name="check" size={18} color="#fff" />
        </button>
      </MobileFooter>
    </div>
  );
}

function PayOption({ ic, t, d, badge, on, onClick, accent }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 13, textAlign: 'left', cursor: 'pointer', width: '100%',
      padding: '14px 15px', borderRadius: 14, transition: '.15s',
      border: `1px solid ${on ? 'var(--green)' : 'var(--rule)'}`, background: on ? 'var(--green-50)' : 'var(--panel-2)',
    }}>
      <span style={{ width: 40, height: 40, borderRadius: 11, background: on ? accent : 'var(--panel-3)', border: '1px solid var(--rule)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <Icon name={ic} size={20} color={on ? '#fff' : accent} />
      </span>
      <span style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 15 }}>{t} {badge && <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--green-dark)', background: 'var(--green-100)', padding: '2px 7px', borderRadius: 99, marginLeft: 4 }} className="mono">{badge}</span>}</div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>{d}</div>
      </span>
      <span style={{ width: 22, height: 22, borderRadius: 99, border: `2px solid ${on ? 'var(--green)' : 'var(--rule)'}`, display: 'grid', placeItems: 'center' }}>
        {on && <span style={{ width: 11, height: 11, borderRadius: 99, background: 'var(--green)' }} />}
      </span>
    </button>
  );
}

function nextHour(t) { const h = parseInt(t); return `${String(h + 1).padStart(2, '0')}:00`; }

// ── variantes de exibição de horários ────────────────────────
function SlotGrid({ slots, sel, setSel, svc, cols = 3 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: cols >= 4 ? 7 : 9 }}>
      {slots.map(s => {
        const on = sel.slot === s.time;
        return (
          <button key={s.time} disabled={s.busy} onClick={() => setSel({ ...sel, slot: s.time })}
            className={'slot' + (on ? ' sel' : '') + (s.busy ? ' busy' : '')} style={cols >= 4 ? { padding: '10px 4px', fontSize: 13 } : {}}>
            {s.time}
            {!svc && cols < 4 && <span className="price">{money(s.price, { cents: false })}</span>}
          </button>
        );
      })}
    </div>
  );
}

function SlotList({ seg, slots, sel, setSel, svc }) {
  const groups = seg.slotKind === 'period'
    ? [{ name: '', items: slots }]
    : [
        { name: 'Manhã', items: slots.filter(s => parseInt(s.time) < 12) },
        { name: 'Tarde', items: slots.filter(s => parseInt(s.time) >= 12 && parseInt(s.time) < 18) },
        { name: 'Noite', items: slots.filter(s => parseInt(s.time) >= 18) },
      ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {groups.map((g, gi) => g.items.length === 0 ? null : (
        <div key={gi}>
          {g.name && <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>{g.name}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {g.items.map(s => {
              const on = sel.slot === s.time;
              return (
                <button key={s.time} disabled={s.busy} onClick={() => setSel({ ...sel, slot: s.time })}
                  className={'slot' + (on ? ' sel' : '') + (s.busy ? ' busy' : '')}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px' }}>
                  <span style={{ textAlign: 'left' }}>
                    <b style={{ fontSize: 15, fontFamily: "'DM Sans',sans-serif" }}>{s.time}</b>
                    <span style={{ display: 'block', fontSize: 11, opacity: .7 }}>{s.label}</span>
                  </span>
                  <span style={{ fontSize: 14 }}>{svc ? '' : money(s.price, { cents: false })}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// =====================================================================
// 5 · CONFIRM
// =====================================================================
function Confirm({ seg, sel, pay, onMessages, onRestart }) {
  const svc = seg.chooser.services && sel.service ? seg.chooser.services[sel.service] : null;
  const price = svc ? svc.price : genSlots(seg, sel.date).find(s => s.time === sel.slot).price;
  const res = seg.resources.find(r => r.id === sel.resource);
  const code = 'RSV-' + (1000 + (sel.date * 31 + parseInt(sel.slot) * 7) % 9000);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#07080b' }}>
      <div className="noscroll" style={{ flex: 1, overflowY: 'auto', paddingTop: SAFE_TOP }}>
        <div style={{ padding: '30px 22px 0', textAlign: 'center' }}>
          <div className="fade" style={{ width: 76, height: 76, borderRadius: 99, background: 'var(--green)', display: 'grid', placeItems: 'center', margin: '0 auto', boxShadow: '0 12px 40px -8px rgba(44,156,119,.6)' }}>
            <Icon name="check" size={40} color="#fff" stroke={2.4} />
          </div>
          <h2 className="serif" style={{ color: '#fff', fontSize: 32, margin: '20px 0 6px', lineHeight: 1.05 }}>Reserva <span style={{ color: 'var(--mint)', fontStyle: 'italic' }}>confirmada!</span></h2>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 15, margin: 0 }}>Código <b style={{ color: '#fff' }} className="mono">{code}</b></p>
        </div>

        {/* ticket */}
        <div style={{ padding: '24px 18px 0' }}>
          <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ background: seg.accent, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icon name={seg.icon} size={26} color="#fff" />
              <div><div className="serif" style={{ color: '#fff', fontSize: 20, lineHeight: 1 }}>{seg.venue.name}</div>
                <div style={{ color: 'rgba(255,255,255,.85)', fontSize: 12.5 }}>{res.name}{svc && <> · {sel.service}</>}</div></div>
            </div>
            <div style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between' }}>
              <div><div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Data</div><div className="serif" style={{ fontSize: 19 }}>{DAYS[sel.date].full}</div></div>
              <div style={{ textAlign: 'right' }}><div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>{seg.slotKind === 'period' ? 'Período' : 'Horário'}</div><div className="serif" style={{ fontSize: 19 }}>{sel.slot}</div></div>
            </div>
            <div style={{ borderTop: '1.5px dashed var(--rule)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--paper-2)' }}>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>{pay === 'online' ? 'Pago online' : 'A pagar no local'}</span>
              <b className="serif" style={{ fontSize: 20 }}>{money(price)}</b>
            </div>
          </div>
        </div>

        {/* o que vem a seguir */}
        <div style={{ padding: '22px 22px 0' }}>
          <div className="mono" style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 12 }}>O que você vai receber</div>
          {[
            { ic: 'check', t: 'Confirmação agora', d: 'WhatsApp, SMS e e-mail com os detalhes' },
            { ic: 'bell', t: 'Lembrete na véspera', d: 'Aviso 1 dia antes + política de cancelamento' },
          ].map(s => (
            <div key={s.t} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '9px 0' }}>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,.08)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={s.ic} size={17} color="var(--mint)" /></span>
              <div><div style={{ color: '#fff', fontSize: 14.5, fontWeight: 600 }}>{s.t}</div><div style={{ color: 'rgba(255,255,255,.55)', fontSize: 12.5 }}>{s.d}</div></div>
            </div>
          ))}
          <div style={{ height: 12 }} />
        </div>
      </div>

      <footer style={{ padding: '14px 18px 30px', background: '#07080b', borderTop: '1px solid rgba(255,255,255,.1)' }}>
        <button className="btn btn-block" style={{ background: 'var(--mint)', color: '#06120d' }} onClick={onMessages}>
          <Icon name="chat" size={18} color="#06120d" /> Ver as mensagens
        </button>
        <button onClick={onRestart} style={{ width: '100%', marginTop: 10, background: 'none', border: 'none', color: 'rgba(255,255,255,.6)', fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", padding: 8 }}>Voltar ao início</button>
      </footer>
    </div>
  );
}

// =====================================================================
// ORQUESTRADOR
// =====================================================================
function CustomerApp({ segKey, fee = 50, layout = 'grade', venueName, bizCity, bizServices, bizResources, visitor, onOpenMessages, onBooked }) {
  const base = SEGMENTS[segKey];
  // Monta seg com dados reais quando disponíveis
  const realResources = bizResources && bizResources.length > 0
    ? bizResources.map(r => ({ id: r.id, name: r.name, meta: r.role || '' }))
    : null;
  const seg = {
    ...(venueName ? { ...base, venue: { ...base.venue, name: venueName } } : base),
    ...(realResources ? { resources: realResources } : {}),
  };
  const [screen, setScreen] = React.useState('vitrine');
  const [authed, setAuthed] = React.useState(false);
  const [customer, setCustomer] = React.useState(null);
  const [pay, setPay] = React.useState('online');
  const [sel, setSel] = React.useState({ date: 0, resource: null, service: null, slot: null });

  React.useEffect(() => { // reset ao trocar segmento
    setScreen('vitrine'); setSel({ date: 0, resource: null, service: null, slot: null }); setAuthed(false); setCustomer(null);
  }, [segKey]);

  // detecta retorno do OAuth Google na página de reserva
  React.useEffect(() => {
    const sp = window.SUPABASE;
    if (!sp) return;
    const returnPath = sessionStorage.getItem('panzor_booking_return');
    if (!returnPath) return;
    sp.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const u = data.session.user;
        sessionStorage.removeItem('panzor_booking_return');
        setCustomer({ nome: u.user_metadata?.full_name || u.user_metadata?.name || u.email.split('@')[0], email: u.email, cel: '', cpf: '', via: 'Google' });
        setAuthed(true);
        setScreen('booking');
      }
    });
  }, []);

  const go = (s) => setScreen(s);
  const startBooking = () => go(authed ? 'booking' : 'auth');

  const commit = () => {
    if (onBooked) {
      const svc = seg.chooser.services && sel.service ? seg.chooser.services[sel.service] : null;
      const price = svc ? svc.price : genSlots(seg, sel.date).find(s => s.time === sel.slot).price;
      const res = seg.resources.find(r => r.id === sel.resource);
      onBooked({ segment: segKey, date: sel.date, resourceId: sel.resource, resourceName: res ? res.name : '', service: sel.service || null, slot: sel.slot, pay, price, customer });
    }
    go('confirm');
  };

  return (
    <div key={screen} className="fade" style={{ height: '100%' }}>
      {screen === 'vitrine' && <Vitrine seg={seg} onStart={startBooking} />}
      {screen === 'auth' && <Auth seg={seg} onBack={() => go('vitrine')} onDone={(cust) => { setCustomer(cust || null); setAuthed(true); go('booking'); }} />}
      {screen === 'booking' && <Booking seg={seg} sel={sel} setSel={setSel} layout={layout} onBack={() => go('vitrine')} onContinue={() => go('checkout')} />}
      {screen === 'checkout' && <Checkout seg={seg} sel={sel} pay={pay} setPay={setPay} fee={fee} onBack={() => go('booking')} onConfirm={commit} />}
      {screen === 'confirm' && <Confirm seg={seg} sel={sel} pay={pay} onRestart={() => go('vitrine')} onMessages={() => onOpenMessages && onOpenMessages({ seg: segKey, sel, pay })} />}
    </div>
  );
}

window.Booking = Booking;
window.Checkout = Checkout;
window.Confirm = Confirm;
window.CustomerApp = CustomerApp;
