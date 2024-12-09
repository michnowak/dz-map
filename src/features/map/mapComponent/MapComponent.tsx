import 'mapbox-gl/dist/mapbox-gl.css';
import Image from 'next/image';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef } from 'react';
import styles from './MapComponent.module.scss';


import tunnelSvg from '../../../../public/assets/images/tunnel.svg';
import dropzoneSvg from '../../../../public/assets/images/dropzone.svg';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

type MapComponentProps = {
  center: [number, number];
  zoom: number;
  geojsonData: GeoJSON.FeatureCollection;
};

const MapComponent: React.FC<MapComponentProps> = ({ center, zoom, geojsonData }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Map types to images
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

      mapRef.current.addControl(new mapboxgl.NavigationControl());

      for (const marker of geojsonData.features) {
        const el = document.createElement('div');
        el.className = styles.marker;

        // Determine the image based on the type
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
  }, [center, zoom, geojsonData]);

  return (
    <div ref={mapContainerRef} className={styles.mapContainer} />
  );
};

export default MapComponent;
