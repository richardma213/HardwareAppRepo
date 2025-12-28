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

export default function GpuRadarChart({ weights }) {
  const data = {
    labels: ["Clock", "VRAM", "Efficiency"],
    datasets: [
      {
        label: "GPU Weight Distribution",
        data: [weights.clock, weights.vram, weights.efficiency],
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
    scales: {
      r: {
        min: 0,
        max: 1,
        ticks: { stepSize: 0.2, color: "#000000ff" },
        pointLabels: { color: "#ffffffff", font: { size: 16 } },
        grid: { color: "rgba(173, 173, 173, 0.1)" },
        angleLines: { color: "rgba(0, 0, 0, 0.1)" }
      }
    },
    plugins: {
      legend: {
        labels: { color: "#fff" }
      }
    }
  };

  return (
    <div style={{ width: "450px", height: "400px" }}>
      <Radar data={data} options={options} />
    </div>
  );
}
