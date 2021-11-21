<template>
  <div class="container mt-2 mb-2 info-card">
    <div class="row justify-content-md-center" v-if="dn != 0">
      <div class="col-lg-4 meteostation">
        <h5 class="header bold color-of-institute">Метеостанция ИВМ СО РАН</h5>
        <div class="mb-0">
          <span>{{ dn.windspeed.time }}</span>
        </div>
        <div class="row mt-3">
          <div class="col-auto parameter">Температура:</div>
          <div class="col-auto bold">
            {{ dn.temperature }}<span class="designation">°C</span>
          </div>
        </div>
        <div class="row mt-3"><div class="col">Ветер</div></div>
        <div class="row p-0" v-if="dn.winddirect != -1">
          <div class="col-auto ml-3 p-0">
            <ul class="list-group">
              <li>скорость:</li>
              <li>порывы:</li>
              <li>направление:</li>
            </ul>
          </div>
          <div class="col-auto pr-0 ml-3">
            <ul class="list-group bold">
              <li v-if="dn.windspeed.s != 0">
                {{ dn.windspeed.s }} <span class="designation">м/с</span>
              </li>
              <li v-else>Штиль</li>
              <li>{{ dn.windspeed.r }} <span class="designation">м/с</span></li>
              <li v-if="dn.windspeed.s != 0">{{ dn.winddirect[1] }}</li>
              <li v-else>Отсутствует</li>
            </ul>
          </div>
          <div class="col-auto mr-0 pr-0">
            <img
              class="arrow"
              src="../assets/arrow.svg"
              v-bind:style="{ transform: rotate, display: display }"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              version="1.1"
            >
              <circle
                cx="40"
                cy="40"
                r="30"
                stroke="#4472c4"
                stroke-width="1"
                fill="none"
              />
              <line
                x1="40"
                y1="5"
                x2="40"
                y2="75"
                style="stroke: #4472c4; stroke-width: 1"
              />
              <line
                x1="5"
                y1="40"
                x2="75"
                y2="40"
                style="stroke: #4472c4; stroke-width: 1"
              />
              <line
                x1="15"
                y1="15"
                x2="65"
                y2="65"
                style="stroke: #4472c4; stroke-width: 1"
              />
              <line
                x1="15"
                y1="65"
                x2="65"
                y2="15"
                style="stroke: #4472c4; stroke-width: 1"
              />
            </svg>
          </div>
        </div>
        <div class="row mt-0" v-else>
          <div class="col ml-3">
            <span>Данные по ветру отсутствуют</span>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-auto parameter">Влажность:</div>
          <div class="col bold">
            {{ dn.humidity }} <span class="designation">%</span>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-auto parameter">Давление</div>
          <div class="col bold">
            {{ dn.pressure }} <span class="designation">мм рт. ст.</span>
          </div>
        </div>
        <div class="text-right archive mt-3">
          <a :href="`#${anchorA}`" @click="goToBlock">Архив данных...</a>
        </div>
      </div>
      <div class="col forecast">
        <div v-bind:class="[media ? 'text-left' : 'text-right']">
          <h5 class="header bold color-of-institute">
            Прогноз погоды в Красноярске
          </h5>
        </div>
        <div class="item">
          <span class="header italic color-of-institute bold"
            >Среднесибирское УГМС</span
          >
          <p class="text m-0 p-0" v-for="(t, index) in text.ugms" :key="index">
            <span class="bold">{{ t.time }}: </span>{{ t.value }}
          </p>
        </div>
        <div class="item mt-3">
          <span class="header italic color-of-institute bold"
            >Гидрометцентр России</span
          >
          <p
            class="text m-0 p-0"
            v-for="(t, index) in text.russia"
            :key="index"
          >
            <span class="bold">{{ t.time }}: </span>{{ t.value }}
          </p>
        </div>
        <div class="text-right">
          <a :href="`#${anchorF}`" @click="goToBlock">Подробнее...</a>
        </div>
      </div>
    </div>
    <div class="row" v-else><h5>Нет данных</h5></div>
  </div>
</template>

<script>
export default {
  props: ["dn", "text", "anchorA", "anchorF"],
  data() {
    return {
      media: false,
      rotate: `rotate(${
        Number(180) + Number(this.dn.winddirect ? this.dn.winddirect[0] : 0)
      }deg)`,
      display: this.dn.windspeed.s != 0 ? "visible" : "none",
    };
  },
  mounted() {
    const mediaQuery = window.matchMedia("(max-width: 1000px)");
    this.handleTabletChange(mediaQuery);
    mediaQuery.addListener(this.handleTabletChange);
  },
  methods: {
    goToBlock: function (event) {
      event.preventDefault();
      let link = event.target.getAttribute("href");
      document
        .querySelector(link)
        .scrollIntoView({ behavior: "smooth", block: "start" });
    },

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
.designation {
  color: gray;
}
/* .archive {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
} */
</style>
