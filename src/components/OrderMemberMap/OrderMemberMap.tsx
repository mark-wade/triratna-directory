import { useContext, useEffect, useState } from "react";
import GoogleMap from "../Map/Map";
import MapMarker from "../MapMarker/MapMarker";
import "./OrderMemberMap.css";
import { Link, useLocation } from "react-router";
import { useCookies } from "react-cookie";
import { useMap } from "@vis.gl/react-google-maps";
import { DataContext } from "../DataContext/DataContext";

type OrderMemberWithGeoLocation = {
  id: string;
  location: google.maps.LatLngLiteral;
}

export default function OrderMemberMap() {
  const [cookies] = useCookies(["jwt"]);
  const [orderMembersToShowOnMap, setOrderMembersToShowOnMap] = useState<OrderMemberWithGeoLocation[] | null>(null);
  const [orderMembersCurrentlyVisibleOnMap, setOrderMembersCurrentlyVisibleOnMap] = useState<OrderMemberWithGeoLocation[]>([]);

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
      setOrderMembersToShowOnMap(json.filter(om => {
        return om !== null;
      }).sort((a, b) => a.id.localeCompare(b.id)) as OrderMemberWithGeoLocation[]);
    });
  }, [cookies.jwt]);

  let keyCounter = 0;

  // TODO: Maybe mapId should be an environment variable?
  return (
    <div className="order-member-map flex flex-col lg:flex-row">
      <aside className="order-2 min-h-0 w-full flex-1 overflow-auto border-t border-gray-200 bg-white lg:order-1 lg:w-md lg:flex-none lg:border-t-0 lg:border-r">
        <VisibleOrderMembersList visibleOrderMembers={orderMembersCurrentlyVisibleOnMap} />
      </aside>
      <div className="order-1 min-h-0 min-w-0 flex-1 lg:order-2">
        <GoogleMap mapId="3dbc5b45af95583965fa232e" clusterMarkers={true}>
          {orderMembersToShowOnMap && (
            <>
              <MapViewportListener
                orderMembers={orderMembersToShowOnMap}
                onVisibleChange={setOrderMembersCurrentlyVisibleOnMap}
              />
              {orderMembersToShowOnMap.map((om) => (
                <MapMarker
                  key={++keyCounter}
                  id={om.id}
                  position={om.location}
                >
                  <div className="h-6 w-6 leading-6 rounded-full bg-gray-600 text-center text-white" />
                </MapMarker>
              ))}
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

function MapViewportListener({
  orderMembers,
  onVisibleChange,
}: {
  orderMembers: OrderMemberWithGeoLocation[];
  onVisibleChange: (visible: OrderMemberWithGeoLocation[]) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const updateVisible = () => {
      const bounds = map.getBounds();
      if (!bounds) {
        onVisibleChange([]);
        return;
      }
      onVisibleChange(orderMembers.filter((m) => bounds.contains(m.location)));
    };

    updateVisible();
    const listener = map.addListener("idle", updateVisible);
    return () => listener.remove();
  }, [map, orderMembers, onVisibleChange]);

  return null;
}

function VisibleOrderMembersList({
  visibleOrderMembers,
}: {
  visibleOrderMembers: OrderMemberWithGeoLocation[];
}) {
  const { orderMembers } = useContext(DataContext);
  const location = useLocation();
  const previousNavs = location.state ?? [];
  let keyCounter = 0;

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">In view</h2>
        <p className="text-xs text-gray-500">
          {visibleOrderMembers.length === 1
            ? "1 order member in this area"
            : `${new Intl.NumberFormat("en-GB").format(
              visibleOrderMembers.length
            )} order members in this area`}
        </p>
      </div>
      {visibleOrderMembers.length === 0 ? (
        <p className="px-4 py-6 text-sm text-gray-500">
          No order members in this area.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {visibleOrderMembers.map((om) => {
            return (
              <li key={++keyCounter}>
                <div className="relative flex justify-between gap-x-6 p-3 hover:bg-gray-50">
                  <div className="flex min-w-0 items-center gap-x-4">
                    {orderMembers[om.id]?.image ? (
                      <img
                        alt={orderMembers[om.id]?.name}
                        src={(process.env.PHOTOS_BASE_URL ?? "https://triratna-directory-order-photos.s3.eu-west-2.amazonaws.com") + "/" + orderMembers[om.id]?.image}
                        className="size-12 flex-none rounded-md bg-gray-50 object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="inline-flex size-12 items-center justify-center rounded-full bg-gray-500">
                        <span className="text-lg font-medium text-white">
                          {orderMembers[om.id]?.name[0]}
                        </span>
                      </span>
                    )}
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm/6 font-semibold text-gray-900">
                        <Link
                          to={`/order-members/${om.id}`}
                          viewTransition
                          state={[...previousNavs, "Map"]}
                        >
                          <span className="absolute inset-x-0 -top-px bottom-0" />
                          {orderMembers[om.id]?.name}
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
