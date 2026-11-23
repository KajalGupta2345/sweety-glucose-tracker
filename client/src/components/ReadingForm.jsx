import { useState, useEffect } from 'react';
import { api } from '../api';
import { SLOTS } from '../constants';

export default function ReadingForm({ date, editing, onSaved, onCancel }) {
  const [slot, setSlot] = useState('morning');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) {
      setSlot(editing.slot);
      setValue(String(editing.value));
    } else {
      setSlot('morning');
      setValue('');
    }
    setError('');
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const body = { date, slot, value };
      if (editing) {
        await api(`/readings/${editing.id}`, { method: 'PUT', body });
      } else {
        await api('/readings', { method: 'POST', body });
      }
      setValue('');
      onSaved();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card reading-form" onSubmit={handleSubmit}>
      <h3>{editing ? 'Edit reading' : `Add reading for ${date}`}</h3>
      <select value={slot} onChange={(e) => setSlot(e.target.value)}>
        {SLOTS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <input
        type="text"
        inputMode="numeric"
        placeholder="Glucose value (mg/dl)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
      <div className="row">
        <button type="submit">{editing ? 'Update' : 'Add reading'}</button>
        {editing && <button type="button" className="secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}