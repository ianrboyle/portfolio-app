<script>
import { Line } from "vue-chartjs";
import axios from "axios";

export default {
  extends: Line,
  data() {
    return {
      historicals: [],
      chartData: {
        labels: [],
        datasets: [
          {
            label: "Portfolio Value",
            data: [],
            fill: false,
            borderColor: "#2554FF",
            backgroundColor: "#2554FF",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
              gridLines: {
                display: true,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
        },
        legend: {
          display: true,
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  async mounted() {
    await axios.get("http://localhost:3000/historicals").then((response) => {
      this.historicals = response.data;
      let index = this.historicals.length - 31;
      while (index <= this.historicals.length - 1) {
        this.chartData.labels.push(this.historicals[index].date);
        this.chartData.datasets[0].data.push(this.historicals[index].portfolio_value);
        index += 1;
      }
      console.log("Success! Historical data:", response.data);
    });
    await this.renderChart(this.chartData, this.options);
  },
};
</script>
