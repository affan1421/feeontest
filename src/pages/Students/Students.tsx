import styles from './Students.module.css'
import StudentListFeeCollection from '@/components/StudentListFeeCollection/StudentListFeeCollection';

const Students = () => {
  return (
    <div className={styles.main}>
      <StudentListFeeCollection isReport={true} />
    </div>
  );
}

export default Students