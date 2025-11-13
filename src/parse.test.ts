import { describe, expect, beforeAll, it } from 'vitest';
import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { parse } from './index';
import type { LcovFile } from './index';

describe('module interface', () => {
  it('should export a function', () => {
    expect(parse).toBeDefined();
    expect(typeof parse).toBe('function');
  });

  it('should handle bad file passing', () => {
    const files = parse('foobar');
    expect(files).toBeUndefined();
  });

  it('should parse as a string', () => {
    const data = parse('TN:TestName\nSF:foobar.js\nend_of_record\n');
    expect(Array.isArray(data)).toBe(true);
    expect(data?.[0]?.title).toBe('TestName');
    expect(data?.[0]?.file).toBe('foobar.js');
  });
});

describe('simple file parsing', () => {
  let data: LcovFile[] | [];

  beforeAll(async () => {
    const yuiFile = resolve(__dirname, 'fixtures/simple.txt');

    const content = await readFile(yuiFile, 'utf-8');
    data = parse(content) || [];
  });

  it('should return an array', () => {
    expect(Array.isArray(data)).toBe(true);
  });

  it('should contain 3 keys', () => {
    expect(data.length).toBe(3);
  });

  it('first key should have 5 properties', () => {
    expect(data).toHaveLength(3);
    const keys = Object.keys(data[0]).sort();
    expect(keys).toEqual(['branches', 'file', 'functions', 'lines', 'title']);
  });

  it('should verify test titles', () => {
    expect(data[0].title).toBe('Test #1');
    expect(data[1].title).toBe('Test #2');
    expect(data[2].title).toBe('Test #3');
  });

  it('should verify test files', () => {
    expect(data[0].file).toBe('anim-base/anim-base-coverage.js');
    expect(data[1].file).toBe('anim-easing/anim-easing-coverage.js');
    expect(data[2].file).toBe('javascript/common.js');
  });

  it('should verify number of functions', () => {
    expect(data[0].functions.found).toBe(29);
    expect(data[0].functions.hit).toBe(23);
    expect(data[1].functions.found).toBe(17);
    expect(data[1].functions.hit).toBe(17);
    expect(data[2].functions.found).toBe(2);
    expect(data[2].functions.hit).toBe(2);
  });

  it('should verify number of branches', () => {
    expect(data[1].branches.found).toBe(23);
    expect(data[1].branches.hit).toBe(22);
    expect(data[1].branches.found).toBe(data[1].branches.details.length);
    expect(data[1].branches.details[data[1].branches.details.length - 1].taken).toBe(0);
    expect(data[2].branches.found).toBe(0);
    expect(data[2].branches.hit).toBe(0);
    expect(data[2].branches.details).toEqual([]);
  });

  it('should verify function details', () => {
    expect(data[0].functions.details.length).toBe(29);
    expect(data[1].functions.details.length).toBe(17);
    expect(data[2].functions.details.length).toBe(2);
    expect(data[0].functions.details[0]).toEqual({
      name: '(anonymous 1)',
      line: 7,
      hit: 6,
    });
    expect(data[0].functions.details[11]).toEqual({
      name: '_start',
      line: 475,
      hit: 231,
    });
    expect(data[0].functions.details[27]).toEqual({
      name: 'stop',
      line: 466,
      hit: 9,
    });
    expect(data[0].functions.details[28]).toEqual({
      name: 'stop',
      line: 389,
      hit: 0,
    });
    expect(data[1].functions.details[4]).toEqual({
      name: 'bounceBoth',
      line: 345,
      hit: 36,
    });
    expect(data[2].functions.details[1]).toEqual({
      name: 'javascript',
      line: 3,
      hit: 2,
    });
  });

  it('should verify number of lines', () => {
    expect(data[0].lines.found).toBe(181);
    expect(data[0].lines.hit).toBe(143);
    expect(data[1].lines.found).toBe(76);
    expect(data[1].lines.hit).toBe(70);
  });

  it('should verify line details', () => {
    expect(data[0].lines.details.length).toBe(181);
    expect(data[1].lines.details.length).toBe(76);
    expect(data[2].lines.details.length).toBe(6);
    expect(data[0].lines.details[0]).toEqual({ line: 7, hit: 6 });
    expect(data[0].lines.details[10]).toEqual({ line: 91, hit: 6 });
    expect(data[1].lines.details[20]).toEqual({ line: 157, hit: 32 });
    expect(data[1].lines.details[64]).toEqual({ line: 313, hit: 51 });
    expect(data[2].lines.details[2]).toEqual({ line: 3, hit: 19 });
  });
});

describe('complex file parsing', () => {
  it('should parse complex file without error', async () => {
    const complexFile = resolve(__dirname, 'fixtures/complex.txt');
    const content = await readFile(complexFile, 'utf-8');
    const data = parse(content, { warnOnUnknown: true }) || [];

    const appCoverage = ensureFile(data, 'src/app.ts');

    expectCoverage(appCoverage, {
      functions: { found: 4, hit: 2 },
      lines: { found: 34, hit: 26 },
      branches: { found: 6, hit: 1 },
    });

    const sbomRoutesCoverage = ensureFile(data, 'src/sbom/routes.ts');
    expectCoverage(sbomRoutesCoverage, {
      functions: { found: 8, hit: 6 },
      lines: { found: 28, hit: 24 },
      branches: { found: 4, hit: 3 },
    });

    const metricsRoutesCoverage = ensureFile(data, 'src/metrics/routes.ts');
    expectCoverage(metricsRoutesCoverage, {
      functions: { found: 17, hit: 14 },
      lines: { found: 108, hit: 94 },
      branches: { found: 75, hit: 56 },
    });
  });
});

function expectCoverage(
  actual: LcovFile,
  expected: {
    functions: { found: number; hit: number };
    lines: { found: number; hit: number };
    branches: { found: number; hit: number };
  }
) {
  expect(actual.functions.found).toBe(expected.functions.found);
  expect(actual.functions.hit).toBe(expected.functions.hit);
  expect(actual.lines.found).toBe(expected.lines.found);
  expect(actual.lines.hit).toBe(expected.lines.hit);
  expect(actual.branches.found).toBe(expected.branches.found);
  expect(actual.branches.hit).toBe(expected.branches.hit);
}

function ensureFile(data: LcovFile[], filename: string): LcovFile {
  const found = data.find(file => file.file === filename);
  if (!found) {
    throw new Error(`Ensured file does not exist in parsed lcov: ${filename}`);
  }
  return found;
}
