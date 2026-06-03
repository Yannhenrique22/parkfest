// appearance.js — aparência global (tema de fundo, cor da marca, layout dos horários).
// Aplica no <html>: tema via classe, cor via variáveis --ac*. Persiste e notifica.

const KEY = 'panzor_appearance_v1';

const THEME_CLASS = { black: '', grafite: 'theme-grafite', claro: 'theme-claro' };
export const BRANDS = [
  ['laranja', '#F97316', '#EA670C'],
  ['esmeralda', '#2FC18A', '#1f9d6e'],
  ['indigo', '#5B8DEF', '#4574d6'],
  ['vinho', '#E0567B', '#c23e62'],
];
const BRAND_MAP = Object.fromEntries(BRANDS.map(([id, ac, dark]) => [id, { ac, dark }]));

const DEFAULT = { theme: 'claro', brand: 'laranja', layout: 'grade' };
let state = load();
const subs = new Set();

function load() {
  try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
  catch { return { ...DEFAULT }; }
}

function apply() {
  const root = document.documentElement;
  root.classList.remove('theme-grafite', 'theme-claro');
  if (THEME_CLASS[state.theme]) root.classList.add(THEME_CLASS[state.theme]);
  const b = BRAND_MAP[state.brand] || BRAND_MAP.laranja;
  root.style.setProperty('--ac', b.ac);
  root.style.setProperty('--ac-dark', b.dark);
  // soft adapta ao tema (tint translúcido em vez de cor fixa)
  root.style.setProperty('--ac-soft', `color-mix(in srgb, ${b.ac} 14%, transparent)`);
  root.style.setProperty('--ac-soft-2', `color-mix(in srgb, ${b.ac} 24%, transparent)`);
}

export function initAppearance() { apply(); }
export function getAppearance() { return { ...state }; }
export function setAppearance(patch) {
  state = { ...state, ...patch };
  localStorage.setItem(KEY, JSON.stringify(state));
  apply();
  subs.forEach((f) => f({ ...state }));
}
export function subscribe(fn) { subs.add(fn); return () => subs.delete(fn); }
