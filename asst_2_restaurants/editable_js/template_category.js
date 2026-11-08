/**
 * CATEGORY VIEW - STUDENTS IMPLEMENT
 * Group data by categories
 */

function orNotListed(value) {
  return value === '------' || value === 'N/A' || value === undefined ? 'Not listed' : value;
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const COMPLIANCE_FIELDS = [
  "food_from_approved_source",
  "food_protected_from",
  "ill_workers_restricted",
  "proper_hand_washing",
  "cooling_time_and_temperature",
  "cold_holding_temperature",
  "hot_holding_temperature",
  "cooking_time_and_temperature",
  "reheating_time_and_temperature",
  "hot_and_cold_running_water",
  "proper_sewage_disposal",
  "no_bare_hand_contact",
  "adequate_hand_washing",
  "rodent_and_insects",
  "food_contact_surfaces_and",
];



function countViolations(record) {
  return COMPLIANCE_FIELDS.filter((f) => record[f] === "Out of Compliance").length;
}

// Build an array of groups: { name, items, count, avgViolations }
function groupByCategory(rows) {
  const map = new Map();

  rows.forEach((r) => {
    const name = orNotListed(r.category);
    if (!map.has(name)) map.set(name, []);
    map.get(name).push(r);
  });

  return [...map.entries()]
    .map(([name, items]) => {
      const total = items.reduce((sum, r) => sum + countViolations(r), 0);
      return {
        name,
        // Newest inspections first within each group
        items: [...items].sort(
          (a, b) => new Date(b.inspection_date) - new Date(a.inspection_date)
        ),
        count: items.length,
        avgViolations: total / items.length,
      };
    })
    // Biggest groups first
    .sort((a, b) => b.count - a.count);
}

function showCategories(data) {
  const rows = Array.isArray(data) ? data : [];

  if (rows.length === 0) {
    return `
      <h2 class="view-title">📂 Category View</h2>
      <p>No inspection records to display.</p>
    `;
  }

  const groups = groupByCategory(rows);

  // Used to scale the comparison bars
  const maxAvg = Math.max(...groups.map((g) => g.avgViolations), 0.01);

  const groupsHTML = groups
    .map((g) => {
      const barWidth = Math.round((g.avgViolations / maxAvg) * 100);

      const itemsHTML = g.items
        .map((r) => {
          const violations = countViolations(r);
          return `
            <li class="cat-item">
              <span class="cat-item-name">${orNotListed(r.name)}</span>
              <span class="cat-item-detail">
                ${orNotListed(r.city)} · ${formatDate(r.inspection_date)}
                · ${orNotListed(r.inspection_results)}
                · ${violations} out of compliance
              </span>
            </li>`;
        })
        .join("");

      return `
        <section class="cat-group">
          <header class="cat-header">
            <h3 class="cat-name">${g.name}</h3>
            <div class="cat-stats">
              <span class="cat-count">${g.count} ${g.count === 1 ? "record" : "records"}</span>
              <span class="cat-avg">Avg. ${g.avgViolations.toFixed(2)} out of compliance</span>
            </div>
            <div class="cat-bar" aria-hidden="true">
              <div class="cat-bar-fill" style="width:${barWidth}%"></div>
            </div>
          </header>
          <ul class="cat-items">${itemsHTML}</ul>
        </section>`;
    })
    .join("");

  return `
    <h2 class="view-title">📂 Category View</h2>
    <p class="cat-intro">
      ${rows.length} inspections grouped into ${groups.length} business categories.
      Groups are sorted by size; the bar shows each group's average number of
      failed compliance checks (out of ${COMPLIANCE_FIELDS.length}) relative to the highest group.
    </p>
    <div class="cat-groups">${groupsHTML}</div>
    <style>
      .cat-intro { margin-bottom: 1rem; }
      .cat-groups { display: grid; gap: 1.25rem; }
      .cat-group { border: 2px solid #3b1e08; border-radius: 8px; overflow: hidden; background: #fff; }
      .cat-header { background: #3b1e08; color: #fff; padding: 0.75rem 1rem; }
      .cat-name { margin: 0 0 0.25rem; font-size: 1.15rem; }
      .cat-stats { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; font-size: 0.9rem; font-weight: 600; }
      .cat-items { list-style: none; margin: 0; padding: 0; }
      .cat-item { padding: 0.5rem 1rem; border-top: 1px solid #e3e3e3; font-size: 0.9rem; }
      .cat-item-name { display: block; font-weight: 600; }
      .cat-item-detail { display: block; color: #555; }
    </style>
  `;
}

export default showCategories;

  // Requirements:
  // - Group data by one meaningful field (category, city, inspection result, etc.)
  // - Show how many records are in each group, plus one other number per group
  //   (an average, a highest, a lowest)
  // - Show items within each group
  // - Make the groups easy to compare, and visually distinct from their items
  /*html*/