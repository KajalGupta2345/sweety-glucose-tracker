const SLOTS = {
  morning: 'Morning (fasting)',
  after_breakfast: 'After breakfast',
  after_lunch: 'After lunch',
  after_dinner: 'After dinner',
};

function todayString() {
  return new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
}

function validateReading({ date, slot, value }) {
  if (value === undefined || value === null || String(value).trim() === '') {
    return 'Please enter a glucose value.';
  }
  const num = Number(value);
  if (!Number.isInteger(num) || num < 40 || num > 600) {
    return 'Value must be between 40 and 600 mg/dl.';
  }
  if (!slot || !SLOTS[slot]) {
    return 'Please choose a valid time slot.';
  }
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(new Date(date))) {
    return 'Please enter a valid date.';
  }
  if (date > todayString()) {
    return 'Date cannot be in the future.';
  }
  return null;
}
function withArticle(label) {
  return /^[aeiou]/i.test(label) ? `an ${label}` : `a ${label}`;
}

module.exports = { SLOTS, validateReading,withArticle };