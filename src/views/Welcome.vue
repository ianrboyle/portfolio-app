<template>
  <main id="main" class="main">
    <h1>Welcome to Portfoli⊕ Tracker!</h1>
    <section>
      <div class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Features</h5>

              <!-- Slides with captions -->
              <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators">
                  <button
                    type="button"
                    data-bs-target="#carouselExampleCaptions"
                    data-bs-slide-to="0"
                    class="active"
                    aria-current="true"
                    aria-label="Slide 1"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#carouselExampleCaptions"
                    data-bs-slide-to="1"
                    aria-label="Slide 2"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#carouselExampleCaptions"
                    data-bs-slide-to="2"
                    aria-label="Slide 3"
                  ></button>
                </div>

                <div class="carousel-inner">
                  <div class="carousel-item active">
                    <img src="assets/img/card.jpg" class="card-img-top" alt="..." />
                    <div class="carousel-caption d-none d-md-block">
                      <h5><b>Track Portfolio Performance</b></h5>
                      <p style="background-color: rgba(0, 0, 255, 0.4)">
                        Watch as your portfolio increases (or decreases) in value!
                      </p>
                    </div>
                  </div>
                  <div class="carousel-item">
                    <img src="assets/img/chart.jpg" class="d-block w-100" alt="..." />
                    <div class="carousel-caption d-none d-md-block">
                      <h5><b>Group Equities by Sector and Industry</b></h5>
                      <p style="background-color: rgba(0, 0, 255, 0.4)">
                        It can be difficult and tedious to track every position you own. This feature allows you to see
                        which positions belong to a certain sector and industry.
                      </p>
                    </div>
                  </div>
                  <div class="carousel-item">
                    <img src="assets/img/stocks.jpg" class="d-block w-100" alt="..." />
                    <div class="carousel-caption d-none d-md-block">
                      <h5><b>Add Positions and Let Portfolio Tracker Do The Rest</b></h5>
                      <p style="background-color: rgba(0, 0, 255, 0.4)">
                        With just a ticker symbol, purchase price and quantity of shares, Portfolio Tracker will assess
                        the performance of your portfolio!
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  class="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide="prev"
                >
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button
                  class="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide="next"
                >
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Next</span>
                </button>
              </div>
              <!-- End Slides with captions -->
            </div>
          </div>
        </div>
        <!-- Right side columns -->
        <div class="col-lg-4">
          <!-- Recent Activity -->
          <div v-if="!limitReached()" class="card">
            <div class="card-body">
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

                <div v-if="news.data[0].similar.length > 0" class="activity-item d-flex">
                  <!-- <div class="activite-label">56 min</div> -->
                  <i class="bi bi-circle-fill activity-badge text-danger align-self-start"></i>
                  <div class="activity-content">
                    <a class="fw-bold text-dark" :href="`${news.data[0].similar[0].url}`">
                      {{ news.data[0].similar[0].title }}
                    </a>
                    <p>{{ news.data[0].similar[0].description }}</p>
                  </div>
                </div>
                <!-- End activity item-->

                <div v-if="news.data.length > 0" class="activity-item d-flex">
                  <!-- <div class="activite-label">2 hrs</div> -->
                  <i class="bi bi-circle-fill activity-badge text-primary align-self-start"></i>
                  <div class="activity-content">
                    <a class="fw-bold text-dark" :href="`${news.data[1].url}`">{{ news.data[1].title }}</a>
                    <p>{{ news.data[1].description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End Recent Activity -->
        </div>
        <!-- End Right side columns -->
      </div>
    </section>
  </main>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

// import SectorsIndex from './sectors/SectorsIndex.vue';

export default {
  components: {},
  data: function () {
    return {
      news: [],
    };
  },
  created: function () {
    this.indexNews();
    this.limitReached();
  },
  methods: {
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
  },
};
</script>
