import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import classNames from 'classnames/bind';
import mapboxgl from 'mapbox-gl';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import dropzoneSvg from '../../../../public/assets/images/dropzone.svg';
import tunnelSvg from '../../../../public/assets/images/tunnel.svg';
import styles from './MapComponent.module.scss';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

type MapComponentProps = {
  center: [number, number];
  zoom: number;
  geojsonData: GeoJSON.FeatureCollection;
  showGeocoder?: boolean;
  showNavigation?: boolean;
};

const cx = classNames.bind(styles);

const MapComponent: React.FC<MapComponentProps> = ({ center, zoom, geojsonData, showGeocoder, showNavigation }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const typeToImageMap: Record<string, string> = {
    tunnel: tunnelSvg,
    dropzone: dropzoneSvg,
  };

  useEffect(() => {
    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center,
        zoom,
        attributionControl: false,
      });

      mapRef.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

      if (showGeocoder) {
        const geocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          enableGeolocation: true,
          addressAccuracy: 'place',
          reverseMode: 'score',
          marker: false,
          mapboxgl,
        });

        mapRef.current.addControl(geocoder, 'top-left');
      }

      for (const marker of geojsonData.features) {
        const el = document.createElement('div');
        el.className = cx([styles.marker, styles[marker.properties?.type]]);

        const imageSrc = typeToImageMap[marker.properties?.type] || tunnelSvg;

        ReactDOM.render(
          <Image
            priority
            src={imageSrc}
            alt={`${marker.properties?.type} icon`}
            width={20}
            height={20}
          />,
          el,
        );

        el.addEventListener('click', () => {
          console.log(marker.properties?.description);
        });

        new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates)
          .addTo(mapRef.current);
      }

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
        }
      };
    }
  }, [center, zoom, geojsonData, showGeocoder, showNavigation]);

  return (
    <div ref={mapContainerRef} className={styles.mapContainer} />
  );
};

export default MapComponent;
