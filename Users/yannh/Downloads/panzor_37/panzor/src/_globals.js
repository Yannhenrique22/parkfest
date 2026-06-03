// _globals.js — expõe React e ReactDOM no escopo global.
//
// Os módulos de design (app/*.jsx) foram exportados pelo Claude Design como
// scripts independentes que compartilhavam o escopo global do browser
// (React/ReactDOM via UMD) e se comunicavam via `window.*`.
// Para rodar isso sob o Vite/ESM sem reescrever os 12 arquivos, publicamos
// React e ReactDOM no global ANTES de importar qualquer módulo do app.
//
// Esse shim é a única "dívida arquitetural" do port. Para migrar para ESM
// idiomático (imports/exports reais), veja a seção "Migração" do README.
import React from 'react'
import * as ReactDOMClient from 'react-dom/client'

window.React = React
window.ReactDOM = ReactDOMClient
