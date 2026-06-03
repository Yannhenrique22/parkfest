// messages.jsx — Reserva: mensagens de confirmação (dia) e lembrete (véspera)
// canais: WhatsApp · SMS · E-mail. Exporta MessagesScene (conteúdo p/ iOS frame escuro)

function MessagesScene({ segKey = 'quadras', sel, pay = 'online', fee = 50, user = 'Camila' }) {
  const seg = SEGMENTS[segKey];
  const s = sel || { date: 4, resource: seg.resources[0].id, slot: '18:00', service: null };
  const svc = seg.chooser.services && s.service ? seg.chooser.services[s.service] : null;
  const price = svc ? svc.price : (genSlots(seg, s.date).find(x => x.time === s.slot)?.price || seg.peakPrice);
  const res = seg.resources.find(r => r.id === s.resource) || seg.resources[0];
  const when = DAYS[s.date] ? DAYS[s.date].full : 'sex, 6 de jun';
  const feeVal = money(price * fee / 100, { cents: false });

  const [chan, setChan] = React.useState('whatsapp');
  const [type, setType] = React.useState('confirm');

  const ctx = { seg, res, svc, price, when, slot: s.slot, user, fee, feeVal, pay };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0b141a' }}>
      {/* header escuro */}
      <div style={{ paddingTop: SAFE_TOP, background: chan === 'whatsapp' ? '#1f2c34' : chan === 'sms' ? '#1c1c1e' : '#202124' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px 12px' }}>
          <Icon name="arrowL" size={20} color="rgba(255,255,255,.8)" />
          <div style={{ width: 38, height: 38, borderRadius: 99, background: seg.accent, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Icon name={seg.icon} size={20} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{seg.venue.name}</div>
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11.5 }}>
              {chan === 'whatsapp' ? 'conta comercial' : chan === 'sms' ? 'SMS · Panzor' : 'no-reply@panzor.app'}
            </div>
          </div>
          <Icon name={chan === 'email' ? 'mail' : chan === 'sms' ? 'chat' : 'whatsapp'} size={20} color="rgba(255,255,255,.55)" />
        </div>
      </div>

      {/* corpo */}
      <div className="noscroll" style={{
        flex: 1, overflowY: 'auto', padding: chan === 'email' ? 0 : '18px 16px',
        background: chan === 'whatsapp'
          ? '#0b141a url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'1\' fill=\'%23ffffff10\'/%3E%3C/svg%3E")'
          : chan === 'sms' ? '#000' : 'var(--bg)',
      }}>
        {chan === 'whatsapp' && <WhatsAppMsg type={type} {...ctx} />}
        {chan === 'sms' && <SmsMsg type={type} {...ctx} />}
        {chan === 'email' && <EmailMsg type={type} {...ctx} />}
      </div>

      {/* controles de apresentação */}
      <div style={{ background: '#16202a', borderTop: '1px solid rgba(255,255,255,.08)', padding: '12px 14px 28px' }}>
        <div style={{ display: 'flex', gap: 7, marginBottom: 9 }}>
          {[['confirm', 'Confirmação (dia)'], ['reminder', 'Lembrete (véspera)']].map(([k, l]) => (
            <button key={k} onClick={() => setType(k)} style={msgTab(type === k)}>{l}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          {[['whatsapp', 'WhatsApp'], ['sms', 'SMS'], ['email', 'E-mail']].map(([k, l]) => (
            <button key={k} onClick={() => setChan(k)} style={msgTab(chan === k, true)}>
              <Icon name={k === 'whatsapp' ? 'whatsapp' : k === 'sms' ? 'chat' : 'mail'} size={15} color={chan === k ? '#0b141a' : 'rgba(255,255,255,.7)'} /> {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function msgTab(on, flex) {
  return {
    flex: flex ? 1 : 'unset', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '9px 14px', borderRadius: 10, cursor: 'pointer', border: 'none',
    fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 600,
    background: on ? 'var(--mint)' : 'rgba(255,255,255,.07)', color: on ? '#0b141a' : 'rgba(255,255,255,.7)',
  };
}

// ── WhatsApp ─────────────────────────────────────────────────
function WhatsAppMsg({ type, seg, res, when, slot, price, user, fee, feeVal, pay, svc }) {
  const Bubble = ({ children, time }) => (
    <div className="fade" style={{ background: '#202c33', color: '#e9edef', borderRadius: '0 10px 10px 10px', padding: '9px 11px 6px', maxWidth: 290, fontSize: 14.5, lineHeight: 1.5, boxShadow: '0 1px 1px rgba(0,0,0,.2)', marginBottom: 10 }}>
      {children}
      <div style={{ textAlign: 'right', fontSize: 10.5, color: 'rgba(255,255,255,.4)', marginTop: 3 }}>{time} ✓✓</div>
    </div>
  );
  return (
    <div>
      <div style={{ textAlign: 'center', margin: '0 0 14px' }}>
        <span style={{ background: '#182229', color: 'rgba(255,255,255,.55)', fontSize: 11, padding: '4px 10px', borderRadius: 8 }}>{type === 'confirm' ? 'HOJE' : 'ONTEM'}</span>
      </div>
      {type === 'confirm' ? (
        <Bubble time="09:02">
          <b style={{ color: 'var(--mint)' }}>✅ Reserva confirmada</b><br />
          Olá, {user}! Sua reserva na <b>{seg.venue.name}</b> está confirmada.<br /><br />
          📅 <b>{when}</b>, às <b>{slot}</b><br />
          {seg.icon === 'court' ? '🏐' : seg.icon === 'scissors' ? '✂️' : '🎉'} {res.name}{svc ? ` · ${svc}` : ''}<br />
          💳 {pay === 'online' ? `Pago online — ${money(price)}` : `A pagar no local — ${money(price)}`}<br /><br />
          Qualquer coisa, é só responder por aqui. Bom jogo! 🙌
        </Bubble>
      ) : (
        <Bubble time="18:30">
          <b>👋 Lembrete da sua reserva</b><br />
          Oi {user}! Passando para lembrar: sua reserva é <b>amanhã</b>, {when} às <b>{slot}</b>, na {seg.venue.name}.<br /><br />
          ⚠️ <b>Importante:</b> a partir de agora, o cancelamento tem taxa de <b>{fee}%</b> ({feeVal}). Antes de 24h era grátis.<br /><br />
          Precisa remarcar? Responda esta mensagem que a gente ajusta. Até amanhã! 🤙
        </Bubble>
      )}
    </div>
  );
}

// ── SMS ──────────────────────────────────────────────────────
function SmsMsg({ type, seg, res, when, slot, price, user, fee, feeVal, pay }) {
  return (
    <div>
      <div style={{ textAlign: 'center', margin: '4px 0 14px', color: 'rgba(255,255,255,.4)', fontSize: 11.5 }}>
        {type === 'confirm' ? 'Hoje 09:02' : 'Ontem 18:30'}
      </div>
      <div className="fade" style={{ background: '#26252a', color: '#fff', borderRadius: 18, padding: '11px 14px', maxWidth: 280, fontSize: 14.5, lineHeight: 1.45 }}>
        {type === 'confirm'
          ? `RESERVA confirmada! ${seg.venue.name}, ${when} ${slot} - ${res.name}. ${pay === 'online' ? 'Pago ' : 'A pagar no local '}${money(price, { cents: false })}. Detalhes e cancelamento no app.`
          : `Lembrete RESERVA: amanha ${when} ${slot}, ${seg.venue.name}. Atencao: cancelamento agora tem taxa de ${fee}% (${feeVal}). Remarcar? Responda RM.`}
      </div>
      <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.35)', marginTop: 5, marginLeft: 4 }}>Entregue</div>
    </div>
  );
}

// ── E-mail ───────────────────────────────────────────────────
function EmailMsg({ type, seg, res, when, slot, price, user, fee, feeVal, pay, svc }) {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 30px -12px rgba(0,0,0,.5)' }}>
        <div style={{ background: type === 'confirm' ? seg.accent : 'var(--amber)', padding: '20px', textAlign: 'center' }}>
          <Icon name={type === 'confirm' ? 'check' : 'bell'} size={30} color="#fff" stroke={2.2} style={{ margin: '0 auto' }} />
          <div className="serif" style={{ color: '#fff', fontSize: 22, marginTop: 8 }}>{type === 'confirm' ? 'Reserva confirmada' : 'Sua reserva é amanhã'}</div>
        </div>
        <div style={{ padding: '18px 20px' }}>
          <p style={{ margin: '0 0 14px', fontSize: 14.5, color: 'var(--tx)', lineHeight: 1.5 }}>Olá <b>{user}</b>,</p>
          <p style={{ margin: '0 0 16px', fontSize: 14.5, color: 'var(--tx)', lineHeight: 1.5 }}>
            {type === 'confirm' ? 'Tudo certo! Guardamos seu horário na ' : 'Passando para lembrar do seu horário na '}<b>{seg.venue.name}</b>.
          </p>
          <div style={{ border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            {[['Data', when], [seg.slotKind === 'period' ? 'Período' : 'Horário', slot], [seg.noun, res.name + (svc ? ` · ${svc}` : '')], [pay === 'online' ? 'Pago online' : 'A pagar no local', money(price)]].map(([k, v], i) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 14px', borderTop: i ? '1px solid var(--line-2)' : 'none', fontSize: 13.5 }}>
                <span style={{ color: 'var(--tx-2)' }}>{k}</span><b style={{ color: 'var(--tx)' }}>{v}</b>
              </div>
            ))}
          </div>
          {type === 'reminder' && (
            <div style={{ background: 'var(--amber-bg)', border: '1px solid rgba(242,163,60,.25)', borderRadius: 12, padding: '12px 14px', fontSize: 13, color: '#e8c98c', lineHeight: 1.5, marginBottom: 16 }}>
              <b>Atenção à política de cancelamento.</b> A partir de agora (24h antes), cancelar tem taxa de <b>{fee}%</b> — {feeVal}. Para remarcar sem custo, fale com o estabelecimento.
            </div>
          )}
          <a style={{ display: 'block', textAlign: 'center', background: 'var(--green)', color: '#06120d', textDecoration: 'none', padding: '13px', borderRadius: 12, fontWeight: 600, fontSize: 15 }}>
            {type === 'confirm' ? 'Ver minha reserva' : 'Remarcar ou cancelar'}
          </a>
          <p style={{ fontSize: 11.5, color: 'var(--muted-2)', textAlign: 'center', margin: '16px 0 0' }}>Panzor · by Sagessetec · você recebe porque tem uma reserva ativa</p>
        </div>
      </div>
    </div>
  );
}

window.MessagesScene = MessagesScene;
