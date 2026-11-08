
/**
 * TABLE VIEW
 * Display data in rows - good for scanning specific information
 */

function orNotListed(value) {
  return value === '------' || value === 'N/A' || value === undefined ? 'Not listed' : value;
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function showTable(data) {
  const rows = Array.isArray(data) ? data : [];

  if (rows.length === 0) {
    return `
      <h2 class="view-title">📊 Table View</h2>
      <p>No inspection records to display.</p>
    `;
  }

  const body = rows
    .map(
      (r) => `
        <tr>
          <td>${orNotListed(r.name)}</td>
          <td>${orNotListed(r.category)}</td>
          <td>${orNotListed(r.city)}</td>
          <td>${formatDate(r.inspection_date)}</td>
          <td>${orNotListed(r.inspection_results)}</td>
          <td>${orNotListed(r.inspection_type)}</td>
        </tr>`
    )
    .join("");

  return `
    <h2 class="view-title">📊 Table View</h2>
    <div style="overflow-x:auto;"> 
      <table class="data-table">
        <caption>
          Restaurant Inspections: name, category, city, date, inspection results, and inspection type (${rows.length} records)
        </caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Category</th>
            <th scope="col">City</th>
            <th scope="col">Inspection Date</th>
            <th scope="col">Inspection Results</th>
            <th scope="col">Inspection Type</th>
          </tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
    </div>
    <style>
      .data-table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
      .data-table caption { text-align: left; font-weight: 600; padding: 0.5rem 0; }
      .data-table th, .data-table td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #ddd; text-align: left; }
      .data-table thead th { background: #f4f4f4; }
      .data-table tbody tr:nth-child(even) { background: #fafafa; }
    </style>
  `;
}

export default showTable;