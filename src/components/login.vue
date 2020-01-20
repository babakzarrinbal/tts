<template>
  <div id="loginview" class="d-flex justify-content-center align-items-center flex-column">
    <div v-if="loginerror" class="alert alert-danger alert-dismissible fade show">
      <strong>error!</strong> wrong username or password !
    </div>
    <div class="form-group">
      <div class="form-group">
        <label for="usr" class="float-left">Email:</label>
        <input type="email" v-model="credentials.email" class="form-control" id="usr" placeholder="Email">
      </div>
      <div class="form-group" style="position:relative">
        <label for="pass" class="float-left">Password:</label>
        <input
        id="pass"
          :type="showpass?'text':'password'"
          v-on:keyup.enter="loginrequest()"
          v-model="credentials.password"
          class="form-control"
          placeholder="Password"
        >
        <img
          v-if="credentials.password"
          class="seeimg"
          :src="'/img/icon/'+(showpass?'not':'')+'see.png'"
          style="position:absolute;right:6px;top:41px;height:20px;width:20px;"
          @click="showpass= !showpass"
        >
      </div>
      <div
        @click="loginrequest()"
        style="width:100%; position:relative"
        class="form-group btn btn-success"
      >
        Login
        <img v-if="loading" src="img/rings.svg" class="loader">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginerror: false,
      showpass: false,
      credentials: {
        email: null,
        password: null
      },
      loading: false
    };
  },
  methods: {
    loginrequest() {
      var _self = this;
      _self.loginerror = false;
      _self.loading = true;
      _self.socketcall("users/login", _self.credentials).then(result => {
        if (result.error || !result.data) {
          _self.loading = false;
          _self.loginerror = true;
          return window.localStorage.setItem("api_token", null);
        }
        window.localStorage.setItem("api_token", result.data.message);
        _self.socketreconnect();
      });
    }
  }
};
</script>
<style lang="scss">
#loginview {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  .loader {
    height: 41px;
    position: absolute;
    top: -2px;
    right: 10px;
  }
}
</style>