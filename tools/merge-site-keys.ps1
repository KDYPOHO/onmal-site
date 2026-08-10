<#
.SYNOPSIS
    onmal-site 의 i18n JSON 에 키 묶음을 병합합니다.

.DESCRIPTION
    홈페이지 번역 파일은 30개 언어이고, 새 페이지를 다국어화할 때마다 30개를
    손으로 고치면 반드시 하나를 빠뜨립니다. 이 스크립트가 그 병합을 대신합니다.

    ⚠️ 텍스트로 이어붙입니다. ConvertTo-Json 을 쓰지 않는 이유:
       PowerShell 5.1 의 ConvertTo-Json 은 비ASCII 문자를 \uXXXX 로 이스케이프해서
       한국어·일본어·아랍어 파일 전체를 알아볼 수 없게 바꿔 놓습니다. diff 도 무의미해집니다.

    파일은 BOM 없는 UTF-8 로 씁니다 — 기존 i18n 파일과 같은 인코딩입니다.

.PARAMETER SourceDir
    언어 코드별 부분 JSON 이 들어 있는 폴더 (예: en.json 에 새 키만 담긴 것).

.PARAMETER TargetDir
    onmal-site/i18n 폴더.

.PARAMETER Check
    쓰지 않고 검사만 합니다. 빠진 언어·빠진 키가 있으면 실패합니다.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$SourceDir,
    [Parameter(Mandatory = $true)][string]$TargetDir,
    [switch]$Check
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $SourceDir)) { throw "원본 폴더가 없습니다: $SourceDir" }
if (-not (Test-Path $TargetDir)) { throw "대상 폴더가 없습니다: $TargetDir" }

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$targets = Get-ChildItem -Path $TargetDir -Filter '*.json' | Sort-Object Name

$missing = @()
$merged = 0
$skipped = 0

foreach ($target in $targets) {
    $code = [System.IO.Path]::GetFileNameWithoutExtension($target.Name)
    $sourcePath = Join-Path $SourceDir "$code.json"

    if (-not (Test-Path $sourcePath)) {
        $missing += $code
        continue
    }

    $sourceText = [System.IO.File]::ReadAllText($sourcePath, $utf8NoBom)
    $targetText = [System.IO.File]::ReadAllText($target.FullName, $utf8NoBom)

    # 부분 JSON 이 유효한지 먼저 확인합니다. 깨진 JSON 을 병합하면 페이지 전체가 한국어로 폴백합니다.
    try { $sourceObj = $sourceText | ConvertFrom-Json } catch { throw "$code 부분 JSON 이 잘못되었습니다: $_" }

    $newKeys = @($sourceObj.PSObject.Properties.Name)
    if ($newKeys.Count -eq 0) { throw "$code 부분 JSON 에 키가 없습니다." }

    # 이미 병합된 파일은 건너뜁니다 (여러 번 돌려도 안전해야 합니다).
    $already = $true
    foreach ($k in $newKeys) {
        if ($targetText -notmatch [regex]::Escape('"' + $k + '"')) { $already = $false; break }
    }
    if ($already) { $skipped++; continue }

    if ($Check) { $missing += "$code (키 미병합)"; continue }

    # 본문 = 바깥 중괄호 사이. 마지막 '}' 앞에 새 키를 끼워 넣습니다.
    $lastBrace = $targetText.LastIndexOf('}')
    if ($lastBrace -lt 0) { throw "$code 대상 JSON 에 닫는 중괄호가 없습니다." }

    $body = $targetText.Substring(0, $lastBrace).TrimEnd()
    if (-not $body.EndsWith(',')) { $body += ',' }

    # 부분 JSON 의 바깥 중괄호를 벗겨 내용만 씁니다.
    $inner = $sourceText.Trim()
    $inner = $inner.Substring($inner.IndexOf('{') + 1)
    $inner = $inner.Substring(0, $inner.LastIndexOf('}')).Trim().TrimEnd(',')

    $result = $body + "`n`n" + $inner + "`n}`n"

    # 쓰기 전에 최종 JSON 이 유효한지 확인합니다. 깨진 채 저장하면 그 언어가 통째로 죽습니다.
    try { $null = $result | ConvertFrom-Json } catch { throw "$code 병합 결과가 잘못된 JSON 입니다: $_" }

    [System.IO.File]::WriteAllText($target.FullName, $result, $utf8NoBom)
    $merged++
}

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "빠진 언어: $($missing -join ', ')" -ForegroundColor Red
    Write-Host ""
    exit 1
}

# ⚠️ 한글은 PowerShell 변수명에 유효한 문자입니다. "$merged개" 라고 쓰면 파서가
#    '$merged개' 라는 (존재하지 않는) 변수로 읽어 빈 문자열이 나옵니다 — 실제로 그랬습니다.
#    한글이 곧바로 붙는 변수는 반드시 $() 로 감싸십시오.
if ($Check) {
    Write-Host "병합 검사 통과 — $($targets.Count)개 언어 모두 키가 들어 있습니다." -ForegroundColor Green
} else {
    Write-Host "병합 완료 — 갱신 $($merged)개 · 이미 반영됨 $($skipped)개 (전체 $($targets.Count)개)" -ForegroundColor Green
}
