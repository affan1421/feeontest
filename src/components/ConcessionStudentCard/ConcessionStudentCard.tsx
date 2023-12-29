import styles from "./ConcessionStudentCard.module.css";
import Student_icon from "../../assests/Student_Icon.svg";
import boys_icon from "../../assests/boys_icon.svg";
import girls_icon from "../../assests/girls_icon.svg";

const ConcessionStudentCard = ({girlsConcCount,boysConcCount,totalStudentsCount}:{girlsConcCount:number,boysConcCount:number,totalStudentsCount:number}) => {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.header}>
          <img src={Student_icon} />
          <span>Conc.Students</span>
        </div>
        <div className={styles.amount}>
          <span>{totalStudentsCount}</span>
        </div>
        <div className={styles.row}>
          <div className={styles.boys}>
            <img src={boys_icon} />
            &nbsp;
            <div className={styles.data}>
              <span className={styles.font}>Boys</span>
              <span className={styles.font_amt}>{boysConcCount}</span>
            </div>
          </div>
          <div className={styles.girls}>
            <img src={girls_icon} />
            &nbsp;
            <div className={styles.data}>
              <span className={styles.font}>Girls</span>
              <span className={styles.font_amt}>{girlsConcCount}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConcessionStudentCard;
