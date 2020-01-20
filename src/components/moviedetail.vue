<template>
  <div id="maincontainer">
    <div class="btn close" @click="$emit('hide')">X</div>
    <div class="videocontainer">
      <video :src="currentlink" controls></video>
    </div>
    <div class="detail">
      <div class="title">{{movie.title}}</div>
      <a href="http://fdc5.berlincloud.pw/storage/26/Power.S06E02.480p.WEB-DL.Hastidl.mkv">downloadlink</a>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentlink: "http://fdc5.berlincloud.pw/storage/26/Power.S06E01.480p.WEB-DL.Hastidl.mkv"
    };
  },
  components: {},
  async created() {
    window.requestFileSystem =
      window.requestFileSystem || window.webkitRequestFileSystem;

    window.webkitStorageInfo.requestQuota(
      window.PERSISTENT,
      1024 * 1024,
      function(grantedBytes) {
        window.requestFileSystem(
          window.PERSISTENT,
          grantedBytes,
          console.log,
          console.error
        );
      },
      console.error
    );
  },
  methods: {},
  watch: {},
  computed: {
    movie() {
      return this.$root.movie;
    }
  }
};
</script>
<style scoped lang="scss">
#maincontainer {
  width: 100vw;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background: white;
}
.btn.close {
  color: white;
}
.videocontainer {
  width: 100%;
  min-height: 300px;
  max-height: 50%;
  background: black;
  video {
    max-width: 100%;
    height: 100%;
  }
}
</style>