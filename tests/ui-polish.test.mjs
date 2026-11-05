import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const pagePaths = ['Projects', 'Experience', 'About', 'Publications', 'Certificates', 'Contacts'];
const pageSources = Object.fromEntries(
  await Promise.all(pagePaths.map(async (page) => [
    page,
    await readFile(new URL(`../src/pages/${page}.tsx`, import.meta.url), 'utf8'),
  ])),
);

test('detail page headings read like content instead of terminal commands', () => {
  for (const [page, source] of Object.entries(pageSources)) {
    assert.doesNotMatch(source, /<h1[^>]*>\s*#<span/, `${page} heading should not use a hash prefix`);
  }
  assert.match(pageSources.About, />Technical toolkit</, 'about page should use a natural section title');
  assert.match(pageSources.About, />A few things about me</, 'about page should avoid a generated-sounding section title');
  assert.match(pageSources.Contacts, /Available for work/, 'contact availability should use human language');
});

test('navigation active state uses an understated indicator', async () => {
  const layout = await readFile(new URL('../src/components/Layout.tsx', import.meta.url), 'utf8');

  assert.match(layout, /after:h-px/, 'active navigation should use an underline');
  assert.doesNotMatch(layout, /before:content-\['_#'\]/, 'active navigation should not inject a hash prefix');
});
