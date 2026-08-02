# 온말(Onmal) 홈페이지

게임 중 팀보이스를 실시간 번역 자막으로 보여주는 Windows 앱 **온말**의 공식 홈페이지입니다.

- 홈페이지: https://kdypoho.github.io/onmal-site/
- 개인정보처리방침: https://kdypoho.github.io/onmal-site/privacy.html
- 이용약관: https://kdypoho.github.io/onmal-site/terms.html
- 저작권 및 라이선스: https://kdypoho.github.io/onmal-site/licenses.html

정적 HTML만 있습니다. GitHub Pages 가 `main` 브랜치 루트에서 그대로 배포합니다
(`.nojekyll` 로 Jekyll 처리를 끕니다).

앱 소스 코드는 별도의 비공개 저장소에서 관리합니다.
문의와 버그 신고는 이메일(todaklife@gmail.com) 또는 이 저장소의
[Issues](https://github.com/KDYPOHO/onmal-site/issues)로 받습니다.

## 고칠 때 돌려 볼 것

`tools/` 의 스크립트는 **배포되지 않습니다** — 손으로 돌리는 검사기입니다.
빌드 단계가 없는 사이트라, 실수를 잡아 주는 것이 이것뿐입니다.

```powershell
.\tools\check-site.ps1     # 링크·섹션 id·외부 origin·테마·접근성
.\tools\check-i18n.ps1     # 30개 언어 파일의 키 집합·양방향 사용·라이선스 문구
.\tools\check-motion.ps1   # @supports 울타리·레이아웃 속성 애니메이션
```

세 검사기는 `-DoneThrough <조각>` 을 받습니다. 아직 안 한 조각의 지적은 **할 일**로만
보이고, 끝낸 조각은 **실패**가 됩니다 — 되돌아가지 않기 위한 톱니바퀴입니다.

화면 비교는 `tools/shoot.ps1` 입니다. 정적 서버를 띄운 뒤:

```powershell
.\tools\shoot.ps1 -Label 무엇을하기전 -CompareWith 지난촬영
```

전체 페이지를 라이트·다크로 찍고 지난 촬영과 **픽셀 단위로** 비교합니다.
결과는 `tools/shots/` 에 쌓이고 커밋하지 않습니다.

> 🔴 **`licenses.html` 을 고쳤다면 앱 저장소의 `tools/build/verify.ps1` 을 함께 돌리십시오.**
> 앱의 `THIRD_PARTY_NOTICES.md` 와 이 파일이 어긋나면 라이선스 위반이고,
> 그 검사는 앱 쪽에만 있습니다.
