// db.js — CAMADA DE DADOS: Supabase (São Paulo).
// Auth real com e-mail de confirmação. Dados compartilhados entre dispositivos.
// Para trocar de projeto: altere só SUPABASE_URL e SUPABASE_KEY abaixo.

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://dfwigdaedodvlojuhkhh.supabase.co'
const SUPABASE_KEY = 'sb_publishable_HljlLSFIu7_TcxLlvVfC0g_LMQc3Izw'
const OWNER_EMAIL  = 'yannhenrique22@gmail.com'

const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
  }
})
// expõe globalmente e exporta para todos os módulos usarem O MESMO cliente
if (typeof window !== 'undefined') window.SUPABASE = sb
export { sb as supabase }

// ── helpers ──────────────────────────────────────────────────────────────────
const uid = (p = 'id') => p + '_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3)

function slugify(s) {
  return (s || 'negocio').toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'negocio'
}
function initials(name) {
  return (name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'
}

export const SEG_LABEL = { quadras: 'Quadras', beleza: 'Beleza', festas: 'Festas' }
function planById(id) { return (window.PLANS || []).find(p => p.id === id) || { id, name: id, price: 0 } }
export function planName(id) { return planById(id).name }
export function planPrice(id) { return planById(id).price }

// converte linha do banco → objeto da app
function mapBiz(b) {
  return {
    id: b.id, slug: b.slug, name: b.name, segment: b.segment,
    planId: b.plan_id, ownerEmail: b.owner_email, city: b.city,
    status: b.status, code: b.code,
    config: { fee: b.fee, window: b.window_hours, channels: { wpp: b.ch_wpp, sms: b.ch_sms, email: b.ch_email }, logo: b.logo || null, chargeCancel: b.charge_cancel !== false, services: b.services || null, address: b.address || null },
  }
}
function mapBooking(b) {
  return {
    id: b.id, businessId: b.business_id, segment: b.segment, date: b.date_index,
    resourceId: b.resource_id, resourceName: b.resource_name, service: b.service,
    slot: b.slot, pay: b.pay, price: Number(b.price), code: b.code,
    customer: { name: b.customer_name, email: b.customer_email, phone: b.customer_phone, cpf: b.customer_cpf, via: b.customer_via },
    createdAt: new Date(b.created_at).getTime(),
  }
}

// ── sessão enriquecida ────────────────────────────────────────────────────────
async function enrichSession(user) {
  if (!user) return null
  const role = user.email === OWNER_EMAIL ? 'owner' : 'entrepreneur'
  // Google OAuth fornece full_name; cadastro normal usa name
  const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0]
  let businessId = null
  if (role === 'entrepreneur') {
    try {
      const { data } = await sb.from('businesses').select('id').eq('owner_email', user.email).maybeSingle()
      businessId = data?.id || null
    } catch { businessId = null }
  }
  return { role, email: user.email, name, businessId }
}

