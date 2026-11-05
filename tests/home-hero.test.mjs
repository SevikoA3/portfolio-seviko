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
