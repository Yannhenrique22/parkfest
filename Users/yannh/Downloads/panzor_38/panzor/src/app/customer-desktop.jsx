// customer-desktop.jsx — página pública desktop
// Layout: >= 1200px = 2 colunas | 860-1199px = 1 coluna + barra inferior fixa

function DesktopBooking({ segKey = 'quadras', fee = 50, venueName, bizCity, bizServices, bizResources, visitor, onBooked }) {
  const seg = SEGMENTS[segKey];
  const bizName = venueName || seg.venue.name;
  const [vw, setVw] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1280);
  const rootRef = React.useRef(null);

  React.useEffect(() => {
    const fn = () => setVw(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // >= 1200px: 2 colunas. < 1200px: 1 coluna + barra inferior
  const TWO_COL = vw >= 1200;
  // Padding lateral para 2 colunas: conteúdo máximo 840px, mínimo 40px cada lado
  const sidePad = TWO_COL ? Math.max(40, Math.floor((vw - 840) / 2)) : 20;

  const chooser = bizServices && bizServices.length > 0
    ? { label: 'SERVIÇO', options: bizServices.map(s => s.id), services: Object.fromEntries(bizServices.map(s => [s.id, { label: s.name, price: s.price }])) }
    : seg.chooser;

  const resources = bizResources && bizResources.length > 0
    ? bizResources.map(r => ({ id: r.id, name: r.name, meta: r.role || '' }))
    : venueName
      ? [{ id: 'default', name: bizName, role: seg.label }]
      : seg.resources;

  const [date, setDate] = React.useState(0);
  const [resource, setResource] = React.useState(resources[0].id);
  const [service, setService] = React.useState(chooser.services ? chooser.options[0] : null);
  const [slot, setSlot] = React.useState(null);
  const [pay, setPay] = React.useState('online');
  const [done, setDone] = React.useState(false);

  const authed = !!visitor;
  const userName = visitor?.name || '';

  React.useEffect(() => {
    setSlot(null); setResource(resources[0].id);
    setService(chooser.services ? chooser.options[0] : null); setDone(false);
  }, [segKey]);

  const slots = React.useMemo(() => genSlots(seg, date), [seg, date]);
  const svc = chooser.services && service ? chooser.services[service] : null;
  const price = svc ? svc.price : (slot ? slots.find(s => s.time === slot)?.price : seg.basePrice);
  const res = resources.find(r => r.id === resource);
  const ready = slot != null;
  const code = 'PZR-' + (1000 + (date * 31 + (slot ? parseInt(slot) : 7) * 7) % 9000);
  const PX = `${sidePad}px`;

  const confirmBooking = () => {
    if (onBooked && ready) onBooked({ segment: segKey, date, resourceId: resource, resourceName: res?.name || '', service: svc ? service : null, slot, pay, price, customer: null });
    setDone(true);
  };

  // ── FORMULÁRIO (esquerda / tela cheia em modo coluna única) ──────────────
  const Form = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: TWO_COL ? 0 : 100 }}>

      <div className="panel" style={{ padding: 18, boxShadow: 'none' }}>
        <div className="kicker" style={{ marginBottom: 12 }}>1 · Escolha o dia</div>
        <div className="noscroll" style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 2 }}>
          {DAYS.map(d => {
            const on = date === d.i;
            return <button key={d.i} onClick={() => { setDate(d.i); setSlot(null); }} style={{ flexShrink: 0, width: 52, padding: '8px 0', borderRadius: 10, cursor: 'pointer', border: `1.5px solid ${on ? 'var(--ac)' : 'var(--line)'}`, background: on ? 'var(--ac)' : 'var(--panel-2)', color: on ? '#06120d' : 'var(--tx)', textAlign: 'center' }}>
              <div className="mono" style={{ fontSize: 9, textTransform: 'uppercase', opacity: .7 }}>{d.wd}</div>
              <div className="serif" style={{ fontSize: 18 }}>{d.day}</div>
              <div className="mono" style={{ fontSize: 8, opacity: .6 }}>{d.mo}</div>
            </button>;
          })}
        </div>
      </div>

      {chooser.services && (
        <div className="panel" style={{ padding: 18, boxShadow: 'none' }}>
          <div className="kicker" style={{ marginBottom: 12 }}>{chooser.label || 'Serviço'}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {chooser.options.map(o => (
              <button key={o} className={'chip' + (service === o ? ' active' : '')} onClick={() => setService(o)} style={{ minHeight: 36 }}>
                {chooser.services[o]?.label || o}
                <span className="mono" style={{ opacity: .65, fontSize: 11, marginLeft: 4 }}>{money(chooser.services[o]?.price || 0, { cents: false })}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="panel" style={{ padding: 18, boxShadow: 'none' }}>
        <div className="kicker" style={{ marginBottom: 12 }}>{chooser.services ? '2' : '1'} · {seg.resourceLabel || 'Profissional'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(resources.length, 3)}, 1fr)`, gap: 10 }}>
          {resources.map(r => {
            const on = resource === r.id;
            return <button key={r.id} onClick={() => { setResource(r.id); setSlot(null); }} style={{ textAlign: 'left', cursor: 'pointer', padding: '12px', borderRadius: 11, border: `1.5px solid ${on ? 'var(--ac)' : 'var(--line)'}`, background: on ? 'var(--ac-soft)' : 'var(--panel-2)', minHeight: 44 }}>
              <span style={{ width: 34, height: 34, borderRadius: 8, background: on ? 'var(--ac)' : 'var(--panel-3)', display: 'grid', placeItems: 'center', border: '1px solid var(--line)' }}>
                <Icon name={seg.icon} size={17} color={on ? '#0a0b0d' : 'var(--ac)'} /></span>
              <div style={{ fontWeight: 600, fontSize: 13, marginTop: 8, color: 'var(--tx)' }}>{r.name}</div>
            </button>;
          })}
        </div>
      </div>

      <div className="panel" style={{ padding: 18, boxShadow: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="kicker">{chooser.services ? '3' : '2'} · {seg.slotKind === 'period' ? 'Período' : 'Horário'}</div>
          <span className="mono" style={{ fontSize: 11, color: 'var(--tx-3)' }}>{DAYS[date].full}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: seg.slotKind === 'period' ? '1fr 1fr 1fr' : 'repeat(6,1fr)', gap: 7 }}>
          {slots.map(s => {
            const on = slot === s.time;
            return <button key={s.time} disabled={s.busy} onClick={() => setSlot(s.time)} className={'slot' + (on ? ' sel' : '') + (s.busy ? ' busy' : '')} style={seg.slotKind === 'period' ? { padding: '11px' } : {}}>
              {seg.slotKind === 'period'
                ? <><b style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>{s.time}</b><span style={{ display: 'block', fontSize: 10, opacity: .7 }}>{s.label}</span></>
                : <>{s.time}{!svc && <span className="price">{money(s.price, { cents: false })}</span>}</>}
            </button>;
          })}
        </div>
      </div>
    </div>
  );

  // ── PAINEL LATERAL (2 colunas) ────────────────────────────────────────────
  const SidePanel = () => (
    <div className="panel" style={{ padding: 0, boxShadow: 'none', position: 'sticky', top: 72, overflow: 'hidden' }}>
      {!done ? <>
        <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--ac)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={seg.icon} size={18} color="#0a0b0d" /></span>
          <div><div className="serif" style={{ fontSize: 16 }}>Sua reserva</div><div style={{ fontSize: 11.5, color: 'var(--tx-2)' }}>{bizName}{svc ? ` · ${service}` : ''}</div></div>
        </div>
        <div style={{ padding: '13px 16px' }}>
          {[['calendar', 'Data', DAYS[date].full], ['clock', seg.slotKind === 'period' ? 'Período' : 'Horário', slot || '—']].map(([ic, k, val]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 0' }}>
              <Icon name={ic} size={15} color="var(--tx-3)" /><span style={{ flex: 1, fontSize: 12.5, color: 'var(--tx-2)' }}>{k}</span><b style={{ fontSize: 13 }}>{val}</b>
            </div>
          ))}
          <div className="rule" style={{ margin: '11px 0' }} />
          <div className="kicker" style={{ marginBottom: 8 }}>Pagamento</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[['online', 'card', 'Pagar agora', 'Reserva garantida'], ['local', 'money', 'Pagar no local', '']].map(([k, ic, t, b]) => {
              const on = pay === k;
              return <button key={k} onClick={() => setPay(k)} style={{ display: 'flex', alignItems: 'center', gap: 9, textAlign: 'left', cursor: 'pointer', padding: '9px 10px', borderRadius: 10, border: `1.5px solid ${on ? 'var(--ac)' : 'var(--line)'}`, background: on ? 'var(--ac-soft)' : 'var(--panel-2)', minHeight: 44 }}>
                <Icon name={ic} size={16} color={on ? 'var(--ac)' : 'var(--tx-2)'} />
                <span style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 12.5 }}>{t}</div>{b && <div style={{ fontSize: 10.5, color: 'var(--tx-3)' }}>{b}</div>}</span>
                <span style={{ width: 16, height: 16, borderRadius: 99, border: `2px solid ${on ? 'var(--ac)' : 'var(--line)'}`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{on && <span style={{ width: 7, height: 7, borderRadius: 99, background: 'var(--ac)' }} />}</span>
              </button>;
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '13px 0 10px' }}>
            <span style={{ color: 'var(--tx-2)', fontSize: 13 }}>Total</span>
            <span className="serif" style={{ fontSize: 22 }}>{ready ? money(price) : '—'}</span>
          </div>
          <button className="btn btn-primary btn-block" style={{ minHeight: 46 }} disabled={!ready} onClick={confirmBooking}>
            {pay === 'online' ? 'Pagar e confirmar' : 'Confirmar reserva'} <Icon name="check" size={15} color="#06120d" />
          </button>
          <p style={{ fontSize: 11, color: 'var(--tx-3)', lineHeight: 1.5, margin: '9px 0 0', display: 'flex', gap: 5 }}>
            <Icon name="info" size={13} color="var(--warn)" style={{ flexShrink: 0 }} /> Cancelamentos até 24h antes têm taxa de {fee}%.
          </p>
        </div>
      </> : <ConfirmCard />}
    </div>
  );

  // ── BARRA INFERIOR (modo coluna única) ────────────────────────────────────
  const BottomBar = () => (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20, background: 'var(--bg-2)', borderTop: '1px solid var(--line)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {ready
          ? <><div style={{ fontWeight: 600, fontSize: 14 }}>{DAYS[date].full} · {slot}</div><div style={{ fontSize: 12.5, color: 'var(--tx-2)' }}>{bizName}{svc ? ` · ${service}` : ''}</div></>
          : <div style={{ fontSize: 14, color: 'var(--tx-2)' }}>Selecione um horário</div>
        }
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {ready && <span className="serif" style={{ fontSize: 20 }}>{money(price)}</span>}
        <button className="btn btn-primary" style={{ minHeight: 44, minWidth: 140 }} disabled={!ready} onClick={confirmBooking}>
          {pay === 'online' ? 'Pagar e confirmar' : 'Confirmar'} <Icon name="check" size={14} color="#06120d" />
        </button>
      </div>
    </div>
  );

  const ConfirmCard = () => (
    <div className="fade" style={{ padding: '26px 18px', textAlign: 'center' }}>
      <div style={{ width: 54, height: 54, borderRadius: 99, background: 'var(--ac)', display: 'grid', placeItems: 'center', margin: '0 auto' }}><Icon name="check" size={28} color="#0a0b0d" stroke={2.4} /></div>
      <h3 className="serif" style={{ fontSize: 21, margin: '13px 0 4px' }}>Reserva confirmada</h3>
      <p style={{ color: 'var(--tx-2)', fontSize: 13, margin: '0 0 14px' }}>Código <b className="mono" style={{ color: 'var(--tx)' }}>{code}</b></p>
      <div style={{ textAlign: 'left', background: 'var(--panel-2)', border: '1px solid var(--line)', borderRadius: 10, padding: 13 }}>
        {[['Local', bizName], ['Data', DAYS[date].full], [seg.slotKind === 'period' ? 'Período' : 'Horário', slot], [pay === 'online' ? 'Pago online' : 'No local', money(price)]].map(([k, val], i) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderTop: i ? '1px solid var(--line-2)' : 'none', fontSize: 12.5 }}>
            <span style={{ color: 'var(--tx-2)' }}>{k}</span><b>{val}</b>
          </div>
        ))}
      </div>
      <button className="btn btn-ghost btn-block" style={{ marginTop: 13, minHeight: 44 }} onClick={() => setDone(false)}>Fazer outra reserva</button>
    </div>
  );

  return (
    <div ref={rootRef} className="scroll" style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', background: 'var(--bg)' }}>

      {/* NAVBAR */}
      <div style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--line)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ paddingLeft: PX, paddingRight: PX, paddingTop: 12, paddingBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
            <Mark size={28} />
            <span style={{ fontFamily: "'Crimson Pro',serif", fontWeight: 600, fontSize: 18, flexShrink: 0 }}>Panzor</span>
            <span style={{ color: 'var(--tx-3)', flexShrink: 0 }}>·</span>
            <span style={{ color: 'var(--tx-2)', fontSize: 13.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bizName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: 16 }}>
            {bizCity && TWO_COL && <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--tx-2)', fontSize: 13 }}><Icon name="pin" size={14} color="var(--tx-3)" />{bizCity}</span>}
            {authed
              ? <span className="chip" style={{ background: 'var(--ac-soft)', color: 'var(--ac)' }}><Icon name="user" size={14} color="var(--ac)" /> {userName}</span>
              : <button className="chip"><Icon name="user" size={14} /> Entrar</button>
            }
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(120deg, var(--ac) -10%, var(--ac-dark) 40%, #0a0b0d 100%)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', right: 0, top: -20, opacity: .08 }}><Icon name={seg.icon} size={210} color="#fff" stroke={1} /></div>
        <div style={{ paddingLeft: PX, paddingRight: PX, paddingTop: 28, paddingBottom: 28, position: 'relative' }}>
          <span className="mono" style={{ color: 'rgba(255,255,255,.75)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase' }}>{seg.label}</span>
          <h1 className="serif" style={{ fontSize: TWO_COL ? 40 : 30, lineHeight: 1.05, margin: '6px 0 10px', color: '#fff' }}>{bizName}</h1>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            {!venueName && <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#fff' }}><Icon name="star" size={14} color="#fff" /><b>{seg.venue.rating}</b><span style={{ color: 'rgba(255,255,255,.6)', fontSize: 12 }}>({seg.venue.reviews})</span></span>}
            <span style={{ color: 'rgba(255,255,255,.85)', fontSize: 13.5 }}>a partir de <b>{money(seg.basePrice, { cents: false })}</b> {seg.unit}</span>
          </div>
        </div>
      </div>

      {/* CORPO */}
      <div style={{ paddingLeft: PX, paddingRight: PX, paddingTop: 24, paddingBottom: 24 }}>
        {TWO_COL ? (
          // 2 colunas: form + painel lateral
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 290px', gap: 24, alignItems: 'start' }}>
            {done ? (
              <div className="panel" style={{ padding: 0, boxShadow: 'none', overflow: 'hidden', gridColumn: '1 / -1', maxWidth: 480, margin: '0 auto', width: '100%' }}>
                <ConfirmCard />
              </div>
            ) : <>
              <Form />
              <SidePanel />
            </>}
          </div>
        ) : (
          // 1 coluna: form + barra inferior fixa
          done ? (
            <div className="panel" style={{ padding: 0, boxShadow: 'none', overflow: 'hidden', maxWidth: 480, margin: '0 auto' }}>
              <ConfirmCard />
            </div>
          ) : <Form />
        )}
      </div>

      {/* Barra inferior (modo 1 coluna, quando não confirmado) */}
      {!TWO_COL && !done && <BottomBar />}
    </div>
  );
}

window.DesktopBooking = DesktopBooking;
