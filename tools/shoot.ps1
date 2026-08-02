<#
.SYNOPSIS
    홈페이지를 전체 페이지로 촬영하고, 지난 촬영과 픽셀 단위로 비교합니다.

.DESCRIPTION
    🔴 <b>C1(CSS 공유화)의 목표는 "시각 변화 0"</b> 인데, 사람 눈으로는 여백 1px 이
    달라진 것을 못 봅니다. 이 도구가 그걸 대신 봅니다.

    헤드리스 Chrome 을 씁니다. 테마는 <c>--force-dark-mode</c> 로 정합니다 —
    사이트의 인라인 스크립트가 <c>prefers-color-scheme</c> 을 읽으므로 그것만으로
    라이트·다크가 갈립니다(localStorage 를 건드릴 필요가 없습니다).

    ⚠️ <b>이 저장소의 Browser 창으로는 못 찍습니다</b> — 창이 숨어 있으면 페이지가
    프레임을 합성하지 않아 스크린샷이 시간 초과로 죽습니다. 그래서 헤드리스입니다.

    ⚠️ 결과는 <c>tools/shots/</c> 에 쌓이고 <b>커밋하지 않습니다</b>(.gitignore).
    전체 페이지 PNG 는 한 장에 수 MB 라 공개 저장소에 넣을 것이 아닙니다.

.EXAMPLE
    .\tools\shoot.ps1 -Label C0-baseline
    .\tools\shoot.ps1 -Label C1-after -CompareWith C0-baseline
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)][string]$Label,
    [string]$CompareWith = '',
    [string]$Root = (Split-Path -Parent $PSScriptRoot),
    [string]$BaseUrl = 'http://localhost:8765',
    [int]$Width = 1280
)

$ErrorActionPreference = 'Stop'

