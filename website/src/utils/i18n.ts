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
      ctaSteam: 'Steam에서 Playtest 참여',
      ctaDiscord: 'Discord 커뮤니티',
      unreleasedNotice: 'Steam Playtest 참여 가능 · 현재 기본 빌드 0.0.8 · 0.1.0은 Playtest에 올라갈 예정 · 정식 출시 미정 (2026-11-20 확인)',
      heroImageCaption: '온말 공식 앱 화면 (Windows 0.1.0 실기 화면) — 번역할 소리와 언어를 고르고 시작하는 통역 화면',
      inspectFullSize: '원본 비율 크게 보기',
      themeSwitchDark: '다크 테마 화면',
      themeSwitchIvory: '라이트 테마 화면',
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
          title: 'Steam 친구·음성방 (선택)',
          meta: '방 자막 옆 참가자 목록 · 마이크는 직접 켜기',
          desc: 'Steam 친구와 비공개 음성방을 열어 방 자막을 볼 수 있습니다. 0.1.0에서는 방 자막 옆에 참가자 목록이 보입니다. 마이크는 동의한 뒤 직접 켤 때만 송신되며, 두 PC 사이 실제 통화는 아직 검증 중입니다.',
        },
      ],
      localProcessingLabel: '데이터 및 번역 처리 구조',
      localProcessingExact:
        '자막은 내 PC에 설치된 AI 음성 인식·번역 모델이 자동으로 만들며 틀릴 수 있습니다. 음성과 자막은 외부 AI 서비스로 보내지 않습니다.',
      localProcessingSub:
        '기본 한영 모델은 패키지에 포함됩니다. 0.1.0부터 개인 API 번역과 읽어주기(음성 합성)는 검증이 끝날 때까지 제공하지 않습니다. 모델 내려받기와 Steam 통신에는 인터넷이 필요할 수 있습니다.',
      scopeLabel: '지원 범위 안내',
      scopeText:
        '온말은 모든 게임에서의 완벽한 동작, 100% 번역 정확도, 지연 없는 실시간 처리(Zero Latency), 특정 FPS 보장이나 검증 완료된 하드웨어 성능을 약속하지 않습니다. 실제 환경에서 하나씩 검증하며 다듬고 있는 보조 도구입니다.',
    },
    howItWorks: {
      kicker: 'HOW IT WORKS · 작동 흐름',
      title: '듣는 소리 선택 → 언어 선택 → 시작',
      subtitle:
        'Steam Playtest에 참여해 설치한 뒤 사용하는 기본 흐름입니다. 먼저 소리 출력과 언어·모델 준비 상태를 확인하세요.',
      flowSummary: '듣는 소리 선택 → 언어 선택 → 시작',
      steps: [
        {
          num: '01',
          title: '듣는 소리 선택',
          uiLabel: '소리 가져올 곳 · 음성 앱 선택 (예: Discord)',
          desc: '앱별 소리, 컴퓨터 소리 전체 또는 출력 장치 중 목적에 맞는 소스를 고릅니다. 한 프로세스에 섞인 게임 소리와 팀 음성은 자동 분리되지 않습니다.',
          screenshotId: 2,
        },
        {
          num: '02',
          title: '언어 선택',
          uiLabel: '상대가 말하는 언어 → 번역할 언어',
          desc: '상대방이나 게임이 말하는 듣는 언어와 화면에 표시할 자막 언어를 고르고, 팀 음성 채팅 또는 스토리 대사 모드를 선택합니다.',
          screenshotId: 4,
        },
        {
          num: '03',
          title: '시작',
          uiLabel: '시작 버튼 · 자막 표시',
          desc: '시작을 누른 뒤 자막과 소스 상태를 확인합니다. 자막이 없으면 소리 출력·입력 소스·듣는 언어·모델 상태부터 확인하고, 도움말이나 Discord로 알려주세요.',
          screenshotId: 1,
        },
      ],
      viewCapture: '공식 앱 화면 크게 보기',
      staticNotice: '화면은 2026-11-20 실제 Windows PC에서 찍은 0.1.0 화면입니다. 현재 Steam Playtest 기본 빌드(0.0.8)와는 배치·문구가 다를 수 있습니다. 실제 음성·통역 품질 검증은 별도입니다.',
    },
    gallery: {
      kicker: 'SCREENSHOT GALLERY · Windows 0.1.0 실기 화면',
      title: '온말 공식 앱 화면',
      subtitle:
        '2026-11-20 실제 Windows PC에서 찍은 0.1.0 화면을 원본 비율로 보여드립니다. 0.1.0은 아직 Steam에 배포 전이며, 화면이 실제 음성·성능 검증 결과를 뜻하지는 않습니다.',
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
      versionStatus: 'Playtest 0.0.8 공개 중 · 0.1.0 준비 중',
      releaseDateStatus: '정식 출시 미정 · 앞서 해보기 예정',
      playtestStatus: 'Steam Playtest 참여 가능',
      leadParagraph:
        '무료·비수익 운영을 목표로 준비 중입니다. 2026-11-20 확인 기준 Steam 상점 페이지에서 Playtest에 참여할 수 있으며, 기본 빌드는 0.0.8입니다. 다음 판 0.1.0은 실제 Windows PC에서 확인 중이고, 통과하면 테스트 브랜치에 먼저 올린 뒤 기본 빌드로 바꿉니다.',
      specs: [
        {
          label: '공개 대상',
          value: 'Windows 11 64비트 우선',
          detail: 'macOS는 개발 환경입니다. Mac 다운로드는 제공하지 않으며 Windows와 같은 검증 상태로 안내하지 않습니다.',
        },
        {
          label: '현재 Playtest 빌드',
          value: '기본 0.0.8 (Build 26239789)',
          detail: 'Steam Playtest 기본 브랜치의 빌드입니다. 테스트 브랜치(test-0-0-1)는 0.0.7을 유지합니다. 본편은 아직 출시되지 않았습니다.',
        },
        {
          label: '자동 검사 보고 (0.0.8)',
          value: '회귀 검사 2,606개 통과',
          detail: 'Steam 상점에 공개한 0.0.8 자동 검사 결과입니다. 실제 Windows 실행·음성·성능 결과와 구분합니다.',
        },
        {
          label: '남은 검증',
          value: '실제 Windows 음성·통역·게임 성능 미완료',
          detail: '실제 기기와 클린 Steam 설치, 음성 인식·통역 품질, 게임 성능 영향을 확인해야 합니다. 속도·정확도·안티치트 호환을 보장하지 않습니다.',
        },
        {
          label: '다음 판 0.1.0',
          value: 'Playtest에 올라갈 예정 · 아직 받을 수 없음',
          detail: '켜 두기 모드(앱을 열면 방을 만들거나 시작을 누르지 않아도 저장한 게임·Discord 소리를 자동으로 번역, 기본 꺼짐), 10초 넘게 늦은 팀 음성 자막은 건너뛰고 알려주기, 투명한 로고 시작 화면, 왼쪽 메뉴와 넓은 창 배치, AI가 만든 자막이라는 안내, 지금 쓸 수 있는 자막 언어만 보여주기, 선택 기능인 Steam 음성방과 참가자 목록이 들어갑니다. 검증이 덜 된 개인 API 번역과 읽어주기는 뺐습니다. Playtest 테스트 브랜치에 먼저 올린 뒤 기본 빌드로 바꿉니다.',
        },
        {
          label: 'Windows 실기 확인 (2026-11-20)',
          value: '빌드·화면·소리 장치 확인 · 일부 문제 남음',
          detail: '실제 Windows 11 PC에서 앱 빌드, 동의 테스트 56개, 단위 테스트 대부분, 소리 장치 테스트 26개가 통과했습니다. 첫 확인에서 찾은 작은 창의 자막 영역 문제 등은 고친 뒤 두 번째 확인을 했습니다. 실제 음성 인식·번역 품질과 게임 동시 실행 성능은 아직 시험하지 않았습니다.',
        },
        {
          label: '공개 상태',
          value: 'Playtest 공개 · 본편 미출시',
          detail: 'Playtest는 Steam 상점 페이지의 Playtest 참여 버튼으로 받을 수 있습니다. 본편 출시일은 정하지 않았습니다. 이후 변경은 Steam과 공식 안내에서 확인하세요.',
        },
        {
          label: '앞으로 계획',
          value: '실제 음성 품질 확인 · 음성방 다듬기',
          detail: '0.1.0을 Playtest에 올린 뒤 실제 게임에서 인식·번역 품질과 지연을 확인하고, 방·참가자·자막을 한 화면에서 보는 음성방을 다듬을 계획입니다. 일정은 정하지 않았습니다.',
        },
        {
          label: '개발 속도 안내',
          value: '1인 개발 · 여가 시간에 만드는 무료 앱',
          detail: '온말은 개발자 한 명이 여가 시간에 만들고 운영하는 무료 개인 프로젝트입니다. 그래서 개발과 업데이트, 문의 답변에 시간이 오래 걸릴 수 있습니다. 공공기관의 공식 사업은 아닙니다. 너그럽게 기다려 주셔서 감사합니다.',
        },
      ],
      ctaSteamFollow: 'Steam에서 Playtest 참여',
      ctaDiscordJoin: 'Discord 도움말·문의',
    },
    faq: {
      kicker: 'FAQ · 사용 전 확인',
      title: '자주 묻는 질문',
      items: [
        { question: '지금 설치하거나 Playtest에 참여할 수 있나요?', answer: '네. Steam 상점 페이지에서 Playtest 참여를 누르면 Steam 라이브러리에 추가되고 설치할 수 있습니다(Windows 11 64비트, 약 4.4GB). 현재 기본 빌드는 0.0.8이며 0.1.0은 준비 중입니다. 테스트 빌드라 오류가 있을 수 있고, 본편 정식 출시일은 아직 정하지 않았습니다.' },
        { question: '‘온말’은 무슨 뜻인가요?', answer: '‘온’은 온나라처럼 ‘모든, 온전한’을, ‘말’은 사람의 말을 뜻합니다. 온말은 온 나라의 말들이 한데 모인다는 뜻을 담은 이름입니다. 영어 등 다른 언어에서는 로마자로 Onmal이라고 씁니다.' },
        { question: '업데이트가 왜 느린가요?', answer: '온말은 개발자 한 명이 여가 시간에 만드는 무료 개인 프로젝트라 개발과 업데이트에 시간이 오래 걸립니다. 서두르기보다 실제 Windows에서 확인한 뒤 조금씩 내놓겠습니다. 문의 답변도 늦어질 수 있으니 양해 부탁드립니다.' },
        { question: 'Mac에서도 다운로드할 수 있나요?', answer: '현재 공개 검증 대상은 Windows 11 64비트입니다. macOS는 개발 환경이며 Mac 다운로드는 제공하지 않습니다.' },
        { question: '무료인가요? 인터넷이나 개인 API가 꼭 필요한가요?', answer: '온말은 무료·비수익으로 준비 중이며 결제·구독·광고가 없습니다. 기본 한영 모델은 동봉되며 내 PC에서 처리합니다. Steam 설치·업데이트와 선택 모델 다운로드에는 인터넷이 필요할 수 있습니다. 개인 API 번역은 0.1.0부터 제공하지 않습니다(현재 Playtest 0.0.8에는 선택 기능으로 남아 있습니다).' },
        { question: '매번 시작 버튼을 눌러야 하나요?', answer: '0.1.0부터는 설정에서 켜 두기 모드를 켜면, 앱을 열었을 때 저장해 둔 게임이나 Discord의 소리가 나는 즉시 자동으로 번역을 시작합니다. 기본값은 꺼짐이며, 첫 실행 동의를 마친 뒤에만 동작합니다. 0.1.0은 아직 Playtest에 올라가기 전입니다.' },
        { question: '자막은 사람이 만드나요?', answer: '아니요. 자막은 내 PC에 설치된 AI 음성 인식·기계 번역 모델이 자동으로 만들며, 사람이 확인하거나 고친 내용이 아닙니다. 틀릴 수 있으니 중요한 내용은 직접 확인해 주세요. 앱의 첫 실행 안내와 자막 화면에도 이 사실을 표시합니다.' },
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
      statusSummary: 'Windows 11 64비트 · Steam Playtest 0.0.8 공개 · 0.1.0 준비 중 · 무료·비수익',
      description:
        '팀원의 음성과 스토리 대사를 번역 자막으로 읽도록 돕는 Windows 전용 게임 대화 번역 앱 온말(Onmal)의 공식 웹사이트입니다.',
      linksHeading: '공식 링크 및 문의',
      steamLink: 'Steam 상점 페이지',
      discordLink: 'Discord 커뮤니티',
      xLink: '공식 X (@Onmal05)',
      developerProfileLink: '개발자 강동엽 · 네이버 프로필',
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
      ctaSteam: 'Join the Playtest on Steam',
      ctaDiscord: 'Discord Community',
      unreleasedNotice:
        'Steam Playtest open · Current default build 0.0.8 · 0.1.0 coming to Playtest · Full release TBD (checked 2026-11-20)',
      heroImageCaption:
        'Official Onmal app screen (real Windows 0.1.0 capture) — interpret screen for choosing the sound and languages, then starting',
      inspectFullSize: 'View original aspect ratio',
      themeSwitchDark: 'Dark Surface View',
      themeSwitchIvory: 'Light Surface View',
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
          title: 'Steam Friends & Voice Rooms (Optional)',
          meta: 'Participant list beside room captions · Mic only when you turn it on',
          desc: 'Open a private voice room with Steam friends and read the room captions. In 0.1.0 a participant list appears beside them. Your mic transmits only after you consent and turn it on yourself; real calls between two PCs are still being verified.',
        },
      ],
      localProcessingLabel: 'Translation Processing Architecture',
      localProcessingExact:
        'Subtitles are generated automatically by AI speech-recognition and translation models installed on your PC, and they can be wrong. Audio and subtitles are not sent to external AI services.',
      localProcessingSub:
        'The basic Korean↔English models are bundled. From 0.1.0, personal API translation and read-aloud (speech synthesis) are not offered until they are verified. Model downloads and Steam communication may need internet.',
      scopeLabel: 'Honest Scope & Limitations',
      scopeText:
        'Onmal does not promise universal support across all games, 100% translation accuracy, zero latency, guaranteed FPS figures, or verified hardware performance benchmarks. It is an assistive tool currently under active verification.',
    },
    howItWorks: {
      kicker: 'HOW IT WORKS · WORKFLOW',
      title: 'Select Audio Source → Choose Language → Start',
      subtitle:
        'The basic workflow after you join the Steam Playtest and install Onmal. Check audio output, languages, and model readiness first.',
      flowSummary: 'Select Audio Source → Choose Language → Start',
      steps: [
        {
          num: '01',
          title: 'Select Audio Source',
          uiLabel: 'Audio source · Pick a voice app (e.g. Discord)',
          desc: 'Choose an app, all computer sound, or an output device as appropriate. Game audio and team voices mixed in one process are not automatically separated.',
          screenshotId: 2,
        },
        {
          num: '02',
          title: 'Choose Language',
          uiLabel: 'Spoken language → Subtitle language',
          desc: 'Select the spoken language and your target subtitle language, and pick between Team Voice Chat or Story Dialogue mode.',
          screenshotId: 4,
        },
        {
          num: '03',
          title: 'Start',
          uiLabel: 'Start button · Subtitles appear',
          desc: 'Press Start and check the subtitle and source status. If subtitles are missing, check audio output, the source, spoken language, and model status, then consult help or Discord.',
          screenshotId: 1,
        },
      ],
      viewCapture: 'View official app screen',
      staticNotice:
        'These are 0.1.0 screens captured on a real Windows PC on 2026-11-20. Layout and wording may differ from the current Steam Playtest default build (0.0.8). Real audio and translation quality are validated separately.',
    },
    gallery: {
      kicker: 'SCREENSHOT GALLERY · REAL WINDOWS 0.1.0 SCREENS',
      title: 'Official Onmal App Screens',
      subtitle:
        '0.1.0 screens captured on a real Windows PC on 2026-11-20, shown in their original aspect ratio. 0.1.0 is not on Steam yet, and the screens do not establish real audio or performance results.',
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
      versionStatus: 'Playtest 0.0.8 live · 0.1.0 in preparation',
      releaseDateStatus: 'Full release TBD · Early Access planned',
      playtestStatus: 'Steam Playtest open to join',
      leadParagraph:
        'Onmal is being prepared as a free, non-commercial app. As of 2026-11-20 you can join the Playtest from the Steam store page; its default build is 0.0.8. The next version, 0.1.0, is being checked on a real Windows PC. If it passes, it goes to a test branch first and then becomes the default build.',
      specs: [
        {
          label: 'Target platform',
          value: 'Windows 11 64-bit first',
          detail: 'macOS is a development environment. No Mac download is offered, and it does not share the Windows verification status.',
        },
        {
          label: 'Current Playtest build',
          value: 'Default 0.0.8 (Build 26239789)',
          detail: 'The build on the Steam Playtest default branch. The test branch (test-0-0-1) keeps 0.0.7. The main app has not been released.',
        },
        {
          label: 'Automated checks reported (0.0.8)',
          value: '2,606 regression checks passed',
          detail: 'The automated results published on the Steam store for 0.0.8. They are separate from real Windows runtime, audio, and performance results.',
        },
        {
          label: 'Validation still needed',
          value: 'Real Windows audio, translation & gaming performance',
          detail: 'Physical hardware, a clean Steam installation, speech and translation quality, and game performance impact still need validation. Speed, accuracy, and anti-cheat compatibility are not guaranteed.',
        },
        {
          label: 'Next version 0.1.0',
          value: 'Coming to Playtest · Not available yet',
          detail: 'Adds keep-on mode (when the app opens it translates the saved game or Discord sound automatically, with no room or Start press; off by default), skipping team-voice captions that are more than 10 seconds late and saying so, a transparent logo splash, a left menu with a wide-window layout, a notice that captions are AI-generated, only subtitle languages that work right now, and optional Steam voice rooms with a participant list. Personal API translation and read-aloud are removed until verified. It goes to the Playtest test branch first, then becomes the default build.',
        },
        {
          label: 'Real Windows check (2026-11-20)',
          value: 'Build, screens & audio devices checked · Some issues remain',
          detail: 'On a real Windows 11 PC the app built, 56 consent tests, most unit tests and 26 audio-device tests passed. Issues found in the first pass, such as the subtitle area in small windows, were fixed and checked in a second pass. Real speech recognition and translation quality and in-game performance have not been tested yet.',
        },
        {
          label: 'Availability',
          value: 'Playtest open · Main app unreleased',
          detail: 'Get the Playtest with the Join the Playtest button on the Steam store page. No main release date is set. Check Steam and official announcements for later changes.',
        },
        {
          label: 'Plans',
          value: 'Real audio checks · Polishing voice rooms',
          detail: 'After 0.1.0 reaches the Playtest, the plan is to check recognition and translation quality and delay in real games, and to polish voice rooms that show rooms, participants and captions on one screen. No dates are set.',
        },
        {
          label: 'Development pace',
          value: 'Solo developer · A free app made in spare time',
          detail: 'Onmal is a free personal project built and maintained by one developer in their spare time, so development, updates, and replies can take a long time. This is not an official public-sector initiative. Thank you for your patience.',
        },
      ],
      ctaSteamFollow: 'Join the Playtest on Steam',
      ctaDiscordJoin: 'Discord help & questions',
    },
    faq: {
      kicker: 'FAQ · BEFORE YOU START',
      title: 'Frequently Asked Questions',
      items: [
        { question: 'Can I install Onmal or join the Playtest now?', answer: 'Yes. Press Join the Playtest on the Steam store page to add it to your Steam library and install it (Windows 11 64-bit, about 4.4 GB). The current default build is 0.0.8, and 0.1.0 is in preparation. It is a test build, so expect bugs; no full release date is set yet.' },
        { question: 'What does “Onmal” mean?', answer: 'In Korean, 온 (on) means “all” or “whole”, as in 온나라 (“every nation”), and 말 (mal) means “words” or “speech”. Onmal is the words of every nation coming together.' },
        { question: 'Why are updates slow?', answer: 'Onmal is a free personal project made by one developer in their spare time, so development and updates take a long time. Rather than rushing, each version is checked on real Windows PCs before release. Replies may also be slow; thank you for understanding.' },
        { question: 'Is there a Mac download?', answer: 'Windows 11 64-bit is the current target for public validation. macOS is a development environment, and no Mac download is offered.' },
        { question: 'Is it free? Do I need internet or a personal API?', answer: 'Onmal is being prepared as a free, non-commercial app with no payments, subscriptions or ads. The basic Korean-English models are bundled and run on your PC. Steam installation, updates, and optional model downloads may need internet. Personal API translation is not offered from 0.1.0 (it remains an optional feature in the current Playtest 0.0.8).' },
        { question: 'Do I have to press Start every time?', answer: 'From 0.1.0, turn on keep-on mode in Settings and Onmal starts translating as soon as the saved game or Discord makes sound when the app opens. It is off by default and works only after first-run consent. 0.1.0 has not reached the Playtest yet.' },
        { question: 'Are the subtitles made by people?', answer: 'No. Subtitles are generated automatically by AI speech-recognition and machine-translation models installed on your PC, and no person reviews or edits them. They can be wrong, so check anything important yourself. The app’s first-run guide and subtitle screen show this too.' },
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
        'Windows 11 64-bit · Steam Playtest 0.0.8 live · 0.1.0 in preparation · Free and non-commercial',
      description:
        'Official website for Onmal (온말), a Windows-only gaming conversation translation app by Todak (토닥).',
      linksHeading: 'Official Channels & Contact',
      steamLink: 'Steam Store Page',
      discordLink: 'Discord Community',
      xLink: 'Official X (@Onmal05)',
      developerProfileLink: 'Developer 강동엽 · Naver Profile',
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
