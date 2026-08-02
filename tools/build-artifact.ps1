<#
  온말 홈페이지 — Claude Artifacts 빌드

  네 페이지(index · privacy · terms · licenses)를 자기완결 단일 HTML 로 조립합니다.
  이 파일이 산출물을 만드는 유일한 곳입니다.

  🚫 산출물(dist/onmal.html)을 손으로 고치지 마십시오. 고칠 것이 있으면 원본을
     고치고 다시 굽습니다. 손으로 고치면 다음 빌드가 조용히 지웁니다.

  ── 아티팩트 규격이 강제하는 것 ────────────────────────────────────────────
  ① 파일 하나 = 주소 하나       → 해시 라우터로 네 페이지를 한 문서에
  ② 외부 호스트 전면 차단(CSP)  → 이미지·i18n·폰트를 전부 파일 안으로
  ③ <html> <head> <body> 금지   → 플랫폼이 감쌉니다. 우리는 알맹이만 냅니다

  ②·③ 때문에 이 빌드가 원본에 손대야 하는 곳은 아래 넷뿐입니다. 그 외에는
  원본 마크업을 <b>글자 그대로</b> 옮깁니다 — licenses.html 은 앱 verify.ps1 의
  2번 관문이 28개 이름과 CC-BY 문구를 글자 단위로 보는 파일입니다.

    1. 중복 id  (main ×4 · themeBtn ×4 · langSel ×2)
    2. 페이지 간 링크 (*.html → #/라우트)
    3. 이미지 경로 → data: URI
    4. CSS 스코프 (home.css 와 doc.css 가 같은 선택자를 다른 값으로 씁니다)

  ── 테마는 건드리지 않습니다 ──────────────────────────────────────────────
  tokens.css 는 html[data-theme="light"] 와 @media (prefers-color-scheme) 두
  갈래를 씁니다. 아티팩트 플랫폼도 <b>같은 <html> 의 같은 data-theme 속성</b>에
  찍으므로 둘이 다투지 않고 일치합니다. 그래서 팔레트 CSS 는 무변경입니다.

  ── 발행 주소 ─────────────────────────────────────────────────────────────
  🔴 <b>재발행은 반드시 같은 주소로.</b> 다른 대화에서 그냥 발행하면 <b>새 주소가
     생기고</b> 먼저 것은 남습니다. Claude 에게 아래 주소를 url 로 넘기게 하십시오.

     https://claude.ai/code/artifact/c6bdf242-046c-49da-ab9b-4751bbd33323
     (2026-08-03 A1 최초 발행 · 비공개 — 여는 데 계정 로그인이 필요합니다)

  공식 홈페이지는 <b>계속 GitHub Pages</b> 입니다: https://kdypoho.github.io/onmal-site/
  앱 정보 화면의 링크 6개도 그쪽을 가리킵니다 — 이 빌드는 앱을 건드리지 않습니다.

  사용:
    .\tools\build-artifact.ps1                      # i18n 없이 (A0)
    .\tools\build-artifact.ps1 -Langs en,ja         # 몇 개만 (A0/A1 무게 재기)
    .\tools\build-artifact.ps1 -Langs all           # 30개 전부 (A2)
#>
[CmdletBinding()]
param(
  # 'none' | 'all' | 쉼표 목록. 기본은 none — A0 는 무게를 작게 두고 상한을 먼저 잽니다.
  [string]$Langs = 'none',
  [string]$SiteRoot = (Split-Path -Parent $PSScriptRoot),
  [string]$OutDir = (Join-Path (Split-Path -Parent $PSScriptRoot) 'dist'),
  # 아티팩트에 남는 상대 링크(OFL 전문 등)가 가리킬 공식 주소.
  [string]$SiteBase = 'https://kdypoho.github.io/onmal-site/'
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

# 라우트 정의. 순서가 곧 문서 안의 순서입니다.
$ROUTES = @(
  @{ name = 'home';     file = 'index.html';    css = 'home.css'; cls = 'route home' }
  @{ name = 'privacy';  file = 'privacy.html';  css = 'doc.css';  cls = 'route doc' }
  @{ name = 'terms';    file = 'terms.html';    css = 'doc.css';  cls = 'route doc' }
  @{ name = 'licenses'; file = 'licenses.html'; css = 'doc.css';  cls = 'route doc' }
)

function Read-TextFile([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) { throw "파일이 없습니다: $Path" }
  $t = [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
  # 앞의 BOM 은 벗깁니다. i18n 을 이어붙일 때 한가운데 U+FEFF 가 들어가면 JSON 이 깨집니다.
  if ($t.Length -gt 0 -and [int][char]$t[0] -eq 0xFEFF) { $t = $t.Substring(1) }
  return $t
}

function Write-TextFile([string]$Path, [string]$Text) {
  $dir = Split-Path -Parent $Path
  if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  # BOM 없는 UTF-8. 아티팩트 알맹이 맨 앞에 BOM 이 들어가면 화면에 유령 글자가 뜹니다.
  [System.IO.File]::WriteAllText($Path, $Text, (New-Object System.Text.UTF8Encoding($false)))
}

# ── 실패는 조용하지 않게 ────────────────────────────────────────────────────
# 앵커 문자열을 못 찾으면 멈춥니다. 원본이 바뀌었는데 빌드가 옛 모양을 가정하고
# 그냥 지나가면, 화면은 멀쩡해 보이면서 언어 전환이나 제목만 조용히 망가집니다.
function Replace-Once([string]$Text, [string]$Find, [string]$Replace, [string]$What) {
  $n = ([regex]::Matches($Text, [regex]::Escape($Find))).Count
  if ($n -ne 1) { throw "site.js 패치 '$What' 의 앵커가 $n 번 나옵니다 (1번이어야 합니다). 원본이 바뀌었습니까?" }
  return $Text.Replace($Find, $Replace)
}

# ═══ 1. 이미지 → data: URI ═════════════════════════════════════════════════
$imgCache = @{}
$script:webpUsed = 0
$script:fontsEmbedded = 0
$script:relLinks = 0
function Get-DataUri([string]$RelPath) {
  if ($imgCache.ContainsKey($RelPath)) { return $imgCache[$RelPath] }
  $full = Join-Path $SiteRoot $RelPath

  # 같은 이름의 .webp 가 있으면 그쪽을 씁니다. <b>무손실</b>이라 픽셀이 같아
  # A4 픽셀 대조가 그대로 성립하면서 base64 무게가 절반이 됩니다(실측 51% 감소).
  # GitHub Pages 쪽 HTML 은 계속 .png 를 가리킵니다 — 그 전환은 C10 입니다.
  $webp = [System.IO.Path]::ChangeExtension($full, '.webp')
  if ($RelPath -like 'shots/*' -and (Test-Path -LiteralPath $webp)) {
    $full = $webp
    $RelPath = [System.IO.Path]::ChangeExtension($RelPath, '.webp')
    $script:webpUsed++
  }

  if (-not (Test-Path -LiteralPath $full)) { throw "이미지가 없습니다: $RelPath" }
  $bytes = [System.IO.File]::ReadAllBytes($full)
  $ext = [System.IO.Path]::GetExtension($RelPath).ToLowerInvariant()
  $mime = switch ($ext) {
    '.png'   { 'image/png' }
    '.webp'  { 'image/webp' }
    '.jpg'   { 'image/jpeg' }
    '.jpeg'  { 'image/jpeg' }
    '.svg'   { 'image/svg+xml' }
    '.woff2' { 'font/woff2' }
    default  { throw "모르는 형식입니다: $RelPath" }
  }
  $uri = "data:$mime;base64," + [Convert]::ToBase64String($bytes)
  $imgCache[$RelPath] = $uri
  return $uri
}

# ═══ 2. CSS 스코프 ═════════════════════════════════════════════════════════
# home.css 와 doc.css 는 같은 선택자(body · .wrap · a · h1 · h2 · footer · 표 …)를
# 다른 값으로 씁니다. 지금은 페이지가 달라서 안 만나지만 한 문서에 넣으면 만납니다.
# 그래서 규칙마다 선택자 앞에 라우트 클래스를 붙입니다.
#
# ⚠️ 선택자 앞에 무언가를 붙이면 <b>명시도가 올라갑니다</b>. base.css 가 더 높은
#    명시도로 이기고 있던 자리가 있으면 그 자리가 뒤집힙니다. 정적으로는 못 잡고
#    A4 픽셀 대조가 잡습니다.

function Split-SelectorList([string]$Sel) {
  # 쉼표로 가르되 괄호 안의 쉼표( :not(a,b) · :is(...) )는 세지 않습니다.
  $out = New-Object System.Collections.Generic.List[string]
  $depth = 0; $buf = New-Object System.Text.StringBuilder
  foreach ($c in $Sel.ToCharArray()) {
    if ($c -eq '(' -or $c -eq '[') { $depth++ }
    elseif ($c -eq ')' -or $c -eq ']') { $depth-- }
    if ($c -eq ',' -and $depth -eq 0) { [void]$out.Add($buf.ToString()); [void]$buf.Clear() }
    else { [void]$buf.Append($c) }
  }
  [void]$out.Add($buf.ToString())
  return $out
}

function Convert-Selector([string]$Sel, [string]$Prefix, [string]$RootSel) {
  $s = $Sel.Trim()
  if ($s -eq '') { return $Sel }

  # body 는 라우트 div 자신으로. line-height 처럼 물려주는 값이라 자리를 옮겨도 같습니다.
  if ($s -eq 'body') { return $RootSel }
  if ($s -match '^body\s+(.+)$') { return "$RootSel $($Matches[1])" }

  # doc.css 가 이미 쓰고 있던 스코프를 라우트로 옮깁니다.
  if ($s -match '^html\[data-i18n-scope="lic"\]\s*(.*)$') {
    $rest = $Matches[1].Trim()
    return (".route[data-route=`"licenses`"]" + $(if ($rest) { " $rest" } else { '' }))
  }
  if ($s -match '^html:not\(\[data-i18n-scope="lic"\]\)\s*(.*)$') {
    $rest = $Matches[1].Trim()
    return (".route.doc:not([data-route=`"licenses`"])" + $(if ($rest) { " $rest" } else { '' }))
  }

  # 그 밖에 html/:root 로 시작하는 선택자는 <b>추측하지 않습니다</b>.
  # 아티팩트에서 <html> 은 플랫폼 것이라, 무엇을 뜻하는지 사람이 정해야 합니다.
  if ($s -match '^(html|:root)\b') {
    throw "스코프할 CSS 에 예상 못한 최상위 선택자가 있습니다: '$s' — Convert-Selector 에 규칙을 더하십시오."
  }

  return "$Prefix $s"
}

function Add-CssScope {
  param([string]$Css, [string]$Prefix, [string]$RootSel)

  $out = New-Object System.Text.StringBuilder
  $atStack = New-Object System.Collections.Generic.List[string]
  $segStart = 0
  $i = 0
  $len = $Css.Length

  while ($i -lt $len) {
    # 주석은 통째로 지나갑니다 — 안에 중괄호나 쉼표가 있어도 규칙이 아닙니다.
    if ($i + 1 -lt $len -and $Css[$i] -eq '/' -and $Css[$i + 1] -eq '*') {
      $end = $Css.IndexOf('*/', $i + 2)
      if ($end -lt 0) { $end = $len - 2 }
      $i = $end + 2
      continue
    }

    $c = $Css[$i]

    if ($c -eq '{') {
      $seg = $Css.Substring($segStart, $i - $segStart)

      # 🔴 주석을 <b>먼저</b> 떼어 냅니다. 주석은 규칙 사이가 아니라 이 조각 <b>안</b>에
      #    들어 있습니다(직전 '}' 부터 이 '{' 까지가 한 조각이므로). 그대로 두면 셋이 깨집니다:
      #      ① 접두사가 주석 앞에 붙어 'html[…] .wrap' 을 못 알아봅니다 →
      #         '.route.doc /*…*/ html[…] .wrap' 은 html 을 후손 자리에 두어 아무것도 안 맞습니다
      #      ② 주석 속 쉼표("본문이 넓고, 코드 조각")가 선택자 목록을 가릅니다
      #      ③ 주석 뒤의 @media 가 '@' 로 시작하지 않는 것처럼 보여 선택자로 처리됩니다
      #    떼어 낸 주석은 규칙 앞에 그대로 돌려놓습니다 — 원본의 설명을 잃지 않습니다.
      $cmts = @([regex]::Matches($seg, '(?s)/\*.*?\*/') | ForEach-Object { $_.Value })
      $selOnly = [regex]::Replace($seg, '(?s)/\*.*?\*/', '')
      $trimmed = $selOnly.Trim()

      if ($cmts.Count -gt 0) { [void]$out.Append("`n" + ($cmts -join "`n") + "`n") }

      if ($trimmed.StartsWith('@')) {
        # at-규칙 머리는 그대로. 이름을 기억해 두었다가 안쪽을 스코프할지 정합니다.
        $name = if ($trimmed -match '^@([a-zA-Z-]+)') { $Matches[1].ToLowerInvariant() } else { '' }
        [void]$atStack.Add($name)
        [void]$out.Append($trimmed)
      }
      else {
        # 안쪽을 스코프해도 되는가? @media·@supports 안은 규칙, @keyframes 안은
        # 프레임(0% · from)이라 건드리면 애니메이션이 죽습니다.
        $enclosing = if ($atStack.Count -gt 0) { $atStack[$atStack.Count - 1] } else { '' }
        $scopable = ($enclosing -eq '' -or $enclosing -eq 'media' -or $enclosing -eq 'supports')

        if ($scopable) {
          $parts = Split-SelectorList $selOnly
          $conv = @()
          foreach ($p in $parts) {
            if ($p.Trim() -eq '') { continue }
            # 선택자 앞의 줄바꿈·들여쓰기는 살려서 원본 모양을 유지합니다.
            $lead = if ($p -match '^(\s*)') { $Matches[1] } else { '' }
            $conv += ($lead + (Convert-Selector $p $Prefix $RootSel))
          }
          [void]$out.Append(($conv -join ','))
        }
        else {
          [void]$out.Append($selOnly)
        }
        [void]$atStack.Add('%rule%')   # 선언 블록 — 안쪽에 규칙이 없습니다
      }

      [void]$out.Append('{')
      $i++
      $segStart = $i
      continue
    }

    if ($c -eq '}') {
      [void]$out.Append($Css.Substring($segStart, $i - $segStart))
      [void]$out.Append('}')
      if ($atStack.Count -gt 0) { $atStack.RemoveAt($atStack.Count - 1) }
      $i++
      $segStart = $i
      continue
    }

    $i++
  }

  [void]$out.Append($Css.Substring($segStart))
  return $out.ToString()
}

# ═══ 3. 페이지 읽기와 손질 ═════════════════════════════════════════════════
function Get-BodyInner([string]$Html, [string]$File) {
  $m = [regex]::Match($Html, '(?s)<body[^>]*>(.*)</body>')
  if (-not $m.Success) { throw "$File 에서 <body> 를 못 찾았습니다." }
  $inner = $m.Groups[1].Value
  # site.js 는 맨 끝에서 한 번만 붙입니다.
  $inner = $inner -replace '(?s)\s*<script src="site\.js"[^>]*></script>', ''
  return $inner.Trim()
}

$routeMeta = [ordered]@{}
$routeHtml = [ordered]@{}
$cssSeen = @{}
$cssBlocks = New-Object System.Collections.Generic.List[string]

foreach ($r in $ROUTES) {
  $name = $r.name
  $path = Join-Path $SiteRoot $r.file
  $raw = Read-TextFile $path

  # 제목과 i18n 스코프는 <head>/<html> 에서 걷어 ROUTE_META 로 옮깁니다.
  # 아티팩트에는 <head> 가 없어서 페이지마다 <title> 을 둘 자리가 없습니다.
  $mt = [regex]::Match($raw, '(?s)<title>(.*?)</title>')
  if (-not $mt.Success) { throw "$($r.file) 에 <title> 이 없습니다." }
  $title = $mt.Groups[1].Value.Trim()

  $ms = [regex]::Match($raw, '<html[^>]*\bdata-i18n-scope="([^"]*)"')
  $scope = if ($ms.Success) { $ms.Groups[1].Value } else { $null }

  $routeMeta[$name] = @{ title = $title; scope = $scope }

  $body = Get-BodyInner $raw $r.file

  # ── 손질 1. 중복 id ──────────────────────────────────────────────────────
  # main 은 건너뛰기 링크의 과녁이라 라우트마다 갈라야 합니다.
  $body = $body -replace 'id="main"', "id=`"main-$name`""
  $body = $body -replace 'href="#main"', "href=`"#main-$name`""
  # themeBtn·langSel 은 <b>CSS 가 쓰지 않습니다</b>(.tbtn·.lsel 클래스로 붙습니다).
  # 순수 JS 훅이라 id 를 떼고 클래스로 찾게 하면 충돌이 사라집니다.
  $body = $body -replace '\s*id="themeBtn"', ''
  $body = $body -replace '\s*id="langSel"', ''

  # ── 손질 2. 페이지 간 링크 ───────────────────────────────────────────────
  $body = $body -replace 'href="index\.html"', 'href="#/"'
  $body = $body -replace 'href="privacy\.html"', 'href="#/privacy"'
  $body = $body -replace 'href="terms\.html"', 'href="#/terms"'
  $body = $body -replace 'href="licenses\.html"', 'href="#/licenses"'

  # 🔴 남은 상대 링크는 <b>아티팩트에서 갈 곳이 없습니다.</b> 파일 하나뿐이라
  #    fonts/ 도 shots/ 도 존재하지 않습니다. licenses.html 의 OFL 전문 링크가
  #    바로 이 경우인데, 그건 라이선스 의무를 가리키는 링크라 죽으면 안 됩니다.
  #    공식 홈페이지의 절대 주소로 바꿉니다 — 두 곳 모두에서 살아 있습니다.
  #    (<a href> 는 누르기 전까지 요청이 나가지 않으므로 CSP 와 무관합니다.)
  $body = [regex]::Replace($body, 'href="(?!#|https?:|mailto:|data:)([^"]+)"', {
      param($m)
      $script:relLinks++
      'href="' + $SiteBase + $m.Groups[1].Value + '"'
    })

  # ── 손질 3. 이미지 ───────────────────────────────────────────────────────
  $body = [regex]::Replace($body, 'src="((?:shots/)?onmal_\d+\.png|shots/[^"]+)"', {
      param($m) 'src="' + (Get-DataUri $m.Groups[1].Value) + '"'
    })
  # data: URI 는 이미 문서 안에 있습니다. 지연 로드가 뜻을 잃어 속성만 남습니다.
  $body = $body -replace '\s*loading="lazy"', ''

  $routeHtml[$name] = $body

  # ── CSS ──────────────────────────────────────────────────────────────────
  if (-not $cssSeen.ContainsKey($r.css)) {
    $cssSeen[$r.css] = $true
    $css = Read-TextFile (Join-Path $SiteRoot "styles\$($r.css)")
    $prefix = if ($r.css -eq 'home.css') { '.route.home' } else { '.route.doc' }
    $scoped = Add-CssScope -Css $css -Prefix $prefix -RootSel $prefix

    # 🔴 스코프가 실제로 옮겨졌는지 확인합니다. 남아 있으면 그 규칙은 아티팩트에서
    #    <b>조용히 아무것도 안 맞습니다</b> — <html> 이 라우트 div 의 후손일 수 없으니까요.
    #    라이선스 페이지의 .wrap 이 860px 에서 760px 로 좁아지는 식으로 나타납니다.
    $stray = [regex]::Replace($scoped, '(?s)/\*.*?\*/', '')
    if ($stray -match 'html[\[:]') {
      $sample = ([regex]::Match($stray, '[^{}\r\n]*html[\[:][^{]*')).Value.Trim()
      throw "스코프 뒤에도 html 선택자가 남았습니다 ($($r.css)): '$sample'"
    }

    [void]$cssBlocks.Add("/* ── $($r.css) → $prefix 로 스코프 ── */`n$scoped")
  }
}

# ═══ 4. i18n 압축 임베드 ═══════════════════════════════════════════════════
# 🔴 ConvertTo-Json 을 쓰지 않습니다. PS 5.1 이 비ASCII 를 \uXXXX 로 이스케이프해
#    CJK 가 여섯 배로 붑니다. 원본 텍스트를 그대로 이어붙입니다.
$i18nDir = Join-Path $SiteRoot 'i18n'
$wantLangs = @()
if ($Langs -eq 'all') {
  $wantLangs = @(Get-ChildItem -LiteralPath $i18nDir -Filter '*.json' | ForEach-Object { $_.BaseName } | Sort-Object)
}
elseif ($Langs -ne 'none' -and $Langs.Trim() -ne '') {
  $wantLangs = @($Langs -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ })
}

$blobB64 = ''
$blobRaw = 0
if ($wantLangs.Count -gt 0) {
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.Append('{')
  $first = $true
  foreach ($code in $wantLangs) {
    if ($code -eq 'ko') { continue }   # ko 는 HTML 원문입니다 — 넣으면 같은 것을 두 벌 나릅니다
    $p = Join-Path $i18nDir "$code.json"
    if (-not (Test-Path -LiteralPath $p)) { throw "언어 파일이 없습니다: $code.json" }
    $json = (Read-TextFile $p).Trim()
    if (-not $first) { [void]$sb.Append(',') }
    [void]$sb.Append('"').Append($code).Append('":').Append($json)
    $first = $false
  }
  [void]$sb.Append('}')
  $joined = $sb.ToString()

  # 만든 것이 진짜 JSON 인지 여기서 확인합니다. 브라우저에서 터지면 원인을 찾기 어렵습니다.
  try { [void]([System.Web.Script.Serialization.JavaScriptSerializer]::new()) } catch { }
  if (-not $joined.StartsWith('{') -or -not $joined.EndsWith('}')) { throw 'i18n 덩어리가 온전한 객체가 아닙니다.' }

  $bytes = [System.Text.Encoding]::UTF8.GetBytes($joined)
  $blobRaw = $bytes.Length
  $ms = New-Object System.IO.MemoryStream
  $gz = New-Object System.IO.Compression.GZipStream($ms, [System.IO.Compression.CompressionLevel]::Optimal)
  $gz.Write($bytes, 0, $bytes.Length)
  $gz.Dispose()
  $blobB64 = [Convert]::ToBase64String($ms.ToArray())
  $ms.Dispose()
}

# ═══ 5. site.js 패치 ═══════════════════════════════════════════════════════
$js = Read-TextFile (Join-Path $SiteRoot 'site.js')

# P1 — 제목 스코프를 <html> 이 아니라 지금 보이는 라우트에서 읽습니다.
$js = Replace-Once $js @'
  var scope = document.documentElement.getAttribute("data-i18n-scope");
  var titleKey = scope ? scope + ".meta.title" : "meta.title";
  var descKey = scope ? scope + ".meta.desc" : "meta.desc";
'@ @'
  /* 아티팩트 병합본 — 라우트 넷이 한 문서에 있습니다. 스코프를 <html> 에서
     한 번 읽어 두면 법 문서로 옮겨도 첫 화면 제목이 남습니다. */
  var activeRouteName = "home";
  function routeScopeKey(suffix) {
    var s = ROUTE_META[activeRouteName].scope;
    return s ? s + ".meta." + suffix : "meta." + suffix;
  }
'@ 'P1 제목 스코프'

# P2 — 제목은 라우트별 원문에서. <meta name="description"> 은 아티팩트에 없습니다.
$js = Replace-Once $js @'
    document.title = (dict && dict[titleKey]) || originalTitle;
    if (descMeta) { descMeta.setAttribute("content", (dict && dict[descKey]) || originalDesc); }
'@ @'
    document.title = (dict && dict[routeScopeKey("title")]) || ROUTE_META[activeRouteName].title;
    /* 설명 meta 는 <head> 에 있어야 하는데 아티팩트에는 우리 <head> 가 없습니다. */
'@ 'P2 제목 적용'

# P3 — fetch 는 CSP 가 막습니다. 문서 안에 심은 덩어리에서 꺼냅니다.
$js = Replace-Once $js @'
    fetch("i18n/" + code + ".json")
      .then(function (r) { if (!r.ok) { throw new Error(r.status); } return r.json(); })
      .then(function (d) { dict = d; render(); })
      .catch(function () { dict = null; render(); });   // 파일이 없으면 한국어 원문 유지
'@ @'
    loadDict(code)
      .then(function (d) { dict = d; render(); })
      .catch(function () { dict = null; render(); });   // 못 풀면 한국어 원문 유지
'@ 'P3 사전 불러오기'

# P4 — 라우터. site.js 의 IIFE <b>안</b>에 넣어야 render 와 dict 에 닿습니다.
#      자리는 언어 준비가 끝난 뒤, #subs 가 없으면 빠져나가는 이른 return 앞입니다.
$routerJs = @'
  /* ── 해시 라우터 ────────────────────────────────────────────────────────
     아티팩트는 파일 하나가 주소 하나입니다. 네 페이지를 한 문서에 넣고
     #/privacy 같은 해시로 가릅니다.

     🔴 라우트 접두사는 반드시 "#/" 입니다. 앱 정보 화면의 [로드맵] 버튼이
        #roadmap 으로 들어오는데, 접두사가 없으면 그것을 라우트 이름으로 읽고
        첫 화면이 아닌 곳으로 떨어집니다. "#/" 로 시작하지 않는 해시는
        <b>평범한 앵커</b>로 두고 라우트를 바꾸지 않습니다. */
  var routeEls = {};
  Array.prototype.forEach.call(document.querySelectorAll(".route"), function (el) {
    routeEls[el.getAttribute("data-route")] = el;
  });

  function routeFromHash() {
    var h = window.location.hash || "";
    if (h.indexOf("#/") !== 0) { return null; }        // 앵커 — 라우트 유지
    var n = h.slice(2).replace(/[?#].*$/, "");
    if (n === "") { return "home"; }
    return routeEls[n] ? n : "home";
  }

  function showRoute(name, scrollTop) {
    if (!routeEls[name]) { name = "home"; }
    activeRouteName = name;
    Object.keys(routeEls).forEach(function (r) { routeEls[r].hidden = (r !== name); });
    if (scrollTop) { window.scrollTo(0, 0); }
    render();                                          // 제목이 라우트를 따라갑니다
  }

  window.addEventListener("hashchange", function () {
    var r = routeFromHash();
    if (r !== null && r !== activeRouteName) { showRoute(r, true); }
  });

  var startRoute = routeFromHash();
  showRoute(startRoute === null ? "home" : startRoute, false);

  /* ── nav 부품 잇기 ──────────────────────────────────────────────────────
     라우트마다 자기 nav 를 그대로 지녔습니다(privacy·terms 에는 언어 선택기가
     일부러 없습니다). id 는 문서에 하나뿐이어야 하므로 빌드가 뗐고, 여기서
     클래스로 찾아 <b>전부</b>에 같은 동작을 붙입니다. */
  Array.prototype.forEach.call(document.querySelectorAll(".tbtn"), function (btn) {
    btn.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("onmal-theme", next); } catch (e) { /* 사생활 모드 등 */ }
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll(".lsel"), function (other) {
    if (other === sel) { return; }                     // site.js 가 이미 붙였습니다
    LANGS.forEach(function (l) {
      var option = document.createElement("option");
      option.value = l[0];
      option.textContent = l[1];
      other.appendChild(option);
    });
    other.value = lang;
    other.addEventListener("change", function () {
      if (sel) { sel.value = other.value; }
      try { localStorage.setItem("onmal-lang", other.value); } catch (e) { /* 무시 */ }
      apply(other.value);
    });
  });

'@

$anchor = '  /* ── 실제 화면 탭 ─'
if (([regex]::Matches($js, [regex]::Escape($anchor))).Count -ne 1) {
  throw "P4 라우터를 넣을 자리('실제 화면 탭' 주석)를 1번 못 찾았습니다."
}
$js = $js.Replace($anchor, $routerJs + $anchor)

# 언어 선택기가 여럿이 되었으니, site.js 가 잡은 것 하나만 갱신하던 자리를 손봅니다.
# (site.js 의 sel.addEventListener 는 그대로 두고, 위 라우터가 나머지를 맡습니다.)

# ═══ 6. 조립 ═══════════════════════════════════════════════════════════════
$metaJs = ($routeMeta.Keys | ForEach-Object {
    $s = $routeMeta[$_].scope
    $sv = if ($s) { '"' + $s + '"' } else { 'null' }
    '    ' + $_ + ': { title: ' + (ConvertTo-Json $routeMeta[$_].title -Compress) + ', scope: ' + $sv + ' }'
  }) -join ",`n"

$preamble = @"
/* 빌드가 넣습니다 — tools/build-artifact.ps1. 손으로 고치지 마십시오. */
var ROUTE_META = {
$metaJs
};

/* i18n 사전 — gzip 한 덩어리를 base64 로 심었습니다. CSP 가 fetch 를 막으므로
   문서 밖에서 가져올 방법이 없습니다. 브라우저에서 DecompressionStream 으로 풉니다.
   못 풀면 dict 가 null 로 남아 한국어 원문이 그대로 보입니다 — 지금 사이트에서
   i18n 파일을 못 받았을 때와 <b>같은 결말</b>입니다. */
var I18N_BLOB = $(if ($blobB64) { '"' + $blobB64 + '"' } else { 'null' });
var _i18nAll = null, _i18nPending = null;

function _inflateI18n() {
  if (_i18nAll) { return Promise.resolve(_i18nAll); }
  if (_i18nPending) { return _i18nPending; }
  if (!I18N_BLOB || typeof DecompressionStream === "undefined") {
    return Promise.reject(new Error("i18n-unavailable"));
  }
  var bin = atob(I18N_BLOB);
  var bytes = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) { bytes[i] = bin.charCodeAt(i); }
  _i18nPending = new Response(
    new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"))
  ).text().then(function (t) {
    _i18nAll = JSON.parse(t);
    _i18nPending = null;
    return _i18nAll;
  });
  return _i18nPending;
}

function loadDict(code) {
  return _inflateI18n().then(function (all) {
    if (!all[code]) { throw new Error("missing " + code); }
    return all[code];
  });
}
"@

$cssAll = @()
foreach ($f in @('fonts.css', 'tokens.css', 'base.css')) {
  $css = Read-TextFile (Join-Path $SiteRoot "styles\$f")

  # 글꼴 파일도 문서 안으로. CSP 가 외부 호스트를 막으므로 data: URI 말고는
  # 방법이 없습니다. 실패하면 <b>조용히</b> 시스템 글꼴로 떨어지니 여기서 셉니다.
  if ($f -eq 'fonts.css') {
    $before = ([regex]::Matches($css, 'url\("\.\./fonts/')).Count
    if ($before -eq 0) { throw 'fonts.css 에서 ../fonts/ 참조를 못 찾았습니다.' }
    $css = [regex]::Replace($css, 'url\("\.\./(fonts/[^"]+\.woff2)"\)\s*format\("[^"]*"\)', {
        param($m) 'url("' + (Get-DataUri $m.Groups[1].Value) + '") format("woff2")'
      })
    $script:fontsEmbedded = $before
  }

  $cssAll += "/* ── $f (스코프 없음 — 네 라우트 공통) ── */`n$css"
}
$cssAll += $cssBlocks

$routeCss = @'
/* ── 라우트 기계 장치 ────────────────────────────────────────────────────
   [hidden] 은 UA 기본이 display:none 이지만, 리셋이 display 를 정하는 순간
   조용히 풀립니다. 네 페이지가 한꺼번에 보이는 사고라 못 박아 둡니다. */
.route[hidden]{display:none !important}
'@

$routeDivs = ($ROUTES | ForEach-Object {
    $n = $_.name
    $hidden = if ($n -eq 'home') { '' } else { ' hidden' }
    "<div class=`"$($_.cls)`" data-route=`"$n`"$hidden>`n$($routeHtml[$n])`n</div>"
  }) -join "`n`n"

$homeTitle = $routeMeta['home'].title

# 아티팩트 알맹이 — <!DOCTYPE>·<html>·<head>·<body> 없음. 플랫폼이 감쌉니다.
$artifact = @"
<title>$homeTitle</title>

<script>
/* 렌더 전에 테마를 정합니다. 원본은 <head> 인라인 스크립트가 하던 일인데
   아티팩트에는 우리 <head> 가 없어서 알맹이 맨 앞으로 왔습니다. */
(function(){try{var t=localStorage.getItem('onmal-theme')||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t)}catch(e){}})();
</script>

<style>
$($cssAll -join "`n`n")

$routeCss
</style>

$routeDivs

<script>
$preamble

$js
</script>
"@

Write-TextFile (Join-Path $OutDir 'onmal.html') $artifact

# 미리보기 — 플랫폼 껍데기를 흉내 냅니다. 발행 전에 눈으로 볼 유일한 방법입니다.
# ⚠️ CSP 는 재현되지 않습니다. 외부 호스트가 막히는지는 발행본에서만 압니다.
$preview = @"
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- 플랫폼 최소 리셋 흉내. 실제 내용은 확인 전입니다 — base.css 의
     *{box-sizing;margin:0;padding:0} 가 뒤에 와서 덮습니다. -->
<style>*,*::before,*::after{box-sizing:border-box}body{margin:0}</style>
</head>
<body>
$artifact
</body>
</html>
"@
Write-TextFile (Join-Path $OutDir 'preview.html') $preview

# ═══ 7. 보고 ═══════════════════════════════════════════════════════════════
$artBytes = [System.Text.Encoding]::UTF8.GetByteCount($artifact)
function Fmt([int]$n) { '{0,8:N0} KB' -f ($n / 1KB) }

Write-Host ''
Write-Host '온말 아티팩트 빌드' -ForegroundColor Cyan
Write-Host ('  라우트      ' + (($ROUTES | ForEach-Object { $_.name }) -join ' · '))
Write-Host ('  이미지      ' + ($imgCache.Count - $script:fontsEmbedded) + ' 장 → data: URI' +
  $(if ($script:webpUsed) { "  (무손실 WebP $($script:webpUsed) 장)" } else { '' }))
Write-Host ('  글꼴        ' + $script:fontsEmbedded + ' 벌 → data: URI')
Write-Host ('  상대 링크   ' + $script:relLinks + ' 개 → ' + $SiteBase)
if ($wantLangs.Count -gt 0) {
  $embedded = @($wantLangs | Where-Object { $_ -ne 'ko' }).Count
  Write-Host ('  i18n        ' + $embedded + ' 개 · 원본 ' + (Fmt $blobRaw).Trim() + ' → base64 ' + (Fmt $blobB64.Length).Trim())
}
else {
  Write-Host '  i18n        없음 (-Langs all 로 넣습니다)' -ForegroundColor DarkYellow
}
Write-Host ('  산출물      ' + (Fmt $artBytes).Trim() + '  ' + (Join-Path $OutDir 'onmal.html'))
Write-Host ('  미리보기    ' + (Join-Path $OutDir 'preview.html'))
Write-Host ''
