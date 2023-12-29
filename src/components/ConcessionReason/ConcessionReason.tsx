import { useEffect, useState } from "react";
import { Divider } from "@mui/material";
import styles from "./ConcessionReason.module.css";
import reason from "../../assests/tc_reason.svg";
import api from "@/store/api";

const ConcessionReason = ({refetch}:{refetch:boolean}) => {
  const schoolId = localStorage.getItem('school_id')
  const getAllReasons = api(state => state.getAllReasons);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [reasons, setReasons] = useState<any>([]);

  const fetchReasons = async () => {
    try {
      const {data} = await getAllReasons(schoolId)
      setReasons(data.data);
      setTotalCount(data.data.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReasons();
  }, [refetch]);
  return (
    <div className={styles.box}>
      <div className={styles.endToend}>
        <div className={styles.header}>
          <div>
            <img src={reason} alt="reason" />
          </div>
          <span className={styles.heading}>Reason Types</span>
          <span className={styles.total}>{totalCount}</span>
        </div>
      </div>
      <div className={styles.line}>
        <Divider className={styles.margin} />
      </div>
      <div className={styles.row}>
        {/* <div className={styles.receivable}> */}
          <div className={styles.list}>
            {reasons.map((x:any, i:any) => {
              return (
                <div key={i} className={styles.endToend}>
                  <span className={styles.largeText}>{x.reason}</span>
                  <span className={styles.number}>{x.count}</span>
                </div>
              );
            })}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default ConcessionReason;
