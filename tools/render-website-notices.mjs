import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const source = readFileSync(new URL('website-third-party-notices.txt', root), 'utf8');
const privacy = readFileSync(new URL('privacy.html', root), 'utf8');
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const parts = source.split(/\n\n===== ([\w-]+) =====\n\n/);
if (parts.length !== 11) throw new Error('Unexpected website notice sections');
const entries = [];
for (let i = 1; i < parts.length; i += 2) entries.push({ name: parts[i], text: parts[i + 1] });
const head = privacy.slice(0, privacy.indexOf('<main id="main"'))
  .replace('data-document-page="privacy" data-i18n-scope="privacy"', 'data-document-page="notices" data-i18n-scope="notices"')
  .replace('<title>개인정보처리방침 — 온말 Onmal</title>', '<title>웹사이트 라이선스 고지 — 온말 Onmal</title>')
  .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="온말 웹사이트에 사용하는 오픈소스의 저작권 및 라이선스 고지 원문입니다.">')
  .replace('data-document-label="privacy" aria-current="page"', 'data-document-label="privacy"')
  .replace('data-document-label="notices"', 'data-document-label="notices" aria-current="page"');
const html = `${head}<main id="main" lang="en" tabindex="-1">
  <p class="document-language-note" data-document-language-note>라이선스 고지는 원문 그대로 표시합니다. 아래에서 원본 TXT도 열 수 있습니다.</p>
  <header lang="ko">
    <p class="kicker">ONMAL WEBSITE · LICENSE NOTICES</p>
    <h1 data-document-label="notices">웹사이트 라이선스 고지</h1>
    <a class="document-raw-link" href="website-third-party-notices.txt" data-document-label="raw">라이선스 원문 TXT 열기</a>
  </header>
  <article>
    <p style="white-space:pre-line">${escape(parts[0])}</p>
    <div class="document-notice-index" role="navigation" aria-label="License sections">${entries.map((entry) => `<a href="#notice-${entry.name}">${entry.name}</a>`).join(' ')}</div>
${entries.map((entry) => `    <section id="notice-${entry.name}"><h2>${escape(entry.name)}</h2><pre class="document-notice-text" data-notice-component="${entry.name}">${escape(entry.text)}</pre></section>`).join('\n')}
  </article>
  </main>
  <footer data-document-navigation><p><a href="index.html" data-document-label="home">← 홈페이지</a> · <a href="licenses.html" data-document-label="licenses">오픈소스 라이선스</a></p></footer>
</div>
<script src="document.js?v=1"></script>
</body>
</html>
`;
writeFileSync(new URL('website-third-party-notices.html', root), html);
console.log(`Rendered website notice view from ${entries.length} unchanged license texts.`);
