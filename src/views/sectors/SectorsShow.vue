<template>
  <div class="sectors-show">
    <main id="main" class="main">
      <div class="pagetitle">
        <h1>{{ sector.sector }}</h1>
        <nav>
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/home">Home</a></li>
            <li class="breadcrumb-item"><a href="/sectors">Sectors</a></li>
            <li class="breadcrumb-item active">{{ sector.sector }}</li>
          </ol>
        </nav>
      </div>
      <!-- End Page Title -->

      <section class="section">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Sector Info</h5>

                <!-- Table with stripped rows -->
                <table class="table datatable table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Industry</th>
                      <th scope="col" :key="sector.id">% of {{ sector.sector }}</th>
                      <th scope="col">Industry Value</th>
                      <th scope="col">% of Account</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="industry in industries" :key="industry.id">
                      <td scope="row">
                        <router-link v-bind:to="`/industries/${industry.industry_id}`">
                          <button type="button" class="btn btn-outline-primary">{{ industry.industry }}</button>
                        </router-link>
                      </td>
                      <td>{{ industry.industry_percent }}%</td>
                      <td>${{ ((industry.industry_percent * sector.sector_value) / 100).toFixed(2) }}</td>

                      <td>{{ ((industry.industry_percent * sector.sector_value) / accountValue).toFixed(2) }}%</td>
                    </tr>
                  </tbody>
                  <!-- <p>
                  <router-link v-bind:to="`/sectors/${sector.id}/edit`">
                    <button type="button" class="btn btn-outline-success">Edit Sector</button>
                  </router-link>
                </p> -->
                </table>
                <!-- End Table with stripped rows -->
                <div class="col-lg-6">
                  <!-- Basic Modal -->
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#basicModal"
                  >
                    Delete Sector
                  </button>
                  <div class="modal fade" id="basicModal" tabindex="-1">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title">Delete Sector</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">Are you sure you wish to delete this sector?</div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          <router-link v-bind:to="`/sectors`">
                            <button
                              type="button"
                              v-on:click="destroySector()"
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
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Industry % of Sector</h5>

                <!-- Pie Chart -->
                <div id="pieChart" style="max-height: 500px">
                  <pie-chart></pie-chart>
                </div>

                <!-- End Pie CHart -->
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Stock % of Sector</h5>

                <!-- Pie Chart -->
                <div id="pieChart" style="max-height: 500px">
                  <StockPercentOfSectorPie />
                </div>

                <!-- End Pie CHart -->
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
<style></style>

<script defer>
import axios from "axios";
import PieChart from "@/components/SectorsShowPie";
import StockPercentOfSectorPie from "@/components/StockPercentOfSectorPie";
export default {
  components: {
    PieChart,
    StockPercentOfSectorPie,
  },
  data: function () {
    return {
      sector: {},
      stocks: [],
      industries: [],
      accountValue: 0,
    };
  },
  created: function () {
    axios.get("http://localhost:3000/sectors/" + this.$route.params.id).then((response) => {
      this.sector = response.data;
      this.stocks = response.data.stocks;
      this.industries = response.data.industry_percent_of_sector;
      this.accountValue = this.stocks[0].current_account_value;
    });
  },
  methods: {
    destroySector: function () {
      axios.delete("http://localhost:3000/sectors/" + this.$route.params.id).then((response) => {
        console.log(response.data);
        this.$router.push("/sectors");
      });
    },
  },
};
</script>
