/* Inglês Médico — aplicação (HTML/CSS/JS puro, sem dependências).
 * Todo o progresso fica salvo no navegador (localStorage).
 */
(function () {
  "use strict";

  /* ======================= Utilidades ======================= */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[’']/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const shuffle = (a) => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const reRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const plural = (n, one, many) => n + " " + (n === 1 ? one : many);
  const I = (name, cls) => `<svg class="ico ${cls || ""}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  function lev(a, b) {
    const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, i) => i);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }

  // Datas no formato AAAA-MM-DD (fuso local)
  const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  function dayStr(offset = 0) { const d = new Date(); d.setDate(d.getDate() + offset); return iso(d); }
  function addDays(str, n) { const [y, m, d] = str.split("-").map(Number); return iso(new Date(y, m - 1, d + n)); }

  /* ======================= Conteúdo ======================= */
  const WORDS = {};
  UNITS.forEach((u) => u.words.forEach((w) => { w.id = u.id + ":" + slug(w.en); w.unit = u.id; WORDS[w.id] = w; }));
  const UNIT = Object.fromEntries(UNITS.map((u) => [u.id, u]));
  const SECTION = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));
  const ALL_WORDS = Object.values(WORDS);

  const STEPS = [
    { key: "l1", name: "Lição 1", short: "Lição 1", desc: "Primeiras palavras da unidade" },
    { key: "l2", name: "Lição 2", short: "Lição 2", desc: "O restante do vocabulário" },
    { key: "l3", name: "Lição 3", short: "Lição 3", desc: "Frases, lacunas e revisão" },
    { key: "read", name: "Leitura", short: "Leitura", desc: "Texto em inglês e perguntas de compreensão" },
    { key: "test", name: "Desafio da unidade", short: "Desafio", desc: "Escrita, ditado e frases; 70% para passar" }
  ];

  /* ======================= Estado ======================= */
  const KEY = "inglesmedico_v1";
  const DEFAULTS = {
    name: "", onboarded: false, xp: 0, daily: {}, streak: 0, bestStreak: 0, lastDay: null,
    units: {}, srs: {}, mine: {}, custom: [], mistakes: {}, recent: [], cases: {}, badges: {},
    stats: { answers: 0, correct: 0, lessons: 0, perfect: 0, timedBest: 0, speakOk: 0, cards: 0 },
    settings: { goal: 30, accent: "en-US", rate: 0.9, autoplay: true, pron: true, sfx: true, speech: true, free: false, theme: "auto" }
  };
  let state = load();

  function load() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
    const base = JSON.parse(JSON.stringify(DEFAULTS));
    if (!s || typeof s !== "object") return base;
    return Object.assign(base, s, {
      stats: Object.assign(base.stats, s.stats || {}),
      settings: Object.assign(base.settings, s.settings || {})
    });
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* armazenamento indisponível */ } }

  const getWord = (id) => WORDS[id] || state.custom.find((c) => c.id === id);
  const isMine = (id) => !!state.mine[id];
  const mineCount = () => Object.keys(state.mine).filter(getWord).length;
  function toggleMine(id, force) {
    const on = force === undefined ? !isMine(id) : force;
    if (on) state.mine[id] = state.mine[id] || { added: Date.now(), note: "" };
    else delete state.mine[id];
    save(); checkBadges();
    return on;
  }

  /* ---------- XP, níveis e ofensiva ---------- */
  const TITLES = ["Calouro(a)", "Estudante", "Interno(a)", "Residente R1", "Residente R2", "Residente R3", "Especialista", "Preceptor(a)", "Professor(a)", "Chefe de serviço", "Lenda da Medicina"];
  const levelOf = (xp) => Math.floor(Math.sqrt(xp / 25)) + 1;
  const xpForLevel = (l) => 25 * (l - 1) * (l - 1);
  const titleOf = (l) => TITLES[Math.min(l - 1, TITLES.length - 1)];
  const currentStreak = () => (state.lastDay === dayStr() || state.lastDay === dayStr(-1)) ? state.streak : 0;
  const todayXP = () => state.daily[dayStr()] || 0;

  function addXP(n) {
    if (n <= 0) return;
    const before = todayXP(), lvBefore = levelOf(state.xp);
    const t = dayStr();
    if (state.lastDay !== t) {
      state.streak = state.lastDay === dayStr(-1) ? state.streak + 1 : 1;
      state.lastDay = t;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
    }
    state.xp += n;
    state.daily[t] = before + n;
    save();
    if (before < state.settings.goal && state.daily[t] >= state.settings.goal) toast("Meta diária cumprida. Ofensiva de " + plural(state.streak, "dia", "dias") + ".");
    if (levelOf(state.xp) > lvBefore) toast("Novo nível: " + levelOf(state.xp) + ", " + titleOf(levelOf(state.xp)) + ".");
    checkBadges();
    renderShell();
  }

  /* ---------- Repetição espaçada (caixas de Leitner) ---------- */
  const INTERVALS = [0, 1, 3, 7, 14, 30, 60];
  function srs(id) { return state.srs[id] || (state.srs[id] = { box: 0, due: dayStr(), seen: 0, ok: 0, bad: 0 }); }
  // q: 0 errei · 1 difícil · 2 bom · 3 fácil
  function srsRate(id, q) {
    const s = srs(id);
    s.seen++;
    if (q === 0) { s.box = 0; s.bad++; } else { s.ok++; s.box = Math.min(INTERVALS.length - 1, q === 1 ? Math.max(1, s.box) : s.box + (q === 3 ? 2 : 1)); }
    s.due = addDays(dayStr(), INTERVALS[s.box]);
  }
  const learnedIds = () => Object.keys(state.srs).filter((id) => state.srs[id].seen > 0 && getWord(id));
  const dueIds = () => learnedIds().filter((id) => state.srs[id].due <= dayStr());

  function recordMistake(id) {
    state.mistakes[id] = (state.mistakes[id] || 0) + 1;
    state.recent = [id].concat(state.recent.filter((x) => x !== id)).slice(0, 40);
  }

  /* ---------- Progresso das unidades ---------- */
  const unitDone = (uid) => state.units[uid] || [];
  const stepDone = (uid, i) => unitDone(uid).includes(i);
  function markStep(uid, i) { const d = unitDone(uid); if (!d.includes(i)) { d.push(i); state.units[uid] = d; } save(); }
  function unitUnlocked(idx) {
    if (state.settings.free || idx === 0) return true;
    const prev = UNITS[idx - 1].id;
    return [0, 1, 2].every((i) => stepDone(prev, i));
  }
  const unitIndex = (uid) => UNITS.findIndex((u) => u.id === uid);
  const stepUnlocked = (uid, i) => state.settings.free || i === 0 || stepDone(uid, i - 1);
  const unitComplete = (uid) => STEPS.every((_, i) => stepDone(uid, i));
  const nextStepOf = (uid) => { for (let s = 0; s < STEPS.length; s++) if (!stepDone(uid, s) && stepUnlocked(uid, s)) return s; return -1; };
  const stepsDoneTotal = () => UNITS.reduce((n, u) => n + unitDone(u.id).length, 0);

  /* ======================= Áudio ======================= */
  let voices = [];
  function loadVoices() { try { voices = speechSynthesis.getVoices(); } catch (e) { voices = []; } }
  if ("speechSynthesis" in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
  function speak(text, rate) {
    if (!("speechSynthesis" in window)) { toast("Seu navegador não tem síntese de voz."); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const lang = state.settings.accent;
    u.lang = lang;
    const v = voices.find((x) => x.lang.replace("_", "-") === lang) || voices.find((x) => x.lang.startsWith("en"));
    if (v) u.voice = v;
    u.rate = rate || state.settings.rate;
    speechSynthesis.speak(u);
  }
  let actx = null;
  function sfx(ok) {
    if (!state.settings.sfx) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = ok ? [660, 880] : [220, 180];
      notes.forEach((f, i) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = ok ? "sine" : "square"; o.frequency.value = f;
        g.gain.setValueAtTime(0.08, actx.currentTime + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + i * 0.1 + 0.18);
        o.connect(g).connect(actx.destination); o.start(actx.currentTime + i * 0.1); o.stop(actx.currentTime + i * 0.1 + 0.2);
      });
    } catch (e) { /* sem áudio */ }
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const canSpeakEx = () => !!SR && state.settings.speech;

  /* ======================= UI geral ======================= */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }
  function openModal(html, onMount) {
    $("#modal-card").innerHTML = html; $("#modal").hidden = false;
    if (onMount) onMount($("#modal-card"));
  }
  function closeModal() { $("#modal").hidden = true; $("#modal-card").innerHTML = ""; }
  $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal" || e.target.closest("[data-close]")) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#modal").hidden) closeModal(); });

  function applyTheme() {
    const t = state.settings.theme;
    if (t === "auto") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme", t);
  }

  const ROUTE_TITLES = { learn: "Início", unit: "Unidade", practice: "Praticar", cards: "Flashcards", cases: "Casos clínicos", case: "Caso clínico", dict: "Dicionário", mine: "Meu dicionário", profile: "Progresso", settings: "Ajustes", resources: "Recursos e fontes", import: "Início" };
  function renderShell(name) {
    const lv = levelOf(state.xp), due = dueIds().length;
    const initial = (state.name || "?").trim().charAt(0).toUpperCase() || "?";
    $("#user-row").innerHTML = `<span class="avatar">${esc(initial)}</span><span><b>${esc(state.name || "Visitante")}</b><span>Nível ${lv} · ${titleOf(lv)}</span></span>`;
    $("#nav-due").textContent = due ? due : "";
    $("#nav-due").setAttribute("aria-label", due ? plural(due, "palavra para revisar", "palavras para revisar") : "");
    if (name) $("#phone-title").textContent = ROUTE_TITLES[name] || "Início";
  }
  // Menu do celular: a barra lateral vira uma folha de tela cheia
  $("#menu-btn").addEventListener("click", () => { $("#side").classList.add("open"); $("#menu-btn").setAttribute("aria-expanded", "true"); });
  const closeMenu = () => { $("#side").classList.remove("open"); $("#menu-btn").setAttribute("aria-expanded", "false"); };
  $("#side-close").addEventListener("click", closeMenu);
  $("#side").addEventListener("click", (e) => { if (e.target.closest("a, [data-backup]")) closeMenu(); });

  const starBtn = (id) => `<button class="icon-btn star ${isMine(id) ? "on" : ""}" data-star="${esc(id)}" title="Meu dicionário" aria-label="Salvar no meu dicionário" aria-pressed="${isMine(id)}">${I("star")}</button>`;
  const speakBtn = (text, label) => `<button class="icon-btn" data-speak="${esc(text)}" aria-label="${esc(label || "Ouvir pronúncia")}" title="Ouvir">${I("speaker")}</button>`;

  // Delegação global para estrela e áudio
  document.addEventListener("click", (e) => {
    const s = e.target.closest("[data-star]");
    if (s) {
      e.stopPropagation();
      const on = toggleMine(s.dataset.star);
      $$(`[data-star="${CSS.escape(s.dataset.star)}"]`).forEach((b) => { b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
      toast(on ? "Salva no seu dicionário." : "Removida do seu dicionário.");
      if (location.hash.startsWith("#/mine") && $("#player").hidden) route();
      return;
    }
    const sp = e.target.closest("[data-speak]");
    if (sp) { e.stopPropagation(); speak(sp.dataset.speak, sp.dataset.rate ? Number(sp.dataset.rate) : undefined); }
  });

  /* ======================= Exercícios ======================= */
  function distractors(w, field, n, pool) {
    const seen = new Set([norm(w[field])]); const out = [];
    const cands = shuffle(pool.filter((x) => x !== w)).concat(shuffle(ALL_WORDS));
    for (const c of cands) {
      const k = norm(c[field]); if (!k || seen.has(k)) continue;
      seen.add(k); out.push(c); if (out.length >= n) break;
    }
    return out;
  }
  function poolFor(w) { return w.unit && UNIT[w.unit] ? UNIT[w.unit].words : ALL_WORDS; }
  function blankSentence(w) {
    const rx = new RegExp(reRx(w.en), "i");
    return rx.test(w.ex) ? w.ex.replace(rx, "\u0000") : null;
  }

  // Cria um exercício: type, word (opcional), dados para o RENDER e a resposta correta
  function makeEx(type, w, extra) {
    const pool = (extra && extra.pool) || poolFor(w || {});
    switch (type) {
      case "mc_en": {
        const opts = shuffle([w].concat(distractors(w, "pt", 3, pool)));
        return { type, word: w, solution: w.pt, opts: opts.map((o) => o.pt), correct: w.pt, label: "Selecione a tradução correta", speakOnLoad: w.en };
      }
      case "mc_pt": {
        const opts = shuffle([w].concat(distractors(w, "en", 3, pool)));
        return { type, word: w, solution: w.en, opts: opts.map((o) => o.en), correct: w.en, label: "Como se diz em inglês?" };
      }
      case "listen": {
        const opts = shuffle([w].concat(distractors(w, "en", 3, pool)));
        return { type, word: w, solution: w.en, opts: opts.map((o) => o.en), correct: w.en, label: "Ouça e escolha o que você escutou", speakOnLoad: w.en };
      }
      case "def": {
        if (!w.def) return makeEx("mc_pt", w, extra);
        const opts = shuffle([w].concat(distractors(w, "en", 3, pool)));
        return { type, word: w, solution: w.en, opts: opts.map((o) => o.en), correct: w.en, label: "Qual termo corresponde à definição?" };
      }
      case "fill": {
        const s = blankSentence(w); if (!s) return makeEx("mc_pt", w, extra);
        const opts = shuffle([w].concat(distractors(w, "en", 3, pool)));
        return { type, word: w, solution: w.ex, sentence: s, opts: opts.map((o) => o.en), correct: w.en, label: "Complete a frase" };
      }
      case "type":
        return { type, word: w, solution: w.en, label: "Escreva em inglês" };
      case "dictation":
        return { type, word: w, solution: w.en, label: "Ouça e escreva", speakOnLoad: w.en };
      case "order": {
        const toks = w.ex.split(/\s+/);
        if (toks.length < 3 || toks.length > 12) return makeEx("fill", w, extra);
        return { type, word: w, solution: w.ex, tokens: shuffle(toks.map((t, i) => ({ t, i }))), label: "Monte a frase em inglês" };
      }
      case "speak":
        return { type, word: w, solution: w.en, label: "Fale em voz alta", optional: true };
      case "match":
        return { type, words: extra.words.slice(0, 5), label: "Toque nos pares correspondentes", solution: "" };
      case "read":
        return { type, reading: extra.reading, label: "Leia o texto", noFeedback: true };
      case "rq":
        return { type, reading: extra.reading, q: extra.q, opts: extra.q.options, correct: extra.q.options[extra.q.a], solution: extra.q.options[extra.q.a], label: "Compreensão do texto" };
    }
    return null;
  }

  /* ---------- Construção das lições ---------- */
  function buildStep(unit, step) {
    const ws = unit.words, half = Math.ceil(ws.length / 2);
    const ex = [];
    if (step === 0 || step === 1) {
      const set = step === 0 ? ws.slice(0, half) : ws.slice(half);
      set.forEach((w) => ex.push(makeEx("mc_en", w)));
      const types = ["mc_pt", "listen", "def", "fill"];
      shuffle(set).slice(0, 4).forEach((w, i) => ex.push(makeEx(types[i % types.length], w)));
      ex.push(makeEx("match", null, { words: shuffle(set) }));
      ex.push(makeEx("type", pick(set)));
      return ex;
    }
    if (step === 2) {
      const all = shuffle(ws);
      const plan = ["fill", "fill", "fill", "order", "order", "order", "type", "type", "listen", "listen", "def", "mc_pt"];
      plan.forEach((t, i) => ex.push(makeEx(t, all[i % all.length])));
      ex.splice(6, 0, makeEx("match", null, { words: shuffle(ws) }));
      if (canSpeakEx()) ex.push(makeEx("speak", pick(ws)));
      return ex;
    }
    if (step === 3) return readingEx(unit.reading);
    // Desafio
    const all = shuffle(ws);
    const plan = ["type", "type", "type", "type", "dictation", "dictation", "dictation", "fill", "fill", "fill", "order", "order", "def", "def", "mc_pt"];
    plan.forEach((t, i) => ex.push(makeEx(t, all[i % all.length])));
    const out = shuffle(ex);
    if (canSpeakEx()) out.push(makeEx("speak", pick(ws)));
    return out;
  }
  function readingEx(reading) {
    return [makeEx("read", null, { reading })].concat(reading.questions.map((q) => makeEx("rq", null, { reading, q })));
  }
  function mixedEx(words, n, types) {
    const ts = types || ["mc_en", "mc_pt", "listen", "def", "fill", "type", "order"];
    const list = shuffle(words); const ex = [];
    for (let i = 0; i < Math.min(n, list.length); i++) ex.push(makeEx(pick(ts), list[i], { pool: words.length >= 4 ? words : undefined }));
    return ex;
  }

  /* ======================= Player ======================= */
  const P = {};
  const PRAISE = ["Muito bem!", "Excelente!", "Perfeito!", "Isso aí!", "Great job!", "Well done!", "Correto!"];

  function startSession(opts) {
    Object.assign(P, {
      title: opts.title || "", queue: opts.exercises.filter(Boolean), i: 0, firstTotal: 0, firstOk: 0, okCount: 0,
      missed: new Set(), rated: new Set(), answer: null, phase: "answer", mode: opts.mode || "lesson",
      onFinish: opts.onFinish, xpBase: opts.xpBase == null ? 10 : opts.xpBase, timed: opts.timed || null, start: Date.now(), timer: null
    });
    P.firstTotal = P.queue.filter((e) => !e.noFeedback).length;
    if (!P.queue.length) { toast("Nada para praticar aqui ainda."); return; }
    $("#player").hidden = false;
    document.body.style.overflow = "hidden";
    if (P.timed) {
      P.timed.end = Date.now() + P.timed.seconds * 1000;
      P.timer = setInterval(() => {
        const left = Math.max(0, Math.ceil((P.timed.end - Date.now()) / 1000));
        $("#pl-extra").innerHTML = `<span class="row" style="justify-content:flex-end">${I("clock")}${left} s</span>`;
        if (left <= 0) finishSession();
      }, 250);
    } else $("#pl-extra").textContent = "";
    renderEx();
  }

  function closePlayer() {
    clearInterval(P.timer); P.timer = null;
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    $("#player").hidden = true; document.body.style.overflow = "";
    route();
  }
  $("#pl-close").addEventListener("click", () => {
    if (P.phase === "done" || confirm("Sair da lição? O progresso desta lição será perdido.")) closePlayer();
  });

  function setAnswer(v) {
    P.answer = v;
    $("#pl-check").disabled = v == null || v === "";
  }

  function renderEx() {
    const e = P.queue[P.i];
    const foot = $("#pl-foot"); foot.className = "player-foot"; $("#pl-fb").innerHTML = "";
    P.phase = "answer"; setAnswer(null);
    const check = $("#pl-check"); check.textContent = "Verificar"; check.hidden = !!P.timed;
    const skip = $("#pl-skip");
    skip.hidden = !(e.type === "listen" || e.type === "dictation" || e.type === "speak");
    skip.textContent = e.type === "speak" ? "Não posso falar agora" : "Não posso ouvir agora";
    $("#pl-fill").style.width = (P.timed ? 0 : (P.i / P.queue.length) * 100) + "%";
    const body = $("#pl-body"); body.innerHTML = ""; body.scrollTop = 0;
    RENDER[e.type](e, body);
    if (e.speakOnLoad && state.settings.autoplay) setTimeout(() => speak(e.speakOnLoad), 250);
  }

  const isNew = (w) => w && !(state.srs[w.id] && state.srs[w.id].seen > 0);
  const pronHtml = (w) => state.settings.pron && w.pr ? `<div class="pron">/${esc(w.pr)}/</div>` : "";

  function optionsHtml(opts, cls) {
    return `<div class="options ${cls || ""}">${opts.map((o, i) => `<button class="opt" data-v="${esc(o)}"><span class="k">${i + 1}</span><span>${esc(o)}</span></button>`).join("")}</div>`;
  }
  function bindOptions(body) {
    $$(".opt", body).forEach((b) => b.addEventListener("click", () => {
      if (P.phase !== "answer") return;
      $$(".opt", body).forEach((x) => x.classList.remove("sel"));
      b.classList.add("sel"); setAnswer(b.dataset.v);
      if (P.timed) doCheck();
    }));
  }
  const listenRow = (text) => `<div class="listen-row"><button class="big-speaker" data-speak="${esc(text)}" aria-label="Ouvir">${I("speaker")}</button>
    <button class="btn sm" data-speak="${esc(text)}" data-rate="0.55">Ouvir devagar</button></div>`;

  const RENDER = {
    mc_en(e, body) {
      body.innerHTML = `<div class="q-label">${e.label}${isNew(e.word) ? ' <span class="pill acc">Nova palavra</span>' : ""}</div>
        <div class="q-prompt">${speakBtn(e.word.en)}<span>${esc(e.word.en)}</span></div>${pronHtml(e.word)}${optionsHtml(e.opts)}`;
      bindOptions(body);
    },
    mc_pt(e, body) {
      body.innerHTML = `<div class="q-label">${e.label}</div><div class="q-prompt">${esc(e.word.pt)}</div>${optionsHtml(e.opts, "two")}`;
      bindOptions(body);
    },
    listen(e, body) {
      body.innerHTML = `<div class="q-label">${e.label}</div>${listenRow(e.word.en)}${optionsHtml(e.opts, "two")}`;
      bindOptions(body);
    },
    def(e, body) {
      body.innerHTML = `<div class="q-label">${e.label}</div><div class="q-prompt md">“${esc(e.word.def)}”</div>${optionsHtml(e.opts, "two")}`;
      bindOptions(body);
    },
    fill(e, body) {
      const parts = e.sentence.split("\u0000");
      body.innerHTML = `<div class="q-label">${e.label}</div>
        <div class="sentence">${esc(parts[0])}<span class="blank" id="blank">&nbsp;</span>${esc(parts[1])}</div>
        <div class="q-sub">Dica: ${esc(e.word.pt)}</div>${optionsHtml(e.opts, "two")}`;
      bindOptions(body);
      $$(".opt", body).forEach((b) => b.addEventListener("click", () => { $("#blank").textContent = b.dataset.v; }));
    },
    type(e, body) {
      body.innerHTML = `<div class="q-label">${e.label}</div><div class="q-prompt">${esc(e.word.pt)}</div>
        <div class="q-sub">${esc(e.word.def)}</div>
        <input type="text" id="typed" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Digite em inglês" aria-label="Sua resposta em inglês">`;
      const inp = $("#typed"); inp.focus();
      inp.addEventListener("input", () => setAnswer(inp.value.trim()));
    },
    dictation(e, body) {
      body.innerHTML = `<div class="q-label">${e.label}</div>${listenRow(e.word.en)}
        <input type="text" id="typed" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Escreva o que ouviu" aria-label="O que você ouviu" style="margin-top:20px">`;
      const inp = $("#typed"); inp.focus();
      inp.addEventListener("input", () => setAnswer(inp.value.trim()));
    },
    order(e, body) {
      body.innerHTML = `<div class="q-label">${e.label}</div>
        <div class="row">${speakBtn(e.word.ex, "Ouvir a frase")}<span class="muted">Palavra-chave: <b>${esc(e.word.en)}</b>, ${esc(e.word.pt)}</span></div>
        <div class="answer-line" id="aline"></div><div class="bank" id="bank">${e.tokens.map((t, k) => `<button class="chip" data-k="${k}">${esc(t.t)}</button>`).join("")}</div>`;
      const chosen = [];
      const update = () => {
        $("#aline").innerHTML = chosen.map((k, pos) => `<button class="chip" data-pos="${pos}">${esc(e.tokens[k].t)}</button>`).join("");
        $$("#bank .chip").forEach((c) => c.classList.toggle("used", chosen.includes(Number(c.dataset.k))));
        setAnswer(chosen.length === e.tokens.length ? chosen.map((k) => e.tokens[k].t).join(" ") : null);
      };
      $("#bank").addEventListener("click", (ev) => { const c = ev.target.closest(".chip"); if (!c || P.phase !== "answer") return; const k = Number(c.dataset.k); if (!chosen.includes(k)) { chosen.push(k); update(); } });
      $("#aline").addEventListener("click", (ev) => { const c = ev.target.closest(".chip"); if (!c || P.phase !== "answer") return; chosen.splice(Number(c.dataset.pos), 1); update(); });
    },
    match(e, body) {
      const left = shuffle(e.words), right = shuffle(e.words);
      body.innerHTML = `<div class="q-label">${e.label}</div><div class="match-cols">
        <div class="col">${left.map((w) => `<button class="opt" data-side="l" data-id="${esc(w.id)}">${esc(w.en)}</button>`).join("")}</div>
        <div class="col">${right.map((w) => `<button class="opt" data-side="r" data-id="${esc(w.id)}">${esc(w.pt)}</button>`).join("")}</div></div>`;
      let selL = null, selR = null, matched = 0; e.errors = [];
      const tryMatch = () => {
        if (!selL || !selR) return;
        const a = selL, b = selR; selL = selR = null;
        if (a.dataset.id === b.dataset.id) {
          [a, b].forEach((x) => { x.classList.remove("sel"); x.classList.add("right"); x.disabled = true; });
          if (state.settings.autoplay) speak(getWord(a.dataset.id).en);
          if (++matched === e.words.length) { setAnswer("ok"); setTimeout(doCheck, 350); }
        } else {
          e.errors.push(a.dataset.id); sfx(false);
          [a, b].forEach((x) => { x.classList.remove("sel"); x.classList.add("bad"); setTimeout(() => x.classList.remove("bad"), 500); });
        }
      };
      $$(".opt", body).forEach((b) => b.addEventListener("click", () => {
        if (b.disabled) return;
        if (b.dataset.side === "l") { if (selL) selL.classList.remove("sel"); selL = b; } else { if (selR) selR.classList.remove("sel"); selR = b; }
        b.classList.add("sel"); tryMatch();
      }));
    },
    speak(e, body) {
      body.innerHTML = `<div class="q-label">${e.label}</div><div class="q-prompt">${speakBtn(e.word.en)}<span>${esc(e.word.en)}</span></div>${pronHtml(e.word)}
        <div class="mic-wrap"><button class="mic-btn" id="mic" aria-label="Gravar sua voz">${I("mic")}</button>
        <p class="muted" id="heard" style="margin-top:12px">Toque no microfone e diga a palavra.</p></div>`;
      $("#mic").addEventListener("click", () => {
        let rec; try { rec = new SR(); } catch (err) { toast("Reconhecimento de voz indisponível."); return; }
        rec.lang = state.settings.accent; rec.maxAlternatives = 5; rec.interimResults = false;
        $("#mic").classList.add("rec"); $("#heard").textContent = "Ouvindo…";
        rec.onresult = (ev) => {
          const alts = Array.from(ev.results[0]).map((r) => r.transcript);
          e.heard = alts; $("#heard").textContent = "Você disse: “" + alts[0] + "”";
          setAnswer(alts[0]); doCheck();
        };
        rec.onerror = () => { $("#heard").textContent = "Não consegui ouvir. Tente de novo e verifique a permissão do microfone."; };
        rec.onend = () => $("#mic") && $("#mic").classList.remove("rec");
        rec.start();
      });
    },
    read(e, body) {
      const r = e.reading;
      body.innerHTML = `<div class="q-label">${e.label}</div><h1 style="margin-bottom:12px">${esc(r.title)}</h1>
        <div class="row wrap" style="margin-bottom:16px">${speakBtn(r.text, "Ouvir o texto")}<button class="btn sm" data-speak="${esc(r.text)}" data-rate="0.7">Ouvir devagar</button>
        <button class="btn sm" id="tr" aria-expanded="false">Mostrar tradução</button></div>
        <div class="reading-text">${esc(r.text)}</div><div class="reading-pt" id="trtext" hidden>${esc(r.pt || "")}</div>`;
      $("#tr").addEventListener("click", () => { const t = $("#trtext"); t.hidden = !t.hidden; $("#tr").textContent = t.hidden ? "Mostrar tradução" : "Ocultar tradução"; $("#tr").setAttribute("aria-expanded", !t.hidden); });
      setAnswer("read"); $("#pl-check").textContent = "Li o texto";
    },
    rq(e, body) {
      body.innerHTML = `<details style="margin-bottom:16px"><summary>Ver o texto novamente</summary><div class="reading-text" style="margin-top:8px">${esc(e.reading.text)}</div></details>
        <div class="q-label">${e.label}</div><div class="q-prompt md">${esc(e.q.q)}</div>${optionsHtml(e.opts)}`;
      bindOptions(body);
    }
  };

  function evaluate(e, ans) {
    switch (e.type) {
      case "type": case "dictation": {
        const a = norm(ans), b = norm(e.word.en);
        if (a === b) return { ok: true };
        if (b.length >= 5 && lev(a, b) <= 1) return { ok: true, note: "Quase perfeito. Atenção à grafia: " + e.word.en };
        return { ok: false };
      }
      case "order": return { ok: norm(ans) === norm(e.word.ex) };
      case "speak": {
        const target = norm(e.word.en);
        const ok = (e.heard || [ans]).some((h) => { const n = norm(h); return n === target || n.includes(target) || (target.length > 3 && lev(n, target) <= Math.max(1, Math.floor(target.length * 0.25))); });
        return { ok };
      }
      case "match": return { ok: true };
      case "read": return { ok: true };
      default: return { ok: ans === e.correct };
    }
  }

  function doCheck() {
    if (P.phase === "done") return closePlayer();
    if (P.phase === "feedback") return nextEx();
    if (P.phase !== "answer" || P.answer == null) return;
    const e = P.queue[P.i];
    if (e.noFeedback) { P.phase = "feedback"; return nextEx(); }
    const res = evaluate(e, P.answer);
    P.phase = "feedback";
    const first = !e.retry;
    state.stats.answers++;
    if (res.ok) { state.stats.correct++; P.okCount++; if (first) P.firstOk++; } else if (!P.timed && !e.retry) P.queue.push(Object.assign({}, e, { retry: true }));
    if (e.type === "speak" && res.ok) state.stats.speakOk++;

    // Repetição espaçada e erros
    const ids = e.type === "match" ? e.words.map((w) => w.id) : (e.word ? [e.word.id] : []);
    ids.forEach((id) => {
      const wrongHere = e.type === "match" ? e.errors.includes(id) : !res.ok;
      if (wrongHere) { recordMistake(id); P.missed.add(id); if (!P.rated.has(id + "x")) { srsRate(id, 0); P.rated.add(id + "x"); } }
      else if (!P.rated.has(id)) { srsRate(id, 2); P.rated.add(id); }
    });
    save();
    sfx(res.ok);

    // Destaque nas opções
    $$("#pl-body .opt").forEach((b) => {
      if (e.type === "match") return;
      b.disabled = true;
      if (b.dataset.v === e.correct) b.classList.add("right");
      else if (b.classList.contains("sel")) b.classList.add("bad");
    });
    const inp = $("#typed"); if (inp) inp.disabled = true;

    const foot = $("#pl-foot"); foot.classList.add(res.ok ? "correct" : "wrong");
    const w = e.word;
    let html = `<div class="fb-title">${res.ok ? I("check", "lg") + pick(PRAISE) : I("x", "lg") + "Resposta correta:"}</div>`;
    if (!res.ok && e.solution) html += `<div style="font-size:16px"><b>${esc(e.solution)}</b></div>`;
    if (res.note) html += `<div>${esc(res.note)}</div>`;
    if (w) html += `<div class="row" style="margin-top:6px">${speakBtn(w.en)}<span><b>${esc(w.en)}</b>, ${esc(w.pt)}</span>${starBtn(w.id)}<span>Salvar no meu dicionário</span></div>`;
    $("#pl-fb").innerHTML = html;
    if (res.ok && w && state.settings.autoplay && ["mc_pt", "def", "fill", "type", "order"].includes(e.type)) speak(e.type === "fill" || e.type === "order" ? w.ex : w.en);

    const check = $("#pl-check"); check.textContent = "Continuar"; check.disabled = false; $("#pl-skip").hidden = true;
    if (P.timed) setTimeout(() => { if (P.phase === "feedback" && P.timer) nextEx(); }, res.ok ? 450 : 1100);
  }
  function nextEx() {
    P.i++;
    if (P.i >= P.queue.length) return finishSession();
    renderEx();
  }
  $("#pl-check").addEventListener("click", doCheck);
  $("#pl-skip").addEventListener("click", () => {
    const e = P.queue[P.i];
    if (!e.optional) {
      // Sem áudio agora: os próximos exercícios de escuta viram exercícios de leitura
      P.queue = P.queue.map((x, k) => k > P.i && (x.type === "listen" || x.type === "dictation") ? makeEx(x.type === "listen" ? "mc_en" : "type", x.word) : x);
    }
    P.firstTotal--; P.queue.splice(P.i, 1); P.i--; nextEx();
  });
  document.addEventListener("keydown", (ev) => {
    if ($("#player").hidden) return;
    if (ev.key === "Enter") { ev.preventDefault(); if (!$("#pl-check").disabled) doCheck(); return; }
    if (/^[1-9]$/.test(ev.key) && document.activeElement.tagName !== "INPUT") {
      const b = $$("#pl-body .opt:not(:disabled)")[Number(ev.key) - 1]; if (b) b.click();
    }
  });

  function finishSession() {
    if (P.phase === "done") return;
    clearInterval(P.timer); P.timer = null; P.phase = "done";
    const total = Math.max(1, P.firstTotal);
    const acc = P.timed ? (P.okCount / Math.max(1, P.i)) : P.firstOk / total;
    const perfect = !P.timed && P.firstOk === P.firstTotal && P.firstTotal > 0;
    let result = { acc, perfect, score: P.okCount, passed: true };
    if (P.onFinish) result = Object.assign(result, P.onFinish(result) || {});
    let xp = 0;
    if (result.passed) {
      xp = P.timed ? P.okCount : P.xpBase + (perfect ? 5 : 0);
      if (P.mode === "lesson") { state.stats.lessons++; if (perfect) state.stats.perfect++; }
      save(); addXP(xp);
    }
    const missed = Array.from(P.missed).filter(getWord);
    const secs = Math.round((Date.now() - P.start) / 1000);
    $("#pl-fill").style.width = "100%"; $("#pl-extra").textContent = "";
    $("#pl-body").innerHTML = `<div class="result">
      <h1>${esc(result.title || (result.passed ? (perfect ? "Lição perfeita" : "Lição concluída") : "Quase lá"))}</h1>
      <p class="muted" style="margin-top:6px;font-size:15px">${esc(result.message || (result.passed ? "A repetição é o segredo: estas palavras voltam na revisão no dia certo." : "O desafio pede 70% de acertos na primeira tentativa. Revise as palavras abaixo e tente de novo."))}</p>
      <div class="result-stats">
        <div><span>XP ganho</span><b>+${xp}</b></div>
        <div><span>${P.timed ? "Acertos" : "Precisão"}</span><b>${P.timed ? P.okCount : Math.round(acc * 100) + "%"}</b></div>
        <div><span>Tempo</span><b>${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}</b></div>
      </div>
      ${missed.length ? `<div class="panel"><div class="panel-head"><h2>Palavras para reforçar</h2><span class="chip-count">${missed.length}</span>
        <button class="link" id="saveall">Salvar todas no meu dicionário</button></div><div class="rows">
        ${missed.map((id) => { const w = getWord(id); return `<div class="rowcard">${speakBtn(w.en)}<span class="main-col"><span class="t">${esc(w.en)}</span><span class="st">${esc(w.pt)}</span></span>${starBtn(id)}</div>`; }).join("")}</div></div>` : ""}
    </div>`;
    const sa = $("#saveall");
    if (sa) sa.addEventListener("click", () => { missed.forEach((id) => toggleMine(id, true)); $$("#pl-body [data-star]").forEach((b) => b.classList.add("on")); toast(plural(missed.length, "palavra salva", "palavras salvas") + " no seu dicionário."); });
    const foot = $("#pl-foot"); foot.className = "player-foot"; $("#pl-fb").innerHTML = ""; $("#pl-skip").hidden = true;
    const check = $("#pl-check"); check.hidden = false; check.disabled = false; check.textContent = "Continuar";
  }

  /* ---------- Atalhos para iniciar sessões ---------- */
  function startStep(uid, step) {
    const unit = UNIT[uid];
    startSession({
      title: unit.title + " · " + STEPS[step].name,
      exercises: buildStep(unit, step),
      mode: "lesson",
      xpBase: step === 4 ? 20 : 10,
      onFinish: (r) => {
        if (step === 4 && r.acc < 0.7) return { passed: false };
        markStep(uid, step);
        checkBadges();
        if (step === 4) return { title: "Unidade concluída", message: "Você completou as cinco etapas de “" + unit.title + "”." };
        return {};
      }
    });
  }
  function startPractice(kind, arg) {
    const learned = learnedIds().map(getWord);
    const fallback = () => UNITS.filter((u, i) => unitUnlocked(i)).flatMap((u) => u.words);
    let words, ex, opts = { mode: "practice", xpBase: 8 };
    switch (kind) {
      case "review": {
        words = dueIds().map(getWord);
        if (!words.length) { toast("Nada para revisar hoje. Experimente o treino misto."); return; }
        ex = mixedEx(words, 15); opts.title = "Revisão inteligente"; break;
      }
      case "mixed": words = learned.length >= 4 ? learned : fallback(); ex = mixedEx(words, 12); opts.title = "Treino misto"; break;
      case "mistakes": {
        words = Object.keys(state.mistakes).filter(getWord).sort((a, b) => state.mistakes[b] - state.mistakes[a]).slice(0, 15).map(getWord);
        if (!words.length) { toast("Você ainda não errou nenhuma palavra."); return; }
        ex = mixedEx(words, 12, ["mc_en", "mc_pt", "type", "listen", "fill"]); opts.title = "Meus erros"; break;
      }
      case "mine": {
        words = Object.keys(state.mine).map(getWord).filter(Boolean);
        if (!words.length) { toast("Seu dicionário está vazio. Toque na estrela de uma palavra para salvá-la."); return; }
        ex = mixedEx(words, 15, ["mc_en", "mc_pt", "type", "listen", "def", "fill"]); opts.title = "Meu dicionário"; break;
      }
      case "unit": words = UNIT[arg].words; ex = mixedEx(words, 12); opts.title = UNIT[arg].title; break;
      case "timed": {
        words = learned.length >= 8 ? learned : fallback();
        ex = []; for (let i = 0; i < 80; i++) ex.push(makeEx(pick(["mc_en", "mc_pt", "def"]), pick(words)));
        opts = { mode: "timed", title: "Contra o relógio", timed: { seconds: 60 },
          onFinish: (r) => {
            const best = r.score > state.stats.timedBest; if (best) state.stats.timedBest = r.score; save(); checkBadges();
            return { title: plural(r.score, "acerto", "acertos") + " em 60 segundos", message: best ? "Novo recorde pessoal." : "Seu recorde: " + plural(state.stats.timedBest, "acerto", "acertos") + "." };
          } };
        break;
      }
      case "dictation": words = learned.length >= 4 ? learned : fallback(); ex = mixedEx(words, 10, ["dictation"]); opts.title = "Ditado"; break;
      case "speak": {
        if (!SR) { toast("Seu navegador não tem reconhecimento de voz. Use o Chrome ou o Edge."); return; }
        words = learned.length >= 4 ? learned : fallback(); ex = shuffle(words).slice(0, 8).map((w) => makeEx("speak", w)); opts.title = "Pronúncia"; break;
      }
      case "terms": words = UNIT.terms.words.concat(UNIT.abbrev.words); ex = mixedEx(words, 12, ["mc_en", "mc_pt", "def", "type"]); opts.title = "Prefixos, sufixos e abreviações"; break;
    }
    opts.exercises = ex;
    startSession(opts);
  }

  /* ======================= Telas ======================= */
  const view = $("#view");
  const ROUTES = {};

  function route() {
    const [r, arg] = location.hash.replace(/^#\/?/, "").split("/");
    const name = ROUTES[r] ? r : "learn";
    const navName = { case: "cases", unit: "learn", import: "learn" }[name] || name;
    $$(".nav a[data-route]").forEach((a) => {
      const on = a.dataset.route === navName;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    view.className = name === "learn" || name === "import" ? "home" : "";
    ROUTES[name](arg ? decodeURIComponent(arg) : undefined);
    renderShell(name);
  }
  window.addEventListener("hashchange", () => { route(); window.scrollTo(0, 0); });

  const titleRow = (h1, sub, actions) => `<div class="title-row"><div><h1>${h1}</h1>${sub ? `<p class="sub">${sub}</p>` : ""}</div>${actions ? `<div class="actions">${actions}</div>` : ""}</div>`;
  const backLink = (href, label) => `<a class="link muted" href="${href}" style="margin-bottom:12px">${I("back")}${esc(label)}</a>`;
  const trackHtml = (uid, big) => {
    const nx = nextStepOf(uid);
    return `<div class="track ${big ? "big" : ""}" aria-hidden="true">${STEPS.map((_, i) => `<i class="${stepDone(uid, i) ? "on" : i === nx ? "next" : ""}"></i>`).join("")}</div>`;
  };

  /* ---------- Início ---------- */
  function wordOfDay() {
    const d = dayStr().split("-").map(Number); const n = d[0] * 372 + d[1] * 31 + d[2];
    return ALL_WORDS[n % ALL_WORDS.length];
  }
  function nextStep() {
    for (let i = 0; i < UNITS.length; i++) {
      if (!unitUnlocked(i)) break;
      const s = nextStepOf(UNITS[i].id); if (s >= 0) return { uid: UNITS[i].id, step: s };
    }
    return null;
  }
  function greetingText() {
    const h = new Date().getHours();
    const g = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
    return g + (state.name ? ", " + state.name : "") + ".";
  }
  function unitRow(u, idx, nx) {
    const unlocked = unitUnlocked(idx), done = unitComplete(u.id), n = unitDone(u.id).length;
    const status = done ? '<span class="pill pos">Concluída</span>' : nx && nx.uid === u.id ? '<span class="pill acc">Agora</span>' : !unlocked ? `<span class="muted" title="Bloqueada">${I("lock")}</span>` : "";
    return `<a class="rowcard ${unlocked ? "" : "locked"}" href="#/unit/${u.id}" aria-label="${esc(u.title)}, ${n} de 5 etapas${unlocked ? "" : ", bloqueada"}">
      <span class="main-col"><span class="t">${esc(u.title)}</span><span class="st">${esc(u.en)}</span></span>
      ${trackHtml(u.id)}<span class="fig hide-sm">${n}/5</span><span class="status" style="width:72px;display:flex;align-items:center;justify-content:flex-end">${status}</span>${I("chev")}</a>`;
  }
  ROUTES.learn = function () {
    const nx = nextStep(), due = dueIds(), wod = wordOfDay(), g = state.settings.goal, x = todayXP(), left = Math.max(0, g - x);
    const streak = currentStreak(), learned = learnedIds().length;
    const dateTxt = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
    const finding = state.onboarded
      ? "Hoje, " + dateTxt + ": " + (due.length ? plural(due.length, "palavra para revisar", "palavras para revisar") : "nenhuma revisão pendente") + " e " + (left ? "faltam " + left + " XP para a meta de " + g + " XP." : "meta de " + g + " XP cumprida.")
      : "Lições curtas, flashcards, casos clínicos e o seu próprio dicionário de inglês médico.";
    const needBackup = state.xp >= 30 && (!state.lastBackup || Date.now() - state.lastBackup > 7 * 864e5);
    const recent = state.recent.filter(getWord).slice(0, 4);
    const dueShow = due.slice(0, 4).map(getWord);
    let html = `<div class="home-head"><h1 class="greeting">${state.onboarded ? esc(greetingText()) : "Boas-vindas ao Inglês Médico."}</h1>
      <p class="greeting-sub">${esc(finding)}${needBackup ? ` Seu progresso fica só neste navegador: <button class="link" data-backup>salvar uma cópia</button>.` : ""}</p></div>
      <div class="grid12">
        <div class="tile s3"><span class="label">Meta de hoje</span><span class="value">${x}<small>/ ${g} XP</small></span><span class="cap">${left ? "Faltam " + left + " XP" : "Meta cumprida"}</span></div>
        <div class="tile s3"><span class="label">Ofensiva</span><span class="value">${streak}<small>${streak === 1 ? "dia" : "dias"}</small></span><span class="cap">Recorde: ${plural(state.bestStreak, "dia", "dias")}</span></div>
        <div class="tile s3"><span class="label">Para revisar hoje</span><span class="value">${due.length}<small>${due.length === 1 ? "palavra" : "palavras"}</small></span><span class="cap">${due.length ? "Na fila da repetição espaçada" : "Nada pendente"}</span></div>
        <div class="tile s3"><span class="label">Palavras praticadas</span><span class="value">${learned}<small>de ${ALL_WORDS.length}</small></span><span class="cap">${plural(mineCount(), "salva", "salvas")} no meu dicionário</span></div>`;
    // Bloco principal: próxima lição (ou o primeiro acesso)
    if (!state.onboarded) {
      html += `<div class="panel s9"><div class="panel-head"><h2>Antes de começar</h2></div><form id="ob" class="inner">
        <div class="grid12" style="gap:16px"><div class="field s4"><label for="ob-name">Como quer ser chamado(a)</label><input type="text" id="ob-name" placeholder="Ex.: Dra. Ana"></div>
        <div class="field s4"><label for="ob-goal">Meta diária</label><select id="ob-goal"><option value="10">10 XP, cerca de 5 min</option><option value="20">20 XP, cerca de 10 min</option><option value="30" selected>30 XP, cerca de 15 min</option><option value="50">50 XP, cerca de 25 min</option></select></div>
        <div class="field s4"><label for="ob-level">Seu inglês hoje</label><select id="ob-level"><option value="0">Começar do zero</option><option value="1">Já tenho base: liberar tudo</option></select></div></div>
        <div class="row"><button class="btn primary" type="submit">Começar a Lição 1</button><span class="muted">Primeira unidade: ${esc(UNITS[0].title)}</span></div></form></div>`;
    } else if (nx) {
      const u = UNIT[nx.uid], sec = SECTION[u.section];
      html += `<div class="panel s9"><div class="panel-head"><h2>Continue de onde parou</h2><a class="link" href="#/unit/${u.id}">Ver unidade ${I("chev")}</a></div>
        <div class="inner"><p class="muted">${esc(sec.title)} · ${sec.level} · unidade ${unitIndex(u.id) + 1} de ${UNITS.length}</p>
        <h2 style="font-size:24px;line-height:32px;margin-top:4px">${esc(u.title)}</h2><p class="muted">${esc(u.en)}</p>
        <div style="margin:20px 0 4px">${trackHtml(u.id, true)}<div class="track-labels">${STEPS.map((s, i) => `<span class="${i === nx.step ? "cur" : ""}">${s.short}</span>`).join("")}</div></div>
        <div class="row wrap" style="margin-top:20px"><button class="btn primary" id="go-next">Começar ${STEPS[nx.step].name}</button>
        ${due.length ? `<button class="btn grey" id="go-review">Revisar ${plural(due.length, "palavra", "palavras")}</button>` : ""}
        <span class="muted">${STEPS[nx.step].desc}</span></div></div></div>`;
    } else {
      html += `<div class="panel s9"><div class="panel-head"><h2>Trilha concluída</h2></div><div class="inner"><h2 style="font-size:24px;line-height:32px">Você completou as ${UNITS.length} unidades.</h2>
        <p class="muted" style="margin-top:4px">Mantenha o vocabulário vivo com a revisão diária e os casos clínicos.</p>
        <div class="row" style="margin-top:20px"><button class="btn primary" id="go-review" ${due.length ? "" : "disabled"}>Revisar ${plural(due.length, "palavra", "palavras")}</button><a class="btn" href="#/cases">Abrir casos clínicos</a></div></div></div>`;
    }
    html += `<div class="panel s3"><div class="panel-head"><h2>Palavra do dia</h2><span class="spacer"></span>${speakBtn(wod.en)}${starBtn(wod.id)}</div>
        <p style="font-size:24px;line-height:32px;font-weight:600">${esc(wod.en)}</p>${pronHtml(wod)}<p style="margin-top:8px;font-weight:500">${esc(wod.pt)}</p>
        <p class="muted" style="margin-top:8px">${esc(wod.def)}</p><p style="margin-top:8px;font-style:italic">${esc(wod.ex)}</p></div>`;
    // Revisão e erros
    html += `<div class="panel s6"><div class="panel-head"><h2>Revisão de hoje</h2><span class="chip-count">${due.length}</span><a class="link" href="#/cards/due">Flashcards ${I("chev")}</a></div>
        <div class="rows">${dueShow.length ? dueShow.map((w) => `<div class="rowcard">${speakBtn(w.en)}<span class="main-col"><span class="t">${esc(w.en)}</span><span class="st">${esc(w.pt)}</span></span><span class="fig">${esc(UNIT[w.unit] ? UNIT[w.unit].title : "Minha palavra")}</span></div>`).join("")
          : `<div class="empty-line">Nada para revisar hoje. As palavras das lições voltam aqui no dia certo.</div>`}</div>
        <div class="panel-foot">${due.length ? `<button class="btn sm" id="go-review2">Revisar ${plural(due.length, "palavra", "palavras")}</button>` : `<span class="muted">Próxima revisão: ${nextDueText()}</span>`}</div></div>
      <div class="panel s6"><div class="panel-head"><h2>Erros recentes</h2><span class="chip-count">${Object.keys(state.mistakes).length}</span><a class="link" href="#/mine">Meu dicionário ${I("chev")}</a></div>
        <div class="rows">${recent.length ? recent.map((id) => { const w = getWord(id); return `<div class="rowcard">${speakBtn(w.en)}<span class="main-col"><span class="t">${esc(w.en)}</span><span class="st">${esc(w.pt)}</span></span><span class="fig">${plural(state.mistakes[id] || 0, "erro", "erros")}</span>${starBtn(id)}</div>`; }).join("")
          : `<div class="empty-line">Nenhum erro registrado. As palavras que você errar aparecem aqui para salvar.</div>`}</div>
        <div class="panel-foot">${recent.length ? `<button class="btn sm" id="go-mistakes">Treinar meus erros</button>` : `<span class="muted">Erros viram treino na aba Praticar.</span>`}</div></div>
      </div>`;
    // A trilha
    const doneSteps = stepsDoneTotal();
    html += `<div class="section-gap section-title"><h2 style="font-size:20px;line-height:28px">Sua trilha</h2><p class="num">${doneSteps} de ${UNITS.length * STEPS.length} etapas concluídas · ${UNITS.length} unidades em ${SECTIONS.length} níveis</p></div><div class="grid12">`;
    SECTIONS.forEach((sec) => {
      html += `<div class="panel s6"><div class="panel-head"><h3>${esc(sec.title)}</h3><span class="chip-count">${sec.level}</span></div><p class="muted" style="margin:-8px 0 14px">${esc(sec.desc)}</p><div class="rows">`;
      UNITS.forEach((u, idx) => { if (u.section === sec.id) html += unitRow(u, idx, nx); });
      html += `</div></div>`;
    });
    html += `</div>${state.settings.free || !state.onboarded ? "" : `<p class="muted" style="margin-top:16px">Já tem base em inglês? Libere todas as unidades em <a class="link" href="#/settings">Ajustes</a>.</p>`}`;
    view.innerHTML = html;
    const on = (id, fn) => { const el = $("#" + id); if (el) el.addEventListener("click", fn); };
    if (nx) on("go-next", () => startStep(nx.uid, nx.step));
    on("go-review", () => startPractice("review")); on("go-review2", () => startPractice("review")); on("go-mistakes", () => startPractice("mistakes"));
    const ob = $("#ob");
    if (ob) ob.addEventListener("submit", (e) => {
      e.preventDefault();
      state.name = $("#ob-name").value.trim(); state.settings.goal = Number($("#ob-goal").value);
      state.settings.free = $("#ob-level").value === "1"; state.onboarded = true; save(); route(); startStep(UNITS[0].id, 0);
    });
  };
  function nextDueText() {
    const dates = learnedIds().map((id) => state.srs[id].due).filter((d) => d > dayStr()).sort();
    if (!dates.length) return "conclua uma lição para começar";
    const d = dates[0], n = dates.filter((x) => x === d).length;
    const [y, m, dd] = d.split("-").map(Number);
    const label = d === dayStr(1) ? "amanhã" : new Date(y, m - 1, dd).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "short" });
    return label + ", " + plural(n, "palavra", "palavras");
  }

  /* ---------- Unidade ---------- */
  ROUTES.unit = function (uid) {
    const u = UNIT[uid]; if (!u) { location.hash = "#/learn"; return; }
    const idx = unitIndex(uid), sec = SECTION[u.section], unlocked = unitUnlocked(idx), nx = nextStepOf(uid);
    const words = u.words.slice(0, 9);
    view.innerHTML = backLink("#/learn", "Início") + titleRow(esc(u.title),
      `${esc(u.en)} · ${esc(sec.title)}, ${sec.level}${u.source ? " · " + esc(u.source) : ""}`,
      `${unlocked && nx >= 0 ? `<button class="btn primary" data-step="${nx}">Começar ${STEPS[nx].name}</button>` : ""}<button class="btn" id="u-prac">Praticar</button><a class="btn" href="#/cards/${uid}">Flashcards</a>`) +
      `${unlocked ? "" : `<p class="empty-line" style="margin-bottom:16px">Esta unidade abre quando você concluir as três lições de “${esc(UNITS[idx - 1].title)}”, ou ao ativar o modo livre em Ajustes.</p>`}
      <div class="grid12"><div class="panel s8"><div class="panel-head"><h2>Etapas</h2><span class="chip-count">${unitDone(uid).length}/5</span></div><div class="rows">
        ${STEPS.map((s, i) => {
          const done = stepDone(uid, i), unl = unlocked && stepUnlocked(uid, i);
          const st = done ? '<span class="pill pos">Concluída</span>' : i === nx && unl ? '<span class="pill acc">Agora</span>' : !unl ? `<span class="muted">${I("lock")}</span>` : "";
          return `<button class="rowcard ${unl ? "" : "locked"}" data-step="${i}" ${unl ? "" : 'aria-disabled="true"'}><span class="main-col"><span class="t">${s.name}</span><span class="st">${s.desc}</span></span>${st}${I("chev")}</button>`;
        }).join("")}</div></div>
      <div class="panel s4"><div class="panel-head"><h2>Vocabulário</h2><span class="chip-count">${u.words.length}</span></div><div class="kv">
        ${words.map((w) => `<div><span>${esc(w.en)}</span><span class="muted" style="text-align:right">${esc(w.pt)}</span></div>`).join("")}</div>
        <div class="panel-foot"><a class="link" href="#/dict/${uid}">Ver as ${u.words.length} palavras no dicionário ${I("chev")}</a></div></div>
      <div class="panel s12"><div class="panel-head"><h2>Leitura: ${esc(u.reading.title)}</h2><span class="spacer"></span>${speakBtn(u.reading.text, "Ouvir o texto")}</div>
        <p class="case-text">${esc(u.reading.text)}</p><p class="muted" style="margin-top:12px;max-width:68ch">${esc(u.reading.pt)}</p></div></div>`;
    $$("[data-step]").forEach((b) => b.addEventListener("click", () => {
      const i = Number(b.dataset.step);
      if (!unlocked || !stepUnlocked(uid, i)) { toast(unlocked ? "Conclua a etapa anterior primeiro." : "Esta unidade ainda está bloqueada."); return; }
      startStep(uid, i);
    }));
    $("#u-prac").addEventListener("click", () => startPractice("unit", uid));
  };

  /* ---------- Praticar ---------- */
  ROUTES.practice = function () {
    const due = dueIds().length, mist = Object.keys(state.mistakes).filter(getWord).length, mine = mineCount(), learned = learnedIds().length;
    const rowsHtml = (items) => items.map(([k, t, st, fig, disabled]) => `<button class="rowcard ${disabled ? "locked" : ""}" data-p="${k}"><span class="main-col"><span class="t">${t}</span><span class="st">${st}</span></span><span class="fig">${fig}</span>${I("chev")}</button>`).join("");
    view.innerHTML = titleRow("Praticar", due ? plural(due, "palavra espera", "palavras esperam") + " revisão hoje. Cada treino dá XP e atualiza a repetição espaçada." : "Nenhuma revisão pendente hoje. Escolha um treino para manter o ritmo.") +
      `<div class="grid12"><div class="panel s6"><div class="panel-head"><h2>Revisar</h2></div><div class="rows">${rowsHtml([
        ["review", "Revisão inteligente", "As palavras que vencem hoje na repetição espaçada", plural(due, "palavra", "palavras"), !due],
        ["mistakes", "Meus erros", "As palavras que você mais errou", plural(mist, "palavra", "palavras"), !mist],
        ["mine", "Meu dicionário", "Quiz com as palavras que você salvou", plural(mine, "palavra", "palavras"), !mine],
        ["mixed", "Treino misto", "Exercícios variados com o que você já viu", plural(learned, "praticada", "praticadas"), false]
      ])}</div></div>
      <div class="panel s6"><div class="panel-head"><h2>Treinos</h2></div><div class="rows">${rowsHtml([
        ["timed", "Contra o relógio", "Quantas respostas certas em 60 segundos", "Recorde " + state.stats.timedBest, false],
        ["dictation", "Ditado", "Ouça o termo e escreva em inglês", "10 termos", false],
        ["speak", "Pronúncia", SR ? "Fale a palavra; o app confere pelo microfone" : "Requer o Chrome ou o Edge", plural(state.stats.speakOk, "acerto", "acertos"), !SR],
        ["terms", "Prefixos e abreviações", "Hepato-, -itis, PRN, NPO e outros", (UNIT.terms.words.length + UNIT.abbrev.words.length) + " termos", false]
      ])}</div></div></div>`;
    $$("[data-p]").forEach((b) => b.addEventListener("click", () => startPractice(b.dataset.p)));
  };

  /* ---------- Flashcards ---------- */
  const FC = { deck: "due", dir: "en", queue: [], i: 0, flipped: false };
  const DECKS = () => [["due", "Para revisar hoje", dueIds().length], ["mine", "Meu dicionário", mineCount()], ["mistakes", "Meus erros", Object.keys(state.mistakes).filter(getWord).length]]
    .concat(UNITS.map((u) => [u.id, u.title, u.words.length])).concat([["all", "Todas as palavras", ALL_WORDS.length + state.custom.length]]);
  function deckWords(deck) {
    if (deck === "due") return dueIds().map(getWord);
    if (deck === "mine") return Object.keys(state.mine).map(getWord).filter(Boolean);
    if (deck === "mistakes") return Object.keys(state.mistakes).map(getWord).filter(Boolean);
    if (deck === "all") return ALL_WORDS.concat(state.custom);
    return UNIT[deck] ? UNIT[deck].words : [];
  }
  function upcoming() {
    const t = dayStr(), t1 = dayStr(1), t7 = dayStr(7); const c = { today: 0, tomorrow: 0, week: 0, later: 0 };
    learnedIds().forEach((id) => { const d = state.srs[id].due; if (d <= t) c.today++; else if (d === t1) c.tomorrow++; else if (d <= t7) c.week++; else c.later++; });
    return c;
  }
  ROUTES.cards = function (arg) {
    if (arg && (UNIT[arg] || ["due", "mine", "mistakes", "all"].includes(arg))) FC.deck = arg;
    const words = deckWords(FC.deck);
    // Vencidas primeiro, depois novas, depois o restante
    FC.queue = shuffle(words).sort((a, b) => ((state.srs[a.id] || {}).due || "0000") < ((state.srs[b.id] || {}).due || "0000") ? -1 : 1);
    FC.i = 0; FC.flipped = false;
    const deckName = DECKS().find((d) => d[0] === FC.deck)[1], up = upcoming();
    const mix = { fresh: 0, learning: 0, solid: 0 };
    FC.queue.forEach((w) => { const x = state.srs[w.id]; if (!x || !x.seen) mix.fresh++; else if (INTERVALS[x.box] >= 7) mix.solid++; else mix.learning++; });
    view.innerHTML = titleRow("Flashcards", `${esc(deckName)}: ${plural(FC.queue.length, "cartão", "cartões")}. Vire o cartão e diga o quanto lembrou; o app agenda a próxima revisão.`) +
      `<div class="toolbar"><select id="fc-deck" aria-label="Baralho">${DECKS().map(([v, l, n]) => `<option value="${v}">${esc(l)} (${n})</option>`).join("")}</select>
        <div class="seg" role="group" aria-label="Direção"><button data-dir="en" class="${FC.dir === "en" ? "on" : ""}" aria-pressed="${FC.dir === "en"}">Inglês → Português</button><button data-dir="pt" class="${FC.dir === "pt" ? "on" : ""}" aria-pressed="${FC.dir === "pt"}">Português → Inglês</button></div></div>
      <div class="grid12" style="align-items:start"><div class="s8" id="fc-area"></div>
      <div class="s4" style="display:flex;flex-direction:column;gap:16px"><div class="panel"><div class="panel-head"><h2>Neste baralho</h2><span class="chip-count">${FC.queue.length}</span></div><div class="kv">
        <div><span>Nunca vistos</span><b>${mix.fresh}</b></div><div><span>Em aprendizado</span><b>${mix.learning}</b></div><div><span>Firmes (7 dias ou mais)</span><b>${mix.solid}</b></div></div></div>
      <div class="panel"><div class="panel-head"><h2>Próximas revisões</h2></div><div class="kv">
        <div><span>Hoje</span><b>${up.today}</b></div><div><span>Amanhã</span><b>${up.tomorrow}</b></div>
        <div><span>Próximos 7 dias</span><b>${up.week}</b></div><div><span>Mais tarde</span><b>${up.later}</b></div>
        <div><span>Cartões revisados no total</span><b>${state.stats.cards}</b></div></div>
        <p class="muted" style="margin-top:12px">Errei volta hoje; Difícil, amanhã; Bom e Fácil espaçam a revisão de 1 a 60 dias.</p></div></div></div>`;
    $("#fc-deck").value = FC.deck;
    $("#fc-deck").addEventListener("change", (e) => { location.hash = "#/cards/" + e.target.value; });
    $$("[data-dir]").forEach((b) => b.addEventListener("click", () => { FC.dir = b.dataset.dir; $$("[data-dir]").forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); }); renderCard(); }));
    renderCard();
  };
  function renderCard() {
    const area = $("#fc-area"); if (!area) return;
    if (FC.i >= FC.queue.length) {
      area.innerHTML = `<div class="fc-stage"><div class="panel-head"><h2>${FC.queue.length ? "Baralho concluído" : "Nenhum cartão neste baralho"}</h2></div>
        <p class="empty-line">${FC.deck === "due" ? "Nada mais para revisar hoje. Volte amanhã ou escolha outro baralho." : FC.deck === "mine" ? "Salve palavras com a estrela no dicionário ou nas lições para montar este baralho." : "Escolha outro baralho na lista acima."}</p></div>`;
      return;
    }
    const w = FC.queue[FC.i], s = srs(w.id);
    const front = FC.dir === "en" ? `<div class="fc-term">${esc(w.en)}</div>${pronHtml(w)}` : `<div class="fc-term">${esc(w.pt)}</div>`;
    const back = `<div class="fc-term">${esc(FC.dir === "en" ? w.pt : w.en)}</div>${FC.dir === "pt" ? pronHtml(w) : ""}
      <p class="muted" style="margin-top:12px;max-width:44ch">${esc(w.def || "")}</p><p style="margin-top:8px;font-style:italic;max-width:44ch">${esc(w.ex || "")}</p>`;
    area.innerHTML = `<div class="fc-stage"><div class="panel-head"><h2 class="num">Cartão ${FC.i + 1} de ${FC.queue.length}</h2><span class="spacer"></span>${speakBtn(w.en)}${starBtn(w.id)}</div>
      <div class="fc ${FC.flipped ? "flip" : ""}" id="fc" tabindex="0" role="button" aria-label="Virar cartão"><div class="fc-in">
        <div class="fc-face">${front}<span class="fc-hint">Toque ou aperte espaço para virar</span></div>
        <div class="fc-face fc-back">${back}</div></div></div>
      <div class="fc-rate" id="fc-rate" ${FC.flipped ? "" : 'style="visibility:hidden"'}>
        <button class="btn bad" data-q="0">Errei<small>volta hoje</small></button>
        <button class="btn" data-q="1">Difícil<small>em 1 dia</small></button>
        <button class="btn primary" data-q="2">Bom<small>em ${plural(INTERVALS[Math.min(6, s.box + 1)], "dia", "dias")}</small></button>
        <button class="btn" data-q="3">Fácil<small>em ${plural(INTERVALS[Math.min(6, s.box + 2)], "dia", "dias")}</small></button></div></div>`;
    const flip = () => { FC.flipped = !FC.flipped; $("#fc").classList.toggle("flip", FC.flipped); $("#fc-rate").style.visibility = FC.flipped ? "visible" : "hidden"; if (FC.flipped && FC.dir === "pt" && state.settings.autoplay) speak(w.en); };
    $("#fc").addEventListener("click", flip);
    $("#fc").addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); } });
    if (FC.dir === "en" && !FC.flipped && state.settings.autoplay) speak(w.en);
    $$("#fc-rate [data-q]").forEach((b) => b.addEventListener("click", () => {
      const q = Number(b.dataset.q); srsRate(w.id, q); if (q === 0) recordMistake(w.id);
      state.stats.cards++; save(); addXP(1);
      if (q === 0) FC.queue.push(w);
      FC.i++; FC.flipped = false; renderCard();
    }));
  }

  /* ---------- Dicionário ---------- */
  const DICT = { q: "", unit: "", open: null, limit: 60 };
  function wordRow(w, opts) {
    const open = DICT.open === w.id, notes = opts && opts.notes;
    const note = state.mine[w.id] && state.mine[w.id].note;
    const unitName = UNIT[w.unit] ? UNIT[w.unit].title : "Minha palavra";
    return `<div class="drow" data-wid="${esc(w.id)}"><div class="drow-head" role="button" tabindex="0" aria-expanded="${open}">
      <span><span class="term">${esc(w.en)}</span>${state.settings.pron && w.pr ? `<span class="pr">/${esc(w.pr)}/</span>` : ""}</span>
      <span class="c-pt">${esc(w.pt)}</span><span class="c-unit unit-name">${esc(unitName)}</span>
      <span class="acts">${speakBtn(w.en)}${starBtn(w.id)}</span></div>
      ${open ? `<div class="drow-body"><div>${w.def ? `<p>${esc(w.def)}</p>` : ""}${w.ex ? `<p class="ex">${esc(w.ex)}</p>` : ""}
        <div class="refs"><a href="https://youglish.com/pronounce/${encodeURIComponent(w.en)}/english" target="_blank" rel="noopener">YouGlish</a>
        <a href="https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(w.en.toLowerCase())}" target="_blank" rel="noopener">Cambridge</a>
        <a href="https://www.merriam-webster.com/medical/${encodeURIComponent(w.en.toLowerCase())}" target="_blank" rel="noopener">Merriam-Webster Medical</a></div></div>
        <div>${notes ? `<label class="small muted" for="n-${esc(w.id)}">Anotações</label><textarea class="note-area" id="n-${esc(w.id)}" rows="3" data-note="${esc(w.id)}" placeholder="Onde viu, uma frase sua, um mnemônico">${esc(note || "")}</textarea>
          ${w.custom ? `<button class="btn sm danger" style="margin-top:8px" data-delcustom="${esc(w.id)}">Excluir esta palavra</button>` : ""}`
          : note ? `<p class="muted">Sua anotação: ${esc(note)}</p>` : ""}</div></div>` : ""}</div>`;
  }
  function bindWordRows(root, rerender) {
    $$(".drow-head", root).forEach((h) => {
      const toggle = (e) => {
        if (e.target.closest("button")) return;
        const id = h.parentElement.dataset.wid; DICT.open = DICT.open === id ? null : id; (rerender || route)();
      };
      h.addEventListener("click", toggle);
      h.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(e); } });
    });
  }
  ROUTES.dict = function (arg) {
    if (arg !== DICT.arg) { DICT.arg = arg; if (arg && UNIT[arg]) { DICT.unit = arg; DICT.q = ""; } }
    view.innerHTML = titleRow("Dicionário", `${ALL_WORDS.length + state.custom.length} termos em ${UNITS.length} unidades · ${plural(mineCount(), "salvo", "salvos")} no meu dicionário`,
      `<button class="btn" id="addword">${I("plus")}Nova palavra</button>`) +
      `<div class="toolbar"><input type="search" id="dq" placeholder="Buscar em inglês ou português" value="${esc(DICT.q)}" aria-label="Buscar termo">
      <select id="du" aria-label="Unidade"><option value="">Todas as unidades</option>${UNITS.map((u) => `<option value="${u.id}">${esc(u.title)}</option>`).join("")}<option value="custom">Minhas palavras</option></select>
      <span class="muted" id="dcount" style="align-self:center"></span></div>
      <div class="dhead"><span>Termo</span><span>Tradução</span><span>Unidade</span><span></span></div><div class="dict-list" id="dlist"></div>`;
    $("#du").value = DICT.unit;
    const renderList = () => {
      const q = norm(DICT.q);
      let list = DICT.unit === "custom" ? state.custom : DICT.unit ? UNIT[DICT.unit].words : ALL_WORDS.concat(state.custom);
      if (q) list = list.filter((w) => norm(w.en).includes(q) || norm(w.pt).includes(q) || norm(w.def || "").includes(q));
      if (!DICT.unit) list = list.slice().sort((a, b) => a.en.localeCompare(b.en));
      $("#dcount").textContent = plural(list.length, "termo", "termos");
      const shown = list.slice(0, DICT.limit);
      $("#dlist").innerHTML = list.length ? shown.map((w) => wordRow(w)).join("") + (list.length > shown.length ? `<div class="row" style="padding:16px 4px"><button class="btn sm" id="dmore">Mostrar mais</button><span class="muted num">1–${shown.length} de ${list.length}</span></div>` : "") :
        `<p class="empty-line" style="margin-top:12px">Nenhum termo encontrado para “${esc(DICT.q)}”. <button class="link" id="addq">Adicionar ao meu dicionário</button></p>`;
      bindWordRows($("#dlist"), renderList);
      const aq = $("#addq"); if (aq) aq.addEventListener("click", () => customWordModal({ en: DICT.q }));
      const dm = $("#dmore"); if (dm) dm.addEventListener("click", () => { DICT.limit += 60; renderList(); });
    };
    $("#dq").addEventListener("input", (e) => { DICT.q = e.target.value; DICT.limit = 60; renderList(); });
    $("#du").addEventListener("change", (e) => { DICT.unit = e.target.value; DICT.limit = 60; renderList(); });
    $("#addword").addEventListener("click", () => customWordModal({}));
    renderList();
  };

  function customWordModal(pre) {
    openModal(`<div class="row" style="margin-bottom:8px"><h2 style="font-size:20px">Nova palavra</h2><span class="spacer"></span><button class="icon-btn" data-close aria-label="Fechar">${I("x")}</button></div>
      <p class="muted" style="margin-bottom:20px">Ela entra no seu dicionário e nos seus flashcards.</p>
      <form id="cw"><div class="field"><label for="cw-en">Termo em inglês</label><input type="text" id="cw-en" required value="${esc(pre.en || "")}"></div>
      <div class="field"><label for="cw-pt">Tradução</label><input type="text" id="cw-pt" required value="${esc(pre.pt || "")}"></div>
      <div class="field"><label for="cw-pr">Pronúncia, como se fala (opcional)</label><input type="text" id="cw-pr" value="${esc(pre.pr || "")}"></div>
      <div class="field"><label for="cw-def">Definição em inglês (opcional)</label><input type="text" id="cw-def" value="${esc(pre.def || "")}"></div>
      <div class="field"><label for="cw-ex">Frase de exemplo (opcional)</label><input type="text" id="cw-ex" value="${esc(pre.ex || "")}"></div>
      <div class="row"><span class="spacer"></span><button type="button" class="btn ghost" data-close>Cancelar</button><button class="btn primary" type="submit">Salvar palavra</button></div></form>`, (m) => {
      $("#cw-en", m).focus();
      $("#cw", m).addEventListener("submit", (e) => {
        e.preventDefault();
        const en = $("#cw-en", m).value.trim(), pt = $("#cw-pt", m).value.trim();
        if (!en || !pt) return;
        const w = { id: "my:" + Date.now().toString(36), en, pt, pr: $("#cw-pr", m).value.trim(), def: $("#cw-def", m).value.trim(), ex: $("#cw-ex", m).value.trim(), custom: true, unit: "custom" };
        state.custom.push(w); toggleMine(w.id, true); save(); closeModal(); toast("“" + en + "” foi adicionada ao seu dicionário."); route();
      });
    });
  }

  /* ---------- Meu dicionário ---------- */
  ROUTES.mine = function () {
    const ids = Object.keys(state.mine).filter(getWord).sort((a, b) => state.mine[b].added - state.mine[a].added);
    const withNotes = ids.filter((id) => state.mine[id].note).length;
    const sugg = state.recent.filter((id) => getWord(id) && !isMine(id)).slice(0, 5);
    const words = ids.map(getWord);
    view.innerHTML = titleRow("Meu dicionário", ids.length ? `${plural(ids.length, "palavra salva", "palavras salvas")}${withNotes ? " · " + plural(withNotes, "com anotação", "com anotações") : ""}. Abra uma palavra para escrever suas notas.` : "As palavras em que você tem mais dificuldade, reunidas em um só lugar.",
      `${ids.length ? `<button class="btn primary" id="mp-quiz">Praticar</button><a class="btn" href="#/cards/mine">Flashcards</a>` : ""}<button class="btn" id="addword">${I("plus")}Nova palavra</button>`) +
      `<div class="grid12" style="align-items:start"><div class="s8">${ids.length ? `<div class="dhead"><span>Termo</span><span>Tradução</span><span>Unidade</span><span></span></div><div class="dict-list" id="mlist">${words.map((w) => wordRow(w, { notes: true })).join("")}</div>`
        : `<div class="panel"><div class="panel-head"><h2>Nenhuma palavra salva ainda</h2></div><p class="empty-line">Toque na estrela de qualquer palavra, no dicionário, nas lições ou nos flashcards, ou crie a sua própria palavra.</p>
          <div class="panel-foot"><a class="btn" href="#/dict">Abrir o dicionário</a></div></div>`}</div>
      <div class="s4" style="display:flex;flex-direction:column;gap:16px">
        <div class="panel"><div class="panel-head"><h2>Errou recentemente</h2><span class="chip-count">${sugg.length}</span>${sugg.length ? `<button class="link" id="addsugg">Salvar todas</button>` : ""}</div>
          <div class="rows">${sugg.length ? sugg.map((id) => { const w = getWord(id); return `<div class="rowcard"><span class="main-col"><span class="t">${esc(w.en)}</span><span class="st">${esc(w.pt)}</span></span>${starBtn(id)}</div>`; }).join("")
            : `<p class="empty-line">As palavras que você errar nas lições aparecem aqui como sugestão.</p>`}</div></div>
        <div class="panel"><div class="panel-head"><h2>Exportar</h2></div><div class="rows">
          <button class="rowcard" id="mp-anki" ${ids.length ? "" : "disabled"}><span class="main-col"><span class="t">Anki</span><span class="st">Arquivo de texto para importar no Anki</span></span>${I("save")}</button>
          <button class="rowcard" id="mp-csv" ${ids.length ? "" : "disabled"}><span class="main-col"><span class="t">Planilha CSV</span><span class="st">Abre no Excel ou no Google Planilhas</span></span>${I("save")}</button>
          <button class="rowcard" id="mp-print" ${ids.length ? "" : "disabled"}><span class="main-col"><span class="t">Imprimir</span><span class="st">Tabela com tradução, pronúncia e notas</span></span>${I("chev")}</button></div></div>
      </div></div>`;
    if ($("#mlist")) bindWordRows($("#mlist"));
    $("#addword").addEventListener("click", () => customWordModal({}));
    const q = $("#mp-quiz"); if (q) q.addEventListener("click", () => startPractice("mine"));
    $("#mp-anki").addEventListener("click", () => download("meu-dicionario-anki.txt", words.map((w) => [w.en, `${w.pt}<br><i>${w.def || ""}</i><br>${w.ex || ""}${state.mine[w.id].note ? "<br>Nota: " + state.mine[w.id].note : ""}`].map((x) => x.replace(/[\t\n]/g, " ")).join("\t")).join("\n"), "text/plain"));
    $("#mp-csv").addEventListener("click", () => download("meu-dicionario.csv", "﻿ingles;portugues;pronuncia;definicao;exemplo;anotacoes\n" + words.map((w) => [w.en, w.pt, w.pr, w.def, w.ex, state.mine[w.id].note].map((x) => '"' + String(x || "").replace(/"/g, '""') + '"').join(";")).join("\n"), "text/csv"));
    $("#mp-print").addEventListener("click", () => printList(words));
    const as = $("#addsugg"); if (as) as.addEventListener("click", () => { sugg.forEach((id) => toggleMine(id, true)); toast("Sugestões salvas no seu dicionário."); route(); });
    let t;
    $$("[data-note]").forEach((ta) => ta.addEventListener("input", () => {
      clearTimeout(t); t = setTimeout(() => { if (state.mine[ta.dataset.note]) { state.mine[ta.dataset.note].note = ta.value; save(); } }, 400);
    }));
    $$("[data-delcustom]").forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.delcustom, w = getWord(id);
      if (!confirm("Excluir “" + (w ? w.en : "") + "” do seu dicionário? A palavra e a anotação serão apagadas.")) return;
      state.custom = state.custom.filter((c) => c.id !== id); delete state.mine[id]; delete state.srs[id]; save(); route();
    }));
  };
  function download(name, text, type) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: type + ";charset=utf-8" })); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function printList(words) {
    const w = window.open("", "_blank"); if (!w) { toast("Permita pop-ups para imprimir."); return; }
    w.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>Meu dicionário</title><style>body{font-family:system-ui,sans-serif;padding:24px;color:#1f201d}table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #e5e5e5;padding:8px;text-align:left;vertical-align:top}th{color:#636361;font-weight:400}</style></head><body>
      <h1>Meu dicionário de inglês médico</h1><table><tr><th>Inglês</th><th>Português</th><th>Pronúncia</th><th>Exemplo</th><th>Anotações</th></tr>
      ${words.map((x) => `<tr><td><b>${esc(x.en)}</b></td><td>${esc(x.pt)}</td><td>${esc(x.pr || "")}</td><td>${esc(x.ex || "")}</td><td>${esc(state.mine[x.id].note || "")}</td></tr>`).join("")}</table></body></html>`);
    w.document.close(); w.focus(); w.print();
  }

  /* ---------- Casos clínicos ---------- */
  ROUTES.cases = function () {
    const solved = CASES.filter((c) => state.cases[c.id]).length;
    view.innerHTML = titleRow("Casos clínicos", `${CASES.length} casos curtos em inglês simples para treinar leitura · ${plural(solved, "resolvido", "resolvidos")}`) +
      `<div class="panel"><div class="rows">${CASES.map((c) => `<a class="rowcard" href="#/case/${c.id}">
        <span class="main-col"><span class="t">${esc(c.title)}</span><span class="st">${esc(c.text.split(". ")[0])}.</span></span>
        <span class="fig hide-sm">${UNIT[c.topic] ? esc(UNIT[c.topic].title) : ""}</span><span class="pill">${esc(c.level)}</span>
        <span class="status" style="width:84px;display:flex;justify-content:flex-end">${state.cases[c.id] ? '<span class="pill pos">Resolvido</span>' : ""}</span>${I("chev")}</a>`).join("")}</div></div>`;
  };
  ROUTES.case = function (id) {
    const c = CASES.find((x) => x.id === id); if (!c) { location.hash = "#/cases"; return; }
    let text = esc(c.text);
    Object.keys(c.glossary).sort((a, b) => b.length - a.length).forEach((term) => {
      text = text.replace(new RegExp("\\b(" + reRx(esc(term)) + ")\\b", "i"), `<span class="gloss" tabindex="0" data-gloss="${esc(term)}" title="${esc(c.glossary[term])}">$1</span>`);
    });
    view.innerHTML = backLink("#/cases", "Casos clínicos") + titleRow(esc(c.title), `${esc(c.level)} · ${UNIT[c.topic] ? esc(UNIT[c.topic].title) : ""}${state.cases[c.id] ? " · resolvido" : ""}`,
      `<button class="btn primary" id="case-go">Responder ${plural(c.questions.length, "pergunta", "perguntas")}</button>`) +
      `<div class="grid12"><div class="panel s8"><div class="panel-head"><h2>O caso</h2><span class="spacer"></span>${speakBtn(c.text, "Ouvir o caso")}<button class="btn sm" data-speak="${esc(c.text)}" data-rate="0.7">Ouvir devagar</button></div>
        <p class="case-text">${text}</p><p class="muted" style="margin-top:16px">Toque nas palavras sublinhadas para ver a tradução e ouvir a pronúncia.</p></div>
      <div class="panel s4"><div class="panel-head"><h2>Glossário</h2><span class="chip-count">${Object.keys(c.glossary).length}</span></div><div class="rows">
        ${Object.keys(c.glossary).map((t) => `<div class="rowcard">${speakBtn(t)}<span class="main-col"><span class="t">${esc(t)}</span><span class="st">${esc(c.glossary[t])}</span></span>
          <button class="icon-btn star ${state.custom.some((x) => norm(x.en) === norm(t) && isMine(x.id)) ? "on" : ""}" data-addgloss="${esc(t)}" aria-label="Salvar no meu dicionário">${I("star")}</button></div>`).join("")}</div></div></div>`;
    $$("[data-gloss]").forEach((g) => {
      const show = () => { toast(g.dataset.gloss + ": " + c.glossary[g.dataset.gloss]); speak(g.dataset.gloss); };
      g.addEventListener("click", show); g.addEventListener("keydown", (e) => { if (e.key === "Enter") show(); });
    });
    $$("[data-addgloss]").forEach((b) => b.addEventListener("click", () => {
      const term = b.dataset.addgloss;
      let w = state.custom.find((x) => norm(x.en) === norm(term));
      if (!w) {
        const sentence = c.text.split(/(?<=\.)\s+/).find((s) => s.toLowerCase().includes(term.toLowerCase())) || "";
        w = { id: "my:" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), en: term, pt: c.glossary[term], pr: "", def: "", ex: sentence, custom: true, unit: "custom" };
        state.custom.push(w);
      }
      toggleMine(w.id, true); save(); b.classList.add("on"); toast("“" + term + "” foi salva no seu dicionário.");
    }));
    $("#case-go").addEventListener("click", () => {
      const reading = { title: c.title, text: c.text, questions: c.questions };
      startSession({
        title: c.title, exercises: reading.questions.map((q) => makeEx("rq", null, { reading, q })), mode: "case", xpBase: 10,
        onFinish: () => { state.cases[c.id] = true; save(); checkBadges(); return { title: "Caso resolvido", message: "Boa leitura. Salve as palavras novas do glossário no seu dicionário." }; }
      });
    });
  };

  /* ---------- Conquistas: [id, nome, descrição, valor atual, alvo] ---------- */
  const unitsDoneCount = (sec) => UNITS.filter((u) => (!sec || u.section === sec) && unitComplete(u.id)).length;
  const BADGES = [
    ["first", "Primeira lição", "Conclua uma lição", () => state.stats.lessons, 1],
    ["perfect", "Perfeccionista", "Uma lição sem nenhum erro", () => state.stats.perfect, 1],
    ["save1", "Primeira palavra salva", "Salve uma palavra no meu dicionário", () => mineCount(), 1],
    ["streak3", "Aquecendo", "3 dias seguidos de estudo", () => state.bestStreak, 3],
    ["streak7", "Plantão semanal", "7 dias seguidos de estudo", () => state.bestStreak, 7],
    ["streak30", "Residente dedicado", "30 dias seguidos de estudo", () => state.bestStreak, 30],
    ["xp100", "100 XP", "Some 100 XP", () => state.xp, 100],
    ["xp500", "500 XP", "Some 500 XP", () => state.xp, 500],
    ["xp1500", "1.500 XP", "Some 1.500 XP", () => state.xp, 1500],
    ["words50", "50 palavras", "Pratique 50 termos", () => learnedIds().length, 50],
    ["words150", "150 palavras", "Pratique 150 termos", () => learnedIds().length, 150],
    ["wordsall", "Enciclopédia", "Pratique todos os " + ALL_WORDS.length + " termos", () => learnedIds().filter((id) => WORDS[id]).length, ALL_WORDS.length],
    ["mine10", "Colecionador", "10 palavras no meu dicionário", () => mineCount(), 10],
    ["unit1", "Unidade dominada", "Conclua o desafio de uma unidade", () => unitsDoneCount(), 1],
    ["section1", "Fundamentos", "Conclua as 5 unidades de Fundamentos", () => unitsDoneCount("s1"), 5],
    ["allunits", "Formado(a)", "Conclua as " + UNITS.length + " unidades", () => unitsDoneCount(), UNITS.length],
    ["case3", "Detetive clínico", "Resolva 3 casos clínicos", () => Object.keys(state.cases).length, 3],
    ["timed20", "Rápido no gatilho", "20 acertos no contra o relógio", () => state.stats.timedBest, 20],
    ["speak10", "Boa pronúncia", "10 pronúncias corretas", () => state.stats.speakOk, 10],
    ["cards100", "Maratona de cards", "Revise 100 flashcards", () => state.stats.cards, 100]
  ];
  function checkBadges() {
    BADGES.forEach(([id, name, , cur, target]) => {
      if (!state.badges[id] && cur() >= target) { state.badges[id] = Date.now(); save(); setTimeout(() => toast("Conquista desbloqueada: " + name + "."), 900); }
    });
  }

  /* ---------- Progresso ---------- */
  ROUTES.profile = function () {
    const lv = levelOf(state.xp), lo = xpForLevel(lv), hi = xpForLevel(lv + 1);
    const acc = state.stats.answers ? Math.round((state.stats.correct / state.stats.answers) * 100) : null;
    const learned = learnedIds().length, units = unitsDoneCount(), solved = Object.keys(state.cases).length;
    const got = BADGES.filter(([id]) => state.badges[id]).length;
    const days = []; for (let i = -13; i <= 0; i++) days.push(dayStr(i));
    const bar = (v, max, a, b) => `<div class="bar"><div style="width:${max ? Math.min(100, (v / max) * 100) : 0}%"></div></div><div class="bar-ends"><span>${a}</span><span>${b}</span></div>`;
    view.innerHTML = titleRow("Progresso", `Nível ${lv}, ${titleOf(lv)} · faltam ${hi - state.xp} XP para o nível ${lv + 1}`) +
      `<div class="kpis">
        <div><div class="label">XP total</div><div class="value">${state.xp.toLocaleString("pt-BR")}</div><div class="cap">${todayXP()} XP hoje</div></div>
        <div><div class="label">Ofensiva</div><div class="value">${currentStreak()}<small> ${currentStreak() === 1 ? "dia" : "dias"}</small></div><div class="cap">Recorde: ${plural(state.bestStreak, "dia", "dias")}</div></div>
        <div><div class="label">Palavras praticadas</div><div class="value">${learned}<small> de ${ALL_WORDS.length}</small></div><div class="cap">${plural(mineCount(), "salva", "salvas")} no meu dicionário</div></div>
        <div><div class="label">Precisão</div><div class="value">${acc == null ? '<span class="muted">–</span>' : acc + "%"}</div><div class="cap">${plural(state.stats.answers, "resposta", "respostas")}</div></div></div>
      <div class="grid12" style="margin-top:16px">
        <div class="panel s8"><div class="panel-head"><h2>XP por dia nas últimas duas semanas</h2><span class="spacer"></span><span class="muted">Meta diária: ${state.settings.goal} XP</span></div><div class="chart" id="xp-chart"></div></div>
        <div class="panel s4"><div class="panel-head"><h2>Rumo à formatura</h2></div>
          <p style="margin-bottom:8px">Nível ${lv}, ${titleOf(lv)}</p>${bar(state.xp - lo, hi - lo, lo + " XP", hi + " XP")}
          <p style="margin:20px 0 8px">Unidades concluídas: ${units} de ${UNITS.length} <span class="muted">(${stepsDoneTotal()} etapas)</span></p>${bar(units, UNITS.length, "0", String(UNITS.length))}
          <p style="margin:20px 0 8px">Casos clínicos resolvidos: ${solved} de ${CASES.length}</p>${bar(solved, CASES.length, "0", String(CASES.length))}</div>
      </div>
      <div class="section-gap section-title"><h2 style="font-size:20px;line-height:28px">Conquistas</h2><p class="num">${got} de ${BADGES.length}</p></div>
      <div class="badge-grid">${BADGES.map(([id, name, desc, cur, target]) => {
        const at = state.badges[id];
        return `<div class="rowcard ${at ? "" : "locked"}"><span class="main-col"><span class="t">${name}</span><span class="st">${desc}</span></span>
          ${at ? `<span class="pill pos">${new Date(at).toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}</span>` : `<span class="fig">${Math.min(cur(), target).toLocaleString("pt-BR")} de ${target.toLocaleString("pt-BR")}</span>`}</div>`;
      }).join("")}</div>`;
    const values = days.map((d) => state.daily[d] || 0);
    const labels = days.map((d) => { const [, m, dd] = d.split("-"); return Number(dd) + "/" + Number(m); });
    if (window.Charts) Charts.bars($("#xp-chart"), { labels, values, highlight: values.length - 1, reference: { value: state.settings.goal, label: "Meta" }, format: (v) => v + " XP", tickFormat: (v) => String(v), height: 220 });
  };

  /* ---------- Ajustes ---------- */
  ROUTES.settings = function () {
    const s = state.settings;
    const sel = (id, opts, val) => `<select id="${id}">${opts.map(([v, l]) => `<option value="${v}" ${String(v) === String(val) ? "selected" : ""}>${l}</option>`).join("")}</select>`;
    const sw = (id, val, label) => `<label class="switch"><input type="checkbox" id="${id}" ${val ? "checked" : ""} aria-label="${esc(label)}"><span></span></label>`;
    const row = (title, desc, control) => `<div class="set-row"><div class="lbl"><b>${title}</b>${desc ? `<span>${desc}</span>` : ""}</div>${control}</div>`;
    const sec = (key, title, desc, body) => `<section class="set-sec"><div><h2>${title}</h2><p>${desc}</p><p class="saved" id="saved-${key}">Salvo</p></div><div class="set-panel">${body}</div></section>`;
    view.innerHTML = titleRow("Ajustes", `${esc(state.name || "Sem nome")} · meta diária de ${s.goal} XP · áudio em inglês ${s.accent === "en-US" ? "americano" : "britânico"}`) +
      sec("perfil", "Perfil", "Como o app chama você e quanto estudar por dia.",
        row("Seu nome", "Aparece na saudação da tela inicial", `<input type="text" id="st-name" value="${esc(state.name)}" aria-label="Seu nome">`) +
        row("Meta diária", "A ofensiva conta os dias em que você ganha XP", sel("st-goal", [[10, "10 XP, cerca de 5 min"], [20, "20 XP, cerca de 10 min"], [30, "30 XP, cerca de 15 min"], [50, "50 XP, cerca de 25 min"]], s.goal))) +
      sec("audio", "Áudio", "A voz que lê as palavras, as frases e os casos clínicos.",
        row("Sotaque", "", sel("st-accent", [["en-US", "Inglês americano"], ["en-GB", "Inglês britânico"]], s.accent)) +
        row("Velocidade", "", sel("st-rate", [[0.7, "Lenta"], [0.9, "Normal"], [1.05, "Rápida"]], s.rate)) +
        row("Tocar o áudio automaticamente", "Em cada palavra nova e em cada flashcard", sw("st-auto", s.autoplay, "Tocar o áudio automaticamente")) +
        row("Guia de pronúncia", "Mostra como se fala, por exemplo /Rós-pi-ral/", sw("st-pron", s.pron, "Guia de pronúncia")) +
        row("Testar a voz", "“Take a deep breath and hold it.”", `<button class="btn sm" id="st-test">${I("speaker")}Ouvir</button>`)) +
      sec("ex", "Exercícios", "O que aparece nas lições e quais unidades estão abertas.",
        row("Efeitos sonoros", "Um som curto ao acertar e ao errar", sw("st-sfx", s.sfx, "Efeitos sonoros")) +
        row("Exercícios de fala", SR ? "Usa o microfone para conferir a pronúncia" : "Este navegador não tem reconhecimento de voz; use o Chrome ou o Edge", sw("st-speech", s.speech, "Exercícios de fala")) +
        row("Modo livre", "Desbloqueia todas as unidades, para quem já tem base", sw("st-free", s.free, "Modo livre"))) +
      sec("look", "Aparência", "Claro, escuro, ou acompanhar o sistema.",
        row("Tema", "", `<div class="seg" role="group" aria-label="Tema">${[["auto", "Automático"], ["light", "Claro"], ["dark", "Escuro"]].map(([v, l]) => `<button data-theme-opt="${v}" class="${s.theme === v ? "on" : ""}" aria-pressed="${s.theme === v}">${l}</button>`).join("")}</div>`)) +
      sec("dados", "Seus dados", "O progresso fica salvo só neste navegador.",
        row("Cópia do progresso", state.lastBackup ? "Último backup em " + new Date(state.lastBackup).toLocaleString("pt-BR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "Você ainda não fez nenhuma cópia",
          `<button class="btn sm" data-backup>Salvar e transferir</button>`)) +
      sec("reset", "Apagar progresso", "Apaga XP, lições, flashcards, o meu dicionário e as anotações deste navegador. Não dá para desfazer.",
        row("Apagar tudo", "Faça uma cópia antes, se quiser guardar", `<button class="btn sm danger" id="bk-reset">Apagar todo o progresso</button>`));
    const stamp = (key) => { const el = $("#saved-" + key); if (!el) return; el.classList.add("show"); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("show"), 1400); };
    const bind = (id, key, fn) => $("#" + id).addEventListener("change", (e) => { fn(e.target); save(); applyTheme(); renderShell(); stamp(key); });
    $("#st-name").addEventListener("input", (e) => { state.name = e.target.value.trim(); save(); renderShell(); stamp("perfil"); });
    bind("st-goal", "perfil", (t) => (s.goal = Number(t.value)));
    bind("st-accent", "audio", (t) => { s.accent = t.value; speak("Welcome to medical English"); });
    bind("st-rate", "audio", (t) => { s.rate = Number(t.value); speak("Take a deep breath"); });
    bind("st-auto", "audio", (t) => (s.autoplay = t.checked));
    bind("st-pron", "audio", (t) => (s.pron = t.checked));
    bind("st-sfx", "ex", (t) => (s.sfx = t.checked));
    bind("st-speech", "ex", (t) => (s.speech = t.checked));
    bind("st-free", "ex", (t) => (s.free = t.checked));
    $("#st-test").addEventListener("click", () => speak("Take a deep breath and hold it."));
    $$("[data-theme-opt]").forEach((b) => b.addEventListener("click", () => {
      s.theme = b.dataset.themeOpt; save(); applyTheme(); stamp("look");
      $$("[data-theme-opt]").forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); });
    }));
    $("#bk-reset").addEventListener("click", () => {
      if (!confirm("Apagar todo o progresso deste navegador, inclusive o meu dicionário e as anotações? Não dá para desfazer.")) return;
      state = JSON.parse(JSON.stringify(DEFAULTS)); save(); applyTheme(); location.hash = "#/learn"; route();
    });
  };

  /* ---------- Salvar / transferir dados ---------- */
  // Formato do arquivo: { app, version, exportedAt, data }. Também aceita backups antigos (o estado puro).
  function backupPackage() { return { app: "inglesmedico", version: 1, exportedAt: new Date().toISOString(), data: state }; }
  function markBackup() { state.lastBackup = Date.now(); save(); }
  const b64url = (bytes) => { let bin = ""; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
  const unb64url = (str) => { const bin = atob(str.replace(/-/g, "+").replace(/_/g, "/")); const out = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; };
  // Código compacto: "z" + gzip em base64url (ou "j" + JSON em base64url se o navegador não tiver compressão)
  async function encodeCode(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    if (window.CompressionStream) {
      const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream("gzip"));
      return "z" + b64url(new Uint8Array(await new Response(stream).arrayBuffer()));
    }
    return "j" + b64url(bytes);
  }
  async function decodeAny(text) {
    let t = String(text || "").trim();
    if (!t) throw new Error("vazio");
    if (t[0] === "{") return JSON.parse(t);
    const m = t.match(/#\/import\/([A-Za-z0-9_-]+)/); if (m) t = m[1];
    const kind = t[0], bytes = unb64url(t.slice(1));
    if (kind === "z") {
      if (!window.DecompressionStream) throw new Error("Navegador sem suporte a descompressão");
      const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
      return JSON.parse(await new Response(stream).text());
    }
    if (kind === "j") return JSON.parse(new TextDecoder().decode(bytes));
    throw new Error("formato desconhecido");
  }
  function unpack(obj) {
    const d = obj && typeof obj === "object" && obj.data && typeof obj.data === "object" ? obj.data : obj;
    if (!d || typeof d !== "object" || typeof d.xp !== "number" || typeof d.srs !== "object") throw new Error("dados inválidos");
    return { data: d, exportedAt: obj.exportedAt || null };
  }
  // Mescla dois progressos sem perder nada: fica com o melhor de cada um.
  function mergeStates(a, b) {
    const m = JSON.parse(JSON.stringify(a)), max = Math.max;
    m.name = a.name || b.name;
    m.daily = Object.assign({}, a.daily); Object.entries(b.daily || {}).forEach(([d, x]) => { m.daily[d] = max(m.daily[d] || 0, x); });
    m.xp = max(a.xp, b.xp || 0, Object.values(m.daily).reduce((s, x) => s + x, 0));
    if ((b.lastDay || "") > (a.lastDay || "")) { m.lastDay = b.lastDay; m.streak = b.streak; }
    else if (b.lastDay === a.lastDay) m.streak = max(a.streak, b.streak || 0);
    m.bestStreak = max(a.bestStreak || 0, b.bestStreak || 0);
    m.units = Object.assign({}, a.units); Object.entries(b.units || {}).forEach(([u, d]) => { m.units[u] = Array.from(new Set((m.units[u] || []).concat(d))); });
    m.srs = Object.assign({}, a.srs); Object.entries(b.srs || {}).forEach(([id, x]) => { if (!m.srs[id] || (x.seen || 0) > (m.srs[id].seen || 0)) m.srs[id] = x; });
    m.mine = Object.assign({}, b.mine, a.mine); Object.keys(m.mine).forEach((id) => { if (a.mine[id] && b.mine && b.mine[id] && !a.mine[id].note) m.mine[id] = b.mine[id]; });
    m.custom = a.custom.concat((b.custom || []).filter((c) => !a.custom.some((x) => x.id === c.id)));
    m.mistakes = Object.assign({}, a.mistakes); Object.entries(b.mistakes || {}).forEach(([id, n]) => { m.mistakes[id] = max(m.mistakes[id] || 0, n); });
    m.recent = Array.from(new Set(a.recent.concat(b.recent || []))).slice(0, 40);
    m.cases = Object.assign({}, b.cases, a.cases);
    m.badges = Object.assign({}, b.badges, a.badges);
    Object.keys(m.stats).forEach((k) => { m.stats[k] = max(a.stats[k] || 0, (b.stats || {})[k] || 0); });
    m.onboarded = true;
    return m;
  }
  function summary(d) {
    const learned = Object.values(d.srs || {}).filter((x) => x.seen > 0).length;
    return `<div class="kv"><div><span>XP</span><b>${d.xp}</b></div><div><span>Palavras praticadas</span><b>${learned}</b></div>
      <div><span>No meu dicionário</span><b>${Object.keys(d.mine || {}).length}</b></div><div><span>Etapas concluídas</span><b>${Object.values(d.units || {}).reduce((s, u) => s + u.length, 0)}</b></div></div>`;
  }
  function applyImport(data, mode) {
    const base = JSON.parse(JSON.stringify(DEFAULTS));
    const incoming = Object.assign(base, data, { stats: Object.assign(base.stats, data.stats || {}), settings: Object.assign(base.settings, data.settings || {}) });
    state = mode === "merge" ? mergeStates(state, incoming) : incoming;
    state.onboarded = true; save(); applyTheme(); renderShell();
    toast(mode === "merge" ? "Progresso mesclado." : "Progresso carregado.");
  }
  function confirmImport(text, after) {
    decodeAny(text).then(unpack).then(({ data, exportedAt }) => {
      const hasLocal = state.xp > 0 || Object.keys(state.mine).length > 0;
      openModal(`<div class="row" style="margin-bottom:16px"><h2 style="font-size:20px">Carregar progresso</h2><span class="spacer"></span><button class="icon-btn" data-close aria-label="Fechar">${I("x")}</button></div>
        <div class="panel"><div class="panel-head"><h3>Dados encontrados${data.name ? ", " + esc(data.name) : ""}</h3></div>${exportedAt ? `<p class="muted" style="margin:-8px 0 8px">Salvos em ${new Date(exportedAt).toLocaleString("pt-BR")}</p>` : ""}${summary(data)}</div>
        ${hasLocal ? `<div class="panel"><div class="panel-head"><h3>Progresso atual deste navegador</h3></div>${summary(state)}</div>
          <p style="margin:16px 0">Mesclar junta os dois e fica com o melhor de cada um. Substituir apaga o progresso deste navegador.</p>` : '<div style="height:16px"></div>'}
        <div class="row"><span class="spacer"></span><button class="btn ghost" data-close>Cancelar</button>
        ${hasLocal ? `<button class="btn" id="imp-replace">Substituir</button><button class="btn primary" id="imp-merge">Mesclar</button>` : `<button class="btn primary" id="imp-replace">Carregar</button>`}</div>`, (mm) => {
        $("#imp-replace", mm).addEventListener("click", () => { applyImport(data, "replace"); closeModal(); if (after) after(true); else route(); });
        const mg = $("#imp-merge", mm); if (mg) mg.addEventListener("click", () => { applyImport(data, "merge"); closeModal(); if (after) after(true); else route(); });
        $$("[data-close]", mm).forEach((b) => b.addEventListener("click", () => { if (after) setTimeout(() => after(false), 0); }));
      });
    }).catch(() => { toast("Não foi possível ler os dados. Verifique o arquivo, o link ou o código."); if (after) after(false); });
  }
  async function copyText(text, okMsg) {
    try { await navigator.clipboard.writeText(text); toast(okMsg); return true; }
    catch (e) { return false; }
  }
  function backupModal() {
    openModal(`<div class="row" style="margin-bottom:8px"><h2 style="font-size:20px">Salvar e transferir progresso</h2><span class="spacer"></span><button class="icon-btn" data-close aria-label="Fechar">${I("x")}</button></div>
      <p class="muted" style="margin-bottom:16px">XP, lições, flashcards, o meu dicionário e as anotações ficam só neste navegador. Leve-os para outro navegador ou aparelho de uma destas formas.</p>
      <div class="panel"><div class="panel-head"><h3>Arquivo JSON</h3></div><p class="muted" style="margin-bottom:12px">Baixe o arquivo e carregue-o no outro navegador. Serve também como backup no Drive ou no e-mail.</p>
        <div class="row wrap"><button class="btn sm primary" id="bk-file">${I("save")}Baixar arquivo .json</button><label class="btn sm" for="bk-load">Carregar arquivo</label><input type="file" id="bk-load" accept=".json,application/json" hidden></div></div>
      <div class="panel"><div class="panel-head"><h3>Link de transferência</h3></div><p class="muted" style="margin-bottom:12px">Copie o link e abra-o no outro navegador; mande-o para você pelo WhatsApp ou pelo e-mail. Os dados vão dentro do próprio link e nada passa por um servidor.</p>
        <div class="row wrap"><button class="btn sm primary" id="bk-link">${I("link")}Copiar link</button><button class="btn sm" id="bk-code">Copiar código</button></div>
        <textarea id="bk-out" rows="3" readonly hidden style="margin-top:12px;font-size:12px" aria-label="Link ou código gerado"></textarea></div>
      <div class="panel"><div class="panel-head"><h3>Colar código ou link</h3></div>
        <textarea id="bk-in" rows="3" placeholder="Cole aqui o código, o link ou o JSON" style="font-size:13px" aria-label="Código, link ou JSON"></textarea>
        <div class="row" style="margin-top:12px"><span class="spacer"></span><button class="btn sm primary" id="bk-paste">Carregar</button></div></div>`, (m) => {
      $("#bk-file", m).addEventListener("click", () => {
        download("ingles-medico-" + (state.name ? slug(state.name) + "-" : "") + dayStr() + ".json", JSON.stringify(backupPackage(), null, 1), "application/json");
        markBackup(); toast("Arquivo salvo. Guarde-o em um lugar seguro.");
      });
      $("#bk-load", m).addEventListener("change", (e) => { const f = e.target.files[0]; if (f) f.text().then((t) => confirmImport(t)); });
      const show = (text) => { const o = $("#bk-out", m); o.hidden = false; o.value = text; o.focus(); o.select(); };
      $("#bk-link", m).addEventListener("click", async () => {
        const link = location.href.split("#")[0] + "#/import/" + await encodeCode(backupPackage());
        markBackup(); show(link);
        if (!(await copyText(link, "Link copiado. Abra-o no outro navegador."))) toast("Copie o link selecionado abaixo.");
      });
      $("#bk-code", m).addEventListener("click", async () => {
        const code = await encodeCode(backupPackage());
        markBackup(); show(code);
        if (!(await copyText(code, "Código copiado. Cole-o no outro navegador."))) toast("Copie o código selecionado abaixo.");
      });
      $("#bk-paste", m).addEventListener("click", () => confirmImport($("#bk-in", m).value));
    });
  }
  ROUTES.import = function (code) {
    history.replaceState(null, "", location.pathname + location.search + "#/learn");
    ROUTES.learn();
    if (code) confirmImport(code, () => route());
  };

  /* ---------- Recursos ---------- */
  ROUTES.resources = function () {
    view.innerHTML = titleRow("Recursos e fontes", "As unidades de anatomia e radiografia partem dos materiais de Inglês Médico; o restante foi ampliado com fontes oficiais como MedlinePlus (NIH/NLM), OMS, CDC e American Heart Association.") +
      `<div class="panel"><div style="columns:2 320px;column-gap:40px">${RESOURCES.map((g) => `<div style="break-inside:avoid;margin-bottom:24px"><h2 style="margin-bottom:8px">${esc(g.group)}</h2>
        ${g.items.map(([n, url, d]) => `<div style="padding:8px 0;border-bottom:1px solid var(--border)">${url ? `<a class="link" href="${esc(url)}" target="_blank" rel="noopener">${esc(n)}</a>` : `<b style="font-weight:500">${esc(n)}</b>`}<div class="muted">${esc(d)}</div></div>`).join("")}</div>`).join("")}</div></div>
      <div class="panel" style="margin-top:16px"><div class="panel-head"><h2>Como estudar</h2></div><div class="prose" style="columns:2 320px;column-gap:40px"><ul>
        <li><b>Escute</b> a pronúncia e leia o guia de como se fala.</li>
        <li><b>Fale</b> em voz alta; grave sua voz e compare.</li>
        <li><b>Imite</b> os falantes nativos: a posição da língua e dos lábios.</li>
        <li><b>Escreva</b> as palavras novas várias vezes.</li>
        <li><b>Revise</b> todo dia: a repetição espaçada faz o trabalho pesado.</li>
        <li>Leve o vocabulário para o <b>dia a dia</b>: pense em inglês durante o plantão.</li>
        <li>Faça um <b>teste de nivelamento</b> (British Council ou Cambridge) para saber seu nível no CEFR, de A1 a C2.</li></ul></div></div>`;
  };

  /* ======================= Início ======================= */
  document.addEventListener("click", (e) => { if (e.target.closest("[data-backup]")) backupModal(); });
  applyTheme();
  checkBadges();
  route();
})();
