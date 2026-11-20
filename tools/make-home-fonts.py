# 온말 React 홈페이지(website/) 글꼴 만들기 — 2026-11 새 디자인
#
# Pretendard 가변 글꼴과 고운바탕 400·700 을 홈페이지에 실제로 나오는 글자로만 잘라
# website/public/fonts/home-*.woff2 로 씁니다. 외부 글꼴 서버(Google Fonts·jsDelivr)에
# 접속하지 않도록 직접 담아 둡니다.
#
# 🔴 i18n.ts 나 화면 글자를 바꾸면 이 스크립트를 다시 돌리십시오. 안 그러면 새 글자가
#    경고 없이 시스템 글꼴로 보입니다. (npm test 의 font-coverage 검사가 잡아 줍니다.)
#
# 원본 글꼴(커밋하지 않음):
#   Pretendard 1.3.9  — npm pack pretendard@1.3.9 → package/dist/public/variable/PretendardVariable.ttf
#   Gowun Batang      — https://github.com/google/fonts/tree/main/ofl/gowunbatang
# 라이선스: 두 글꼴 모두 SIL OFL 1.1. 전문은 fonts/Pretendard-OFL.txt, fonts/GowunBatang-OFL.txt.
#
# 필요한 것: python -m pip install fonttools brotli
# 사용: python tools/make-home-fonts.py <PretendardVariable.ttf> <GowunBatang-Regular.ttf> <GowunBatang-Bold.ttf>

import pathlib
import sys

from fontTools import subset
from fontTools.ttLib import TTFont

SITE = pathlib.Path(__file__).resolve().parent.parent
WEB = SITE / "website"
OUT = WEB / "public" / "fonts"


def needed_text() -> str:
    parts = [(WEB / "index.html").read_text(encoding="utf-8")]
    for path in sorted((WEB / "src").rglob("*")):
        if path.suffix in {".ts", ".tsx"} and not path.name.endswith(".test.ts"):
            parts.append(path.read_text(encoding="utf-8"))
    # 기본 라틴 글자·숫자·문장부호는 언제나 넣습니다.
    parts.append("".join(chr(c) for c in range(0x20, 0x7F)))
    parts.append("‘’“”…–—·•←→↔©")
    return "".join(parts)


def make(src: str, dest: str, text: str) -> None:
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.name_languages = ["*"]
    options.notdef_outline = True
    options.hinting = False
    font = TTFont(src)
    sub = subset.Subsetter(options)
    sub.populate(text=text)
    sub.subset(font)
    OUT.mkdir(parents=True, exist_ok=True)
    font.flavor = "woff2"
    font.save(OUT / dest)
    print(f"{dest}: {(OUT / dest).stat().st_size:,} bytes")


def main() -> None:
    if len(sys.argv) != 4:
        sys.exit(__doc__ or "usage: make-home-fonts.py <Pretendard> <GowunRegular> <GowunBold>")
    text = needed_text()
    chars = "".join(sorted(set(text) - {"\n", "\r", "\t"}))
    print(f"{len(chars)} distinct characters")
    # npm test 가 화면 글자가 모두 이 목록에 있는지 확인합니다.
    (WEB / "font-subset-chars.txt").write_text(chars, encoding="utf-8")
    make(sys.argv[1], "home-pretendard-variable.woff2", text)
    make(sys.argv[2], "home-gowun-batang-400.woff2", text)
    make(sys.argv[3], "home-gowun-batang-700.woff2", text)


if __name__ == "__main__":
    main()
