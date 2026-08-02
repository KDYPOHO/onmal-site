<#
  온말 홈페이지 — 아티팩트 산출물 검사기

  검사기 셋(check-site · check-i18n · check-motion)은 <b>원본</b>을 봅니다.
  이 넷째는 구운 파일(dist/onmal.html)을 봅니다. 원본이 멀쩡해도 조립이
  틀릴 수 있고, 아티팩트의 실패는 대개 조용합니다 — CSP 가 막은 글꼴은
  경고 없이 시스템 글꼴로 떨어지고, 중복 id 는 아무 말 없이 엉뚱한 곳을 가립니다.

  -DoneThrough 는 다른 검사기와 같은 규약입니다. 끝낸 조각 이하는 <b>실패</b>로,
  아직인 것은 <b>할 일</b>로 가릅니다.

    .\tools\check-artifact.ps1 -DoneThrough A0
    .\tools\check-artifact.ps1 -DoneThrough A3
#>
[CmdletBinding()]
param(
  [ValidateSet('A0', 'A1', 'A2', 'A3', 'A4')]
  [string]$DoneThrough = 'A0',
  [string]$SiteRoot = (Split-Path -Parent $PSScriptRoot),
  [string]$Artifact = (Join-Path (Split-Path -Parent $PSScriptRoot) 'dist\onmal.html'),
  # 계획 §6 의 상한. 넘으면 폰트 → 스크린샷 → i18n 순으로 깎습니다.
  [int]$BudgetKB = 1229
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$PHASES = @('A0', 'A1', 'A2', 'A3', 'A4')
# 🔴 문자열 비교가 아니라 자리 비교입니다. 'A10' 이 생기면 'A10' -lt 'A2' 가 참이 됩니다.
$doneIdx = $PHASES.IndexOf($DoneThrough)

$script:fail = 0
$script:todo = 0
$script:ok = 0

function Check {
  param(
    [string]$Phase,      # 이 검사가 어느 조각에서 참이 되어야 하는가
    [string]$What,
    [bool]$Pass,
    [string]$Detail = ''
  )
  $idx = $PHASES.IndexOf($Phase)
  if ($Pass) {
    $script:ok++
    Write-Host ('  통과   ' + $What) -ForegroundColor DarkGray
  }
  elseif ($idx -le $doneIdx) {
    $script:fail++
    Write-Host ('  실패   ' + $What) -ForegroundColor Red
    if ($Detail) { Write-Host ('         ' + $Detail) -ForegroundColor Red }
  }
  else {
    $script:todo++
    Write-Host ('  할 일  ' + $What + '  (' + $Phase + ')') -ForegroundColor DarkYellow
    if ($Detail) { Write-Host ('         ' + $Detail) -ForegroundColor DarkYellow }
  }
}

if (-not (Test-Path -LiteralPath $Artifact)) {
  Write-Host "산출물이 없습니다: $Artifact" -ForegroundColor Red
  Write-Host '먼저 .\tools\build-artifact.ps1 을 돌리십시오.'
  exit 1
}

$html = [System.IO.File]::ReadAllText($Artifact, [System.Text.Encoding]::UTF8)
$bytes = (Get-Item -LiteralPath $Artifact).Length

# 🔴 주석을 걷어낸 사본으로 검사합니다.
#    이 저장소의 주석은 고친 내력을 글자 그대로 적어 둡니다 — tokens.css 는
#    "아쿠아는 #0C7A96 이었습니다"라고 쓰고, <html> 이나 <head> 를 설명하려고
#    그대로 적습니다. 날것을 훑으면 <b>고쳐 둔 것을 결함으로 신고</b>합니다.
#    base64(A–Z a–z 0–9 + / =)에는 '*' 가 없어 덩어리가 잘릴 걱정은 없습니다.
function Remove-Comments([string]$s) {
  $s = [regex]::Replace($s, '(?s)<!--.*?-->', ' ')     # HTML
  $s = [regex]::Replace($s, '(?s)/\*.*?\*/', ' ')      # CSS · JS 블록
  return $s
}
$code = Remove-Comments $html

Write-Host ''
Write-Host ('온말 아티팩트 검사  —  끝낸 조각: ' + $DoneThrough) -ForegroundColor Cyan
Write-Host ''

# ── 1. 아티팩트 알맹이 규격 ────────────────────────────────────────────────
Write-Host '  [ 알맹이 규격 ]' -ForegroundColor White
# 플랫폼이 <!doctype><html><head><body> 를 만듭니다. 우리가 또 내면 문서가 겹칩니다.
# ⚠️ 낱말 경계가 필요합니다 — '<head' 는 <b><header> 를 잡습니다.</b>
#    첫 화면과 법 문서 넷이 전부 <header> 로 시작하니 그냥 두면 늘 실패합니다.
foreach ($tag in @('<!DOCTYPE', '<html', '<head', '<body')) {
  Check 'A0' "$tag 를 내지 않습니다" (-not ($code -imatch ([regex]::Escape($tag) + '\b'))) `
    "플랫폼이 감싸므로 알맹이에 있으면 안 됩니다"
}
Check 'A0' '<title> 이 하나 있습니다' (([regex]::Matches($code, '<title>')).Count -eq 1)

# ── 2. 외부 호스트 ─────────────────────────────────────────────────────────
Write-Host ''
Write-Host '  [ 외부 호스트 — CSP 가 전부 막습니다 ]' -ForegroundColor White

Check 'A0' '<link> 이 없습니다' (-not ($code -imatch '<link\b')) `
  '스타일시트·글꼴·파비콘은 전부 파일 안에 있어야 합니다'
Check 'A0' '<script src=> 가 없습니다' (-not ($code -imatch '<script[^>]+\bsrc\s*='))
Check 'A0' '@import 가 없습니다' (-not ($code -imatch '@import'))

# src= 값은 전부 data: 여야 합니다.
$badSrc = @()
foreach ($m in [regex]::Matches($code, 'src\s*=\s*"([^"]*)"')) {
  $v = $m.Groups[1].Value
  if (-not $v.StartsWith('data:')) { $badSrc += $v }
}
Check 'A0' 'src= 가 전부 data: URI 입니다' ($badSrc.Count -eq 0) `
  (($badSrc | Select-Object -First 3) -join ' · ')

$badUrl = @()
foreach ($m in [regex]::Matches($code, 'url\(\s*[''"]?([^''")]+)')) {
  $v = $m.Groups[1].Value.Trim()
  if (-not $v.StartsWith('data:')) { $badUrl += $v }
}
Check 'A0' 'CSS url() 이 전부 data: URI 입니다' ($badUrl.Count -eq 0) `
  (($badUrl | Select-Object -First 3) -join ' · ')

Check 'A0' 'srcset 이 없습니다' (-not ($code -imatch '\bsrcset\s*='))

# 네트워크를 여는 JS. 원본의 fetch("i18n/…") 는 빌드가 loadDict 로 갈아탑니다.
$netApis = [ordered]@{
  'fetch\('        = 'fetch()'
  'XMLHttpRequest' = 'XMLHttpRequest'
  'WebSocket'      = 'WebSocket'
  'EventSource'    = 'EventSource'
  'importScripts'  = 'importScripts'
}
foreach ($pat in $netApis.Keys) {
  $label = $netApis[$pat]
  Check 'A0' "JS 가 $label 를 쓰지 않습니다" (-not ($code -match $pat))
}

# ── 3. 라우트와 id ─────────────────────────────────────────────────────────
Write-Host ''
Write-Host '  [ 라우트와 id ]' -ForegroundColor White

foreach ($r in @('home', 'privacy', 'terms', 'licenses')) {
  Check 'A0' "라우트 '$r' 이 있습니다" ($code -match ('data-route="' + $r + '"'))
}

# 🔴 앱 정보 화면의 [로드맵] 버튼이 이 앵커로 들어옵니다. 절대 불변입니다.
Check 'A0' 'id="roadmap" 이 그대로 있습니다' ($code -match 'id="roadmap"')

# 🔴 중복 id — 조용히 엉뚱한 요소를 가리키는 원인입니다.
$ids = @{}
foreach ($m in [regex]::Matches($code, 'id\s*=\s*"([^"]+)"')) {
  $v = $m.Groups[1].Value
  if ($ids.ContainsKey($v)) { $ids[$v]++ } else { $ids[$v] = 1 }
}
$dupes = @($ids.Keys | Where-Object { $ids[$_] -gt 1 })
Check 'A0' '중복 id 가 없습니다' ($dupes.Count -eq 0) ("중복: " + ($dupes -join ' · '))

# 건너뛰기 링크가 자기 라우트의 본문을 가리키는가.
foreach ($r in @('home', 'privacy', 'terms', 'licenses')) {
  Check 'A0' "건너뛰기 링크 → #main-$r" (($code -match ('href="#main-' + $r + '"')) -and ($code -match ('id="main-' + $r + '"')))
}

# 페이지 파일로 가는 링크가 남아 있으면 아티팩트에서 404 로 떨어집니다.
$leftover = @()
foreach ($p in @('index.html', 'privacy.html', 'terms.html', 'licenses.html')) {
  if ($code -match ('href="' + [regex]::Escape($p) + '"')) { $leftover += $p }
}
Check 'A0' '페이지 간 링크가 전부 #/ 라우트입니다' ($leftover.Count -eq 0) `
  ("남은 링크: " + ($leftover -join ' · '))

# 🔴 아티팩트는 파일 하나입니다 — fonts/ 도 shots/ 도 없습니다. 상대 링크가 남으면
#    누른 사람은 404 를 봅니다. licenses.html 의 OFL 전문 링크가 그 경우였습니다.
$relHref = @()
foreach ($m in [regex]::Matches($code, '<a\b[^>]*\bhref\s*=\s*"([^"]*)"')) {
  $v = $m.Groups[1].Value
  if ($v -notmatch '^(#|https?:|mailto:|data:)') { $relHref += $v }
}
Check 'A0' '상대 링크가 남아 있지 않습니다' ($relHref.Count -eq 0) `
  ("갈 곳 없는 링크: " + (($relHref | Select-Object -First 3) -join ' · '))

# ── 4. 테마 ────────────────────────────────────────────────────────────────
Write-Host ''
Write-Host '  [ 테마 ]' -ForegroundColor White
Check 'A0' 'html[data-theme="light"] 갈래가 있습니다' ($code -match 'html\[data-theme="light"\]')
Check 'A0' '@media (prefers-color-scheme: light) 갈래가 있습니다' ($code -match 'prefers-color-scheme:\s*light')
# C2 가 고친 결함. 되돌아오면 JS 없는 라이트 사용자가 다시 어두운 화면을 봅니다.
Check 'A0' '대비 미달 아쿠아(#0C7A96)가 없습니다' (-not ($code -imatch '#0C7A96'))

# ── 5. i18n ────────────────────────────────────────────────────────────────
Write-Host ''
Write-Host '  [ i18n ]' -ForegroundColor White

$mBlob = [regex]::Match($html, 'var I18N_BLOB = "([A-Za-z0-9+/=]*)"')
$hasBlob = $mBlob.Success -and $mBlob.Groups[1].Value.Length -gt 0
Check 'A2' 'i18n 덩어리가 심겨 있습니다' $hasBlob '아직 -Langs none 으로 굽고 있습니다'

if ($hasBlob) {
  # 왕복 시험 — 진짜로 풀리는지, 언어가 다 들어갔는지.
  $b64 = $mBlob.Groups[1].Value
  $raw = [Convert]::FromBase64String($b64)
  $ms = New-Object System.IO.MemoryStream(, $raw)
  $gz = New-Object System.IO.Compression.GZipStream($ms, [System.IO.Compression.CompressionMode]::Decompress)
  $sr = New-Object System.IO.StreamReader($gz, [System.Text.Encoding]::UTF8)
  $text = $sr.ReadToEnd()
  $sr.Dispose(); $gz.Dispose(); $ms.Dispose()

  $parsed = $null
  $parseOk = $true
  try { $parsed = ConvertFrom-Json $text } catch { $parseOk = $false }
  Check 'A2' 'i18n 덩어리가 온전한 JSON 으로 풀립니다' $parseOk

  if ($parseOk) {
    $embedded = @($parsed.PSObject.Properties.Name)
    # ko 는 HTML 원문이라 덩어리에 넣지 않습니다.
    $srcCodes = @(Get-ChildItem -LiteralPath (Join-Path $SiteRoot 'i18n') -Filter '*.json' |
        ForEach-Object { $_.BaseName } | Where-Object { $_ -ne 'ko' } | Sort-Object)
    $missing = @($srcCodes | Where-Object { $embedded -notcontains $_ })
    Check 'A2' ('언어 ' + $srcCodes.Count + '개가 전부 들어 있습니다') ($missing.Count -eq 0) `
      ("빠진 언어: " + ($missing -join ' · '))

    # 키 개수 대조 — 언어 하나가 반쪽만 실린 경우를 잡습니다.
    $keyMismatch = @()
    foreach ($c in $embedded) {
      $srcPath = Join-Path $SiteRoot "i18n\$c.json"
      if (-not (Test-Path -LiteralPath $srcPath)) { $keyMismatch += "$c (원본 없음)"; continue }
      $srcObj = ConvertFrom-Json ([System.IO.File]::ReadAllText($srcPath, [System.Text.Encoding]::UTF8))
      $a = @($srcObj.PSObject.Properties.Name).Count
      $b = @($parsed.$c.PSObject.Properties.Name).Count
      if ($a -ne $b) { $keyMismatch += "$c ($a→$b)" }
    }
    Check 'A2' '언어마다 키 개수가 원본과 같습니다' ($keyMismatch.Count -eq 0) `
      (($keyMismatch | Select-Object -First 5) -join ' · ')
  }
}

Check 'A2' 'DecompressionStream 폴백이 있습니다' `
  ($code -match 'typeof DecompressionStream === "undefined"') `
  '못 푸는 브라우저에서 한국어 원문으로 떨어져야 합니다'

# ── 6. 글꼴 ────────────────────────────────────────────────────────────────
Write-Host ''
Write-Host '  [ 글꼴 ]' -ForegroundColor White
$faces = ([regex]::Matches($code, '@font-face')).Count
Check 'A3' '@font-face 로 글꼴이 심겨 있습니다' ($faces -gt 0) `
  '지금은 시스템 글꼴로 떨어집니다 — 라이브 사이트와 다르게 보입니다'

# ── 7. 무게 ────────────────────────────────────────────────────────────────
Write-Host ''
Write-Host '  [ 무게 ]' -ForegroundColor White
$kb = [math]::Round($bytes / 1KB)
Check 'A4' ("예산 안입니다  ($kb KB / $BudgetKB KB)") ($kb -le $BudgetKB) `
  '깎는 순서: 글꼴 → 스크린샷 → i18n'

# ── 마무리 ─────────────────────────────────────────────────────────────────
Write-Host ''
Write-Host ('  통과 ' + $script:ok + ' · 실패 ' + $script:fail + ' · 할 일 ' + $script:todo)
Write-Host ''
if ($script:fail -gt 0) { exit 1 }
exit 0
