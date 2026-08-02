/* 온말 홈페이지 공용 스크립트 — 테마 토글 + 언어 전환 + 데모 자막.
   법적 문서 페이지도 이 파일을 씁니다(그쪽엔 언어 선택기와 데모가 없어도 조용히 지나갑니다).
   HTML 원문이 곧 한국어 번역본입니다 — ko 는 fetch 없이 원문 복원으로 처리합니다. */
(function () {
  "use strict";

  /* ── 테마 ────────────────────────────────────────────────────────────
     초기 적용은 <head> 의 인라인 스크립트가 렌더 전에 끝냈습니다. 여기서는 토글만. */
  var themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("onmal-theme", next); } catch (e) { /* 사생활 모드 등 */ }
    });
  }

  /* ── 언어 ──────────────────────────────────────────────────────────── */
  // 스팀 Full Platform Support 31개. 표시 이름은 그 언어 사용자가 읽는 이름입니다.
  var LANGS = [
    ["ko", "한국어"], ["en", "English"], ["ja", "日本語"], ["zh-cn", "简体中文"],
    ["zh-tw", "繁體中文"], ["ru", "Русский"], ["es", "Español"], ["es-419", "Español (Latam)"],
    ["pt-br", "Português (Brasil)"], ["pt", "Português"], ["fr", "Français"], ["de", "Deutsch"],
    ["it", "Italiano"], ["pl", "Polski"], ["tr", "Türkçe"], ["uk", "Українська"],
    ["vi", "Tiếng Việt"], ["th", "ไทย"], ["id", "Bahasa Indonesia"], ["ms", "Bahasa Melayu"],
    ["ar", "العربية"], ["nl", "Nederlands"], ["sv", "Svenska"], ["no", "Norsk"],
    ["da", "Dansk"], ["fi", "Suomi"], ["cs", "Čeština"], ["hu", "Magyar"],
    ["ro", "Română"], ["el", "Ελληνικά"], ["bg", "Български"]
  ];
  var CODES = LANGS.map(function (l) { return l[0]; });

  // 브라우저 언어 → 우리 코드. 못 찾으면 null.
  function normalize(raw) {
    var c = String(raw || "").toLowerCase();
    if (!c) { return null; }
    if (c === "zh-tw" || c === "zh-hk" || c === "zh-mo" || c === "zh-hant") { return "zh-tw"; }
    if (c.indexOf("zh") === 0) { return "zh-cn"; }
    if (c === "pt-br") { return "pt-br"; }
    if (c === "nb" || c === "nn" || c.indexOf("nb-") === 0 || c.indexOf("nn-") === 0) { return "no"; }
    if (CODES.indexOf(c) >= 0) { return c; }
    var parts = c.split("-");
    // 중남미 스페인어권은 es-419 로.
    if (parts[0] === "es" && parts[1] &&
        "mx ar cl co pe ve ec gt cu bo do hn py sv ni cr pa uy pr us".indexOf(parts[1]) >= 0) {
      return "es-419";
    }
    return CODES.indexOf(parts[0]) >= 0 ? parts[0] : null;
  }

  // 원문(한국어) 스냅샷. ko 로 돌아올 때 fetch 없이 복원합니다.
  var tagged = Array.prototype.slice.call(
    document.querySelectorAll("[data-i18n],[data-i18n-html]"));
  var original = tagged.map(function (el) {
    return el.hasAttribute("data-i18n-html") ? el.innerHTML : el.textContent;
  });
  var originalTitle = document.title;
  var descMeta = document.querySelector('meta[name="description"]');
  var originalDesc = descMeta ? descMeta.getAttribute("content") : "";

  /* 제목·설명 키는 페이지마다 달라야 합니다. 모든 페이지가 한 벌의 사전을 공유하므로
     스코프 없이 "meta.title" 을 쓰면 법적 문서 페이지가 첫 화면의 제목을 가져갑니다.
     <html data-i18n-scope="lic"> 이면 "lic.meta.title" 을 먼저 찾습니다. */
  var scope = document.documentElement.getAttribute("data-i18n-scope");
  var titleKey = scope ? scope + ".meta.title" : "meta.title";
  var descKey = scope ? scope + ".meta.desc" : "meta.desc";

  var dict = null;   // 현재 언어 사전. null 이면 한국어 원문.

  function render() {
    tagged.forEach(function (el, i) {
      var key = el.getAttribute("data-i18n") || el.getAttribute("data-i18n-html");
      var value = dict ? dict[key] : null;
      if (el.hasAttribute("data-i18n-html")) {
        el.innerHTML = value != null ? value : original[i];
      } else {
        el.textContent = value != null ? value : original[i];
      }
    });
    document.title = (dict && dict[titleKey]) || originalTitle;
    if (descMeta) { descMeta.setAttribute("content", (dict && dict[descKey]) || originalDesc); }
  }

  function apply(code) {
    document.documentElement.lang = code;
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    if (code === "ko") { dict = null; render(); return; }
    fetch("i18n/" + code + ".json")
      .then(function (r) { if (!r.ok) { throw new Error(r.status); } return r.json(); })
      .then(function (d) { dict = d; render(); })
      .catch(function () { dict = null; render(); });   // 파일이 없으면 한국어 원문 유지
  }

  var lang = null;
  try { lang = localStorage.getItem("onmal-lang"); } catch (e) { /* 무시 */ }
  if (!lang || CODES.indexOf(lang) < 0) {
    var candidates = navigator.languages || [navigator.language];
    for (var i = 0; i < candidates.length && !lang; i++) { lang = normalize(candidates[i]); }
    lang = lang || "en";
  }

  var sel = document.getElementById("langSel");
  if (sel) {
    LANGS.forEach(function (l) {
      var option = document.createElement("option");
      option.value = l[0];
      option.textContent = l[1];
      sel.appendChild(option);
    });
    sel.value = lang;
    sel.addEventListener("change", function () {
      try { localStorage.setItem("onmal-lang", sel.value); } catch (e) { /* 무시 */ }
      apply(sel.value);
    });
  }

  if (lang !== "ko") { apply(lang); } else { apply("ko"); }

  /* ── 실제 화면 탭 ────────────────────────────────────────────────────
     상태는 .shots 의 data-shot <b>한 곳</b>에만 둡니다. 어떤 그림과 어떤 캡션이
     보일지는 전부 CSS 가 정합니다 — 여기서 img.src 를 갈아끼우면 테마 전환과
     두 곳에서 같은 것을 다투게 되고, 라이트에서 다크 화면이 뜨는 식으로 어긋납니다.

     ⚠️ 이 블록은 데모 자막보다 <b>위</b>에 있어야 합니다. 아래쪽은 #subs 가 없으면
        return 으로 함수를 빠져나가므로, 법적 문서 페이지가 아니어도 순서가 바뀌면
        조용히 안 걸립니다. */
  var shots = document.querySelector(".shots");
  if (shots) {
    var tabs = Array.prototype.slice.call(shots.querySelectorAll(".stab"));
    var select = function (btn, focus) {
      shots.setAttribute("data-shot", btn.getAttribute("data-shot"));
      tabs.forEach(function (b) {
        var on = b === btn;
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.tabIndex = on ? 0 : -1;          // 로빙 탭인덱스 — 탭 줄 전체가 한 정거장
      });
      if (focus) { btn.focus(); }
    };
    /* 사람이 탭을 직접 골랐는가. 골랐다면 스크롤이 그 위를 덮어쓰지 않습니다 —
       덮어쓰면 탭이 <b>눌리지 않는 것처럼</b> 보입니다(눌리자마자 되돌아가므로). */
    var picked = false;

    tabs.forEach(function (btn, i) {
      btn.tabIndex = btn.getAttribute("aria-selected") === "true" ? 0 : -1;
      btn.addEventListener("click", function () { picked = true; select(btn, false); });
      btn.addEventListener("keydown", function (e) {
        var step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!step) { return; }
        e.preventDefault();
        picked = true;
        select(tabs[(i + step + tabs.length) % tabs.length], true);
      });
    });

    /* ── 스크롤이 곧 재생 ────────────────────────────────────────────────
       #shots 가 화면에 붙어 있는 동안, 지나온 만큼에 따라 홈 → 설정 → 정보 로
       넘깁니다. 영상을 넘기듯이.

       🔴 바꾸는 것은 <b>data-shot 한 곳</b>뿐입니다. 어떤 그림과 어떤 캡션이 보일지는
          여기서 정하지 않습니다 — CSS 가 정합니다. img.src 를 건드리면 테마 전환과
          두 곳이 같은 것을 다투게 되고, 라이트에서 다크 화면이 뜨는 식으로 어긋납니다.
       🔴 붙이는 일은 <b>CSS 가</b> 합니다(motion.css). 여기서는 붙어 있는지 물어만
          봅니다 — 축소 모션이거나 좁은 화면이면 sticky 가 아니고, 그때는 아무 일도
          하지 않아 지금까지의 탭 동작이 그대로 남습니다. */
    var pin = shots.closest ? shots.closest(".pin") : null;
    var section = document.getElementById("shots");

    if (pin && section && window.requestAnimationFrame) {
      var queued = false;

      var advance = function () {
        queued = false;
        if (getComputedStyle(pin).position !== "sticky") { return; }

        var box = section.getBoundingClientRect();
        // 이 구간을 얼마나 지나왔는가. 붙어 있는 동안 0 → 1.
        var travel = box.height - window.innerHeight;
        if (travel <= 0) { return; }
        var progress = (0 - box.top) / travel;

        // 구간 밖으로 나가면 사람이 고른 것을 잊습니다 — 다음에 다시 들어오면
        // 처음부터 재생됩니다.
        if (progress < 0 || progress > 1) { picked = false; return; }
        if (picked) { return; }

        var i = Math.min(tabs.length - 1, Math.floor(progress * tabs.length));
        if (tabs[i] && tabs[i].getAttribute("aria-selected") !== "true") {
          select(tabs[i], false);
        }
      };

      var onScroll = function () {
        if (queued) { return; }
        queued = true;
        window.requestAnimationFrame(advance);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      advance();
    }
  }

  /* ── 데모 자막 ──────────────────────────────────────────────────────
     src(외국어)는 고정, dst(번역)는 지금 보고 있는 언어를 따라갑니다. */
  var DEMO_SRC = [
    { lang: "ru",    src: "Двое заходят на точку B" },
    { lang: "ja",    src: "回復アイテム持ってる？" },
    { lang: "pt-BR", src: "Cuidado, sniper na torre" },
    { lang: "es",    src: "Voy a rotar por el túnel" },
    { lang: "de",    src: "Ich brauche Munition, bitte" },
    { lang: "vi",    src: "Đợi tôi, tôi đang hồi máu" }
  ];
  var DEMO_KO = [
    "적 두 명이 B사이트로 들어가고 있어",
    "회복 아이템 가진 사람 있어?",
    "조심해, 저격수가 탑에 있어",
    "터널 쪽으로 돌아갈게",
    "탄약이 필요해, 부탁해",
    "기다려줘, 지금 회복 중이야"
  ];
  function demoDst(i) {
    return (dict && dict["demo.l" + (i + 1)]) || DEMO_KO[i];
  }

  var host = document.getElementById("subs");
  if (!host) { return; }   // 법적 문서 페이지에는 데모가 없습니다

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var index = 0;
  var shown = [];

  function renderDemo() {
    host.innerHTML = "";
    shown.forEach(function (item, idx) {
      var el = document.createElement("div");
      el.className = "sub" + (idx === 0 && shown.length > 1 ? " old" : "");
      var langEl = document.createElement("span");
      langEl.className = "lang";
      langEl.textContent = item.lang;
      var txEl = document.createElement("span");
      txEl.className = "tx" + (item.stage === "src" ? " src" : "");
      txEl.textContent = item.stage === "src" ? item.src : demoDst(item.i);
      el.appendChild(langEl);
      el.appendChild(txEl);
      host.appendChild(el);
    });
  }

  function push() {
    var i = index % DEMO_SRC.length;
    var entry = { i: i, lang: DEMO_SRC[i].lang, src: DEMO_SRC[i].src, stage: "src" };
    shown.push(entry);
    if (shown.length > 2) { shown.shift(); }
    renderDemo();
    setTimeout(function () { entry.stage = "dst"; renderDemo(); }, reduce ? 0 : 620);
    index++;
  }

  push();
  if (!reduce) {
    setTimeout(push, 1800);
    setInterval(push, 3400);
  } else {
    shown = [{ i: 0, lang: DEMO_SRC[0].lang, stage: "dst" },
             { i: 1, lang: DEMO_SRC[1].lang, stage: "dst" }];
    renderDemo();
  }
})();
