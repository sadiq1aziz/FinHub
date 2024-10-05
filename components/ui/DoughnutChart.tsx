"use client";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

//register components for ChartJS to work
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {

  const banks = accounts.length;
  const balances = accounts.map( (account) => account.currentBalance);
  const names = accounts.map( (account) => account.name);

  const dataChartInstance = {
    label: "Bank Accounts",
    datasets: [
      {
        label: 'banks',
        backgroundColor: ['#87CEEB', '#6495ED', '#4682B4'],
        data: balances
      },    
    ],
    labels: names,
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
