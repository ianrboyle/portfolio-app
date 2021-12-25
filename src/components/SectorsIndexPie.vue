<script>
import { Pie } from "vue-chartjs";
import axios from "axios";
export default {
  extends: Pie,
  data() {
    return {
      sector: [],
      chartData: {
        labels: [],
        datasets: [
          {
            borderWidth: 1,
            borderColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            backgroundColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            data: [],
          },
        ],
      },
      options: {
        legend: {
          display: true,
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  async mounted() {
    await axios.get("http://localhost:3000/sectors").then((response) => {
      this.sectors = response.data;
      this.sectors.forEach((sector) => {
        if (sector.sector_value > 0) {
          this.chartData.labels.push(sector.sector);
          this.chartData.datasets[0].data.push(sector.sector_percent_of_account);
        }
      });
      console.log("Sectors from pie", this.sectors);
    });
    await this.renderChart(this.chartData, this.options);
  },
};
</script>
