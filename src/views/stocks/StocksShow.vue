<template>
  <!-- Eventually grab company price info and show chart -->
  <div class="stocks-show">
    <main id="main" class="main">
      <div class="pagetitle">
        <h1>{{ industry.industry }}</h1>
        <nav>
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/home">Home</a></li>
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

                <!-- Table with stripped rows -->
                <table class="table datatable">
                  <thead>
                    <tr>
                      <th scope="col">Symbol</th>
                      <th scope="col">Stock % of Industry</th>
                      <th scope="col">Current Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="stock in stocks" :key="stock.id">
                      <td scope="row">
                        <router-link v-bind:to="`/stocks/${stock.id}`">
                          <button type="button" class="btn btn-outline-primary">{{ stock.symbol }}</button>
                        </router-link>
                      </td>
                      <td>
                        {{ (((stock.quantity * stock.current_price) / industry.industry_value) * 100).toFixed(2) }}%
                      </td>
                      <td>${{ industry.industry_value }}</td>
                    </tr>
                  </tbody>
                </table>
                <!-- End Table with stripped rows -->
                <p>
                  <router-link v-bind:to="`/industries/${industry.id}/edit`">
                    <button type="button" class="btn btn-outline-success">Edit Sector</button>
                  </router-link>
                </p>
                <p><button class="btn btn-outline-danger" v-on:click="destroyIndustry()">Delete</button></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    Symbol: {{ stock.symbol }} | Company Name: {{ stock.company_name }} | Cost Basis: {{ stock.cost_basis }} | Current
    Price: {{ stock.current_price }} | Quantity: {{ stock.quantity }}
    <label>Current Total Value:</label>
    ${{ stock.current_total_value }}
    |
    <label>Percent of Account:</label>
    {{ stock.percent_of_account }}% |
    <label>Total Gain/Loss:</label>
    ${{ stock.total_gain_loss }}
    |
    <label>Sector:</label>
    {{ sector.sector }}
    |
    <label>Industry:</label>
    {{ industry.industry }}

    <div>
      <router-link v-bind:to="`/stocks/${stock.id}/edit`">
        <button type="button">Edit</button>
      </router-link>
      |
      <router-link v-bind:to="`/stocks`">
        <button type="button" class="btn btn-outline-success">My Stocks</button>
      </router-link>
      |
      <button class="btn btn-outline-danger" v-on:click="destroyStock()">Delete</button>
    </div>
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
export default {
  data: function () {
    return {
      stock: {},
      sector: {},
      industry: {},
    };
  },
  created: function () {
    axios.get("http://localhost:3000/stocks/" + this.$route.params.id).then((response) => {
      this.stock = response.data;
      this.sector = response.data.sector;
      this.industry = response.data.industry;
      console.log("Success", response.data, this.sector);
    });
  },
  methods: {
    destroyStock: function () {
      axios.delete("http://localhost:3000/stocks/" + this.$route.params.id).then((response) => {
        console.log(response.data);
        this.$router.push("/stocks");
      });
    },
  },
};
</script>
