# 온말 홈페이지 — 자체 호스팅 글꼴 만들기
#
# 세 서체를 <b>이 사이트에 실제로 나오는 글자로만</b> 잘라 woff2 로 만듭니다.
# 결과는 fonts/ 에 커밋합니다. 원본(8 MB짜리)은 tools/.fontsrc/ 에 받아 두고
# 커밋하지 않습니다.
#
# 🔴 자른 글꼴을 동봉하는 순간 OFL 의무가 생깁니다. 이 스크립트는 라이선스 전문도
#    함께 받아 fonts/ 에 씁니다. 하나라도 못 받으면 <b>멈춥니다</b> — 글꼴만 있고
#    라이선스가 빠진 상태로 배포되는 것이 가장 나쁩니다.
#
# 🔴 글자 집합은 index/privacy/terms/licenses 네 페이지와 i18n 30개에서 뽑습니다.
#    섹션이나 번역을 더한 뒤에는 <b>이 스크립트를 다시 돌려야</b> 합니다. 안 그러면
#    새 글자가 조용히 시스템 글꼴로 떨어집니다(경고가 없습니다).
#
# 필요한 것:  python -m pip install fonttools brotli
# 사용:       python tools/make-fonts.py

import io
import pathlib
import re
import sys
import urllib.request

from fontTools.ttLib import TTFont
from fontTools import subset

HERE = pathlib.Path(__file__).resolve().parent
SITE = HERE.parent
OUT = SITE / "fonts"
CACHE = HERE / ".fontsrc"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0 Safari/537.36"}

PAGES = ["index.html", "privacy.html", "terms.html", "licenses.html"]

# 라이선스 전문. 글꼴을 하나라도 더하면 여기에도 한 줄 더해야 합니다.
# 주소를 여럿 두는 이유: 상류 저장소가 옮겨 다닙니다. 고운바탕은 자체 저장소가
# 없고 Google Fonts 저장소의 ofl/ 아래에 있습니다.
LICENSES = {
    "Pretendard-OFL.txt": [
        "https://raw.githubusercontent.com/orioncactus/pretendard/main/LICENSE",
    ],
    "JetBrainsMono-OFL.txt": [
        "https://raw.githubusercontent.com/JetBrains/JetBrainsMono/master/OFL.txt",
    ],
    "GowunBatang-OFL.txt": [
        "https://raw.githubusercontent.com/google/fonts/main/ofl/gowunbatang/OFL.txt",
        "https://raw.githubusercontent.com/googlefonts/gowun-batang/main/OFL.txt",
    ],
}

# 가변 글꼴 한 벌이 400~700 을 다 담습니다 — 굵기마다 파일을 두지 않습니다.
PRETENDARD = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/public/variable/PretendardVariable.ttf"

# Google Fonts 는 굵기별로 파일이 갈립니다. CSS 를 읽어 굵기→주소를 맞춥니다
# (순서로 짐작하면 400 과 700 이 뒤바뀌어도 아무 말 없이 지나갑니다).
# ⚠️ 여기 적은 굵기는 <b>실제로 쓰는 것만</b>입니다. 안 쓰는 굵기를 넣으면 아티팩트가
#    그만큼 무거워집니다 — data: URI 는 안 쓰더라도 파일 안에 그대로 들어갑니다.
#    2026-08-03 실측: --display 를 부르는 자리가 전부 font-weight:700 이라
#    고운바탕 400 을 뺐습니다(74 KB · base64 98 KB). 400 을 쓰는 자리가 생기면
#    여기 400 을 되살리고 styles/fonts.css 에 @font-face 를 더하십시오.
GOOGLE = {
    "GowunBatang": "Gowun+Batang:wght@700",
    "JetBrainsMono": "JetBrains+Mono:wght@400;500",
}


def fetch(url: str, cache_name: str | None = None) -> bytes:
    if cache_name:
        f = CACHE / cache_name
        if f.exists():
            return f.read_bytes()
    data = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=180).read()
    if cache_name:
        CACHE.mkdir(parents=True, exist_ok=True)
        f.write_bytes(data)
    return data


def needed_chars() -> set[str]:
    """이 사이트가 실제로 그려야 하는 글자."""
    chars: set[str] = set()
    for p in PAGES:
        chars |= set((SITE / p).read_text(encoding="utf-8"))
    for p in sorted((SITE / "i18n").glob("*.json")):
        chars |= set(p.read_text(encoding="utf-8"))
    # 제어 문자는 글리프가 없습니다.
    return {c for c in chars if ord(c) >= 0x20}


def rename_family(font, new_family: str) -> None:
    """글꼴 안에 적힌 이름을 바꿉니다.

    🔴 OFL §3: "No Modified Version of the Font Software may use the Reserved
       Font Name(s)... This restriction only applies to the primary font name as
       presented to the users." <b>자르는 것은 Modified Version 입니다.</b>
       그러니 RFN 이 걸린 글꼴은 자른 뒤 이름을 반드시 바꿔야 합니다.
       CSS 의 font-family 만 바꾸는 것으로는 부족합니다 — 글꼴 파일 안에도
       이름이 적혀 있고 그쪽이 사용자에게 보이는 이름입니다.

    저작자 표시는 그대로 둡니다(nameID 0 저작권 · 13 라이선스 · 14 라이선스 주소).
    바꾸는 것은 이름뿐입니다.
    """
    ps = new_family.replace(" ", "")
    for rec in font["name"].names:
        # 1 글꼴 가족 · 3 고유 식별자 · 4 전체 이름 · 6 PostScript 이름
        # 16 타이포그래피 가족 · 21 WWS 가족
        if rec.nameID in (1, 3, 4, 16, 21):
            rec.string = new_family
        elif rec.nameID == 6:
            rec.string = ps


