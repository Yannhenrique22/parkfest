/* =========================================================
   ESPAÇO PARK FEST — script.js
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Ano no rodapé ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header: fundo ao rolar ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("menuMobile");

  function closeMenu() {
    header.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
  }
  function openMenu() {
    header.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fechar menu");
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      if (header.classList.contains("menu-open")) closeMenu();
      else openMenu();
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---------- Galeria: ver mais / ver menos ---------- */
  var grid = document.getElementById("galleryGrid");
  var moreBtn = document.getElementById("galleryMore");
  if (grid && moreBtn) {
    moreBtn.addEventListener("click", function () {
      var expanded = grid.classList.toggle("expanded");
      moreBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
      moreBtn.textContent = expanded ? "Ver menos" : "Ver mais fotos";
      if (!expanded) {
        document.getElementById("galeria").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  /* ---------- Lightbox ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery__item"));
  var photos = items.map(function (btn) {
    var img = btn.querySelector("img");
    return { src: img.getAttribute("src"), alt: img.getAttribute("alt") || "" };
  });

  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCount = document.getElementById("lbCount");
  var lbClose = document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");
  var current = 0;

  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function render() {
    var p = photos[current];
    lbImg.setAttribute("src", p.src);
    lbImg.setAttribute("alt", p.alt);
    lbCount.textContent = pad(current + 1) + " / " + pad(photos.length);
  }
  function openLb(i) {
    current = i;
    render();
    lb.hidden = false;
    requestAnimationFrame(function () { lb.classList.add("open"); });
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }
  function closeLb() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(function () { lb.hidden = true; }, 300);
  }
  function next() { current = (current + 1) % photos.length; render(); }
  function prev() { current = (current - 1 + photos.length) % photos.length; render(); }

  items.forEach(function (btn, i) {
    btn.addEventListener("click", function () { openLb(i); });
  });
  if (lb) {
    lbClose.addEventListener("click", closeLb);
    lbNext.addEventListener("click", next);
    lbPrev.addEventListener("click", prev);
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLb();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    });
  }

  /* ---------- Reveal no scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
