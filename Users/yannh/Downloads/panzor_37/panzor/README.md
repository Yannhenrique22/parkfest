# Panzor — SaaS de agendamento (multi-tenant)

App de reservas para 3 segmentos (quadras / beleza / festas) com **três portas de
entrada separadas** e um link público por negócio. Mesmo design system do protótipo.

## As 3 divisões (papéis)

| Papel | Rota | O que vê |
|---|---|---|
| **Dono (plataforma)** | `/dono` | Console com todos os empreendedores, MRR, planos, carteira. Login próprio. |
| **Empreendedor (cliente que paga)** | `/entrar` → `/painel` | Só o **seu** workspace: link público, reservas, clientes, configurações. Não enxerga outros tenants nem o painel do dono. |
| **Usuário final** | `/b/:slug` | Página pública do negócio (sem login de dono). Marca horário; a reserva cai no tenant dono do slug. |

Empreendedor novo passa por `/contratar` (segmento → plano → conta) e ao final é
**gerado o link público** (`/b/seu-negocio`) para compartilhar com os clientes.

## Acessos de teste
- **Dono:** `dono@panzor.app` / `panzor`
- **Empreendedor (com dados):** `arena@panzor.app` / `123456`
- **Loja pública de exemplo:** `/b/arena-beira-mar`

## Rodar
```bash
npm install
npm run dev      # desenvolvimento
npm run build    # produção → dist/
```

## Arquitetura
- **`src/router.jsx`** — rotas (BrowserRouter). `vercel.json` faz o rewrite SPA
  para os deep-links (`/b/...`) não darem 404 no refresh.
- **`src/screens/`** — telas novas (ESM puro): Landing, Dono, Entrar, Contratar,
  Painel, PublicBooking. Compõem os componentes de design via `window.*`.
- **`src/app/`** — componentes de design originais (registram-se em `window.*`).
- **`src/lib/db.js`** — **camada de dados (o ponto único de troca).**

## ⚠️ Persistência: hoje é localStorage
Os dados (contas, negócios, reservas) vivem em **localStorage do navegador atual**.
Funciona ponta a ponta numa máquina só (ótimo para testar o fluxo), MAS:
- o link aberto em **outro dispositivo** não compartilha a base — a reserva feita lá
  não aparece para o empreendedor;
- limpar o navegador zera tudo.

Isso some ao trocar para um backend real. **Para isso, reescreva só `src/lib/db.js`**
mantendo as mesmas assinaturas (`api.auth.*`, `api.biz.*`, `api.book.*`, `api.cust.*`).
A UI não muda.

## O que é ao vivo vs. demo
- **Ao vivo (persiste):** login, criação de negócio + slug, link público, reserva feita
  pelo link → aparece no painel do empreendedor (aba *Operação*) e conta no console do dono.
- **Demo (dados fixos, visual):** os 10 empreendedores semente no console do dono e a aba
  *Workspace BI* do painel (gráficos densos). Próximo passo é ligá-los à base real.
