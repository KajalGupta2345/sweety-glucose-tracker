export const SLOTS = [
  { value: 'morning', label: 'Morning (fasting)' },
  { value: 'after_breakfast', label: 'After breakfast' },
  { value: 'after_lunch', label: 'After lunch' },
  { value: 'after_dinner', label: 'After dinner' },
];

export const slotLabel = (value) => SLOTS.find((s) => s.value === value)?.label || value;

export const todayString = () => new Date().toLocaleDateString('en-CA');