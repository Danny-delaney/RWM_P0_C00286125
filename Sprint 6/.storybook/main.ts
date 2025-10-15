import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/sveltekit',
    options: {}
  },
  stories: ['../src/**/*.stories.@(ts|svelte|mdx)'],
  addons: ['@storybook/addon-essentials'],
  docs: { defaultName: 'Docs' }
};

export default config;
