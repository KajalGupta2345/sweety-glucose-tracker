const { getRanges } = require('../src/utils/reportRanges');

describe('getRanges', () => {
  test('matches the example in the assignment (15 Oct 2026)', () => {
    const r = getRanges('2026-10-15');
    expect(r.daily).toEqual({ from: '2026-10-15', to: '2026-10-15' });
    expect(r.monthToDate).toEqual({ from: '2026-10-01', to: '2026-10-15' });
    expect(r.monthly).toEqual({ from: '2026-09-01', to: '2026-09-30' });
  });

  test('January uses December of the previous year', () => {
    const r = getRanges('2026-01-10');
    expect(r.monthly).toEqual({ from: '2025-12-01', to: '2025-12-31' });
  });

  test('handles a leap-year February', () => {
    const r = getRanges('2024-03-05');
    expect(r.monthly).toEqual({ from: '2024-02-01', to: '2024-02-29' });
  });

  test('handles a non-leap-year February', () => {
    const r = getRanges('2026-03-05');
    expect(r.monthly).toEqual({ from: '2026-02-01', to: '2026-02-28' });
  });

  test('first day of the month: month-to-date is a single day', () => {
    const r = getRanges('2026-11-01');
    expect(r.monthToDate).toEqual({ from: '2026-11-01', to: '2026-11-01' });
  });
});