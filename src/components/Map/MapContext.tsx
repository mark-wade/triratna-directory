import { Marker } from "@googlemaps/markerclusterer";
import { createContext } from "react";

export interface MapContextValue {
  markers: { [key: string]: Marker };
  setMarkerRef?: (marker: Marker | null, key: string) => void;
}

export const MapContext = createContext<MapContextValue>({
  markers: {},
  setMarkerRef: undefined,
});