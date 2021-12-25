<template>
  <div class="industries-show">
    <main id="main" class="main">
      <div class="pagetitle">
        <h1>{{ industry.industry }}</h1>
        <nav>
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/home">Home</a></li>
            <li class="breadcrumb-item"><a href="/stocks">Positions</a></li>
            <li class="breadcrumb-item"><a href="/industries">Industries</a></li>
            <li class="breadcrumb-item active">{{ industry.industry }}</li>
          </ol>
        </nav>
      </div>
      <!-- End Page Title -->

      <section class="section">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Industry Info</h5>
                <p :key="industry.id">Current Allocation to {{ industry.industry }}: ${{ industry.industry_value }}</p>
                <!-- Table with stripped rows -->
                <table class="table datatable">
                  <thead>
                    <tr>
                      <th scope="col">Symbol</th>
                      <th scope="col">Current Value</th>
                      <th scope="col">% of Industry</th>
                      <th scope="col">% of Sector</th>
                      <th scope="col">% of Account</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="stock in stocks" :key="stock.id">
                      <td scope="row">
                        {{ stock.symbol }}
                      </td>
                      <td>${{ stock.current_total_value }}</td>
                      <td>{{ stock.stock_percent_of_industry }}%</td>
                      <td>{{ stock.stock_percent_of_sector }}%</td>
                      <td>{{ stock.percent_of_account }}%</td>
                    </tr>
                  </tbody>
                </table>
                <div class="col-lg-6">
                  <!-- Basic Modal -->
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#basicModal"
                  >
                    Delete Industry
                  </button>
                  <div class="modal fade" id="basicModal" tabindex="-1">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title">Delete Industry</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">Are you sure you wish to delete this industry?</div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          <router-link v-bind:to="`/industries`">
                            <button
                              type="button"
                              v-on:click="destroyIndustry()"
                              class="btn btn-danger"
                              data-bs-dismiss="modal"
                            >
                              Delete
                            </button>
                          </router-link>
                        </div>
                      </div>
                      <!-- End Basic Modal-->
                    </div>
                  </div>
                </div>
                <!-- End Table with stripped rows -->
                <!-- <p>
                  <router-link v-bind:to="`/industries/${industry.id}/edit`">
                    <button type="button" class="btn btn-outline-success">Edit Sector</button>
                  </router-link>
                </p> -->
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Stock % of {{ industry.industry }}</h5>

              <!-- Pie Chart -->
              <div id="pieChart" style="max-height: 500px">
                <pie-chart></pie-chart>
              </div>
              <!-- End Pie CHart -->
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
<style>
.card {
  margin: 0 auto;
  float: none;
  margin-bottom: 10px;
  color: black;
}
</style>
<script>
import axios from "axios";
import PieChart from "@/components/IndustriesShowPie";
export default {
  components: {
    PieChart,
  },
  data: function () {
    return {
      industry: {},
      stocks: [],
    };
  },
  created: function () {
    axios.get("http://localhost:3000/industries/" + this.$route.params.id).then((response) => {
      this.industry = response.data;
      this.stocks = response.data.stocks;
      console.log("Success", response.data, typeof this.stocks[0]["current_value"]);
    });
  },
  methods: {
    destroyIndustry: function () {
      axios.delete("http://localhost:3000/industries/" + this.$route.params.id).then((response) => {
        console.log(response.data);
        this.$router.push("/industries");
      });
    },
  },
};
</script>
