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

const SHOT_BASE = `${import.meta.env?.BASE_URL ?? "/onmal-site/"}shots/0.1.0/`;

export const SCREENSHOTS: ScreenshotItem[] = [
  {
    id: 1,
    url: `${SHOT_BASE}main-dark.png`,
    titleKo: '통역 화면 (다크 테마 · Windows 0.1.0)',
    titleEn: 'Interpret Screen (Dark Theme · Windows 0.1.0)',
    descKo: '번역할 소리(예: Discord), 상대가 말하는 언어, 번역할 언어, 통역 품질을 고르고 시작하는 기본 화면입니다. 실제 Windows PC에서 찍었고, 이 확인 PC에는 인식 모델을 설치하지 않아 아래에 모델 안내가 보입니다.',
    descEn: 'The main screen where you choose the sound to translate (e.g. Discord), the spoken language, the subtitle language and quality, then start. Captured on a real Windows PC; recognition models were not installed on that test PC, so a model notice appears at the bottom.',
    altKo: '온말 Windows 0.1.0 통역 화면 — 다크 테마',
    altEn: 'Onmal Windows 0.1.0 interpret screen — dark theme',
  },
  {
    id: 2,
    url: `${SHOT_BASE}setup-source.png`,
    titleKo: '처음 설정 2단계 · 들을 앱 고르기 (Windows 0.1.0)',
    titleEn: 'First-run Setup Step 2 · Choose the App to Listen To (Windows 0.1.0)',
    descKo: '팀원 목소리가 나오는 앱이나 출력 장치와 자막 언어를 고르는 처음 설정 화면입니다. 앱 소리 안의 팀원 음성과 게임 효과음은 자동으로 나뉘지 않는다고 함께 안내합니다.',
    descEn: 'First-run setup screen for choosing the app or output device that plays teammates’ voices, and the subtitle language. It also notes that voices and game effects inside one app are not separated automatically.',
    altKo: '온말 Windows 0.1.0 처음 설정 — 소리 가져올 곳과 자막 언어 선택',
    altEn: 'Onmal Windows 0.1.0 first-run setup — audio source and subtitle language',
  },
  {
    id: 3,
    url: `${SHOT_BASE}main-narrow.png`,
    titleKo: '좁은 창의 통역 화면 (Windows 0.1.0)',
    titleEn: 'Interpret Screen in a Narrow Window (Windows 0.1.0)',
    descKo: '창을 좁히면 자막 영역이 위로, 소리·언어·품질 선택이 아래로 내려갑니다. 왼쪽 메뉴에서 통역·친구·통역 준비·설정·안내로 이동합니다.',
    descEn: 'In a narrow window the subtitle area moves to the top and the sound, language and quality controls move below it. The left menu leads to Interpret, Friends, Preparation, Settings and Info.',
    altKo: '온말 Windows 0.1.0 좁은 창 통역 화면',
    altEn: 'Onmal Windows 0.1.0 interpret screen in a narrow window',
  },
  {
    id: 4,
    url: `${SHOT_BASE}main-light.png`,
    titleKo: '통역 화면 (라이트 테마 · Windows 0.1.0)',
    titleEn: 'Interpret Screen (Light Theme · Windows 0.1.0)',
    descKo: '같은 통역 화면의 라이트 테마입니다. 왼쪽에서 소리와 언어를 고르고, 오른쪽 넓은 영역에 자막이 표시됩니다.',
    descEn: 'The same interpret screen in the light theme. Choose sound and languages on the left; subtitles appear in the large area on the right.',
    altKo: '온말 Windows 0.1.0 통역 화면 — 라이트 테마',
    altEn: 'Onmal Windows 0.1.0 interpret screen — light theme',
  },
  {
    id: 5,
    url: `${SHOT_BASE}setup-game.png`,
    titleKo: '처음 설정 3단계 · 게임 화면 모드 안내 (Windows 0.1.0)',
    titleEn: 'First-run Setup Step 3 · Game Display Mode (Windows 0.1.0)',
    descKo: '자막은 게임 위에 별도 창으로 그려지므로 창 모드나 테두리 없는 창 모드에서 보인다는 안내와 단축키를 보여줍니다. 온말은 게임에 아무것도 주입하지 않습니다.',
    descEn: 'Explains that subtitles are drawn as a separate window over the game, so they show in windowed or borderless mode, and lists the shortcuts. Onmal injects nothing into games.',
    altKo: '온말 Windows 0.1.0 처음 설정 — 게임 화면 모드와 단축키 안내',
    altEn: 'Onmal Windows 0.1.0 first-run setup — game display mode and shortcuts',
  },
];

export const LINKS = {
  steam: 'https://store.steampowered.com/app/5060050/',
  discord: 'https://discord.gg/W6rv7ABFpy',
  x: 'https://x.com/Onmal05',
  developerProfile: 'https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjky&pkid=1&os=33590239&qvt=0&query=%EA%B0%95%EB%8F%99%EC%97%BD',
  email: 'mailto:todaklife@gmail.com',
};
