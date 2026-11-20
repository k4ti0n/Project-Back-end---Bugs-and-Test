(function () {
  const REPO_URL = "#"; // link do repositório
  const $ = id => document.getElementById(id);
  document.documentElement.classList.add("js");

  /* Transição entre telas: cada seção "entra" quando aparece na tela */
  const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("in", e.isIntersecting)), { threshold: 0.2 });
  document.querySelectorAll(".sec").forEach(s => io.observe(s));


  /* Texturas de pixel geradas no navegador */
  function tile(rgb, spread, seed) {
    const c = document.createElement("canvas"); c.width = c.height = 16;
    const g = c.getContext("2d"); let s = seed;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const d = (rnd() - 0.5) * spread;
      g.fillStyle = "rgb(" + rgb.map(v => Math.max(0, Math.min(255, v + d)) | 0).join(",") + ")";
      g.fillRect(x, y, 1, 1);
    }
    return "url(" + c.toDataURL() + ")";
  }
  const st = document.documentElement.style;
  st.setProperty("--nether", tile([112, 40, 40], 56, 7));
  st.setProperty("--obs", tile([26, 18, 44], 26, 3));
  st.setProperty("--black", tile([62, 58, 68], 26, 11));
  st.setProperty("--plank", tile([168, 121, 63], 30, 5));
  $("repoLink").href = REPO_URL;

  /* Itens do Minecraft redesenhados em pixel art (16x16). Cada letra é uma cor da paleta. */
  const PAL = { k: "#17141c", w: "#fff", g: "#9a9a9a", G: "#555", K: "#2a2a2a", b: "#9a6a35", B: "#5a3a1a", d: "#2fcfbf", D: "#16897f", l: "#b8fff6", r: "#d9302a", R: "#7d1511", y: "#ffd33b", e: "#5da130", E: "#3f7a22", n: "#7b5433", N: "#5a3b20", c: "#f2e6c0", C: "#c8b88a", S: "#7ab8ff" };
  const ITEMS = {
    pickaxe: [1, ["...kkkkkk.......", "..kdllllddk.....", ".kdlDDDDDddk....", ".kdDkkkkkDDdk...", ".kkk...kbkDDk...", ".......kbk.kDk..", "......kbk..kDk..", ".....kbk....kk..", "....kbk.........", "...kbk..........", "..kbk...........", ".kBk............", ".kk............."]],
    sword: [0, ["..............kk", ".............kdk", "............kdlk", "...........kdlk.", "..........kdlk..", ".........kdlk...", "........kdlk....", ".k.....kdlk.....", ".kk...kdlk......", "..kk.kdlk.......", "...kkdlk........", "...kbkk.........", "..kbk...........", ".kBk............", ".kk............."]],
    spidereye: [3, ["......kkkk......", "....kkRrrRkk....", "...kRrrrrrrRk...", "..kRrrrrrrrrRk..", "..kRrrkkkkrrRk..", "..kRrrkkkkrrRk..", "..kRrrrrrrrrRk..", "...kRrrrrrrRk...", "....kkRRRRkk....", "......kkkk......"]],
    book: [2, ["..kkkkkkkkkkkk..", "..kBbbbbbbbbbk..", "..kBbbbyyybbbk..", "..kBbbbbybbbbk..", "..kBbbbbybbbbk..", "..kBbbbbybbbbk..", "..kBbbbbbbbbbk..", "..kBbbbbbbbbbk..", "..kcccccccccck..", "..kCCCCCCCCCCk..", "..kkkkkkkkkkkk.."]],
    redstone: [4, ["......rrrr......", "....rrRrrrrr....", "...rrrrrRrrrr...", "..rrRrrrrrrrrr..", "..rrrrrrrRrrrr..", "...rrrRrrrrrr...", "....rrrrrRrr....", ".....rrrrrr.....", "......rrrr......"]],
    compass: [3, ["....kkkkkkkk....", "...kggggggggk...", "..kggggrrggggk..", "..kggggrrggggk..", "..kggggrrggggk..", "..kggggGGggggk..", "..kggggGGggggk..", "..kggggGGggggk..", "...kggggggggk...", "....kkkkkkkk...."]],
    clock: [3, ["....kkkkkkkk....", "...kyyyyyyyyk...", "..kyccccccccyk..", "..kycccKccccyk..", "..kycccKccccyk..", "..kycccKKKKcyk..", "..kyccccccccyk..", "..kyccccccccyk..", "...kyyyyyyyyk...", "....kkkkkkkk...."]],
    grass: [2, ["kkkkkkkkkkkkkkkk", "keeeeEeeeeeEeeek", "keEeeeeeeEeeeeEk", "keeeEeeeeeeEeeek", "kenEeEenEeeEnEek", "knnNnnnnNnnnnNnk", "knNnnnnNnnnNnnnk", "knnnnNnnnnnnNnnk", "kNnnnnnNnnNnnnnk", "knnNnnnnnnnnnNnk", "knnnnNnnNnnnnnnk", "kkkkkkkkkkkkkkkk"]],
    tnt: [1, ["kkkkkkkkkkkkkkkk", "krrrrrrrrrrrrrrk", "kRrrrRrrrrRrrrRk", "krrrrrrrrrrrrrrk", "kwwwwwwwwwwwwwwk", "kwkkkwkwkwkwkkwk", "kwwkwwkwwwkwkwwk", "kwwkwwkwwwkwkwwk", "kwwwwwwwwwwwwwwk", "krrrrrrrrrrrrrrk", "kRrrrRrrrrRrrrRk", "krrrrrrrrrrrrrrk", "kkkkkkkkkkkkkkkk"]],
    nametag: [3, ["......kkkk......", ".....k....k.....", "....k......k....", "....kk....kk....", "..kkkkkkkkkkkk..", "..kcccccccccck..", "..kcCCcCCcCCck..", "..kcccccccccck..", "..kkkkkkkkkkkk.."]],
    painting: [2, ["kkkkkkkkkkkkkkkk", "kbbbbbbbbbbbbbbk", "kbSSSSSSSSSSSSbk", "kbSSSSSSSSSyySbk", "kbSSSSSSSSSyySbk", "kbSSSSeeSSSSSSbk", "kbSSSeeeeSSSSSbk", "kbeeeeeeeeEeeebk", "kbEeeeeeEeeeEebk", "kbeeEeeeeeeeEebk", "kbbbbbbbbbbbbbbk", "kkkkkkkkkkkkkkkk"]]
  };
  const cache = {};
  function sprite(n) {
    if (cache[n] || !ITEMS[n]) return cache[n];
    const c = document.createElement("canvas"); c.width = c.height = 16;
    const x = c.getContext("2d");
    ITEMS[n][1].forEach((row, i) => [...row].forEach((ch, j) => { if (PAL[ch]) { x.fillStyle = PAL[ch]; x.fillRect(j, ITEMS[n][0] + i, 1, 1); } }));
    return (cache[n] = "url(" + c.toDataURL() + ")");
  }
  document.querySelectorAll("[data-item]").forEach(el => { el.style.backgroundImage = sprite(el.dataset.item); });


  /* Portal do Nether */
  const cv = $("portal"), g = cv.getContext("2d"), W = 32, H = 48;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let seed = 9; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const img = g.createImageData(W, H), px = img.data;
  function frame(t) {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const v = Math.sin(x * .5 + t * .9) + Math.sin(y * .33 - t * .6) + Math.sin((x + y) * .28 + t * .4);
      const f = .5 + (v + 3) / 6 * .7, i = (y * W + x) * 4, spark = rnd() < .025;
      px[i] = spark ? 233 : 110 * f; px[i + 1] = spark ? 210 : 40 * f; px[i + 2] = spark ? 255 : 210 * f; px[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  }
  frame(0);
  let heroOn = true;
  new IntersectionObserver(e => { heroOn = e[0].isIntersecting; }).observe(document.querySelector(".hero"));
  if (!still) { let t = 0; setInterval(() => { if (heroOn && !document.hidden) frame(t += .35); }, 100); }

  /* Circuito de redstone: a lâmpada só acende com teste aprovado */
  let test = false, lit = false, timer;
  const say = (txt, cls) => { const p = document.createElement("p"); if (cls) p.className = cls; p.textContent = txt; $("msg").prepend(p); while ($("msg").children.length > 3) $("msg").lastChild.remove(); };
  $("lever").onclick = () => {
    test = !test; $("lever").setAttribute("aria-pressed", test); $("w1").classList.toggle("on", test);
    say(test ? "Teste aprovado ligado. Agora o bug pode ser resolvido." : "Teste desligado.", test ? "good" : "");
  };
  $("press").onclick = () => {
    $("w2").classList.add("on"); clearTimeout(timer); timer = setTimeout(() => $("w2").classList.remove("on"), 700);
    if (!test) {
      say("Sem teste aprovado, a lâmpada não acende.", "bad");
      const c = $("circuit"); c.classList.remove("shake"); void c.offsetWidth; c.classList.add("shake"); return;
    }
    lit = true; $("w3").classList.add("on"); $("lamp").classList.add("on"); say("Bug resolvido! A lâmpada acendeu.", "good");
  };
  $("reset").onclick = () => {
    test = lit = false; $("lever").setAttribute("aria-pressed", false);
    ["w1", "w2", "w3", "lamp"].forEach(i => $(i).classList.remove("on")); $("msg").innerHTML = ""; say("Circuito reiniciado.");
  };

  /* Barra de XP: enche ao rolar a página */
  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight, p = max > 0 ? Math.min(1, scrollY / max) : 0;
    $("xpf").style.width = p * 100 + "%"; $("lvl").textContent = Math.round(p * 30);
    $("yLevel").textContent = Math.round(64 - p * 124); // cava conforme rola
    let cur = -1; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.4) cur = i; });
    links.forEach((a, i) => a.classList.toggle("on", i === cur));
  }
  const links = [...document.querySelectorAll(".hotbar a")], secs = links.map(a => document.querySelector(a.getAttribute("href")));
  let tick = false;
  addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; onScroll(); }); } }, { passive: true });
  onScroll();
})();
