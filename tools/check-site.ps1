<#
.SYNOPSIS
    온말 홈페이지 구조 검사기 — 링크·id·외부 origin·테마·접근성.

.DESCRIPTION
    조각(C0~C11)을 하나씩 진행하는 동안 "이미 지켜야 하는 것"과 "아직 안 한 것"을
    갈라 보여줍니다. $DoneThrough 를 올리면 그 아래 단계의 검사가 경고에서 실패로
    바뀝니다 — 되돌아가지 않기 위한 톱니바퀴입니다.

    🔴 가장 중요한 검사는 `#roadmap` 입니다. 앱 정보 화면의 [로드맵] 버튼이 이
    앵커로 걸려 있어서, id 가 바뀌면 조용히 첫 화면으로 떨어집니다.

.PARAMETER DoneThrough
    지금까지 끝낸 조각. 이 단계 이하의 검사는 실패로 다룹니다.
#>
[CmdletBinding()]
param(
    [string]$Root = (Split-Path -Parent $PSScriptRoot),
    [string]$DoneThrough = 'C0'
)

$ErrorActionPreference = 'Stop'

# 조각 순서. 문자열 비교가 아니라 이 배열의 자리로 비교합니다("C10" < "C2" 함정 회피).
$Phases = @('C0','C1','C2','C3','C4','C5','C6','C7','C8','C9','C10','C11')
$doneAt = $Phases.IndexOf($DoneThrough)
if ($doneAt -lt 0) { throw "모르는 조각입니다: $DoneThrough" }

$utf8 = New-Object System.Text.UTF8Encoding($false)
$fail = @()
$todo = @()

# 🔴 주석을 먼저 걷어냅니다. 안 그러면 "예전에는 여기 X 라고 적혀 있었습니다"라는
#    <b>고쳤다는 기록</b>이 X 로 읽혀, 고칠수록 검사가 빨개집니다 — 2026-08-02 에
#    실제로 그랬습니다(check-motion 은 CSS 주석에서 같은 일을 겪었습니다).
#    자리를 유지해야 다른 검사의 위치·개수가 어긋나지 않으므로 같은 길이의 공백으로.
function Strip-Comments([string]$html) {
    return [regex]::Replace($html, '(?s)<!--.*?-->', {
        param($m) ' ' * $m.Value.Length
    })
}

function Read-Page([string]$name) {
    $p = Join-Path $Root $name
    if (-not (Test-Path $p)) { return $null }
    return Strip-Comments ([System.IO.File]::ReadAllText($p, $utf8))
}

# 검사 하나. $phase 가 이미 끝난 단계면 실패, 아직이면 할 일로 적습니다.
function Check([string]$phase, [bool]$ok, [string]$message) {
    if ($ok) { return }
    if ($Phases.IndexOf($phase) -le $doneAt) { $script:fail += $message }
    else { $script:todo += "[$phase] $message" }
}

$pages = @('index.html','privacy.html','terms.html','licenses.html')
$optionalPages = @('privacy.en.html','terms.en.html')

Write-Host ""
Write-Host "온말 홈페이지 구조 검사 (끝낸 조각: $DoneThrough)" -ForegroundColor White
Write-Host ""

# ── 1. 페이지가 있는가 ────────────────────────────────────────────────────
foreach ($p in $pages) {
    Check 'C0' (Test-Path (Join-Path $Root $p)) "페이지가 없습니다: $p"
}
foreach ($p in $optionalPages) {
    Check 'C8' (Test-Path (Join-Path $Root $p)) "영어본 페이지가 없습니다: $p"
}

$html = @{}
foreach ($p in ($pages + $optionalPages)) {
    $t = Read-Page $p
    if ($null -ne $t) { $html[$p] = $t }
}

# ── 2. 🔴 앱이 걸고 있는 앵커 ─────────────────────────────────────────────
# 앱 MainWindow 의 RoadmapUrl 이 이 id 를 가리킵니다. 바뀌면 조용히 첫 화면입니다.
if ($html.ContainsKey('index.html')) {
    Check 'C0' ($html['index.html'] -match 'id="roadmap"') `
        "🔴 index.html 에 id=`"roadmap`" 이 없습니다 — 앱의 [로드맵] 버튼이 첫 화면으로 떨어집니다."
}

