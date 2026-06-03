// Dono.jsx — acesso do dono da plataforma + console (Visão A).
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/db.js'
import { Brand, Field, PasswordField, Icon, GateTop, useAsync } from './shared.jsx'

export default function Dono() {
  const nav = useNavigate();
  const [session, setSession] = React.useState(undefined); // undefined=carregando
  const [rows, setRows] = React.useState(null);
  const { loading, error, setError, run } = useAsync();
  const [form, setForm] = React.useState({ email: '', password: '' });

  React.useEffect(() => { api.auth.session().then((s) => setSession(s && s.role === 'owner' ? s : null)); }, []);
  React.useEffect(() => { if (session) api.biz.consoleRows().then(setRows); }, [session]);

  const submit = () => run(() => api.auth.loginOwner(form)).then(setSession).catch(err => {
    if (err?.message === 'FIRST_LOGIN') setError('Conta criada! Verifique seu e-mail para confirmar e depois faça login.');
  });
  const logout = async () => { try { await api.auth.logout(); } catch(e) {} window.location.replace('/acesso-dono'); };

  if (session === undefined) return <Splash />;

  if (!session) {
    return (
      <AuthScaffold
        title={<>Console do <span className="em-green">Panzor</span></>}
        subtitle="Acesso restrito ao dono da plataforma."
        error={error} loading={loading}
        onBack={() => nav('/')}
      >
        <Field label="E-mail" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(''); }} placeholder="seu@email.com" inputMode="email" />
        <PasswordField label="Senha" value={form.password} onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(''); }} placeholder="••••••••" />
        <button className="btn btn-primary btn-block" style={{ marginTop: 6 }} disabled={loading} onClick={submit}>{loading ? 'Entrando…' : 'Entrar'} <Icon name="arrowR" size={18} color="#06120d" /></button>
        <p className="mono" style={{ fontSize: 11, color: 'var(--tx-2)', marginTop: 14, textAlign: 'center' }}>acesso restrito · dono da plataforma</p>
      </AuthScaffold>
    );
  }

  const PanzorAdmin = window.PanzorAdmin;
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', borderBottom: '1px solid var(--line)', background: 'var(--bg-2)', flexShrink: 0 }}>
        <Brand size={17} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--tx-2)' }}>{session.email}</span>
          <button className="chip" onClick={logout}><Icon name="arrowL" size={14} /> Sair</button>
        </div>
      </header>
      <div style={{ flex: 1, minHeight: 0 }}>
        <PanzorAdmin businesses={rows || []} ownerName={session.name} ownerEmail={session.email} />
      </div>
    </div>
  );
}

export function Splash() {
  return <div style={{ height: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg)' }}><span className="mono" style={{ color: 'var(--tx-2)', fontSize: 13 }}>carregando…</span></div>;
}

export function AuthScaffold({ title, subtitle, children, error, onBack }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <GateTop right={<button className="chip" onClick={onBack}><Icon name="arrowL" size={14} /> Início</button>} />
      <div style={{ display: 'grid', placeItems: 'center', padding: '48px 22px' }}>
        <div className="card" style={{ width: '100%', maxWidth: 420, padding: 30 }}>
          <h1 className="serif" style={{ fontSize: 32, lineHeight: 1.05, margin: '0 0 6px' }}>{title}</h1>
          <p style={{ color: 'var(--tx-2)', fontSize: 14.5, margin: '0 0 22px', lineHeight: 1.5 }}>{subtitle}</p>
          {children}
          {error && <div style={{ marginTop: 14, padding: '10px 13px', borderRadius: 10, background: 'var(--down-bg)', border: '1px solid rgba(240,102,77,.3)', color: 'var(--down)', fontSize: 13 }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
