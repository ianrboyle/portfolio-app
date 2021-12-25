<template>
  <div id="app">
    <body class>
      <!-- ======= Header ======= -->
      <header id="header" class="header fixed-top d-flex align-items-center">
        <div class="d-flex align-items-center justify-content-between">
          <a href="/" class="logo d-flex align-items-center">
            <!-- Upper left logo -->
            <img src="assets/img/magnifying-glass.png" alt="" />
            <span class="d-none d-lg-block">Portfoli⊕Tracker</span>
          </a>
          <!-- Dropdown -->
          <i class="bi bi-list toggle-sidebar-btn"></i>
        </div>
        <!-- End Logo -->

        <!-- <div class="search-bar">
          <form class="search-form d-flex align-items-center" method="POST" action="#">
            <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
            <button type="submit" title="Search"><i class="bi bi-search"></i></button>
          </form>
        </div> -->
        <!-- End Search Bar -->

        <nav class="header-nav ms-auto">
          <ul class="d-flex align-items-center">
            <li class="nav-item d-block d-lg-none">
              <!-- search bar -->
              <a class="nav-link nav-icon search-bar-toggle" href="/">
                <i class="bi bi-search"></i>
              </a>
            </li>

            <li v-if="isLoggedIn()" class="nav-item dropdown pe-3">
              <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                <!-- <img src="/assets/img/profile-img.jpg" alt="Profile" class="rounded-circle" /> -->
                <span class="d-none d-md-block dropdown-toggle ps-2">Welcome</span>
              </a>
              <!-- End Profile Iamge Icon -->

              <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <!-- <li class="dropdown-header">
                  <h6 :key="stocks[0].user.id">{{ currentUser }}</h6>
                  <span>Software Engineer</span>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li> -->

                <li>
                  <a class="dropdown-item d-flex align-items-center" href="/">
                    <i class="bi bi-person"></i>
                    <span>Welcome Page</span>
                  </a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <!-- 
                <li>
                  <a class="dropdown-item d-flex align-items-center" href="users-profile.html">
                    <i class="bi bi-gear"></i>
                    <span>Account Settings</span>
                  </a>
                </li> -->
                <li>
                  <hr class="dropdown-divider" />
                </li>

                <!-- <li>
                  <a class="dropdown-item d-flex align-items-center" href="/faq">
                    <i class="bi bi-question-circle"></i>
                    <span>Need Help?</span>
                  </a>
                </li> -->
                <li>
                  <hr class="dropdown-divider" />
                </li>

                <li>
                  <a v-if="isLoggedIn()" class="dropdown-item d-flex align-items-center" href="/logout">
                    <i class="bi bi-box-arrow-right"></i>
                    <span>Sign Out</span>
                  </a>
                </li>
              </ul>
              <!-- End Profile Dropdown Items -->
            </li>
            <li v-if="!isLoggedIn()" class="nav-item dropdown pe-3">
              <a class="nav-link nav-profile d-flex align-items-center pe-0" href="/signup">
                <i class="bi bi-card-list"></i>
                <span>Register</span>
              </a>
            </li>
            <!-- End Register Page Nav -->

            <li v-if="!isLoggedIn()" class="nav-item dropdown pe-3">
              <router-link class="nav-link nav-profile d-flex align-items-center pe-0" to="/login">
                <i class="bi bi-box-arrow-in-right"></i>
                <span>Login</span>
              </router-link>
            </li>
            <!-- End Login Page Nav -->

            <!-- End Profile Nav -->
          </ul>
        </nav>
        <!-- End Icons Navigation -->
      </header>
      <!-- End Header -->
      <!-- ======= Sidebar ======= -->
      <aside id="sidebar" class="sidebar">
        <ul class="sidebar-nav" id="sidebar-nav">
          <li v-if="!isLoggedIn()" class="nav-item">
            <a class="nav-link" href="/">
              <i class="bi bi-grid"></i>
              <span>Welcome</span>
            </a>
          </li>
          <li v-if="isLoggedIn()" class="nav-item">
            <a class="nav-link" href="/home">
              <i class="bi bi-grid"></i>
              <span>Home</span>
            </a>
          </li>
          <!-- End Dashboard Nav -->

          <!-- <li class="nav-item">
            <a class="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" href="#">
              <i class="bi bi-menu-button-wide"></i>
              <span>Components</span>
              <i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="components-nav" class="nav-content collapse" data-bs-parent="#sidebar-nav">
              <li>
                <a href="components-alerts.html">
                  <i class="bi bi-circle"></i>
                  <span>Alerts</span>
                </a>
              </li>
              <li>
                <a href="components-accordion.html">
                  <i class="bi bi-circle"></i>
                  <span>Accordion</span>
                </a>
              </li>
              <li>
                <a href="components-badges.html">
                  <i class="bi bi-circle"></i>
                  <span>Badges</span>
                </a>
              </li>
              <li>
                <a href="components-breadcrumbs.html">
                  <i class="bi bi-circle"></i>
                  <span>Breadcrumbs</span>
                </a>
              </li>
              <li>
                <a href="components-buttons.html">
                  <i class="bi bi-circle"></i>
                  <span>Buttons</span>
                </a>
              </li>
              <li>
                <a href="components-cards.html">
                  <i class="bi bi-circle"></i>
                  <span>Cards</span>
                </a>
              </li>
              <li>
                <a href="components-carousel.html">
                  <i class="bi bi-circle"></i>
                  <span>Carousel</span>
                </a>
              </li>
              <li>
                <a href="components-list-group.html">
                  <i class="bi bi-circle"></i>
                  <span>List group</span>
                </a>
              </li>
              <li>
                <a href="components-modal.html">
                  <i class="bi bi-circle"></i>
                  <span>Modal</span>
                </a>
              </li>
              <li>
                <a href="components-tabs.html">
                  <i class="bi bi-circle"></i>
                  <span>Tabs</span>
                </a>
              </li>
              <li>
                <a href="components-pagination.html">
                  <i class="bi bi-circle"></i>
                  <span>Pagination</span>
                </a>
              </li>
              <li>
                <a href="components-progress.html">
                  <i class="bi bi-circle"></i>
                  <span>Progress</span>
                </a>
              </li>
              <li>
                <a href="components-spinners.html">
                  <i class="bi bi-circle"></i>
                  <span>Spinners</span>
                </a>
              </li>
              <li>
                <a href="components-tooltips.html">
                  <i class="bi bi-circle"></i>
                  <span>Tooltips</span>
                </a>
              </li>
            </ul>
          </li> -->
          <!-- End Components Nav -->

          <!-- <li class="nav-item">
            <a class="nav-link collapsed" data-bs-target="#forms-nav" data-bs-toggle="collapse" href="#">
              <i class="bi bi-journal-text"></i>
              <span>Forms</span>
              <i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="forms-nav" class="nav-content collapse" data-bs-parent="#sidebar-nav">
              <li>
                <a href="forms-elements.html">
                  <i class="bi bi-circle"></i>
                  <span>Form Elements</span>
                </a>
              </li>
              <li>
                <a href="forms-layouts.html">
                  <i class="bi bi-circle"></i>
                  <span>Form Layouts</span>
                </a>
              </li>
              <li>
                <a href="forms-editors.html">
                  <i class="bi bi-circle"></i>
                  <span>Form Editors</span>
                </a>
              </li>
              <li>
                <a href="forms-validation.html">
                  <i class="bi bi-circle"></i>
                  <span>Form Validation</span>
                </a>
              </li>
            </ul>
          </li> -->
          <!-- End Forms Nav -->

          <li v-if="isLoggedIn()" class="nav-item">
            <a class="nav-link collapsed" data-bs-target="#tables-nav" data-bs-toggle="collapse" href="/stocks">
              <i class="bi bi-layout-text-window-reverse"></i>
              <span>Portfolio</span>
              <i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="tables-nav" class="nav-content collapse" data-bs-parent="#sidebar-nav">
              <li>
                <a href="/stocks">
                  <i class="bi bi-circle"></i>
                  <span>Positions</span>
                </a>
              </li>
              <li>
                <a href="/sectors">
                  <i class="bi bi-circle"></i>
                  <span>Sectors</span>
                </a>
              </li>
              <li>
                <a href="/industries">
                  <i class="bi bi-circle"></i>
                  <span>Industries</span>
                </a>
              </li>
            </ul>
          </li>
          <!-- End Tables Nav -->
          <!-- 
          <li class="nav-item">
            <a class="nav-link collapsed" data-bs-target="#charts-nav" data-bs-toggle="collapse" href="#">
              <i class="bi bi-bar-chart"></i>
              <span>Charts</span>
              <i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="charts-nav" class="nav-content collapse" data-bs-parent="#sidebar-nav">
              <li>
                <a href="charts-chartjs.html">
                  <i class="bi bi-circle"></i>
                  <span>Chart.js</span>
                </a>
              </li>
              <li>
                <a href="charts-apexcharts.html">
                  <i class="bi bi-circle"></i>
                  <span>ApexCharts</span>
                </a>
              </li>
              <li>
                <a href="charts-echarts.html">
                  <i class="bi bi-circle"></i>
                  <span>ECharts</span>
                </a>
              </li>
            </ul>
          </li> -->
          <!-- End Charts Nav -->

          <!-- <li class="nav-item">
            <a class="nav-link collapsed" data-bs-target="#icons-nav" data-bs-toggle="collapse" href="#">
              <i class="bi bi-gem"></i>
              <span>Icons</span>
              <i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="icons-nav" class="nav-content collapse" data-bs-parent="#sidebar-nav">
              <li>
                <a href="icons-bootstrap.html">
                  <i class="bi bi-circle"></i>
                  <span>Bootstrap Icons</span>
                </a>
              </li>
              <li>
                <a href="icons-remix.html">
                  <i class="bi bi-circle"></i>
                  <span>Remix Icons</span>
                </a>
              </li>
              <li>
                <a href="icons-boxicons.html">
                  <i class="bi bi-circle"></i>
                  <span>Boxicons</span>
                </a>
              </li>
            </ul>
          </li> -->
          <!-- End Icons Nav -->

          <li class="nav-heading">Pages</li>

          <li v-if="isLoggedIn()" class="nav-item">
            <a class="nav-link collapsed" href="/profile">
              <i class="bi bi-person"></i>
              <span>Profile</span>
            </a>
          </li>
          <!-- End Profile Page Nav -->

          <!-- <li class="nav-item">
            <a class="nav-link collapsed" href="pages-faq.html">
              <i class="bi bi-question-circle"></i>
              <span>F.A.Q</span>
            </a>
          </li> -->
          <!-- End F.A.Q Page Nav -->
          <!-- 
          <li class="nav-item">
            <a class="nav-link collapsed" href="pages-contact.html">
              <i class="bi bi-envelope"></i>
              <span>Contact</span>
            </a>
          </li> -->
          <!-- End Contact Page Nav -->

          <li v-if="!isLoggedIn()" class="nav-item">
            <a class="nav-link collapsed" href="/signup">
              <i class="bi bi-card-list"></i>
              <span>Register</span>
            </a>
          </li>
          <!-- End Register Page Nav -->

          <li v-if="!isLoggedIn()" class="nav-item">
            <router-link class="nav-link collapsed" to="/login">
              <i class="bi bi-box-arrow-in-right"></i>
              <span>Login</span>
            </router-link>
          </li>
          <!-- End Login Page Nav -->

          <li v-if="isLoggedIn()" class="nav-item">
            <a class="nav-link collapsed" href="/logout">
              <i class="bi bi-box-arrow-in-left"></i>
              <span>Logout</span>
            </a>
          </li>
          <!-- <li class="nav-item">
            <a class="nav-link collapsed" href="pages-error-404.html">
              <i class="bi bi-dash-circle"></i>
              <span>Error 404</span>
            </a>
          </li> -->
          <!-- End Error 404 Page Nav -->
          <!-- 
          <li class="nav-item">
            <a class="nav-link collapsed" href="pages-blank.html">
              <i class="bi bi-file-earmark"></i>
              <span>Blank</span>
            </a>
          </li> -->
          <!-- End Blank Page Nav -->
        </ul>
      </aside>
      <!-- End Sidebar-->
    </body>

    <!-- <div id="nav">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about">About</router-link>
      |
      <router-link to="/login">Login</router-link>
      |
      <router-link to="/logout">Logout</router-link>
      |
      <router-link to="/signup">Signup</router-link>
      |
      <router-link to="/stocks">My Stocks</router-link>
      |
      <router-link to="/stocks/new">Add a Stock!</router-link>
      |
      <router-link to="/sectors">My Sectors</router-link>
      |
      <router-link to="/sectors/new">Add a Sector!</router-link>
      |
      <router-link to="/industries/new">Add an Industry!</router-link>
      |
      <router-link to="/industries">My Industries!</router-link>
    </div> -->
    <router-view />

    <!-- ======= Footer ======= -->
    <footer id="footer" class="footer">
      <div class="copyright">
        Icons made by
        <a href="https://www.flaticon.com/authors/slidicon" title="Slidicon">Slidicon</a>
        from
        <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
      </div>
      <div class="copyright">
        &copy; Copyright
        <strong><span>NiceAdmin</span></strong>
        . All Rights Reserved
      </div>
      <div class="credits">
        <!-- All the links in the footer should remain intact. -->
        <!-- You can delete the links only if you purchased the pro version. -->
        <!-- Licensing information: https://bootstrapmade.com/license/ -->
        <!-- Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/ -->
        Designed by
        <a href="https://bootstrapmade.com/">BootstrapMade</a>
      </div>
    </footer>
    <!-- End Footer -->
  </div>
</template>

<script>
// import axios from "axios";
export default {
  data: function () {
    return {
      stocks: [],
      // currentUser: {},
    };
  },
  // created: function () {
  //   axios.get("http://localhost:3000/stocks").then((response) => {
  //     this.stocks = response.data;
  //     this.currentUser = this.stocks[0].user;
  //   });
  // },
  methods: {
    isLoggedIn: function () {
      return localStorage.getItem("jwt");
    },
  },
};
</script>
