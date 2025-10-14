<script>
  import ChecklistItem from './ChecklistItem.svelte';
  export let items = [];
  let internal = items.map(item => ({ ...item }));
  let submitted = false;
  let checkedCount = 0;

  function handleChange(e) {
    const idx = internal.findIndex(i => i.id === e.detail.id);
    if (idx !== -1) internal[idx].done = e.detail.done;
  }

  function handleSubmit() {
    submitted = true;
    checkedCount = internal.filter(i => i.done).length;
  }

  $: total = internal.length;
  $: percent = total ? Math.round((checkedCount / total) * 100) : 0;
</script>

<div>
  {#each internal as item (item.id)}
    <ChecklistItem {...item} on:change={handleChange} />
  {/each}
  <button on:click={handleSubmit} data-testid="submit">Submit version</button>
  <p data-testid="progress">{submitted ? `${checkedCount}/${total} (${percent}%)` : `0/${total} (0%)`}</p>
</div>