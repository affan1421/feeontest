import { Divider } from "@mui/material";
import styles from "./TransferCerticateCard.module.css";
import reason from "../../assests/tc_reason.svg";
import { TcResponseData } from "@/models/StudentTranserDetails";

const TcReasons = ({ tcDetails }: { tcDetails: TcResponseData }) => {
  //set the reason result to a variable for mapping
  const reasons = tcDetails?.reasonsData?.reasonResult;

  return (
    <div className={styles.box}>
      <div className={styles.endToend}>
        <div className={styles.header}>
          <div>
            <img src={reason} alt="tcReason" />
          </div>
          <span className={styles.heading}>Reason Types</span>
        </div>
        <span className={styles.total}>{tcDetails?.reasonCount}</span>
      </div>
      <div className={styles.line}>
        <Divider className={styles.margin} />
      </div>
      <div className={styles.row}>
        <div className={styles.receivable}>
          <div className={styles.list}>
            {reasons &&
              reasons.map((item: any, i: number) => {
                return (
                  <div
                    className={styles.endToend}
                    key={i}
                    style={{ marginBottom: "13px" }}
                  >
                    <span className={styles.largeText}>{item?.reason}</span>
                    <span className={styles.number}>{item?.count}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TcReasons;
