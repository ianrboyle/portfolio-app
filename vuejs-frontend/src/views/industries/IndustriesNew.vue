<template>
  <div class="industries-new">
    <form v-on:submit.prevent="createIndustry()">
      <h1>{{ message }}</h1>
      <ul>
        <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
      </ul>
      <div>
        <label>Industry:</label>
        <input type="text" v-model="newIndustryParams.industry" />
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
      message: "Add an industry to your portfolio:",
      newIndustryParams: {},
      errors: [],
    };
  },
  methods: {
    createIndustry: function () {
      console.log("Creating a new industry");
      axios
        .post("http://localhost:3000/industries", this.newIndustryParams)
        .then(() => {
          this.$router.push("/industries");
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
  },
};
</script>
