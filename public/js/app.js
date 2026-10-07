(() => {
"use strict";

/* ---------- Utilitaires ---------- */
const API = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.apiBase) || "/api";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
let CONTACT_EMAIL = "";
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover:hover) and (pointer:fine)").matches;
const api = async (path, opts) => {
  const res = await fetch(API + path, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error("HTTP " + res.status), { data });
  return data;
};

/* ---------- Maquettes SVG des projets ---------- */
const frame = (inner) => `<svg viewBox="0 0 640 400" role="img" aria-hidden="true"><rect class="rect" width="640" height="34"/><rect class="st" x=".5" y=".5" width="639" height="399"/>
<circle class="ac" cx="18" cy="17" r="4"/><rect class="st" x="60" y="9" width="220" height="16" rx="8"/>${inner}</svg>`;
const MOCKUPS = {
  dashboard: () => frame(`<rect class="rect" x="0" y="34" width="120" height="366"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect class="${i ? "st" : "ac"}" x="16" y="${58 + i * 30}" width="${i ? 70 : 88}" height="10" rx="5"/>`).join("")}
    ${[0, 1, 2].map((i) => `<rect class="rect" x="${144 + i * 160}" y="56" width="144" height="70" rx="6"/><rect class="ac" x="${158 + i * 160}" y="74" width="${50 + i * 14}" height="10" rx="5"/><rect class="st" x="${158 + i * 160}" y="96" width="90" height="8" rx="4"/>`).join("")}
    <rect class="rect" x="144" y="146" width="464" height="226" rx="6"/>
    ${[40, 86, 62, 120, 96, 150, 128, 170].map((h, i) => `<rect class="${i === 7 ? "ac" : "st"}" x="${170 + i * 54}" y="${350 - h}" width="30" height="${h}" rx="3"/>`).join("")}`),
  api: () => frame(`<rect class="rect" x="0" y="34" width="640" height="366" opacity=".4"/>
    ${[["GET", "/api/users", "200", 0], ["POST", "/api/users", "201", 1], ["GET", "/api/resources?page=2", "200", 2], ["PUT", "/api/resources/14", "200", 3], ["DELETE", "/api/users/9", "204", 4], ["GET", "/api/me", "401", 5]]
      .map(([m, p, s, i]) => `<rect class="${s === "401" ? "st" : "rect"}" x="24" y="${60 + i * 52}" width="592" height="38" rx="5"/><text class="${m === "GET" ? "" : "t2"}" x="40" y="${84 + i * 52}">${m}</text><text class="t2" x="120" y="${84 + i * 52}">${p}</text><text x="560" y="${84 + i * 52}">${s}</text>`).join("")}`),
  web: () => frame(`<rect class="ac" x="40" y="70" width="260" height="22" rx="4"/><rect class="rect" x="40" y="102" width="200" height="22" rx="4"/>
    <rect class="st" x="40" y="146" width="320" height="8" rx="4"/><rect class="st" x="40" y="164" width="270" height="8" rx="4"/><rect class="ac" x="40" y="196" width="104" height="30" rx="15"/>
    <circle class="acs" cx="500" cy="150" r="80"/><circle class="st" cx="500" cy="150" r="52"/>
    ${[0, 1, 2].map((i) => `<rect class="rect" x="${40 + i * 196}" y="268" width="180" height="108" rx="6"/><rect class="st" x="${56 + i * 196}" y="286" width="100" height="8" rx="4"/><rect class="st" x="${56 + i * 196}" y="304" width="140" height="8" rx="4"/>`).join("")}`),
  data: () => frame(`<rect class="rect" x="24" y="56" width="380" height="200" rx="6"/>
    <polyline class="acs" fill="none" points="44,220 100,190 150,204 210,140 270,160 330,100 384,84"/>
    ${[0, 1, 2, 3].map((i) => `<line class="st" x1="44" x2="384" y1="${90 + i * 42}" y2="${90 + i * 42}"/>`).join("")}
    <rect class="rect" x="424" y="56" width="192" height="200" rx="6"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect class="${i ? "st" : "ac"}" x="440" y="${76 + i * 34}" width="${150 - i * 18}" height="12" rx="6"/>`).join("")}
    ${[0, 1, 2, 3].map((i) => `<rect class="${i ? "st" : "rect"}" x="24" y="${278 + i * 28}" width="592" height="20" rx="3"/>`).join("")}`),
};

