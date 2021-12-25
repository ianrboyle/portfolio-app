<template>
  <div class="industries-index">
    <main id="main" class="main">
      <div class="pagetitle">
        <h1>My Industries</h1>
        <nav>
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/home">Home</a></li>
            <li class="breadcrumb-item"><a href="/stocks">Positions</a></li>
            <li class="breadcrumb-item"><a href="/sectors">Sectors</a></li>
            <li class="breadcrumb-item active">Industries</li>
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
                <p></p>
                <!-- Table with stripped rows -->
                <table class="table datatable">
                  <thead>
                    <tr>
                      <th scope="col">Industry</th>
                      <th scope="col">Industry % of Account</th>
                      <th scope="col">Current Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="industry in industries" :key="industry.id">
                      <td v-if="industry.industry_value > 0" scope="row">
                        <router-link v-bind:to="`/industries/${industry.id}`">
                          <button type="button" class="btn btn-outline-primary">{{ industry.industry }}</button>
                        </router-link>
                      </td>
                      <td v-if="industry.industry_value > 0">{{ industry.industry_percent_of_account }}%</td>
                      <td v-if="industry.industry_value > 0">${{ industry.industry_value }}</td>
                    </tr>
                  </tbody>
                </table>
                <!-- End Table with stripped rows -->
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Industry % of Account</h5>

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
<style></style>
<script>
import axios from "axios";
import PieChart from "@/components/IndustriesIndexPie";

export default {
  components: {
    PieChart,
  },
  data: function () {
    return {
      message: "Your Industries:",
      industries: [],
    };
  },
  created: function () {
    this.indexSectors();
  },
  methods: {
    indexSectors: function () {
      axios.get("http://localhost:3000/industries").then((response) => {
        this.industries = response.data;
        console.log("Success! Industries data:", response.data);
      });
    },
  },
};
</script>
