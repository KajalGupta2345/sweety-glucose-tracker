const { parsePagination } = require('../src/utils/pagination');

describe('parsePagination', () => {
  test('uses defaults when nothing is given', () => {
    expect(parsePagination({})).toEqual({ page: 1, limit: 20, offset: 0 });
  });

  test('calculates the offset', () => {
    expect(parsePagination({ page: '3', limit: '10' })).toEqual({ page: 3, limit: 10, offset: 20 });
  });

  test('falls back to defaults for invalid values', () => {
    expect(parsePagination({ page: '0', limit: '-5' })).toEqual({ page: 1, limit: 20, offset: 0 });
    expect(parsePagination({ page: 'abc', limit: 'xyz' })).toEqual({ page: 1, limit: 20, offset: 0 });
  });

  test('caps the limit at 100', () => {
    expect(parsePagination({ limit: '500' }).limit).toBe(100);
  });
});