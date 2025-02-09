import React from 'react';
import { Line } from 'react-chartjs-2';

const LineChart = () => {
  const data = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Trend',
        data: [2, 4, 6, 8, 6, 4, 2],
        borderColor: '#36A2EB',
        fill: false,
      },
    ],
  };

  return <Line data={data} />;
};

export default LineChart;