$chrome = @(
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { throw "헤드리스로 쓸 Chrome/Edge 를 찾지 못했습니다." }

# 페이지마다 창 높이를 따로 둡니다. 내용보다 낮으면 아래가 잘리고, 지나치게 높으면
# 빈 픽셀만 늘어 비교가 둔해집니다. 값은 2026-08-02 실측 + 여유입니다.
$pages = @(
    @{ File = 'index.html';       Height = 8400 },
    @{ File = 'privacy.html';     Height = 5200 },
    @{ File = 'terms.html';       Height = 4600 },
    @{ File = 'licenses.html';    Height = 4800 },
    @{ File = 'privacy.en.html';  Height = 5200 },
    @{ File = 'terms.en.html';    Height = 4600 }
)
$themes = @(
    @{ Name = 'light'; Flag = '' },
    @{ Name = 'dark';  Flag = '--force-dark-mode' }
)

$outDir = Join-Path $PSScriptRoot "shots\$Label"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

Write-Host ""
Write-Host "촬영 → $outDir" -ForegroundColor White

$shot = 0
foreach ($page in $pages) {
    if (-not (Test-Path (Join-Path $Root $page.File))) { continue }

    foreach ($theme in $themes) {
        $name = [System.IO.Path]::GetFileNameWithoutExtension($page.File) -replace '\.', '-'
        $target = Join-Path $outDir "$name-$($theme.Name).png"
        if (Test-Path $target) { Remove-Item $target }

        # ⚠️ Chrome 은 USB 열거 실패 같은 것을 stderr 로 흘립니다. PowerShell 5.1 에서
        #    native stderr 를 `2>&1` 로 받으면 ErrorRecord 가 되어 $ErrorActionPreference
        #    = 'Stop' 아래에서 <b>촬영이 통째로 죽습니다.</b> 그래서 리디렉션하지 않고
        #    Chrome 쪽에서 로그를 끕니다.
        $args = @(
            '--headless=new', '--disable-gpu', '--hide-scrollbars',
            '--log-level=3', '--disable-logging', '--no-first-run',
            # 애니메이션·lazy 이미지가 도착할 시간을 줍니다. 실시간이 아니라 가상 시계라
            # 실제로 4초를 기다리지는 않습니다.
            '--virtual-time-budget=5000',
            "--window-size=$Width,$($page.Height)",
            "--screenshot=$target"
        )
        if ($theme.Flag) { $args += $theme.Flag }
        $args += "$BaseUrl/$($page.File)"

        & $chrome @args | Out-Null

        if (Test-Path $target) {
            $shot++
            Write-Host ("  " + (Split-Path -Leaf $target) + "  " +
                [math]::Round((Get-Item $target).Length / 1KB) + " KB") -ForegroundColor DarkGray
        } else {
            Write-Host "  X 못 찍었습니다: $($page.File) / $($theme.Name)" -ForegroundColor Red
        }
    }
}

Write-Host "$shot 장" -ForegroundColor Green

# ── 비교 ──────────────────────────────────────────────────────────────────
if (-not $CompareWith) { Write-Host ""; exit 0 }

Add-Type -AssemblyName System.Drawing

$prevDir = Join-Path $PSScriptRoot "shots\$CompareWith"
if (-not (Test-Path $prevDir)) { throw "비교할 촬영이 없습니다: $prevDir" }

Write-Host ""
Write-Host "비교: $CompareWith → $Label" -ForegroundColor White

# PNG 두 장의 픽셀이 얼마나 다른지. 같은 크기가 아니면 그 자체가 변화입니다.
function Compare-Png([string]$a, [string]$b) {
    $ia = [System.Drawing.Bitmap]::FromFile($a)
    $ib = [System.Drawing.Bitmap]::FromFile($b)
    try {
        if ($ia.Width -ne $ib.Width -or $ia.Height -ne $ib.Height) {
            return @{ Same = $false; Reason = "크기가 다릅니다 ($($ia.Width)x$($ia.Height) → $($ib.Width)x$($ib.Height))" }
        }

        $rect = New-Object System.Drawing.Rectangle 0, 0, $ia.Width, $ia.Height
        $fmt = [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
        $da = $ia.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, $fmt)
        $db = $ib.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, $fmt)
        try {
            $len = [Math]::Abs($da.Stride) * $ia.Height
            $ba = New-Object byte[] $len
            $bb = New-Object byte[] $len
            [System.Runtime.InteropServices.Marshal]::Copy($da.Scan0, $ba, 0, $len)
            [System.Runtime.InteropServices.Marshal]::Copy($db.Scan0, $bb, 0, $len)

            $diff = 0
            for ($i = 0; $i -lt $len; $i += 4) {
                if ($ba[$i] -ne $bb[$i] -or $ba[$i+1] -ne $bb[$i+1] -or $ba[$i+2] -ne $bb[$i+2]) { $diff++ }
            }
            $total = $ia.Width * $ia.Height
            return @{ Same = ($diff -eq 0); Diff = $diff; Total = $total
                      Reason = "다른 픽셀 $diff / $total ($([math]::Round(100.0*$diff/$total,3))%)" }
        } finally {
            $ia.UnlockBits($da); $ib.UnlockBits($db)
        }
    } finally {
        $ia.Dispose(); $ib.Dispose()
    }
}

$changed = 0
foreach ($f in (Get-ChildItem $outDir -Filter '*.png' | Sort-Object Name)) {
    $prev = Join-Path $prevDir $f.Name
    if (-not (Test-Path $prev)) {
        Write-Host "  + $($f.Name) — 지난 촬영에 없던 페이지" -ForegroundColor Yellow
        continue
    }

    $r = Compare-Png $prev $f.FullName
    if ($r.Same) {
        Write-Host "  = $($f.Name)" -ForegroundColor DarkGray
    } else {
        $changed++
        Write-Host "  ~ $($f.Name) — $($r.Reason)" -ForegroundColor Yellow
    }
}

Write-Host ""
if ($changed -eq 0) {
    Write-Host "픽셀이 하나도 안 바뀌었습니다." -ForegroundColor Green
} else {
    Write-Host "$changed 장이 달라졌습니다 — 의도한 변화인지 눈으로 확인하십시오." -ForegroundColor Yellow
}
Write-Host ""
