import React from 'react'
import { useNavigate } from 'react-router-dom'
import { api, supabase as sb } from '../lib/db.js'
import { Field, PasswordField, Icon, useAsync } from './shared.jsx'
import { AuthScaffold } from './Dono.jsx'

const OWNER = 'yannhenrique22@gmail.com'

function goAfterLogin(email) {
  window.location.replace(email === OWNER ? '/acesso-dono' : '/contratar');
}

export default function Entrar() {
  const nav = useNavigate();
  const [mode, setMode] = React.useState('login');
  const [form, setForm] = React.useState({ name: '', email: '', password: '' });
  const [pending, setPending] = React.useState(null);
  const [oauthState, setOauthState] = React.useState('idle'); // idle | loading | error
  const [oauthMsg, setOauthMsg] = React.useState('');
  const { loading, error, setError, run } = useAsync();

  React.useEffect(() => {
    const isOAuthReturn = window.location.search.includes('code=') || window.location.hash.includes('access_token');
    if (isOAuthReturn) setOauthState('loading');

    const redirect = (user) => {
      window.location.replace(user.email === OWNER ? '/acesso-dono' : '/contratar');
    };

    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      // Só redireciona se for retorno de OAuth — nunca redireciona automaticamente
      if (isOAuthReturn && session?.user) { redirect(session.user); return; }
      if (isOAuthReturn && event === 'SIGNED_OUT') {
        setOauthState('error');
        setOauthMsg('Autenticação cancelada. Tente novamente.');
      }
    });

    if (isOAuthReturn) {
      sb.auth.getSession().then(({ data }) => {
        if (data?.session?.user) redirect(data.session.user);
      });
      const t = setTimeout(() => setOauthState(s => s === 'loading' ? 'error' : s), 12000);
      setOauthMsg('Tempo esgotado ao conectar com Google. Tente novamente.');
      return () => { subscription.unsubscribe(); clearTimeout(t); };
    }

    // Não é retorno OAuth: mostra o formulário normalmente.
    // NÃO redireciona sessão existente — usuário pode querer trocar de conta.
    return () => subscription.unsubscribe();
  }, []);

  const set = k => e => { setForm({ ...form, [k]: e.target.value }); setError(''); };

  const valid = mode === 'login'
    ? form.email.includes('@') && form.password.length >= 4
    : form.name.trim().length > 1 && form.email.includes('@') && form.password.length >= 4;

  const loginGoogle = () => {
    sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
        queryParams: { prompt: 'select_account' }, // força escolha de conta
      }
    });
  };

  const submit = () => run(async () => {
    if (mode === 'login') {
      const s = await api.auth.loginEntrepreneur({ email: form.email, password: form.password });
      goAfterLogin(s.email);
    } else {
      const s = await api.auth.signupEntrepreneur({ name: form.name, email: form.email, password: form.password });
      if (s.needsConfirmation) { setPending(form.email); return; }
      goAfterLogin(s.email);
    }
  }).catch(err => {
    if (err?.message === 'EMAIL_NOT_CONFIRMED') { setPending(form.email); setError(''); }
  });

  // Tela de carregamento OAuth
  if (oauthState === 'loading') {
    return (
      <AuthScaffold title={<>Autorizando com <span className="em-green">Google</span>…</>} subtitle="Aguarde, estamos conectando sua conta.">
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div className="mono" style={{ fontSize: 13, color: 'var(--tx-2)', lineHeight: 1.6 }}>
            Verificando sessão…
          </div>
        </div>
      </AuthScaffold>
    );
  }

  if (oauthState === 'error') {
    return (
      <AuthScaffold title="Erro no login" subtitle="Não foi possível autenticar com o Google." onBack={() => { setOauthState('idle'); window.history.replaceState({}, '', '/entrar'); }}>
        <div style={{ background: 'var(--down-bg)', border: '1px solid var(--down)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <p style={{ color: 'var(--down)', fontSize: 13, margin: 0, lineHeight: 1.5, fontFamily: 'monospace', wordBreak: 'break-all' }}>{oauthMsg}</p>
        </div>
        <button className="btn btn-primary btn-block" onClick={() => { setOauthState('idle'); window.history.replaceState({}, '', '/entrar'); }}>
          Tentar novamente
        </button>
      </AuthScaffold>
    );
  }

  if (pending) {
    return (
      <AuthScaffold title={<>Confirme seu <span className="em-green">e-mail</span></>} subtitle="Enviamos um link para o endereço abaixo." onBack={() => setPending(null)}>
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--ac-soft)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
            <Icon name="mail" size={28} color="var(--ac)" />
          </div>
          <div style={{ fontSize: 15, color: 'var(--tx)', fontWeight: 600, marginBottom: 6 }}>{pending}</div>
          <p style={{ fontSize: 14, color: 'var(--tx-2)', lineHeight: 1.6, margin: '0 0 20px' }}>
            Clique no link do e-mail para ativar sua conta. Depois volte aqui e faça login.
          </p>
          <button className="btn btn-primary btn-block" onClick={() => { setPending(null); setMode('login'); }}>
            Já confirmei — fazer login <Icon name="arrowR" size={17} color="#06120d" />
          </button>
        </div>
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold
      title={mode === 'login' ? <>Acesse seu <span className="em-green">negócio</span></> : <>Crie sua <span className="em-green">conta</span></>}
      subtitle={mode === 'login' ? 'Entre para gerenciar agenda, reservas e o link da sua loja.' : 'Comece grátis. Depois você escolhe o segmento e o plano.'}
      error={error} onBack={() => nav('/')}
    >
      <button className="btn btn-ghost btn-block" style={{ marginBottom: 16 }} disabled={loading} onClick={loginGoogle}>
        <Icon name="google" size={19} /> Continuar com Google
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div className="rule" style={{ flex: 1 }} />
        <span className="mono" style={{ fontSize: 11, color: 'var(--tx-2)', textTransform: 'uppercase', letterSpacing: '.12em' }}>ou com e-mail</span>
        <div className="rule" style={{ flex: 1 }} />
      </div>
      {mode === 'signup' && <Field label="Seu nome *" value={form.name} onChange={set('name')} placeholder="Nome completo" />}
      <Field label="E-mail" value={form.email} onChange={set('email')} placeholder="voce@negocio.com" inputMode="email" />
      <PasswordField label="Senha" value={form.password} onChange={set('password')} placeholder="Mínimo 4 caracteres" />
      <button className="btn btn-primary btn-block" style={{ marginTop: 8 }} disabled={!valid || loading} onClick={submit}>
        {loading ? 'Aguarde…' : mode === 'login' ? 'Entrar' : 'Criar conta'} <Icon name="arrowR" size={18} color="#06120d" />
      </button>
      <div style={{ textAlign: 'center', marginTop: 14, fontSize: 14, color: 'var(--tx-2)' }}>
        {mode === 'login' ? 'Ainda não tem conta?' : 'Já tem conta?'}{' '}
        <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
          style={{ border: 'none', background: 'none', color: 'var(--ac)', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
          {mode === 'login' ? 'Criar agora' : 'Entrar'}
        </button>
      </div>
    </AuthScaffold>
  );
}