/* ---------- Rendu des données ---------- */
const GROUPS = [["backend", "Backend"], ["frontend", "Frontend"], ["database", "Database"], ["data", "Data"]];

function bindProfile(p) {
  CONTACT_EMAIL = p.email || "";
  $$("[data-bind]").forEach((el) => { if (p[el.dataset.bind]) el.textContent = p[el.dataset.bind]; });
  const lines = p.name.split(/\s+/);
  $("#name").setAttribute("aria-label", p.name);
  $("#name").innerHTML = lines.map((w, i) => `<span class="ln${i === lines.length - 1 ? " out" : ""}" style="--i:${i}"><span>${esc(w)}</span></span>`).join("");
  document.title = `${p.name} — ${p.title}`;
  $("#bio").innerHTML = p.bio.map((t) => `<p class="rv">${esc(t)}</p>`).join("");
  $("#pillars").innerHTML = p.pillars.map((x) => `<li class="rv"><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></li>`).join("");
  $("#timeline").innerHTML = p.timeline.map((t) => `<li class="rv"><time>${esc(t.period)}</time><h3>${esc(t.title)}</h3><p>${esc(t.organization)}</p>${t.detail ? `<p>${esc(t.detail)}</p>` : ""}</li>`).join("");
  const s = p.socials || {};
  const items = [["GitHub", s.github], ["LinkedIn", s.linkedin], ["Email", p.email && "mailto:" + p.email]].filter(([, u]) => u);
  $("#social").innerHTML = items.map(([n, u]) => `<li class="rv"><a href="${esc(u)}" ${n === "Email" ? "" : 'target="_blank" rel="noopener"'} data-cursor><span>${n}</span><small>${esc(u.replace(/^(mailto:|https?:\/\/(www\.)?)/, ""))}</small></a></li>`).join("");
}

function renderSkills(list) {
  $("#stack").innerHTML = GROUPS.map(([key, label]) => `<div class="grp rv"><h3>${label}</h3>${
    list.filter((s) => s.category === key).map((s) => `<a class="tech" tabindex="0" data-cursor><b>${esc(s.name)}</b><small>${esc(s.note)}</small></a>`).join("")}</div>`).join("");
}

function renderProjects(list) {
  const link = (url, label, ghost) => url
    ? `<a class="btn ${ghost ? "ghost" : "primary"}" href="${esc(url)}" target="_blank" rel="noopener">${label}</a>`
    : `<span class="btn ghost off" aria-disabled="true">${label} bientôt</span>`;
  $("#projects").innerHTML = list.map((p, i) => `<article class="proj">
    <div class="vis rv" data-tilt>${(MOCKUPS[p.mockup] || MOCKUPS.web)()}</div>
    <div class="rv"><div class="ptop"><span class="num">${String(i + 1).padStart(2, "0")}</span>${p.is_demo ? '<span class="badge">Projet de démonstration</span>' : ""}</div>
      <h3>${esc(p.title)}</h3><p class="lead">${esc(p.summary)}</p>
      <h4>Problème résolu</h4><p class="pb">${esc(p.problem)}</p>
      <ul class="feat">${p.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
      <ul class="chips">${p.stack.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      <div class="links">${link(p.github, "GitHub", true)}${link(p.demo, "Live Demo", false)}</div></div></article>`).join("");
}

