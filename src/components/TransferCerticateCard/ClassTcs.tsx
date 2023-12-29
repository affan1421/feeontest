import { Divider } from "@mui/material";
import styles from "./TransferCerticateCard.module.css";
import tcClass from "../../assests/tc_classes.svg";
import { TcResponseData } from "@/models/StudentTranserDetails";

const ClassTcs = ({ tcDetails }: { tcDetails: TcResponseData }) => {

  //set the classReuslt to  a variable for mapping
  const classes = tcDetails?.classData?.classResult
  return (
    <div className={styles.box}>
      <div className={styles.endToend}>
        <div className={styles.header}>
          <div>
            <img src={tcClass} alt="tcClass" />
          </div>
          <span className={styles.heading}>Classes</span>
        </div>
        <span className={styles.total}>{tcDetails?.classCount}</span>
      </div>
      <div className={styles.line}>
        <Divider className={styles.margin} />
      </div>
      <div className={styles.row}>
        <div className={styles.receivable}>
          <div className={styles.list}>
            {classes &&
              classes?.map((item, i) => (
                <>
                  <div
                    key={i}
                    className={styles.endToend}
                    style={{ marginBottom: "13px" }}
                  >
                    <span className={styles.largeText}>{item?.className}</span>
                    <span className={styles.number}>{item?.count}</span>
                  </div>
                </>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassTcs;
