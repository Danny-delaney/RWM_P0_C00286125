<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
</p>

<script lang="ts">
  import ChecklistProgress from '$lib/components/ChecklistProgress.svelte';
  import { itemsStore, type Item } from '$lib/stores';

  // Initialize the central store with the page's default items
  const initialItems: Item[] = [
    { id: 1, label: 'Item 1', done: false },
    { id: 2, label: 'Item 2', done: false },
    { id: 3, label: 'Item 3', done: false },
    { id: 4, label: 'Item 4', done: false },
    { id: 5, label: 'Item 5', done: false }
  ];

  // Set once; UI reads everything from the store
  itemsStore.set(initialItems);
</script>

<h1 data-testid="title">Progress Checklist</h1>
<ChecklistProgress />
