import {
  useNavigate,
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router";
import NavBar from "../NavBar/NavBar";
import { useEffect, useState } from "react";
import { DataResponse, DataSource, SortBy } from "../../utilities/types";
import ErrorState from "../ErrorState/ErrorState";
import OrderMemberTable from "../OrderMemberTable/OrderMemberTable";
import MasterDetailTable from "../MasterDetailTable/MasterDetailTable";
import { DataContext, DataContextValue } from "../DataContext/DataContext";
import PageNotFound from "../PageNotFound/PageNotFound";
import {
  locationToTableRow,
  orderMemberToTableRow,
} from "../../utilities/tableConverters";
import LocationTable from "../LocationTable/LocationTable";
import TimeMachine from "../TimeMachine/TimeMachine";
import Feedback from "../Feedback/Feedback";
import Stats from "../Stats/Stats";
import InfoPage from "../InfoPage/InfoPage";
import { useCookies } from "react-cookie";
import NavWrapper from "../NavWrapper/NavWrapper";

const SCHEMA_VERSION = "2025-12-25";

function DefaultPage() {
  let navigate = useNavigate();
  useEffect(() => {
    navigate("/order-members");
  });

  return <></>;
}

export default function AppLoggedIn({ source }: { source: DataSource }) {
  // This nonsense is to prevent view transitions when the user navigates back/forward in
  // their browser. Otherwise (1) on iOS when you swipe back, we'll try to do our view transition
  // too and it results in a weird double-animation, and (2) on all browsers it will always
  // appear to navigate "forward", which looks weird if the user taps "back"
  useEffect(() => {
    window.addEventListener(
      "popstate",
      function () {
        // Don't do this if back-transition is present, which would mean the user just clicked
        // our own back button
        if (!document.documentElement.classList.contains("back-transition")) {
          const mainTag = document.getElementsByTagName("main");
          if (mainTag.length > 0) {
            mainTag[0].classList.add("noViewTransition");
            setTimeout(function () {
              mainTag[0].classList.remove("noViewTransition");
            }, 500);
          }
        }
      },
      false
    );
  });

  const router = createBrowserRouter([
    {
      Component: AppMaitrijala,
      children: [
        { index: true, element: <DefaultPage /> },
        {
          path: "order-members",
          children: [
            {
              index: true,
              element: <OrderMemberTable />,
            },
            {
              path: ":name",
              element: <OrderMemberTable />,
            },
          ],
        },
        {
          path: "locations",
          children: [
            {
              index: true,
              element: <LocationTable />,
            },
            {
              path: ":name",
              element: <LocationTable />,
            },
          ],
        },
        {
          path: "history",
          children: [
            {
              index: true,
              element: (
                <NavWrapper>
                  <TimeMachine />
                </NavWrapper>
              ),
            },
            {
              path: ":yearAsString",
              element: (
                <NavWrapper>
                  <TimeMachine />
                </NavWrapper>
              ),
            },
          ],
        },
        {
          path: "stats",
          element: (
            <NavWrapper>
              <Stats />
            </NavWrapper>
          ),
        },
        {
          path: "about",
          element: (
            <NavWrapper>
              <InfoPage />
            </NavWrapper>
          ),
        },
        {
          path: "*",
          element: (
            <NavWrapper>
              <PageNotFound />
            </NavWrapper>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

function AppMaitrijala() {
  const [cookies] = useCookies(["jwt"]);
  const [data, setData] = useState<DataResponse>();
  const [error, setError] = useState<number>();

  useEffect(() => {
    const cachedData = localStorage.getItem("cacheData");
    if (cachedData) {
      setData(JSON.parse(cachedData));
    }

    const cacheSchemaVersion = localStorage.getItem("cacheSchemaVersion");
    const cacheTime = localStorage.getItem("cacheTime");
    const cacheTimeout = new Date();
    cacheTimeout.setMinutes(cacheTimeout.getMinutes() - 5);

    if (
      !cachedData ||
      !cacheTime ||
      cacheSchemaVersion !== SCHEMA_VERSION ||
      parseInt(cacheTime) < cacheTimeout.getTime()
    ) {
      fetch(
        (process.env.API_URL
          ? process.env.API_URL
          : "https://api.triratna.directory") + "/data",
        {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        }
      )
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(`Bad response: ${response.status}`);
          }
          return response.json();
        })
        .then((json) => {
          localStorage.setItem("cacheData", JSON.stringify(json));
          localStorage.setItem("cacheTime", new Date().getTime().toString());
          localStorage.setItem("cacheSchemaVersion", SCHEMA_VERSION);
          setData(json);
        })
        .catch((error) => {
          if (!cachedData) {
            setError(500);
          }
        });
    }
  }, [cookies.jwt]);

  // We calculate the rows here rather than in <OrderMemberTable /> because it's expensive and otherwise
  // there will be a lag every time you switch to that tab
  const dataContext: DataContextValue = {
    source: "maitrijala",
    orderMembers: data ? data.orderMembers : {},
    orderMemberRows: data
      ? Object.entries(data.orderMembers).map(([k, v]) =>
          orderMemberToTableRow(k, v, data.orderMembers, "maitrijala")
        )
      : [],
    locations: data ? data.locations : {},
    locationRows: data
      ? Object.entries(data?.locations).map(([k, v]) =>
          locationToTableRow(k, v, data?.orderMembers)
        )
      : [],
  };

  return error ? (
    <ErrorState statusCode={error} />
  ) : (
    <>
      {data ? (
        <DataContext value={dataContext}>
          <Outlet />
        </DataContext>
      ) : (
        <NavWrapper>
          <MasterDetailTable
            skeleton={true}
            data={[]}
            element={undefined}
            sortOptions={[]}
            defaultSort={SortBy.ALPHABETICAL}
            filters={[]}
          />
        </NavWrapper>
      )}
    </>
  );
}
