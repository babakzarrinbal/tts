<template>
  <div id="settings" @click="hideme()">
    <div class="window" v-on:click.stop>
      <div class="btn btn-danger" style="width: calc(100% - 10px);" @click="logout()">logout</div>
      <!-- <div>
        <input
          type="checkbox"
          id="id-name--1"
          name="set-name"
          class="switch-input"
          v-model="notificationStatus"
          @click="changeNotificationStatus()"
        >
        <label for="id-name--1" class="switch-label">
          Notifications
          <span class="toggle--on">On</span>
          <span class="toggle--off">Off</span>
        </label>
      </div>-->
      <div
        class="btn btn-warning mt-2"
        style="width: calc(100% - 10px);"
        @click="updateapp()"
      >Update/reset</div>
      <div
        class="btn btn-info mt-2"
        @click="showpassform = !showpassform"
        style="width: calc(100% - 10px);"
      >change password</div>
      <div v-if="showpassform" class="my-2 mx-auto" style="width: calc(100% - 10px);">
        <div class="form-group" style="position:relative">
          <input
            :type="showoldpass?'text':'password'"
            v-model="oldpass"
            class="form-control"
            placeholder="Old Password"
          >
          <img
            class="seeimg"
            :src="'/img/icon/'+(showoldpass?'not':'')+'see.png'"
            style="position:absolute;right:2px;top:4px;"
            @click="showoldpass= !showoldpass"
          >
        </div>
        <div class="form-group" style="position:relative">
          <input
            :type="shownewpass?'text':'password'"
            v-model="newpass"
            class="form-control"
            placeholder="New Password"
          >
          <img
            class="seeimg"
            :src="'/img/icon/'+(shownewpass?'not':'')+'see.png'"
            style="position:absolute;right:2px;top:4px;"
            @click="shownewpass= !shownewpass"
          >
        </div>
        <div class="btn btn-success mt-2" @click="savepassword()" style="width: calc(100% - 30px);">
          save
          <img v-if="savingpassword" style="margin:-15px 0;" src="img/rings.svg" class="loader">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "settings",
  data() {
    return {
      showpassform: false,
      shownewpass: false,
      showoldpass: false,
      savingpassword: false,
      oldpass: null,
      newpass: null
    };
  },
  created() {},
  methods: {
    hideme: function() {
      this.$emit("hide");
    },
    logout() {
      window.localStorage.setItem("api_token", null);
      this.$root.user = null;
      this.socketreconnect();
      this.hideme();
    },
    updateapp() {
      window.location.reload(true);
    },
    savepassword() {
      let _self = this;
      if (_self.savingpassword) return;
      if (!_self.newpass)
        return window.toastr.warning("new password is not filled");
      _self.savingpassword = true;
      _self
        .socketcall("users/changepass", {
          newpass: _self.newpass,
          oldpass: _self.oldpass
        })
        .then(result => {
          _self.savingpassword = false;
          if (result.error) {
            return window.toastr.error(
              (result.error || {}).message || "couldn't save new password"
            );
          }
          window.toastr.success("password changed!");
          _self.oldpass = null;
          _self.newpass = null;
          _self.showpassform = false;
        });
    }
  },
  computed: {}
};
</script>

<style scoped lang="scss">
#settings {
  width: 100vw;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 299;
  .window {
    float: right;
    height: 100%;
    padding-top: 20px;
    overflow: auto;
    width: 220px;
    background-color: #fff;
    box-shadow: -5px 2px 16px grey;
  }
}
</style>
