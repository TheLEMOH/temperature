<template>
  <div class="row">
    <div class="col p-0 m-0" v-for="(value, index) in data.values" :key="index">
      <div class="row">
        <div class="col text-center">
          <img
            class="arrow-cardwind"
            v-bind:style="{
              transform: 'rotate(' + (Number(180) + value) + 'deg)',
            }"
            src="../assets/arrow2.svg"
          />
        </div>
      </div>
      <div class="row">
        <div class="col text-center direction">{{ toText(value) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { DirectionToText } from "../scripts/Download";
export default {
  props: ["data"],
  mounted() {},
  methods: {
    toText: function (numbers) {
      return DirectionToText(numbers);
    },
  },
};
</script>

<style>
.arrow-cardwind {
  -webkit-user-select: none;
  width: 50px;
  height: 50px;
}
.direction {
  font-size: 15px;
}
</style>