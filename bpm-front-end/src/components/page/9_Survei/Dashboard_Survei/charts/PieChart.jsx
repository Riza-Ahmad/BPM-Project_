import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = () => {
  const data = {
    labels: ['Work', 'TV', 'Exercise', 'Others'],
    datasets: [
      {
        data: [40, 30, 15, 15],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return <Pie data={data} />;
};

export default PieChart;
