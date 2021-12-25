<template>
  <div class="sectors-new">
    <form v-on:submit.prevent="createSector()">
      <h1>{{ message }}</h1>
      <ul>
        <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
      </ul>
      <div>
        <label>Sector:</label>
        <input type="text" v-model="newSectorParams.sector" />
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
      message: "Add a sector to your portfolio:",
      newSectorParams: {},
      errors: [],
    };
  },
  methods: {
    createSector: function () {
      console.log("Creating a new sector");
      axios
        .post("http://localhost:3000/sectors", this.newSectorParams)
        .then(() => {
          this.$router.push("/sectors");
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
  },
};
</script>
