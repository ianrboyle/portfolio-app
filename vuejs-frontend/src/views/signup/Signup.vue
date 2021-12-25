<template>
  <div class="signup">
    <main>
      <div class="container">
        <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div class="d-flex justify-content-center py-4">
                  <a href="index.html" class="logo d-flex align-items-center w-auto">
                    <img src="assets/img/logo.png" alt="" />
                    <span class="d-none d-lg-block">NiceAdmin</span>
                  </a>
                </div>
                <!-- End Logo -->

                <div class="card mb-3">
                  <div class="card-body">
                    <div class="pt-4 pb-2">
                      <h5 class="card-title text-center pb-0 fs-4">Create an Account</h5>
                      <ul>
                        <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
                      </ul>
                      <p class="text-center small">Signup Here!</p>
                    </div>

                    <form v-on:submit.prevent="submit()" class="row g-3 needs-validation" novalidate>
                      <div class="col-12">
                        <label for="yourUsername" class="form-label">Name</label>
                        <div class="input-group has-validation">
                          <!-- <span class="input-group-text" id="inputGroupPrepend"></span> -->
                          <input
                            type="text"
                            v-model="newUserParams.name"
                            name="username"
                            class="form-control"
                            id="yourUsername"
                            required
                          />
                          <!-- <div class="invalid-feedback">Please enter your username.</div> -->
                        </div>
                      </div>
                      <div class="col-12">
                        <label for="yourUsername" class="form-label">Email</label>
                        <div class="input-group has-validation">
                          <span class="input-group-text" id="inputGroupPrepend">@</span>
                          <input
                            type="email"
                            v-model="newUserParams.email"
                            name="username"
                            class="form-control"
                            id="yourUsername"
                            required
                          />
                          <!-- <div class="invalid-feedback">Please enter your username.</div> -->
                        </div>
                      </div>
                      <div class="col-12">
                        <label for="yourPassword" class="form-label">Password</label>
                        <input
                          type="password"
                          v-model="newUserParams.password"
                          name="passwword"
                          class="form-control"
                          id="yourPassword"
                          required
                        />
                        <div class="invalid-feedback">Please Enter your password!</div>
                      </div>
                      <div class="col-12">
                        <label for="yourPassword" class="form-label">Confirm Password</label>
                        <input
                          type="password"
                          v-model="newUserParams.password_confirmation"
                          name="passwword"
                          class="form-control"
                          id="yourPassword"
                          required
                        />
                        <div class="invalid-feedback">Please Enter your password!</div>
                      </div>
                      <div class="col-12">
                        <button class="btn btn-primary w-100" type="submit" value="Submit">Sign Me Up!</button>
                      </div>
                    </form>
                  </div>
                </div>

                <div class="credits">
                  <!-- All the links in the footer should remain intact. -->
                  <!-- You can delete the links only if you purchased the pro version. -->
                  <!-- Licensing information: https://bootstrapmade.com/license/ -->
                  <!-- Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/ -->
                  Designed by
                  <a href="https://bootstrapmade.com/">BootstrapMade</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
    <form v-on:submit.prevent="submit()">
      <h1>Signup</h1>
      <ul>
        <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
      </ul>
      <div>
        <label>Name:</label>
        <input type="text" v-model="newUserParams.name" />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" v-model="newUserParams.email" />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="newUserParams.password" />
      </div>
      <div>
        <label>Password confirmation:</label>
        <input type="password" v-model="newUserParams.password_confirmation" />
      </div>
      <input type="submit" value="Submit" />
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: function () {
    return {
      newUserParams: {},
      errors: [],
    };
  },
  methods: {
    submit: function () {
      axios
        .post("http://localhost:3000/users", this.newUserParams)
        .then((response) => {
          console.log(response.data);
          this.$router.push("/login");
        })
        .catch((error) => {
          this.errors = error.response.data.errors;
        });
    },
  },
};
</script>
