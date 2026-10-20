/* Shared navigation for the static policy and notice pages. */
(function () {
  'use strict';
  var page = document.documentElement.getAttribute('data-document-page');
  var labels = {
    ko: { home: '← 홈페이지', language: '언어', privacy: '개인정보 처리방침', terms: '이용약관', licenses: '오픈소스 라이선스', notices: '웹사이트 라이선스 고지', skip: '본문으로 건너뛰기', navigation: '정책 및 고지 문서', select: '문서 표시 언어', theme: '화면 테마 변경', raw: '라이선스 원문 TXT 열기' },
    en: { home: '← Home', language: 'Language', privacy: 'Privacy Policy', terms: 'Terms of Use', licenses: 'Open-source Licenses', notices: 'Website License Notices', skip: 'Skip to content', navigation: 'Policy and notice documents', select: 'Document display language', theme: 'Change color theme', raw: 'Open original license TXT' }
  };
  var titles = { privacy: 'Privacy Policy', terms: 'Terms of Use', licenses: 'Copyright & Licenses', notices: 'Website License Notices' };
  var originalTitle = document.title;
  var tagged = Array.from(document.querySelectorAll('[data-i18n],[data-i18n-html]'));
  var original = tagged.map(function (el) { return el.hasAttribute('data-i18n-html') ? el.innerHTML : el.textContent; });
  var select = document.getElementById('documentLanguage');
  var note = document.querySelector('[data-document-language-note]');
  var language = new URLSearchParams(location.search).get('lang');
  if (language !== 'ko' && language !== 'en') {
    try { language = localStorage.getItem('onmal-lang'); } catch (e) { /* Optional preference. */ }
  }
  language = language === 'en' ? 'en' : 'ko';
  var request = 0;

  function renderTranslation(dict, lang) {
    tagged.forEach(function (el, i) {
      var key = el.getAttribute('data-i18n') || el.getAttribute('data-i18n-html');
      var value = dict && dict[key];
      if (el.hasAttribute('data-i18n-html')) { el.innerHTML = value != null ? value : original[i]; }
      else { el.textContent = value != null ? value : original[i]; }
      el.lang = value != null ? lang : 'ko';
    });
  }

  function apply(lang) {
    language = lang;
    var revision = ++request;
    var t = labels[lang];
    try { localStorage.setItem('onmal-lang', lang); } catch (e) { /* Navigation still works without storage. */ }
    document.documentElement.lang = lang;
    document.title = lang === 'en' ? titles[page] + ' — Onmal' : originalTitle;
    select.value = lang;
    select.setAttribute('aria-label', t.select);
    document.querySelectorAll('[data-document-label]').forEach(function (el) {
      el.textContent = t[el.getAttribute('data-document-label')];
      el.lang = lang;
    });
    document.querySelectorAll('[data-document-navigation]').forEach(function (el) {
      el.lang = lang;
      el.setAttribute('aria-label', t.navigation);
    });
    document.getElementById('themeBtn').setAttribute('aria-label', t.theme);
    var skip = document.querySelector('.skip');
    skip.textContent = t.skip;
    skip.lang = lang;
    document.querySelectorAll('a[href]').forEach(function (el) {
      if (el.getAttribute('href').charAt(0) === '#') { return; }
      var url = new URL(el.getAttribute('href'), location.href);
      if (url.origin === location.origin && /\/(privacy|terms|licenses|website-third-party-notices)\.html$/.test(url.pathname)) {
        url.searchParams.set('lang', lang);
        el.href = url.pathname.split('/').pop() + url.search + url.hash;
      }
    });
    note.lang = lang;
    if (page === 'privacy' || page === 'terms') {
      note.textContent = lang === 'en'
        ? 'This document is currently provided in Korean. The Korean text is authoritative.'
        : '문서 본문은 한국어로 제공되며 한국어가 정본입니다.';
    } else if (page === 'notices') {
      note.textContent = lang === 'en'
        ? 'License notices retain their original wording. The original TXT is also available below.'
        : '라이선스 고지는 원문 그대로 표시합니다. 아래에서 원본 TXT도 열 수 있습니다.';
    } else {
      note.textContent = lang === 'en'
        ? 'Navigation and existing translations follow your language selection. Original license notices retain their wording.'
        : '선택한 언어로 탐색 문구와 기존 번역을 표시합니다. 라이선스 고지 원문은 유지합니다.';
    }
    if (page === 'licenses') {
      renderTranslation(null, 'ko');
      if (lang === 'en') {
        fetch('i18n/en.json').then(function (res) {
          if (!res.ok) { throw new Error('Translation unavailable'); }
          return res.json();
        }).then(function (dict) {
          if (revision === request) { renderTranslation(dict, lang); }
        }).catch(function () {
          if (revision === request) { note.textContent = 'The English translation could not be loaded. The Korean document is shown.'; }
        });
      }
    }
  }
  select.addEventListener('change', function () {
    var url = new URL(location.href);
    url.searchParams.set('lang', select.value);
    history.replaceState(null, '', url.pathname + url.search + url.hash);
    apply(select.value);
  });
  document.getElementById('themeBtn').addEventListener('click', function () {
    var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('onmal-theme', next); } catch (e) { /* Optional preference. */ }
  });
  apply(language);
}());
