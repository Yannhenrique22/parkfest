// data.jsx — Reserva: dados mock, ícones e primitivos compartilhados
// Exporta para window: Icon, Wordmark, money, SEGMENTS, DAYS, genSlots, USERS, OWNER_BOOKINGS

// ───────────────────────── helpers ─────────────────────────
function money(n, { cents = true } = {}) {
  return 'R$\u00A0' + n.toLocaleString('pt-BR', {
    minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0,
  });
}

// ───────────────────────── icon set (line, 1.7 stroke) ─────────────────────────
const PATHS = {
  calendar: '<rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  check: '<path d="M4 12.5l5 5L20 6.5"/>',
  arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  chevR: '<path d="M9 5l7 7-7 7"/>',
  chevD: '<path d="M5 9l7 7 7-7"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.5-6 8-6s8 2 8 6"/>',
  users: '<circle cx="9" cy="8" r="3.4"/><path d="M2.5 20c0-3.5 3-5.3 6.5-5.3s6.5 1.8 6.5 5.3"/><path d="M16 5.2A3.4 3.4 0 0 1 16 13M21.5 20c0-2.6-1.4-4.2-3.6-4.9"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>',
  chat: '<path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  card: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19M6 15h4"/>',
  money: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/>',
  pin: '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8-4.3-4.1 5.9-.9z"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9.5C7.5 20 4 17 4 12V6z"/><path d="M9 12l2 2 4-4"/>',
  phone: '<rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M10.5 18.5h3"/>',
  court: '<rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M12 6v12M3 12h18"/><circle cx="12" cy="12" r="2"/>',
  scissors: '<circle cx="6" cy="6" r="2.6"/><circle cx="6" cy="18" r="2.6"/><path d="M8 7.5L20 17M8 16.5L20 7"/>',
  party: '<path d="M3 21l5.5-13 8.5 8.5L3 21z"/><path d="M14 3v3M19 5l-2 2M21 11h-3M16 2l1 1"/>',
  ball: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5c3 3 3 14 0 17M5 7c4 2 10 2 14 0M5 17c4-2 10-2 14 0"/>',
  google: '<path d="M21 12.2c0-.7-.06-1.4-.18-2H12v3.8h5.05a4.3 4.3 0 0 1-1.87 2.8v2.3h3.02C19.96 17.4 21 15 21 12.2z" fill="#4285F4" stroke="none"/><path d="M12 21.5c2.5 0 4.6-.83 6.13-2.24l-3.02-2.3c-.84.56-1.9.9-3.11.9-2.39 0-4.42-1.6-5.14-3.77H3.7v2.37A9.27 9.27 0 0 0 12 21.5z" fill="#34A853" stroke="none"/><path d="M6.86 14.09a5.5 5.5 0 0 1 0-3.55V8.17H3.7a9.2 9.2 0 0 0 0 8.29z" fill="#FBBC05" stroke="none"/><path d="M12 6.7c1.35 0 2.56.46 3.51 1.37l2.63-2.63C16.6 3.95 14.5 3 12 3A9.27 9.27 0 0 0 3.7 8.17l3.16 2.37C7.58 8.3 9.61 6.7 12 6.7z" fill="#EA4335" stroke="none"/>',
  microsoft: '<rect x="3" y="3" width="8" height="8" fill="#F25022" stroke="none"/><rect x="13" y="3" width="8" height="8" fill="#7FBA00" stroke="none"/><rect x="3" y="13" width="8" height="8" fill="#00A4EF" stroke="none"/><rect x="13" y="13" width="8" height="8" fill="#FFB900" stroke="none"/>',
  whatsapp: '<path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z"/><path d="M8.5 8.2c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2 0 .4-.1.5l-.5.6c-.1.1-.2.3-.1.5.2.5.7 1.2 1.3 1.7.7.6 1.3.8 1.6.9.2 0 .4 0 .5-.1l.6-.7c.2-.2.3-.2.5-.1l1.5.7c.2.1.4.2.4.4 0 .5-.2 1.3-.5 1.5-.3.3-1.4.8-2.2.6-1-.2-2.6-.8-4-2.2-1.6-1.6-2-3-2.1-3.6-.1-.8.3-1.7.6-2z" stroke="none" fill="currentColor"/>',
  edit: '<path d="M4 20h4l10-10-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  dash: '<rect x="3" y="3" width="8" height="10" rx="1.5"/><rect x="13" y="3" width="8" height="6" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/><rect x="3" y="17" width="8" height="4" rx="1.5"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4L5.3 5.3"/>',
  trend: '<path d="M3 17l5-5 4 4 8-8"/><path d="M21 8v4h-4"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>',
  moon: '<path d="M20 14a8 8 0 1 1-9.5-9.8A6.5 6.5 0 0 0 20 14z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5h.01"/>',
};

