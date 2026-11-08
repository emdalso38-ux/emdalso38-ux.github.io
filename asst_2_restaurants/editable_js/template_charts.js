/**
 * CHARTS VIEW - STUDENTS IMPLEMENT
 * Show patterns in your data as charts, using Chart.js
 *
 * This view has two parts:
 *   showCharts(data) returns the HTML: one <canvas> per chart, with a text alternative under each
 *   drawCharts(data) runs after that HTML is on the page, and draws a chart into each <canvas>
 *
 * Chart.js docs: https://www.chartjs.org/docs/latest/getting-started/
 */
const MISSING = new Set(["", "------", "N/A"]);

function display(value) {
  if (value === undefined || value === null) return "Not listed";
  const text = String(value).trim();
  return MISSING.has(text) ? "Not listed" : text;
}

function countBy(rows, field) {
  const counts = {};
  rows.forEach((r) => {
    const key = display(r[field]);
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

function sortedEntries(counts) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

const TOP_N = 10;

function showCharts(data) {
  const rows = Array.isArray(data) ? data : [];

  if (rows.length === 0) {
    return `
      <h2 class="view-title">📈 Charts View</h2>
      <p>No inspection records to display.</p>
    `;
  }
  const categoryEntries = sortedEntries(countBy(rows, "category"));
  const topCategories = categoryEntries.slice(0, TOP_N);
  const [topCatName, topCatCount] = topCategories[0];

  const resultEntries = sortedEntries(countBy(rows, "inspection_results"));
  const [topResultName, topResultCount] = resultEntries[0];

  const barSummary =
    `Bar chart of the ${topCategories.length} business categories with the most inspections, out of ${categoryEntries.length} categories in total. ` +
    `"${topCatName}" has the most, with ${topCatCount} of ${rows.length} inspections.`;

  const doughnutSummary =
    `Doughnut chart of inspection results across all ${rows.length} inspections, split into ${resultEntries.length} result types. ` +
    `"${topResultName}" is the most common, with ${topResultCount} inspections ` +
    `(${Math.round((topResultCount / rows.length) * 100)}%).`;

  /*html*/
  return `
    <h2 class="view-title">📈 Charts View</h2>
    <p class="view-description">Patterns in the data from a pie and bar chart view (${rows.length} inspections)</p>
    <div class="charts-grid">
      <figure class="chart-figure">
        <canvas id="chart-one" role="img" aria-label="${barSummary}"></canvas>
        <figcaption class="chart-summary">${barSummary}</figcaption>
      </figure>
      <figure class="chart-figure">
        <canvas id="chart-two" role="img" aria-label="${doughnutSummary}"></canvas>
        <figcaption class="chart-summary">${doughnutSummary}</figcaption>
      </figure>
    </div>
  `;
}

function drawCharts(data) {
  // Chart.js is loaded by a <script> tag in index.html. If it didn't load, say so instead of breaking.
  if (typeof Chart === 'undefined') {
    document.querySelector('.charts-grid').innerHTML =
      '<p class="error">Chart.js did not load, so the charts can\'t be drawn. Check the &lt;script&gt; tag in index.html.</p>';
    return;
  }

  const rows = Array.isArray(data) ? data : [];
  if (rows.length === 0) return;

  //Chart 1: bar chart of inspections by business category
  const topCategories = sortedEntries(countBy(rows, "category")).slice(0, TOP_N);
  const barLabels = topCategories.map(([label]) => label);
  const barNumbers = topCategories.map(([, count]) => count);

  const canvasOne = document.querySelector('#chart-one');
  if (canvasOne) {
    Chart.getChart(canvasOne)?.destroy(); // avoid "canvas already in use" if redrawn
    new Chart(canvasOne, {
      type: 'bar',
      data: {
        labels: barLabels,
        datasets: [
          {
            label: 'Number of inspections',
            data: barNumbers,
            backgroundColor: '#3b1e08',
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: `Inspections by type of business (top ${topCategories.length})`,
          },
          legend: { display: false },
        },
        scales: {
          x: { title: { display: true, text: 'Type of business' } },
          y: {
            title: { display: true, text: 'Inspections' },
            beginAtZero: true,
            ticks: { precision: 0 },
          },
        },
      },
    });
  }

  //Chart 2: doughnut chart of inspection results 
  const resultEntries = sortedEntries(countBy(rows, "inspection_results"));
  const doughnutLabels = resultEntries.map(([label]) => label);
  const doughnutNumbers = resultEntries.map(([, count]) => count);

  const palette = [
    '#3b1e08', '#ffd24d', '#d9534f', '#5cb85c',
    '#8e5ea2', '#ff8c42', '#3cb4c4', '#9e9e9e',
    '#c2185b', '#6d4c41',
  ];

  const canvasTwo = document.querySelector('#chart-two');
  if (canvasTwo) {
    Chart.getChart(canvasTwo)?.destroy();
    new Chart(canvasTwo, {
      type: 'doughnut',
      data: {
        labels: doughnutLabels,
        datasets: [
          {
            label: 'Inspections',
            data: doughnutNumbers,
            backgroundColor: doughnutLabels.map((_, i) => palette[i % palette.length]),
          },
        ],
      },
      options: {
        plugins: {
          title: { display: true, text: 'Inspection results' },
          legend: { position: 'right' },
        },
      },
    });
  }
}

export { showCharts, drawCharts };