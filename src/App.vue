<template>
  <transition name="opacity">
    <div id="app" style="widht:100vw;height:100%;" v-if="userresolved">
      <div id="mainloader"></div>
      <login v-if="!$root.user"></login>
      <div v-else style="position:relative;height:100%">
        <div id="header">
          <div
            class="float-right"
            style="float:right;height:30px;width:30px;padding:4px;"
            @click="settingvis = true"
          >
            <img src="img/icons/menu.png" style="height:calc(100% - 6px);padding:0 3px;" alt />
          </div>
          <div class="clearfix"></div>
        </div>
        <transition name="slideleft">
          <settings v-if="settingvis" v-on:hide="settingvis =0"></settings>
        </transition>
        <transition name="slideleft">
          <moviedetail v-if="$root.showmoviedetail" v-on:hide="$root.showmoviedetail =0"></moviedetail>
        </transition>

        <transition :name="'component-'+transisionname">
          <keep-alive>
            <router-view
              v-if="$route.meta.keepAlive"
              id="pagecontainer"
              class="container mainrouteview"
            />
          </keep-alive>
        </transition>
        <!-- <div id="nav" class="d-flex justify-content-around">
          <a
            @click="nav($event,'/')"
            v-bind:class="{'router-link-exact-active router-link-active':$route.meta.mainindex==1}"
          >
            <img src="img/icon/list.png" alt />
          </a>
          <a
            @click="nav($event,'/drivers')"
            v-bind:class="{'router-link-exact-active router-link-active':$route.meta.mainindex==2}"
          >Drivers</a>
          <a
            @click="nav($event,'/tts')"
            v-bind:class="{'router-link-exact-active router-link-active':$route.meta.mainindex==3}"
          >TTS</a>
        </div> -->
      </div>
    </div>
  </transition>
</template>
<script>
import login from "@/components/login.vue";
import settings from "@/components/settings.vue";
import moviedetail from "@/components/moviedetail.vue";
export default {
  data() {
    return {
      userresolved: false,
      settingvis: false,
      transisionname: "slideleft"
    };
  },
  components: {
    login,
    settings,
    moviedetail
  },
  async created() {
    // connect to native app on ios or android
    let _self = this;
    // _self.$root.google = await gmapsInit();
    _self.getuser();
  },
  methods: {
    getuser() {
      let _self = this;
      _self.$root.user = {};
      _self.userresolved = true;
      let preloader = document.getElementById("preloader");
      if (preloader) {
        let eventfunc = () => {
          window.clearTimeout(timer);
          preloader && preloader.parentNode.removeChild(preloader);
          preloader = null;
        };
        let timer = window.setTimeout(eventfunc, 3000);
        preloader.addEventListener("transitionend", eventfunc);
        document.getElementById("preloader").style.opacity = 0;
      }
    },
    nav(e, topa) {
      var thisindex = this.$route.meta.mainindex;
      var targetindex = this.$router.resolve(topa).route.meta.mainindex;
      if (thisindex === targetindex) {
        return;
      }
      this.transisionname =
        thisindex > targetindex ? "slideright" : "slideleft";
      this.$router.push(topa);
    },
    async queryhandeler(q) {
      // console.log("new query", q);
      let data = q.type == "string" ? JSON.parse(q.data) : q;
      if (!data) return;
      // let d = { ...data };
      let router = this.$router;
      router.replace({
        ...router.currentRoute,
        query: null
      });

      // if (d.type == "neworder") {
      // }
      // if (d.type == "stepupdated") {
      // }
      // if (d.type == "userandstepupdated") {
      // }
    }
  },
  watch: {},
  computed: {}
};
</script>
<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: white;
  overflow: hidden;
}

#header {
  // height: 30px;
  background-color: #f72f61;
  z-index: 99;
  position: absolute;
  width: 100%;
  top: 0;
}
#nav {
  // padding: 10px;
  height: 35px;
  z-index: 99;
  position: absolute;
  width: 100%;
  bottom: 0;
  background: white;
  box-shadow: -1px -2px 13px 0px grey;
  a {
    cursor: pointer;
    font-weight: bold;
    color: #2c3e50;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0;
    &:not(:last-of-type) {
      border-right: 1px solid gray;
    }
    &.router-link-exact-active {
      color: #42b983;
      background: #6f6f6f1c;
    }
  }
}
.trancontainer {
  position: absolute;
  width: 100%;
  overflow: hidden;
}
.mainrouteview {
  height: 100%;
  // height: calc(100% - 35px);
  padding-top: 30px;
  overflow: auto;
  position: relative;
}
</style>
