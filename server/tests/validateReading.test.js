const { validateReading, withArticle } = require('../src/utils/validateReading');

const today = new Date().toLocaleDateString('en-CA');
const valid = { date: today, slot: 'morning', value: 110 };

describe('validateReading', () => {
  test('accepts a valid reading', () => {
    expect(validateReading(valid)).toBeNull();
  });

  test('requires a value', () => {
    expect(validateReading({ ...valid, value: '' })).toBe('Please enter a glucose value.');
    expect(validateReading({ ...valid, value: undefined })).toBe('Please enter a glucose value.');
  });

  test('rejects values outside 40-600', () => {
    expect(validateReading({ ...valid, value: 39 })).toBe('Value must be between 40 and 600 mg/dl.');
    expect(validateReading({ ...valid, value: 601 })).toBe('Value must be between 40 and 600 mg/dl.');
  });

  test('accepts boundary values 40 and 600', () => {
    expect(validateReading({ ...valid, value: 40 })).toBeNull();
    expect(validateReading({ ...valid, value: 600 })).toBeNull();
  });

  test('rejects decimals and non-numbers', () => {
    expect(validateReading({ ...valid, value: 110.5 })).toBe('Value must be between 40 and 600 mg/dl.');
    expect(validateReading({ ...valid, value: 'abc' })).toBe('Value must be between 40 and 600 mg/dl.');
  });

  test('rejects an invalid slot', () => {
    expect(validateReading({ ...valid, slot: 'midnight' })).toBe('Please choose a valid time slot.');
  });

  test('rejects a future date', () => {
    expect(validateReading({ ...valid, date: '2999-01-01' })).toBe('Date cannot be in the future.');
  });

  test('rejects a badly formatted date', () => {
    expect(validateReading({ ...valid, date: '20-11-2026' })).toBe('Please enter a valid date.');
  });
});

describe('withArticle', () => {
  test('uses "an" before vowels and "a" otherwise', () => {
    expect(withArticle('After lunch')).toBe('an After lunch');
    expect(withArticle('Morning (fasting)')).toBe('a Morning (fasting)');
  });
});