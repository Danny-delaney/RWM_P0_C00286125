<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<script>
  import ChecklistItem from '$lib/components/ChecklistItem.svelte';
  let counter = 0;
  let item = { id: 1, label: 'Test Item', done: false };
  function handleChange(e) {
    counter += 1;
    item.done = e.detail.done;
  }
</script>

<h1 data-testid="title">Progress Checklist</h1>
<ChecklistItem {...item} on:change={handleChange} />
<p data-testid="counter">Counter: {counter}</p>