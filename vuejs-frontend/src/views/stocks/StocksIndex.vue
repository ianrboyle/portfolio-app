<template>
  <div class="stocks-index">
    <main id="main" class="main">
      <div class="pagetitle">
        <h1>My Positions</h1>
        <nav>
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/home">Dashboard</a></li>
            <li class="breadcrumb-item active"><a href="/sectors">Sectors</a></li>
            <li class="breadcrumb-item active"><a href="/industries">Industries</a></li>
          </ol>
        </nav>
      </div>
      <!-- End Page Title -->

      <section class="section">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Positions</h5>
                <p>
                  <router-link v-bind:to="`/stocks/new`">
                    <button type="button" class="btn btn-outline-primary">Add a Position!</button>
                  </router-link>
                </p>
                <p>Current Account Value: ${{ currentAccountValue }}</p>
                <!-- Table with stripped rows -->
                <table class="table datatable">
                  <thead>
                    <tr>
                      <th scope="col">Symbol</th>
                      <th scope="col">Current Price</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Cost Per Share</th>
                      <th scope="col">Current Value</th>
                      <th scope="col">Total Gain/Loss $</th>
                      <th scope="col">Total Gain/Loss %</th>
                      <th scope="col">% of Account</th>
                      <th scope="col">Sector</th>
                      <th scope="col">Industry</th>
                      <th scope="col">Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="stock in stocks" :key="stock.id">
                      <td scope="row">{{ stock.symbol }}</td>
                      <td>${{ stock.current_price }}</td>
                      <td>{{ stock.quantity }}</td>
                      <td>${{ stock.cost_basis }}</td>
                      <td>${{ stock.current_total_value }}</td>
                      <td>${{ stock.total_gain_loss }}</td>
                      <td>{{ stock.total_gain_loss_percent }}%</td>
                      <td>{{ stock.percent_of_account }}%</td>
                      <td>
                        <router-link v-bind:to="`/sectors/${stock.sector.id}`">
                          <button type="button" class="btn btn-outline-primary">{{ stock.sector.sector }}</button>
                        </router-link>
                      </td>
                      <td>
                        <router-link v-bind:to="`/industries/${stock.industry.id}`">
                          <button type="button" class="btn btn-outline-primary">{{ stock.industry.industry }}</button>
                        </router-link>
                      </td>
                      <td>
                        <router-link v-bind:to="`/stocks/${stock.id}/edit`">
                          <button type="button" class="btn btn-outline-primary">Edit</button>
                        </router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <!-- End Table with stripped rows -->
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <!-- End #main -->
  </div>
</template>
<style></style>
<script>
import axios from "axios";
export default {
  data: function () {
    return {
      message: "Your Stocks:",
      stocks: [],
      currentAccountValue: 0,
    };
  },
  created: function () {
    this.indexStocks();
  },
  methods: {
    indexStocks: function () {
      axios.get("http://localhost:3000/stocks").then((response) => {
        this.stocks = response.data;
        this.currentAccountValue = this.stocks[0].current_account_value;
        console.log("Success! Stocks data:", response.data, this.currentAccountValue);
      });
    },
  },
};
</script>
