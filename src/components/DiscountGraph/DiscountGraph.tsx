import styles from './DiscountGraph.module.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js'
import React from 'react';

interface DiscountGraphProps {
  labels: string[];
  data: number[];
  isclass: boolean
}

ChartJS.register(BarElement, CategoryScale, LinearScale)

const DiscountGraph: React.FC<DiscountGraphProps> = (props) => {
  const backgroundColors = [
    'rgba(255, 160, 149, 1)',
    'rgba(255, 215, 125, 1)',
    'rgba(197, 161, 245, 1)',
    'rgba(119, 248, 233, 1)',
    'rgba(73, 225, 255, 1)',
    'rgba(255, 215, 125, 1)',
    'rgba(255, 234, 127, 1)',
    'rgba(53, 238, 234, 1)',
    'rgba(255, 246, 128, 1)',
    'rgba(104, 248, 156, 1)',
    'rgba(255, 160, 149, 1)',
    'rgba(73, 225, 255, 1)',
    'rgba(255, 160, 149, 1)',
    'rgba(73, 225, 255, 1)',
    'rgba(255, 215, 125, 1)',
    'rgba(255, 234, 127, 1)',
    'rgba(53, 238, 234, 1)',
    'rgba(255, 246, 128, 1)',
  ];

  const data = {
    type: 'bar',
    labels: props.labels,
    datasets: [
      {
        data: props.data,
        backgroundColor: backgroundColors,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 0,
        borderRadius: 15,
        barThickness: 60,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        display: props.isclass? true : false,
        grid: {
          display: false,
        },
        color: 'transparent',
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
    maintainAspectRatio: false
  };

  return (
    <div className={styles.graphContainer}>
      <Bar
        width={'100%'}
        data={data}
        options={options} />
    </div>
  );
};

export default DiscountGraph;
