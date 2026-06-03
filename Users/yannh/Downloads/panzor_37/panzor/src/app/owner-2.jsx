// owner-2.jsx — Reserva (visão dono): clientes, valores/repasse, config, onboarding + OwnerApp
// depende de owner-1.jsx e data.jsx

// ── CLIENTES ─────────────────────────────────────────────────
function ClientesScreen({ seg }) {
  const [q, setQ] = React.useState('');
  const [f, setF] = React.useState('Todos');
  const filters = ['Todos', 'VIP', 'Ativo', 'Novo'];
  const rows = USERS.filter(u => (f === 'Todos' || u.status === f) && u.name.toLowerCase().includes(q.toLowerCase()));
  const badge = (s) => ({
    VIP: { background: '#F3E8FF', color: '#7B2FB0' }, Ativo: { background: 'var(--green-100)', color: 'var(--green-dark)' },
    Novo: { background: 'var(--amber-bg)', color: '#A86A12' },
  }[s] || {});
  return (
    <div className="scroll fade" style={{ flex: 1, overflowY: 'auto', padding: '24px 30px 40px', background: 'var(--paper-2)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 18 }}>
        <KPI label="Clientes cadastrados" value="318" delta={23} sub="novos no mês" icon="users" accent={seg.accent} />
        <KPI label="Recorrentes" value="64%" delta={5.0} sub="pts" icon="trend" />
        <KPI label="Ticket médio" value={money(112.4)} delta={8.0} sub="vs. mai" icon="money" />
      </div>
      <div className="card" style={{ padding: 0, boxShadow: 'none', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9, background: 'var(--paper-2)', border: '1px solid var(--rule)', borderRadius: 10, padding: '8px 12px' }}>
            <Icon name="user" size={16} color="var(--muted)" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar cliente..." style={{ border: 'none', background: 'none', outline: 'none', flex: 1, fontFamily: "'DM Sans',sans-serif", fontSize: 14 }} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {filters.map(x => <button key={x} className={'chip' + (f === x ? ' active' : '')} style={{ fontSize: 12.5 }} onClick={() => setF(x)}>{x}</button>)}
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead><tr style={{ textAlign: 'left' }}>
            {['Cliente', 'Contato', 'CPF', 'Cliente desde', 'Reservas', 'Entrou via', 'Status'].map(h =>
              <th key={h} className="mono" style={{ padding: '11px 20px', fontSize: 10.5, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 500, borderBottom: '1px solid var(--rule)' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.map((u, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--rule-2)' }}>
                <td style={{ padding: '12px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 32, height: 32, borderRadius: 99, background: 'var(--ac-soft-2)', color: 'var(--ac)', display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 12 }}>{u.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                    <b style={{ fontWeight: 600 }}>{u.name}</b>
                  </div>
                </td>
                <td style={{ padding: '12px 20px', color: 'var(--ink-2)' }}>{u.phone}</td>
                <td style={{ padding: '12px 20px', color: 'var(--muted)' }} className="mono">{u.cpf}</td>
                <td style={{ padding: '12px 20px', color: 'var(--ink-2)' }}>{u.since}</td>
                <td style={{ padding: '12px 20px' }}><b>{u.bookings}</b></td>
                <td style={{ padding: '12px 20px' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--ink-2)' }}>
                  {u.via === 'Google' && <Icon name="google" size={15} />}{u.via === 'Microsoft' && <Icon name="microsoft" size={14} />}{u.via === 'E-mail' && <Icon name="mail" size={15} color="var(--muted)" />} {u.via}</span></td>
                <td style={{ padding: '12px 20px' }}><span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 99, ...badge(u.status) }}>{u.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── VALORES & REPASSE ────────────────────────────────────────
function ValoresScreen({ seg, fee }) {
  const platform = 5; // % taxa Reserva sobre pagamentos online
  const sample = [
    { d: 'Hoje', who: 'Camila Rocha', val: 120, pay: 'online' },
    { d: 'Hoje', who: 'Letícia Souza', val: 120, pay: 'online' },
    { d: 'Ontem', who: 'Patrícia Lima', val: 120, pay: 'online' },
    { d: 'Ontem', who: 'Rafael Nunes', val: 80, pay: 'local' },
  ];
  const online = sample.filter(s => s.pay === 'online');
  const grossOnline = online.reduce((a, b) => a + b.val, 0);
  const taxa = grossOnline * platform / 100;
  const liquido = grossOnline - taxa;

  return (
    <div className="scroll fade" style={{ flex: 1, overflowY: 'auto', padding: '24px 30px 40px', background: 'var(--paper-2)' }}>
      {/* repasse */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        <KPI label="Recebido · online" value={money(grossOnline, { cents: false })} sub="no período" icon="card" accent={seg.accent} />
        <KPI label={`Taxa Panzor · ${platform}%`} value={'– ' + money(taxa, { cents: false })} sub="processamento" icon="money" />
        <KPI label="Repasse líquido" value={money(liquido, { cents: false })} sub="a receber" icon="trend" accent="var(--ac)" />
        <KPI label="Próximo repasse" value="Amanhã" sub="D+1 · automático" icon="calendar" accent={seg.accent} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        {/* como funciona */}
        <div className="card" style={{ padding: '18px 22px', boxShadow: 'none' }}>
          <div className="kicker" style={{ marginBottom: 14 }}>Como você recebe</div>
          {[
            { ic: 'card', t: 'Pagamento online', d: `Cliente paga no app. Você recebe ${100 - platform}% em D+1, direto na conta. A taxa Panzor (${platform}%) cobre processamento e repasse.`, c: 'var(--ac)', bg: 'var(--ac-soft)' },
            { ic: 'money', t: 'Pagamento no local', d: 'Cliente acerta no balcão. 100% seu, sem nenhuma taxa da plataforma — a reserva fica registrada igual.', c: 'var(--info)', bg: 'var(--info-bg)' },
            { ic: 'shield', t: 'Taxa de cancelamento', d: `Cancelou faltando menos de 24h? Você retém ${fee}% do valor automaticamente. Você define esse percentual.`, c: 'var(--warn)', bg: 'var(--warn-bg)' },
          ].map(r => (
            <div key={r.t} style={{ display: 'flex', gap: 13, padding: '11px 0', borderTop: '1px solid var(--rule-2)' }}>
              <span style={{ width: 38, height: 38, borderRadius: 10, background: r.bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={r.ic} size={19} color={r.c} /></span>
              <div><div style={{ fontWeight: 600, fontSize: 14.5 }}>{r.t}</div><div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginTop: 2 }}>{r.d}</div></div>
            </div>
          ))}
        </div>

        {/* tabela de preços */}
        <div className="card" style={{ padding: 0, boxShadow: 'none', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="serif" style={{ fontSize: 18 }}>Tabela de preços</div>
            <span className="chip" style={{ fontSize: 12 }}><Icon name="edit" size={14} /> Editar</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead><tr>
              {[seg.noun, 'Normal', seg.slotKind === 'period' ? 'Fim de semana' : 'Pico (18–21h)'].map(h => <th key={h} className="mono" style={{ textAlign: h === seg.noun ? 'left' : 'right', padding: '10px 20px', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', fontWeight: 500, borderBottom: '1px solid var(--rule)' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {seg.resources.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--rule-2)' }}>
                  <td style={{ padding: '13px 20px' }}><div style={{ fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{r.meta}</div></td>
                  <td style={{ padding: '13px 20px', textAlign: 'right' }} className="serif"><span style={{ fontSize: 17 }}>{money(seg.basePrice + i * 10, { cents: false })}</span></td>
                  <td style={{ padding: '13px 20px', textAlign: 'right' }} className="serif"><span style={{ fontSize: 17, color: seg.accent }}>{money(seg.peakPrice + i * 10, { cents: false })}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '12px 20px', fontSize: 12, color: 'var(--muted)', background: 'var(--paper-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="info" size={15} color="var(--muted)" /> Preço dinâmico sugerido nos horários de pico.
          </div>
        </div>
      </div>

      {/* extrato */}
      <div className="card" style={{ padding: 0, boxShadow: 'none', overflow: 'hidden', marginTop: 16 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--rule)' }} className="serif">Extrato de repasses</div>
        {sample.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', borderTop: i ? '1px solid var(--rule-2)' : 'none' }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: s.pay === 'online' ? 'var(--ac-soft)' : 'var(--paper-2)', border: s.pay === 'online' ? 'none' : '1px solid var(--rule)', display: 'grid', placeItems: 'center' }}><Icon name={s.pay === 'online' ? 'card' : 'money'} size={17} color={s.pay === 'online' ? 'var(--ac)' : 'var(--muted)'} /></span>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{s.who}</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.d} · {s.pay === 'online' ? 'Pago online' : 'Recebido no local'}</div></div>
            {s.pay === 'online' ? <div style={{ textAlign: 'right' }}>
              <div className="serif" style={{ fontSize: 16 }}>{money(s.val * (100 - platform) / 100)}</div>
              <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>de {money(s.val, { cents: false })} · –{platform}%</div>
            </div> : <div style={{ textAlign: 'right' }}><div className="serif" style={{ fontSize: 16 }}>{money(s.val)}</div><div className="mono" style={{ fontSize: 10.5, color: 'var(--green-dark)' }}>sem taxa</div></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CONFIGURAÇÕES (taxa de cancelamento editável) ────────────
function ConfigScreen({ seg, fee, setFee }) {
  const [win, setWin] = React.useState(24);
  const [chans, setChans] = React.useState({ whatsapp: true, sms: true, email: true });
  const preview = 120;
  return (
    <div className="scroll fade" style={{ flex: 1, overflowY: 'auto', padding: '24px 30px 40px', background: 'var(--paper-2)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 980 }}>
        {/* cancelamento */}
        <div className="card" style={{ padding: '22px', boxShadow: 'none' }}>
          <div className="kicker" style={{ marginBottom: 6 }}>Política de cancelamento</div>
          <h3 className="serif" style={{ fontSize: 22, margin: '0 0 4px' }}>Taxa de cancelamento</h3>
          <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5, margin: '0 0 18px' }}>Quanto o cliente paga ao cancelar dentro da janela. Padrão de mercado: <b>50%</b>. Você ajusta como quiser — ou zera.</p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 14 }}>
            <span className="serif" style={{ fontSize: 56, lineHeight: 1, color: seg.accent }}>{fee}</span>
            <span className="serif" style={{ fontSize: 30, color: seg.accent }}>%</span>
          </div>
          <input type="range" min="0" max="100" step="5" value={fee} onChange={e => setFee(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: seg.accent }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            {[0, 25, 50, 75, 100].map(p => <button key={p} className={'chip' + (fee === p ? ' active' : '')} onClick={() => setFee(p)} style={{ fontSize: 13 }}>{p === 0 ? 'Sem taxa' : p + '%'}</button>)}
          </div>

          <div style={{ marginTop: 18, padding: '13px 15px', borderRadius: 12, background: 'var(--paper-2)', border: '1px solid var(--rule)', fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>
            <b>Janela:</b> cancelamentos a partir de <b>{win}h</b> antes geram a taxa.<br />
            <span style={{ color: 'var(--muted)' }}>Numa reserva de {money(preview, { cents: false })}, a taxa seria <b style={{ color: seg.accent }}>{money(preview * fee / 100, { cents: false })}</b>.</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {[12, 24, 48].map(h => <button key={h} className={'chip' + (win === h ? ' active' : '')} onClick={() => setWin(h)} style={{ fontSize: 13 }}>{h}h antes</button>)}
          </div>
        </div>

        {/* canais + segmento */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: '22px', boxShadow: 'none' }}>
            <div className="kicker" style={{ marginBottom: 6 }}>Avisos automáticos</div>
            <h3 className="serif" style={{ fontSize: 22, margin: '0 0 16px' }}>Canais de mensagem</h3>
            {[['whatsapp', 'WhatsApp', 'Confirmação + lembrete'], ['sms', 'SMS', 'Backup sem internet'], ['email', 'E-mail', 'Comprovante completo']].map(([k, l, d]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 0', borderTop: '1px solid var(--rule-2)' }}>
                <Icon name={k === 'whatsapp' ? 'whatsapp' : k === 'sms' ? 'chat' : 'mail'} size={20} color={chans[k] ? seg.accent : 'var(--muted-2)'} />
                <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{l}</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>{d}</div></div>
                <button onClick={() => setChans({ ...chans, [k]: !chans[k] })} style={{ width: 46, height: 27, borderRadius: 99, border: 'none', cursor: 'pointer', background: chans[k] ? seg.accent : 'var(--rule)', position: 'relative', transition: '.2s' }}>
                  <span style={{ position: 'absolute', top: 3, left: chans[k] ? 22 : 3, width: 21, height: 21, borderRadius: 99, background: '#fff', transition: '.2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }}></span>
                </button>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: '20px 22px', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 44, height: 44, borderRadius: 12, background: seg.accent, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={seg.icon} size={22} color="#fff" /></span>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14.5 }}>Segmento: {seg.label}</div><div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Define telas, recursos e termos do seu painel.</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ONBOARDING (escolha de segmento) ─────────────────────────
function OnboardingSegment({ current, onPick, onDone }) {
  const [pick, setPick] = React.useState(current);
  return (
    <div className="fade scroll" style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '54px 30px', width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--mint)' }}>Configuração inicial · passo 1 de 3</span>
          <h1 className="serif" style={{ color: '#fff', fontSize: 44, lineHeight: 1.05, margin: '14px 0 10px' }}>Qual é o seu <span style={{ color: 'var(--mint)', fontStyle: 'italic' }}>segmento</span>?</h1>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 16, maxWidth: 520, margin: '0 auto', lineHeight: 1.5 }}>O Reserva adapta as telas, os termos e o fluxo de agendamento ao seu tipo de negócio.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 38 }}>
          {Object.values(SEGMENTS).map(s => {
            const on = pick === s.id;
            return (
              <button key={s.id} onClick={() => setPick(s.id)} style={{
                textAlign: 'left', cursor: 'pointer', padding: 22, borderRadius: 18, transition: '.18s',
                border: `2px solid ${on ? s.accent : 'rgba(255,255,255,.12)'}`, background: on ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.03)',
                position: 'relative', transform: on ? 'translateY(-3px)' : 'none',
              }}>
                <span style={{ width: 52, height: 52, borderRadius: 14, background: s.accent, display: 'grid', placeItems: 'center' }}><Icon name={s.icon} size={28} color="#fff" /></span>
                <div className="serif" style={{ color: '#fff', fontSize: 22, margin: '16px 0 6px' }}>{s.label}</div>
                <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 13, lineHeight: 1.5 }}>{s.venue.tagline}</div>
                <div className="mono" style={{ color: on ? s.accent : 'rgba(255,255,255,.35)', fontSize: 11, marginTop: 14, textTransform: 'uppercase', letterSpacing: '.08em' }}>agenda por {s.noun.toLowerCase()}</div>
                {on && <span style={{ position: 'absolute', top: 18, right: 18, width: 26, height: 26, borderRadius: 99, background: s.accent, display: 'grid', placeItems: 'center' }}><Icon name="check" size={16} color="#fff" stroke={2.5} /></span>}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 36 }}>
          <button className="btn btn-block" style={{ background: 'var(--ac)', color: '#06120d', maxWidth: 340 }} onClick={() => { onPick(pick); onDone(); }}>
            Continuar para o painel <Icon name="arrowR" size={18} color="#06120d" />
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <button onClick={onDone} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>Pular configuração</button>
        </div>
      </div>
    </div>
  );
}

// ── ORQUESTRADOR DO DONO ─────────────────────────────────────
function OwnerApp({ segKey, fee, setFee, onPickSegment, startPhase = 'onboarding', onReconfig,
  externalTab, hideSidebar, ownerName, ownerEmail, businessName }) {
  const seg = SEGMENTS[segKey];
  const [tab, setTab] = React.useState('painel');
  const [phase, setPhase] = React.useState(startPhase);
  const goPhase = (p) => setPhase(p);
  const reconfig = () => onReconfig ? onReconfig() : goPhase('onboarding');
  const activeTab = externalTab || tab;

  const titles = {
    painel: ['Visão geral', 'Visão geral do seu estabelecimento, hoje'],
    agenda: ['Agenda', 'Seus horários disponíveis e reservados'],
    clientes: ['Clientes', 'Quem reserva no seu espaço'],
    valores: ['Valores & repasse', 'Preços, taxas e quando você recebe'],
    config: ['Configurações', 'Taxa de cancelamento, avisos e segmento'],
  };

  if (phase === 'onboarding') {
    return <OnboardingSegment current={segKey} onPick={onPickSegment} onDone={() => goPhase('app')} />;
  }

  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--bg)' }}>
      {!hideSidebar && <Sidebar seg={seg} active={activeTab} onNav={(t) => t === 'setup' ? reconfig() : setTab(t)} ownerName={ownerName} ownerEmail={ownerEmail} businessName={businessName} />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {!hideSidebar && <Topbar seg={seg} title={titles[activeTab][0]} sub={titles[activeTab][1]} businessName={businessName} />}
        {activeTab === 'painel' && <DashboardScreen seg={seg} />}
        {activeTab === 'agenda' && <AgendaScreen seg={seg} />}
        {activeTab === 'clientes' && <ClientesScreen seg={seg} />}
        {activeTab === 'valores' && <ValoresScreen seg={seg} fee={fee} />}
        {activeTab === 'config' && <ConfigScreen seg={seg} fee={fee} setFee={setFee} />}
      </div>
    </div>
  );
}

window.ClientesScreen = ClientesScreen;
window.ValoresScreen = ValoresScreen;
window.ConfigScreen = ConfigScreen;
window.OnboardingSegment = OnboardingSegment;
window.OwnerApp = OwnerApp;
