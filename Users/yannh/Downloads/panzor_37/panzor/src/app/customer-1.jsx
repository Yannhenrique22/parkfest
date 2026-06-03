// customer.jsx — Reserva: fluxo do cliente (mobile)
// Telas: vitrine → auth → booking → checkout → confirm
// Exporta para window: CustomerApp

const SAFE_TOP = 56; // espaço da status bar do iOS frame

// ── topo branco com marca / voltar ───────────────────────────
function MobileTop({ title, onBack, right }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 8, background: 'rgba(12,14,18,.82)',
      backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
      paddingTop: SAFE_TOP, borderBottom: '1px solid var(--rule)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px 14px' }}>
        {onBack ? (
          <button onClick={onBack} aria-label="Voltar" style={{
            width: 38, height: 38, borderRadius: 12, border: '1px solid var(--rule)',
            background: 'var(--panel-2)', display: 'grid', placeItems: 'center', cursor: 'pointer', flexShrink: 0,
          }}><Icon name="arrowL" size={18} /></button>
        ) : <Wordmark size={18} sub={false} />}
        <div style={{ flex: 1, textAlign: onBack ? 'left' : 'right' }}>
          {onBack && <span className="serif" style={{ fontSize: 19 }}>{title}</span>}
        </div>
        {right}
      </div>
    </div>
  );
}

// ── footer de ação fixo ───────────────────────────────────────
function MobileFooter({ children }) {
  return (
    <footer style={{
      borderTop: '1px solid var(--rule)', background: 'var(--panel)',
      padding: '14px 18px calc(14px + env(safe-area-inset-bottom))', paddingBottom: 30,
    }}>{children}</footer>
  );
}

// =====================================================================
// 1 · VITRINE
// =====================================================================
function Vitrine({ seg, onStart }) {
  const v = seg.venue;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
      <div className="noscroll" style={{ flex: 1, overflowY: 'auto' }}>
        <MobileTop right={<span className="pill" style={{ fontSize: 10, padding: '5px 10px' }}><span className="dot"></span>{seg.label}</span>} />

        {/* hero */}
        <div style={{ padding: '16px 18px 0' }}>
          <div style={{
            position: 'relative', height: 240, borderRadius: 22, overflow: 'hidden',
            background: `linear-gradient(150deg, var(--ac) 0%, var(--ac-dark) 58%, #060709 140%)`,
          }}>
            <div style={{ position: 'absolute', inset: 0, opacity: .14,
              background: 'radial-gradient(circle at 80% 20%, #fff 0 2px, transparent 3px), radial-gradient(circle at 20% 70%, #fff 0 2px, transparent 3px)', backgroundSize: '46px 46px' }} />
            <div style={{ position: 'absolute', right: -24, bottom: -24, opacity: .22 }}>
              <Icon name={seg.icon} size={190} color="#fff" stroke={1.1} />
            </div>
            <div style={{ position: 'absolute', left: 20, right: 20, bottom: 18 }}>
              <span className="mono" style={{ color: 'rgba(255,255,255,.85)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase' }}>{v.address.split('·')[1] || 'Disponível hoje'}</span>
              <h1 className="serif" style={{ color: '#fff', fontSize: 40, lineHeight: .98, margin: '6px 0 0' }}>{v.name}</h1>
            </div>
          </div>
        </div>

        {/* meta */}
        <div style={{ padding: '20px 22px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Icon name="star" size={16} color="var(--amber)" /> <b style={{ fontSize: 15 }}>{v.rating}</b>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>({v.reviews})</span>
            </span>
            <span style={{ color: 'var(--rule)' }}>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--muted)', fontSize: 13 }}>
              <Icon name="pin" size={15} color="var(--muted)" /> {v.address.split('·')[0]}
            </span>
          </div>
          <p style={{ fontSize: 17, lineHeight: 1.5, color: 'var(--ink-3)', margin: '4px 0 0' }}>{v.tagline}</p>

          {/* chips de modalidade/serviço */}
          <div style={{ marginTop: 18 }}>
            <div className="kicker" style={{ marginBottom: 10 }}>{seg.chooser.label}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {seg.chooser.options.map(o => <span key={o} className="chip">{o}</span>)}
            </div>
          </div>

          {/* destaques */}
          <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { ic: 'clock', t: 'Resposta na hora', d: 'Confirmação automática' },
              { ic: 'shield', t: 'Reserva garantida', d: 'Política transparente' },
              { ic: 'card', t: 'Pague como quiser', d: 'Online ou no local' },
              { ic: 'bell', t: 'Lembrete na véspera', d: 'WhatsApp, SMS e e-mail' },
            ].map(f => (
              <div key={f.t} className="card" style={{ padding: 14, boxShadow: 'none', borderRadius: 14 }}>
                <Icon name={f.ic} size={20} color={seg.accent} />
                <div style={{ fontWeight: 600, fontSize: 14, marginTop: 9 }}>{f.t}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{f.d}</div>
              </div>
            ))}
          </div>
          <div style={{ height: 16 }} />
        </div>
      </div>

      <MobileFooter>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>a partir de</div>
            <div className="serif" style={{ fontSize: 24 }}>{money(seg.basePrice, { cents: false })} <span style={{ fontSize: 14, color: 'var(--muted)' }} className="mono">{seg.unit}</span></div>
          </div>
          <span className="chip" style={{ borderColor: 'var(--green)', color: 'var(--green-dark)' }}><span style={{ width: 7, height: 7, borderRadius: 9, background: 'var(--green)' }}></span>Aberto agora</span>
        </div>
        <button className="btn btn-primary btn-block" onClick={onStart}>Reservar horário <Icon name="arrowR" size={18} color="#fff" /></button>
      </MobileFooter>
    </div>
  );
}

