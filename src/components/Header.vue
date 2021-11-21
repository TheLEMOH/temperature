<template>
  <section class="container-fluid style-of-institute-header">
    <nav class="nav navbar-expand-lg nopm">
      <ul class="nav align-items-center">
        <li class="nav-item m-1">
          <a href="http://icm.krasn.ru/">
            <img class="navbar-brand img" src="../assets/ivm.gif" />
          </a>
        </li>
        <li class="nav-item m-1" v-if="media == false">
          <p class="bold bg-size">Метеоинформация ИВМ СО РАН</p>
          <span class="street">г. Красноярск, Академгородок</span>
        </li>
        <li class="nav-item m-1" v-else>
          <p class="bold medium-size">Метеоинформация</p>
          <span class="medium-size">г. Красноярск</span>
        </li>
      </ul>
    </nav>
  </section>
</template>

<script>
export default {
  data() {
    return {
      whoActive: 1,
      active: "t-card-active",
      notActive: "t-card",
      media: false,
    };
  },
  mounted() {
    const mediaQuery = window.matchMedia("(max-width: 700px)");
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
    selectCard: function (id) {
      this.whoActive = id;
      this.$emit("change-card", id);
    },
  },
};
</script>

<style scoped>
* {
  padding: 0 !important;
  margin: 0 !important;
}

li {
  line-height: 1.3em;
  padding: 0 !important;
  margin: 0 !important;
  margin-right: 10px !important;
  margin-left: 10px !important;
}
ul {
  padding: 0 !important;
  margin: 0 !important;
}

.style-of-institute-header {
  color: #4472c4;
  padding: 0px;
  margin: 0px;
  border-bottom: 3px solid #4472c4;
}

.bg-size {
  font-size: 1.3em;
}

.medium-size {
  font-size: 1.1em;
}

.street {
  font-size: 1.3em;
}

.img {
  margin-left: 10px !important;
  height: 60px;
  width: 70px;
  padding: 5px !important;
}
</style>