function Icon({ name, size = 20, color = 'currentColor', stroke = 1.7, style = {} }) {
  const raw = (k) => k.includes('fill="') || k.includes('stroke="none"');
  const colored = name === 'google' || name === 'microsoft';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={colored ? 'none' : 'none'}
      stroke={colored ? 'none' : color} strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'block', ...style }}
      dangerouslySetInnerHTML={{ __html: PATHS[name] || '' }} />
  );
}

// ───────────────────────── brand mark + wordmark ─────────────────────────
function Mark({ size = 30, radius }) {
  const r = radius != null ? radius : Math.round(size * 0.26);
  return <img src="/assets/panzor-logo.png" alt="Panzor" width={size} height={size}
    style={{ borderRadius: r, display: 'block', flexShrink: 0, objectFit: 'cover', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.06)' }} />;
}

function Wordmark({ size = 22, color = 'var(--tx)', sub = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
      <Mark size={Math.round(size * 1.6)} />
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontFamily: "'Crimson Pro',serif", fontWeight: 600, fontSize: size, color, letterSpacing: '-.02em' }}>
          Panzor
        </span>
        {sub && <span className="mono" style={{ fontSize: size * 0.36, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--tx-2)', marginTop: 3 }}>by Sagessetec</span>}
      </span>
    </div>
  );
}

// ───────────────────────── SEGMENTS ─────────────────────────
const SEGMENTS = {
  quadras: {
    id: 'quadras', label: 'Quadras esportivas', noun: 'Quadra', icon: 'court', short: 'Quadras',
    accent: 'var(--ac)',
    venue: { name: 'Arena Beira-Mar', tagline: 'Beach tênis, vôlei & futevôlei à beira da praia', address: 'Av. Atlântica, 1880 · Praia do Forte', rating: 4.9, reviews: 214 },
    resourceLabel: 'Escolha a quadra', resources: [
      { id: 'q1', name: 'Areia 1 · Coberta', meta: 'Beach tênis · Vôlei' },
      { id: 'q2', name: 'Areia 2', meta: 'Beach tênis · Futevôlei' },
      { id: 'q3', name: 'Society', meta: 'Futsal · Society 7' },
    ],
    chooser: { label: 'Modalidade', options: ['Beach Tênis', 'Vôlei de Praia', 'Futevôlei', 'Futsal'] },
    slotKind: 'hour', unit: '/ hora', basePrice: 80, peakPrice: 120,
  },
  beleza: {
    id: 'beleza', label: 'Salão de beleza', noun: 'Profissional', icon: 'scissors', short: 'Beleza',
    accent: 'var(--ac)',
    venue: { name: 'Studio Lumière', tagline: 'Cabelo, coloração e beleza com hora marcada', address: 'Rua das Acácias, 240 · Jardins', rating: 4.95, reviews: 388 },
    resourceLabel: 'Escolha o profissional', resources: [
      { id: 'p1', name: 'Marina Alves', meta: 'Colorista sênior' },
      { id: 'p2', name: 'Rafael Tavares', meta: 'Corte & finalização' },
      { id: 'p3', name: 'Bruna Castro', meta: 'Tratamentos' },
    ],
    chooser: {
      label: 'Serviço', options: ['Corte feminino', 'Corte masculino', 'Escova', 'Coloração', 'Hidratação'],
      services: {
        'Corte feminino': { dur: 60, price: 130 }, 'Corte masculino': { dur: 40, price: 80 },
        'Escova': { dur: 45, price: 90 }, 'Coloração': { dur: 120, price: 280 }, 'Hidratação': { dur: 50, price: 110 },
      },
    },
    slotKind: 'hour', unit: '', basePrice: 90, peakPrice: 130,
  },
  festas: {
    id: 'festas', label: 'Salão de festas', noun: 'Espaço', icon: 'party', short: 'Festas',
    accent: 'var(--ac)',
    venue: { name: 'Espaço Jardim Real', tagline: 'Aniversários, casamentos e eventos corporativos', address: 'Estrada do Lago, 90 · Alphaville', rating: 4.8, reviews: 96 },
    resourceLabel: 'Escolha o espaço', resources: [
      { id: 's1', name: 'Salão Cristal', meta: 'até 180 convidados' },
      { id: 's2', name: 'Terraço Jardim', meta: 'até 90 convidados' },
      { id: 's3', name: 'Salão Boutique', meta: 'até 50 convidados' },
    ],
    chooser: { label: 'Tipo de evento', options: ['Aniversário', 'Casamento', 'Corporativo', 'Formatura'] },
    slotKind: 'period', unit: '/ período', basePrice: 2800, peakPrice: 4200,
    periods: [
      { time: 'Manhã', label: '08h – 13h' }, { time: 'Tarde', label: '14h – 19h' }, { time: 'Noite', label: '20h – 02h' },
    ],
  },
};

// ───────────────────────── dates (next 14 days) ─────────────────────────
const WD = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const MO = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
function buildDays(n = 14) {
  const out = []; const base = new Date(2026, 5, 2); // 02 jun 2026
  for (let i = 0; i < n; i++) {
    const d = new Date(base); d.setDate(base.getDate() + i);
    out.push({ i, wd: WD[d.getDay()], day: d.getDate(), mo: MO[d.getMonth()], dow: d.getDay(),
      full: `${WD[d.getDay()]}, ${d.getDate()} de ${MO[d.getMonth()]}`, weekend: d.getDay() === 0 || d.getDay() === 6 });
  }
  return out;
}
const DAYS = buildDays(14);

// slot generator (hourly). seeds busy slots deterministically.
function genSlots(seg, dateIndex) {
  if (seg.slotKind === 'period') {
    return seg.periods.map((p, k) => {
      const busy = (dateIndex * 3 + k) % 5 === 0;
      const peak = p.time === 'Noite';
      return { time: p.time, label: p.label, price: peak ? seg.peakPrice : seg.basePrice, busy };
    });
  }
  const out = []; const startH = 7, endH = 22;
  for (let h = startH; h <= endH; h++) {
    const peak = h >= 18 && h <= 21;
    const seed = (dateIndex * 7 + h * 3) % 10;
    const busy = seed < 3;
    out.push({ time: `${String(h).padStart(2, '0')}:00`, label: `${String(h).padStart(2, '0')}:00 – ${String(h + 1).padStart(2, '0')}:00`,
      price: peak ? seg.peakPrice : seg.basePrice, busy, peak });
  }
  return out;
}

// ───────────────────────── owner-side mock data ─────────────────────────
const USERS = [
  { name: 'Camila Rocha', phone: '(71) 99812-4455', cpf: '038.***.***-12', since: 'mar/26', bookings: 14, via: 'Google', status: 'Ativo' },
  { name: 'Diego Martins', phone: '(71) 99654-8821', cpf: '112.***.***-09', since: 'abr/26', bookings: 9, via: 'E-mail', status: 'Ativo' },
  { name: 'Letícia Souza', phone: '(11) 98123-7766', cpf: '407.***.***-55', since: 'jan/26', bookings: 22, via: 'Microsoft', status: 'VIP' },
  { name: 'Bruno Almeida', phone: '(71) 99090-1234', cpf: '298.***.***-77', since: 'mai/26', bookings: 3, via: 'Google', status: 'Novo' },
  { name: 'Patrícia Lima', phone: '(85) 99777-3322', cpf: '551.***.***-04', since: 'fev/26', bookings: 17, via: 'E-mail', status: 'Ativo' },
  { name: 'Rafael Nunes', phone: '(71) 98444-9911', cpf: '623.***.***-88', since: 'mai/26', bookings: 6, via: 'Google', status: 'Ativo' },
];

const OWNER_BOOKINGS = [
  { day: 'Hoje', time: '18:00', who: 'Camila Rocha', res: 'Areia 1', val: 120, pay: 'Pago online', state: 'confirmado' },
  { day: 'Hoje', time: '19:00', who: 'Diego Martins', res: 'Society', val: 120, pay: 'No local', state: 'confirmado' },
  { day: 'Hoje', time: '20:00', who: 'Letícia Souza', res: 'Areia 2', val: 120, pay: 'Pago online', state: 'confirmado' },
  { day: 'Amanhã', time: '07:00', who: 'Bruno Almeida', res: 'Areia 1', val: 80, pay: 'No local', state: 'pendente' },
  { day: 'Amanhã', time: '18:00', who: 'Patrícia Lima', res: 'Areia 1', val: 120, pay: 'Pago online', state: 'confirmado' },
  { day: 'Qua', time: '21:00', who: 'Rafael Nunes', res: 'Society', val: 120, pay: 'No local', state: 'confirmado' },
];

// ───────────────────────── plataforma Panzor (SaaS) ─────────────────────────
const PLANS = [
  { id: 'start', name: 'Start', price: 149, tag: 'Para começar', feats: ['1 unidade', 'Agenda + reservas', 'Confirmação automática', 'Pagamento no local'], accentVar: 'var(--info)' },
  { id: 'pro', name: 'Pro', price: 349, tag: 'Mais popular', popular: true, feats: ['Até 5 unidades', 'Pagamento online + repasse D+1', 'Lembretes WhatsApp/SMS/e-mail', 'Relatórios e BI', 'Taxa de cancelamento'], accentVar: 'var(--ac)' },
  { id: 'enterprise', name: 'Enterprise', price: 899, tag: 'Operações grandes', feats: ['Unidades ilimitadas', 'Multi-segmento', 'API & integrações', 'Gerente de conta', 'SLA dedicado'], accentVar: 'var(--violet)' },
];

const BUSINESSES = [
  { code: 'AB', name: 'Arena Beira-Mar', seg: 'Quadras', plan: 'Pro', mrr: 349, reservas: 1284, status: 'Ativo', city: 'Salvador/BA' },
  { code: 'SL', name: 'Studio Lumière', seg: 'Beleza', plan: 'Pro', mrr: 349, reservas: 892, status: 'Ativo', city: 'São Paulo/SP' },
  { code: 'JR', name: 'Espaço Jardim Real', seg: 'Festas', plan: 'Enterprise', mrr: 899, reservas: 96, status: 'Ativo', city: 'Barueri/SP' },
  { code: 'QC', name: 'Quadra Central', seg: 'Quadras', plan: 'Start', mrr: 149, reservas: 540, status: 'Ativo', city: 'Recife/PE' },
  { code: 'BS', name: 'Bella Salão', seg: 'Beleza', plan: 'Start', mrr: 149, reservas: 410, status: 'Trial', city: 'Fortaleza/CE' },
  { code: 'AF', name: 'Arena Futsal Pro', seg: 'Quadras', plan: 'Pro', mrr: 349, reservas: 980, status: 'Ativo', city: 'Curitiba/PR' },
  { code: 'EV', name: 'Villa Eventos', seg: 'Festas', plan: 'Pro', mrr: 349, reservas: 64, status: 'Inadimplente', city: 'Belo Horizonte/MG' },
  { code: 'CB', name: 'Corte & Cor', seg: 'Beleza', plan: 'Start', mrr: 149, reservas: 620, status: 'Ativo', city: 'Porto Alegre/RS' },
  { code: 'PA', name: 'Play Arena', seg: 'Quadras', plan: 'Pro', mrr: 349, reservas: 1110, status: 'Ativo', city: 'Goiânia/GO' },
  { code: 'GL', name: 'Glow Studio', seg: 'Beleza', plan: 'Pro', mrr: 349, reservas: 705, status: 'Ativo', city: 'Brasília/DF' },
];

Object.assign(window, { Icon, Mark, Wordmark, money, SEGMENTS, DAYS, genSlots, USERS, OWNER_BOOKINGS, PLANS, BUSINESSES });
