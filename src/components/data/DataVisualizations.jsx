'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import '../../styles/DataVisualizations.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function DataVisualizations({ analysis }) {
  const { columns, summary } = analysis;

  // Missing values chart data
  const missingValuesData = {
    labels: columns.map(col => col.name),
    datasets: [
      {
        label: 'Missing Values',
        data: columns.map(col => col.missingCount),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Data types distribution
  const dataTypeCount = columns.reduce((acc, col) => {
    acc[col.type] = (acc[col.type] || 0) + 1;
    return acc;
  }, {});

  const dataTypesData = {
    labels: Object.keys(dataTypeCount),
    datasets: [
      {
        data: Object.values(dataTypeCount),
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="data-visualizations">
      <h2>Data Visualizations</h2>
      
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Missing Values by Column</h3>
          <div className="chart-wrapper">
            <Bar data={missingValuesData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-container">
          <h3>Data Types Distribution</h3>
          <div className="chart-wrapper">
            <Doughnut data={dataTypesData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
