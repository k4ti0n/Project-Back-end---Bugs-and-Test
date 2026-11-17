(function () {
  /* ====== Edite aqui ====== */
  const REPO_URL = "#"; // link do repositório (a equipe agora é editada no index.html)

  /* ====== Texturas de pixel geradas no navegador ====== */
  function tile(rgb, spread, seed) {
    const c = document.createElement("canvas");
    c.width = c.height = 16;
    const g = c.getContext("2d");
    let s = seed;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const d = (rnd() - 0.5) * spread;
      g.fillStyle = "rgb(" + rgb.map(v => Math.max(0, Math.min(255, v + d)) | 0).join(",") + ")";
      g.fillRect(x, y, 1, 1);
    }
    return "url(" + c.toDataURL() + ")";
  }
  const root = document.documentElement.style;
  root.setProperty("--dirt", tile([123, 84, 51], 40, 7));
  root.setProperty("--stone", tile([128, 128, 128], 36, 3));
  root.setProperty("--deep", tile([62, 62, 74], 28, 11));
  root.setProperty("--grass", tile([93, 161, 48], 44, 5));

  /* ====== Links do repositório ====== */
  ["repoLink", "repoLink2"].forEach(id => { const a = document.getElementById(id); if (a) a.href = REPO_URL; });

  /* ====== Frase na logo ====== */
  const phrases = ["Bug esmagado!", "Agora com histórico!", "Teste antes de resolver!", "Sem print perdido!", "Cuidado com o creeper!", "Feito com FastAPI!"];
  let pi = 0;
  const splash = document.getElementById("splash");
  splash.addEventListener("click", () => { pi = (pi + 1) % phrases.length; splash.textContent = phrases[pi]; });

  /* ====== Inventário: tabelas do banco (models.py) ====== */
  const TABLES = [
    { icon: "⚙️", nome: "Engines", t: "engines", desc: "Os motores usados para criar os jogos.",
      campos: [["Engine_ID", "número"], ["Name_Engine", "texto"]], rel: "Ligada aos jogos por association_project_and_engine." },
    { icon: "🎮", nome: "Jogos", t: "projecting_documentation", desc: "Cada jogo em desenvolvimento e seu status.",
      campos: [["Game_ID", "número"], ["Game_Name", "texto"], ["Game_Status", "texto"]], rel: "Cada bug pertence a um jogo." },
    { icon: "🛠️", nome: "Funções", t: "functions", desc: "Os papéis da equipe, como testador ou programador.",
      campos: [["Function_ID", "número"], ["Name_Function", "texto"]], rel: "Ligada aos profissionais por function_professional." },
    { icon: "🧑", nome: "Profissionais", t: "professionals", desc: "Quem reporta, corrige e testa os bugs.",
      campos: [["Professional_ID", "número"], ["Nome", "texto"], ["Active", "sim ou não"]], rel: "Pode ser quem reportou ou o responsável por um bug." },
    { icon: "🐞", nome: "Bugs", t: "documentation_bug", desc: "O registro completo do bug: onde, por quê e como reproduzir.",
      campos: [["Documentation_Bug_ID", "número"], ["Date_Reported", "data"], ["Place_game", "texto"], ["cause", "texto, opcional"], ["Step_Reproduction", "texto"], ["Game_ID", "jogo"], ["Reported_ID", "quem reportou"], ["Responsible_ID", "responsável"]], rel: "Cada mudança gera uma linha no histórico." },
    { icon: "📜", nome: "Histórico", t: "bug_history", desc: "Cada mudança de status, com data e autor.",
      campos: [["History_ID", "número"], ["Documentation_Bug_ID", "bug"], ["Change_Date", "data"], ["Status_Situation", "texto"], ["Professional_ID", "autor"]], rel: "Responde quem mudou o quê e quando." }
  ];
  const slots = document.getElementById("slots"), tip = document.getElementById("tip");
  function showTable(i) {
    const d = TABLES[i];
    [...slots.children].forEach((b, k) => b.setAttribute("aria-selected", k === i));
    tip.innerHTML = "<h3>" + d.nome + "</h3><p class='tn'>tabela " + d.t + "</p><p>" + d.desc + "</p><br><ul>" +
      d.campos.map(c => "<li>" + c[0] + "<small>" + c[1] + "</small></li>").join("") + "</ul><p class='rel'>" + d.rel + "</p>";
  }
  TABLES.forEach((d, i) => {
    const b = document.createElement("button");
    b.className = "slot"; b.type = "button"; b.textContent = d.icon;
    b.setAttribute("role", "tab"); b.setAttribute("aria-label", d.nome); b.title = d.nome;
    b.addEventListener("click", () => showTable(i));
    slots.appendChild(b);
  });
  showTable(4);

  /* ====== Demo da regra de negócio ====== */
  const $ = id => document.getElementById(id);
  const st = { status: "aberto", test: "nenhum" };
  const who = ["Bruno", "Maya"];
  function say(text, cls) { const p = document.createElement("p"); if (cls) p.className = cls; p.textContent = text; $("msg").prepend(p); while ($("msg").children.length > 4) $("msg").lastChild.remove(); }
  function logHist(txt, by) {
    const h = $("hist"); if (h.firstChild && !h.firstChild.dataset.r) h.innerHTML = "";
    const li = document.createElement("li"); li.dataset.r = 1;
    li.textContent = new Date().toLocaleDateString("pt-BR") + " · " + txt + " · " + by;
    h.prepend(li);
  }
  function render() {
    const hp = st.status === "resolvido" ? 0 : st.test === "aprovado" ? 30 : st.status === "em andamento" ? 60 : 100;
    $("bossFill").style.width = hp + "%"; $("boss").setAttribute("aria-valuenow", hp);
    const s = $("status"); s.textContent = st.status; s.className = "pill " + (st.status === "aberto" ? "aberto" : st.status === "em andamento" ? "andamento" : "resolvido");
    $("testState").textContent = st.test;
    $("bAnd").disabled = st.status !== "aberto";
    $("bOk").disabled = $("bFail").disabled = st.status !== "em andamento";
  }
  $("bAnd").onclick = () => { st.status = "em andamento"; logHist("em andamento", who[0]); say("Correção iniciada por " + who[0] + ".", "warn"); render(); };
  $("bOk").onclick = () => { st.test = "aprovado"; logHist("teste aprovado", who[1]); say("Teste aprovado. Agora o bug pode ser resolvido.", "ok"); render(); };
  $("bFail").onclick = () => { st.test = "reprovado"; logHist("teste reprovado", who[1]); say("Teste reprovado. O bug continua em andamento.", "sys"); render(); };
  $("bRes").onclick = () => {
    if (st.test !== "aprovado") {
      say("Não dá para resolver: falta um teste aprovado.", "sys");
      const d = document.querySelector(".demo"); d.classList.remove("shake"); void d.offsetWidth; d.classList.add("shake");
      return;
    }
    st.status = "resolvido"; logHist("resolvido", who[0]); say("Bug derrotado! Registrado no histórico.", "ok"); render();
    $("bRes").disabled = true;
  };
  $("bReset").onclick = () => {
    st.status = "aberto"; st.test = "nenhum"; $("bRes").disabled = false;
    $("hist").innerHTML = "<li>Nenhuma mudança registrada ainda.</li>"; $("msg").innerHTML = ""; say("Simulação reiniciada.", "warn"); render();
  };
  render();

  /* ====== Equipe ====== */
  function head(seed) {
    const c = document.createElement("canvas"); c.width = c.height = 8;
    const g = c.getContext("2d");
    const skins = ["#f1c9a5", "#c68e63", "#8d5a3b", "#e8b48a"], hairs = ["#2b1b10", "#6b3e1d", "#d6a93a", "#1f1f2e"];
    const skin = skins[seed % 4], hair = hairs[(seed * 3 + 1) % 4];
    g.fillStyle = skin; g.fillRect(0, 0, 8, 8);
    g.fillStyle = hair; g.fillRect(0, 0, 8, 2); g.fillRect(0, 2, 1, 1); g.fillRect(7, 2, 1, 1);
    g.fillStyle = "#fff"; g.fillRect(1, 4, 2, 1); g.fillRect(5, 4, 2, 1);
    g.fillStyle = "#3a5fcd"; g.fillRect(2, 4, 1, 1); g.fillRect(5, 4, 1, 1);
    g.fillStyle = "#8a5a44"; g.fillRect(3, 6, 2, 1);
    return c;
  }
  // Os nomes ficam no index.html. Aqui só desenhamos a cabeça de cada .skin
  document.querySelectorAll("#teamGrid .skin").forEach((el, i) => {
    const seed = parseInt(el.dataset.skin, 10) || i + 1;
    el.replaceWith(head(seed));
  });

  /* ====== Coordenada Y (cava conforme rola) e hotbar ativa ====== */
  const y = $("yLevel"), links = [...document.querySelectorAll(".hotbar a")];
  const secs = links.map(a => document.querySelector(a.getAttribute("href")));
  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    y.textContent = Math.round(64 - (max > 0 ? scrollY / max : 0) * 124);
    let cur = -1; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.4) cur = i; });
    links.forEach((a, i) => a.classList.toggle("on", i === cur));
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();