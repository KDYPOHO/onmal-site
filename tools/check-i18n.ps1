<#
.SYNOPSIS
    온말 홈페이지 다국어 검사기 — 30개 파일의 키 집합·양방향 사용·금칙어·BOM.

.DESCRIPTION
    HTML 원문이 한국어이고 나머지 30개 언어는 i18n/*.json 입니다. 키가 한 파일에만
    없으면 그 언어에서 그 자리만 한국어로 남고, 아무도 오류를 보지 못합니다 —
    그래서 사람 눈이 아니라 이 검사가 잡아야 합니다.

    🔴 금칙어를 보는 이유: 판 번호(0.1.0)·라이선스 식별자(CC-BY·MIT·OFL)를 번역문에
    넣으면 ① 판을 올릴 때 30개 파일을 고쳐야 하고 ② 라이선스 의무 문구가 번역되어
    앱의 고지 대조 관문이 깨집니다.
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
$notes = @()

# 아직 안 한 조각의 지적은 할 일로만 적습니다.
function Note([string]$phase, [string]$message) {
    if ($Phases.IndexOf($phase) -le $doneAt) { $script:problems += $message }
    else { $script:todo += "[$phase] $message" }
}

# site.js 의 LANGS 에서 ko(원문)를 뺀 30개.
$expected = @(
    'en','ja','zh-cn','zh-tw','ru','es','es-419','pt-br','pt','fr','de','it','pl','tr',
    'uk','vi','th','id','ms','ar','nl','sv','no','da','fi','cs','hu','ro','el','bg'
)

# site.js 가 코드에서 직접 찾는 키 — HTML 에 data-i18n 으로 나타나지 않습니다.
# 스코프가 붙는 것은 아래에서 페이지별로 더합니다.
$codeKeys = @('meta.title','meta.desc','demo.l1','demo.l2','demo.l3','demo.l4','demo.l5','demo.l6')

# 🔴 번역문에 들어가면 안 되는 것들.
#
# ⚠️ 라이선스 <b>식별자</b>(CC-BY-4.0·Apache-2.0·MIT·OFL)는 여기 넣지 않습니다.
#    "나머지 쌍은 Apache-2.0입니다" 같은 <b>설명 산문</b>은 번역되는 편이 맞고,
#    라이선스 의무가 걸린 것은 저작자 표시 <b>문장</b> 하나뿐입니다 — 그건 아래에서
#    따로, 리터럴인지까지 봅니다. 식별자를 통째로 금지하면 멀쩡한 문장 150개가
#    빨갛게 뜨고, 그러면 아무도 이 검사를 안 보게 됩니다.
$forbidden = @(
    '0.1.0',            # 판 번호 — 올릴 때마다 30개 파일을 고쳐야 합니다
    '%LOCALAPPDATA%'    # 경로 리터럴 — 번역되면 안내가 틀려집니다
)

# 🔴 라이선스 의무 문구. 번역되는 순간 CC-BY 위반이고 앱의 고지 대조 관문도 깨집니다.
$attribution = 'Opus-MT models by Helsinki-NLP, licensed under CC BY 4.0'

$i18nDir = Join-Path $Root 'i18n'
if (-not (Test-Path $i18nDir)) { throw "i18n 폴더가 없습니다: $i18nDir" }

Write-Host ""
Write-Host "온말 홈페이지 다국어 검사" -ForegroundColor White
Write-Host ""

# ── 1. 파일이 다 있는가 ───────────────────────────────────────────────────
$files = Get-ChildItem $i18nDir -Filter '*.json' | Sort-Object Name
$present = $files | ForEach-Object { $_.BaseName }

foreach ($code in $expected) {
    if ($present -notcontains $code) { $problems += "i18n/$code.json 이 없습니다." }
}
foreach ($code in $present) {
    if ($expected -notcontains $code) { $problems += "i18n/$code.json 은 site.js 의 언어 목록에 없습니다." }
}

# ── 2. BOM 통일 ───────────────────────────────────────────────────────────
# 🔴 통일하는 쪽은 "BOM 없음" 입니다 — 웹에서 내려받는 JSON 이라 BOM 이 붙으면
#    엄격한 파서가 거부하고, fetch().json() 은 브라우저마다 다르게 굽니다.
$withBom = @()
foreach ($f in $files) {
    $head = [System.IO.File]::ReadAllBytes($f.FullName)
    if ($head.Length -ge 3 -and $head[0] -eq 0xEF -and $head[1] -eq 0xBB -and $head[2] -eq 0xBF) {
        $withBom += $f.Name
    }
}
# 🔴 통일하는 쪽은 "BOM 없음" 입니다 — RFC 8259 가 JSON 에 BOM 을 붙이지 말라고
#    하고, 엄격한 파서는 거부합니다. 지금은 ar.json 만 BOM 이 없어 거꾸로 뒤집혀
#    있습니다(29 대 1). 고치는 것은 C4 입니다.
if ($withBom.Count -gt 0) {
    Note 'C4' "BOM 이 붙은 i18n 파일 $($withBom.Count)개 — 전부 BOM 없이 통일하십시오(RFC 8259)."
}

# ── 3. 파싱 + 키 집합 ─────────────────────────────────────────────────────
$keysOf = @{}
foreach ($f in $files) {
    $text = [System.IO.File]::ReadAllText($f.FullName, $utf8)
    try {
        $obj = $text | ConvertFrom-Json
    } catch {
        $problems += "i18n/$($f.Name) 을 읽지 못했습니다(중복 키이거나 깨진 JSON): $($_.Exception.Message)"
        continue
    }

    $names = @($obj.PSObject.Properties.Name)
    $keysOf[$f.BaseName] = $names

    # 값 검사 — 금칙어와 태그.
    foreach ($prop in $obj.PSObject.Properties) {
        $v = [string]$prop.Value

        foreach ($word in $forbidden) {
            if ($v.Contains($word)) {
                $problems += "i18n/$($f.Name) · $($prop.Name) 에 금칙어 '$word' 가 있습니다 — 번역문이 아니라 마크업 리터럴로 두십시오."
            }
        }
    }
}

if ($keysOf.Keys.Count -gt 0) {
    # en 을 기준으로 삼습니다 — 사람이 직접 쓰는 유일한 번역본입니다.
    $baseName = 'en'
    if (-not $keysOf.ContainsKey($baseName)) { $baseName = @($keysOf.Keys)[0] }
    $baseKeys = $keysOf[$baseName]

    foreach ($code in $keysOf.Keys) {
        if ($code -eq $baseName) { continue }
        $missing = @($baseKeys | Where-Object { $keysOf[$code] -notcontains $_ })
        $extra = @($keysOf[$code] | Where-Object { $baseKeys -notcontains $_ })

        if ($missing.Count -gt 0) {
            $sample = ($missing | Select-Object -First 5) -join ', '
            $problems += "i18n/$code.json 에 키 $($missing.Count)개가 없습니다: $sample"
        }
        if ($extra.Count -gt 0) {
            $sample = ($extra | Select-Object -First 5) -join ', '
            $problems += "i18n/$code.json 에 $baseName 에 없는 키 $($extra.Count)개가 있습니다: $sample"
        }
    }
}

# ── 3-2. 🔴 라이선스 의무 문구는 번역되면 안 됩니다 ───────────────────────
# 앱의 check-notices-sync.ps1 은 이 문장이 licenses.html <b>에 있는지</b>만 봅니다.
# 여기서는 한 걸음 더 나아가 그 문장이 <b>data-i18n 뒤에 숨어 있지 않은지</b> 봅니다 —
# 키로 바뀌는 순간 30개 언어에서 다른 문장이 되고, 관문은 원문만 보므로 통과합니다.
$licPath = Join-Path $Root 'licenses.html'
if (Test-Path $licPath) {
    $lic = [System.IO.File]::ReadAllText($licPath, $utf8)

    if (-not $lic.Contains($attribution)) {
        $problems += "licenses.html 에 CC-BY 저작자 표시 문구가 그대로 없습니다: `"$attribution`""
    }
    if ($lic -match "<[^>]*data-i18n[^>]*>[^<]*Opus-MT models by Helsinki-NLP") {
        $problems += "🔴 CC-BY 저작자 표시 문구가 data-i18n 안에 있습니다 — 번역되면 라이선스 위반입니다. 리터럴로 두십시오."
    }
}

# ── 4. HTML ↔ JSON 양방향 ─────────────────────────────────────────────────
$htmlKeys = @{}
$pages = Get-ChildItem $Root -Filter '*.html' | Sort-Object Name

foreach ($p in $pages) {
    $text = [System.IO.File]::ReadAllText($p.FullName, $utf8)

    # 페이지 스코프 — 없으면 첫 화면의 meta 키를 공유합니다.
    $scope = ''
    $m = [regex]::Match($text, 'data-i18n-scope="([^"]+)"')
    if ($m.Success) { $scope = $m.Groups[1].Value + '.' }

    foreach ($k in $codeKeys) {
        if ($k.StartsWith('meta.')) { $htmlKeys[$scope + $k] = $true }
    }

    foreach ($mm in [regex]::Matches($text, 'data-i18n(?:-html)?="([^"]+)"')) {
        $htmlKeys[$mm.Groups[1].Value] = $true
    }
}
foreach ($k in $codeKeys) { $htmlKeys[$k] = $true }

if ($keysOf.ContainsKey('en')) {
    # HTML → JSON: 화면에 있는 키가 사전에 없으면 그 자리는 영원히 한국어입니다.
    foreach ($k in $htmlKeys.Keys) {
        if ($keysOf['en'] -notcontains $k) {
            $problems += "HTML 이 쓰는 키 '$k' 가 i18n/en.json 에 없습니다 — 그 자리는 모든 언어에서 한국어로 남습니다."
        }
    }
    # JSON → HTML: 아무도 안 쓰는 키는 30개 파일을 무겁게 할 뿐입니다.
    $orphans = @($keysOf['en'] | Where-Object { -not $htmlKeys.ContainsKey($_) })
    if ($orphans.Count -gt 0) {
        $notes += "아무 HTML 도 쓰지 않는 키 $($orphans.Count)개: $(($orphans | Select-Object -First 8) -join ', ')"
    }
}

# ── 5. data-i18n 값에 태그가 들어갔는가 ───────────────────────────────────
# textContent 로 넣으므로 <b> 는 글자 그대로 화면에 보입니다. HTML 이 필요하면
# 그 자리를 data-i18n-html 로 바꿔야 합니다.
$textOnlyKeys = @{}
foreach ($p in $pages) {
    $text = [System.IO.File]::ReadAllText($p.FullName, $utf8)
    foreach ($mm in [regex]::Matches($text, 'data-i18n="([^"]+)"')) {
        $textOnlyKeys[$mm.Groups[1].Value] = $true
    }
}
foreach ($f in $files) {
    if (-not $keysOf.ContainsKey($f.BaseName)) { continue }
    $obj = [System.IO.File]::ReadAllText($f.FullName, $utf8) | ConvertFrom-Json
    foreach ($prop in $obj.PSObject.Properties) {
        if (-not $textOnlyKeys.ContainsKey($prop.Name)) { continue }
        if (([string]$prop.Value).Contains('<')) {
            $problems += "i18n/$($f.Name) · $($prop.Name) 값에 '<' 가 있는데 그 자리는 data-i18n(텍스트)입니다 — 태그가 글자로 보입니다."
        }
    }
}

# ── 결과 ──────────────────────────────────────────────────────────────────
Write-Host ""
if ($todo.Count -gt 0) {
    Write-Host "아직 (계획된 조각):" -ForegroundColor DarkGray
    $todo | Sort-Object -Unique | ForEach-Object { Write-Host "  · $_" -ForegroundColor DarkGray }
    Write-Host ""
}
if ($notes.Count -gt 0) {
    $notes | ForEach-Object { Write-Host "  · $_" -ForegroundColor DarkGray }
    Write-Host ""
}

if ($problems.Count -gt 0) {
    Write-Host "다국어 검사 실패 — $($problems.Count)건" -ForegroundColor Red
    $problems | Select-Object -First 40 | ForEach-Object { Write-Host "  X $_" -ForegroundColor Red }
    if ($problems.Count -gt 40) { Write-Host "  … 그 밖 $($problems.Count - 40)건" -ForegroundColor Red }
    Write-Host ""
    exit 1
}

$keyCount = 0
if ($keysOf.ContainsKey('en')) { $keyCount = $keysOf['en'].Count }
Write-Host "다국어 검사 통과 (파일 $($files.Count)개 · 키 $keyCount 개)" -ForegroundColor Green
Write-Host ""
exit 0
