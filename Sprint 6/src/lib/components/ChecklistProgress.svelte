<script lang="ts">
  import ChecklistItem from './ChecklistItem.svelte';
  import { get } from 'svelte/store';
  import { itemsStore, completedStore, percentStore, type Item } from '../stores';

  // Submit-gated snapshot values (shown in the UI label)
  let submitted = false;
  let submittedCompleted = 0;
  let submittedTotal = 0;
  let submittedPercent = 0;

  // Live subscriptions for rendering the list and computing totals
  $: items = $itemsStore as Item[];
  $: liveTotal = items.length;

  function handleChange(e: CustomEvent<{ id: number; done: boolean }>) {
    const { id, done } = e.detail;
    itemsStore.update((arr) => {
      const idx = arr.findIndex((i) => i.id === id);
      if (idx === -1) return arr;
      const copy = [...arr];
      copy[idx] = { ...copy[idx], done };
      return copy;
    });
  }

  function handleSubmit() {
    // Snapshot current derived values for the visible label
    submittedCompleted = get(completedStore);
    submittedTotal = get(itemsStore).length;
    submittedPercent = get(percentStore);
    submitted = true;
  }

  // For tests: a single string for the label
  $: progressLabel = submitted
    ? `${submittedCompleted}/${submittedTotal} (${submittedPercent}%)`
    : `0/${liveTotal} (0%)`;
</script>

<div>
  {#if items.length === 0}
    <p>No items.</p>
  {:else}
    {#each items as item (item.id)}
      <ChecklistItem {...item} on:change={handleChange} />
    {/each}
  {/if}

  <button on:click={handleSubmit} data-testid="submit">Submit version</button>

  <!-- Robust, accessible status region for tests -->
  <!-- Remove redundant role="status" to satisfy a11y rule -->
  <output aria-live="polite" data-testid="progress">{progressLabel}</output>
</div>
