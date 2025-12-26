import { useContext, useEffect } from "react";
import { DataContext } from "../DataContext/DataContext";
import { Gender } from "../../utilities/types";
import ApexCharts from "apexcharts";

export default function OrderMembersOverTimeChart() {
  function getTimelines() {
    let timelines: Record<Gender, Record<string, number>> = {
      Male: {},
      Female: {},
      //NonBinary: {},
    };

    function addToTimeline(g: Gender, date: string, change: number) {
      if (timelines[g][date] === undefined) {
        timelines[g][date] = 0;
      }
      timelines[g][date] += change;
    }

    for (const [, om] of Object.entries(orderMembers)) {
      for (const event of om.events) {
        if (event.date) {
          switch (event.type) {
            // We don't do suspended/reinstated since we consider that still an Order member
            case "ordained":
              addToTimeline(om.gender, normalizeDate(new Date(event.date)), 1);
              break;
            case "died":
            case "resigned":
            case "removed":
              addToTimeline(om.gender, normalizeDate(new Date(event.date)), -1);
              break;
          }
        }
      }
    }

    return timelines;
  }

  const { orderMembers } = useContext(DataContext);

  const timelines = getTimelines();

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
      zoom: {
        enabled: false,
      },
    },
    colors: ["#2d5cd4", "#d42522", "#35966a"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      fontFamily: `ui-sans-serif, system-ui, sans-serif`,
      itemMargin: {
        horizontal: 10,
        vertical: 15,
      },
    },
    series: [
      {
        name: "Dharmacharis",
        data: getSeriesFromTimeline(timelines.Male),
      },
      {
        name: "Dharmacharinis",
        data: getSeriesFromTimeline(timelines.Female),
      },
      // {
      //   name: "Non-Binary",
      //   data: getSeriesFromTimeline(timelines.NonBinary),
      // },
    ],
    tooltip: {
      intersect: false,
      shared: true,
      x: {
        format: "yyyy",
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

          const date = new Date(value);
          const total = series.reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue[dataPointIndex],
            0
          );
          return `${date.getUTCFullYear()}: ${new Intl.NumberFormat(
            "en-GB"
          ).format(total)} order members`;
        },
      },
    },
    xaxis: {
      type: "datetime" as "datetime",
    },
    yaxis: {
      tickAmount: 12,
    },
  };

  useEffect(() => {
    const el = document.querySelector("#orderMembersOverTimeChart");
    if (el) {
      el.innerHTML = "";
      const chart = new ApexCharts(el, options);
      chart.render();
    }
  }, [options]);

  return <div id="orderMembersOverTimeChart"></div>; //<Chart options={options} series={series} type="bar" />;
}

function getSeriesFromTimeline(timeline: Record<string, number>) {
  let current = 0;
  const seriesData: { x: string; y: number }[] = [];
  const date = new Date("1968-04-07");
  const now = new Date();
  while (date < now) {
    const dateAsString = normalizeDate(date);
    if (timeline[dateAsString]) {
      current += timeline[dateAsString];
    }
    seriesData.push({
      x: dateAsString,
      y: current,
    });
    date.setFullYear(date.getFullYear() + 1);
  }
  return seriesData;
}

function normalizeDate(date: Date) {
  return `${date.getUTCFullYear()}`;
  //-${(date.getUTCMonth() + 1).toString().padStart(2, "0")}`;
  //-${date.getUTCDate().toString().padStart(2, "0")}
}
