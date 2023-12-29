import styles from "./FeeCollection.module.css";
import FeeCollectionStudent from "@/components/FeeCollectionStudent/FeeCollectionStudent";
import StudentListFeeCollection from "@/components/StudentListFeeCollection/StudentListFeeCollection";
import RecentTransaction from "@/components/Recent Transaction/RecentTransaction";
import api from "@/store/api";
import { useEffect, useState } from "react";
import { StudentTransaction } from "@/models/StudentTransaction";

const FeeCollection = () => {
  const getRecentTransactionAPI = api((state) => state.getRecentTransaction);
  const schoolId = localStorage.getItem('school_id')
  const [transactions, setTransactions] = useState<StudentTransaction[]>([]);

  useEffect(() => {
    getRecentTransactionAPI(schoolId as string).then((response) => {
      if (response.status === 200) {
        setTransactions(response.data.data);
      }
    });
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <RecentTransaction studentTransaction={transactions} />
      </div>
      <div className={styles.right}>
        <StudentListFeeCollection />
      </div>
    </div>
  );
};

export default FeeCollection;
