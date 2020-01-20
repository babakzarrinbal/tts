<template>
  <div class="home container">
    <div class="movielistcontainer">
      <div
        v-for="m in movies"
        :key="m._id"
        class="d-flex movie bz-card"
        @click="$root.movie = m;$root.showmoviedetail = true"
      >
        <div class="movie-img-container">
          <img :src="m.img" alt />
        </div>
        <div class="description">
          <div class="header">
            <span>{{m.year}}</span>
            <span v-if="m.toyear">- {{m.toyear}}</span>
            <span>{{" "+m.title}}</span>
          </div>
          <div class="body">
            <a
              :href="'https://imdb.com/title/'+m.imdbid"
              target="_blank"
              v-on:click.stop
            >IMDB Rate: {{m.imdbrate}}</a>
            <span>country: {{(m.countries||[]).join(", ")}}</span>
            <span v-if="(m.stars||[]).length">stars: {{(m.stars||[]).join(", ")}}</span>
            <span v-if="m.summery">
              <strong>Description:</strong>
              {{m.summery}}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      movies: [],
      imdbid: "",
      // window
    };
  },
  async created() {
    // this.movies = await window
    //   .fetch("db/movies/list/lastupdated/1.json", { cache: "no-cache" })
    //   .then(res => res.json());
    this.movies = await this.get(
      "movies/list/lastupdated/1.json",
      {},
      { cache: "no-cache" }
    );
  },
  mounted() {},
  async beforeDestroy() {},
  methods: {},
  computed: {}
};
</script>

<style scoped lang="scss">
.title {
  font-size: 2rem;
  color: white;
  padding: 30px;
}
.movielistcontainer {
  .movie {
    margin-top: 15px;
    height: 150px;
    overflow: hidden;
    .movie-img-container {
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100px;
    }
    .description {
      padding-left: 15px;
      .header {
        line-height: 18px;
        padding: 5px 0;
        text-align: left;
        font-size: 18px;
        font-weight: bold;
      }
      .body {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        font-size: 14px;
        text-align: left;
      }
    }
  }
}
</style>
