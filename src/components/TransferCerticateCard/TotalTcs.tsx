import { Divider } from "@mui/material";
import styles from "./TransferCerticateCard.module.css";
import tcIcon from "../../assests/tc_icon.svg";
import approveIcon from "../../assests/approve icon.svg";
import pendingIcon from "../../assests/pending Icon.svg";
import rejectIcon from "../../assests/reject icon.svg";
import { TcResponseData } from "@/models/StudentTranserDetails";

const TotalTcs = ({ tcDetails }: { tcDetails: TcResponseData }) => {

  //set the types of the tc asigned to  a variable for mapping data
  const tcTypes = tcDetails?.countsByType?.typeResult
  return (
    <div className={styles.box}>
      <div className={styles.endToend}>
        <div className={styles.header}>
          <div>
            <img src={tcIcon} alt="tcIcon" />
          </div>
          <span className={styles.heading}>Total TC's</span>
        </div>
        <span className={styles.total}>{tcDetails?.tcsCount}</span>
      </div>
      <div className={styles.line}>
        <Divider className={styles.margin} />
      </div>
      <div className={styles.row}>
        {tcTypes &&
          tcTypes?.map((item) => (
            <div className={styles.receivable}>
              <div className={styles.endToend}>
                <span className={styles.text}>{item?.tcType}</span>
                <span className={styles.number}>{item?.total}</span>
              </div>
              <div style={{ marginTop: "15px" }}>
                <div className={styles.listCol}>
                  <div className={styles.listCol}>
                    <span>
                      <img src={approveIcon} alt="approveIcon" />
                    </span>
                    <span style={{ marginLeft: "15px", paddingTop: "3px" }}>
                      {item?.approved}
                    </span>
                  </div>
                  <div className={styles.listCol}>
                    <span>
                      <img src={pendingIcon} alt="pendingIcon" />
                    </span>
                    <span style={{ marginLeft: "15px", paddingTop: "3px" }}>
                      {item?.pending}
                    </span>
                  </div>

                  <div className={styles.listCol}>
                    <span>
                      <img src={rejectIcon} alt="rejectIcon" />
                    </span>
                    <span style={{ marginLeft: "15px", paddingTop: "3px" }}>
                      {item?.rejected}
                    </span>
                    <span style={{ marginLeft: "15px" }}></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TotalTcs;
