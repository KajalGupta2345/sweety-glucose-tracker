import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { todayString } from '../constants';
import ReadingForm from '../components/ReadingForm';
import ReadingsList from '../components/ReadingsList';
import Reports from '../components/Reports';
import History from '../components/History';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [date, setDate] = useState(todayString());
  const [readings, setReadings] = useState([]);
  const [report, setReport] = useState(null);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const load = useCallback(async () => {
    try {
      const [list, rep] = await Promise.all([
        api(`/readings?date=${date}`),
        api(`/reports?date=${date}`),
      ]);
      setReadings(list.readings);
      setReport(rep);
      setError('');
    } catch (err) {
      if (err.message.includes('log in')) return logout();
      setError(err.message);
    }
  }, [date]);

  useEffect(() => { load(); }, [load]);

  const handleSaved = () => {
    setEditing(null);
    load();
  };

  const handleDelete = async (reading) => {
    if (!window.confirm('Delete this reading?')) return;
    try {
      await api(`/readings/${reading.id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Sweety</h1>
        <span>Hi, {user.name || 'there'}</span>
        <button className="secondary" onClick={logout}>Log out</button>
      </header>

      <div className="date-picker">
        <label>Date: </label>
        <input
          type="date"
          value={date}
          max={todayString()}
          onChange={(e) => { setDate(e.target.value); setEditing(null); }}
        />
      </div>

      {error && <p className="error">{error}</p>}

      <ReadingForm date={date} editing={editing} onSaved={handleSaved} onCancel={() => setEditing(null)} />

      <h2>Readings on {date}</h2>
      <ReadingsList readings={readings} onEdit={setEditing} onDelete={handleDelete} />

      <h2>Reports</h2>
      <Reports report={report} />
            <h2>All readings</h2>
      <History refreshKey={report} />
    </div>
  );
}