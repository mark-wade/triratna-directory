import { useContext, useEffect } from "react";
import { DataContext } from "../DataContext/DataContext";
import { AreaName, AREAS } from "../../utilities/types";
import { OrderMembersByAreaData } from "./OrderMembersByAreaChart.types";
import { emptyOrderMembersByAreaData } from "./OrderMembersByAreaChart.utils";
import ApexCharts from "apexcharts";

function sumArray(array: number[]) {
  return array.reduce((partialSum, a) => partialSum + a, 0);
}

export default function OrderMembersByAreaChart({
  data,
}: {
  data?: OrderMembersByAreaData;
}) {
  const { orderMembers } = useContext(DataContext);

  // If we didn't pass in data, work it out from the current data
  if (data === undefined) {
    data = Object.entries(orderMembers).reduce((accumulator, [, om]) => {
      if (om.status === "Active") {
        accumulator[om.area ?? "Unknown"][om.gender ?? "Unknown"]++;
      }
      return accumulator;
    }, emptyOrderMembersByAreaData());
  }

  const areas = Object.entries(AREAS).sort(
    ([a], [b]) =>
      sumArray(Object.values(data[b as AreaName])) -
      sumArray(Object.values(data[a as AreaName]))
  );
  if (Object.values(data.Unknown).find((n) => n > 0)) {
    areas.push(["Unknown", { name: "Unknown" }]);
  }

  useEffect(() => {
    const series = [
      {
        name: "Dharmacharis",
        data: areas.map(([k]) => data[k as AreaName].Male),
      },
      {
        name: "Dharmacharinis",
        data: areas.map(([k]) => data[k as AreaName].Female),
      },
      // {
      //   name: "Non-Binary",
      //   data: areas.map(([k]) => data[k as AreaName].NonBinary),
      // },
    ];
    const unknownGenderSeries = areas.map(([k]) => data[k as AreaName].Unknown);
    if (unknownGenderSeries.find((n) => n > 0)) {
      series.push({
        name: "Unknown",
        data: areas.map(([k]) => data[k as AreaName].Unknown),
      });
    }

    const options = {
      chart: {
        animations: {
          enabled: false,
        },
        fontFamily: `ui-sans-serif, system-ui, sans-serif`,
        stacked: true,
        toolbar: {
          tools: {
            download: false,
          },
        },
        type: "bar",
      },
      colors: ["#2d5cd4", "#d42522", "#4a5565", "#35966a"],
      labels: areas.map(([, area]) => area.name),
      legend: {
        fontFamily: `ui-sans-serif, system-ui, sans-serif`,
      },
      tooltip: {
        intersect: false,
        shared: true,
        x: {
          formatter: function (
            value: number,
            {
              series,
              dataPointIndex,
            }: { series: number[][]; dataPointIndex: number }
          ) {
            if (series === undefined) {
              return "";
            }

            const total = series.reduce(
              (accumulator, currentValue) =>
                accumulator + currentValue[dataPointIndex],
              0
            );
            return `${value}: ${new Intl.NumberFormat("en-GB").format(
              total
            )} order members`;
          },
        },
        y: {
          formatter: function (value: number) {
            return new Intl.NumberFormat("en-GB").format(value);
          },
        },
      },
      yaxis: {
        tickAmount: 12,
      },
      series,
    };

    const el = document.querySelector("#orderMembersByAreaChart");
    if (el) {
      el.innerHTML = "";
      const chart = new ApexCharts(el, options);
      chart.render();
    }
  }, [areas, data]);

  return <div id="orderMembersByAreaChart"></div>; //<Chart options={options} series={series} type="bar" />;
}
