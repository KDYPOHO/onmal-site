<#
.SYNOPSIS
    이미 있는 키의 <b>값</b>을 30개 언어 파일에서 한 번에 바꿉니다.

.DESCRIPTION
    앱 저장소의 merge-site-keys.ps1 은 <b>없는 키를 더하는</b> 도구입니다. 이미 있는
    문구를 고치는 길은 없었고, 그래서 문구 하나를 정정하려면 30개 파일을 손으로
    열어야 했습니다 — 반드시 몇 개를 빠뜨립니다.

    🔴 <c>ConvertTo-Json</c> 으로 다시 쓰지 않습니다. PowerShell 5.1 은 비ASCII 를
    <c>\uXXXX</c> 로 이스케이프해서 한국어·아랍어·태국어 파일을 통째로 알아볼 수 없게
    만들고 diff 도 무의미해집니다. <b>값 자리만 문자열로 갈아끼웁니다.</b>

    쓰기 전에 결과가 유효한 JSON 인지 확인합니다 — 깨진 채 저장하면 그 언어의
    홈페이지가 통째로 한국어로 폴백하고, 아무 오류도 안 납니다.

.PARAMETER Values
    { "언어코드": { "키": "새 값", ... }, ... } 모양의 JSON 파일.

.PARAMETER TargetDir
    i18n 폴더.

.PARAMETER WhatIf
    쓰지 않고 무엇이 바뀔지만 보여줍니다.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)][string]$Values,
    [string]$TargetDir = (Join-Path (Split-Path -Parent $PSScriptRoot) 'i18n'),
    [switch]$WhatIf
)

$ErrorActionPreference = 'Stop'

$utf8 = New-Object System.Text.UTF8Encoding($false)
if (-not (Test-Path $Values)) { throw "값 파일이 없습니다: $Values" }
if (-not (Test-Path $TargetDir)) { throw "i18n 폴더가 없습니다: $TargetDir" }

$plan = [System.IO.File]::ReadAllText($Values, $utf8) | ConvertFrom-Json

# JSON 문자열 값으로 넣을 수 있게 최소한만 이스케이프합니다.
# (비ASCII 는 그대로 둡니다 — 그게 이 도구의 요점입니다.)
function Escape-JsonString([string]$s) {
    $s = $s.Replace('\', '\\')
    $s = $s.Replace('"', '\"')
    $s = $s.Replace("`r", '\r').Replace("`n", '\n').Replace("`t", '\t')
    return $s
}

$changed = 0
$missing = @()

foreach ($langProp in $plan.PSObject.Properties) {
    $code = $langProp.Name
    $path = Join-Path $TargetDir "$code.json"
    if (-not (Test-Path $path)) { $missing += "$code (파일 없음)"; continue }

    $text = [System.IO.File]::ReadAllText($path, $utf8)
    $before = $text

    foreach ($kv in $langProp.Value.PSObject.Properties) {
        $key = $kv.Name
        $new = Escape-JsonString ([string]$kv.Value)

        # "키" : "값"  —  값 안의 \" 는 값의 일부이므로 (?:[^"\\]|\\.)* 로 건너뜁니다.
        $pattern = '("' + [regex]::Escape($key) + '"\s*:\s*")(?:[^"\\]|\\.)*(")'

        # 없는 키는 <b>더합니다</b>. 값을 고치는 것과 키를 새로 넣는 것은 같은 작업의
        # 두 얼굴이고, 도구가 둘로 갈리면 새 키를 넣을 때마다 30개 파일을 손으로 엽니다.
        if ($text -notmatch $pattern) {
            $lastBrace = $text.LastIndexOf('}')
            if ($lastBrace -lt 0) { throw "$code 대상 JSON 에 닫는 중괄호가 없습니다." }
            $body = $text.Substring(0, $lastBrace).TrimEnd()
            if (-not $body.EndsWith(',')) { $body += ',' }
            $text = $body + "`n  `"" + $key + "`": `"" + $new + "`"`n}`n"
            continue
        }

        # 🔴 MatchEvaluator 를 씁니다. -replace 의 치환 문자열에서는 값에 들어 있는
        #    '$' 가 그룹 참조로 해석됩니다("$1" 같은 문구가 사라집니다).
        $text = [regex]::Replace($text, $pattern, {
            param($m) $m.Groups[1].Value + $new + $m.Groups[2].Value
        }, 1)
    }

    if ($text -eq $before) { continue }

    try { $null = $text | ConvertFrom-Json }
    catch { throw "$code 결과가 잘못된 JSON 입니다 — 아무것도 쓰지 않았습니다: $_" }

    if ($WhatIf) {
        Write-Host "  (WhatIf) $code.json" -ForegroundColor DarkGray
    } else {
        [System.IO.File]::WriteAllText($path, $text, $utf8)
    }
    $changed++
}

Write-Host ""
if ($missing.Count -gt 0) {
    Write-Host "못 바꾼 것:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "  X $_" -ForegroundColor Red }
    Write-Host ""
    exit 1
}

Write-Host "값 교체 완료 — $($changed)개 파일" -ForegroundColor Green
Write-Host ""
