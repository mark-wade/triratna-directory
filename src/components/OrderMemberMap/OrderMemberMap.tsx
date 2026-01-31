import { AdvancedMarker, APIProvider, InfoWindow, Map, useMap } from "@vis.gl/react-google-maps";
import { type Marker, MarkerClusterer } from "@googlemaps/markerclusterer";
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DataContext } from "../DataContext/DataContext";
import { useCookies } from "react-cookie";

export default function OrderMemberMap() {
  return (
    <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY ?? ''}>
      <OrderMemberMapMap />
    </APIProvider>
  )
};

type OrderMemberGeoLocation = {
  name: string;
  location: google.maps.LatLngLiteral;
}

// TODO: Fix the height
// TODO: The images take too long to load for this to be practical without some kind of fallback while they're loading
function OrderMemberMapMap() {
  const [cookies] = useCookies(["jwt"]);
  const [data, setData] = useState<OrderMemberGeoLocation[] | null>(null);

  useEffect(() => {
    fetch(
      (process.env.API_URL
        ? process.env.API_URL
        : "https://api.triratna.directory") + "/map",
      {
        headers: {
          Authorization: `Bearer ${cookies.jwt}`,
        },
      }
    ).then((response) => {
      if (response.status !== 200) {
        throw new Error(`Bad response: ${response.status}`);
      }
      return response.json();
    }).then((json) => {
      setData(json as OrderMemberGeoLocation[]);
    });
  }, [cookies.jwt]);

  const { orderMembers } = useContext(DataContext);
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const map = useMap();

  const clusterer = useMemo(() => {
    if (!map) return null;
    return new MarkerClusterer({ map });
  }, [map]);

  useEffect(() => {
    if (clusterer) {
      clusterer.clearMarkers();
      clusterer.addMarkers(Object.values(markers));
    }
  }, [clusterer, markers]);

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

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  let i = 0;
  return (
    <>
      {data && (
        <Map mapId="DEMO_MAP_ID" style={{ width: '100%', height: '100vh' }} defaultCenter={{ lat: 0, lng: 0 }} defaultZoom={2}>
          {data.map((om) =>
            om && orderMembers[om.name] && orderMembers[om.name].status === "Active" && (
              <OrderMemberMarker key={i++} id={i} name={om.name} image={orderMembers[om.name].image} position={om.location} setMarkerRef={setMarkerRef} setSelectedId={setSelectedId} setSelectedName={setSelectedName} />
            )
          )}
          {selectedId && (
            <InfoWindow anchor={markers[selectedId]}>
              <a href={"/order-members/" + selectedName}>{selectedName}</a>
            </InfoWindow>
          )}
        </Map>
      )}
    </>

  )
}

function OrderMemberMarker({ id, name, image, position, setMarkerRef, setSelectedId, setSelectedName }: {
  id: number;
  name: string;
  image: string | null
  position: google.maps.LatLngLiteral;
  setMarkerRef: (marker: Marker | null, key: string) => void;
  setSelectedId: Dispatch<SetStateAction<string | null>>
  setSelectedName: Dispatch<SetStateAction<string | null>>
}) {
  const ref = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement) =>
      setMarkerRef(marker, id.toString()),
    [setMarkerRef, id]
  );

  return (
    <AdvancedMarker title={name} position={position} ref={ref} onClick={() => {
      setSelectedId(id.toString());
      setSelectedName(name);
    }}>
      {image ? (
        <img
          className="w-6 h-6 rounded-full object-cover"
          alt={name}
          src={
            (process.env.PHOTOS_BASE_URL ??
              "https://triratna-directory-order-photos.s3.eu-west-2.amazonaws.com") +
            "/" +
            image
          }
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-gray-700 text-white text-center leading-6">{name[0]}</div>
      )}
    </AdvancedMarker>
  );
}