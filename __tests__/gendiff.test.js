import { fileURLToPath } from 'url';
import path from 'path';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

test('flat JSON files', () => {
  const file1 = getFixturePath('file1flat.json');
  const file2 = getFixturePath('file2flat.json');
  const expected = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;
  expect(genDiff(file1, file2)).toEqual(expected);
});

test('flat YAML files', () => {
  const file1 = getFixturePath('file1flat.yml');
  const file2 = getFixturePath('file2flat.yml');
  const expected = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;
  expect(genDiff(file1, file2)).toEqual(expected);
});

test('nested JSON files', () => {
  const file1 = getFixturePath('file1.json');
  const file2 = getFixturePath('file2.json');
  const result = genDiff(file1, file2);
  expect(result).toContain('common');
  expect(result).toContain('group1');
  expect(result).toContain('+ follow: false');
  expect(result).toContain('- setting2: 200');
});

test('plain format', () => {
  const file1 = getFixturePath('file1.json');
  const file2 = getFixturePath('file2.json');
  const result = genDiff(file1, file2, 'plain');

  expect(result).toContain("Property 'common.follow' was added with value: false");
  expect(result).toContain("Property 'common.setting2' was removed");
  expect(result).toContain("Property 'common.setting3' was updated. From true to null");
});

test('stylish format by default', () => {
  const file1 = getFixturePath('file1.json');
  const file2 = getFixturePath('file2.json');
  const result = genDiff(file1, file2);
  expect(result).toContain('common');
  expect(result).toContain('{');
});

test('json format', () => {
  const file1 = getFixturePath('file1.json');
  const file2 = getFixturePath('file2.json');
  const result = genDiff(file1, file2, 'json');

  const parsedResult = JSON.parse(result);
  expect(Array.isArray(parsedResult)).toBe(true);
  expect(parsedResult[0]).toHaveProperty('key');
  expect(parsedResult[0]).toHaveProperty('type');
});

test('all formats work correctly', () => {
  const file1 = getFixturePath('file1.json');
  const file2 = getFixturePath('file2.json');

  const stylishResult = genDiff(file1, file2, 'stylish');
  const plainResult = genDiff(file1, file2, 'plain');
  const jsonResult = genDiff(file1, file2, 'json');

  expect(typeof stylishResult).toBe('string');
  expect(typeof plainResult).toBe('string');
  expect(typeof jsonResult).toBe('string');

  expect(stylishResult).toContain('{');
  expect(plainResult).toContain('Property');
  expect(() => JSON.parse(jsonResult)).not.toThrow();
});
