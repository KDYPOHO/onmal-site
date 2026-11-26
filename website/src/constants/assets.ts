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
const SHOT_BASE = `${BASE}shots/0.2.3/`;

/** The app's real logo mark (from the Windows app icon), cut out on a transparent background. */
export const BRAND = {
  mark96: `${BASE}brand/onmal-mark-96.png`,
  mark192: `${BASE}brand/onmal-mark-192.png`,
};

export const MEDIA = {
  video: `${BASE}media/onmal-promo-voice-2026-11.mp4`,
  poster: `${BASE}media/onmal-promo-voice-2026-11-poster.jpg`,
};

/** Pixel sizes of the screenshots, so the browser can reserve space before they load. */
export const SHOT_SIZES: Record<number, { width: number; height: number }> = {
  1: { width: 1028, height: 741 },
  2: { width: 732, height: 294 },
  3: { width: 1028, height: 702 },
  4: { width: 1028, height: 741 },
  5: { width: 408, height: 339 },
};

export const SCREENSHOTS: ScreenshotItem[] = [
  {
    id: 1,
    url: `${SHOT_BASE}01-main.png`,
    titleKo: '자막이 나오는 통역 화면 (Windows 0.2.3)',
    titleEn: 'Interpret screen with captions (Windows 0.2.3)',
    descKo: '기본 모양인 한국 전통(한지 낮) 화면입니다. 번역할 소리와 언어, 품질을 고르고 시작하면 원문과 번역 자막이 나옵니다(그림 속 자막은 예시 문장).',
    descEn: 'The default Korean traditional look (hanji day). Pick the sound, languages and quality, start, and the original line and its translation appear (sample captions shown).',
    altKo: '온말 Windows 0.2.3 — 자막이 나오는 통역 화면',
    altEn: 'Onmal Windows 0.2.3 — Interpret screen with captions',
  },
  {
    id: 2,
    url: `${SHOT_BASE}02-overlay.png`,
    titleKo: '게임 위 자막 · 목소리 색과 이름 (Windows 0.2.3)',
    titleEn: 'In-game captions · voice colours and names (Windows 0.2.3)',
    descKo: '게임 위에 뜨는 자막 띠입니다. 목소리마다 색 띠와 기호, 이름표가 붙습니다(예시 문장).',
    descEn: 'The caption strip over a game. Each voice gets a colour bar, a symbol and a name tag (sample lines).',
    altKo: '온말 Windows 0.2.3 — 게임 위 자막 · 목소리 색과 이름',
    altEn: 'Onmal Windows 0.2.3 — In-game captions · voice colours and names',
  },
  {
    id: 3,
    url: `${SHOT_BASE}03-voice-room.png`,
    titleKo: 'Steam 친구 음성방 (Windows 0.2.3)',
    titleEn: 'Voice room with Steam friends (Windows 0.2.3)',
    descKo: '온말을 켠 Steam 친구와 비공개 음성방에서 이야기합니다. 그림은 소리 없는 시험 연결과 시험 이름(팀원 1, 팀원 2)입니다.',
    descEn: 'Talk with Steam friends who run Onmal in a private voice room. Shown with a silent test connection and test names (Teammate 1, 2).',
    altKo: '온말 Windows 0.2.3 — Steam 친구 음성방',
    altEn: 'Onmal Windows 0.2.3 — Voice room with Steam friends',
  },
  {
    id: 4,
    url: `${SHOT_BASE}04-settings.png`,
    titleKo: '설정 · 검색과 한국어 자막 말투 (Windows 0.2.3)',
    titleEn: 'Settings · search and Korean subtitle tone (Windows 0.2.3)',
    descKo: '한국 전통 밤(먹) 모양의 설정입니다. 맨 위에서 설정을 찾고(초성 검색 가능), 한국어 자막 말투와 게임 용어집을 고릅니다.',
    descEn: 'Settings in the Korean traditional night (ink) look. Search settings at the top, and choose the Korean subtitle tone and game glossary.',
    altKo: '온말 Windows 0.2.3 — 설정 · 검색과 한국어 자막 말투',
    altEn: 'Onmal Windows 0.2.3 — Settings · search and Korean subtitle tone',
  },
  {
    id: 5,
    url: `${SHOT_BASE}06-start.png`,
    titleKo: '시작 화면 (Windows 0.2.3)',
    titleEn: 'Start screen (Windows 0.2.3)',
    descKo: '앱을 켤 때 보이는 한국 전통 모양의 시작 화면입니다.',
    descEn: 'The Korean traditional start screen shown when the app opens.',
    altKo: '온말 Windows 0.2.3 — 시작 화면',
    altEn: 'Onmal Windows 0.2.3 — Start screen',
  },
];

export const LINKS = {
  steam: 'https://store.steampowered.com/app/5060050/',
  discord: 'https://discord.gg/W6rv7ABFpy',
  x: 'https://x.com/Onmal05',
  developerProfile: 'https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjky&pkid=1&os=33590239&qvt=0&query=%EA%B0%95%EB%8F%99%EC%97%BD',
  email: 'mailto:todaklife@gmail.com',
};
