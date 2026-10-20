export type SupportedLanguage = 'ko' | 'en';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  keywords: string[];
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    keywords: ['한국어', 'korean', 'ko', '한글', '국어'],
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    keywords: ['english', 'en', '영어', '영문'],
  },
];

export function filterLanguages(
  query: string,
  list: LanguageOption[] = SUPPORTED_LANGUAGES
): LanguageOption[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return list;
  return list.filter((lang) => {
    if (lang.code.toLowerCase().includes(clean)) return true;
    if (lang.name.toLowerCase().includes(clean)) return true;
    if (lang.nativeName.toLowerCase().includes(clean)) return true;
    return lang.keywords.some((kw) => kw.toLowerCase().includes(clean));
  });
}

export const translations = {
  ko: {
    siteTitle: '온말 Onmal — 공식 홈페이지',
    nav: {
      brandHomeAria: '온말 Onmal 홈으로 이동',
      iconAlt: '온말 공식 앱 아이콘',
      features: '제품 소개',
      howItWorks: '작동 방식',
      screenshots: '공식 화면',
      development: '개발 현황',
      faq: '자주 묻는 질문',
      video: '소개 영상',
      steam: 'Steam',
      discord: 'Discord',
      selectLanguage: '사이트 언어 선택',
      openMenu: '메뉴 열기',
      closeMenu: '메뉴 닫기',
    },
    hero: {
      statusBadge: 'Windows 11 64비트 전용 · 개발·테스트 중',
      headline: '게임 대화를,\n내 언어 자막으로.',
      supporting: '팀원의 음성과 스토리 대사를 번역 자막으로 읽도록 돕는 Windows 앱.',
      ctaSteam: 'Steam에서 소식 받기',
      ctaDiscord: 'Discord 커뮤니티',
      unreleasedNotice: 'Windows 0.3.2 검증 후보 · 정식 출시 보류 · Playtest 미활성 (2026-10-20 확인)',
      heroImageCaption: '온말 공식 앱 화면 (Steam 공식 스크린샷) — 소리 가져올 곳과 언어를 고르고 시작하는 기본 인터페이스',
      inspectFullSize: '원본 비율 크게 보기',
      themeSwitchDark: '다크 테마 화면',
      themeSwitchIvory: '아이보리 테마 화면',
    },
    features: {
      kicker: 'PRODUCT OVERVIEW · 핵심 기능',
      title: '게임의 맥락에 맞춘 네 가지 대화 보조 기능',
      subtitle:
        '과장된 연출이나 복잡한 설정 없이, 게임 소리와 대사를 읽을 수 있는 자막으로 차분하게 전달합니다.',
      items: [
        {
          num: '01',
          title: '기본 한국어↔영어 오프라인 번역',
          meta: '내 PC 로컬 처리 · 별도 서버 전송 없음',
          desc: '기본 한영 번역은 외부 클라우드 연결 없이 내 PC 안에서 직접 처리합니다.',
        },
        {
          num: '02',
          title: '팀 음성·스토리 모드',
          meta: '상황별 용어집 전환 · 콜아웃 보존',
          desc: '팀 음성 채팅에서는 게임 용어집이 B 사이트 같은 전술 콜아웃의 보존을 돕고, 스토리 대사에서는 용어집을 기본으로 끕니다. 인식·번역 결과에는 오류가 생길 수 있습니다.',
        },
        {
          num: '03',
          title: '자막 크기·위치·배경 조절',
          meta: '화면 간섭 최소화 · 가독성 맞춤 설정',
          desc: '플레이 중인 게임 UI와 시야를 가리지 않도록 자막 창의 크기, 표시 위치, 배경 스타일을 환경에 맞게 조절할 수 있습니다.',
        },
        {
          num: '04',
          title: '텍스트 번역 (내 말 전하기)',
          meta: '양방향 의사소통 보조 · 텍스트 대조',
          desc: '듣는 음성 자막뿐 아니라 내 말 전하기 메뉴를 통해 팀원에게 전달할 문장이나 텍스트 대사를 번역해 확인할 수 있습니다.',
        },
      ],
      localProcessingLabel: '데이터 및 번역 처리 구조',
      localProcessingExact:
        '기본 한영 번역은 내 PC에서 처리합니다. 개인 API 번역은 선택 사항이며 인터넷과 별도 이용 요금이 필요할 수 있습니다.',
      localProcessingSub:
        '기본 한영 모델은 패키지에 포함됩니다. 개인 API를 연결하면 번역할 텍스트가 선택한 제공사로 전송되므로 대상과 이용 조건을 먼저 확인하세요.',
      scopeLabel: '지원 범위 안내',
      scopeText:
        '온말은 모든 게임에서의 완벽한 동작, 100% 번역 정확도, 지연 없는 실시간 처리(Zero Latency), 특정 FPS 보장이나 검증 완료된 하드웨어 성능을 약속하지 않습니다. 실제 환경에서 하나씩 검증하며 다듬고 있는 보조 도구입니다.',
    },
    howItWorks: {
      kicker: 'HOW IT WORKS · 작동 흐름',
      title: '듣는 소리 선택 → 언어 선택 → 시작',
      subtitle:
        '테스트가 활성화되고 설치가 제공된 뒤 사용할 기본 흐름입니다. 먼저 소리 출력과 언어·모델 준비 상태를 확인하세요.',
      flowSummary: '듣는 소리 선택 → 언어 선택 → 시작',
      steps: [
        {
          num: '01',
          title: '듣는 소리 선택',
          uiLabel: '소리 가져올 곳 · 컴퓨터 소리 전체',
          desc: '앱별 소리, 컴퓨터 소리 전체 또는 출력 장치 중 목적에 맞는 소스를 고릅니다. 한 프로세스에 섞인 게임 소리와 팀 음성은 자동 분리되지 않습니다.',
          screenshotId: 1,
        },
        {
          num: '02',
          title: '언어 선택',
          uiLabel: '듣는 언어 → 자막 언어 (한국어 ↔ 영어)',
          desc: '상대방이나 게임이 말하는 듣는 언어와 화면에 표시할 자막 언어를 고르고, 팀 음성 채팅 또는 스토리 대사 모드를 선택합니다.',
          screenshotId: 5,
        },
        {
          num: '03',
          title: '시작',
          uiLabel: '시작 버튼 클릭 · 자막 오버레이 활성화',
          desc: '시작을 누른 뒤 자막과 소스 상태를 확인합니다. 자막이 없으면 소리 출력·입력 소스·듣는 언어·모델 상태부터 확인하고, 도움말이나 Discord로 알려주세요.',
          screenshotId: 3,
        },
      ],
      viewCapture: '공식 앱 화면 크게 보기',
      staticNotice: '화면은 기존 Steam 등록 스크린샷입니다. 0.3.2에서는 UI와 작은 화면 대응을 정리해 배치·문구가 다를 수 있습니다. 실제 Windows 음성·통역 검증은 미완료입니다.',
    },
    gallery: {
      kicker: 'SCREENSHOT GALLERY · Steam 공식 스크린샷',
      title: '온말 공식 앱 화면',
      subtitle:
        '기존 Steam 등록 스크린샷을 원본 비율로 보존했습니다. 최신 0.3.2 화면이나 실제 음성·성능 검증 결과를 뜻하지 않습니다.',
      openLightbox: '원본 비율로 확대',
      closeLightbox: '닫기 (Esc)',
      prev: '이전 스크린샷',
      next: '다음 스크린샷',
      zoomHint: '키보드 좌우 방향키(←/→)로 이동하거나 Esc 키로 닫을 수 있습니다.',
      counterLabel: '스크린샷',
    },
    development: {
      kicker: 'DEVELOPMENT STATUS · 개발 현황',
      title: '현재 개발 및 검증 상태 안내',
      versionStatus: '온말 0.3.2 Windows 검증 후보',
      releaseDateStatus: '정식 출시 보류 · 일정 미정',
      playtestStatus: 'Playtest 미활성 · 빌드 심사 대기',
      leadParagraph:
        '무료·비수익 운영을 목표로 준비 중입니다. 2026-10-20 17:22 KST 재확인 결과 Playtest 상점 자산은 승인됐지만, 10월 15일 제출한 빌드는 검토 대기열에 있으며 테스트는 아직 활성화되지 않았습니다.',
      specs: [
        {
          label: '공개 대상',
          value: 'Windows 11 64비트 우선',
          detail: 'macOS는 개발 환경입니다. Mac 다운로드는 제공하지 않으며 Windows와 같은 검증 상태로 안내하지 않습니다.',
        },
        {
          label: '0.3.2 업로드 기록',
          value: 'Playtest 26067017 · 본편 26067660',
          detail: '2026-10-20 업로드 완료 기록이 있으며 둘 다 업로드 당시 비활성 보관 상태였습니다. 업로드 완료는 공개나 설치 가능을 뜻하지 않습니다.',
        },
        {
          label: '자동 검사 보고',
          value: '998개 통과 · Windows 교차 빌드 통과',
          detail: '875개 Portable 검사와 123개 Python 검사 합계입니다. 교차 빌드는 경고·오류 0개로 보고됐으며 실제 Windows 실행 결과와 구분합니다.',
        },
        {
          label: '남은 검증',
          value: '실제 Windows 음성·통역·게임 성능 미완료',
          detail: '실제 기기와 클린 Steam 설치, 음성 인식·통역 품질, 게임 성능 영향을 확인해야 합니다. 속도·정확도·안티치트 호환을 보장하지 않습니다.',
        },
        {
          label: '0.3.2 변경 사항',
          value: 'UI·작은 화면·도움말·오디오 오류 정리',
          detail: 'UI와 작은 화면 대응, 홈페이지·Discord 도움말 링크, 음성 형식 변환과 무음 처리 오류 수정을 포함합니다. 실기 품질 검증은 별도입니다.',
        },
        {
          label: '심사와 공개',
          value: '상점 자산 승인 · 빌드 승인 미확인',
          detail: 'Playtest는 2026-10-20 17:22 KST 기준 미활성·빌드 검토 대기입니다. 본편도 정식 출시를 보류하고 있습니다. 이후 변경은 Steam과 공식 안내에서 확인하세요.',
        },
      ],
      ctaSteamFollow: 'Steam에서 소식 확인',
      ctaDiscordJoin: 'Discord 도움말·문의',
    },
    faq: {
      kicker: 'FAQ · 사용 전 확인',
      title: '자주 묻는 질문',
      items: [
        { question: '지금 설치하거나 Playtest에 참여할 수 있나요?', answer: '2026-10-20 17:22 KST 확인 기준 Playtest는 아직 활성화되지 않았고 빌드는 검토 대기열에 있습니다. 본편 정식 출시도 보류 중입니다. 이 홈페이지는 다운로드나 참여 가능을 안내하지 않으며, 추후 상태는 Steam과 공식 공지를 확인해 주세요.' },
        { question: 'Mac에서도 다운로드할 수 있나요?', answer: '현재 공개 검증 대상은 Windows 11 64비트입니다. macOS는 개발 환경이며 Mac 다운로드는 제공하지 않습니다.' },
        { question: '무료인가요? 인터넷이나 개인 API가 꼭 필요한가요?', answer: '온말은 무료·비수익으로 준비 중이며 결제·구독을 제공하지 않습니다. 기본 한영 모델은 동봉되며 로컬에서 처리합니다. Steam 설치·업데이트와 선택 모델 다운로드에는 인터넷이 필요할 수 있습니다. 개인 API는 선택 사항이고 텍스트 전송과 제공사 이용 요금이 발생할 수 있습니다.' },
        { question: '팀원 음성만 골라 번역하나요?', answer: '앱별 캡처와 언어 선택을 사용할 수 있지만 한 프로세스에 섞인 팀원 음성·게임 효과음·배경음을 자동으로 분리하지는 않습니다. 실제 입력 소스와 듣는 언어를 확인해야 합니다.' },
        { question: '자막이 없거나 번역이 이상하면 어떻게 하나요?', answer: '소리가 재생되는 출력 장치, 선택한 캡처 소스, 듣는 언어와 모델 준비 상태를 순서대로 확인하세요. 오류가 이어지면 버전·증상·설정 등 필요한 정보만 Discord나 이메일로 보내주세요. API 키나 개인 음성·대화 내용은 공개하지 마세요.' },
        { question: '게임 성능이나 안티치트 호환은 검증됐나요?', answer: '실제 Windows 게임 환경의 음성·통역과 성능 검증은 미완료입니다. 자동 검사와 교차 빌드 통과가 실기 품질을 보장하지 않습니다. 게임별 정책과 호환성을 확인해야 하며 특정 속도·정확도·FPS·안티치트 안전을 보장하지 않습니다.' },
      ],
    },
    video: {
      kicker: 'PRODUCT VIDEO · 영상 안내',
      title: '홍보 영상 · 10초 콘셉트',
      desc: '가상 UI로 표현한 10초 홍보 콘셉트입니다. 실제 앱 실행이나 게임 플레이를 촬영한 영상이 아닙니다. 온말은 개발·테스트 중이며 실제 Windows 음성·통역·게임 성능 검증은 미완료입니다.',
      playAria: '온말 10초 콘셉트 영상 보기',
      modalTitle: '온말 홍보 영상 · 10초 콘셉트',
      closeModal: '영상 닫기',
      audioNotice: '원본 오디오가 포함돼 있습니다. 플레이어의 재생 버튼을 누르면 시작하며 자동 재생하지 않습니다.',
      directLink: '재생되지 않으면 동영상 직접 열기',
    },
    footer: {
      team: '토닥 Todak',
      statusSummary: 'Windows 11 64비트 · 온말 0.3.2 검증 후보 · 무료·비수익 · 정식 출시 보류',
      description:
        '팀원의 음성과 스토리 대사를 번역 자막으로 읽도록 돕는 Windows 전용 게임 대화 번역 앱 온말(Onmal)의 공식 웹사이트입니다.',
      linksHeading: '공식 링크 및 문의',
      steamLink: 'Steam 상점 페이지',
      discordLink: 'Discord 커뮤니티',
      xLink: '공식 X (@Onmal05)',
      emailLink: '이메일 문의 (todaklife@gmail.com)',
      changeLang: '언어 변경',
      copyright: '© 2026 토닥 Todak. All rights reserved.',
    },
    langModal: {
      title: '사이트 언어 선택',
      searchPlaceholder: '한국어, Korean, English, 영어 검색...',
      searchAria: '지원 언어 검색',
      noResults: '일치하는 언어가 없습니다. (지원 언어: 한국어, English)',
      close: '닫기',
      supportedNote: '현재 웹사이트는 한국어(Korean)와 영어(English)를 지원합니다.',
    },
    common: {
      imageFallback: '이미지를 불러올 수 없습니다.',
      retry: '다시 시도',
    },
  },
  en: {
    siteTitle: '온말 Onmal — Official Website',
    nav: {
      brandHomeAria: 'Go to Onmal home',
      iconAlt: 'Official Onmal app icon',
      features: 'Product',
      howItWorks: 'How It Works',
      screenshots: 'Screenshots',
      development: 'Development',
      faq: 'FAQ',
      video: 'Video',
      steam: 'Steam',
      discord: 'Discord',
      selectLanguage: 'Select site language',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
    },
    hero: {
      statusBadge: 'Windows 11 64-bit Only · In Development & Testing',
      headline: 'Game Conversations,\nin Your Language Subtitles.',
      supporting:
        'A Windows app that helps you read teammates’ voice chat and story dialogue as translated subtitles.',
      ctaSteam: 'Follow on Steam',
      ctaDiscord: 'Discord Community',
      unreleasedNotice:
        'Windows 0.3.2 verification candidate · Release on hold · Playtest inactive (checked 2026-10-20)',
      heroImageCaption:
        'Official Onmal app screen (Official Steam screenshot) — main interface for selecting audio source, languages, and starting subtitles',
      inspectFullSize: 'View original aspect ratio',
      themeSwitchDark: 'Dark Surface View',
      themeSwitchIvory: 'Ivory Surface View',
    },
    features: {
      kicker: 'PRODUCT OVERVIEW · CAPABILITIES',
      title: 'Four Focused Tools for Reading Game Conversations',
      subtitle:
        'Built to turn spoken voice chat and story dialogue into readable subtitles without synthetic clutter or complex audio setups.',
      items: [
        {
          num: '01',
          title: 'Built-in Korean↔English Offline Translation',
          meta: 'Processed on your PC · No external server required',
          desc: 'Default Korean-to-English and English-to-Korean translation is processed directly on your local PC.',
        },
        {
          num: '02',
          title: 'Team Voice & Story Modes',
          meta: 'Context-aware glossary · Preserves tactical callouts',
          desc: 'The game glossary helps preserve tactical callouts such as "B Site" in Team Voice Chat mode. Story Dialogue mode turns it off by default. Recognition and translation can still make mistakes.',
        },
        {
          num: '03',
          title: 'Adjustable Subtitle Size, Position & Background',
          meta: 'Minimal screen intrusion · Custom legibility',
          desc: 'Adjust subtitle size, window placement, and background appearance so essential game HUD elements remain clear.',
        },
        {
          num: '04',
          title: 'Text Translation (Say Something to Your Team)',
          meta: 'Two-way communication aid · Text lookup',
          desc: 'Alongside live audio subtitles, use the built-in text translation panel to translate messages or dialogue lines directly.',
        },
      ],
      localProcessingLabel: 'Translation Processing Architecture',
      localProcessingExact:
        'Default Korean-English translation is processed on your PC. Personal API translation is optional and may require an internet connection and separate usage fees.',
      localProcessingSub:
        'The basic Korean↔English models are bundled. If you connect a personal API, translation text is sent to your chosen provider; review the destination and its terms first.',
      scopeLabel: 'Honest Scope & Limitations',
      scopeText:
        'Onmal does not promise universal support across all games, 100% translation accuracy, zero latency, guaranteed FPS figures, or verified hardware performance benchmarks. It is an assistive tool currently under active verification.',
    },
    howItWorks: {
      kicker: 'HOW IT WORKS · WORKFLOW',
      title: 'Select Audio Source → Choose Language → Start',
      subtitle:
        'This is the intended workflow once testing is activated and installation is available. Check audio output, languages, and model readiness first.',
      flowSummary: 'Select Audio Source → Choose Language → Start',
      steps: [
        {
          num: '01',
          title: 'Select Audio Source',
          uiLabel: 'Where to listen · All computer sound',
          desc: 'Choose an app, all computer sound, or an output device as appropriate. Game audio and team voices mixed in one process are not automatically separated.',
          screenshotId: 2,
        },
        {
          num: '02',
          title: 'Choose Language',
          uiLabel: 'Spoken language → Subtitle language (Korean ↔ English)',
          desc: 'Select the spoken language and your target subtitle language, and pick between Team Voice Chat or Story Dialogue mode.',
          screenshotId: 5,
        },
        {
          num: '03',
          title: 'Start',
          uiLabel: 'Click Start · Subtitle window activates',
          desc: 'Press Start and check the subtitle and source status. If subtitles are missing, check audio output, the source, spoken language, and model status, then consult help or Discord.',
          screenshotId: 3,
        },
      ],
      viewCapture: 'View official app screen',
      staticNotice:
        'These are existing Steam screenshots. Layout and wording may differ in 0.3.2 after UI and small-screen changes. Real Windows audio and translation validation remains incomplete.',
    },
    gallery: {
      kicker: 'SCREENSHOT GALLERY · OFFICIAL STEAM SCREENSHOTS',
      title: 'Official Onmal App Screens',
      subtitle:
        'Existing official Steam screenshots preserved in their original aspect ratio. They do not establish the latest 0.3.2 layout or real audio and performance results.',
      openLightbox: 'Inspect full size',
      closeLightbox: 'Close (Esc)',
      prev: 'Previous screenshot',
      next: 'Next screenshot',
      zoomHint: 'Use Left/Right arrow keys (←/→) to navigate or press Esc to close.',
      counterLabel: 'Screenshot',
    },
    development: {
      kicker: 'DEVELOPMENT STATUS · CURRENT PROGRESS',
      title: 'Transparent Development & Verification Status',
      versionStatus: 'Onmal 0.3.2 Windows verification candidate',
      releaseDateStatus: 'Release on hold · Date TBD',
      playtestStatus: 'Playtest inactive · Build review pending',
      leadParagraph:
        'Onmal is being prepared as a free, non-commercial app. A check on 2026-10-20 at 17:22 KST confirmed approved Playtest store assets, but the build submitted on October 15 remains in the review queue and testing is still inactive.',
      specs: [
        {
          label: 'Target platform',
          value: 'Windows 11 64-bit first',
          detail: 'macOS is a development environment. No Mac download is offered, and it does not share the Windows verification status.',
        },
        {
          label: '0.3.2 upload record',
          value: 'Playtest 26067017 · Main app 26067660',
          detail: 'Upload records dated 2026-10-20 confirm both builds were stored inactive at upload. Upload completion does not establish public or installable availability.',
        },
        {
          label: 'Automated checks reported',
          value: '998 passed · Windows cross-build passed',
          detail: 'The total is 875 Portable checks plus 123 Python checks. The cross-build reported zero warnings and errors; this is separate from running on Windows hardware.',
        },
        {
          label: 'Validation still needed',
          value: 'Real Windows audio, translation & gaming performance',
          detail: 'Physical hardware, a clean Steam installation, speech and translation quality, and game performance impact still need validation. Speed, accuracy, and anti-cheat compatibility are not guaranteed.',
        },
        {
          label: 'Changes in 0.3.2',
          value: 'UI, smaller screens, help & audio fixes',
          detail: 'Includes UI cleanup, small-screen adjustments, website and Discord help links, audio format conversion fixes, and silence handling fixes. Real-device quality testing remains separate.',
        },
        {
          label: 'Review & availability',
          value: 'Store assets approved · Build approval unconfirmed',
          detail: 'As of 2026-10-20 17:22 KST, Playtest is inactive and its build remains queued for review. The main release is also on hold. Check Steam and official announcements for later changes.',
        },
      ],
      ctaSteamFollow: 'Check Steam updates',
      ctaDiscordJoin: 'Discord help & questions',
    },
    faq: {
      kicker: 'FAQ · BEFORE YOU START',
      title: 'Frequently Asked Questions',
      items: [
        { question: 'Can I install Onmal or join the Playtest now?', answer: 'The check at 2026-10-20 17:22 KST found Playtest still inactive with its build in the review queue. The main release is also on hold. This website does not announce download or participation availability. Check Steam and official announcements for later changes.' },
        { question: 'Is there a Mac download?', answer: 'Windows 11 64-bit is the current target for public validation. macOS is a development environment, and no Mac download is offered.' },
        { question: 'Is it free? Do I need internet or a personal API?', answer: 'Onmal is being prepared as a free, non-commercial app with no payments or subscriptions. The basic Korean-English models are bundled and run locally. Steam installation, updates, and optional model downloads may need internet. A personal API is optional and may send text to a provider and incur provider usage fees.' },
        { question: 'Does it isolate only my teammates’ voices?', answer: 'App capture and language selection are available, but voices, effects, and background audio mixed within one process are not automatically separated. Check the actual input source and spoken language.' },
        { question: 'What if subtitles are missing or translation looks wrong?', answer: 'Check the playback device, selected capture source, spoken language, and model readiness in that order. If the issue continues, share only necessary details such as version, symptoms, and settings via Discord or email. Do not post API keys, private audio, or conversation content.' },
        { question: 'Are gaming performance and anti-cheat compatibility verified?', answer: 'Real Windows gaming tests for audio, translation, and performance are incomplete. Automated checks and cross-build success do not establish real-device quality. Game policies and compatibility need checking; no speed, accuracy, FPS, or anti-cheat safety guarantee is offered.' },
      ],
    },
    video: {
      kicker: 'PRODUCT VIDEO · INTRODUCTION',
      title: 'Promotional Video · 10-second Concept',
      desc: 'A 10-second promotional concept using simulated UI. This is not footage of the running app or actual gameplay. Onmal is in development and testing; real Windows audio, translation, and gaming performance validation remains incomplete.',
      playAria: 'View the Onmal 10-second concept video',
      modalTitle: 'Onmal Promotional Video · 10-second Concept',
      closeModal: 'Close video',
      audioNotice: 'Includes the original audio. Use the player’s Play button to start; playback does not begin automatically.',
      directLink: 'Open the video directly if playback fails',
    },
    footer: {
      team: '토닥 Todak',
      statusSummary:
        'Windows 11 64-bit · Onmal 0.3.2 verification candidate · Free and non-commercial · Release on hold',
      description:
        'Official website for Onmal (온말), a Windows-only gaming conversation translation app by Todak (토닥).',
      linksHeading: 'Official Channels & Contact',
      steamLink: 'Steam Store Page',
      discordLink: 'Discord Community',
      xLink: 'Official X (@Onmal05)',
      emailLink: 'Email Contact (todaklife@gmail.com)',
      changeLang: 'Language',
      copyright: '© 2026 토닥 Todak. All rights reserved.',
    },
    langModal: {
      title: 'Select Site Language',
      searchPlaceholder: 'Search 한국어, Korean, English, 영어...',
      searchAria: 'Search supported site languages',
      noResults: 'No matching site language found. (Supported: 한국어, English)',
      close: 'Close',
      supportedNote: 'This website is fully available in Korean (한국어) and English.',
    },
    common: {
      imageFallback: 'Unable to load image.',
      retry: 'Retry',
    },
  },
};
