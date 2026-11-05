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
  assert.doesNotMatch(heroSource, /data:image\/gif;base64/, 'hero must not use a transparent placeholder as its image source');
  assert.doesNotMatch(heroSource, /hidden[^"`]*md:flex/, 'hero portrait must not be hidden on mobile');
});

test('hero portrait shows a loading state and a graceful error fallback', () => {
  assert.ok(heroSource, 'homepage hero section should exist');
  assert.match(homeSource, /heroImageLoaded/, 'hero should track when the portrait has loaded');
  assert.match(heroSource, /onLoad=/, 'hero image load should clear its placeholder');
  assert.match(homeSource, /heroImageError/, 'hero should track portrait loading errors');
  assert.match(heroSource, /onError=/, 'hero image errors should switch to a fallback');
  assert.match(heroSource, /Loading portrait|Loading image/i, 'hero should expose a visible loading placeholder');
});
