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

    🔴 <b>index.html 은 바닥 잡음이 있습니다 — 약 5,800픽셀(0.03%).</b> 아무것도 안
    바꾸고 두 번 찍어도 그만큼 다릅니다(2026-08-03 실측: 5,757·5,564픽셀).
    <b>"덩어리로 뭉쳐 있으면 진짜 변화"라는 옛 규칙은 이제 못 씁니다</b> — 잡음이
    바로 그 모습이기 때문입니다. 셋 중 둘은 큰 덩어리입니다:
      · 히어로 데모 자막 · '듣는 중' 파형   글자 가장자리에 20~90픽셀 (예전 그대로)
      · 사양 h2 · 로드맵 h2                 3,205 · 2,528픽셀, <b>매번 같은 개수</b>
    뒤의 둘은 스크롤 구동(section > h2 의 scene-in)이 <b>전체 페이지 창에서는</b>
    스크롤이 없어 진행값이 붙박이가 되는 탓입니다. transform 이 걸린 채로 굳느냐
    아니냐에 따라 글자 래스터가 통째로 갈려, 제목 한 줄이 덩어리로 잡힙니다.
    🔴 <b>의심되면 같은 원본을 두 번 찍어 견주십시오</b>
       (<c>-Label X2 -CompareWith X</c>). 덩어리가 같은 자리·같은 개수면 잡음입니다.
    문서 세 페이지는 움직이는 것이 없어 픽셀이 완전히 같습니다 — 거기서 1픽셀이라도
    달라지면 의심하십시오.

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
    [int]$Width = 1280,
    # 원본 페이지 대신 <b>아티팩트 산출물</b>의 라우트를 찍습니다. 파일 이름은 같게
    # 두어 -CompareWith 로 원본과 바로 견줄 수 있습니다(A4 이식 충실도 대조).
    [switch]$Artifact
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
    # 2026-08-03: C5 섹션 셋 + scene.css 장면 여백 + 붙여 두는 구간 <b>둘</b>
    # (#shots 의 min(180vh,1500px) · #how 의 min(150vh,1200px)) 까지 더해
    # 14,616px 입니다 (2026-08-03 실측 — 창을 1,000 으로 잡든 1,500 으로 잡든 같은
    # 값이라 두 상한이 제대로 걸린 것을 확인했습니다).
    # ⚠️ 실제보다 낮으면 <b>아래가 잘린 채</b> 찍히고 비교는 통과합니다 — 조용합니다.
    # ⚠️ 붙여 두는 구간의 늘린 높이는 <b>절대값 상한</b>이 걸려 있어 창을 키워도 함께
    #    커지지 않습니다. 상한을 vh 로만 두면 이 창 높이가 그대로 곱해져 문서가 터집니다.
    # 🔴 <b>구간을 하나 더 붙일 때마다 여기를 올리십시오.</b> #how 를 붙이면서 문서가
    #    1,176px 자랐고, 그 사실을 잊으면 아래 세 섹션이 조용히 잘립니다.
    @{ File = 'index.html';       Height = 15100; Route = '' },
    @{ File = 'privacy.html';     Height = 5200; Route = '#/privacy' },
    @{ File = 'terms.html';       Height = 4600; Route = '#/terms' },
    @{ File = 'licenses.html';    Height = 4800; Route = '#/licenses' },
    # 아직 없는 영어본(C8). 아티팩트에도 대응 라우트가 없습니다.
    @{ File = 'privacy.en.html';  Height = 5200; Route = $null },
    @{ File = 'terms.en.html';    Height = 4600; Route = $null }
)

# 아티팩트는 파일 하나가 곧 네 페이지입니다 — 해시로 라우트를 고릅니다.
$artifactPage = 'dist/preview.html'
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
    if ($Artifact) {
        # 아티팩트에 대응 라우트가 없는 페이지는 건너뜁니다.
        if (-not $page.Route -and $page.File -ne 'index.html') { continue }
        if (-not (Test-Path (Join-Path $Root $artifactPage))) {
            throw "산출물이 없습니다: $artifactPage — 먼저 tools\build-artifact.ps1 을 돌리십시오."
        }
    }
    elseif (-not (Test-Path (Join-Path $Root $page.File))) { continue }

    foreach ($theme in $themes) {
        $name = [System.IO.Path]::GetFileNameWithoutExtension($page.File) -replace '\.', '-'
        $target = Join-Path $outDir "$name-$($theme.Name).png"
        if (Test-Path $target) { Remove-Item $target }

        # 🔴 Chrome 은 <b>성공 메시지까지</b> stderr 로 보냅니다("N bytes written to file").
        #    PowerShell 5.1 은 native stderr 를 ErrorRecord 로 감싸므로, 이 스크립트를
        #    `2>$null` 이나 `2>&1` 을 붙여 부르는 순간 $ErrorActionPreference='Stop' 에
        #    걸려 촬영이 통째로 죽습니다 — 부르는 쪽이 어떻게 부르든 안 죽게
        #    Start-Process 로 stderr 를 파일에 따로 받습니다.
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
        if ($Artifact) { $args += "$BaseUrl/$artifactPage$($page.Route)" }
        else { $args += "$BaseUrl/$($page.File)" }

        $errLog = Join-Path $env:TEMP "onmal-shoot-$PID.log"
        Start-Process -FilePath $chrome -ArgumentList $args -Wait -NoNewWindow `
            -RedirectStandardError $errLog -RedirectStandardOutput 'NUL' | Out-Null
        Remove-Item $errLog -ErrorAction SilentlyContinue

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
