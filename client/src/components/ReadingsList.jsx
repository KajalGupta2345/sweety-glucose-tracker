import { slotLabel } from '../constants';

export default function ReadingsList({ readings, onEdit, onDelete }) {
  if (readings.length === 0) {
    return <p className="empty">No readings for this date yet. Add your first one above.</p>;
  }
  return (
    <ul className="readings">
      {readings.map((r) => (
        <li key={r.id}>
          <span className="slot">{slotLabel(r.slot)}</span>
          <strong>{r.value} mg/dl</strong>
          <span className="actions">
            <button className="secondary" onClick={() => onEdit(r)}>Edit</button>
            <button className="danger" onClick={() => onDelete(r)}>Delete</button>
          </span>
        </li>
      ))}
    </ul>
  );
}