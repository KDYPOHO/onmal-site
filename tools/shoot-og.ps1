<#
.SYNOPSIS
    공유 카드(og.png)를 1200×630 으로 다시 찍습니다.

.DESCRIPTION
    그전 og:image 는 <c>onmal_128.png</c> — <b>128×128 정사각</b>이었습니다. 카카오톡·
    디스코드·슬랙·트위터는 공유 카드를 가로로 자르므로, 정사각 아이콘을 넣으면
    좌우가 잘려 나가거나 여백만 크게 보입니다. 1200×630 은 그 서비스들이 공통으로
    기대하는 크기입니다.

    🔴 카드 원본(<c>tools/og/og.html</c>)은 사이트의 <c>styles/tokens.css</c> 를
    그대로 링크합니다. 팔레트를 바꾸면 이 스크립트를 다시 돌리십시오 — 안 그러면
    공유 카드만 옛 색으로 남고, 그건 아무도 눈치채지 못합니다.

    ⚠️ 정적 서버가 떠 있어야 합니다(글꼴과 tokens.css 를 http 로 받습니다).
       file:// 로 열면 Google Fonts 가 붙지 않아 한글이 폴백 글꼴로 찍힙니다.
#>
[CmdletBinding()]
param(
    [string]$Root = (Split-Path -Parent $PSScriptRoot),
    [string]$BaseUrl = 'http://localhost:8765'
)

$ErrorActionPreference = 'Stop'

$chrome = @(
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { throw "헤드리스로 쓸 Chrome/Edge 를 찾지 못했습니다." }

$target = Join-Path $Root 'og.png'
if (Test-Path $target) { Remove-Item $target }

# stderr 를 파일로 받습니다 — Chrome 은 성공 메시지도 stderr 로 보내고, PowerShell 5.1
# 은 그것을 ErrorRecord 로 감싸 $ErrorActionPreference='Stop' 아래에서 죽입니다.
$errLog = Join-Path $env:TEMP "onmal-og-$PID.log"
$args = @(
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--log-level=3', '--disable-logging', '--no-first-run',
    '--force-device-scale-factor=1',
    # 글꼴이 도착할 시간을 줍니다. 가상 시계라 실제로 기다리지는 않습니다.
    '--virtual-time-budget=8000',
    '--window-size=1200,630',
    "--screenshot=$target",
    "$BaseUrl/tools/og/og.html"
)
Start-Process -FilePath $chrome -ArgumentList $args -Wait -NoNewWindow `
    -RedirectStandardError $errLog -RedirectStandardOutput 'NUL' | Out-Null
Remove-Item $errLog -ErrorAction SilentlyContinue

if (-not (Test-Path $target)) { throw "og.png 를 찍지 못했습니다. 정적 서버가 떠 있습니까?" }

Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile($target)
$w = $img.Width; $h = $img.Height
$img.Dispose()

if ($w -ne 1200 -or $h -ne 630) { throw "크기가 1200x630 이 아닙니다: ${w}x${h}" }

Write-Host ""
Write-Host "og.png  ${w}x${h}  $([math]::Round((Get-Item $target).Length / 1KB, 1)) KB" -ForegroundColor Green
Write-Host ""