# 계획서 §3 의 최종 섹션 집합. 아직 없는 것은 해당 조각의 할 일로 나옵니다.
$sectionPhase = @{
    'how'      = 'C0'; 'shots' = 'C0'; 'name' = 'C0'; 'roadmap' = 'C0'
    'faq'      = 'C0'; 'legal' = 'C0'
    'glossary' = 'C5'; 'audio' = 'C5'; 'hands' = 'C5'
    'measured' = 'C7'; 'lang'  = 'C7'
}
if ($html.ContainsKey('index.html')) {
    foreach ($id in $sectionPhase.Keys) {
        Check $sectionPhase[$id] ($html['index.html'] -match "id=`"$id`"") `
            "index.html 에 섹션 #$id 가 없습니다."
    }
}

# ── 3. 내부 링크와 자원이 실제로 있는가 ───────────────────────────────────
foreach ($name in $html.Keys) {
    $text = $html[$name]

    foreach ($m in [regex]::Matches($text, '(?:href|src)="([^"]+)"')) {
        $target = $m.Groups[1].Value
        if ($target -match '^(https?:|mailto:|data:|#|//)') { continue }
        $clean = ($target -split '[?#]')[0]
        if ($clean.Length -eq 0) { continue }
        Check 'C0' (Test-Path (Join-Path $Root $clean)) "$name 이 없는 파일을 가리킵니다: $target"
    }

    # 같은 문서 안의 앵커는 그 문서에 id 가 있어야 합니다.
    foreach ($m in [regex]::Matches($text, 'href="#([^"]+)"')) {
        $anchor = $m.Groups[1].Value
        Check 'C0' ($text -match "id=`"$([regex]::Escape($anchor))`"") `
            "$name 의 앵커 #$anchor 가 그 페이지에 없습니다."
    }
}

# ── 4. 외부 origin — 목표는 0 (§6) ────────────────────────────────────────
# 🔴 <a href> 는 세지 않습니다. 요청이 나가는 것은 하위 자원뿐입니다.
$origins = @{}
foreach ($name in $html.Keys) {
    $patterns = @(
        '<link[^>]+href="(https?://[^"]+)"',
        '<script[^>]+src="(https?://[^"]+)"',
        '<img[^>]+src="(https?://[^"]+)"',
        '@import[^;]*?["'']?(https?://[^"''\)]+)'
    )
    foreach ($pat in $patterns) {
        foreach ($m in [regex]::Matches($html[$name], $pat)) {
            $u = [uri]$m.Groups[1].Value
            $origins[$u.Host] = $true
        }
    }
}
$originCount = $origins.Keys.Count
Check 'C3' ($originCount -eq 0) `
    "외부 origin 이 $originCount 개 남아 있습니다: $($origins.Keys -join ', ') — 자체 호스팅으로 옮기십시오(§6)."

# ── 5. 무JS 에서 테마가 고장 (결함 3) ─────────────────────────────────────
foreach ($name in $html.Keys) {
    Check 'C2' ($html[$name] -notmatch '<html[^>]+data-theme="') `
        "$name 의 <html> 에 data-theme 이 하드코딩돼 있습니다 — JS 를 끄면 라이트 선호 사용자도 다크를 봅니다."
}

# ── 6. 거짓 수치 (결함 1) ─────────────────────────────────────────────────
# 🔴 734ms 는 단계 합산 추정치입니다. "실측"이라고 쓰면 절대 금지 §5 위반입니다.
if ($html.ContainsKey('index.html')) {
    Check 'C2' ($html['index.html'] -notmatch 'GPU 실측') `
        "index.html 에 `"GPU 실측`" 이 남아 있습니다 — 종단 실측이 아니라 단계 합산 추정치입니다(§5)."
    Check 'C2' ($html['index.html'] -notmatch '실측한 값입니다') `
        "index.html 에 `"실측한 값입니다`" 가 남아 있습니다 — 같은 이유."
}

# ── 7. 대비 미달 (결함 2) ─────────────────────────────────────────────────
foreach ($name in $html.Keys) {
    Check 'C2' ($html[$name] -notmatch '#0C7A96') `
        "$name 에 라이트 아쿠아 #0C7A96 이 남아 있습니다 — 4.48:1 로 WCAG AA 미달. #0A6E88(5.28:1)."
}

# ── 8. 🔴 번역하면 제목이 첫 화면 것으로 바뀝니다 ─────────────────────────
# site.js 는 data-i18n-scope 가 없으면 "meta.title" 을 찾습니다. 스코프가 없는
# 법 문서는 30개 언어 전부에서 index 의 제목을 뒤집어씁니다.
foreach ($name in @('privacy.html','terms.html','licenses.html')) {
    if (-not $html.ContainsKey($name)) { continue }
    Check 'C4' ($html[$name] -match 'data-i18n-scope="') `
        "$name 에 data-i18n-scope 가 없습니다 — 번역 시 문서 제목이 첫 화면 제목으로 바뀝니다."
}

# ── 9. CSS 공유화 (C1) ────────────────────────────────────────────────────
foreach ($name in $html.Keys) {
    Check 'C1' ($html[$name] -notmatch '(?s)<style>.*?[{].*?</style>') `
        "$name 에 인라인 <style> 이 남아 있습니다 — styles/ 로 옮기십시오(§1)."
    Check 'C1' ($html[$name] -match 'styles/tokens\.css') `
        "$name 이 styles/tokens.css 를 참조하지 않습니다 — 항상 첫 번째여야 합니다."
}

# sticky nav 가 생기면 앵커가 제목을 가립니다. 미리 넣어 둡니다.
$base = Join-Path $Root 'styles\base.css'
if (Test-Path $base) {
    $css = [System.IO.File]::ReadAllText($base, $utf8)
    Check 'C1' ($css -match 'scroll-margin') `
        "styles/base.css 에 section[id] scroll-margin-top 이 없습니다 — 앵커가 제목을 가립니다(§7)."
}

# ── 10. 접근성 ────────────────────────────────────────────────────────────
if ($html.ContainsKey('index.html')) {
    $i = $html['index.html']
    Check 'C2' ($i -match 'class="skip"|skip-link') "index.html 에 건너뛰기 링크가 없습니다."
    Check 'C2' ($i -match 'role="tabpanel"') "#shots 탭에 role=`"tabpanel`" 이 없습니다."
    Check 'C2' ($i -match 'aria-controls=') "#shots 탭에 aria-controls 가 없습니다."

    # 장식 파형은 낭독기가 읽으면 안 됩니다.
    foreach ($m in [regex]::Matches($i, '<i class="sig[^"]*"([^>]*)>')) {
        Check 'C2' ($m.Groups[1].Value -match 'aria-hidden') `
            "index.html 에 aria-hidden 없는 장식 파형이 있습니다: $($m.Value)"
    }
}

# ── 11. 🚫 다운로드 버튼 금지 (계획 1-2) ──────────────────────────────────
# 코드 서명을 하지 않으므로 Steam 밖 배포 경로를 만들면 SmartScreen 경고를 만납니다.
foreach ($name in $html.Keys) {
    Check 'C0' ($html[$name] -notmatch '\.exe"|\.msi"|\.zip"') `
        "$name 에 직접 내려받기 링크가 있습니다 — 홈페이지 배포는 하지 않습니다(계획 1-2)."
}

# ── 결과 ──────────────────────────────────────────────────────────────────
Write-Host ""
if ($todo.Count -gt 0) {
    Write-Host "아직 (계획된 조각):" -ForegroundColor DarkGray
    $todo | Sort-Object | ForEach-Object { Write-Host "  · $_" -ForegroundColor DarkGray }
    Write-Host ""
}

if ($fail.Count -gt 0) {
    Write-Host "구조 검사 실패 — $($fail.Count)건" -ForegroundColor Red
    $fail | ForEach-Object { Write-Host "  X $_" -ForegroundColor Red }
    Write-Host ""
    exit 1
}

Write-Host "구조 검사 통과 (페이지 $($html.Keys.Count)개 · 외부 origin $originCount 개)" -ForegroundColor Green
Write-Host ""
exit 0
