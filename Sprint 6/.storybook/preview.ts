import type { Preview } from '@storybook/sveltekit';
import { itemsStore } from '../src/lib/stores';

// Reset between stories so each one is deterministic
const resetStoreDecorator = (Story) => {
  itemsStore.set([]);
  return Story();
};

const preview: Preview = {
  decorators: [resetStoreDecorator],
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    options: {
      storySort: {
        method: 'configure',
        order: ['ChecklistProgress', ['Default (mixed)', 'None', 'All', 'Long labels']]
      }
    }
  }
};

export default preview;
