import React from 'react'
import { supabase as sb } from '../lib/db.js'

const OWNER = 'yannhenrique22@gmail.com'
function redirect(email) {
  window.location.replace(email === OWNER ? '/acesso-dono' : '/contratar');
}

export default function AuthCallback() {
  const [lines, setLines] = React.useState(['Carregando…']);
  const add = (s) => setLines(prev => [...prev, s]);

  React.useEffect(() => {
    const run = async () => {
      // Info da URL
      add('URL search: ' + (window.location.search || '(vazio)'));
      add('URL hash: ' + (window.location.hash.substring(0, 60) || '(vazio)'));

      // Keys do localStorage com "supabase" ou "verifier"
      const lsKeys = Object.keys(localStorage).filter(k => k.includes('supabase') || k.includes('sb-') || k.includes('verifier') || k.includes('pkce'));
      add('LocalStorage relevante: ' + (lsKeys.join(' | ') || '(nenhum)'));

      // Tenta getSession
      const { data: gs } = await sb.auth.getSession();
      add('getSession: ' + (gs?.session?.user?.email || 'null'));
      if (gs?.session?.user) { redirect(gs.session.user.email); return; }

      // Tenta exchange manual
      if (window.location.search.includes('code=')) {
        const { data, error } = await sb.auth.exchangeCodeForSession(window.location.href);
        add('exchangeCode error: ' + (error?.message || 'none'));
        add('exchangeCode session: ' + (data?.session?.user?.email || 'null'));
        if (data?.session?.user) { redirect(data.session.user.email); return; }
      }

      // onAuthStateChange
      add('aguardando onAuthStateChange…');
      const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
        add('event: ' + event + ' | user: ' + (session?.user?.email || 'null'));
        if (session?.user) { subscription.unsubscribe(); redirect(session.user.email); }
      });
      setTimeout(() => { add('timeout — sem sessão'); }, 12000);
    };
    run();
  }, []);

  return (
    <div style={{ minHeight: '100vh', padding: 32, background: 'var(--bg)', fontFamily: 'monospace' }}>
      <div style={{ fontSize: 18, color: 'var(--tx)', marginBottom: 16, fontFamily: "'Crimson Pro',serif" }}>Panzor · Debug OAuth</div>
      {lines.map((l, i) => (
        <div key={i} style={{ fontSize: 12, color: 'var(--tx-2)', marginBottom: 6, wordBreak: 'break-all', lineHeight: 1.5 }}>
          <span style={{ color: 'var(--tx-3)', marginRight: 8 }}>{i + 1}.</span>{l}
        </div>
      ))}
    </div>
  );
}
