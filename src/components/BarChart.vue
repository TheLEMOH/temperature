<script>
import { Bar } from "vue-chartjs";
import { Style } from "../scripts/Download";
export default {
  extends: Bar,
  props: ["data", "forecast"],
  data() {
    return {
      options: {
        plugins: {
          datalabels: {
            display: false,
          },
        },
        legend: {
          display: this.data.type == "windspeed" ? true : false,
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              stacked: this.data.type == "windspeed" ? true : false,
              ticks: {
                maxRotation: 45,
                minRotation: 30,
                autoSkip: false,
                fontSize: "12",
                fontColor: "black",
                callback: (value) => {
                  if (this.forecast != true) {
                    if (value.split(" ")[1] == "00:00") {
                      return value.split(" ")[0];
                    }
                    if (
                      value.split(" ")[1] == "04:00" ||
                      value.split(" ")[1] == "08:00" ||
                      value.split(" ")[1] == "12:00" ||
                      value.split(" ")[1] == "16:00" ||
                      value.split(" ")[1] == "20:00"
                    ) {
                      return value.split(" ")[1].split(":")[0] + "ч";
                    }
                  } else {
                    if (value.split(" ")[1] == "01:00") {
                      return value.split(" ")[0];
                    }
                    if (
                      value.split(" ")[1] == "07:00" ||
                      value.split(" ")[1] == "13:00" ||
                      value.split(" ")[1] == "19:00"
                    ) {
                      return value.split(" ")[1].split(":")[0] + "ч";
                    }
                  }
                },
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontSize: "14",
                fontColor: "black",
              },
            },
          ],
        },
      },
    };
  },
  mounted() {
    Style(this.data).then((e) => {
      const f = 10;
      const f2 = 2;
      const f3 = 5;
      let minimum =
        this.data.type == "windspeed"
          ? Math.floor(Math.min.apply(null, this.data.values.s) / f) * f
          : Math.floor((Math.min.apply(null, this.data.values) - 1) / f3) * f3;

      let maximum;
      if (this.data.type == "windspeed") {
        if (this.data.values.r.length != 0) {
          maximum =
            Math.ceil(Math.max.apply(null, this.data.values.r) / f2 + 1) * f2;
        } else
          maximum =
            Math.ceil(Math.max.apply(null, this.data.values.s) / f2 + 1) * f2;
      }

      if (this.data.type == "pressure" || this.data.type == "humidity") {
        maximum =
          Math.ceil((Math.max.apply(null, this.data.values) + 5) / f3) * f3;
      }
      if (this.data.type == "temperature") {
        maximum = Math.ceil(Math.max.apply(null, this.data.values) / f) * f;
      }

      this.options.scales.yAxes[0].ticks.min = minimum;
      this.options.scales.yAxes[0].ticks.max = maximum;
      this.renderChart(e, this.options);
    });
  },
};
</script>