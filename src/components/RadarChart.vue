<script>
import { PolarArea } from "vue-chartjs";
import { Style } from "../scripts/Download";
import "chartjs-plugin-datalabels";
export default {
  extends: PolarArea,
  props: ["data"],
  data() {
    return {
      size: 185,
      options: {
        startAngle: -Math.PI / 1.75,
        responsive: true,
        plugins: {
          datalabels: {
            font: {
              size: 11,
            },
            formatter: function (value, context) {
              return context.chart.data.labels[context.dataIndex];
            },
            anchor: "start",
            align: "end",
            offset: function (e) {
              let padding = e.chart.options.layout.padding;
              return e.chart.width / 2 - padding - 5;
            },
          },
        },
        legend: {
          display: false,
        },
        layout: {
          padding: 20,
        },
        scale: {
          scaleLabel: {
            display: true,
          },
          ticks: {
            display: true,
          },
          angleLines: {
            display: true,
            lineWidth: 2,
          },
          pointLabels: {
            display: false,
          },
        },
      },
    };
  },
  mounted: function () {
    Style(this.data).then((e) => {
      this.renderChart(e, this.options);
    });
  },
};
</script>