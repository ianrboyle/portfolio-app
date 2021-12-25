<template>
  <div class="home">
    <main id="main" class="main">
      <h1>My Dashboard</h1>
      <section v-if="stocks.length > 0">
        <div class="row">
          <!-- Left side columns -->
          <div class="col-lg-8">
            <div class="row">
              <!-- Sales Card -->
              <div class="col-xxl-4 col-md-6">
                <div class="card info-card sales-card">
                  <div class="card-body">
                    <h5 class="card-title">
                      Current Account Value
                      <span>| {{ historicals[historicals.length - 1].date }}</span>
                    </h5>
                    <button @click="reloadPage" v-on:click="updateHistorical()" class="btn btn-outline-primary">
                      Update
                    </button>
                    <div class="d-flex align-items-center">
                      <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                        <i class="bi bi-currency-dollar"></i>
                      </div>
                      <div class="ps-3">
                        <h6>{{ historicals[historicals.length - 1].portfolio_value }}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- End Sales Card -->

              <!-- Revenue Card -->
              <div class="col-xxl-4 col-md-6">
                <div class="card info-card revenue-card">
                  <!-- <div class="filter">
                    <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                    <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                      <li class="dropdown-header text-start">
                        <h6>Filter</h6>
                      </li>

                      <li><a class="dropdown-item" href="#">Today</a></li>
                      <li><a class="dropdown-item" href="#">This Month</a></li>
                      <li><a class="dropdown-item" href="#">This Year</a></li>
                    </ul>
                  </div> -->

                  <div class="card-body">
                    <h5 class="card-title">
                      % Gain/Loss
                      <span>| 24hr</span>
                    </h5>

                    <div class="d-flex align-items-center">
                      <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                        <i class="bi bi-percent"></i>
                      </div>
                      <div class="ps-3">
                        <div v-if="historicals[historicals.length - 1].day_gain_loss_percent > 0">
                          <h6>${{ historicals[historicals.length - 1].day_gain_loss }}</h6>
                          <span class="text-success small pt-1 fw-bold">
                            {{ historicals[historicals.length - 1].day_gain_loss_percent }}%
                          </span>
                          <span class="text-muted small pt-2 ps-1">increase</span>
                        </div>
                        <div v-if="historicals[historicals.length - 1].day_gain_loss_percent < 0">
                          <h6>${{ historicals[historicals.length - 1].day_gain_loss }}</h6>
                          <span class="text-danger small pt-1 fw-bold">
                            {{ historicals[historicals.length - 1].day_gain_loss_percent }}%
                          </span>
                          <span class="text-muted small pt-2 ps-1">decrease</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- End Revenue Card -->

              <!-- Customers Card -->
              <div class="col-xxl-4 col-md-6">
                <div class="card info-card revenue-card">
                  <div class="card-body">
                    <h5 class="card-title">
                      % Gain/Loss
                      <span>| 1mo</span>
                    </h5>

                    <div class="d-flex align-items-center">
                      <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                        <i class="bi bi-percent"></i>
                      </div>
                      <div class="ps-3">
                        <div v-if="historicals[historicals.length - 1].month_gain_loss_percent > 0">
                          <h6>${{ historicals[historicals.length - 1].month_gain_loss }}</h6>
                          <span class="text-success small pt-1 fw-bold">
                            {{ historicals[historicals.length - 1].month_gain_loss_percent }}%
                          </span>
                          <span class="text-muted small pt-2 ps-1">increase</span>
                        </div>
                        <div v-if="historicals[historicals.length - 1].month_gain_loss_percent < 0">
                          <h6>${{ historicals[historicals.length - 1].month_gain_loss }}</h6>
                          <span class="text-danger small pt-1 fw-bold">
                            {{ historicals[historicals.length - 1].month_gain_loss_percent }}%
                          </span>
                          <span class="text-muted small pt-2 ps-1">decrease</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- End Customers Card -->

              <!-- Reports -->
              <div class="col-12">
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">
                      Portfolio Performance
                      <span>/Month</span>
                      <div>
                        <line-chart defer></line-chart>
                      </div>
                    </h5>
                  </div>
                </div>
              </div>
              <!-- End Reports -->
            </div>
          </div>
          <!-- End Left side columns -->

          <!-- Right side columns -->
          <div class="col-lg-4">
            <!-- Recent Activity -->
            <div v-if="!limitReached()" class="card">
              <div class="filter">
                <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                  <li class="dropdown-header text-start">
                    <h6>Filter</h6>
                  </li>

                  <li><a class="dropdown-item" href="#">Today</a></li>
                  <li><a class="dropdown-item" href="#">This Month</a></li>
                  <li><a class="dropdown-item" href="#">This Year</a></li>
                </ul>
              </div>

              <div class="card-body">
                <h5 class="card-title">
                  Market Activity
                  <span>| Today</span>
                </h5>

                <div class="activity">
                  <div class="activity-item d-flex">
                    <div class="activite-label">32 min</div>
                    <i class="bi bi-circle-fill activity-badge text-success align-self-start"></i>
                    <div class="activity-content">
                      <a class="fw-bold text-dark" :href="`${news.data[0].url}`">{{ news.data[0].title }}</a>
                      <p>{{ news.data[0].description }}</p>
                    </div>
                  </div>
                  <!-- End activity item-->

                  <div class="activity-item d-flex">
                    <!-- <div class="activite-label">56 min</div> -->
                    <i class="bi bi-circle-fill activity-badge text-danger align-self-start"></i>
                    <!-- <div class="activity-content">
                      <a class="fw-bold text-dark" :href="`${news.data[0].similar[0].url}`">
                        {{ news.data[0].similar[0].title }}
                      </a>
                      <p>{{ news.data[0].similar[0].description }}</p>
                    </div> -->
                  </div>
                  <!-- End activity item-->

                  <div class="activity-item d-flex">
                    <!-- <div class="activite-label">2 hrs</div> -->
                    <i class="bi bi-circle-fill activity-badge text-primary align-self-start"></i>
                    <!-- <div class="activity-content">
                      <a class="fw-bold text-dark" :href="`${news.data[1].url}`">{{ news.data[1].title }}</a>
                      <p>{{ news.data[1].description }}</p>
                    </div> -->
                  </div>
                  <!-- End activity item-->

                  <!-- End activity item-->

                  <!-- End activity item-->

                  <!-- End activity item-->
                </div>
              </div>
            </div>
            <!-- End Recent Activity -->
          </div>
          <!-- End Right side columns -->
        </div>
      </section>
      <section v-if="stocks.length == 0" class="section dashboard">
        <div class="row align-items-top">
          <div class="col-lg-6">
            <!-- Card with an image on left -->
            <div class="card mb-3">
              <div class="row g-0">
                <div class="col-md-4">
                  <img src="assets/img/card.jpg" class="img-fluid rounded-start" alt="..." />
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">Uh oh! You don't own anything!</h5>
                    <p class="card-text">
                      It appears you do not yet have any positions. Click
                      <a href="/stocks/new">here</a>
                      to add positions to your portfolio!
                    </p>
                    <p>OR</p>
                    <button @click="reloadPage" v-on:click="updateHistorical()" class="btn btn-outline-primary">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <!-- End Card with an image on left -->
          </div>
          <!-- Right side columns -->
          <div class="col-lg-4">
            <!-- Recent Activity -->
            <div class="card">
              <div class="filter">
                <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                  <li class="dropdown-header text-start">
                    <h6>Filter</h6>
                  </li>

                  <li><a class="dropdown-item" href="#">Today</a></li>
                  <li><a class="dropdown-item" href="#">This Month</a></li>
                  <li><a class="dropdown-item" href="#">This Year</a></li>
                </ul>
              </div>

              <div v-if="!limitReached()" class="card-body">
                <h5 class="card-title">
                  Market Activity
                  <span>| Today</span>
                </h5>

                <div class="activity">
                  <div class="activity-item d-flex">
                    <!-- <div class="activite-label">32 min</div> -->
                    <i class="bi bi-circle-fill activity-badge text-success align-self-start"></i>
                    <div class="activity-content">
                      <a class="fw-bold text-dark" :href="`${news.data[0].url}`">{{ news.data[0].title }}</a>
                      <p>{{ news.data[0].description }}</p>
                    </div>
                  </div>
                  <!-- End activity item-->

                  <div class="activity-item d-flex">
                    <!-- <div class="activite-label">56 min</div> -->
                    <i class="bi bi-circle-fill activity-badge text-danger align-self-start"></i>
                    <!-- <div class="activity-content">
                      <a class="fw-bold text-dark" :href="`${news.data[0].similar[0].url}`">
                        {{ news.data[0].similar[0].title }}
                      </a>
                      <p>{{ news.data[0].similar[0].description }}</p>
                    </div> -->
                  </div>
                  <!-- End activity item-->

                  <div class="activity-item d-flex">
                    <!-- <div class="activite-label">2 hrs</div> -->
                    <i class="bi bi-circle-fill activity-badge text-primary align-self-start"></i>
                    <!-- <div class="activity-content">
                      <a class="fw-bold text-dark" :href="`${news.data[1].url}`">{{ news.data[1].title }}</a>
                      <p>{{ news.data[1].description }}</p>
                    </div> -->
                  </div>
                </div>
              </div>
            </div>
            <!-- End Recent Activity -->

            <!-- End Right side columns -->
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import LineChart from "@/components/HomePageChart.vue";
// import SectorsIndex from './sectors/SectorsIndex.vue';

export default {
  components: {
    LineChart,
    // SectorsIndex,
  },
  data: function () {
    return {
      historicals: [],
      news: [],
      newHistoricalParam: {},
      errors: {},
      stocks: {},
    };
  },
  created: function () {
    this.indexStocks();
    this.indexHistoricals();
    this.indexNews();
    this.limitReached();
  },
  methods: {
    indexHistoricals: function () {
      axios.get("http://localhost:3000/historicals").then((response) => {
        this.historicals = response.data;
      });
    },
    updateHistorical: function () {
      axios.post("http://localhost:3000/historicals", this.newHistoricalParam).then(() => {});
    },
    reloadPage() {
      window.location.reload();
    },
    indexNews: function () {
      axios.get("http://localhost:3000/news").then((response) => {
        this.news = response.data;
        console.log(this.news);
      });
    },
    limitReached: async function () {
      this.errors = this.news.error;
      return this.errors;
    },
    indexStocks: function () {
      axios.get("http://localhost:3000/stocks").then((response) => {
        this.stocks = response.data;
      });
    },
  },
};
</script>
