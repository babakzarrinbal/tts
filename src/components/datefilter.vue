<template>
  <div class="float-left" style="width:calc(100% - 50px);">
    <div class="filters d-flex flex-column">
      <div class="simpledatefilter">
        <div class="form-group mb-0">
          <select
            @click="showcustomfilter = simplefilterval=='custom'"
            @change="simplefilter()"
            v-model="simplefilterval"
            class="form-control float-left bg-transparent border-0"
            style="height:30px;width:130px;box-shadow:none;"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="thisweek">This week</option>
            <option value="pastweek">Past week</option>
            <option value="thismonth">This Month</option>
            <option value="pastmonth">Past Month</option>
            <option value="custom" style="background-color:#fae0fb;font-weight:bold;">Custom</option>
          </select>
          <div
            class="btn-link small text-right mt-1 float-left ml-2"
            @click="showfiltersetting = !showfiltersetting"
          >Setting</div>
        </div>
      </div>

      <div
        class="datepicker d-flex m-2 pb-2"
        :class="{'border-bottom border-primary':showfiltersetting && showcustomfilter }"
        v-if="showfiltersetting"
      >
        <span style="width:150px;text-align:left;">Day split time:</span>
        <datetime
          type="time"
          inputClass="timeinput"
          v-model="filterdates.daystarttime"
          use12-hour
          format="hh:mm a"
        ></datetime>
      </div>
      <div class="customdatefilter m-2" v-if="showcustomfilter">
        <div class>
          <div class="datepicker d-flex mt-2">
            <span style="width:100px;text-align:left;">From:</span>
            <datetime
              class="dateinput"
              inputClass="dateinput"
              type="datetime"
              v-model="filterdates.startdate"
              format="ccc MMM dd, yyyy  HH:mm"
            ></datetime>
          </div>
          <div class="datepicker d-flex mt-2">
            <span style="width:100px;text-align:left;">To:</span>
            <datetime
              v-on:click.stop
              inputClass="dateinput"
              type="datetime"
              v-model="filterdates.finishdate"
              format="ccc MMM dd, yyyy  HH:mm"
            ></datetime>
          </div>
        </div>
        <div class="btn btn-info mt-4" style="min-width:50%;" @click="filtershifts()">Apply</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Datetime } from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";
export default {
  name: "datefilter",
  data() {
    return {
      filterdates: {
        finishdate: new Date().toISOString(),
        daystarttime: new Date("1 1 2019 6:00 am").toISOString(),
        startdate: new Date(
          new Date().setHours(
            new Date("1 1 2019 6:00 am").getHours(),
            new Date("1 1 2019 6:00 am").getMinutes(),
            0,
            0
          )
        ).toISOString()
      },
      showcustomfilter: false,
      showfiltersetting: false,
      simplefilterval: "today"
    };
  },
  components: {
    Datetime
  },
  async created() {
    let td = new Date(this.filterdates.startdate);
    if (td > new Date())
      this.filterdates.startdate = new Date(
        td.getTime() - 86400000
      ).toISOString();
    this.filtershifts();
  },
  async beforeDestroy() {},
  methods: {
    simplefilter() {
      let du = this.simplefilterval;
      if (du == "custom") return;
      let n = new Date();
      let dst = new Date(this.filterdates.daystarttime);
      let td = new Date(
        new Date().setHours(dst.getHours(), dst.getMinutes(), 0, 0)
      );
      if (n < td) td.setDate(td.getDate() - 1);
      if (du == "today") {
        this.filterdates.startdate = td.toISOString();
        this.filterdates.finishdate = n.toISOString();
      } else if (du == "yesterday") {
        let yd = new Date(td.getTime());
        yd.setDate(td.getDate() - 1);
        this.filterdates.startdate = yd.toISOString();
        this.filterdates.finishdate = td.toISOString();
      } else if (du == "thisweek") {
        let tw = new Date(td.getTime());
        tw.setDate(td.getDate() - td.getDay() + 1);
        if (n < tw) tw.setDate(tw.getDate() - 7);
        this.filterdates.startdate = tw.toISOString();
        this.filterdates.finishdate = n.toISOString();
      } else if (du == "pastweek") {
        let tw = new Date(td.getTime());
        tw.setDate(td.getDate() - td.getDay() + 1);
        if (n < tw) tw.setDate(tw.getDate() - 7);
        let pw = new Date(td.getTime());
        pw.setDate(tw.getDate() - 7);
        this.filterdates.startdate = pw.toISOString();
        this.filterdates.finishdate = tw.toISOString();
      } else if (du == "thismonth") {
        let tm = new Date(
          td.getFullYear(),
          td.getMonth(),
          1,
          td.getHours(),
          td.getMinutes(),
          0
        );

        this.filterdates.startdate = tm.toISOString();
        this.filterdates.finishdate = n.toISOString();
      } else if (du == "pastmonth") {
        let tm = new Date(
          td.getFullYear(),
          td.getMonth(),
          1,
          td.getHours(),
          td.getMinutes(),
          0
        );
        let thismonth = td.getMonth();
        let pm = new Date(
          td.getFullYear() - (!thismonth ? 1 : 0),
          !thismonth ? 12 : td.getMonth() - 1,
          1,
          td.getHours(),
          td.getMinutes(),
          0
        );
        this.filterdates.startdate = pm.toISOString();
        this.filterdates.finishdate = tm.toISOString();
      }
      this.filtershifts();
    },
    filtershifts() {
      this.showcustomfilter = false;
      this.showfiltersetting = false;
      this.$emit("changed", this.filterdates);
    }
  },
  computed: {},
  watch: {}
};
</script>
<style lang="scss">
.vdatetime-calendar__month {
  min-height: 312px;
}
.vdatetime-calendar__month__weekday,
.vdatetime-calendar__current--month,
.vdatetime-popup__date,
.vdatetime-popup__year {
  user-select: none;
}

.vdatetime-input {
  border: none;
  border-bottom: 1px solid blue;
}

.dateinput {
  font-family: monospace;
  font-size: 14px;
  width: 200px;
  background: transparent;
  cursor: pointer;
}
.timeinput {
  width: 70px;
  background: transparent;
  cursor: pointer;
}
</style>
