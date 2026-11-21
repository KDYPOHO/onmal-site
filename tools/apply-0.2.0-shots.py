# 0.2.0 실제 화면 6장을 홈페이지 갤러리에 넣는다.
# 사용: python tools/apply-0.2.0-shots.py <사진 폴더> <찍은 날짜 YYYY-MM-DD>
# 사진 폴더에는 아래 SHOTS 의 파일 이름 그대로 PNG 6장이 있어야 한다(없는 장은 건너뛴다).
# 하는 일: website/public/shots/0.2.0/ 에 복사(가로 1400px 넘으면 줄임), assets.ts 의 SCREENSHOTS·SHOT_SIZES 교체,
# 캡션의 "0.1.0 화면, 곧 교체" 문구를 0.2.0 화면 문구로 바꾸고 테스트 기대값을 0.2.0 으로 바꾼다.
# 그 뒤 직접: tools/make-home-fonts.py, npm test/lint/build, dist 를 루트로 복사.
import re
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "website"

SHOTS = [
    ("01-main.png", "자막이 나오는 통역 화면", "Interpret screen with live captions",
     "유리 느낌의 기본 화면입니다. 번역할 소리와 언어, 품질을 고르고 시작하면 자막이 바로 나옵니다.",
     "The glass main screen. Pick the sound, languages and quality, start, and captions appear right away."),
    ("02-overlay.png", "게임 위 자막 · 목소리 색과 이름", "In-game captions · voice colours and names",
     "게임 위에 뜨는 유리 자막 띠입니다. 목소리마다 색 띠와 기호, 직접 붙인 이름표가 붙습니다(이름은 시험용).",
     "The glass caption strip over a game. Each voice gets a colour bar, a symbol and the name you gave it (test names)."),
    ("03-voice-names.png", "목소리 이름 붙이기", "Name the voices",
     "홈 화면에서 팀원 이름을 적어 두면 같은 목소리의 자막에 이름이 붙고, 음성 인식도 그 이름을 더 잘 알아듣습니다. 온말을 끄면 지워집니다.",
     "Type teammate names on the home screen: that voice's captions show the name and recognition hears it better. Erased when Onmal closes."),
    ("04-settings.png", "설정 · 품질과 게임 중 가벼운 모드", "Settings · quality and light mode while gaming",
     "품질 3단계(최소·권장·최고), 게임 중 자동 가벼운 모드, 욕설 가리기를 한 화면에서 고릅니다.",
     "Choose the three quality tiers, automatic light mode while gaming and the swear filter in one place."),
    ("05-voice-room.png", "Steam 친구 음성방", "Steam friends voice room",
     "선택 기능인 비공개 음성방입니다. 방 자막과 참가자 목록, 말하는 사람 표시가 나옵니다.",
     "The optional private voice room with room captions, a participant list and a speaking indicator."),
    ("06-start.png", "시작 화면", "Start screen",
     "앱을 켤 때 보이는 유리 느낌의 시작 화면입니다.",
     "The glass start screen shown when the app opens."),
]


def main() -> None:
    src = Path(sys.argv[1])
    date = sys.argv[2]
    out = WEB / "public" / "shots" / "0.2.0"
    out.mkdir(parents=True, exist_ok=True)
    items, sizes = [], []
    for i, (name, tko, ten, dko, den) in enumerate([s for s in SHOTS if (src / s[0]).exists()], start=1):
        im = Image.open(src / name).convert("RGB")
        if im.width > 1400:
            im = im.resize((1400, round(im.height * 1400 / im.width)), Image.LANCZOS)
        im.save(out / name, optimize=True)
        sizes.append(f"  {i}: {{ width: {im.width}, height: {im.height} }},")
        q = lambda s: s.replace("'", "’")
        items.append(
            "  {\n"
            f"    id: {i},\n    url: `${{SHOT_BASE}}{name}`,\n"
            f"    titleKo: '{q(tko)} (Windows 0.2.0)',\n    titleEn: '{q(ten)} (Windows 0.2.0)',\n"
            f"    descKo: '{q(dko)}',\n    descEn: '{q(den)}',\n"
            f"    altKo: '온말 Windows 0.2.0 — {q(tko)}',\n    altEn: 'Onmal Windows 0.2.0 — {q(ten)}',\n  }},"
        )
    if not items:
        sys.exit("사진이 없습니다")
    p = WEB / "src" / "constants" / "assets.ts"
    s = p.read_text(encoding="utf-8")
    s = s.replace("shots/0.1.0/", "shots/0.2.0/")
    s = re.sub(r"export const SHOT_SIZES[^=]*= \{.*?\n\};", "export const SHOT_SIZES: Record<number, { width: number; height: number }> = {\n" + "\n".join(sizes) + "\n};", s, flags=re.S)
    s = re.sub(r"export const SCREENSHOTS: ScreenshotItem\[\] = \[.*?\n\];", "export const SCREENSHOTS: ScreenshotItem[] = [\n" + "\n".join(items) + "\n];", s, flags=re.S)
    p.write_text(s, encoding="utf-8")

    p = WEB / "src" / "utils" / "i18n.ts"
    s = p.read_text(encoding="utf-8")
    rep = {
        "화면은 2026-11-20 실제 Windows PC에서 찍은 0.1.0 화면입니다. 현재 Steam Playtest 기본 빌드는 0.2.0이며, 0.2.0 화면으로 곧 바꿉니다.": f"화면은 {date} 실제 Windows PC에서 찍은 0.2.0 화면입니다.",
        "2026-11-20 실제 Windows PC에서 찍은 0.1.0 화면을 원본 비율로 보여드립니다. 지금 Steam Playtest 판은 0.2.0이라 화면 디자인이 조금 다르며, 0.2.0 화면으로 곧 바꿉니다.": f"{date} 실제 Windows PC에서 찍은 0.2.0 화면을 원본 비율로 보여드립니다.",
        "These are 0.1.0 screens captured on a real Windows PC on 2026-11-20. The current Steam Playtest default build is 0.2.0, and these will soon be replaced with 0.2.0 screens.": f"These are 0.2.0 screens captured on a real Windows PC on {date}.",
        "0.1.0 screens captured on a real Windows PC on 2026-11-20, shown in their original aspect ratio. The Steam Playtest now has 0.2.0, which looks a little different; these will be replaced with 0.2.0 screens soon.": f"0.2.0 screens captured on a real Windows PC on {date}, shown in their original aspect ratio.",
    }
    for a, b in rep.items():
        if a not in s:
            sys.exit("i18n 문구를 못 찾음: " + a[:30])
        s = s.replace(a, b)
    p.write_text(s, encoding="utf-8")

    p = WEB / "src" / "utils" / "i18n.test.ts"
    s = p.read_text(encoding="utf-8")
    s = s.replace("shot.url.includes('shots/0.1.0/')", "shot.url.includes('shots/0.2.0/')")
    s = s.replace("shot.titleKo.includes('0.1.0') && shot.titleEn.includes('0.1.0')", "shot.titleKo.includes('0.2.0') && shot.titleEn.includes('0.2.0')")
    p.write_text(s, encoding="utf-8")
    print(f"{len(items)}장 반영: {out}")


if __name__ == "__main__":
    main()
