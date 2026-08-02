import { Map as GoogleMap, useMap } from "@vis.gl/react-google-maps";
import { APIProvider } from "@vis.gl/react-google-maps";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { MapContext } from "./MapContext";
import { Marker, MarkerClusterer } from "@googlemaps/markerclusterer";

type MapProps = {
  mapId: string;
  clusterMarkers: boolean;
  children: ReactNode
}

export default function Map({ children, ...props }: MapProps) {
  return (
    <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY ?? ''}>
      <MapWithApiKeyProvided {...props}>{children}</MapWithApiKeyProvided>
    </APIProvider>
  )
}

function MapWithApiKeyProvided({ mapId, clusterMarkers, children }: MapProps) {
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});

  const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
    setMarkers(markers => {
      if ((marker && markers[key]) || (!marker && !markers[key]))
        return markers;

      if (marker) {
        return { ...markers, [key]: marker };
      } else {
        const { [key]: _, ...newMarkers } = markers;

        return newMarkers;
      }
    });
  }, []);

  const map = useMap();
  const clusterer = useMemo(() => map && clusterMarkers ? new MarkerClusterer({ map }) : null, [clusterMarkers, map]);
  useEffect(() => {
    if (clusterer) {
      clusterer.clearMarkers();
      clusterer.addMarkers(Object.values(markers));
    }
  }, [clusterer, markers]);

  return (
    <GoogleMap mapId={mapId} style={{ width: '100%', height: '100%' }} defaultCenter={{ lat: 0, lng: 0 }} defaultZoom={3} maxZoom={15}>
      <MapContext value={{ markers, setMarkerRef }}>
        {children}
      </MapContext>
    </GoogleMap>
  )
}