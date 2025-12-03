<script>
  // Shared date range for all tasks
  export let startDate; // "YYYY-MM-DD"
  export let dueDate;   // "YYYY-MM-DD"

  // Each task:
  // {
  //   title: string,
  //   subtasksNum?: number,
  //   subtasks: [{ completedDate: "YYYY-MM-DD" | null }]
  // }
  export let tasks = [];

  const colors = ['#3178c6', '#e67e22', '#9b59b6', '#16a085'];

  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const toDate = (str) => new Date(str);
  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const toISODate = (d) => d.toISOString().slice(0, 10);
  const formatLabel = (d) =>
    d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  // Overall date range
  $: start = toDate(startDate);
  $: end = toDate(dueDate);

  $: dateRange = (() => {
    const out = [];
    const d = new Date(start);
    while (d <= end) {
      out.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return out;
  })();

  // Build ideal + actual series for a single task
  function buildSeries(task) {
    const subtasksArr = task.subtasks || [];
    const subtasksNum = task.subtasksNum ?? subtasksArr.length;

    if (!dateRange.length) {
      return {
        subtasksNum,
        ideal: [],
        actual: [],
        completedCount: subtasksArr.filter((s) => s.completedDate).length
      };
    }

    // Ideal: straight line
    let ideal = [];
    if (dateRange.length === 1) {
      ideal = [subtasksNum];
    } else {
      const n = dateRange.length - 1;
      ideal = dateRange.map((_, i) => {
        const fraction = i / n;
        return subtasksNum * (1 - fraction);
      });
    }

    // Actual: step down on completion days
    const counts = new Map();
    for (const s of subtasksArr) {
      if (!s.completedDate) continue;
      const key = s.completedDate;
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    const actual = [];
    let remaining = subtasksNum;
    for (const day of dateRange) {
      const key = toISODate(day);
      const doneToday = counts.get(key) || 0;
      remaining = Math.max(0, remaining - doneToday);
      actual.push(remaining);
    }

    return {
      subtasksNum,
      ideal,
      actual,
      completedCount: subtasksArr.filter((s) => s.completedDate).length
    };
  }

  // Series for all tasks
  $: taskSeries = tasks.map(buildSeries);

  // Max subtasks across tasks for y-axis scaling
  $: maxSubtasks = Math.max(
    1,
    ...taskSeries.map((s) => s.subtasksNum || 0),
  );

  // Which tasks are visible (toggle via legend)
  let active = [];

  $: active = tasks.map((_, i) => (active[i] ?? true));

  function toggleTask(i) {
    active = active.map((on, idx) => (idx === i ? !on : on));
  }

  // "Today" index in the range
  $: todayIndex = (() => {
    const today = new Date();
    if (!dateRange.length) return 0;
    if (today <= start) return 0;
    if (today >= end) return dateRange.length - 1;

    const idx = dateRange.findIndex((d) => sameDay(d, today));
    return idx === -1 ? dateRange.length - 1 : idx;
  })();

  // Status summaries per task
  $: summaries = tasks.map((task, i) => {
    const s = taskSeries[i] || {
      subtasksNum: 0,
      ideal: [],
      actual: [],
      completedCount: 0
    };

    const total = s.subtasksNum || 0;
    const completed = s.completedCount || 0;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    const idealToday = s.ideal[todayIndex] ?? total;
    const actualToday = s.actual[todayIndex] ?? total;

    let status;
    if (actualToday > idealToday) status = 'Behind pace';
    else if (actualToday < idealToday) status = 'Ahead of pace';
    else status = 'On pace';

    return { title: task.title, total, completed, percent, status };
  });

  // Simple SVG layout
  const width = 640;
  const height = 320;
  const padding = 40;

  const xForIndex = (i) => {
    if (!dateRange.length) return width / 2;
    if (dateRange.length === 1) return width / 2;
    const inner = width - padding * 2;
    const step = inner / (dateRange.length - 1);
    return padding + step * i;
  };

  const yForRemaining = (remaining) => {
    const max = maxSubtasks || 1;
    const inner = height - padding * 2;
    const fraction = remaining / max;
    return padding + inner * (1 - fraction);
  };

  const buildPoints = (series) =>
    series.map((v, i) => `${xForIndex(i)},${yForRemaining(v)}`).join(' ');

  // x-axis ticks (start / mid / end if long)
  $: xTicks = (() => {
    if (!dateRange.length) return [];
    if (dateRange.length <= 7) {
      return dateRange.map((d, i) => ({ i, label: formatLabel(d) }));
    }
    const mid = Math.floor(dateRange.length / 2);
    return [
      { i: 0, label: formatLabel(dateRange[0]) },
      { i: mid, label: formatLabel(dateRange[mid]) },
      {
        i: dateRange.length - 1,
        label: formatLabel(dateRange[dateRange.length - 1])
      }
    ];
  })();
</script>

<div class="burndown">
  <div class="header-row">
    <h2>Study burndown</h2>
    <p class="dates">
      {startDate} → {dueDate}
    </p>
  </div>

  <!-- Legend / toggles -->
  <div class="legend">
    {#each tasks as task, i}
      <button
        type="button"
        class:off={!active[i]}
        on:click={() => toggleTask(i)}
      >
        <span
          class="swatch"
          style={`background:${colors[i % colors.length]}`}
        ></span>
        <span class="label">{task.title}</span>
      </button>
    {/each}
  </div>

  <svg
    viewBox={`0 0 ${width} ${height}`}
    role="img"
    aria-label="Study burndown for multiple tasks"
  >
    <!-- Axes -->
    <line
      x1={padding}
      y1={padding}
      x2={padding}
      y2={height - padding}
      stroke="#ccc"
      stroke-width="1"
    />
    <line
      x1={padding}
      y1={height - padding}
      x2={width - padding}
      y2={height - padding}
      stroke="#ccc"
      stroke-width="1"
    />

    <!-- Lines per task -->
    {#each tasks as task, i}
      {#if active[i]}
        <!-- Ideal for this task (dashed, light) -->
        <polyline
          points={buildPoints(taskSeries[i]?.ideal || [])}
          fill="none"
          stroke="#bbbbbb"
          stroke-width="1.5"
          stroke-dasharray="4 4"
        />
        <!-- Actual for this task (solid, colored) -->
        <polyline
          points={buildPoints(taskSeries[i]?.actual || [])}
          fill="none"
          stroke={colors[i % colors.length]}
          stroke-width="3"
        />
      {/if}
    {/each}

    <!-- Axis labels -->
    <text
      x={width / 2}
      y={height - 6}
      text-anchor="middle"
      font-size="12"
      fill="#555"
    >
      Days (start → due)
    </text>

    <text
      x="14"
      y={height / 2}
      text-anchor="middle"
      font-size="12"
      fill="#555"
      transform={`rotate(-90 14 ${height / 2})`}
    >
      Subtasks remaining
    </text>

    <!-- x-ticks -->
    {#each xTicks as tick}
      <line
        x1={xForIndex(tick.i)}
        y1={height - padding}
        x2={xForIndex(tick.i)}
        y2={height - padding + 5}
        stroke="#999"
        stroke-width="1"
      />
      <text
        x={xForIndex(tick.i)}
        y={height - padding + 18}
        text-anchor="middle"
        font-size="10"
        fill="#555"
      >
        {tick.label}
      </text>
    {/each}
  </svg>

  <div class="summary">
    {#each summaries as s, i}
      <div class="summary-item" class:dim={!active[i]}>
        <div class="summary-title">
          <span
            class="dot"
            style={`background:${colors[i % colors.length]}`}
          ></span>
          {s.title}
        </div>
        <div class="summary-text">
          {s.completed} / {s.total} subtasks · {s.percent}% ·
          <strong>{s.status}</strong>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .burndown {
    max-width: 780px;
    margin: 1.5rem auto;
    padding: 1rem;
    border-radius: 0.75rem;
    border: 1px solid #e2e2e2;
    background: #fafafa;
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  h2 {
    margin: 0;
    font-size: 1.1rem;
  }

  .dates {
    margin: 0;
    font-size: 0.8rem;
    color: #555;
  }

  svg {
    width: 100%;
    display: block;
    margin-top: 0.5rem;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.25rem;
  }

  .legend button {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    border: 1px solid #ddd;
    background: #fff;
    font-size: 0.8rem;
    cursor: pointer;
  }

  .legend button.off {
    opacity: 0.4;
  }

  .swatch {
    width: 10px;
    height: 10px;
    border-radius: 999px;
  }

  .summary {
    margin-top: 0.75rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.5rem;
    font-size: 0.85rem;
  }

  .summary-item.dim {
    opacity: 0.4;
  }

  .summary-title {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-weight: 600;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
  }

  .summary-text {
    margin-top: 0.1rem;
  }
</style>
