import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";
import { useEffect } from "react";

ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function VaccencyGraph({items}:any) {

  useEffect(()=> {
    console.log("filtered",items?.map((x:any)=> x?.className))
    console.log("filtered totalSeats",items?.map((x:any)=> x?.totalSeats))
  },[])

  const data = {
    type: "bar",
    labels: items?.map((x:any)=> x?.className),
    datasets: [
      {
        data: items?.map((x:any)=> x?.totalSeats),
        backgroundColor: "#2760EA80",
        borderColor: "rgba(75, 192, 192, 1)",
        // barThickness: 15,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        color: "transparent",
      },
      y: {
        beginAtZero: true,
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: "85%", padding: "15px" }}>
      <Bar width={"100%"} data={data} options={options} />
    </div>
  );
}