def cut(raw: bytes, chars: set[str], rename: str | None = None) -> bytes:
    """원본 글꼴을 주어진 글자만 남기고 잘라 woff2 로."""
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.desubroutinize = True
    opts.layout_features = ["*"]   # 아랍어 결합·합자·커닝을 잃지 않게
    opts.name_IDs = ["*"]          # 저작권·라이선스 문자열 유지 (OFL 의무)
    opts.notdef_outline = True
    font = subset.load_font(io.BytesIO(raw), opts)
    ss = subset.Subsetter(options=opts)
    # 🔴 populate 를 빠뜨리면 아무 글자도 안 남기고 600 B 짜리 빈 글꼴이 나옵니다.
    #    화면에서는 조용히 시스템 글꼴로 떨어져 알아채기 어렵습니다.
    ss.populate(unicodes=[ord(c) for c in chars])
    ss.subset(font)
    if rename:
        rename_family(font, rename)
    buf = io.BytesIO()
    subset.save_font(font, buf, opts)
    font.close()
    return buf.getvalue()


def coverage(raw: bytes) -> set[str]:
    f = TTFont(io.BytesIO(raw), fontNumber=0, lazy=True)
    cov: set[str] = set()
    for t in f["cmap"].tables:
        cov |= {chr(c) for c in t.cmap.keys()}
    f.close()
    return cov


def main() -> int:
    OUT.mkdir(exist_ok=True)
    chars = needed_chars()
    print(f"사이트에 나오는 고유 글자  {len(chars):,}자\n")

    # 🔴 Reserved Font Name 이 걸린 글꼴은 자른 뒤 이름을 바꿔야 합니다(OFL §3).
    #    셋 중 Pretendard 만 해당합니다 — 저작권 줄에 "with Reserved Font Name
    #    'Pretendard'" 가 있습니다. Gowun Batang · JetBrains Mono 는 RFN 이 없어
    #    이름을 그대로 씁니다. 새로 만들 때마다 fonts/*-OFL.txt 를 다시 확인하십시오.
    RENAME = {"PretendardVariable": "Onmal Sans"}

    jobs: list[tuple[str, bytes]] = []

    for name, spec in GOOGLE.items():
        css = fetch(f"https://fonts.googleapis.com/css2?family={spec}").decode("utf-8")
        # @font-face 블록마다 굵기와 주소를 함께 뽑습니다.
        blocks = re.findall(r"@font-face\s*\{(.*?)\}", css, re.S)
        found = 0
        for b in blocks:
            mw = re.search(r"font-weight:\s*(\d+)", b)
            mu = re.search(r"url\((https://[^)]+)\)", b)
            if not (mw and mu):
                continue
            weight = mw.group(1)
            jobs.append((f"{name}-{weight}", fetch(mu.group(1), f"{name}-{weight}.src")))
            found += 1
        if found == 0:
            print(f"멈춤: {name} 의 @font-face 를 Google Fonts CSS 에서 못 찾았습니다.")
            return 1

    jobs.append(("PretendardVariable", fetch(PRETENDARD, "PretendardVariable.src")))

    print(f"{'파일':28} {'원본':>11} {'덮는 글자':>9} {'woff2':>10}  이름")
    print("-" * 76)
    total = 0
    for name, raw in jobs:
        hit = chars & coverage(raw)
        data = cut(raw, hit, RENAME.get(name))
        # 빈 글꼴 방어 — 이 크기면 글리프가 안 들어간 것입니다.
        if len(data) < 4000:
            print(f"멈춤: {name} 이 {len(data):,} B 로 나왔습니다. 글리프가 안 들어갔습니다.")
            return 1
        (OUT / f"{name}.woff2").write_bytes(data)
        total += len(data)
        tag = f"  → {RENAME[name]} (RFN 때문에 개명)" if name in RENAME else ""
        print(f"{name + '.woff2':28} {len(raw):>11,} {len(hit):>9,} {len(data):>10,}{tag}")
    print("-" * 76)
    print(f"{'합계':28} {'':>11} {'':>9} {total:>10,}")
    print(f"{'base64 환산':28} {'':>11} {'':>9} {total * 4 // 3:>10,}")

    print("\n라이선스 전문")
    for fname, urls in LICENSES.items():
        text, last = None, None
        for u in urls:
            try:
                text = fetch(u).decode("utf-8")
                break
            except Exception as e:
                last = f"{u} — {e}"
        if text is None:
            print(f"  멈춤: {fname} 을 못 받았습니다 — {last}")
            print("  🔴 글꼴만 있고 라이선스가 빠진 상태로는 배포할 수 없습니다.")
            return 1
        if "SIL OPEN FONT LICENSE" not in text.upper():
            print(f"  멈춤: {fname} 이 OFL 전문으로 보이지 않습니다 ({len(text)} B).")
            return 1
        (OUT / fname).write_text(text, encoding="utf-8", newline="\n")
        first = next((l for l in text.splitlines() if l.strip().lower().startswith("copyright")), "?")
        print(f"  {fname:26} {len(text):>7,} B   {first.strip()[:56]}")

    print("\nfonts/ 에 썼습니다. styles/fonts.css 가 이 파일들을 가리킵니다.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
