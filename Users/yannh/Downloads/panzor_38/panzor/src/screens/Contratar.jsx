// Contratar.jsx — onboarding do empreendedor (segmento → plano → conta).
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/db.js'
import { Splash } from './Dono.jsx'

export default function Contratar() {
  const nav = useNavigate();
  const [session, setSession] = React.useState(undefined);

  React.useEffect(() => {
    api.auth.session().then((s) => {
      if (!s || s.role !== 'entrepreneur') { nav('/entrar'); return; }
      if (s.businessId) { nav('/painel'); return; } // já tem negócio
      setSession(s);
    });
  }, []);

  const onDone = async ({ seg, plan, account }) => {
    await api.biz.create({ account, segment: seg, planId: plan, ownerEmail: session.email });
    nav('/painel');
  };

  if (session === undefined) return <Splash />;
  const EmpreendedorEntry = window.EmpreendedorEntry;
  return (
    <div style={{ height: '100vh' }}>
      <EmpreendedorEntry initialSeg="quadras" onDone={onDone} defaultEmail={session.email || ''} defaultName={session.name || ''} />
    </div>
  );
}
