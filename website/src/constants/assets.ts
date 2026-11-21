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

const BASE = import.meta.env?.BASE_URL ?? '/onmal-site/';
const SHOT_BASE = `${BASE}shots/0.2.0/`;

/** The app's real logo mark (from the Windows app icon), cut out on a transparent background. */
export const BRAND = {
  mark96: `${BASE}brand/onmal-mark-96.png`,
  mark192: `${BASE}brand/onmal-mark-192.png`,
};

export const MEDIA = {
  video: `${BASE}media/onmal-promo-concept.mp4`,
  poster: `${BASE}media/onmal-promo-concept-poster.jpg`,
};

/** Pixel sizes of the screenshots, so the browser can reserve space before they load. */
export const SHOT_SIZES: Record<number, { width: number; height: number }> = {
  1: { width: 1086, height: 773 },
  2: { width: 800, height: 280 },
  3: { width: 1086, height: 773 },
  4: { width: 1086, height: 773 },
  5: { width: 408, height: 339 },
};

export const SCREENSHOTS: ScreenshotItem[] = [
  {
    id: 1,
    url: `${SHOT_BASE}01-main.png`,
    titleKo: '자막이 나오는 통역 화면 (Windows 0.2.0)',
    titleEn: 'Interpret screen with live captions (Windows 0.2.0)',
    descKo: '유리 느낌의 기본 화면입니다. 번역할 소리와 언어, 품질을 고르고 시작하면 자막이 바로 나옵니다.',
    descEn: 'The glass main screen. Pick the sound, languages and quality, start, and captions appear right away.',
    altKo: '온말 Windows 0.2.0 — 자막이 나오는 통역 화면',
    altEn: 'Onmal Windows 0.2.0 — Interpret screen with live captions',
  },
  {
    id: 2,
    url: `${SHOT_BASE}02-overlay.png`,
    titleKo: '게임 위 자막 · 목소리 색과 이름 (Windows 0.2.0)',
    titleEn: 'In-game captions · voice colours and names (Windows 0.2.0)',
    descKo: '게임 위에 뜨는 유리 자막 띠입니다. 목소리마다 색 띠와 기호, 직접 붙인 이름표가 붙습니다(이름은 시험용).',
    descEn: 'The glass caption strip over a game. Each voice gets a colour bar, a symbol and the name you gave it (test names).',
    altKo: '온말 Windows 0.2.0 — 게임 위 자막 · 목소리 색과 이름',
    altEn: 'Onmal Windows 0.2.0 — In-game captions · voice colours and names',
  },
  {
    id: 3,
    url: `${SHOT_BASE}03-voice-names.png`,
    titleKo: '목소리 이름 붙이기 (Windows 0.2.0)',
    titleEn: 'Name the voices (Windows 0.2.0)',
    descKo: '홈 화면에서 팀원 이름을 적어 두면 같은 목소리의 자막에 이름이 붙고, 음성 인식도 그 이름을 더 잘 알아듣습니다. 온말을 끄면 지워집니다.',
    descEn: 'Type teammate names on the home screen: that voice’s captions show the name and recognition hears it better. Erased when Onmal closes.',
    altKo: '온말 Windows 0.2.0 — 목소리 이름 붙이기',
    altEn: 'Onmal Windows 0.2.0 — Name the voices',
  },
  {
    id: 4,
    url: `${SHOT_BASE}04-settings.png`,
    titleKo: '설정 · 품질과 게임 중 가벼운 모드 (Windows 0.2.0)',
    titleEn: 'Settings · quality and light mode while gaming (Windows 0.2.0)',
    descKo: '품질 3단계(최소·권장·최고), 게임 중 자동 가벼운 모드, 욕설 가리기를 한 화면에서 고릅니다.',
    descEn: 'Choose the three quality tiers, automatic light mode while gaming and the swear filter in one place.',
    altKo: '온말 Windows 0.2.0 — 설정 · 품질과 게임 중 가벼운 모드',
    altEn: 'Onmal Windows 0.2.0 — Settings · quality and light mode while gaming',
  },
  {
    id: 5,
    url: `${SHOT_BASE}06-start.png`,
    titleKo: '시작 화면 (Windows 0.2.0)',
    titleEn: 'Start screen (Windows 0.2.0)',
    descKo: '앱을 켤 때 보이는 유리 느낌의 시작 화면입니다.',
    descEn: 'The glass start screen shown when the app opens.',
    altKo: '온말 Windows 0.2.0 — 시작 화면',
    altEn: 'Onmal Windows 0.2.0 — Start screen',
  },
];

export const LINKS = {
  steam: 'https://store.steampowered.com/app/5060050/',
  discord: 'https://discord.gg/W6rv7ABFpy',
  x: 'https://x.com/Onmal05',
  developerProfile: 'https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjky&pkid=1&os=33590239&qvt=0&query=%EA%B0%95%EB%8F%99%EC%97%BD',
  email: 'mailto:todaklife@gmail.com',
};
