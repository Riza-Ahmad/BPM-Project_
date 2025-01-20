import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Line, Bar } from "react-chartjs-2";
import PageTitleNav from "../../../part/PageTitleNav";
import { useIsMobile } from "../../../util/useIsMobile";

// Registrasi elemen dan skala yang diperlukan oleh Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Dashboard_Survei({ onChangePage }) {
  const isMobile = useIsMobile();

  // Data untuk chart
  const pieData = {
    labels: ["Work", "TV", "Exercise", "Others"],
    datasets: [
      {
        data: [40, 30, 15, 15],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const lineData = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
    datasets: [
      {
        label: "Trend",
        data: [2, 4, 6, 8, 6, 4, 2],
        borderColor: "#36A2EB",
        fill: false,
      },
    ],
  };

  const barData = {
    labels: ["Copper", "Silver", "Gold", "Platinum"],
    datasets: [
      {
        label: "Density",
        data: [8, 10, 12, 14],
        backgroundColor: "#FF6384",
      },
      {
        label: "Stiffness",
        data: [4, 6, 8, 9],
        backgroundColor: "#36A2EB",
      },
    ],
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0 p-0" : "m-3 mb-0"}>
            <PageTitleNav
              title="Dashboard Survei"
              breadcrumbs={[{ label: "Dashboard Survei", href: "/tentang" }]}
              onClick={() => onChangePage("tentang")}
            />
          </div>

          <div
            className={isMobile ? "p-2 m-2 mt-2 mb-0" : "p-3 m-5 mt-2 mb-0"}
            style={{ marginLeft: "50px" }}
          >
            <div className="row mt-4 col-12">
              <div className="form-control container">
                <Line data={lineData} />
              </div>
            </div>
          </div>

          <div
            className={isMobile ? "p-2 m-2 mt-2 mb-0" : "p-3 m-5 mt-2 mb-0"}
            style={{ marginLeft: "50px" }}
          >
            <div className="row mt-4 col-12">
              <div className="col-md-6">
                <div className="form-control">
                  <Pie data={pieData} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-control">
                  <Bar data={barData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
