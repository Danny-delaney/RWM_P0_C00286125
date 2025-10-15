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

<label>
  <input
    type="checkbox"
    checked={done}
    on:change={handleChange}
    data-testid="checkbox"
  />
  {label}
</label>
