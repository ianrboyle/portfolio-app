<template>
  <div class="stocks-new">
    <main id="main" class="main">
      <div class="pagetitle">
        <h1>Add Positions</h1>
        <nav>
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Home</a></li>
            <li class="breadcrumb-item"><a href="/stocks">Positions</a></li>
            <li class="breadcrumb-item active">Add Position</li>
          </ol>
        </nav>
      </div>
      <!-- End Page Title -->

      <section class="section">
        <div class="row">
          <div class="col-lg-6">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Add A Position</h5>

                <!-- General Form Elements -->
                <form v-on:submit.prevent="createStock()">
                  <ul>
                    <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
                  </ul>
                  <div class="row mb-3">
                    <label for="inputText" class="col-sm-2 col-form-label">Symbol</label>
                    <div class="col-sm-10">
                      <input v-model="newStockParams.symbol" type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="inputText" class="col-sm-2 col-form-label">Cost Per Share</label>
                    <div class="col-sm-10">
                      <input v-model="newStockParams.cost_basis" type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="inputText" class="col-sm-2 col-form-label">Quantity</label>
                    <div class="col-sm-10">
                      <input type="text" v-model="newStockParams.quantity" class="form-control" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label class="col-sm-2 col-form-label">Submit Button</label>
                    <div class="col-sm-10">
                      <button type="submit" class="btn btn-primary">Submit Form</button>
                    </div>
                  </div>
                </form>
                <!-- End General Form Elements -->
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <!-- End #main -->
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: function () {
    return {
      message: "Add a company to your portfolio:",
      newStockParams: {},
      errors: [],
    };
  },
  methods: {
    createStock: function () {
      console.log("Creating a new stock");
      axios
        .post("http://localhost:3000/stocks/" + this.newStockParams.symbol, this.newStockParams)
        .then(() => {
          this.$router.push("/stocks");
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
  },
};
</script>
