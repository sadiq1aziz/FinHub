"use client";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

//register components for ChartJS to work
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
  const dataChartInstance = {
    label: "Bank Accounts",
    datasets: [
      {
        label: 'banks',
        backgroundColor: ['#87CEEB', '#6495ED', '#4682B4'],
        data: ['3455', '2333', '1223'],
      },    
    ],
    labels: ['Bank 1', 'Bank 2', 'Bank 3'],
  };

  return (
    <Doughnut
      data={dataChartInstance}
      options={{
        cutout: "60%",
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
};

export default DoughnutChart;