// =====================================================================
// 2 · AUTH (cadastro/login com conta real)
// =====================================================================
function Auth({ seg, onDone, onBack }) {
  const [mode, setMode] = React.useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('confirmed') === '1' ? 'login' : 'cadastro';
  });
  const [f, setF] = React.useState({ nome: '', email: '', senha: '', cel: '', cpf: '' });
  const [authState, setAuthState] = React.useState('form');
  const [authError, setAuthError] = React.useState('');
  const set = (k) => (e) => { setF({ ...f, [k]: maskField(k, e.target.value) }); setAuthError(''); };

  const validLogin = f.email.includes('@') && f.senha.length >= 4;
  const validCadastro = f.nome.trim().length > 2 && f.email.includes('@') && f.senha.length >= 6 && f.cel.length >= 14 && f.cpf.length >= 14;
  const valid = mode === 'login' ? validLogin : validCadastro;

  const handleGoogle = () => {
    const sp = window.SUPABASE;
    if (!sp) { onDone({ ...f, via: 'Google' }); return; }
    sessionStorage.setItem('panzor_booking_return', window.location.pathname);
    sp.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + window.location.pathname } });
  };

  const handleSubmit = async () => {
    const sp = window.SUPABASE;
    if (!sp) { onDone({ ...f, via: 'E-mail' }); return; }
    setAuthState('loading'); setAuthError('');
    try {
      if (mode === 'login') {
        const { data, error } = await sp.auth.signInWithPassword({ email: f.email, password: f.senha });
        if (error) { setAuthState('form'); setAuthError('E-mail ou senha incorretos.'); return; }
        const u = data.user;
        onDone({ nome: u.user_metadata?.full_name || u.user_metadata?.name || f.nome || u.email.split('@')[0], email: u.email, via: 'E-mail', cel: f.cel, cpf: f.cpf });
      } else {
        const { error } = await sp.auth.signUp({
          email: f.email, password: f.senha,
          options: { data: { name: f.nome }, emailRedirectTo: window.location.origin + window.location.pathname + '?confirmed=1' }
        });
        if (error) { setAuthState('form'); setAuthError(error.message); return; }
        setAuthState('pending_confirm');
      }
    } catch(e) { setAuthState('form'); setAuthError('Erro ao processar. Tente novamente.'); }
  };

  if (authState === 'pending_confirm') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
        <div className="noscroll" style={{ flex: 1, overflowY: 'auto' }}>
          <MobileTop title="Confirme seu e-mail" onBack={() => setAuthState('form')} />
          <div style={{ padding: '40px 22px', textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: 18, background: 'var(--ac-soft)', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
              <Icon name="mail" size={30} color="var(--ac)" />
            </div>
            <h2 className="serif" style={{ fontSize: 26, margin: '0 0 10px' }}>Verifique seu e-mail</h2>
            <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.6, margin: '0 0 8px' }}>
              Enviamos um link para <b>{f.email}</b>. Clique nele para ativar sua conta.
            </p>
            <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.5, margin: 0 }}>Não recebeu? Verifique o spam.</p>
          </div>
        </div>
        <MobileFooter>
          <button className="btn btn-primary btn-block" onClick={() => { setMode('login'); setAuthState('form'); }}>
            Já confirmei — fazer login <Icon name="arrowR" size={17} color="#fff" />
          </button>
        </MobileFooter>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
      <div className="noscroll" style={{ flex: 1, overflowY: 'auto' }}>
        <MobileTop title="Entrar" onBack={onBack} />
        <div style={{ padding: '22px 22px 8px' }}>
          <span className="kicker">acesso rápido</span>
          <h2 className="serif" style={{ fontSize: 30, lineHeight: 1.05, margin: '8px 0 6px' }}>
            {mode === 'cadastro' ? <>Crie sua conta em <span className="em-green">segundos</span></> : <>Bem-vindo de <span className="em-green">volta</span></>}
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.5, margin: 0 }}>
            Sua conta guarda reservas, lembretes e formas de pagamento.
          </p>
          <div style={{ marginTop: 22 }}>
            <button className="btn btn-ghost btn-block" onClick={handleGoogle}>
              <Icon name="google" size={20} /> Continuar com Google
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 18px' }}>
            <div className="rule" style={{ flex: 1 }}></div>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.12em' }}>ou com e-mail</span>
            <div className="rule" style={{ flex: 1 }}></div>
          </div>
          {authError && <div style={{ background: 'var(--down-bg)', border: '1px solid var(--down)', borderRadius: 10, padding: '10px 14px', color: 'var(--down)', fontSize: 14, marginBottom: 14 }}>{authError}</div>}
          {mode === 'cadastro' && (
            <div className="field"><label>Nome completo</label>
              <input value={f.nome} onChange={set('nome')} placeholder="Como podemos te chamar" /></div>
          )}
          <div className="field"><label>E-mail</label>
            <input value={f.email} onChange={set('email')} placeholder="voce@email.com" inputMode="email" /></div>
          <div className="field"><label>Senha</label>
            <input type="password" value={f.senha} onChange={set('senha')} placeholder={mode === 'cadastro' ? 'Mínimo 6 caracteres' : '••••••'} /></div>
          {mode === 'cadastro' && <>
            <div className="field"><label>Celular (WhatsApp)</label>
              <input value={f.cel} onChange={set('cel')} placeholder="(00) 00000-0000" inputMode="tel" /></div>
            <div className="field"><label>CPF</label>
              <input value={f.cpf} onChange={set('cpf')} placeholder="000.000.000-00" inputMode="numeric" /></div>
          </>}
          <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, margin: '6px 0 0', display: 'flex', gap: 8 }}>
            <Icon name="shield" size={15} color="var(--green)" />
            Seus dados são usados só para confirmar e lembrar suas reservas. Nada de spam.
          </p>
          <div style={{ height: 8 }} />
        </div>
      </div>
      <MobileFooter>
        <button className="btn btn-primary btn-block" disabled={!valid || authState === 'loading'} onClick={handleSubmit}>
          {authState === 'loading' ? 'Aguarde…' : mode === 'cadastro' ? 'Criar conta e continuar' : 'Entrar'} <Icon name="arrowR" size={18} color="#fff" />
        </button>
        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 14, color: 'var(--muted)' }}>
          {mode === 'cadastro' ? 'Já tem conta?' : 'Ainda não tem conta?'}{' '}
          <button onClick={() => { setMode(mode === 'cadastro' ? 'login' : 'cadastro'); setAuthError(''); }}
            style={{ border: 'none', background: 'none', color: 'var(--green-dark)', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
            {mode === 'cadastro' ? 'Entrar' : 'Criar agora'}
          </button>
        </div>
      </MobileFooter>
    </div>
  );
}
function maskField(k, val) {
  if (k === 'cel') {
    const d = val.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }
  if (k === 'cpf') {
    const d = val.replace(/\D/g, '').slice(0, 11);
    return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return val;
}

window.MobileTop = MobileTop;
window.MobileFooter = MobileFooter;
window.SAFE_TOP = SAFE_TOP;
window.Vitrine = Vitrine;
window.Auth = Auth;
