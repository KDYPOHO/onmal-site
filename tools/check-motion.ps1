<#
.SYNOPSIS
    온말 홈페이지 모션 검사기 — @supports 울타리·레이아웃 속성·축소 모션.

.DESCRIPTION
    🔴 <b>이 검사기가 존재하는 이유는 Firefox 입니다.</b> 스크롤 구동 애니메이션
    (`animation-timeline: view()`)을 모르는 브라우저는 그 선언만 무시하고 `animation`
    은 그대로 실행합니다 — 즉 <b>페이지를 열자마자 모든 애니메이션이 한꺼번에</b>
    재생됩니다. 지원이 없는 것보다 나쁩니다. 그래서 스크롤 구동 규칙은 전부
    `@supports (animation-timeline: view())` 안에 있어야 하고, 사람 눈으로는
    한 줄이 새는 것을 못 봅니다.

    두 번째 이유는 성능입니다. `height`·`width`·`top` 같은 속성을 애니메이트하면
    매 프레임 레이아웃이 다시 돕니다. `transform` 과 `opacity` 만 씁니다.
#>
[CmdletBinding()]
param(
    [string]$Root = (Split-Path -Parent $PSScriptRoot),
    [string]$DoneThrough = 'C0'
)

$ErrorActionPreference = 'Stop'

$Phases = @('C0','C1','C2','C3','C4','C5','C6','C7','C8','C9','C10','C11')
$doneAt = $Phases.IndexOf($DoneThrough)
if ($doneAt -lt 0) { throw "모르는 조각입니다: $DoneThrough" }

$utf8 = New-Object System.Text.UTF8Encoding($false)
$problems = @()
$todo = @()

function Check([string]$phase, [bool]$ok, [string]$message) {
    if ($ok) { return }
    if ($Phases.IndexOf($phase) -le $doneAt) { $script:problems += $message }
    else { $script:todo += "[$phase] $message" }
}

# 애니메이트하면 레이아웃이 다시 도는 속성들. transform/opacity 만 씁니다.
$layoutProps = @(
    'height','width','top','left','right','bottom','margin','margin-top','margin-left',
    'margin-right','margin-bottom','padding','font-size','line-height','flex-basis','gap'
)

Write-Host ""
Write-Host "온말 홈페이지 모션 검사 (끝낸 조각: $DoneThrough)" -ForegroundColor White
Write-Host ""

$stylesDir = Join-Path $Root 'styles'
$cssFiles = @()
if (Test-Path $stylesDir) { $cssFiles = Get-ChildItem $stylesDir -Filter '*.css' | Sort-Object Name }

Check 'C1' ($cssFiles.Count -gt 0) "styles/ 에 CSS 가 없습니다 — 아직 인라인 <style> 단계입니다."

# ── 1. 레이아웃 속성 트랜지션 — 지금 .sig b 가 height 를 씁니다 ───────────
# 인라인 <style> 단계에서도 봐야 하므로 HTML 도 함께 훑습니다.
$sources = @()
foreach ($f in $cssFiles) { $sources += @{ Name = "styles/$($f.Name)"; Text = [System.IO.File]::ReadAllText($f.FullName, $utf8) } }
foreach ($f in (Get-ChildItem $Root -Filter '*.html')) {
    $t = [System.IO.File]::ReadAllText($f.FullName, $utf8)
    foreach ($m in [regex]::Matches($t, '(?s)<style>(.*?)</style>')) {
        $sources += @{ Name = $f.Name; Text = $m.Groups[1].Value }
    }
}

foreach ($s in $sources) {
    # transition:height .22s  /  transition-property:height  둘 다 봅니다.
    foreach ($m in [regex]::Matches($s.Text, 'transition(?:-property)?\s*:\s*([^;}]+)')) {
        $value = $m.Groups[1].Value
        foreach ($prop in $layoutProps) {
            if ($value -match "(^|[,\s])$([regex]::Escape($prop))([,\s]|$)") {
                Check 'C2' $false "$($s.Name) 이 레이아웃 속성 '$prop' 을 트랜지션합니다 — transform/opacity 만 씁니다(§2 규칙 3): $($m.Value.Trim())"
            }
        }
    }
}

