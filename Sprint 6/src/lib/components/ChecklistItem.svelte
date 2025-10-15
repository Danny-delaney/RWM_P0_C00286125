<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let id: number;
  export let label: string;
  export let done: boolean = false;

  const dispatch = createEventDispatcher();

  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    dispatch('change', { id, done: target.checked });
  }
</script>

<!-- Internal class renamed earlier; keep it. Add stable per-item testids. -->
<label class="checkbox-row--renamed" data-testid={"item-" + id}>
  <input
    type="checkbox"
    checked={done}
    on:change={handleChange}
    data-testid={"checkbox-" + id}
  />
  {label}
</label>

<style>
  /* This class name can change without breaking tests */
  .checkbox-row--renamed {
    /* keep any desired styling here */
  }
</style>
