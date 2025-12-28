import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function WeightRadarChart({ weights }) {
  const data = {
    labels: ["Clock Speed", "Cores", "Threads", "Efficiency"],
    datasets: [
      {
        label: "Weight Distribution",
        data: [
          weights.clockSpeed,
          weights.cores,
          weights.threads,
          weights.efficiency
        ],
        backgroundColor: "rgba(36, 145, 255, 0.25)",
        borderColor: "rgba(0, 123, 255, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(0, 123, 255, 1)",
        tension: 0.3
      }
    ]
  };

  const options = {
  maintainAspectRatio: false,
  layout: {
    padding: 0
  },
  animation: {
    duration: 600,
    easing: "easeOutQuart"
  },
  scales: {
    r: {
      min: 0,
      max: 1,
      ticks: {
        stepSize: 0.2,
        color: "#ffffff",
        backdropColor: "transparent",
        font: { size: 16, weight: "bold" }
      },
      pointLabels: {
        color: "#ffffff",
        font: { size: 18, weight: "bold" }
      },
      grid: { color: "rgba(255,255,255,0.1)" },
      angleLines: { color: "rgba(255,255,255,0.1)" }
    }
  },
  plugins: {
    legend: {
      labels: {
        color: "#ffffff",
        font: { size: 18, weight: "bold" }
      }
    }
  }
};


  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "500px", height: "400px" }}>
        <Radar data={data} options={{ ...options, maintainAspectRatio: false }} />
      </div>
    </div>
  );
}
