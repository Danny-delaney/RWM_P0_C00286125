<script>
  import ChecklistItem from './ChecklistItem.svelte';

  export let items = [];

  // Internal, mutable working copy of the checklist
  let internal = items.map(item => ({ ...item }));

  // For determinism: track the last items reference to detect real parent changes.
  let lastItemsRef = items;

  // Gate visible progress behind submit action
  let submitted = false;

  // Computed only on submit
  let checkedCount = 0;

  function handleChange(e) {
    const idx = internal.findIndex(i => i.id === e.detail.id);
    if (idx !== -1) internal[idx].done = e.detail.done;
  }

  function handleSubmit() {
    // Recompute every time we submit (allows repeat submissions after changes)
    checkedCount = internal.filter(i => i.done).length;
    submitted = true;
  }

  // Determinism: if parent provides a new items array (different reference),
  // reset internal state so same inputs lead to same outputs.
  $: if (items !== lastItemsRef) {
    internal = items.map(i => ({ ...i }));
    submitted = false;
    checkedCount = 0;
    lastItemsRef = items;
  }

  // Derived
  $: total = internal.length;
  $: percent = total ? Math.round((checkedCount / total) * 100) : 0;

  // Optional: a single string for the label (helps tests stay consistent)
  $: progressLabel = submitted ? `${checkedCount}/${total} (${percent}%)` : `0/${total} (0%)`;
</script>

<div>
  {#each internal as item (item.id)}
    <ChecklistItem {...item} on:change={handleChange} />
  {/each}

  <button on:click={handleSubmit} data-testid="submit">Submit version</button>

  <p data-testid="progress">{progressLabel}</p>
</div>
