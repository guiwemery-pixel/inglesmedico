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

  function dayStr(offset = 0) {
    const d = new Date(); d.setDate(d.getDate() + offset);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function addDays(str, n) {
    const [y, m, d] = str.split("-").map(Number); const dt = new Date(y, m - 1, d + n);
    return dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0") + "-" + String(dt.getDate()).padStart(2, "0");
  }

  /* ======================= Conteúdo ======================= */
  const WORDS = {};
  UNITS.forEach((u) => u.words.forEach((w) => { w.id = u.id + ":" + slug(w.en); w.unit = u.id; WORDS[w.id] = w; }));
  const UNIT = Object.fromEntries(UNITS.map((u) => [u.id, u]));
  const ALL_WORDS = Object.values(WORDS);

  const STEPS = [
    { key: "l1", icon: "📘", name: "Lição 1", desc: "Primeiras palavras" },
    { key: "l2", icon: "📗", name: "Lição 2", desc: "Mais vocabulário" },
    { key: "l3", icon: "🧩", name: "Lição 3", desc: "Frases, lacunas e revisão" },
    { key: "read", icon: "📰", name: "Leitura", desc: "Texto em inglês + compreensão" },
    { key: "test", icon: "🏆", name: "Desafio da unidade", desc: "Escrita, ditado e frases (70% para passar)" }
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
    if (before < state.settings.goal && state.daily[t] >= state.settings.goal) toast("🎯 Meta diária concluída! Ofensiva: " + state.streak + " 🔥");
    if (levelOf(state.xp) > lvBefore) toast("🎓 Novo nível: " + levelOf(state.xp) + " — " + titleOf(levelOf(state.xp)));
    checkBadges();
    renderTopbar();
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
  const stepUnlocked = (uid, i) => state.settings.free || i === 0 || stepDone(uid, i - 1);
  const unitComplete = (uid) => STEPS.every((_, i) => stepDone(uid, i));

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

  function applyTheme() {
    const t = state.settings.theme;
    if (t === "auto") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme", t);
  }

  function renderTopbar() {
    $("#tb-streak").textContent = currentStreak();
    $("#tb-xp").textContent = state.xp;
    $("#tb-level").textContent = levelOf(state.xp);
    const g = state.settings.goal, x = todayXP();
    $("#tb-goal-fill").style.width = Math.min(100, (x / g) * 100) + "%";
    $("#tb-goal-text").textContent = Math.min(x, g) + "/" + g + " XP";
  }

  const starBtn = (id) => `<button class="icon-btn star ${isMine(id) ? "on" : ""}" data-star="${esc(id)}" title="Meu dicionário" aria-label="Adicionar ao meu dicionário">★</button>`;
  const speakBtn = (text, label) => `<button class="icon-btn" data-speak="${esc(text)}" aria-label="${label || "Ouvir"}" title="Ouvir">🔊</button>`;

  // Delegação global para estrela e áudio
  document.addEventListener("click", (e) => {
    const s = e.target.closest("[data-star]");
    if (s) {
      e.stopPropagation();
      const on = toggleMine(s.dataset.star);
      $$(`[data-star="${CSS.escape(s.dataset.star)}"]`).forEach((b) => b.classList.toggle("on", on));
      toast(on ? "⭐ Salva no seu dicionário" : "Removida do seu dicionário");
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

  // Cria um exercício. Cada exercício tem: type, word (opcional), render(body), check(answer), solution (texto)
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
      case "match": {
        const ws = extra.words.slice(0, 5);
        return { type, words: ws, label: "Toque nos pares correspondentes", solution: "" };
      }
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
        $("#pl-extra").innerHTML = `<span class="timer">⏱ ${left}s</span>`;
        if (left <= 0) finishSession();
      }, 250);
    } else $("#pl-extra").textContent = "";
    renderEx();
  }

  function closePlayer() {
    clearInterval(P.timer); P.timer = null;
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    $("#player").hidden = true; document.body.style.overflow = "";
    renderTopbar(); route();
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

  const RENDER = {
    mc_en(e, body) {
      body.innerHTML = `<div class="q-label">${e.label} ${isNew(e.word) ? '<span class="tag new">Nova palavra</span>' : ""}</div>
        <div class="q-prompt">${speakBtn(e.word.en)}<span>${esc(e.word.en)}</span></div>${pronHtml(e.word)}<div style="height:12px"></div>
        ${optionsHtml(e.opts)}`;
      bindOptions(body);
    },
    mc_pt(e, body) {
      body.innerHTML = `<div class="q-label">${e.label}</div><div class="q-prompt">${esc(e.word.pt)}</div>${optionsHtml(e.opts, "two")}`;
      bindOptions(body);
    },
    listen(e, body) {
      body.innerHTML = `<div class="q-label">${e.label}</div>
        <div class="row"><button class="big-speaker" data-speak="${esc(e.word.en)}" aria-label="Ouvir">🔊</button>
        <button class="btn small slow-btn" data-speak="${esc(e.word.en)}" data-rate="0.55">🐢 Devagar</button></div>${optionsHtml(e.opts, "two")}`;
      bindOptions(body);
    },
    def(e, body) {
      body.innerHTML = `<div class="q-label">${e.label}</div><div class="q-prompt" style="font-size:1.25rem">“${esc(e.word.def)}”</div>${optionsHtml(e.opts, "two")}`;
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
        <input type="text" id="typed" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Digite em inglês…">`;
      const inp = $("#typed"); inp.focus();
      inp.addEventListener("input", () => setAnswer(inp.value.trim()));
    },
    dictation(e, body) {
      body.innerHTML = `<div class="q-label">${e.label}</div>
        <div class="row"><button class="big-speaker" data-speak="${esc(e.word.en)}" aria-label="Ouvir">🔊</button>
        <button class="btn small slow-btn" data-speak="${esc(e.word.en)}" data-rate="0.55">🐢 Devagar</button></div>
        <input type="text" id="typed" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Escreva o que ouviu…">`;
      const inp = $("#typed"); inp.focus();
      inp.addEventListener("input", () => setAnswer(inp.value.trim()));
    },
    order(e, body) {
      body.innerHTML = `<div class="q-label">${e.label}</div>
        <div class="row" style="margin-bottom:8px">${speakBtn(e.word.ex, "Ouvir a frase")}<span class="muted small">Palavra-chave: <b>${esc(e.word.en)}</b> = ${esc(e.word.pt)}</span></div>
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
        <div style="text-align:center;margin-top:24px"><button class="mic-btn" id="mic" aria-label="Gravar">🎤</button>
        <p class="muted small" id="heard" style="margin-top:12px">Toque no microfone e diga a palavra.</p></div>`;
      $("#mic").addEventListener("click", () => {
        let rec; try { rec = new SR(); } catch (err) { toast("Reconhecimento de voz indisponível."); return; }
        rec.lang = state.settings.accent; rec.maxAlternatives = 5; rec.interimResults = false;
        $("#mic").classList.add("rec"); $("#heard").textContent = "Ouvindo…";
        rec.onresult = (ev) => {
          const alts = Array.from(ev.results[0]).map((r) => r.transcript);
          e.heard = alts; $("#heard").textContent = "Você disse: “" + alts[0] + "”";
          setAnswer(alts[0]); doCheck();
        };
        rec.onerror = () => { $("#heard").textContent = "Não consegui ouvir. Tente de novo (verifique a permissão do microfone)."; };
        rec.onend = () => $("#mic") && $("#mic").classList.remove("rec");
        rec.start();
      });
    },
    read(e, body) {
      const r = e.reading;
      body.innerHTML = `<div class="q-label">${e.label}</div><h2>${esc(r.title)}</h2>
        <div class="row" style="margin-bottom:8px">${speakBtn(r.text, "Ouvir o texto")}<span class="muted small">Ouça o texto</span>
        <button class="btn small" id="slowread" data-speak="${esc(r.text)}" data-rate="0.7">🐢 Devagar</button>
        <button class="btn small" id="tr">Mostrar tradução</button></div>
        <div class="reading-text">${esc(r.text)}</div><div class="reading-pt" id="trtext" hidden>${esc(r.pt || "")}</div>`;
      $("#tr").addEventListener("click", () => { const t = $("#trtext"); t.hidden = !t.hidden; $("#tr").textContent = t.hidden ? "Mostrar tradução" : "Ocultar tradução"; });
      setAnswer("read"); $("#pl-check").textContent = "Li o texto";
    },
    rq(e, body) {
      body.innerHTML = `<details style="margin-bottom:12px"><summary class="muted small">Ver o texto novamente</summary><div class="reading-text small">${esc(e.reading.text)}</div></details>
        <div class="q-label">${e.label}</div><div class="q-prompt" style="font-size:1.3rem">${esc(e.q.q)}</div>${optionsHtml(e.opts)}`;
      bindOptions(body);
    }
  };

  function evaluate(e, ans) {
    switch (e.type) {
      case "type": case "dictation": {
        const a = norm(ans), b = norm(e.word.en);
        if (a === b) return { ok: true };
        if (b.length >= 5 && lev(a, b) <= 1) return { ok: true, note: "Quase perfeito! Atenção à grafia: " + e.word.en };
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
    let html = `<div class="fb-title">${res.ok ? "✅ " + pick(PRAISE) : "❌ Resposta correta:"}</div>`;
    if (!res.ok && e.solution) html += `<div><b>${esc(e.solution)}</b></div>`;
    if (res.note) html += `<div class="small">${esc(res.note)}</div>`;
    if (w) html += `<div class="row small" style="margin-top:4px">${speakBtn(w.en)}<span><b>${esc(w.en)}</b> — ${esc(w.pt)}</span>${starBtn(w.id)}<span class="muted">Salvar no meu dicionário</span></div>`;
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
      // Desativa exercícios de áudio pelos próximos minutos, como no Duolingo
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
      <div class="big confetti">${result.passed ? (perfect ? "🏆" : "🎉") : "💪"}</div>
      <h1>${result.title || (result.passed ? (perfect ? "Lição perfeita!" : "Lição concluída!") : "Quase lá!")}</h1>
      <p class="muted">${esc(result.message || (result.passed ? "Continue assim — a repetição é o segredo." : "Você precisa de 70% de acertos. Revise e tente de novo!"))}</p>
      <div class="result-stats">
        <div class="rs">⚡<b>+${xp}</b>XP</div>
        <div class="rs">🎯<b>${Math.round(acc * 100)}%</b>${P.timed ? "acertos" : "precisão"}</div>
        <div class="rs">⏱<b>${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}</b>tempo</div>
      </div>
      ${missed.length ? `<div class="card" style="text-align:left"><h3>Palavras para reforçar</h3>
        ${missed.map((id) => { const w = getWord(id); return `<div class="row">${starBtn(id)}${speakBtn(w.en)}<b>${esc(w.en)}</b><span class="muted">— ${esc(w.pt)}</span></div>`; }).join("")}
        <button class="btn small" id="saveall" style="margin-top:8px">⭐ Salvar todas no meu dicionário</button></div>` : ""}
    </div>`;
    const sa = $("#saveall");
    if (sa) sa.addEventListener("click", () => { missed.forEach((id) => toggleMine(id, true)); $$("#pl-body [data-star]").forEach((b) => b.classList.add("on")); toast("⭐ " + missed.length + " palavras salvas"); });
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
        if (step === 4) return { title: "Unidade concluída! 👑", message: "Você dominou “" + unit.title + "”." };
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
        if (!words.length) { toast("Nada para revisar hoje! 🎉 Use o treino misto."); return; }
        ex = mixedEx(words, 15); opts.title = "Revisão inteligente"; break;
      }
      case "mixed": words = learned.length >= 4 ? learned : fallback(); ex = mixedEx(words, 12); opts.title = "Treino misto"; break;
      case "mistakes": {
        words = Object.keys(state.mistakes).filter(getWord).sort((a, b) => state.mistakes[b] - state.mistakes[a]).slice(0, 15).map(getWord);
        if (!words.length) { toast("Você ainda não errou nenhuma palavra. 👏"); return; }
        ex = mixedEx(words, 12, ["mc_en", "mc_pt", "type", "listen", "fill"]); opts.title = "Meus erros"; break;
      }
      case "mine": {
        words = Object.keys(state.mine).map(getWord).filter(Boolean);
        if (!words.length) { toast("Seu dicionário está vazio. Toque em ★ nas palavras!"); return; }
        ex = mixedEx(words, 15, ["mc_en", "mc_pt", "type", "listen", "def", "fill"]); opts.title = "Meu dicionário"; break;
      }
      case "unit": words = UNIT[arg].words; ex = mixedEx(words, 12); opts.title = UNIT[arg].title; break;
      case "timed": {
        words = learned.length >= 8 ? learned : fallback();
        ex = []; for (let i = 0; i < 80; i++) ex.push(makeEx(pick(["mc_en", "mc_pt", "def"]), pick(words)));
        opts = { mode: "timed", title: "Contra o relógio", timed: { seconds: 60 },
          onFinish: (r) => {
            const best = r.score > state.stats.timedBest; if (best) state.stats.timedBest = r.score; save(); checkBadges();
            return { title: r.score + " acertos em 60s", message: best ? "🏅 Novo recorde pessoal!" : "Seu recorde: " + state.stats.timedBest + " acertos." };
          } };
        break;
      }
      case "dictation": words = learned.length >= 4 ? learned : fallback(); ex = mixedEx(words, 10, ["dictation"]); opts.title = "Ditado"; break;
      case "speak": {
        if (!SR) { toast("Seu navegador não suporta reconhecimento de voz. Use o Chrome ou Edge."); return; }
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
    $$(".nav a").forEach((a) => a.classList.toggle("active", a.dataset.route === name || (name === "case" && a.dataset.route === "cases") || (name === "resources" && a.dataset.route === "profile")));
    ROUTES[name](arg ? decodeURIComponent(arg) : undefined);
    renderTopbar();
  }
  window.addEventListener("hashchange", () => { route(); window.scrollTo(0, 0); });

  /* ---------- Aprender ---------- */
  function wordOfDay() {
    const d = dayStr().split("-").map(Number); const n = d[0] * 372 + d[1] * 31 + d[2];
    return ALL_WORDS[n % ALL_WORDS.length];
  }
  function nextStep() {
    for (let i = 0; i < UNITS.length; i++) {
      if (!unitUnlocked(i)) break;
      for (let s = 0; s < STEPS.length; s++) if (!stepDone(UNITS[i].id, s) && stepUnlocked(UNITS[i].id, s)) return { uid: UNITS[i].id, step: s };
    }
    return null;
  }
  ROUTES.learn = function () {
    const nx = nextStep(), due = dueIds().length, wod = wordOfDay();
    const quote = QUOTES[new Date().getDate() % QUOTES.length];
    let html = `<div class="hero"><h1>${state.name ? "Olá, " + esc(state.name) + "! 👋" : "Bem-vindo(a)! 👋"}</h1>
      <p>${nx ? "Próximo passo: <b>" + esc(UNIT[nx.uid].title) + " · " + STEPS[nx.step].name + "</b>" : "Você concluiu toda a trilha! 🎓 Continue revisando."}</p>
      <p class="quote">${esc(quote)}</p>
      <div class="row" style="margin-top:12px">${nx ? `<button class="btn" id="go-next">▶ Continuar</button>` : ""}
      ${due ? `<button class="btn" id="go-review">🔁 Revisar ${due} palavra${due > 1 ? "s" : ""}</button>` : ""}</div></div>
      ${state.xp >= 30 && (!state.lastBackup || Date.now() - state.lastBackup > 7 * 864e5) ? `<div class="card row" style="margin-bottom:12px"><span style="font-size:1.5rem">💾</span>
        <span class="small" style="flex:1">Seu progresso fica só neste navegador. ${state.lastBackup ? "Faz mais de 7 dias desde o último backup." : "Que tal salvar um backup?"}</span>
        <button class="btn small primary" data-backup>Salvar agora</button></div>` : ""}
      <div class="card"><div class="row"><span class="tag">Palavra do dia</span><span class="spacer"></span>${speakBtn(wod.en)}${starBtn(wod.id)}</div>
      <h2 style="margin-top:6px">${esc(wod.en)} <span class="muted" style="font-weight:600">— ${esc(wod.pt)}</span></h2>${pronHtml(wod)}
      <p class="small" style="margin:6px 0 0">${esc(wod.def)}<br><i>${esc(wod.ex)}</i></p></div>`;
    SECTIONS.forEach((sec) => {
      html += `<div class="section-banner sb-${sec.id}"><div><h2>${esc(sec.title)} <span class="tag" style="background:rgba(255,255,255,.25);color:#fff">${sec.level}</span></h2><p>${esc(sec.desc)}</p></div></div><div class="path">`;
      UNITS.forEach((u, idx) => {
        if (u.section !== sec.id) return;
        const unlocked = unitUnlocked(idx), done = unitComplete(u.id), n = unitDone(u.id).length;
        const current = nx && nx.uid === u.id;
        const C = 2 * Math.PI * 45, frac = n / STEPS.length;
        html += `<button class="node ${unlocked ? "" : "locked"} ${done ? "done" : ""} ${current ? "current" : ""}" data-unit="${u.id}" aria-label="${esc(u.title)}">
          <div class="node-circle">${unlocked ? u.icon : "🔒"}
            <svg class="node-ring" viewBox="0 0 100 100"><circle class="bgc" cx="50" cy="50" r="45"/>${frac ? `<circle class="fgc" cx="50" cy="50" r="45" stroke-dasharray="${C * frac} ${C}"/>` : ""}</svg></div>
          <span class="node-label">${esc(u.title)}<br><small class="muted">${n}/${STEPS.length}${done ? " 👑" : ""}</small></span></button>`;
      });
      html += `</div>`;
    });
    if (!state.settings.free) html += `<p class="muted small" style="text-align:center;margin-top:24px">Já tem base em inglês? Ative o <a href="#/profile">modo livre</a> para desbloquear todas as unidades.</p>`;
    view.innerHTML = html;
    if (nx) $("#go-next").addEventListener("click", () => startStep(nx.uid, nx.step));
    if (due) $("#go-review").addEventListener("click", () => startPractice("review"));
    $$(".node").forEach((b) => b.addEventListener("click", () => {
      const idx = UNITS.findIndex((u) => u.id === b.dataset.unit);
      if (!unitUnlocked(idx)) { toast("🔒 Conclua as 3 lições da unidade anterior para desbloquear."); return; }
      unitModal(b.dataset.unit);
    }));
  };

  function unitModal(uid) {
    const u = UNIT[uid];
    openModal(`<div class="row"><span style="font-size:2rem">${u.icon}</span><div><h2 style="margin:0">${esc(u.title)}</h2><div class="muted small">${esc(u.en)}${u.source ? " · " + esc(u.source) : ""}</div></div>
      <span class="spacer"></span><button class="icon-btn" data-close aria-label="Fechar">✕</button></div>
      <div class="steps">${STEPS.map((s, i) => {
        const done = stepDone(uid, i), unl = stepUnlocked(uid, i);
        return `<button class="step ${done ? "done" : ""} ${unl ? "" : "locked"}" data-step="${i}"><span class="si">${unl ? s.icon : "🔒"}</span>
          <span><b>${s.name}</b><br><small class="muted">${s.desc}</small></span><span class="spacer"></span>${done ? "✅" : ""}</button>`;
      }).join("")}</div>
      <div class="row"><a class="btn small" href="#/dict/${uid}" data-close>📖 Vocabulário (${u.words.length})</a>
      <button class="btn small" id="m-prac">🎯 Praticar</button><button class="btn small" id="m-cards">🃏 Flashcards</button></div>`, (m) => {
      $$(".step", m).forEach((b) => b.addEventListener("click", () => {
        const i = Number(b.dataset.step);
        if (!stepUnlocked(uid, i)) { toast("🔒 Conclua a etapa anterior primeiro."); return; }
        closeModal(); startStep(uid, i);
      }));
      $("#m-prac", m).addEventListener("click", () => { closeModal(); startPractice("unit", uid); });
      $("#m-cards", m).addEventListener("click", () => { closeModal(); location.hash = "#/cards/" + uid; });
    });
  }

  /* ---------- Praticar ---------- */
  ROUTES.practice = function () {
    const due = dueIds().length, mist = Object.keys(state.mistakes).length, mine = Object.keys(state.mine).length;
    const tiles = [
      ["review", "🔁", "Revisão inteligente", due ? due + " palavras para hoje (repetição espaçada)" : "Nada pendente hoje 🎉"],
      ["mixed", "🎲", "Treino misto", "Exercícios variados com as palavras que você já viu"],
      ["mistakes", "🩹", "Meus erros", mist ? mist + " palavras que você errou" : "Nenhum erro registrado"],
      ["mine", "⭐", "Meu dicionário", mine ? mine + " palavras salvas" : "Salve palavras com ★"],
      ["timed", "⏱️", "Contra o relógio", "60 segundos · recorde: " + state.stats.timedBest],
      ["dictation", "🎧", "Ditado", "Ouça e escreva os termos"],
      ["speak", "🎤", "Pronúncia", SR ? "Fale e o app confere" : "Requer Chrome ou Edge"],
      ["terms", "🔤", "Prefixos e abreviações", "Treino rápido de terminologia"]
    ];
    view.innerHTML = `<div class="section-head"><h1>Praticar</h1><p class="muted">Escolha um modo de treino. Cada sessão dá XP e alimenta sua repetição espaçada.</p></div>
      <div class="grid">${tiles.map(([k, i, t, d]) => `<button class="card step" data-p="${k}" style="flex-direction:column;align-items:flex-start"><span style="font-size:2rem">${i}</span><b>${t}</b><small class="muted">${d}</small></button>`).join("")}</div>
      <div class="card" style="margin-top:16px"><h3>🩹 Casos clínicos</h3><p class="muted small">Leia casos curtos em inglês simples e responda perguntas de compreensão.</p><a class="btn small primary" href="#/cases">Abrir casos</a></div>`;
    $$("[data-p]").forEach((b) => b.addEventListener("click", () => startPractice(b.dataset.p)));
  };

  /* ---------- Flashcards ---------- */
  const FC = { deck: "due", dir: "en", queue: [], i: 0, flipped: false };
  function deckWords(deck) {
    if (deck === "due") return dueIds().map(getWord);
    if (deck === "mine") return Object.keys(state.mine).map(getWord).filter(Boolean);
    if (deck === "mistakes") return Object.keys(state.mistakes).map(getWord).filter(Boolean);
    if (deck === "all") return ALL_WORDS.concat(state.custom);
    return UNIT[deck] ? UNIT[deck].words : [];
  }
  ROUTES.cards = function (arg) {
    if (arg && (UNIT[arg] || ["due", "mine", "mistakes", "all"].includes(arg))) FC.deck = arg;
    const words = deckWords(FC.deck);
    // Ordena: vencidas primeiro, depois novas, depois o restante
    FC.queue = shuffle(words).sort((a, b) => ((state.srs[a.id] || {}).due || "0000") < ((state.srs[b.id] || {}).due || "0000") ? -1 : 1);
    FC.i = 0; FC.flipped = false;
    view.innerHTML = `<div class="section-head"><h1>Flashcards</h1><p class="muted">Toque no cartão para virar e avalie sua memória. O app agenda a próxima revisão automaticamente.</p></div>
      <div class="toolbar"><select id="fc-deck" aria-label="Baralho">
        <option value="due">🔁 Para revisar hoje (${dueIds().length})</option>
        <option value="mine">⭐ Meu dicionário (${Object.keys(state.mine).length})</option>
        <option value="mistakes">🩹 Meus erros (${Object.keys(state.mistakes).length})</option>
        ${UNITS.map((u) => `<option value="${u.id}">${u.icon} ${esc(u.title)}</option>`).join("")}
        <option value="all">📚 Todas as palavras</option></select>
        <select id="fc-dir" aria-label="Direção"><option value="en">Inglês → Português</option><option value="pt">Português → Inglês</option></select></div>
      <div id="fc-area"></div>`;
    $("#fc-deck").value = FC.deck; $("#fc-dir").value = FC.dir;
    $("#fc-deck").addEventListener("change", (e) => { location.hash = "#/cards/" + e.target.value; });
    $("#fc-dir").addEventListener("change", (e) => { FC.dir = e.target.value; renderCard(); });
    renderCard();
  };
  function renderCard() {
    const area = $("#fc-area"); if (!area) return;
    if (FC.i >= FC.queue.length) {
      area.innerHTML = `<div class="empty"><div class="big">${FC.queue.length ? "🎉" : "🗂️"}</div>
        <h2>${FC.queue.length ? "Baralho concluído!" : "Nenhum cartão aqui"}</h2>
        <p>${FC.deck === "due" ? "Volte amanhã ou escolha outro baralho." : FC.deck === "mine" ? "Salve palavras com ★ no dicionário ou nas lições." : "Escolha outro baralho."}</p></div>`;
      return;
    }
    const w = FC.queue[FC.i];
    const front = FC.dir === "en" ? `<div class="fc-term">${esc(w.en)}</div>${pronHtml(w)}` : `<div class="fc-term">${esc(w.pt)}</div>`;
    const back = `<div class="fc-term">${esc(FC.dir === "en" ? w.pt : w.en)}</div>${FC.dir === "pt" ? pronHtml(w) : ""}
      <p class="small" style="margin-top:10px">${esc(w.def || "")}</p><p class="small"><i>${esc(w.ex || "")}</i></p>`;
    area.innerHTML = `<p class="muted small" style="text-align:center">${FC.i + 1} de ${FC.queue.length}</p>
      <div class="fc-wrap"><div class="fc ${FC.flipped ? "flip" : ""}" id="fc" tabindex="0" role="button" aria-label="Virar cartão">
        <div class="fc-face"><div class="fc-tools">${speakBtn(w.en)}${starBtn(w.id)}</div>${front}<p class="muted small" style="margin-top:16px">toque para virar</p></div>
        <div class="fc-face fc-back"><div class="fc-tools">${speakBtn(w.en)}${starBtn(w.id)}</div>${back}</div></div></div>
      <div class="fc-rate" ${FC.flipped ? "" : 'style="visibility:hidden"'} id="fc-rate">
        <button class="btn danger" data-q="0">Errei<small>agora</small></button>
        <button class="btn" data-q="1">Difícil<small>1 dia</small></button>
        <button class="btn primary" data-q="2">Bom<small>${INTERVALS[Math.min(6, srs(w.id).box + 1)]} dias</small></button>
        <button class="btn" data-q="3">Fácil<small>${INTERVALS[Math.min(6, srs(w.id).box + 2)]} dias</small></button></div>`;
    const flip = () => { FC.flipped = !FC.flipped; $("#fc").classList.toggle("flip", FC.flipped); $("#fc-rate").style.visibility = FC.flipped ? "visible" : "hidden"; if (FC.flipped && FC.dir === "pt" && state.settings.autoplay) speak(w.en); };
    $("#fc").addEventListener("click", (e) => { if (!e.target.closest("button")) flip(); });
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
  const DICT = { q: "", unit: "", open: null };
  function wordRow(w, opts) {
    const open = DICT.open === w.id;
    const note = state.mine[w.id] && state.mine[w.id].note;
    return `<div class="word-row" data-wid="${esc(w.id)}"><div class="word-head">${speakBtn(w.en)}
      <div style="flex:1;min-width:0"><span class="word-en">${esc(w.en)}</span> <span class="word-pt">— ${esc(w.pt)}</span>
      ${opts && opts.unitTag && UNIT[w.unit] ? ` <span class="tag">${UNIT[w.unit].icon} ${esc(UNIT[w.unit].title)}</span>` : w.custom ? ' <span class="tag new">minha palavra</span>' : ""}</div>${starBtn(w.id)}</div>
      ${open ? `<div class="word-body">${pronHtml(w)}${w.def ? `<p style="margin:4px 0">${esc(w.def)}</p>` : ""}${w.ex ? `<p class="ex" style="margin:4px 0">${speakBtn(w.ex, "Ouvir exemplo")} ${esc(w.ex)}</p>` : ""}
        ${note && !(opts && opts.notes) ? `<p class="small">📝 ${esc(note)}</p>` : ""}
        <div class="row small"><a href="https://youglish.com/pronounce/${encodeURIComponent(w.en)}/english" target="_blank" rel="noopener">YouGlish</a>·
        <a href="https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(w.en.toLowerCase())}" target="_blank" rel="noopener">Cambridge</a>·
        <a href="https://www.merriam-webster.com/medical/${encodeURIComponent(w.en.toLowerCase())}" target="_blank" rel="noopener">Merriam-Webster Medical</a></div></div>` : ""}
      ${opts && opts.notes ? `<div class="word-body"><textarea rows="2" data-note="${esc(w.id)}" placeholder="Anotações pessoais (ex.: onde vi, frase própria, mnemônico)…">${esc(note || "")}</textarea>
        ${w.custom ? `<button class="btn small ghost" data-delcustom="${esc(w.id)}">🗑 Excluir palavra</button>` : ""}</div>` : ""}</div>`;
  }
  function bindWordRows(root, rerender) {
    $$(".word-head", root).forEach((h) => h.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      const id = h.parentElement.dataset.wid; DICT.open = DICT.open === id ? null : id; (rerender || route)();
    }));
  }
  ROUTES.dict = function (arg) {
    if (arg !== DICT.arg) { DICT.arg = arg; if (arg && UNIT[arg]) { DICT.unit = arg; DICT.q = ""; } }
    view.innerHTML = `<div class="section-head row"><div><h1>Dicionário</h1><p class="muted" style="margin:0">${ALL_WORDS.length + state.custom.length} termos · busque em inglês ou português · toque em ★ para salvar.</p></div>
      <span class="spacer"></span><button class="btn small primary" id="addword">＋ Nova palavra</button></div>
      <div class="toolbar"><input type="search" id="dq" placeholder="Buscar… (ex.: fígado, stroke)" value="${esc(DICT.q)}" aria-label="Buscar">
      <select id="du" aria-label="Unidade"><option value="">Todas as unidades</option>${UNITS.map((u) => `<option value="${u.id}">${u.icon} ${esc(u.title)}</option>`).join("")}<option value="custom">✍️ Minhas palavras</option></select></div>
      <div id="dlist"></div>`;
    $("#du").value = DICT.unit;
    const renderList = () => {
      const q = norm(DICT.q);
      let list = DICT.unit === "custom" ? state.custom : DICT.unit ? UNIT[DICT.unit].words : ALL_WORDS.concat(state.custom);
      if (q) list = list.filter((w) => norm(w.en).includes(q) || norm(w.pt).includes(q) || norm(w.def || "").includes(q));
      if (!DICT.unit) list = list.slice().sort((a, b) => a.en.localeCompare(b.en));
      $("#dlist").innerHTML = list.length ? list.map((w) => wordRow(w, { unitTag: !DICT.unit })).join("") :
        `<div class="empty"><div class="big">🔎</div><p>Nada encontrado. Que tal <a href="#" id="addq">adicionar “${esc(DICT.q)}”</a> ao seu dicionário?</p></div>`;
      bindWordRows($("#dlist"), renderList);
      const aq = $("#addq"); if (aq) aq.addEventListener("click", (e) => { e.preventDefault(); customWordModal({ en: DICT.q }); });
    };
    $("#dq").addEventListener("input", (e) => { DICT.q = e.target.value; renderList(); });
    $("#du").addEventListener("change", (e) => { DICT.unit = e.target.value; renderList(); });
    $("#addword").addEventListener("click", () => customWordModal({}));
    renderList();
  };

  function customWordModal(pre) {
    openModal(`<div class="row"><h2 style="margin:0">Nova palavra</h2><span class="spacer"></span><button class="icon-btn" data-close aria-label="Fechar">✕</button></div>
      <p class="muted small">Crie seu próprio termo. Ele entra automaticamente no seu dicionário e nos flashcards.</p>
      <form id="cw"><div class="field"><label for="cw-en">Inglês *</label><input type="text" id="cw-en" required value="${esc(pre.en || "")}"></div>
      <div class="field"><label for="cw-pt">Português *</label><input type="text" id="cw-pt" required value="${esc(pre.pt || "")}"></div>
      <div class="field"><label for="cw-pr">Pronúncia (como se fala)</label><input type="text" id="cw-pr" value="${esc(pre.pr || "")}"></div>
      <div class="field"><label for="cw-def">Definição em inglês</label><input type="text" id="cw-def" value="${esc(pre.def || "")}"></div>
      <div class="field"><label for="cw-ex">Frase de exemplo</label><input type="text" id="cw-ex" value="${esc(pre.ex || "")}"></div>
      <div class="row"><span class="spacer"></span><button type="button" class="btn ghost" data-close>Cancelar</button><button class="btn primary" type="submit">Salvar</button></div></form>`, (m) => {
      $("#cw-en", m).focus();
      $("#cw", m).addEventListener("submit", (e) => {
        e.preventDefault();
        const en = $("#cw-en", m).value.trim(), pt = $("#cw-pt", m).value.trim();
        if (!en || !pt) return;
        const w = { id: "my:" + Date.now().toString(36), en, pt, pr: $("#cw-pr", m).value.trim(), def: $("#cw-def", m).value.trim(), ex: $("#cw-ex", m).value.trim(), custom: true, unit: "custom" };
        state.custom.push(w); toggleMine(w.id, true); save(); closeModal(); toast("⭐ “" + en + "” adicionada ao seu dicionário"); route();
      });
    });
  }

  /* ---------- Meu dicionário ---------- */
  ROUTES.mine = function () {
    const ids = Object.keys(state.mine).filter(getWord).sort((a, b) => state.mine[b].added - state.mine[a].added);
    const sugg = state.recent.filter((id) => getWord(id) && !isMine(id)).slice(0, 10);
    view.innerHTML = `<div class="section-head row"><div><h1>⭐ Meu dicionário</h1><p class="muted" style="margin:0">As palavras em que você tem mais dificuldade. ${ids.length} salvas.</p></div>
      <span class="spacer"></span><button class="btn small primary" id="addword">＋ Nova palavra</button></div>
      <div class="row" style="margin-bottom:14px">
        <button class="btn small" id="mp-cards" ${ids.length ? "" : "disabled"}>🃏 Flashcards</button>
        <button class="btn small" id="mp-quiz" ${ids.length ? "" : "disabled"}>🎯 Quiz</button>
        <button class="btn small" id="mp-anki" ${ids.length ? "" : "disabled"}>⬇ Exportar p/ Anki</button>
        <button class="btn small" id="mp-csv" ${ids.length ? "" : "disabled"}>⬇ CSV</button>
        <button class="btn small" id="mp-print" ${ids.length ? "" : "disabled"}>🖨 Imprimir</button></div>
      ${sugg.length ? `<div class="card" style="margin-bottom:14px"><div class="row"><h3 style="margin:0">💡 Sugestões: palavras que você errou recentemente</h3><span class="spacer"></span><button class="btn small" id="addsugg">Adicionar todas</button></div>
        <div class="row" style="margin-top:8px">${sugg.map((id) => { const w = getWord(id); return `<span class="chip" style="cursor:default">${starBtn(id)} ${esc(w.en)} <span class="muted small">— ${esc(w.pt)}</span></span>`; }).join("")}</div></div>` : ""}
      <div id="mlist">${ids.length ? ids.map((id) => wordRow(getWord(id), { notes: true, unitTag: true })).join("") :
        `<div class="empty"><div class="big">⭐</div><h2>Seu dicionário está vazio</h2><p>Toque na estrela ★ em qualquer palavra — no dicionário, nas lições, nos flashcards — ou crie a sua própria palavra.</p><a class="btn primary" href="#/dict">Abrir dicionário</a></div>`}</div>`;
    bindWordRows($("#mlist"));
    $("#addword").addEventListener("click", () => customWordModal({}));
    $("#mp-cards").addEventListener("click", () => { location.hash = "#/cards/mine"; });
    $("#mp-quiz").addEventListener("click", () => startPractice("mine"));
    const words = ids.map(getWord);
    $("#mp-anki").addEventListener("click", () => download("meu-dicionario-anki.txt", words.map((w) => [w.en, `${w.pt}<br><i>${w.def || ""}</i><br>${w.ex || ""}${state.mine[w.id].note ? "<br>📝 " + state.mine[w.id].note : ""}`].map((x) => x.replace(/[\t\n]/g, " ")).join("\t")).join("\n"), "text/plain"));
    $("#mp-csv").addEventListener("click", () => download("meu-dicionario.csv", "﻿ingles;portugues;pronuncia;definicao;exemplo;anotacoes\n" + words.map((w) => [w.en, w.pt, w.pr, w.def, w.ex, state.mine[w.id].note].map((x) => '"' + String(x || "").replace(/"/g, '""') + '"').join(";")).join("\n"), "text/csv"));
    $("#mp-print").addEventListener("click", () => printList(words));
    const as = $("#addsugg"); if (as) as.addEventListener("click", () => { sugg.forEach((id) => toggleMine(id, true)); toast("⭐ Sugestões adicionadas"); route(); });
    let t;
    $$("[data-note]").forEach((ta) => ta.addEventListener("input", () => {
      clearTimeout(t); t = setTimeout(() => { if (state.mine[ta.dataset.note]) { state.mine[ta.dataset.note].note = ta.value; save(); } }, 400);
    }));
    $$("[data-delcustom]").forEach((b) => b.addEventListener("click", () => {
      if (!confirm("Excluir esta palavra?")) return;
      const id = b.dataset.delcustom; state.custom = state.custom.filter((c) => c.id !== id); delete state.mine[id]; delete state.srs[id]; save(); route();
    }));
  };
  function download(name, text, type) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: type + ";charset=utf-8" })); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function printList(words) {
    const w = window.open("", "_blank"); if (!w) { toast("Permita pop-ups para imprimir."); return; }
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Meu dicionário</title><style>body{font-family:sans-serif;padding:24px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:6px;text-align:left;vertical-align:top}th{background:#eee}</style></head><body>
      <h1>Meu dicionário de inglês médico</h1><table><tr><th>Inglês</th><th>Português</th><th>Pronúncia</th><th>Exemplo</th><th>Anotações</th></tr>
      ${words.map((x) => `<tr><td><b>${esc(x.en)}</b></td><td>${esc(x.pt)}</td><td>${esc(x.pr || "")}</td><td>${esc(x.ex || "")}</td><td>${esc(state.mine[x.id].note || "")}</td></tr>`).join("")}</table></body></html>`);
    w.document.close(); w.focus(); w.print();
  }

  /* ---------- Casos clínicos ---------- */
  ROUTES.cases = function () {
    view.innerHTML = `<div class="section-head"><h1>🩹 Casos clínicos</h1><p class="muted">Casos curtos e simples para treinar a <b>leitura</b> em inglês — não é prova de residência! Toque nas palavras sublinhadas para ver a tradução.</p></div>
      <div class="grid">${CASES.map((c) => `<a class="card step ${state.cases[c.id] ? "done" : ""}" href="#/case/${c.id}" style="flex-direction:column;align-items:flex-start;text-decoration:none;color:inherit">
        <div class="row" style="width:100%"><span class="tag">${c.level}</span><span class="tag">${UNIT[c.topic] ? UNIT[c.topic].icon + " " + esc(UNIT[c.topic].title) : ""}</span><span class="spacer"></span>${state.cases[c.id] ? "✅" : ""}</div>
        <h3 style="margin-top:8px">${esc(c.title)}</h3><p class="muted small" style="margin:0">${esc(c.text.slice(0, 90))}…</p></a>`).join("")}</div>`;
  };
  ROUTES.case = function (id) {
    const c = CASES.find((x) => x.id === id); if (!c) { location.hash = "#/cases"; return; }
    let text = esc(c.text);
    Object.keys(c.glossary).sort((a, b) => b.length - a.length).forEach((term) => {
      text = text.replace(new RegExp("\\b(" + reRx(esc(term)) + ")\\b", "i"), `<span class="gloss" tabindex="0" data-gloss="${esc(term)}" title="${esc(c.glossary[term])}">$1</span>`);
    });
    view.innerHTML = `<a href="#/cases" class="small">← Casos clínicos</a>
      <div class="section-head" style="margin-top:8px"><span class="tag">${c.level}</span><h1 style="margin-top:6px">${esc(c.title)}</h1></div>
      <div class="card"><div class="row" style="margin-bottom:8px">${speakBtn(c.text, "Ouvir o caso")}<span class="muted small">Ouça o caso</span>
        <button class="btn small" data-speak="${esc(c.text)}" data-rate="0.7">🐢 Devagar</button></div><p class="case-text">${text}</p></div>
      <div class="card"><h3>📚 Glossário do caso</h3>${Object.keys(c.glossary).map((t) => `<div class="row">${speakBtn(t)}<b>${esc(t)}</b><span class="muted">— ${esc(c.glossary[t])}</span><span class="spacer"></span>
        <button class="btn small" data-addgloss="${esc(t)}">⭐ Salvar</button></div>`).join("")}</div>
      <div style="text-align:center;margin-top:16px"><button class="btn primary" id="case-go">Responder perguntas (${c.questions.length})</button></div>`;
    $$("[data-gloss]").forEach((g) => {
      const show = () => { toast(g.dataset.gloss + " = " + c.glossary[g.dataset.gloss]); speak(g.dataset.gloss); };
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
      toggleMine(w.id, true); save(); toast("⭐ “" + term + "” salva no seu dicionário");
    }));
    $("#case-go").addEventListener("click", () => {
      const reading = { title: c.title, text: c.text, questions: c.questions };
      startSession({
        title: c.title, exercises: reading.questions.map((q) => makeEx("rq", null, { reading, q })), mode: "case", xpBase: 10,
        onFinish: () => { state.cases[c.id] = true; save(); checkBadges(); return { title: "Caso resolvido! 🩺", message: "Ótima leitura. Salve as palavras novas do glossário no seu dicionário." }; }
      });
    });
  };

  /* ---------- Conquistas ---------- */
  const BADGES = [
    ["first", "🎉", "Primeira lição", "Conclua uma lição", () => state.stats.lessons >= 1],
    ["perfect", "💯", "Perfeccionista", "Lição sem nenhum erro", () => state.stats.perfect >= 1],
    ["streak3", "🔥", "Aquecendo", "3 dias seguidos", () => state.bestStreak >= 3],
    ["streak7", "📅", "Plantão semanal", "7 dias seguidos", () => state.bestStreak >= 7],
    ["streak30", "🏥", "Residente dedicado", "30 dias seguidos", () => state.bestStreak >= 30],
    ["xp100", "⚡", "100 XP", "Some 100 XP", () => state.xp >= 100],
    ["xp500", "🌟", "500 XP", "Some 500 XP", () => state.xp >= 500],
    ["xp1500", "🚀", "1500 XP", "Some 1500 XP", () => state.xp >= 1500],
    ["words50", "📘", "50 palavras", "Pratique 50 termos", () => learnedIds().length >= 50],
    ["words150", "📚", "150 palavras", "Pratique 150 termos", () => learnedIds().length >= 150],
    ["wordsall", "🧠", "Enciclopédia", "Pratique todos os termos", () => learnedIds().filter((id) => WORDS[id]).length >= ALL_WORDS.length],
    ["mine10", "⭐", "Colecionador", "10 palavras no seu dicionário", () => Object.keys(state.mine).length >= 10],
    ["unit1", "👑", "Unidade dominada", "Conclua o desafio de uma unidade", () => UNITS.some((u) => unitComplete(u.id))],
    ["section1", "🦴", "Fundamentos", "Conclua a seção Fundamentos", () => UNITS.filter((u) => u.section === "s1").every((u) => unitComplete(u.id))],
    ["allunits", "🎓", "Formado(a)!", "Conclua todas as unidades", () => UNITS.every((u) => unitComplete(u.id))],
    ["case3", "🕵️", "Detetive clínico", "Resolva 3 casos clínicos", () => Object.keys(state.cases).length >= 3],
    ["timed20", "⏱️", "Rápido no gatilho", "20 acertos no contra o relógio", () => state.stats.timedBest >= 20],
    ["speak10", "🎤", "Boa pronúncia", "10 pronúncias corretas", () => state.stats.speakOk >= 10],
    ["cards100", "🃏", "Maratona de cards", "Revise 100 flashcards", () => state.stats.cards >= 100]
  ];
  function checkBadges() {
    BADGES.forEach(([id, icon, name, , test]) => {
      if (!state.badges[id] && test()) { state.badges[id] = Date.now(); save(); setTimeout(() => toast(icon + " Conquista desbloqueada: " + name), 900); }
    });
  }

  /* ---------- Perfil ---------- */
  ROUTES.profile = function () {
    const lv = levelOf(state.xp), lo = xpForLevel(lv), hi = xpForLevel(lv + 1);
    const acc = state.stats.answers ? Math.round((state.stats.correct / state.stats.answers) * 100) : 0;
    const days = []; for (let i = -6; i <= 0; i++) days.push(dayStr(i));
    const wd = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
    const s = state.settings;
    const sel = (id, opts, val) => `<select id="${id}">${opts.map(([v, l]) => `<option value="${v}" ${String(v) === String(val) ? "selected" : ""}>${l}</option>`).join("")}</select>`;
    const chk = (id, val) => `<input type="checkbox" id="${id}" ${val ? "checked" : ""} style="width:22px;height:22px">`;
    view.innerHTML = `<div class="section-head"><h1>👤 ${esc(state.name || "Seu perfil")}</h1></div>
      <div class="card"><div class="row"><span style="font-size:2rem">🎓</span><div><b>Nível ${lv} — ${titleOf(lv)}</b><div class="muted small">${state.xp - lo} / ${hi - lo} XP para o nível ${lv + 1}</div></div></div>
        <div class="level-bar"><div style="width:${((state.xp - lo) / (hi - lo)) * 100}%"></div></div></div>
      <div class="card"><h3>Estatísticas</h3><div class="stats-grid">
        <div class="stat-tile"><b>🔥 ${currentStreak()}</b><span>ofensiva atual (recorde ${state.bestStreak})</span></div>
        <div class="stat-tile"><b>⚡ ${state.xp}</b><span>XP total</span></div>
        <div class="stat-tile"><b>📘 ${learnedIds().length}</b><span>palavras praticadas</span></div>
        <div class="stat-tile"><b>⭐ ${Object.keys(state.mine).length}</b><span>no meu dicionário</span></div>
        <div class="stat-tile"><b>✅ ${state.stats.lessons}</b><span>lições concluídas</span></div>
        <div class="stat-tile"><b>🎯 ${acc}%</b><span>precisão geral</span></div>
        <div class="stat-tile"><b>👑 ${UNITS.filter((u) => unitComplete(u.id)).length}/${UNITS.length}</b><span>unidades dominadas</span></div>
        <div class="stat-tile"><b>🃏 ${state.stats.cards}</b><span>flashcards revisados</span></div></div>
        <h3 style="margin-top:16px">Últimos 7 dias</h3><div class="week">${days.map((d) => { const x = state.daily[d] || 0; const [y, m, dd] = d.split("-").map(Number);
          return `<div class="day ${x >= s.goal ? "hit" : x ? "some" : ""}" title="${x} XP"><div>${wd[new Date(y, m - 1, dd).getDay()]}</div><b>${x}</b></div>`; }).join("")}</div>
        <p class="muted small" style="margin-top:6px">XP por dia · laranja = meta diária atingida</p></div>
      <div class="card"><h3>🏅 Conquistas (${Object.keys(state.badges).length}/${BADGES.length})</h3><div class="badges">${BADGES.map(([id, icon, name, desc]) =>
        `<div class="badge ${state.badges[id] ? "" : "off"}"><div class="bi">${icon}</div><b>${name}</b><small>${desc}</small></div>`).join("")}</div></div>
      <div class="card"><h3>⚙️ Configurações</h3>
        <div class="setting"><label for="st-name">Seu nome</label><input type="text" id="st-name" value="${esc(state.name)}" style="max-width:220px"></div>
        <div class="setting"><label for="st-goal">Meta diária</label>${sel("st-goal", [[10, "10 XP · leve"], [20, "20 XP · normal"], [30, "30 XP · sério"], [50, "50 XP · intenso"]], s.goal)}</div>
        <div class="setting"><label for="st-accent">Sotaque do áudio</label>${sel("st-accent", [["en-US", "🇺🇸 Americano"], ["en-GB", "🇬🇧 Britânico"]], s.accent)}</div>
        <div class="setting"><label for="st-rate">Velocidade do áudio</label>${sel("st-rate", [[0.7, "Lenta"], [0.9, "Normal"], [1.05, "Rápida"]], s.rate)}</div>
        <div class="setting"><label for="st-auto">Tocar áudio automaticamente</label>${chk("st-auto", s.autoplay)}</div>
        <div class="setting"><label for="st-pron">Mostrar guia de pronúncia</label>${chk("st-pron", s.pron)}</div>
        <div class="setting"><label for="st-sfx">Efeitos sonoros</label>${chk("st-sfx", s.sfx)}</div>
        <div class="setting"><label for="st-speech">Exercícios de fala (microfone)</label>${chk("st-speech", s.speech)}</div>
        <div class="setting"><label for="st-free">Modo livre (desbloquear todas as unidades)</label>${chk("st-free", s.free)}</div>
        <div class="setting"><label for="st-theme">Tema</label>${sel("st-theme", [["auto", "Automático"], ["light", "Claro"], ["dark", "Escuro"]], s.theme)}</div></div>
      <div class="card"><h3>💾 Salvar e transferir progresso</h3><p class="muted small">O progresso fica salvo só neste navegador. Para abrir em outro navegador ou aparelho, salve um arquivo JSON ou gere um link de transferência.
        ${state.lastBackup ? "Último backup: " + new Date(state.lastBackup).toLocaleString("pt-BR") + "." : "Você ainda não fez nenhum backup."}</p>
        <div class="row"><button class="btn small primary" id="bk-open">💾 Salvar / carregar dados</button>
        <button class="btn small danger" id="bk-reset">Apagar progresso</button></div></div>
      <div class="card"><h3>📎 Recursos e fontes</h3><p class="muted small">Dicionários, fontes oficiais, podcasts e dicas de estudo.</p><a class="btn small primary" href="#/resources">Abrir recursos</a></div>`;
    const bind = (id, fn) => $("#" + id).addEventListener("change", (e) => { fn(e.target); save(); applyTheme(); renderTopbar(); });
    $("#st-name").addEventListener("input", (e) => { state.name = e.target.value.trim(); save(); });
    bind("st-goal", (t) => (s.goal = Number(t.value)));
    bind("st-accent", (t) => { s.accent = t.value; speak("Welcome to medical English"); });
    bind("st-rate", (t) => { s.rate = Number(t.value); speak("Take a deep breath"); });
    bind("st-auto", (t) => (s.autoplay = t.checked));
    bind("st-pron", (t) => (s.pron = t.checked));
    bind("st-sfx", (t) => (s.sfx = t.checked));
    bind("st-speech", (t) => (s.speech = t.checked));
    bind("st-free", (t) => (s.free = t.checked));
    bind("st-theme", (t) => (s.theme = t.value));
    $("#bk-open").addEventListener("click", backupModal);
    $("#bk-reset").addEventListener("click", () => {
      if (!confirm("Apagar TODO o progresso, inclusive seu dicionário? Esta ação não pode ser desfeita.")) return;
      state = JSON.parse(JSON.stringify(DEFAULTS)); save(); applyTheme(); route(); onboarding();
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
    return `<b>${d.xp}</b> XP · <b>${learned}</b> palavras praticadas · <b>${Object.keys(d.mine || {}).length}</b> no meu dicionário · <b>${Object.values(d.units || {}).reduce((s, u) => s + u.length, 0)}</b> etapas concluídas`;
  }
  function applyImport(data, mode) {
    const base = JSON.parse(JSON.stringify(DEFAULTS));
    const incoming = Object.assign(base, data, { stats: Object.assign(base.stats, data.stats || {}), settings: Object.assign(base.settings, data.settings || {}) });
    state = mode === "merge" ? mergeStates(state, incoming) : incoming;
    state.onboarded = true; save(); applyTheme(); renderTopbar();
    toast(mode === "merge" ? "✅ Progresso mesclado!" : "✅ Progresso carregado!");
  }
  function confirmImport(text, after) {
    decodeAny(text).then(unpack).then(({ data, exportedAt }) => {
      const hasLocal = state.xp > 0 || Object.keys(state.mine).length > 0;
      openModal(`<div class="row"><h2 style="margin:0">Carregar progresso</h2><span class="spacer"></span><button class="icon-btn" data-close aria-label="Fechar">✕</button></div>
        <div class="card" style="margin:12px 0"><div class="muted small">Dados encontrados${exportedAt ? " (salvos em " + new Date(exportedAt).toLocaleString("pt-BR") + ")" : ""}${data.name ? " — " + esc(data.name) : ""}</div><div>${summary(data)}</div></div>
        ${hasLocal ? `<div class="card" style="margin:0 0 12px"><div class="muted small">Progresso atual deste navegador</div><div>${summary(state)}</div></div>
          <p class="small"><b>Mesclar</b> junta os dois (fica com o melhor de cada um). <b>Substituir</b> apaga o progresso deste navegador.</p>` : ""}
        <div class="row"><span class="spacer"></span><button class="btn ghost" data-close>Cancelar</button>
        ${hasLocal ? `<button class="btn" id="imp-replace">Substituir</button><button class="btn primary" id="imp-merge">Mesclar</button>` : `<button class="btn primary" id="imp-replace">Carregar</button>`}</div>`, (mm) => {
        $("#imp-replace", mm).addEventListener("click", () => { applyImport(data, "replace"); closeModal(); if (after) after(true); else route(); });
        const mg = $("#imp-merge", mm); if (mg) mg.addEventListener("click", () => { applyImport(data, "merge"); closeModal(); if (after) after(true); else route(); });
        $$("[data-close]", mm).forEach((b) => b.addEventListener("click", () => { if (after) setTimeout(() => after(false), 0); }));
      });
    }).catch(() => { toast("❌ Não foi possível ler os dados. Verifique o arquivo, link ou código."); if (after) after(false); });
  }
  async function copyText(text, okMsg) {
    try { await navigator.clipboard.writeText(text); toast(okMsg); return true; }
    catch (e) { return false; }
  }
  function backupModal() {
    openModal(`<div class="row"><h2 style="margin:0">💾 Salvar e transferir progresso</h2><span class="spacer"></span><button class="icon-btn" data-close aria-label="Fechar">✕</button></div>
      <p class="muted small">Seu progresso (XP, lições, flashcards, meu dicionário e anotações) fica salvo só neste navegador. Use uma das opções para levá-lo a outro navegador ou aparelho.</p>
      <div class="card"><h3>📁 Arquivo JSON</h3><p class="small muted">Baixe o arquivo e, no outro navegador, carregue-o aqui. Bom para guardar como backup (Drive, e-mail…).</p>
        <div class="row"><button class="btn small primary" id="bk-file">⬇ Baixar arquivo .json</button><label class="btn small" for="bk-load">⬆ Carregar arquivo</label><input type="file" id="bk-load" accept=".json,application/json" hidden></div></div>
      <div class="card"><h3>🔗 Link de transferência</h3><p class="small muted">Copie o link e abra-o no outro navegador (mande para você pelo WhatsApp ou e-mail). Os dados vão dentro do próprio link; nada é enviado para um servidor.</p>
        <div class="row"><button class="btn small primary" id="bk-link">🔗 Copiar link</button><button class="btn small" id="bk-code">📋 Copiar código</button></div>
        <textarea id="bk-out" rows="3" readonly hidden style="margin-top:8px;font-size:.75rem"></textarea></div>
      <div class="card"><h3>📥 Colar código ou link</h3><p class="small muted">Recebeu um código, link ou o texto JSON? Cole aqui.</p>
        <textarea id="bk-in" rows="3" placeholder="Cole aqui o código, o link ou o JSON…" style="font-size:.8rem"></textarea>
        <div class="row" style="margin-top:8px"><span class="spacer"></span><button class="btn small primary" id="bk-paste">Carregar</button></div></div>`, (m) => {
      $("#bk-file", m).addEventListener("click", () => {
        download("ingles-medico-" + (state.name ? slug(state.name) + "-" : "") + dayStr() + ".json", JSON.stringify(backupPackage(), null, 1), "application/json");
        markBackup(); toast("⬇ Arquivo salvo! Guarde-o em um lugar seguro.");
      });
      $("#bk-load", m).addEventListener("change", (e) => { const f = e.target.files[0]; if (f) f.text().then((t) => confirmImport(t)); });
      const show = (text) => { const o = $("#bk-out", m); o.hidden = false; o.value = text; o.focus(); o.select(); };
      $("#bk-link", m).addEventListener("click", async () => {
        const link = location.href.split("#")[0] + "#/import/" + await encodeCode(backupPackage());
        markBackup(); show(link);
        if (!(await copyText(link, "🔗 Link copiado! Abra-o no outro navegador."))) toast("Copie o link selecionado abaixo.");
      });
      $("#bk-code", m).addEventListener("click", async () => {
        const code = await encodeCode(backupPackage());
        markBackup(); show(code);
        if (!(await copyText(code, "📋 Código copiado! Cole-o no outro navegador."))) toast("Copie o código selecionado abaixo.");
      });
      $("#bk-paste", m).addEventListener("click", () => confirmImport($("#bk-in", m).value));
    });
  }
  ROUTES.import = function (code) {
    ROUTES.learn();
    history.replaceState(null, "", location.pathname + location.search + "#/learn");
    if (code) confirmImport(code, (ok) => { route(); if (!ok) onboarding(); });
  };

  ROUTES.resources = function () {
    view.innerHTML = `<a href="#/profile" class="small">← Perfil</a><div class="section-head" style="margin-top:8px"><h1>📎 Recursos e fontes</h1>
      <p class="muted">O conteúdo da plataforma foi baseado nos materiais de Inglês Médico (Human Body – Head, Axial Skeleton, Facial Muscles, Radiography) e ampliado com informações de fontes oficiais como MedlinePlus (NIH/NLM), OMS, CDC e American Heart Association.</p></div>
      ${RESOURCES.map((g) => `<div class="card"><h3>${esc(g.group)}</h3>${g.items.map(([n, url, d]) => `<div class="res-item">${url ? `<a href="${esc(url)}" target="_blank" rel="noopener"><b>${esc(n)}</b></a>` : `<b>${esc(n)}</b>`}<div class="muted small">${esc(d)}</div></div>`).join("")}</div>`).join("")}
      <div class="card"><h3>💡 Dicas de estudo</h3><ul>
        <li><b>Escute</b> a pronúncia e leia o guia “como se fala”.</li>
        <li><b>Fale</b> em voz alta — grave sua voz e compare.</li>
        <li><b>Imite</b> os falantes nativos: posição da língua e dos lábios.</li>
        <li><b>Escreva</b> as palavras novas várias vezes.</li>
        <li><b>Revise</b> todo dia: a repetição espaçada faz o trabalho pesado.</li>
        <li>Coloque o vocabulário no seu <b>dia a dia</b>: pense em inglês durante o plantão!</li>
        <li>Faça um <b>teste de nivelamento</b> (British Council ou Cambridge) para saber seu nível CEFR (A1–C2).</li></ul></div>`;
  };

  /* ---------- Boas-vindas ---------- */
  function onboarding() {
    if (state.onboarded) return;
    openModal(`<div style="text-align:center"><div style="font-size:3rem">🩺</div><h1>Bem-vindo(a) ao Inglês Médico!</h1>
      <p class="muted">Aprenda inglês médico com lições curtas, flashcards, casos clínicos e seu próprio dicionário.</p></div>
      <form id="ob"><div class="field"><label for="ob-name">Como você quer ser chamado(a)?</label><input type="text" id="ob-name" placeholder="Ex.: Dra. Ana"></div>
      <div class="field"><label for="ob-goal">Meta diária</label><select id="ob-goal"><option value="10">10 XP · 5 min/dia</option><option value="20">20 XP · 10 min/dia</option><option value="30" selected>30 XP · 15 min/dia</option><option value="50">50 XP · 25 min/dia</option></select></div>
      <div class="field"><label for="ob-level">Seu inglês hoje</label><select id="ob-level"><option value="0">Iniciante — quero começar do zero</option><option value="1">Já tenho base — liberar todas as unidades</option></select></div>
      <button class="btn primary" style="width:100%" type="submit">Começar 🚀</button></form>`, (m) => {
      $("#ob", m).addEventListener("submit", (e) => {
        e.preventDefault();
        state.name = $("#ob-name", m).value.trim(); state.settings.goal = Number($("#ob-goal", m).value);
        state.settings.free = $("#ob-level", m).value === "1"; state.onboarded = true; save(); closeModal(); route();
      });
    });
  }

  /* ======================= Início ======================= */
  document.addEventListener("click", (e) => { if (e.target.closest("[data-backup]")) backupModal(); });
  applyTheme();
  const openedByLink = location.hash.startsWith("#/import/");
  route();
  if (!openedByLink) onboarding();
})();
