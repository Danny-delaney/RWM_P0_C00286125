<script>
  import { createEventDispatcher } from 'svelte';
  export let id;
  export let label;
  export let done = false;

  const dispatch = createEventDispatcher();

  function handleChange(event) {
    dispatch('change', { id, done: event.target.checked });
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
