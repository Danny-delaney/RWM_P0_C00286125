<script lang="ts">
  import { cubes } from '$lib/filters';
  import { Combined } from '$lib/filters/combined/combined';

  let raw = '1 2 3 4 5';

  $: input = raw.trim().split(/\s+/).filter(Boolean).map(Number);
  $: output = cubes(input);
  $: combinedOutput = Combined(input);
</script>

<h1>Sequence Filter Demo</h1>
<label>
  Input (space-separated integers)
  <input bind:value={raw} placeholder="e.g., 4 3 2 1 0" />
</label>

<h2>Cubes Output</h2>
<p>{output.join(' ')}</p>

<h2>Combined Output</h2>
<p>{combinedOutput}</p>

<style>
  label { display: block; margin: 1rem 0; }
  input { width: 100%; max-width: 30rem; }
</style>