const pad = (n) => String(n).padStart(2, '0');

function getRanges(dateStr) {
  const [y, m] = dateStr.split('-').map(Number);

  const prevYear = m === 1 ? y - 1 : y;
  const prevMonth = m === 1 ? 12 : m - 1;
  const prevLastDay = new Date(prevYear, prevMonth, 0).getDate();

  return {
    daily: { from: dateStr, to: dateStr },
    monthToDate: { from: `${y}-${pad(m)}-01`, to: dateStr },
    monthly: {
      from: `${prevYear}-${pad(prevMonth)}-01`,
      to: `${prevYear}-${pad(prevMonth)}-${pad(prevLastDay)}`,
    },
  };
}

module.exports = { getRanges };