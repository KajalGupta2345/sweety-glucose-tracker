import { useState, useEffect } from 'react';
import { api } from '../api';
import { slotLabel } from '../constants';

const PAGE_SIZE = 10;

export default function History({ refreshKey }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ readings: [], pagination: null });
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/readings?page=${page}&limit=${PAGE_SIZE}`)
      .then((res) => { setData(res); setError(''); })
      .catch((err) => setError(err.message));
  }, [page, refreshKey]);

  const { readings, pagination } = data;

  return (
    <div>
      {error && <p className="error">{error}</p>}
      {readings.length === 0 ? (
        <p className="empty">No readings yet.</p>
      ) : (
        <ul className="readings">
          {readings.map((r) => (
            <li key={r.id}>
              <span>{r.date}</span>
              <span className="slot">{slotLabel(r.slot)}</span>
              <strong>{r.value} mg/dl</strong>
            </li>
          ))}
        </ul>
      )}
      {pagination && pagination.totalPages > 1 && (
        <div className="pager">
          <button className="secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {pagination.page} of {pagination.totalPages}</span>
          <button className="secondary" disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}