import React from 'react'
import styles from './TransportSummary.module.css'

const TransportSummary = (props :any) => {
  return (
      <>
          <div className={styles.container}>
              <div className={styles.icon}>
                  <img src={props.icon} alt='Students'/>
              </div>
              <div className={styles.row}>
                  <span className={styles.number}>{props.number}</span>
                  <span className={styles.title}>{props.title}</span>
              </div>
          </div>
      </>
  )
}

export default TransportSummary