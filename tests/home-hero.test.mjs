import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const homeSource = await readFile(new URL('../src/pages/Home.tsx', import.meta.url), 'utf8');
const heroSource = homeSource.match(/<section className="relative flex min-h-\[calc\(100vh-4rem\)\][\s\S]*?<\/section>/)?.[0];

test('hero portrait is fetched eagerly and has a real source on every viewport', () => {
  assert.ok(heroSource, 'homepage hero section should exist');
  assert.match(heroSource, /<img[\s\S]*?src=\{HERO_IMAGE_URL\}/, 'img fallback must use the real portrait URL');
  assert.match(heroSource, /loading="eager"/, 'hero portrait must start loading immediately');
  assert.match(heroSource, /fetchPriority="high"/, 'hero portrait must receive high fetch priority');
  assert.match(heroSource, /width=\{1024\}[\s\S]*?height=\{1024\}/, 'portrait dimensions should reserve the image aspect ratio');
  assert.doesNotMatch(heroSource, /data:image\/gif;base64/, 'hero must not use a transparent placeholder as its image source');
  assert.doesNotMatch(heroSource, /hidden[^"`]*md:flex/, 'hero portrait must not be hidden on mobile');
});

test('hero portrait stays blank until loaded without a frame or loading placeholder', () => {
  assert.ok(heroSource, 'homepage hero section should exist');
  assert.match(homeSource, /heroImageLoaded/, 'hero should track when the portrait has loaded');
  assert.match(heroSource, /onLoad=/, 'hero image should become visible after loading');
  assert.match(heroSource, /heroImageLoaded \? 'opacity-100' : 'opacity-0'/, 'hero image should stay invisible before loading');
  assert.match(heroSource, /heroImageLoaded && \(\s*<div aria-hidden="true" className="absolute -bottom-1/, 'decorative glow should stay hidden until the portrait loads');
  assert.doesNotMatch(heroSource, /border-primary\/20|from-surface-container-high|Loading portrait|Portrait unavailable/, 'hero should not show a frame or loading/error decoration');
});

test('homepage copy uses human-first language instead of dashboard jargon', () => {
  assert.ok(heroSource, 'homepage hero section should exist');
  assert.match(heroSource, /available for selected projects/, 'hero availability label should sound personal');
  assert.match(heroSource, />\s*View my work\s*</, 'primary work CTA should use natural language');
  assert.doesNotMatch(homeSource, /system\.status|View Manifest|data\.streams|Open Vault/, 'homepage should not use pseudo-system labels');
});

test('homepage cards expose restrained hover motion and keyboard focus', () => {
  assert.match(homeSource, /hover:-translate-y-1/, 'interactive cards should lift subtly on hover');
  assert.match(homeSource, /focus-visible:ring-2/, 'interactive controls should expose keyboard focus');
  assert.match(homeSource, /motion-safe:/, 'new motion should be opt-in for users who allow motion');
});

test('hero portrait uses most of the mobile column while preserving desktop sizing', () => {
  assert.ok(heroSource, 'homepage hero section should exist');
  assert.match(heroSource, /max-w-\[min\(100%,32rem\)\]/, 'mobile portrait should scale to the available column');
  assert.match(heroSource, /sm:max-w-\w+/, 'tablet portrait should keep a bounded width');
});

test('hero portrait has larger tablet and desktop bounds', () => {
  assert.ok(heroSource, 'homepage hero section should exist');
  assert.match(heroSource, /sm:max-w-96/, 'tablet portrait should have a larger 24rem bound');
  assert.match(heroSource, /md:max-w-\[40rem\]/, 'medium portrait should have a larger 40rem bound');
  assert.match(heroSource, /lg:max-w-\[40rem\]/, 'desktop portrait should have a larger 40rem bound');
  assert.doesNotMatch(heroSource, /sm:max-w-72|md:max-w-104|lg:max-w-120/, 'portrait should not keep the old small bounds');
});

test('desktop hero grid gives the portrait enough horizontal space', () => {
  assert.ok(heroSource, 'homepage hero section should exist');
  assert.match(heroSource, /lg:grid-cols-\[minmax\(0,0\.85fr\)_minmax\(0,1\.15fr\)\]/, 'desktop grid should give the portrait the larger column');
});

test('tablet and desktop portrait sizing responds to viewport height', () => {
  assert.ok(heroSource, 'homepage hero section should exist');
  assert.match(heroSource, /md:w-\[min\(100%,calc\(100dvh-11rem\)\)\]/, 'portrait width should respond to viewport height');
  assert.match(heroSource, /max-w-\[min\(100%,32rem\)\]/, 'portrait should remain fluid within its mobile bound');
});

test('hero vertical spacing adapts to short and tall desktop windows', () => {
  assert.ok(heroSource, 'homepage hero section should exist');
  assert.match(heroSource, /md:py-\[clamp\(3rem,10vh,6rem\)\]/, 'hero padding should scale with viewport height');
});

test('homepage section labels avoid hash-prefixed dashboard language', () => {
  assert.doesNotMatch(homeSource, /#core_competencies|#latest_publication|#experience|#certificates|#latest_projects|#about|#contact/, 'homepage labels should read like normal editorial headings');
  assert.match(homeSource, />\s*Core competencies\s*</, 'skills section should have a human-readable heading');
});
