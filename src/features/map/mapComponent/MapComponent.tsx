import 'mapbox-gl/dist/mapbox-gl.css';

import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef } from 'react';

import styles from './MapComponent.module.scss';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

type MapComponentProps = {
  center: [number, number];
  zoom: number;
  geojsonData: GeoJSON.FeatureCollection;
};

const MapComponent: React.FC<MapComponentProps> = ({ center, zoom, geojsonData }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center,
        zoom,
        attributionControl: false,
      });

      mapRef.current.addControl(new mapboxgl.NavigationControl());

      for (const geojson of geojsonData.features) {
        new mapboxgl.Marker(geojson.properties?.markerOptions).setLngLat(geojson.geometry.coordinates).addTo(mapRef.current);
      }

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
        }
      };
    }
    return undefined;
  }, [center, zoom, geojsonData]);

  return <div ref={mapContainerRef} className={styles.mapContainer} />;
};

export default MapComponent;
