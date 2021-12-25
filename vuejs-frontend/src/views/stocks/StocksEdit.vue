<template>
  <div class="stocks-edit">
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
                <h5 class="card-title">Update Position</h5>

                <!-- General Form Elements -->
                <form v-on:submit.prevent="updateStock()">
                  <ul>
                    <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
                  </ul>
                  <div class="row mb-3">
                    <label for="inputText" class="col-sm-2 col-form-label">Position:</label>
                    <div class="col-sm-10">
                      <label for="inputText" class="col-sm-2 col-form-label">{{ currentStockParams.symbol }}</label>
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="inputText" class="col-sm-2 col-form-label">Cost Per Share</label>
                    <div class="col-sm-10">
                      <input v-model="currentStockParams.cost_basis" type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="inputText" class="col-sm-2 col-form-label">Quantity</label>
                    <div class="col-sm-10">
                      <input type="text" v-model="currentStockParams.quantity" class="form-control" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label class="col-sm-2 col-form-label">Update Position</label>
                    <div class="col-sm-10">
                      <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <!-- Basic Modal -->
                    <button
                      type="button"
                      class="btn btn-outline-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#basicModal"
                    >
                      Delete Position
                    </button>
                    <div class="modal fade" id="basicModal" tabindex="-1">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title">Delete Position</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                            Are you sure you wish to remove this position from your portfolio?
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <router-link v-bind:to="`/stocks`">
                              <button
                                type="button"
                                v-on:click="destroyStock()"
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
                </form>
                <!-- End General Form Elements -->
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: function () {
    return {
      message: "Update your portfolio:",
      currentStockParams: {},
      errors: [],
    };
  },
  created: function () {
    axios.get(`http://localhost:3000/stocks/${this.$route.params.id}`).then((response) => {
      console.log("My Stock: ", response.data);
      this.currentStockParams = response.data;
    });
  },
  methods: {
    updateStock: function () {
      console.log("Creating a new stock");
      axios
        .patch(`http://localhost:3000/stocks/${this.currentStockParams.symbol}`, this.currentStockParams)
        .then((response) => {
          this.currentStockParams = response.data;
          this.$router.push(`/stocks`);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    destroyStock: function () {
      axios.delete("http://localhost:3000/stocks/" + this.$route.params.id).then((response) => {
        console.log(response.data);
        this.$router.push("/stocks");
      });
    },
  },
};
</script>
