<template>
  <div id="app">
    <Header v-bind:id="idHeader" />
    <div class="mt-3" v-if="loadCard == true">
      <Card
        :dn="lastNow"
        :text="textForecast"
        :anchorF="idForecast"
        :anchorA="idArchive"
      />
    </div>
    <div class="mt-3" v-if="loadNow == true">
      <InformationNow :dn="dataNow" v-bind:id="idArchive" />
    </div>
    <div class="mt-3" v-if="loadForecast == true">
      <InformationForecast :df="dataForecast" v-bind:id="idForecast" />
    </div>
    <div class="fixed-bottom m-1 text-right">
      <transition name="fade">
        <img
          src="./assets/arrow-back.svg"
          class="arrow-back"
          :href="`#${idHeader}`"
          @click="goToBlock"
          v-if="scrolled"
        />
        ></transition
      >
    </div>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Card from "./components/Card.vue";
import InformationNow from "./components/InformationNow.vue";
import InformationForecast from "./components/InformationForecast.vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { DownloadInformationNow } from "./scripts/Download";
import { DownloadInformationForecast } from "./scripts/Download";
import { DownloadTextForecast } from "./scripts/Download";
import { GetLastItems } from "./scripts/Download";
import { DownloadInformationLast } from "./scripts/Download";
import { DownloadInfomationWindDirection } from "./scripts/Download";
import { DownloadInfomationWindDirectionForecast } from "./scripts/Download";

export default {
  name: "App",
  data() {
    return {
      dataNow: "",
      dataForecast: "",
      loadNow: "",
      loadForecast: "",
      lastNow: "",
      lastForecast: "",
      textForecast: "",
      loadCard: "",
      idForecast: "forecast",
      idArchive: "archive",
      idHeader: "header",
      scrolled: false,
    };
  },
  async mounted() {
    /* Получение текстового прогноза */
    DownloadTextForecast().then((e) => {
      this.textForecast = e;
    });
    /* Получение данных за трое суток */
    DownloadInformationLast().then((e) => {
      GetLastItems(e).then((i) => {
        this.lastNow = i;
        this.loadCard = true;
      });
    });
    DownloadInformationNow().then((e) => {
      DownloadInfomationWindDirection().then((w) => {
        e[5] = w[5];
        this.dataNow = e;
        this.loadNow = true;
      });
    });
    /* получение прогноза на трое суток */
    DownloadInformationForecast().then((e) => {
      DownloadInfomationWindDirectionForecast().then((w) => {
        e[5] = w[5];
        this.dataForecast = e;
        this.loadForecast = true;
      });
    });
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.scrolled = window.scrollY > 460;
    },
    goToBlock: function (event) {
      event.preventDefault();
      let link = event.target.getAttribute("href");
      document
        .querySelector(link)
        .scrollIntoView({ behavior: "smooth", block: "start" });
    },
  },
  components: {
    Header,
    Card,
    InformationNow,
    InformationForecast,
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
.arrow-back {
  padding: 10px;
  background-color: #c0c0c0;
  border-radius: 25px;
}
.arrow-back:hover {
  cursor: pointer;
}
* {
  font-family: "Times New Roman", Times, serif;
  font-size: 18px;
}

li {
  list-style-type: none;
}

ul {
  height: 100%;
}

.forecast-left {
  border-left: grey solid 1px;
}
.forecast-top {
  padding-top: 10px;
  border-top: grey solid 1px;
}
.arrow {
  position: absolute;
  width: 80px;
  height: 80px;
}
.vl {
  border-left: 2px solid #575757;
  width: 0px; /* Use only border style */
  border: 1px inset;
}

.bold {
  font-weight: bold;
}

.color-of-institute {
  color: #4472c4;
}

.temperature {
  background-color: #dae3f3;
  border: 2px solid white;
  font-size: 22px;
  color: #4472c4;
}

.header {
  font-family: Arial, Helvetica, sans-serif;
}

.text {
  font-size: 18px;
}

.italic {
  font-style: italic;
}
.attribute {
  margin-top: 10px;
}
.parameter {
  width: 140px !important;
}
.wind-img {
  width: 100px;
  height: 100px;
}

.info-card {
  background-color: #f2f2f2;
  border-radius: 20px;
  border: grey solid 1px;
}

.forecast {
  border-left: grey solid 1px;
}

.style-of-institute {
  color: #4472c4;
  border-top: 3px solid #4472c4;
}

@media (max-width: 1000px) {
  .forecast {
    padding-top: 10px;
    border-top: grey solid 1px;
    border-left: grey solid 0px;
  }
}
.displayCard {
  visibility: visible;
}
@media (max-width: 800px) {
  .displayCard {
    visibility: hidden;
    display: none;
  }
}
</style>




