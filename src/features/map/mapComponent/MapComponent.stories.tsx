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

// Mock danych GeoJSON
const mockGeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [19.0392, 52.4897],
      },
      properties: {
        title: 'Skydive.pl',
        description: 'Description Skydive.pl',
        markerOptions: {
          color: '#ff0000',
        },
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [19.6778, 51.4047],
      },
      properties: {
        title: 'SkyForce',
        description: 'Description SkyForce',
        markerOptions: {
          color: 'yellow',
        },
      },
    },
  ],
};

export const Default = {
  args: {
    center: [21.0122, 52.2297],
    zoom: 6,
    geojsonData: mockGeoJSON as GeoJSON.FeatureCollection,
  },
} satisfies Story;
