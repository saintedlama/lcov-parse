import { describe, test, expect, beforeAll } from 'vitest';
import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { parse } from './index';
import type { LcovFile } from './index';

describe('module interface', () => {
  test('should export a function', () => {
    expect(parse).toBeDefined();
    expect(typeof parse).toBe('function');
  });

  test('should handle bad file passing', () => {
    const files = parse('foobar');
    expect(files).toBeUndefined();
  });

  test('should parse as a string', () => {
    const data = parse('TN:TestName\nSF:foobar.js\nend_of_record\n');
    expect(Array.isArray(data)).toBe(true);
    expect(data?.[0]?.title).toBe('TestName');
    expect(data?.[0]?.file).toBe('foobar.js');
  });
});

describe('test file parsing', () => {
  let data: LcovFile[] | [];

  beforeAll(async () => {
    const yuiFile = resolve(__dirname, 'fixtures/parts.info');

    const content = await readFile(yuiFile, 'utf-8');
    data = parse(content) || [];
  });

  test('should return an array', () => {
    expect(Array.isArray(data)).toBe(true);
  });

  test('should contain 3 keys', () => {
    expect(data.length).toBe(3);
  });

  test('first key should have 5 properties', () => {
    expect(data).toHaveLength(3);
    const keys = Object.keys(data[0]).sort();
    expect(keys).toEqual(['branches', 'file', 'functions', 'lines', 'title']);
  });

  test('should verify test titles', () => {
    expect(data[0].title).toBe('Test #1');
    expect(data[1].title).toBe('Test #2');
    expect(data[2].title).toBe('Test #3');
  });

  test('should verify test files', () => {
    expect(data[0].file).toBe('anim-base/anim-base-coverage.js');
    expect(data[1].file).toBe('anim-easing/anim-easing-coverage.js');
    expect(data[2].file).toBe('javascript/common.js');
  });

  test('should verify number of functions', () => {
    expect(data[0].functions.found).toBe(29);
    expect(data[0].functions.hit).toBe(23);
    expect(data[1].functions.found).toBe(17);
    expect(data[1].functions.hit).toBe(17);
    expect(data[2].functions.found).toBe(2);
    expect(data[2].functions.hit).toBe(2);
  });

  test('should verify number of branches', () => {
    expect(data[1].branches.found).toBe(23);
    expect(data[1].branches.hit).toBe(22);
    expect(data[1].branches.found).toBe(data[1].branches.details.length);
    expect(data[1].branches.details[data[1].branches.details.length - 1].taken).toBe(0);
    expect(data[2].branches.found).toBe(0);
    expect(data[2].branches.hit).toBe(0);
    expect(data[2].branches.details).toEqual([]);
  });

  test('should verify function details', () => {
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

  test('should verify number of lines', () => {
    expect(data[0].lines.found).toBe(181);
    expect(data[0].lines.hit).toBe(143);
    expect(data[1].lines.found).toBe(76);
    expect(data[1].lines.hit).toBe(70);
  });

  test('should verify line details', () => {
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
