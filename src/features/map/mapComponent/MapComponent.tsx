import 'mapbox-gl/dist/mapbox-gl.css';

import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef } from 'react';

import styles from './MapComponent.module.scss';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

const MapComponent: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-74.5, 40],
        zoom: 9,
        attributionControl: false,
      });

      mapRef.current.addControl(new mapboxgl.NavigationControl());

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
        }
      };
    }
  }, []);

  return <div ref={mapContainerRef} className={styles.mapContainer} />;
};

export default MapComponent;
