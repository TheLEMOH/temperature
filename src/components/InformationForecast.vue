<template>
  <div class="container-fluid">
    <div class="container-fluid style-of-institute">
      <h5 class="header bold mt-3">
        Прогноз погоды в Красноярске на три дня (Росгидромет)
      </h5>
    </div>
    <div class="container-fluid mt-3 mb-4">
      <div class="row">
        <div class="col-xl-6">
          <div class="row" v-for="(item, index) in df.slice(0, 3)" :key="index">
            <div class="col">
              <h5 class="bold text-center">{{ item.name }}</h5>
              <BarChart
                v-if="item.type == 'temperature'"
                :data="item"
                style="height: 350px"
                :forecast="true"
              />
              <BarChart
                :forecast="true"
                v-else
                :data="item"
                style="height: 200px"
              />
            </div>
          </div>
        </div>
        <div class="col-xl-6 row-flex">
          <div class="row" v-for="(item, index) in df.slice(3)" :key="index">
            <div class="col">
              <h5 class="bold text-center" v-if="item.type != 'winddirectcard'">
                {{ item.name }}
              </h5>
              <CardWind
                :data="item"
                v-if="item.type == 'winddirectcard'"
                class="displayCard mb-5"
              />
              <BarChart
                :data="item"
                :forecast="true"
                v-if="item.type == 'windspeed'"
                style="height: 350px"
              />
              <div
                class="row justify-content-center"
                v-if="item.type == 'winddirect'"
              >
                <div
                  class="col-sm-auto col-md-4 col-lg-3 col-xl-3 col-8"
                  v-for="(radarData, index) in item.values"
                  :key="index"
                >
                  <h6 class="text-center p-0 mt-3">
                    {{ item.time[index].split(" ")[0] }}
                  </h6>
                  <RadarChart
                    class="cardWindTest"
                    :data="{
                      time: item.time,
                      values: radarData,
                      type: item.type,
                      forecast: true,
                    }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BarChart from "./BarChart";
import RadarChart from "./RadarChart";
import CardWind from "./CardWind";
export default {
  props: ["df"],
  data() {
    return {
      media: false,
    };
  },
  components: {
    BarChart,
    RadarChart,
    CardWind,
  },
  mounted() {
    const mediaQuery = window.matchMedia("(max-width: 1040px)");
    this.handleTabletChange(mediaQuery);
    mediaQuery.addListener(this.handleTabletChange);
  },

  methods: {
    handleTabletChange(e) {
      if (e.matches) {
        this.media = true;
      } else {
        this.media = false;
      }
    },
  },
};
</script>

<style>
</style>