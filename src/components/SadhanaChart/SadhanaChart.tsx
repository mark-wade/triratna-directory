import { useContext, useEffect } from "react";
import { DataContext } from "../DataContext/DataContext";
import {
  getAxisMax,
  getMostPopularSadhanas,
  getSadhanaCounts,
} from "./SadhanaChart.utils";
import ApexCharts from "apexcharts";

const MAX_SADHANAS = 20;
const GRIDLINE_INTERVAL = 50;

export default function SadhanaChart() {
  const { orderMembers } = useContext(DataContext);

  useEffect(() => {
    const counts = getSadhanaCounts(orderMembers);
    const sadhanas = getMostPopularSadhanas(counts, MAX_SADHANAS);
    const axisMax = getAxisMax(counts, sadhanas, GRIDLINE_INTERVAL);

    const series = [
      {
        name: "Dharmacharis",
        data: sadhanas.map((sadhana) => counts[sadhana].Male),
      },
      {
        name: "Dharmacharinis",
        data: sadhanas.map((sadhana) => counts[sadhana].Female),
      },
    ];
    const unknownGenderSeries = sadhanas.map(
      (sadhana) => counts[sadhana].Unknown
    );
    if (unknownGenderSeries.find((n) => n > 0)) {
      series.push({
        name: "Unknown",
        data: unknownGenderSeries,
      });
    }

    const options = {
      chart: {
        animations: {
          enabled: false,
        },
        fontFamily: `ui-sans-serif, system-ui, sans-serif`,
        height: 700,
        stacked: true,
        toolbar: {
          tools: {
            download: false,
          },
        },
        type: "bar",
      },
      colors: ["#2d5cd4", "#d42522", "#4a5565", "#35966a"],
      dataLabels: {
        enabled: false,
      },
      grid: {
        // Apex has these the other way round for a horizontal bar chart: it draws a separator
        // between the rows but nothing at the value gridlines
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      labels: sadhanas,
      legend: {
        fontFamily: `ui-sans-serif, system-ui, sans-serif`,
      },
      plotOptions: {
        bar: {
          // The sadhana names are too long to fit under a vertical bar
          horizontal: true,
        },
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
      series,
      xaxis: {
        max: axisMax,
        tickAmount: axisMax / GRIDLINE_INTERVAL,
      },
    };

    const el = document.querySelector("#sadhanaChart");
    if (el) {
      el.innerHTML = "";
      const chart = new ApexCharts(el, options);
      chart.render();
    }
  }, [orderMembers]);

  return <div id="sadhanaChart"></div>;
}
