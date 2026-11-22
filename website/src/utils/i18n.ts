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
      skip: '본문으로 건너뛰기',
      langGroup: '사이트 언어',
      primary: '주요 메뉴',
    },
    hero: {
      statusBadge: 'Windows 11 64비트 전용 · 개발·테스트 중',
      headline: '게임 대화를,\n내 언어 자막으로.',
      supporting: '팀원의 음성과 스토리 대사를 내 PC의 AI가 번역 자막으로 만들어, 읽을 수 있게 돕는 Windows 앱.',
      ctaSteam: 'Steam에서 Playtest 참여',
      ctaDiscord: 'Discord 커뮤니티',
      unreleasedNotice: 'Steam Playtest 참여 가능 · 현재 기본 빌드 0.2.3 · 정식 출시 미정 (2026-11-22 확인)',
      heroImageCaption: '온말 공식 앱 화면 (Windows 0.2.0 실기 화면) — 번역할 소리와 언어를 고르고 시작하는 통역 화면',
      inspectFullSize: '원본 비율 크게 보기',
      themeSwitchDark: '통역 화면',
      themeSwitchIvory: '설정 화면',
      heardLabel: '들린 말',
      captionLabel: '내 자막',
      statusListLabel: '현재 상태',
    },
    features: {
      kicker: 'PRODUCT OVERVIEW · 핵심 기능',
      title: '게임의 맥락에 맞춘 네 가지 대화 보조 기능',
      subtitle:
        '과장된 연출이나 복잡한 설정 없이, 게임 소리와 대사를 읽을 수 있는 자막으로 차분하게 전달합니다.',
      items: [
        {
          num: '01',
          title: '한국어↔영어와 여러 언어 오프라인 번역',
          meta: '내 PC 로컬 처리 · 별도 서버 전송 없음',
          desc: '번역은 외부 클라우드 연결 없이 내 PC 안에서 직접 처리합니다. 0.1.1부터 영어→한국어는 Marian, 한국어→영어와 다른 언어는 새 번역 모델 Hy-MT2가 맡습니다.',
        },
        {
          num: '02',
          title: '팀 음성·스토리 모드',
          meta: '상황별 용어집 전환 · 콜아웃 보존을 도움',
          desc: '팀 음성 채팅에서는 게임 용어집이 B 사이트 같은 전술 콜아웃의 보존을 돕고, 스토리 대사에서는 용어집을 기본으로 끕니다. 실제 게임에서 얼마나 잘 지켜지는지는 아직 확인 중이며, 인식·번역 결과에는 오류가 생길 수 있습니다.',
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
          meta: '방 자막 옆 참가자 목록 · 말하는 사람 표시 · 마이크는 직접 켜기',
          desc: 'Steam 친구와 비공개 음성방을 열어 방 자막을 볼 수 있습니다. 방 자막 옆에 참가자 목록이 보이고, 말하는 사람은 고리로 표시됩니다. 좁은 창에서도 깨지지 않습니다. 마이크는 동의한 뒤 직접 켤 때만 송신되며, 두 PC 사이 실제 통화는 아직 검증 중입니다.',
        },
      ],
      localProcessingLabel: '데이터 및 번역 처리 구조',
      localProcessingExact:
        '자막은 내 PC에 설치된 AI 음성 인식·번역 모델이 자동으로 만들며 틀릴 수 있습니다. 음성과 자막은 외부 AI 서비스로 보내지 않습니다.',
      localProcessingSub:
        '음성 인식과 번역 모델은 패키지에 포함됩니다. 0.1.1에서 개인 API 번역, 읽어주기(음성 합성), 마이크로 번역 보내기는 앱에서 완전히 뺐습니다. Steam 설치·업데이트와 Steam 음성방에는 인터넷이 필요합니다.',
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
          screenshotId: 3,
        },
        {
          num: '02',
          title: '언어 선택',
          uiLabel: '상대가 말하는 언어 → 번역할 언어',
          desc: '상대방이나 게임이 말하는 듣는 언어와 화면에 표시할 자막 언어를 고르고, 팀 음성 채팅 또는 스토리 대사 모드를 선택합니다.',
          screenshotId: 1,
        },
        {
          num: '03',
          title: '시작',
          uiLabel: '시작 버튼 · 자막 표시',
          desc: '시작을 누른 뒤 자막과 소스 상태를 확인합니다. 자막이 없으면 소리 출력·입력 소스·듣는 언어·모델 상태부터 확인하고, 도움말이나 Discord로 알려주세요.',
          screenshotId: 2,
        },
      ],
      viewCapture: '공식 앱 화면 크게 보기',
      staticNotice: '화면은 2026-11-21 실제 Windows PC에서 찍은 0.2.0 화면입니다. 실제 음성·통역 품질 검증은 별도입니다.',
    },
    gallery: {
      kicker: 'SCREENSHOT GALLERY · Windows 0.2.0 실기 화면',
      title: '온말 공식 앱 화면',
      subtitle:
        '2026-11-21 실제 Windows PC에서 찍은 0.2.0 화면을 원본 비율로 보여드립니다. 화면이 실제 음성·성능 검증 결과를 뜻하지는 않습니다.',
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
      versionStatus: 'Playtest 0.2.3 공개 중',
      releaseDateStatus: '정식 출시 미정 · 앞서 해보기 예정',
      playtestStatus: 'Steam Playtest 참여 가능',
      leadParagraph:
        '무료·비수익 운영을 목표로 준비 중입니다. 2026-11-20 확인 기준 Steam 상점 페이지에서 Playtest에 참여할 수 있으며, 2026-11-22부터 기본 빌드는 0.2.3입니다. 실제 게임에서의 음성·통역 품질은 아직 확인 중입니다.',
      specs: [
        {
          label: '공개 대상',
          value: 'Windows 11 64비트 우선',
          detail: '온말은 Windows 전용입니다. 0.1.1에서 Mac 앱 코드를 정리했고 Mac 판은 제공하지 않습니다.',
        },
        {
          label: 'PC 사양 (0.1.1 실측 기준)',
          value: '최소: 4코어 CPU(AVX2), RAM 8GB · 권장: 6코어, RAM 16GB, VRAM 8GB GPU',
          detail: '앱의 품질 단계 기준입니다. 최소는 GPU 없이 CPU로 돌아가고 번역이 문장당 약 2초 걸릴 수 있습니다. 권장·최고는 Vulkan GPU를 쓰며, 2026-11-21 한 대의 PC(RTX 4060 8GB)에서 그래픽 메모리 약 2.2~2.5GB, 시스템 메모리 약 2.8~3.6GB를 썼습니다. 게임과 함께 쓰면 게임 요구량에 VRAM 약 2.5GB, RAM 약 4GB를 더해 주세요. 설치 크기는 약 3.0GB입니다.',
        },
        {
          label: '현재 Playtest 빌드',
          value: '기본 0.2.3 (Build 26845947)',
          detail: '2026-11-22부터 Steam Playtest 기본 브랜치의 빌드입니다. 그전 기본 빌드는 0.2.0 업데이트(Build 26841016), 0.2.0(Build 26832610), 0.1.1(Build 26830031), 0.1.0(Build 26823802)이었습니다. 본편은 아직 출시되지 않았습니다.',
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
          label: '0.2.3·0.2.1에서 달라진 점',
          value: 'Playtest에서 받을 수 있음',
          detail: '2026-11-22 0.2.3: 그래픽카드 메모리가 8GB 이상이면 권장에서도 가장 정확한 인식 모델(large-v3-turbo)을 써서, 목소리와 마이크가 제각각인 시험 음성 516개의 오류율이 70.8%에서 47.5%로 줄었습니다. 권장·최고에서는 영어→한국어도 Hy-MT2로 옮기고, 게임 중 음성 채팅은 팀원끼리 쓰는 반말로, 게임이 아닐 때는 기본 번역으로 옮깁니다(설정 → 번역 → 한국어 자막 말투에서 고정 가능). 최고에서는 게임 화면이 앞에 있으면 중간 자막을 꺼 렉을 줄입니다. 기본 모양이 한국 전통(한지 낮, 먹 밤)으로 바뀌었고 설정 → 창 색에서 언제든 유리 모양으로 바꿀 수 있습니다(직접 밝게/어둡게를 고른 분은 그대로). 설정과 용어집은 Ctrl+F와 한글 초성으로 찾을 수 있고, 게임 용어집이 8개가 됐고, 말하는 사람 수를 자동 또는 1~6명으로 정할 수 있습니다. 스크롤 막대와 메뉴 표시도 깔끔하게 다듬었습니다. 이전 0.2.1: 마이크가 멀거나 소리가 작은 사람의 말을 "너무 조용하다"며 버리던 문제를 고쳐 작은 목소리도 자막으로 나오고(시험에서 빈 자막 43줄 중 34줄 → 2줄), 게임 화면이 앞에 있으면 미리보기 자막을 1.4초에 한 번만 만들어 그래픽카드를 덜 씁니다(최종 자막은 그대로). 같은 날 0.2.0 업데이트: 한지 낮·먹 밤의 한국 전통 테마(설정 → 테마), 전체 화면으로 배그·발로란트·CS2를 하면 그 게임 용어집과 게임 말투 번역을 자동으로 쓰고 자막이 게임이 있는 모니터로 따라가는 기능(창 제목과 위치만 확인), 음성방 Steam 초대 버튼, 진단 정보 복사 버튼이 들어갔습니다. 처음 0.2.0에서는 게임 중 그래픽카드 메모리가 모자라면 자동으로 가벼운 모드로 바뀌어 미리보기 자막을 끄고 번역 모델 메모리를 비웁니다(설정에서 끌 수 있음). 게임 소리 속 목소리마다 색과 기호, 직접 붙인 이름이 붙고(온말을 끄면 지워짐), 팀원 이름을 더 잘 알아듣고 번역할 때 이름을 그대로 둡니다. 번역은 직역 대신 그 나라 게이머가 실제로 쓰는 말투에 가깝게 나옵니다. 욕설 가리기(기본 켬)와 유리 느낌의 새 자막 디자인도 들어갔습니다. 0.1.1에서는 유리처럼 맑은 새 화면, 새 번역 모델 Hy-MT2(한국어→영어와 여러 언어), 자주 쓰는 순서로 정리한 설정, 좁은 창에서도 깨지지 않는 음성방과 말하는 사람 표시가 들어갔습니다. 읽어주기, 마이크로 번역 보내기, 개인 클라우드 번역 키, 옛 시작 영상, 단축키 4개는 뺐습니다(남은 단축키: 시작/정지 Alt+Shift+P, 자막 켜기/끄기 Alt+O, 자막 고정 Alt+L). 쓰지 않는 큰 모델을 정리했고, 개인정보 처리방침에 법이 정한 항목을 더했습니다. Steam이 자동으로 업데이트합니다.',
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
          detail: '0.2.3으로 실제 게임에서 인식·번역 품질과 지연을 확인하고, Steam 친구를 음성방에 더 쉽게 초대하도록 다듬을 계획입니다. 일정은 정하지 않았습니다.',
        },
        {
          label: '개발 속도 안내',
          value: '1인 개발 · 여가 시간에 만드는 무료 앱',
          detail: '온말은 개발자 한 명이 여가 시간에 만들고 운영하는 무료 개인 프로젝트입니다. 그래서 개발과 업데이트, 문의 답변에 시간이 오래 걸릴 수 있습니다. 어떤 회사나 기관과도 관계없습니다. 너그럽게 기다려 주셔서 감사합니다.',
        },
      ],
      ctaSteamFollow: 'Steam에서 Playtest 참여',
      ctaDiscordJoin: 'Discord 도움말·문의',
      statusLabel: '지금 상태',
      specsLabel: '세부 현황',
    },
    nameBand: {
      title: '이름의 뜻',
      onGloss: '모든, 온전한. 온나라의 ‘온’',
      malGloss: '사람이 하는 말',
      sentence: '온 나라의 말이\n한데 모인다.',
      romanNote: '영어 등 다른 언어에서는 로마자로 Onmal이라고 씁니다.',
    },
    faq: {
      kicker: 'FAQ · 사용 전 확인',
      title: '자주 묻는 질문',
      items: [
        { question: '지금 설치하거나 Playtest에 참여할 수 있나요?', answer: '네. Steam 상점 페이지에서 Playtest 참여를 누르면 Steam 라이브러리에 추가되고 설치할 수 있습니다(Windows 11 64비트, 약 3.0GB). 현재 기본 빌드는 0.2.3입니다. 테스트 빌드라 오류가 있을 수 있고, 본편 정식 출시일은 아직 정하지 않았습니다.' },
        { question: '‘온말’은 무슨 뜻인가요?', answer: '‘온’은 온나라처럼 ‘모든, 온전한’을, ‘말’은 사람의 말을 뜻합니다. 온말은 온 나라의 말들이 한데 모인다는 뜻을 담은 이름입니다. 영어 등 다른 언어에서는 로마자로 Onmal이라고 씁니다.' },
        { question: '업데이트가 왜 느린가요?', answer: '온말은 개발자 한 명이 여가 시간에 만드는 무료 개인 프로젝트라 개발과 업데이트에 시간이 오래 걸립니다. 서두르기보다 실제 Windows에서 확인한 뒤 조금씩 내놓겠습니다. 문의 답변도 늦어질 수 있으니 양해 부탁드립니다.' },
        { question: 'Mac에서도 다운로드할 수 있나요?', answer: '아니요. 온말은 Windows 11 64비트 전용이며 Mac 판은 제공하지 않습니다.' },
        { question: '무료인가요? 인터넷이나 개인 API가 꼭 필요한가요?', answer: '온말은 무료·비수익으로 준비 중이며 결제·구독·광고가 없습니다. 음성 인식과 번역 모델은 동봉되며 내 PC에서 처리합니다. Steam 설치·업데이트에는 인터넷이 필요합니다. 개인 API 번역 기능은 없습니다.' },
        { question: '매번 시작 버튼을 눌러야 하나요?', answer: '0.1.0부터는 설정에서 켜 두기 모드를 켜면, 앱을 열었을 때 저장해 둔 게임이나 Discord에서 소리가 나면 자동으로 번역을 시작합니다. 기본값은 꺼짐이며, 첫 실행 동의를 마친 뒤에만 동작합니다.' },
        { question: '자막은 사람이 만드나요?', answer: '아니요. 자막은 내 PC에 설치된 AI 음성 인식·기계 번역 모델이 자동으로 만들며, 사람이 확인하거나 고친 내용이 아닙니다. 틀릴 수 있으니 중요한 내용은 직접 확인해 주세요. 앱의 첫 실행 안내와 자막 화면에도 이 사실을 표시합니다.' },
        { question: '팀원 음성만 골라 번역하나요?', answer: '앱별 캡처와 언어 선택을 사용할 수 있지만 한 프로세스에 섞인 팀원 음성·게임 효과음·배경음을 자동으로 분리하지는 않습니다. 실제 입력 소스와 듣는 언어를 확인해야 합니다.' },
        { question: '자막이 없거나 번역이 이상하면 어떻게 하나요?', answer: '소리가 재생되는 출력 장치, 선택한 캡처 소스, 듣는 언어와 모델 준비 상태를 순서대로 확인하세요. 오류가 이어지면 버전·증상·설정 등 필요한 정보만 Discord나 이메일로 보내주세요. 개인 음성·대화 내용은 공개하지 마세요.' },
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
      transcriptLabel: '영상 내용 설명(대본)',
      transcript:
        '말소리 없이 배경 음악만 나옵니다. 하늘색과 산호색 리본이 어두운 남색 배경에서 엇갈리며 말풍선 모양 고리가 됩니다. 고리 안으로 영어와 스페인어를 고른 가상의 번역 창이 떠오르고, 점과 선이 이어진 그물 위에 "사용 예시 · 실제 실행 화면 아님 (Concept demonstration)"이라는 글자가 나옵니다. 마지막에 Onmal 로고와 "개발·테스트 중 (In development)"이 표시됩니다.',
    },
    footer: {
      team: '토닥 Todak',
      statusSummary: 'Windows 11 64비트 · Steam Playtest 0.2.3 공개 · 무료·비수익',
      description:
        '팀원의 음성과 스토리 대사를 번역 자막으로 읽도록 돕는 Windows 전용 게임 대화 번역 앱 온말(Onmal)의 공식 웹사이트입니다.',
      linksHeading: '공식 링크 및 문의',
      steamLink: 'Steam 상점 페이지',
      discordLink: 'Discord 커뮤니티',
      xLink: '공식 X (@Onmal05)',
      developerProfileLink: '개발자 강동엽 · 네이버 프로필',
      emailLink: '이메일 문의 (todaklife@gmail.com)',
      changeLang: '언어 변경',
      operator:
        '운영: 개인 개발자 강동엽(토닥 Todak) · 문의 todaklife@gmail.com · 무료 배포, 판매·결제·광고 없음',
      aiNotice: '온말의 자막은 이용자 PC의 AI 모델이 자동으로 만든 결과이며 틀릴 수 있습니다.',
      copyright: '© 2026 토닥 Todak. All rights reserved.',
      legalHeading: '정책과 라이선스',
      backToTop: '맨 위로',
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
      skip: 'Skip to content',
      langGroup: 'Site language',
      primary: 'Main menu',
    },
    hero: {
      statusBadge: 'Windows 11 64-bit Only · In Development & Testing',
      headline: 'Game conversations,\nsubtitled in your language.',
      supporting:
        'A Windows app whose on-PC AI turns teammates’ voice chat and story dialogue into translated subtitles you can read.',
      ctaSteam: 'Join the Playtest on Steam',
      ctaDiscord: 'Discord Community',
      unreleasedNotice:
        'Steam Playtest open · Current default build 0.2.3 · Full release TBD (checked 2026-11-22)',
      heroImageCaption:
        'Official Onmal app screen (real Windows 0.2.0 capture) — interpret screen for choosing the sound and languages, then starting',
      inspectFullSize: 'View original aspect ratio',
      themeSwitchDark: 'Interpret screen',
      themeSwitchIvory: 'Settings screen',
      heardLabel: 'Heard',
      captionLabel: 'Your subtitle',
      statusListLabel: 'Current status',
    },
    features: {
      kicker: 'PRODUCT OVERVIEW · CAPABILITIES',
      title: 'Four Focused Tools for Reading Game Conversations',
      subtitle:
        'Built to turn spoken voice chat and story dialogue into readable subtitles without synthetic clutter or complex audio setups.',
      items: [
        {
          num: '01',
          title: 'Offline Korean↔English and Multilingual Translation',
          meta: 'Processed on your PC · No external server required',
          desc: 'Translation runs directly on your PC with no cloud connection. From 0.1.1, English→Korean uses Marian, and Korean→English and other languages use the new Hy-MT2 model.',
        },
        {
          num: '02',
          title: 'Team Voice & Story Modes',
          meta: 'Context-aware glossary · Helps keep tactical callouts',
          desc: 'The game glossary helps preserve tactical callouts such as "B Site" in Team Voice Chat mode. Story Dialogue mode turns it off by default. How well this holds up in real games is still being checked, and recognition and translation can make mistakes.',
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
          desc: 'Open a private voice room with Steam friends and read the room captions. A participant list appears beside them, a ring shows who is speaking, and the room fits narrow windows. Your mic transmits only after you consent and turn it on yourself; real calls between two PCs are still being verified.',
        },
      ],
      localProcessingLabel: 'Translation Processing Architecture',
      localProcessingExact:
        'Subtitles are generated automatically by AI speech-recognition and translation models installed on your PC, and they can be wrong. Audio and subtitles are not sent to external AI services.',
      localProcessingSub:
        'The speech recognition and translation models are bundled. In 0.1.1, personal API translation, read-aloud (speech synthesis) and sending translations through the mic were removed from the app. Steam installs, updates and voice rooms need internet.',
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
          screenshotId: 3,
        },
        {
          num: '02',
          title: 'Choose Language',
          uiLabel: 'Spoken language → Subtitle language',
          desc: 'Select the spoken language and your target subtitle language, and pick between Team Voice Chat or Story Dialogue mode.',
          screenshotId: 1,
        },
        {
          num: '03',
          title: 'Start',
          uiLabel: 'Start button · Subtitles appear',
          desc: 'Press Start and check the subtitle and source status. If subtitles are missing, check audio output, the source, spoken language, and model status, then consult help or Discord.',
          screenshotId: 2,
        },
      ],
      viewCapture: 'View official app screen',
      staticNotice:
        'These are 0.2.0 screens captured on a real Windows PC on 2026-11-21. Real audio and translation quality are validated separately.',
    },
    gallery: {
      kicker: 'SCREENSHOT GALLERY · REAL WINDOWS 0.2.0 SCREENS',
      title: 'Official Onmal App Screens',
      subtitle:
        '0.2.0 screens captured on a real Windows PC on 2026-11-21, shown in their original aspect ratio. The screens do not establish real audio or performance results.',
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
      versionStatus: 'Playtest 0.2.3 live',
      releaseDateStatus: 'Full release TBD · Early Access planned',
      playtestStatus: 'Steam Playtest open to join',
      leadParagraph:
        'Onmal is being prepared as a free, non-commercial app. As of 2026-11-20 you can join the Playtest from the Steam store page; since 2026-11-22 its default build is 0.2.3. Real in-game audio and translation quality are still being checked.',
      specs: [
        {
          label: 'Target platform',
          value: 'Windows 11 64-bit first',
          detail: 'Onmal is Windows only. The Mac app code was removed in 0.1.1, and no Mac version is offered.',
        },
        {
          label: 'PC requirements (measured on 0.1.1)',
          value: 'Minimum: 4-core CPU (AVX2), 8 GB RAM · Recommended: 6 cores, 16 GB RAM, GPU with 8 GB VRAM',
          detail: 'Based on the app quality tiers. Minimum runs on the CPU without a GPU, and translation can take about 2 seconds per sentence. Recommended and Best use a Vulkan GPU; measured on one PC (RTX 4060 8 GB) on 2026-11-21, the app used about 2.2–2.5 GB of graphics memory and 2.8–3.6 GB of system memory. With a game, add about 2.5 GB VRAM and 4 GB RAM to the game requirements. The install is about 3.0 GB.',
        },
        {
          label: 'Current Playtest build',
          value: 'Default 0.2.3 (Build 26845947)',
          detail: 'The build on the Steam Playtest default branch since 2026-11-22. Earlier defaults were the 0.2.0 update (Build 26841016), 0.2.0 (Build 26832610), 0.1.1 (Build 26830031) and 0.1.0 (Build 26823802). The main app has not been released.',
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
          label: 'What changed in 0.2.3 and 0.2.1',
          value: 'Available in the Playtest',
          detail: '0.2.3 on 2026-11-22: with 8 GB or more of graphics memory, Recommended now uses the most accurate speech model (large-v3-turbo); on 516 test clips with varied voices and microphones the error rate dropped from 70.8% to 47.5%. On Recommended and Maximum, English→Korean also uses Hy-MT2, in-game voice chat is translated into casual Korean and other audio gets the standard translation (you can fix the style in Settings → Translation → Korean subtitle tone). On Maximum, preview captions turn off while a game is in front to reduce stutter. The default look is now Korean traditional (hanji day, ink night), and you can switch to the glass look anytime in Settings → Window colors (if you picked light or dark yourself, nothing changes). Settings and glossaries can be searched with Ctrl+F, there are now 8 game glossaries, and you can set the number of speakers to Auto or 1–6. Scroll bars and menu highlights were tidied up. Earlier, 0.2.1: speech from distant or quiet microphones is no longer thrown away as "too quiet" (empty captions in our test went from 34 of 43 lines to 2), and while a game is in front preview captions are made at most every 1.4 seconds to use less GPU (final captions unchanged). The 0.2.0 update the same day added a Korean traditional theme with hanji day and ink night looks (Settings → Theme), automatic game detection so PUBG, VALORANT or CS2 in full screen uses that game’s glossary and gamer-style translation and captions follow the game’s monitor (only the window title and position are checked), an Invite with Steam button in the voice room and Copy diagnostic info. The first 0.2.0 build added this: when graphics memory runs short during a game, Onmal switches to light mode on its own, turning off preview captions and freeing the translation model’s memory (can be turned off in Settings). Each voice in the game audio gets a colour, a symbol and a name you add (erased when Onmal closes), teammate names are recognised better and kept as they are in translations, translations sound closer to how gamers actually talk, and there is a swear filter (on by default) and a new glass caption design. 0.1.1 brought a clearer glass-like look, the new Hy-MT2 translation model (Korean→English and many languages), settings ordered by how often you use them, and a voice room that fits narrow windows and shows who is speaking. Read-aloud, sending translations through the mic, personal cloud translation keys, the old startup video and four hotkeys were removed (remaining: Start/Stop Alt+Shift+P, Show/Hide subtitles Alt+O, Pin subtitle Alt+L). Large unused models were dropped, and the privacy policy now lists the items Korean law requires. Steam updates it automatically.',
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
          detail: 'With 0.2.3 out, the plan is to check recognition and translation quality and delay in real games, and to make inviting Steam friends to a voice room easier. No dates are set.',
        },
        {
          label: 'Development pace',
          value: 'Solo developer · A free app made in spare time',
          detail: 'Onmal is a free personal project built and maintained by one developer in their spare time, so development, updates, and replies can take a long time. It is not affiliated with any company or organization. Thank you for your patience.',
        },
      ],
      ctaSteamFollow: 'Join the Playtest on Steam',
      ctaDiscordJoin: 'Discord help & questions',
      statusLabel: 'Status now',
      specsLabel: 'Details',
    },
    nameBand: {
      title: 'What the name means',
      onGloss: '“All, whole”, as in 온나라, every nation',
      malGloss: '“Words, speech”',
      sentence: 'The words of every nation,\ncoming together.',
      romanNote: 'Written Onmal in English and other languages.',
    },
    faq: {
      kicker: 'FAQ · BEFORE YOU START',
      title: 'Frequently Asked Questions',
      items: [
        { question: 'Can I install Onmal or join the Playtest now?', answer: 'Yes. Press Join the Playtest on the Steam store page to add it to your Steam library and install it (Windows 11 64-bit, about 3.0GB). The current default build is 0.2.3. It is a test build, so expect bugs; no full release date is set yet.' },
        { question: 'What does “Onmal” mean?', answer: 'In Korean, 온 (on) means “all” or “whole”, as in 온나라 (“every nation”), and 말 (mal) means “words” or “speech”. Onmal is the words of every nation coming together.' },
        { question: 'Why are updates slow?', answer: 'Onmal is a free personal project made by one developer in their spare time, so development and updates take a long time. Rather than rushing, each version is checked on real Windows PCs before release. Replies may also be slow; thank you for understanding.' },
        { question: 'Is there a Mac download?', answer: 'No. Onmal is Windows 11 64-bit only, and no Mac version is offered.' },
        { question: 'Is it free? Do I need internet or a personal API?', answer: 'Onmal is being prepared as a free, non-commercial app with no payments, subscriptions or ads. The speech recognition and translation models are bundled and run on your PC. Steam installation and updates need internet. There is no personal API translation.' },
        { question: 'Do I have to press Start every time?', answer: 'From 0.1.0, turn on keep-on mode in Settings and Onmal starts translating automatically when the saved game or Discord makes sound after the app opens. It is off by default and works only after first-run consent.' },
        { question: 'Are the subtitles made by people?', answer: 'No. Subtitles are generated automatically by AI speech-recognition and machine-translation models installed on your PC, and no person reviews or edits them. They can be wrong, so check anything important yourself. The app’s first-run guide and subtitle screen show this too.' },
        { question: 'Does it isolate only my teammates’ voices?', answer: 'App capture and language selection are available, but voices, effects, and background audio mixed within one process are not automatically separated. Check the actual input source and spoken language.' },
        { question: 'What if subtitles are missing or translation looks wrong?', answer: 'Check the playback device, selected capture source, spoken language, and model readiness in that order. If the issue continues, share only necessary details such as version, symptoms, and settings via Discord or email. Do not post private audio or conversation content.' },
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
      transcriptLabel: 'Video description (transcript)',
      transcript:
        'Background music only, with no speech. Aqua and coral ribbons cross on a dark navy background and form a speech-bubble ring. A mock translation window with English and Spanish selected appears inside the ring, then the words "사용 예시 · 실제 실행 화면 아님 (Concept demonstration)" appear over a network of dots and lines. It ends with the Onmal logo and "개발·테스트 중 (In development)".',
    },
    footer: {
      team: '토닥 Todak',
      statusSummary:
        'Windows 11 64-bit · Steam Playtest 0.2.3 live · Free and non-commercial',
      description:
        'Official website for Onmal (온말), a Windows-only gaming conversation translation app by Todak (토닥).',
      linksHeading: 'Official Channels & Contact',
      steamLink: 'Steam Store Page',
      discordLink: 'Discord Community',
      xLink: 'Official X (@Onmal05)',
      developerProfileLink: 'Developer 강동엽 · Naver Profile',
      emailLink: 'Email Contact (todaklife@gmail.com)',
      changeLang: 'Language',
      operator:
        'Operated by individual developer 강동엽 (Todak) · Contact todaklife@gmail.com · Free, with no sales, payments or ads',
      aiNotice: 'Onmal’s subtitles are generated automatically by AI models on the user’s PC and can be wrong.',
      copyright: '© 2026 토닥 Todak. All rights reserved.',
      legalHeading: 'Policies & licenses',
      backToTop: 'Back to top',
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
