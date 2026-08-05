/// <reference types="google.maps" />
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { MapContext } from "../Map/MapContext";
import { ReactNode, useCallback, useContext } from "react";

export default function MapMarker({ id, position, onClick, children }: {
  id: string;
  position: google.maps.LatLngLiteral;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  children: ReactNode | (() => ReactNode);
}) {
  const { setMarkerRef } = useContext(MapContext);

  const ref = useCallback((marker: google.maps.marker.AdvancedMarkerElement) => {
    if (setMarkerRef) {
      setMarkerRef(marker, id)
    }
  }, [setMarkerRef, id]);

  return (
    <AdvancedMarker
      position={position}
      onClick={onClick}
      ref={ref}
    >
      {typeof children === 'function' ? children() : children}
    </AdvancedMarker>
  );
}