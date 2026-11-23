function formatRange(from, to) {
  return from === to ? from : `${from} to ${to}`;
}

function ReportCard({ title, report }) {
  return (
    <div className="card report">
      <h3>{title}</h3>
      <small>{formatRange(report.from, report.to)}</small>
      {report.count === 0 ? (
        <p className="empty">No readings in this period.</p>
      ) : (
        <div className="stats">
          <div><span>Highest</span><strong>{report.highest}</strong></div>
          <div><span>Lowest</span><strong>{report.lowest}</strong></div>
          <div><span>Average</span><strong>{report.average}</strong></div>
          <div><span>Readings</span><strong>{report.count}</strong></div>
        </div>
      )}
    </div>
  );
}

export default function Reports({ report }) {
  if (!report) return null;
  return (
    <div className="reports">
      <ReportCard title="Daily" report={report.daily} />
      <ReportCard title="Month-to-date" report={report.monthToDate} />
      <ReportCard title="Previous month" report={report.monthly} />
    </div>
  );
}