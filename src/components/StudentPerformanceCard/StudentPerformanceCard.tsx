import React from 'react';
import student_fee from '../../assests/student_fee.svg';
import styles from './StudentPerformanceCard.module.css';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

interface StudentPerformance {
  paidCount: number;
  lateCount: number;
  dueCount: number;
  upcomingCount: number;
}

Chart.register(ArcElement, Tooltip, Legend);

const StudentPerformanceCard = (props: { studentPerformance: StudentPerformance }) => {
  const total =
    props.studentPerformance.paidCount +
    props.studentPerformance.lateCount +
    props.studentPerformance.upcomingCount +
    props.studentPerformance.dueCount;

  const getPercentage = (count: number) => {
    const percentage = (count / total) * 100;
    return isNaN(percentage) ? 0 : percentage.toFixed(2);
  };

  const data = {
    datasets: [
      {
        data: [
          getPercentage(props.studentPerformance.paidCount),
          getPercentage(props.studentPerformance.lateCount),
          getPercentage(props.studentPerformance.upcomingCount),
          getPercentage(props.studentPerformance.dueCount),
        ],
        backgroundColor: [
          'rgb(163, 207, 69)',
          'rgb(70, 191, 243)',
          'rgb(255, 200, 57)',
          'rgb(255, 90, 90)',
        ],
        hoverOffset: 2,
      },
    ],
  };

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <img src={student_fee} alt="Student Fee Icon" />
        <span>Student Fee Performance</span>
      </div>
      <div className={styles.container}>
        <div className={styles.left}>
          <Doughnut data={data} />
        </div>
        <div className={styles.right}>
          <div className={styles.row}>
            <div className={styles.item_box}>
              <span>{getPercentage(props.studentPerformance.paidCount)}%</span>
              <div className={styles.item}>
                <div className={styles.box} style={{ backgroundColor: '#A8CF45' }}></div>
                <div className={styles.label}>On Time</div>
              </div>
            </div>
            <div className={styles.item_box} style={{ marginLeft: '20px' }}>
              <span>{getPercentage(props.studentPerformance.lateCount)}%</span>
              <div className={styles.item}>
                <div className={styles.box} style={{ backgroundColor: '#33B5E8' }}></div>
                <div className={styles.label}>Late Paid</div>
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.item_box}>
              <span style={{ marginLeft: '15px' }}>
                {getPercentage(props.studentPerformance.upcomingCount)}%
              </span>
              <div className={styles.item}>
                <div className={styles.box} style={{ backgroundColor: '#FFC839' }}></div>
                <div className={styles.label}>Outstanding</div>
              </div>
            </div>
            <div className={styles.item_box} style={{ marginLeft: '20px' }}>
              <span>{getPercentage(props.studentPerformance.dueCount)}%</span>
              <div className={styles.item}>
                <div className={styles.box} style={{ backgroundColor: '#FF5A5A' }}></div>
                <div className={styles.label}>Not Paid</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPerformanceCard;
