<script lang="ts">
  import ChecklistItem from './ChecklistItem.svelte';
  import { tick } from 'svelte';
  import { get } from 'svelte/store';
  import { itemsStore, completedStore, percentStore, type Item } from '../stores';

  // Submit-gated snapshot values (shown in the UI label + target bar)
  let submitted = false;
  let submittedCompleted = 0;
  let submittedTotal = 0;
  let submittedPercent = 0; // the "truth" after submit

  // Live for rendering the list and computing totals (not displayed until submit)
  $: items = $itemsStore as Item[];
  $: liveTotal = items.length;

  // --- Progress Bar Animation State ---
  // Animated (dark) bar's current visual value
  let animPercent = 0;
  // Target (light) bar snaps to this immediately on submit
  let targetPercent = 0;
  // Control transition timing (approx 1s)
  const ANIM_DURATION_MS = 1000;

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

  async function handleSubmit() {
    // Snapshot current derived values for the visible label
    const nextCompleted = get(completedStore);
    const nextTotal = get(itemsStore).length;
    const nextPercent = get(percentStore);

    submittedCompleted = nextCompleted;
    submittedTotal = nextTotal;
    submittedPercent = nextPercent;
    submitted = true;

    // --- Animate visual layer from previous animPercent to new target ---
    // 1) Immediately snap the light "target" bar to the final value
    targetPercent = nextPercent;

    // 2) Animate the dark bar from its current animPercent to targetPercent
    // Force the old width first (no transition), then in next microtask set to target (with transition)
    const start = animPercent; // capture current
    animPercent = start;       // re-assert
    await tick();              // next microtask to allow the style to apply
    animPercent = nextPercent; // triggers CSS transition
  }

  // For tests: a single string for the label (the truth)
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

  <!-- Accessible progress status (truthful/target) -->
  <output aria-live="polite" data-testid="progress">{progressLabel}</output>

  <!-- Progress bar container -->
  <div class="progress" aria-hidden="true">
    <!-- Light bar: snaps to target immediately on submit -->
    <div
      class="progress__track"
      data-testid="progress-target"
      style={`width: ${submitted ? targetPercent : 0}%;`}
    />
    <!-- Dark bar: animates to target over ~1s -->
    <div
      class="progress__fill"
      data-testid="progress-anim"
      style={`width: ${submitted ? animPercent : 0}%;
              transition: width ${ANIM_DURATION_MS}ms linear;`}
    />
  </div>

  <!-- Also expose an ARIA progressbar with the target value for assistive tech -->
  {#if submitted}
    <div
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={targetPercent}
      aria-label="Checklist progress"
      data-testid="progressbar-aria"
      class="sr-only"
    />
  {/if}
</div>

<style>
  .progress {
    position: relative;
    height: 12px;
    border-radius: 9999px;
    background: var(--progress-bg, #eee);
    overflow: hidden;
    margin-top: 8px;
  }

  .progress__track {
    position: absolute;
    inset: 0;
    width: 0%;
    background: var(--progress-track, #cfe3ff); /* light color (target snap) */
    border-radius: inherit;
    /* no transition: snaps immediately */
  }

  .progress__fill {
    position: absolute;
    inset: 0;
    width: 0%;
    background: var(--progress-fill, #3563e9); /* dark color (animated) */
    border-radius: inherit;
    /* transition set inline so tests can assume ~1s duration */
  }

  /* Visually hidden but accessible (for aria progressbar mirror) */
  .sr-only {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }
</style>
