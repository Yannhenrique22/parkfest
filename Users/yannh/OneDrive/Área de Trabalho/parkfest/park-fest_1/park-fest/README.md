# Espaço Park Fest — site

Landing page estática (HTML + CSS + JS puro, sem build).

## Estrutura
```
park-fest/
├── index.html      ← página
├── styles.css      ← estilos
├── script.js       ← menu, galeria, lightbox
└── img/            ← as 14 fotos (img01.jpg … img14.jpg)
```

## Rodar localmente
Abra o `index.html` no navegador (duplo clique) — não precisa de servidor.

## Já configurado
- WhatsApp: (34) 99652-5287 → `https://wa.me/5534996525287`
- Instagram: `@espacoparkfest`

## Depois do deploy
No `index.html`, troque as duas URLs das tags Open Graph
(`og:image` e `og:url`) pelo domínio final da Vercel — é o que deixa
o preview bonito quando o link é compartilhado no WhatsApp.

## Trocar/adicionar fotos
Coloque o arquivo em `img/`, adicione um `<button class="gallery__item">`
na galeria do `index.html` apontando para ele, e pronto.
