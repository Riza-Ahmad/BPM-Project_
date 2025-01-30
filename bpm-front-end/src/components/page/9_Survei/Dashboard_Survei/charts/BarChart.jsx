import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = () => {
  const data = {
    labels: ['Copper', 'Silver', 'Gold', 'Platinum'],
    datasets: [
      {
        label: 'Density',
        data: [8, 10, 12, 14],
        backgroundColor: '#FF6384',
      },
      {
        label: 'Stiffness',
        data: [4, 6, 8, 9],
        backgroundColor: '#36A2EB',
      },
    ],
  };

  return <Bar data={data} />;
};

export default BarChart;
