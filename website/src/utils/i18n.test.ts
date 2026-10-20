import test from 'node:test';
import assert from 'node:assert/strict';
import { filterLanguages, translations } from './i18n.ts';
import { SCREENSHOTS } from '../constants/assets.ts';

test('filterLanguages returns all supported languages on empty query', () => {
  const result = filterLanguages('');
  assert.equal(result.length, 2);
});

test('filterLanguages correctly matches 한국어 and Korean queries', () => {
  assert.equal(filterLanguages('한국어').length, 1);
  assert.equal(filterLanguages('한국어')[0].code, 'ko');

  assert.equal(filterLanguages('Korean').length, 1);
  assert.equal(filterLanguages('Korean')[0].code, 'ko');

  assert.equal(filterLanguages('ko').length, 1);
  assert.equal(filterLanguages('ko')[0].code, 'ko');
});

test('filterLanguages correctly matches 영어 and English queries', () => {
  assert.equal(filterLanguages('영어').length, 1);
  assert.equal(filterLanguages('영어')[0].code, 'en');

  assert.equal(filterLanguages('English').length, 1);
  assert.equal(filterLanguages('English')[0].code, 'en');

  assert.equal(filterLanguages('en').length, 1);
  assert.equal(filterLanguages('en')[0].code, 'en');
});

test('filterLanguages returns empty list for unsupported languages', () => {
  assert.equal(filterLanguages('Japanese').length, 0);
  assert.equal(filterLanguages('일본어').length, 0);
  assert.equal(filterLanguages('French').length, 0);
});

test('both languages distinguish uploads and automated checks from public availability', () => {
  for (const language of ['ko', 'en'] as const) {
    const content = JSON.stringify(translations[language]);
    const status = JSON.stringify(translations[language].development);
    assert.ok(status.includes('0.3.2'));
    assert.ok(status.includes('26067017') && status.includes('26067660'));
    assert.ok(status.includes('998') && status.includes('875') && status.includes('123'));
    assert.ok(status.includes('2026-10-20') && status.includes('17:22 KST'));
    assert.ok(!content.includes('0.3.1'));
    assert.ok(!/sign-ups open|applicants are added automatically|참여 신청 접수 중|신청자는 자동/.test(content));
  }
  assert.match(translations.ko.development.playtestStatus, /미활성.*심사 대기/);
  assert.match(translations.en.development.playtestStatus, /inactive.*pending/);
  assert.match(translations.ko.development.specs[3].value, /미완료/);
  assert.match(translations.en.development.specs[3].value, /Real Windows/);
});

test('Screenshot metadata and captions do not assert 0.3.1 version on images', () => {
  const ko = translations.ko;
  const en = translations.en;

  assert.ok(!ko.hero.heroImageCaption.includes('0.3.1'));
  assert.ok(ko.hero.heroImageCaption.includes('공식 앱 화면'));
  assert.ok(!ko.gallery.title.includes('0.3.1'));
  assert.ok(!ko.howItWorks.staticNotice.includes('0.3.1'));

  assert.ok(!en.hero.heroImageCaption.includes('0.3.1'));
  assert.ok(!en.gallery.title.includes('0.3.1'));
  assert.ok(!en.howItWorks.staticNotice.includes('0.3.1'));

  for (const shot of SCREENSHOTS) {
    assert.ok(!shot.titleKo.includes('0.3.1'));
    assert.ok(!shot.descKo.includes('0.3.1'));
    assert.ok(!shot.altKo.includes('0.3.1'));
    assert.ok(!shot.titleEn.includes('0.3.1'));
    assert.ok(!shot.descEn.includes('0.3.1'));
    assert.ok(!shot.altEn.includes('0.3.1'));
  }
});

test('English and Korean expose the same content structure including FAQ and navigation', () => {
  function shape(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(shape);
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, shape(child)]));
    }
    return typeof value;
  }
  assert.deepEqual(shape(translations.ko), shape(translations.en));
  assert.equal(translations.ko.faq.items.length, 6);
  assert.equal(translations.en.faq.items.length, 6);
});
