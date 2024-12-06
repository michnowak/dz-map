import type { Meta, StoryObj } from '@storybook/react';

import MapComponent from './MapComponent';

const meta = {
  title: 'Components/MapComponent',
  component: MapComponent,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MapComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
  },
} satisfies Story;
