<template>
  <div class="container">
    <div>
      <br />
      <div v-if="!drivers.length" class="alert alert-warning">No Record for this Time Period</div>
      <div v-for="d in drivers" :key="d._id" class="list-group mb-3">
        <div
          class="d-flex flex-column bz-card bg-light"
          @click="tmp_id= tmp_id==d._id ?  null : d._id;$event.target.scrollIntoView(true);"
        >
          <div class="p-4">
            <div
              style="border-bottom:1px solid gray;"
              class="d-flex flex-wrap mb-3 pb-2 text-left justify-content-between"
            >
              <div class>
                <strong>{{d.name}}</strong>
              </div>
              <div class v-on:click.stop>
                <a :href="'tel:' + d.phone">Call</a>
              </div>
            </div>
            <div class="d-flex small flex-wrap justify-content-between text-left">
              <div class>
                <strong>Total Hours:</strong>
                {{d.total_hours}}
              </div>
              <div class>
                <strong>Total Milage (km):</strong>
                {{d.milage_traveled}}
              </div>
              <!-- </div>
              <div class="row text-left">-->
              <div class>
                <strong>Cost Per Drop (£):</strong>
                {{d.cost_per_drop}}
              </div>
              <div class>
                <strong>Total Cost (£):</strong>
                {{d.total_cost}}
              </div>
              <div class>
                <strong>Total Orders:</strong>
                {{d.total_orders}}
              </div>
            </div>
          </div>

          <div v-if="tmp_id == d._id" class style="background: #ffef96">
            <div
              v-for="(s, i) in d.shifts"
              :key="i"
              class="small text-left d-flex flex-column flex-wrap p-2 justify-content-between rounded border-bottom border-danger"
            >
              <div class="m-1">
                <strong>Date:</strong>
                {{s.shift_day}}
              </div>
              <div class="d-flex flex-wrap justify-content-between mb-2">
                <div class="m-1">
                  <strong>From:</strong>
                  {{s.started_at}}
                </div>
                <div class="m-1">
                  <strong>To:</strong>
                  {{s.finished_at}}
                </div>
              </div>
              <div class="d-flex flex-wrap justify-content-between">
                <div class="m-1">
                  Cost (£):
                  {{s.shift_cost}}
                </div>
                <div class="m-1">
                  Deliveries:
                  {{s.order_qty}}
                </div>
              </div>
              <div class="d-flex flex-wrap justify-content-between">
                <div class="m-1">
                  Order Milage (km):
                  {{s.orders_milage}}
                </div>
                <div class="m-1">
                  Milage Traveled (km):
                  {{s.milage_traveled}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Drivers",
  data() {
    return {
      tmp_id: ""
    };
  },
  async beforeDestroy() {},
  methods: {},
  computed: {
    drivers() {
      let resdrivers = ((this.$root.mainData || {}).drivers || [])
        .map(d => {
          let dshifts = ((this.$root.mainData || {}).shifts || []).filter(
            s => s.driver == d._id
          );

          let shifts = [];
          let total_hours = 0;
          let total_cost = 0;
          let cost_per_drop = 0;
          let orders_milage = 0;
          let milage_traveled = 0;
          let total_orders = 0;
          let thistime = new Date();

          //loop through driver shifts
          for (let dso of dshifts) {
            let ds = { ...dso };
            // ds.orders.delivered = ds.orders.delivered.map(oid =>
            //   (this.$root.mainData || {}).orders.find(o => o._id == oid)
            // );
            // dso.shift_ordermilage = ds.orders.delivered.reduce((c,o)=>,0);
            let shiftDuration =
              ((ds.finished_at ? new Date(ds.finished_at) : thistime) -
                new Date(ds.started_at)) /
              3600000;
            ds.shift_cost = Math.bzround(
              shiftDuration * ((ds.payment_group || {}).per_hour || 0) +
                (ds.orders.delivered || []).length *
                  ((ds.payment_group || {}).per_order || 0) +
                ds.orders_milage *
                  0.621371 *
                  ((ds.payment_group || {}).per_mile || 0),
              2
            );
            ds.order_qty = ((ds.orders || {}).delivered || []).length;
            ds.shift_hours = Math.bzround(shiftDuration, 2);
            ds.shift_day = new Date(ds.started_at).format("mm dd yyyy");
            let startDate = new Date(ds.started_at);
            ds.started_at = startDate.format("HH:MM");
            let finishdate = ds.finished_at ? new Date(ds.finished_at) : null;
            if (finishdate) {
              let finishdatediff = finishdate.getDay() - startDate.getDay();
              ds.finished_at = finishdatediff
                ? finishdatediff == 1
                  ? finishdate.format("HH:MM") + " Next Day"
                  : finishdate.format("HH:MM @ mm/dd")
                : finishdate.format("HH:MM");
            } else {
              ds.finished_at = "now";
            }

            total_hours += shiftDuration;
            total_cost += ds.shift_cost;
            total_orders += ds.order_qty;
            orders_milage += ds.orders_milage;
            milage_traveled += ds.milage_traveled;
            ds.orders_milage = Math.bzround(ds.orders_milage, 2);
            ds.milage_traveled = Math.bzround(ds.milage_traveled, 2);
            shifts.push(ds);
          }
          cost_per_drop = total_orders ? total_cost / total_orders : 0;
          return {
            ...d,
            shifts: shifts,
            name: d.username || "" + " " + d.lastname || "",
            phone: d.phone.code + d.phone.number,
            total_cost: Math.bzround(total_cost, 2),
            total_orders: Math.bzround(total_orders, 2),
            cost_per_drop: Math.bzround(cost_per_drop, 2) || 0,
            total_hours: Math.bzround(total_hours, 2),
            orders_milage: Math.bzround(orders_milage, 2),
            milage_traveled: Math.bzround(milage_traveled, 2)
          };
        })
        .sort((a, b) => (a.total_hours > b.total_hours ? -1 : 1));
      // console.log(resdrivers);
      return resdrivers;
    }
  }
};
</script>
