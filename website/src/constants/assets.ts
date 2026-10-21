export interface ScreenshotItem {
  id: number;
  url: string;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  altKo: string;
  altEn: string;
}

export const APP_ICON_URL =
  'https://avatars.fastly.steamstatic.com/d400f0f805a3c684da34b0c242fdaba682751507_full.jpg?original=1';

export const SCREENSHOTS: ScreenshotItem[] = [
  {
    id: 1,
    url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5060050/f08f2e71ee9722e42208754479dd57b79a7b55f9/ss_f08f2e71ee9722e42208754479dd57b79a7b55f9.1920x1080.jpg?t=1792371738',
    titleKo: '한국어 기본 화면 (다크 테마 · 공식 앱 화면)',
    titleEn: 'Korean Main Interface (Dark Surface · Official App Screen)',
    descKo: '소리 가져올 곳(컴퓨터 소리 전체), 듣는 언어와 자막 언어 선택, 시작 버튼 및 설정·내 말 전하기 메뉴가 배치된 공식 앱 화면입니다.',
    descEn: 'Official Steam screenshot of the Korean interface showing audio source selection, spoken and subtitle language selectors, Start button, Settings, and text translation panel.',
    altKo: '온말 Steam 공식 스크린샷 — 한국어 다크 테마 공식 앱 화면: 소리 가져올 곳, 듣는 언어, 자막 언어, 시작 버튼',
    altEn: 'Onmal official Steam screenshot — Korean dark theme official app screen showing audio source, spoken language, subtitle language, and Start button',
  },
  {
    id: 2,
    url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5060050/ccdafdf6f433c1a8ed2c52c7f8f3fef47c0d4218/ss_ccdafdf6f433c1a8ed2c52c7f8f3fef47c0d4218.1920x1080.jpg?t=1792371738',
    titleKo: '영어 기본 화면 (English 공식 앱 화면)',
    titleEn: 'English Main Interface (Official App Screen)',
    descKo: '영어 사용 환경을 위한 공식 앱 화면으로, Where to listen, Spoken language, Subtitle language 및 Say something to your team 메뉴를 제공합니다.',
    descEn: 'Official Steam screenshot of the English interface showing Where to listen (All computer sound), Spoken language, Subtitle language, Start, Settings, and Say something to your team.',
    altKo: '온말 Steam 공식 스크린샷 — 영어 다크 테마 공식 앱 화면: Where to listen, Spoken language, Subtitle language, Start',
    altEn: 'Onmal official Steam screenshot — English dark theme official app screen showing Where to listen, Spoken language, Subtitle language, and Start',
  },
  {
    id: 3,
    url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5060050/a9f8d1f3219e3880a672da62bfcb0a420635bef7/ss_a9f8d1f3219e3880a672da62bfcb0a420635bef7.1920x1080.jpg?t=1792371738',
    titleKo: '스토리 대사 모드 설정 (공식 앱 화면)',
    titleEn: 'Story Dialogue Mode Configuration (Official App Screen)',
    descKo: '스토리 대사를 들을 때는 전술 용어집을 기본으로 끄고, 극적인 대사 흐름에 맞추어 자막을 읽을 수 있도록 돕는 공식 앱 설정 화면입니다.',
    descEn: 'Official Steam screenshot of the settings panel configured for Story Dialogue mode, where the tactical game glossary is disabled by default.',
    altKo: '온말 Steam 공식 스크린샷 — 스토리 대사 모드 공식 앱 설정 화면',
    altEn: 'Onmal official Steam screenshot — Story Dialogue mode official app settings screen',
  },
  {
    id: 4,
    url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5060050/930d3a7d881582d10a4a2d67d8af363743a90366/ss_930d3a7d881582d10a4a2d67d8af363743a90366.1920x1080.jpg?t=1792371738',
    titleKo: '한국어 기본 화면 (아이보리 라이트 테마 · 공식 앱 화면)',
    titleEn: 'Korean Main Interface (Warm Ivory Surface · Official App Screen)',
    descKo: '차분한 아이보리 톤의 밝은 화면 테마를 담은 Steam 공식 스크린샷으로, 사용 환경과 시각적 선호에 맞춰 깔끔하게 구성할 수 있습니다.',
    descEn: 'Official Steam screenshot of the warm ivory light surface theme for the main Korean interface.',
    altKo: '온말 Steam 공식 스크린샷 — 아이보리 라이트 테마 공식 앱 화면',
    altEn: 'Onmal official Steam screenshot — warm ivory light theme official app screen',
  },
  {
    id: 5,
    url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5060050/6f21af33f069111a8dbd1e2ddc865cb1b66a9ed1/ss_6f21af33f069111a8dbd1e2ddc865cb1b66a9ed1.1920x1080.jpg?t=1792371738',
    titleKo: '팀 음성 채팅 모드 및 게임 용어집 (공식 앱 화면)',
    titleEn: 'Team Voice Chat Mode & Game Glossary (Official App Screen)',
    descKo: '팀 음성 채팅 모드와 게임 용어집 설정을 보여주는 기존 Steam 스크린샷입니다. 용어집은 콜아웃 보존을 돕지만 인식·번역 오류를 모두 막지는 못합니다.',
    descEn: 'Existing Steam screenshot showing Team Voice Chat mode and the game glossary. The glossary helps preserve callouts but cannot prevent every recognition or translation error.',
    altKo: '온말 Steam 공식 스크린샷 — 팀 음성 채팅 모드 및 게임 용어집 공식 앱 설정 화면',
    altEn: 'Onmal official Steam screenshot — Team Voice Chat mode and game glossary official app settings screen',
  },
];

export const LINKS = {
  steam: 'https://store.steampowered.com/app/5060050/',
  discord: 'https://discord.gg/W6rv7ABFpy',
  x: 'https://x.com/Onmal05',
  developerProfile: 'https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjky&pkid=1&os=33590239&qvt=0&query=%EA%B0%95%EB%8F%99%EC%97%BD',
  email: 'mailto:todaklife@gmail.com',
};
