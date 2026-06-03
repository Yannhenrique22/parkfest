// empreendedor.jsx — Visão 2: entrada/contratação do empreendedor (desktop)
// EmpreendedorEntry: 3 passos (segmento → plano → conta) → onDone(segKey)

function StepDots({ step, total = 3 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <span style={{ width: 24, height: 24, borderRadius: 99, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700,
            background: i < step ? 'var(--ac)' : i === step ? 'var(--ac-soft)' : 'var(--panel-2)',
            color: i < step ? '#0a0b0d' : i === step ? 'var(--ac)' : 'var(--tx-3)', border: i === step ? '1px solid var(--ac)' : '1px solid var(--line)' }} className="mono">
            {i < step ? '✓' : i + 1}</span>
          {i < total - 1 && <span style={{ width: 26, height: 2, background: i < step ? 'var(--ac)' : 'var(--line)' }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function EmpreendedorEntry({ initialSeg = 'quadras', onDone, defaultEmail = '', defaultName = '' }) {
  const [step, setStep] = React.useState(0);
  const [seg, setSeg] = React.useState(initialSeg);
  const [plan, setPlan] = React.useState('pro');
  const [f, setF] = React.useState({ resp: defaultName, nome: '', email: defaultEmail, wpp: '' });
  const set = (k) => (e) => {
    let v = e.target.value;
    if (k === 'wpp') v = maskPhone(v);
    setF({ ...f, [k]: v });
  };
  const wppDigits = f.wpp.replace(/\D/g, '').length;
  const accountOk = f.resp.trim().length > 2 && f.nome.trim().length > 1 && f.email.includes('@') && wppDigits >= 10;
  const STEPS = ['Segmento', 'Plano', 'Conta'];
  const M = typeof window !== 'undefined' && window.innerWidth < 700;

  function maskPhone(v) {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  }

  return (
    <div className="scroll" style={{ height: '100%', overflowY: 'auto', background: 'var(--bg)' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 30px', borderBottom: '1px solid var(--line)', position: 'sticky', top: 0, background: 'var(--bg-2)', zIndex: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}><Mark size={34} /><div><div style={{ fontFamily: "'Crimson Pro',serif", fontWeight: 600, fontSize: 20 }}>Panzor</div><div className="mono" style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--tx-3)' }}>contratar · {STEPS[step]}</div></div></div>
        <StepDots step={step} />
        <span className="mono" style={{ fontSize: 12, color: 'var(--tx-3)' }}>passo {step + 1} / 3</span>
      </div>

      <div className="fade" key={step} style={{ maxWidth: 900, margin: '0 auto', padding: M ? '24px 16px 60px' : '44px 30px 60px' }}>
        {step === 0 && <>
          <div style={{ textAlign: 'center', marginBottom: 34 }}>
            <span className="kicker">comece grátis · 14 dias</span>
            <h1 className="serif" style={{ fontSize: 44, lineHeight: 1.04, margin: '12px 0 10px' }}>Qual é o <span className="em-green">seu negócio</span>?</h1>
            <p style={{ color: 'var(--tx-2)', fontSize: 16, maxWidth: 520, margin: '0 auto', lineHeight: 1.5 }}>O Panzor adapta agenda, telas e termos ao seu segmento. Você muda quando quiser.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : 'repeat(3,1fr)', gap: 16 }}>
            {Object.values(SEGMENTS).map(s => {
              const on = seg === s.id;
              return (
                <button key={s.id} onClick={() => setSeg(s.id)} style={{ textAlign: 'left', cursor: 'pointer', padding: 22, borderRadius: 18, transition: '.16s', position: 'relative',
                  border: `2px solid ${on ? 'var(--ac)' : 'var(--line)'}`, background: on ? 'var(--ac-soft)' : 'var(--panel)', transform: on ? 'translateY(-3px)' : 'none' }}>
                  <span style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--ac)', display: 'grid', placeItems: 'center' }}><Icon name={s.icon} size={28} color="#0a0b0d" /></span>
                  <div className="serif" style={{ fontSize: 22, margin: '16px 0 6px' }}>{s.label}</div>
                  <div style={{ color: 'var(--tx-2)', fontSize: 13, lineHeight: 1.5 }}>{s.venue.tagline}</div>
                  <div className="mono" style={{ color: on ? 'var(--ac)' : 'var(--tx-3)', fontSize: 11, marginTop: 14, textTransform: 'uppercase', letterSpacing: '.08em' }}>agenda por {s.noun.toLowerCase()}</div>
                  {on && <span style={{ position: 'absolute', top: 18, right: 18, width: 26, height: 26, borderRadius: 99, background: 'var(--ac)', display: 'grid', placeItems: 'center' }}><Icon name="check" size={16} color="#0a0b0d" stroke={2.5} /></span>}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 34 }}>
            <button className="btn btn-primary" style={{ minWidth: 280 }} onClick={() => setStep(1)}>Continuar <Icon name="arrowR" size={18} color="#06120d" /></button>
          </div>
        </>}

        {step === 1 && <>
          <div style={{ textAlign: 'center', marginBottom: 34 }}>
            <span className="kicker">planos</span>
            <h1 className="serif" style={{ fontSize: 44, lineHeight: 1.04, margin: '12px 0 10px' }}>Escolha seu <span className="em-green">plano</span></h1>
            <p style={{ color: 'var(--tx-2)', fontSize: 16, maxWidth: 520, margin: '0 auto', lineHeight: 1.5 }}>Sem fidelidade. Cancele quando quiser. Todos com teste grátis de 14 dias.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : 'repeat(3,1fr)', gap: 16, alignItems: 'start' }}>
            {PLANS.map(p => {
              const on = plan === p.id;
              return (
                <button key={p.id} onClick={() => setPlan(p.id)} style={{ textAlign: 'left', cursor: 'pointer', padding: 22, borderRadius: 18, transition: '.16s', position: 'relative',
                  border: `2px solid ${on ? 'var(--ac)' : 'var(--line)'}`, background: on ? 'var(--ac-soft)' : 'var(--panel)', transform: on ? 'translateY(-3px)' : 'none' }}>
                  {p.popular && <span className="mono" style={{ position: 'absolute', top: -11, left: 22, fontSize: 10, background: 'var(--ac)', color: '#0a0b0d', padding: '3px 9px', borderRadius: 6, letterSpacing: '.08em', textTransform: 'uppercase' }}>{p.tag}</span>}
                  <div className="serif" style={{ fontSize: 24 }}>{p.name}</div>
                  <div className="num" style={{ fontSize: 34, fontWeight: 500, marginTop: 6 }}>{money(p.price, { cents: false })}<span style={{ fontSize: 13, color: 'var(--tx-3)' }} className="mono"> /mês</span></div>
                  <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {p.feats.map(ft => <div key={ft} style={{ display: 'flex', gap: 9, alignItems: 'center', fontSize: 13, color: 'var(--tx-2)' }}><Icon name="check" size={15} color="var(--ac)" /> {ft}</div>)}
                  </div>
                  {on && <span style={{ position: 'absolute', top: 18, right: 18, width: 26, height: 26, borderRadius: 99, background: 'var(--ac)', display: 'grid', placeItems: 'center' }}><Icon name="check" size={16} color="#0a0b0d" stroke={2.5} /></span>}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 34 }}>
            <button className="btn btn-ghost" onClick={() => setStep(0)}><Icon name="arrowL" size={17} color="var(--tx)" /> Voltar</button>
            <button className="btn btn-primary" style={{ minWidth: 240 }} onClick={() => setStep(2)}>Continuar <Icon name="arrowR" size={18} color="#06120d" /></button>
          </div>
        </>}

        {step === 2 && <>
          <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : '1fr 340px', gap: M ? 16 : 30, alignItems: 'start' }}>
            <div>
              <span className="kicker">quase lá</span>
              <h1 className="serif" style={{ fontSize: 40, lineHeight: 1.04, margin: '12px 0 8px' }}>Crie a conta do seu negócio</h1>
              <p style={{ color: 'var(--tx-2)', fontSize: 15, margin: '0 0 24px', lineHeight: 1.5 }}>É grátis por 14 dias. Sem cartão agora.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field"><label>Seu nome</label><input value={f.resp} onChange={set('resp')} placeholder="Responsável" /></div>
                <div className="field"><label>Nome do negócio</label><input value={f.nome} onChange={set('nome')} placeholder="Ex: Arena Beira-Mar" /></div>
                <div className="field"><label>E-mail</label><input value={f.email} onChange={set('email')} placeholder="voce@negocio.com" inputMode="email" /></div>
                <div className="field"><label>WhatsApp</label><input value={f.wpp} onChange={set('wpp')} placeholder="(00) 00000-0000" inputMode="tel" /></div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button className="btn btn-ghost" style={{ flex: '0 0 auto' }} onClick={() => setStep(1)}><Icon name="arrowL" size={17} color="var(--tx)" /></button>
                <button className="btn btn-primary" style={{ flex: 1 }} disabled={!accountOk} onClick={() => onDone({ seg, plan, account: f })}>Criar conta e abrir painel <Icon name="arrowR" size={18} color="#06120d" /></button>
              </div>
            </div>
            {/* resumo */}
            <div className="panel" style={{ padding: 20, boxShadow: 'none' }}>
              <div className="kicker" style={{ marginBottom: 14 }}>Resumo</div>
              {[['Segmento', SEGMENTS[seg].label, SEGMENTS[seg].icon], ['Plano', PLANS.find(p => p.id === plan).name + ' · ' + money(PLANS.find(p => p.id === plan).price, { cents: false }) + '/mês', 'money']].map(([k, v, ic]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderTop: '1px solid var(--line-2)' }}>
                  <span style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--ac-soft)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={ic} size={18} color="var(--ac)" /></span>
                  <div><div className="mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--tx-3)' }}>{k}</div><div style={{ fontWeight: 600, fontSize: 14 }}>{v}</div></div>
                </div>
              ))}
              <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 12, background: 'var(--ac-soft)', border: '1px solid color-mix(in srgb, var(--ac) 30%, transparent)', fontSize: 12.5, color: 'var(--tx-2)', lineHeight: 1.5 }}>
                <b style={{ color: 'var(--ac)' }}>14 dias grátis.</b> Depois {money(PLANS.find(p => p.id === plan).price, { cents: false })}/mês. Cancele quando quiser.
              </div>
            </div>
          </div>
        </>}
      </div>
    </div>
  );
}

window.EmpreendedorEntry = EmpreendedorEntry;
