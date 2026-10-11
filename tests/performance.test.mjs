import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import { initializeApp } from 'firebase/app';
import * as firestore from 'firebase/firestore';

const db = firestore.initializeFirestore(initializeApp({ projectId: 'performance-test' }), {});

async function loadModule(path, dependencies, globals = {}) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const context = vm.createContext({ console, ...globals });
  const module = new vm.SourceTextModule(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, { context });
  await module.link((name) => {
    const exports = dependencies[name];
    return new vm.SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
    }, { context });
  });
  await module.evaluate();
  return module.namespace;
}

test('public queries share requests, expire, retry errors, and invalidate after edits', async () => {
  let now = 0;
  let requests = 0;
  let fail = false;
  const snapshot = { forEach: callback => callback({ id: 'one', data: () => ({ title: 'Project' }) }) };
  const api = await loadModule('../src/lib/api.ts', {
    'firebase/firestore': {
      ...firestore,
      getDocs: async q => {
        requests++;
        if (fail) throw new Error('offline');
        assert.equal(q.firestore, db);
        return snapshot;
      },
    },
    './firebase': { db },
  }, { Date: { now: () => now }, console: { error() {} } });

  const [first, second] = await Promise.all([api.fetchProjects(true), api.fetchProjects(true)]);
  assert.equal(first[0].id, 'one');
  assert.equal(second[0].title, 'Project');
  assert.equal(requests, 1, 'concurrent visits must share one read');
  await api.fetchProjects(true);
  assert.equal(requests, 1, 'repeat visits must reuse fresh data');
  await api.fetchProjects(false);
  assert.equal(requests, 2, 'latest and full queries must remain separate');
  now = 60_001;
  await api.fetchProjects(true);
  assert.equal(requests, 3, 'expired data must refresh');
  fail = true;
  assert.equal((await api.fetchMoreProjects()).length, 0);
  fail = false;
  assert.equal((await api.fetchMoreProjects())[0].id, 'one', 'failed reads must be retried');
  api.invalidatePublicDataCache();
  await api.fetchProjects(true);
  assert.equal(requests, 6, 'edits must invalidate fresh data');
  for (const fetch of [api.fetchPublications, api.fetchExperiences, api.fetchCertificates]) {
    const before = requests;
    const items = await fetch(true);
    await fetch(true);
    assert.equal(items[0].id, 'one');
    assert.equal(requests, before + 1, 'each public collection must reuse its query');
  }
});

async function createStarfield({ touch = true, reduceMotion = false, cores = 4 } = {}) {
  let effect;
  let draws = 0;
  let sequence = 0;
  const frames = new Map();
  const listeners = new Map();
  const context = new Proxy({}, { get: (_, key) => key === 'clearRect' ? () => draws++ : () => {} });
  const canvas = { style: {}, getContext: () => context };
  const document = {
    hidden: false,
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: name => listeners.delete(name),
  };
  const window = {
    innerWidth: 390, innerHeight: 844, devicePixelRatio: 3, scrollY: 0,
    matchMedia: query => ({ matches: query.includes('coarse') ? touch : query.includes('reduced-motion') && reduceMotion }),
    addEventListener() {}, removeEventListener() {},
    requestAnimationFrame: callback => { frames.set(++sequence, callback); return sequence; },
    cancelAnimationFrame: id => frames.delete(id),
  };
  const module = await loadModule('../src/components/StarfieldLayer.tsx', {
    react: { useRef: () => ({ current: canvas }), useEffect: callback => { effect = callback; } },
    'react/jsx-runtime': { jsx() {}, jsxs() {} },
  }, { window, document, navigator: { maxTouchPoints: touch ? 1 : 0, hardwareConcurrency: cores }, setTimeout, clearTimeout });
  module.default();
  const cleanup = effect();
  return { canvas, document, frames, listeners, cleanup, draws: () => draws };
}

test('starfield limits touch redraws and pauses while hidden', async () => {
  const { canvas, document, frames, listeners, cleanup, draws } = await createStarfield({ cores: 8 });
  for (let tick = 1; tick <= 60; tick++) {
    const [id, callback] = frames.entries().next().value;
    frames.delete(id);
    callback(tick * 1000 / 60);
  }
  assert.ok(draws() <= 31, `touch background drew ${draws()} times in one second`);
  assert.ok(canvas.width <= 585, 'touch canvas must cap pixel density');
  document.hidden = true;
  listeners.get('visibilitychange')();
  assert.equal(frames.size, 0, 'hidden tabs must stop background animation');
  document.hidden = false;
  listeners.get('visibilitychange')();
  assert.equal(frames.size, 1, 'visible tabs must resume one animation loop');
  cleanup();
  assert.equal(frames.size, 0);
  assert.equal(listeners.size, 0);
});

test('desktop with four logical processors uses the smaller background budget', async () => {
  const { frames, cleanup, draws } = await createStarfield({ touch: false, cores: 4 });
  for (let tick = 1; tick <= 60; tick++) {
    const [id, callback] = frames.entries().next().value;
    frames.delete(id);
    callback(tick * 1000 / 60);
  }
  assert.ok(draws() <= 31);
  cleanup();
});

test('reduced motion draws a static background without scheduling frames', async () => {
  const { frames, cleanup, draws } = await createStarfield({ reduceMotion: true });
  assert.equal(draws(), 1);
  assert.equal(frames.size, 0);
  cleanup();
});

test('desktop starfield caps high refresh displays at 60 redraws per second', async () => {
  const { frames, cleanup, draws } = await createStarfield({ touch: false, cores: 8 });
  for (let tick = 1; tick <= 144; tick++) {
    const [id, callback] = frames.entries().next().value;
    frames.delete(id);
    callback(tick * 1000 / 144);
  }
  assert.ok(draws() > 30 && draws() <= 61);
  cleanup();
});
