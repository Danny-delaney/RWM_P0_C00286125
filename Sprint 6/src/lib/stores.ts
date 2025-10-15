import { writable, derived, get } from 'svelte/store';

export type Item = { id: number; label: string; done: boolean };

export const itemsStore = writable<Item[]>([]);

export const completedStore = derived(itemsStore, (items) =>
  items.filter((i) => i.done).length
);

export const percentStore = derived(itemsStore, (items) =>
  items.length ? Math.round((100 * items.filter((i) => i.done).length) / items.length) : 0
);

export function seedItemsIfEmpty(items: Item[]) {
  if (get(itemsStore).length === 0) {
    itemsStore.set(items);
  }
}