# ── 2. 🔴 스크롤 구동은 @supports 안에만 ──────────────────────────────────
$motionPath = Join-Path $stylesDir 'motion.css'
if (Test-Path $motionPath) {
    $motion = [System.IO.File]::ReadAllText($motionPath, $utf8)

    # @supports (animation-timeline: view()) 블록의 범위를 중괄호로 셉니다.
    $inside = New-Object 'System.Collections.Generic.HashSet[int]'
    foreach ($m in [regex]::Matches($motion, '@supports[^{]*animation-timeline[^{]*\{')) {
        $depth = 0
        for ($i = $m.Index + $m.Length - 1; $i -lt $motion.Length; $i++) {
            if ($motion[$i] -eq '{') { $depth++ }
            elseif ($motion[$i] -eq '}') {
                $depth--
                if ($depth -eq 0) { break }
            }
            [void]$inside.Add($i)
        }
    }

    foreach ($m in [regex]::Matches($motion, 'animation-timeline\s*:')) {
        Check 'C9' ($inside.Contains($m.Index)) `
            "🔴 motion.css $($m.Index) 위치의 animation-timeline 이 @supports 밖에 있습니다 — Firefox 에서 모든 애니메이션이 로드 즉시 한꺼번에 재생됩니다(§2 규칙 2)."
    }

    # animation-timeline 을 쓰는 규칙과 짝이 되는 animation 선언도 같은 울타리 안이어야 합니다.
    foreach ($m in [regex]::Matches($motion, '(?m)^\s*animation\s*:')) {
        if ($inside.Contains($m.Index)) { continue }
        $notes = "motion.css $($m.Index) 위치의 animation 이 @supports 밖에 있습니다 — 스크롤 구동이면 Firefox 에서 즉시 재생됩니다. 시간 기반(맥동 등)이면 의도된 것입니다."
        Write-Host "  · $notes" -ForegroundColor DarkGray
    }
} else {
    Check 'C9' $false "styles/motion.css 가 없습니다."
}

# ── 3. 축소 모션 존중 ─────────────────────────────────────────────────────
$hasReduce = $false
foreach ($s in $sources) {
    if ($s.Text -match 'prefers-reduced-motion') { $hasReduce = $true }
}
Check 'C0' $hasReduce "어디에도 prefers-reduced-motion 처리가 없습니다."

# motion.css 는 링크 단계에서 걸러야 내려받아도 렌더를 막지 않습니다.
foreach ($f in (Get-ChildItem $Root -Filter '*.html')) {
    $t = [System.IO.File]::ReadAllText($f.FullName, $utf8)
    if ($t -notmatch 'motion\.css') { continue }
    Check 'C9' ($t -match 'motion\.css[^>]*media="\(prefers-reduced-motion:\s*no-preference\)"') `
        "$($f.Name) 이 motion.css 를 media=`"(prefers-reduced-motion: no-preference)`" 없이 링크합니다(§1)."
}

# ── 4. 🚫 법 문서에는 애니메이션을 넣지 않습니다 ──────────────────────────
$docPath = Join-Path $stylesDir 'doc.css'
if (Test-Path $docPath) {
    $doc = [System.IO.File]::ReadAllText($docPath, $utf8)
    Check 'C1' ($doc -notmatch '@keyframes|animation\s*:') `
        "styles/doc.css 에 애니메이션이 있습니다 — 법 문서는 조용해야 합니다(§2). 의도적으로 0 입니다."
}

# ── 결과 ──────────────────────────────────────────────────────────────────
Write-Host ""
if ($todo.Count -gt 0) {
    Write-Host "아직 (계획된 조각):" -ForegroundColor DarkGray
    $todo | Sort-Object -Unique | ForEach-Object { Write-Host "  · $_" -ForegroundColor DarkGray }
    Write-Host ""
}

if ($problems.Count -gt 0) {
    Write-Host "모션 검사 실패 — $($problems.Count)건" -ForegroundColor Red
    $problems | Sort-Object -Unique | ForEach-Object { Write-Host "  X $_" -ForegroundColor Red }
    Write-Host ""
    exit 1
}

Write-Host "모션 검사 통과 (CSS $($cssFiles.Count)개)" -ForegroundColor Green
Write-Host ""
exit 0