function renderCounts(st) {
  const rows = [[st.projects, "projets de démonstration"], [st.technologies, "technologies maîtrisées"], [st.domains, "domaines : backend, frontend, base de données, data"]];
  $("#counts").innerHTML = rows.map(([n, l]) => `<div class="rv"><dt data-count="${n}">0</dt><dd>${esc(l)}</dd></div>`).join("");
}

/* ---------- Terminal du hero ---------- */
function terminal(st) {
  const L = [
    ["$ ", "k"], ["inspect --architecture\n", ""],
    ["\nclient    ", "m"], ["html · css · javascript\n", ""],
    ["api       ", "m"], ["fastapi · rest · pydantic\n", ""],
    ["data      ", "m"], ["sqlite  ->  postgresql\n", ""],
    ["\n$ ", "k"], [`stats --count\n`, ""],
    [`${st.projects} projets · ${st.technologies} technologies\n`, ""],
    ["\nstatus    ", "m"], ["disponible pour missions\n", "k"],
  ];
  const pre = $("#term");
  const out = [];
  if (reduced) { pre.innerHTML = L.map(([t, c]) => `<span class="${c}">${esc(t)}</span>`).join(""); return; }
  let seg = 0, ch = 0;
  const render = () => { pre.innerHTML = out.map(([t, c]) => `<span class="${c}">${esc(t)}</span>`).join(""); };
  (function tick() {
    if (seg >= L.length) return;
    const [t, c] = L[seg];
    if (ch === 0) out.push(["", c]);
    out[out.length - 1][0] = t.slice(0, ++ch);
    render();
    if (ch >= t.length) { seg++; ch = 0; }
    setTimeout(tick, 16 + Math.random() * 22);
  })();
}

/* ---------- Mouvement ---------- */
function reveal() {
  $$(".ttl").forEach((t) => $$(".ln", t).forEach((l, i) => l.style.setProperty("--i", i)));
  $$(".stack .tech, .pillars li, .tl li, .social li, .counts div").forEach((el, _, all) => {
    const sib = [...el.parentElement.children];
    el.style.setProperty("--d", sib.indexOf(el) * 0.08 + "s");
  });
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    $$("[data-count]", e.target).concat(e.target.matches("[data-count]") ? [e.target] : []).forEach(count);
    io.unobserve(e.target);
  }), { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  $$(".rv, .ttl").forEach((el) => io.observe(el));
  requestAnimationFrame(() => $(".hero").classList.add("in"));
}

function count(el) {
  const to = +el.dataset.count;
  if (reduced) { el.textContent = to; return; }
  const t0 = performance.now(), dur = 1200;
  (function step(t) {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

function pointerEffects() {
  const hero = $(".hero");
  const move = (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    hero.style.setProperty("--lx", x * 100 + "%"); hero.style.setProperty("--ly", y * 100 + "%");
    hero.style.setProperty("--mx", (x - 0.5) * 2); hero.style.setProperty("--my", (y - 0.5) * 2);
  };
  if (finePointer && !reduced) hero.addEventListener("pointermove", move);

  if (!finePointer || reduced) return;
  document.body.classList.add("has-cursor");
  const dot = $(".cur-dot"), ring = $(".cur-ring");
  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
  addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x}px,${y}px)`; });
  (function loop() { rx += (x - rx) * 0.18; ry += (y - ry) * 0.18; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); })();
  document.addEventListener("pointerover", (e) => ring.classList.toggle("big", !!e.target.closest("a,button,[data-cursor],.vis")));

  document.addEventListener("pointermove", (e) => {
    const m = e.target.closest("[data-magnetic]");
    if (m) { const r = m.getBoundingClientRect(); m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`; }
    const v = e.target.closest("[data-tilt]");
    if (v) { const r = v.getBoundingClientRect(); v.style.setProperty("--ry", ((e.clientX - r.left) / r.width - 0.5) * 5 + "deg"); v.style.setProperty("--rx", (0.5 - (e.clientY - r.top) / r.height) * 4 + "deg"); }
  });
  document.addEventListener("pointerout", (e) => {
    const m = e.target.closest("[data-magnetic]"); if (m && !m.contains(e.relatedTarget)) m.style.transform = "";
    const v = e.target.closest("[data-tilt]"); if (v && !v.contains(e.relatedTarget)) { v.style.setProperty("--rx", "0deg"); v.style.setProperty("--ry", "0deg"); }
  });
}

