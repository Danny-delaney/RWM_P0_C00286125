import type { Meta, StoryObj } from '@storybook/sveltekit';
import ChecklistProgress from './ChecklistProgress.svelte';
// Use relative path to avoid relying on the $lib alias in Storybook
import { itemsStore, type Item } from '../stores';

// ----- Shared seeds -----
const mixed: Item[] = [
  { id: 1, label: 'Item 1', done: true },
  { id: 2, label: 'Item 2', done: false },
  { id: 3, label: 'Item 3', done: true },
  { id: 4, label: 'Item 4', done: false },
  { id: 5, label: 'Item 5', done: false }
];

const none: Item[] = [
  { id: 1, label: 'Item 1', done: false },
  { id: 2, label: 'Item 2', done: false },
  { id: 3, label: 'Item 3', done: false }
];

const all: Item[] = [
  { id: 1, label: 'Item 1', done: true },
  { id: 2, label: 'Item 2', done: true },
  { id: 3, label: 'Item 3', done: true }
];

const longLabels: Item[] = [
  {
    id: 1,
    label:
      'A very long descriptive label to verify wrapping and accessibility across various viewport widths',
    done: false
  },
  {
    id: 2,
    label:
      'Another extremely verbose label that should not break the layout or cause overflow in compact containers',
    done: true
  },
  { id: 3, label: 'Short one for contrast', done: false }
];

// Helper to render component after seeding the store
function renderWith(items: Item[]) {
  return () => {
    itemsStore.set(items);
    return { Component: ChecklistProgress };
  };
}

const meta = {
  title: 'ChecklistProgress',
  component: ChecklistProgress,
  parameters: {
    docs: {
      description: {
        component:
          'This component uses a central writable store (`itemsStore`) and derived stores (`completedStore`, `percentStore`). ' +
          'The visible progress label is **submit-gated**: ticking checkboxes updates the underlying stores immediately, ' +
          'but the label only updates when **Submit version** is pressed, at which time we snapshot the derived values.'
      }
    }
  }
} satisfies Meta<ChecklistProgress>;

export default meta;

type Story = StoryObj<typeof meta>;

// Default (mixed) — before submit: label shows 0/x (0%)
export const DefaultMixed: Story = {
  name: 'Default (mixed)',
  render: renderWith(mixed)
};

// None — before submit: 0/x (0%). After clicking submit it should also be 0/x (0%).
export const NoneChecked: Story = {
  name: 'None',
  render: renderWith(none)
};

// All — before submit: 0/x (0%). After clicking submit it should jump to 100%.
export const AllChecked: Story = {
  name: 'All',
  render: renderWith(all)
};

// Long labels — layout / wrapping check
export const LongLabels: Story = {
  name: 'Long labels',
  render: renderWith(longLabels)
};
