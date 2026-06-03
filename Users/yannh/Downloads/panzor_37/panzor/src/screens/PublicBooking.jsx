// PublicBooking.jsx — página pública de reservas de um negócio (/b/:slug).
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/db.js'
import { getAppearance, subscribe } from '../lib/appearance.js'
import { Brand, Icon } from './shared.jsx'
import { Splash } from './Dono.jsx'

export default function PublicBooking() {
  const { slug } = useParams();
  const nav = useNavigate();
  const [biz, setBiz] = React.useState(undefined);
  const [bizResources, setBizResources] = React.useState(null);
  const [wide, setWide] = React.useState(typeof window !== 'undefined' ? window.innerWidth >= 860 : true);
  const [layout, setLayout] = React.useState(getAppearance().layout);
  const [visitor, setVisitor] = React.useState(null); // { name, email } | null

  React.useEffect(() => {
    api.biz.bySlug(slug).then((b) => {
      setBiz(b || null);
      if (b?.id) {
        api.resources.listFor(b.id).then(r => {
          if (r.length > 0) setBizResources(r);
        });
      }
    });
  }, [slug]);
  React.useEffect(() => subscribe((s) => setLayout(s.layout)), []);
  React.useEffect(() => {
    const onR = () => setWide(window.innerWidth >= 860);
    window.addEventListener('resize', onR); return () => window.removeEventListener('resize', onR);
  }, []);
  // Check if visitor is already logged in
  React.useEffect(() => {
    api.auth.session().then(s => { if (s?.email) setVisitor({ name: s.name, email: s.email }); });
  }, []);

  if (biz === undefined) return <Splash />;

  if (!biz) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'grid', placeItems: 'center', padding: 24 }}>
        <div className="card" style={{ padding: 34, maxWidth: 420, textAlign: 'center' }}>
          <Brand size={20} />
          <h1 className="serif" style={{ fontSize: 28, margin: '20px 0 8px' }}>Loja não encontrada</h1>
          <p style={{ color: 'var(--tx-2)', fontSize: 14.5, lineHeight: 1.5, margin: '0 0 18px' }}>O link <b className="mono" style={{ color: 'var(--tx)' }}>/b/{slug}</b> não corresponde a nenhum negócio.</p>
          <button className="btn btn-ghost btn-block" onClick={() => nav('/')}>Voltar ao início</button>
        </div>
      </div>
    );
  }

  const onBooked = (payload) => { api.book.create(biz.id, payload); };
  const CustomerApp = window.CustomerApp;
  const DesktopBooking = window.DesktopBooking;

  // Dados reais do negócio para substituir o demo
  const bizProps = {
    venueName: biz.name,
    bizCity: biz.config.address || biz.city || null,
    bizServices: biz.config.services || null,
    bizResources,  // resources reais do banco
    visitor,       // { name, email } se já logado
    onBooked,
  };

  if (wide) {
    return (
      <div style={{ height: '100vh' }}>
        <DesktopBooking segKey={biz.segment} fee={biz.config.fee} {...bizProps} />
      </div>
    );
  }
  return (
    <div style={{ height: '100vh', maxWidth: 460, margin: '0 auto', background: 'var(--paper)' }}>
      <CustomerApp segKey={biz.segment} fee={biz.config.fee} layout={layout} {...bizProps} />
    </div>
  );
}