function navigation() {
  const nav = $("#nav"), bar = $("#progress"), burger = $("#burger");
  const onScroll = () => {
    nav.classList.toggle("scrolled", scrollY > 40);
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const close = () => { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; };
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open); document.body.style.overflow = open ? "hidden" : "";
  });
  $$("#links a").forEach((a) => a.addEventListener("click", close));
  const links = $$("#links a");
  const spy = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  ["accueil", "apropos", "competences", "projets", "parcours", "contact"].forEach((id) => spy.observe($("#" + id)));

  const root = document.documentElement;
  root.dataset.theme = localStorage.getItem("theme") || "dark";
  $("#theme").addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", root.dataset.theme);
  });
}

/* ---------- Formulaire ---------- */
const FIELD_FR = { name: "Nom", email: "Email", subject: "Sujet", message: "Message" };
function form() {
  const f = $("#form"), status = $("#status"), btn = $("button", f);
  const say = (msg, kind) => { status.textContent = msg; status.className = "status " + (kind || ""); };
  f.addEventListener("input", (e) => e.target.classList.remove("bad"));
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    const bad = [...f.elements].filter((el) => el.name && el.name !== "website" && !el.checkValidity());
    $$(".bad", f).forEach((el) => el.classList.remove("bad"));
    if (bad.length) { bad.forEach((el) => el.classList.add("bad")); bad[0].focus(); return say(`Vérifiez le champ « ${FIELD_FR[bad[0].name]} ».`, "err"); }
    btn.disabled = true; say("Envoi en cours…");
    try {
      const r = await api("/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(f))) });
      say(r.detail, "ok"); f.reset();
    } catch (err) {
      const d = err.data && err.data.detail;
      const field = Array.isArray(d) && d[0] && d[0].loc && d[0].loc[1];
      if (field) return say(`Vérifiez le champ « ${FIELD_FR[field] || field} ».`, "err");
      status.className = "status err";
      status.innerHTML = CONTACT_EMAIL ? `Le serveur ne répond pas. Écrivez-moi directement : <a href="mailto:${esc(CONTACT_EMAIL)}">${esc(CONTACT_EMAIL)}</a>` : "Le message n'a pas pu être envoyé. Réessayez dans un instant.";
    } finally { btn.disabled = false; }
  });
}

/* ---------- Démarrage ---------- */
// API d'abord ; si elle ne répond pas, repli sur le fichier statique généré par tools/export_content.py
async function loadData() {
  try {
    const [profile, skills, projects, stats] = await Promise.all([api("/profile"), api("/skills"), api("/projects"), api("/stats")]);
    return { profile, skills, projects, stats };
  } catch (e) {
    console.warn("API indisponible, utilisation de data/site.json", e);
    const res = await fetch("data/site.json");
    if (!res.ok) throw new Error("site.json introuvable");
    return res.json();
  }
}
async function init() {
  $("#year").textContent = "© " + new Date().getFullYear();
  navigation(); form(); pointerEffects();
  try {
    const { profile, skills, projects, stats } = await loadData();
    bindProfile(profile); renderSkills(skills); renderProjects(projects); renderCounts(stats); terminal(stats);
  } catch (err) {
    console.error(err);
    $("#projects").innerHTML = '<p class="note">Le contenu n\'a pas pu être chargé. Vérifiez que le serveur est lancé (start.bat ou start.sh).</p>';
  }
  reveal();
}
init();
})();