// ── API ───────────────────────────────────────────────────────────────────────
export const api = {

  async reset() { await sb.auth.signOut(); return true },

  auth: {
    async session() {
      const { data } = await sb.auth.getSession()
      return data.session ? enrichSession(data.session.user) : null
    },

    // Dono da plataforma
    async loginOwner({ email, password }) {
      if (email.trim().toLowerCase() !== OWNER_EMAIL)
        throw new Error('Acesso não autorizado.')
      const { data, error } = await sb.auth.signInWithPassword({ email, password })
      if (error) {
        // primeira vez: cria a conta do dono
        if (error.message?.includes('Invalid login')) {
          const { error: e2 } = await sb.auth.signUp({
            email, password, options: { data: { name: 'Yann Henrique', role: 'owner' } }
          })
          if (e2) throw new Error('E-mail ou senha incorretos.')
          throw new Error('FIRST_LOGIN') // sinal para a tela mostrar instrução
        }
        throw new Error('E-mail ou senha incorretos.')
      }
      return { role: 'owner', email: data.user.email, name: data.user.user_metadata?.name || 'Yann Henrique', businessId: null }
    },

    // Empreendedor — login
    async loginEntrepreneur({ email, password }) {
      const { data, error } = await sb.auth.signInWithPassword({ email, password })
      if (error) {
        if (error.message?.includes('Email not confirmed'))
          throw new Error('EMAIL_NOT_CONFIRMED')
        throw new Error('E-mail ou senha incorretos.')
      }
      if (data.user.email === OWNER_EMAIL) { await sb.auth.signOut(); throw new Error('Use o acesso de dono.') }
      const { data: biz } = await sb.from('businesses').select('id').eq('owner_email', data.user.email).maybeSingle()
      return { role: 'entrepreneur', email: data.user.email, name: data.user.user_metadata?.name || email, businessId: biz?.id || null }
    },

    // Empreendedor — cadastro (dispara e-mail de confirmação real)
    async signupEntrepreneur({ name, email, password }) {
      const { data, error } = await sb.auth.signUp({
        email, password,
        options: {
          data: { name, role: 'entrepreneur' },
          emailRedirectTo: window.location.origin + '/entrar',
        }
      })
      if (error) {
        if (error.message?.includes('already registered')) throw new Error('Já existe uma conta com esse e-mail.')
        throw new Error(error.message)
      }
      // identityData ausente = conta já existia e precisa confirmar
      return { role: 'entrepreneur', email, name, businessId: null, needsConfirmation: true }
    },

    async logout() { await sb.auth.signOut(); return true },
  },

  biz: {
    async all() {
      const { data } = await sb.from('businesses').select('*').order('created_at', { ascending: false })
      return (data || []).map(mapBiz)
    },

    async consoleRows() {
      const { data: bizData } = await sb.from('businesses').select('*').order('created_at', { ascending: false })
      const { data: bookData } = await sb.from('bookings').select('business_id')
      const countMap = {}
      ;(bookData || []).forEach(b => { countMap[b.business_id] = (countMap[b.business_id] || 0) + 1 })
      return (bizData || []).map(b => ({
        code: b.code || initials(b.name),
        name: b.name,
        seg: SEG_LABEL[b.segment] || 'Quadras',
        plan: planName(b.plan_id),
        mrr: planPrice(b.plan_id),
        reservas: countMap[b.id] || 0,
        status: b.status,
        city: b.city || '—',
      }))
    },

    async bySlug(slug) {
      try {
        const { data } = await sb.from('businesses').select('*').eq('slug', slug).maybeSingle()
        if (data) return mapBiz(data)
      } catch { /* fallback below */ }
      // fallback: dados demo enquanto o banco não está populado
      const demo = (window.BUSINESSES || []).find(b => slugify(b.name) === slug)
      if (demo) {
        return {
          id: 'demo_' + slug, slug, name: demo.name,
          segment: { Quadras: 'quadras', Beleza: 'beleza', Festas: 'festas' }[demo.seg] || 'quadras',
          planId: 'pro', ownerEmail: null, city: demo.city, status: demo.status, code: demo.code,
          config: { fee: 50, window: 24, channels: { wpp: true, sms: true, email: true } },
        }
      }
      return null
    },

    async byId(id) {
      const { data } = await sb.from('businesses').select('*').eq('id', id).maybeSingle()
      return data ? mapBiz(data) : null
    },

    async byOwner(email) {
      const { data } = await sb.from('businesses').select('*').eq('owner_email', email).maybeSingle()
      return data ? mapBiz(data) : null
    },

    async create({ account, segment, planId, ownerEmail }) {
      let slug = slugify(account.nome); let n = 1
      while (true) {
        const { data: ex } = await sb.from('businesses').select('id').eq('slug', slug).maybeSingle()
        if (!ex) break
        slug = slugify(account.nome) + '-' + (++n)
      }
      const id = uid('biz')
      const { data, error } = await sb.from('businesses').insert({
        id, slug, name: account.nome || 'Meu negócio', segment,
        plan_id: planId, owner_email: ownerEmail, city: '—',
        status: 'Trial', code: initials(account.nome),
        fee: 50, window_hours: 24, ch_wpp: true, ch_sms: true, ch_email: true,
      }).select().maybeSingle()
      if (error) throw new Error(error.message)
      if (account.resp?.trim()) await sb.auth.updateUser({ data: { name: account.resp.trim() } })
      const sess = await sb.auth.getSession()
      if (sess.data.session) await sb.auth.updateUser({ data: { businessId: id } })
      return mapBiz(data)
    },

    async updateConfig(id, config) {
      const upd = {}
      if (config.fee !== undefined) upd.fee = config.fee
      if (config.window !== undefined) upd.window_hours = config.window
      if (config.channels) { upd.ch_wpp = config.channels.wpp; upd.ch_sms = config.channels.sms; upd.ch_email = config.channels.email }
      if (config.logo !== undefined) upd.logo = config.logo
      if (config.chargeCancel !== undefined) upd.charge_cancel = config.chargeCancel
      if (config.services !== undefined) upd.services = config.services
      if (config.address !== undefined) upd.address = config.address
      const { data } = await sb.from('businesses').update(upd).eq('id', id).select().maybeSingle()
      return data ? mapBiz(data) : null
    },
  },

  book: {
    async listFor(businessId) {
      const { data } = await sb.from('bookings').select('*').eq('business_id', businessId).order('created_at', { ascending: false })
      return (data || []).map(mapBooking)
    },

    async create(businessId, payload) {
      const code = 'RSV-' + (1000 + Math.floor(Math.random() * 9000))
      const cust = payload.customer || {}
      const { data } = await sb.from('bookings').insert({
        id: uid('bk'), business_id: businessId, code,
        segment: payload.segment, date_index: payload.date,
        resource_id: payload.resourceId, resource_name: payload.resourceName,
        service: payload.service, slot: payload.slot, pay: payload.pay, price: payload.price,
        customer_name: cust.nome || cust.name || null,
        customer_email: cust.email || null, customer_phone: cust.cel || cust.phone || null,
        customer_cpf: cust.cpf || null, customer_via: cust.via || 'Link',
      }).select().maybeSingle()
      // registra cliente se tiver dados
      if (cust.email || cust.nome || cust.name) {
        await sb.from('customers').insert({
          id: uid('cus'), business_id: businessId,
          name: cust.nome || cust.name || 'Cliente',
          email: cust.email || '', phone: cust.cel || cust.phone || '',
          cpf: cust.cpf || '', via: cust.via || 'Link',
        }).then(() => {}) // ignora duplicata
      }
      return data ? mapBooking(data) : { id: uid('bk'), code, businessId, ...payload }
    },
  },

  cust: {
    async listFor(businessId) {
      const { data } = await sb.from('customers').select('*').eq('business_id', businessId).order('created_at', { ascending: false })
      return (data || []).map(c => ({
        id: c.id, businessId: c.business_id, name: c.name,
        email: c.email, phone: c.phone, cpf: c.cpf, via: c.via,
        since: c.created_at?.slice(0, 7) || '',
      }))
    },
  },

  resources: {
    async listFor(businessId) {
      const { data } = await sb.from('resources').select('*')
        .eq('business_id', businessId).eq('active', true).order('created_at')
      return (data || []).map(r => ({
        id: r.id, businessId: r.business_id,
        name: r.name, role: r.role, photo: r.photo,
      }))
    },
    async save(businessId, resource) {
      const row = {
        id: resource.id || uid('res'),
        business_id: businessId,
        name: resource.name,
        role: resource.role || null,
        photo: resource.photo || null,
        active: true,
      }
      const { data } = await sb.from('resources').upsert(row).select().maybeSingle()
      return data ? { id: data.id, businessId: data.business_id, name: data.name, role: data.role, photo: data.photo } : null
    },
    async remove(id) {
      await sb.from('resources').update({ active: false }).eq('id', id)
    },
  },

  schedules: {
    async listFor(businessId) {
      const { data } = await sb.from('schedules').select('*').eq('business_id', businessId)
      return (data || []).map(r => ({
        dayId: r.day_id, open: r.open,
        start: r.start_time, end: r.end_time,
        pause: r.pause, pauseStart: r.pause_start, pauseEnd: r.pause_end,
      }))
    },
    async saveAll(businessId, horarios) {
      const rows = Object.entries(horarios).map(([dayId, h]) => ({
        id: uid('sch'),
        business_id: businessId,
        day_id: dayId,
        open: h.open,
        start_time: h.start,
        end_time: h.end,
        pause: h.pause,
        pause_start: h.pauseStart || null,
        pause_end: h.pauseEnd || null,
        updated_at: new Date().toISOString(),
      }))
      await sb.from('schedules').upsert(rows, { onConflict: 'business_id,day_id' })
    },
  },
}

export const helpers = { SEG_LABEL, planName, planPrice, slugify, initials }
