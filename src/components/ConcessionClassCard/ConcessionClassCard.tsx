import feecollection_icon from "../../assests/feecollection_icon.svg";
import totalpending_icon from "../../assests/totalpending_icon.svg";
import totalreceivable_icon from "../../assests/totalreceivable_icon.svg";
import styles from "./ConcessionClassCard.module.css";

interface Props {
  title: string;
  totalAmount: number;
  icon: "totalrecievable" | "totalpending" | "feecollection";
  maxClass?: {
    amount: number;
    sectionId?: {
      className: string;
      sectionName: string;
      _id: string;
    };
  };
  minConc?: {
    amount: number;
    sectionId?: {
      className: string;
      sectionName: string;
      _id: string;
    };
  };
  maxExpType?: {
    expenseType: {
      name: string;
    };
    totalExpAmount: number;
  };
  minExpType?: {
    expenseType: {
      name: string;
    };
    totalExpAmount: number;
  };
  format: boolean;
}

const formatNumber = (value: number): string => {
  if (value >= 1e12) {
    return (value / 1e12).toFixed(0) + "T";
  } else if (value >= 1e9) {
    return (value / 1e9).toFixed(0) + "B";
  } else if (value >= 1e6) {
    return (value / 1e6).toFixed(0) + "M";
  } else if (value >= 1e3) {
    return (value / 1e3).toFixed(0) + "K";
  }
  return value.toFixed(0);
};

const ConcessionClassCard = (props: any) => {
  
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formatAmount = (amount: number) => {
    return formatNumber(amount).replace(/[.,]00$/, "");
  };
  return (
    <>
      <div className={styles.main}>
        <div className={styles.header}>
          <img src={totalreceivable_icon} />
          <span>{props.title}</span>
        </div>
        <div className={styles.amount}>
          <span>
            {props.format
              ? formatter.format(props.totalAmount)
              : props.totalAmount}
          </span>
        </div>
        <div className={styles.row}>
          {props.maxConc && (
            <div className={styles.max}>
              <span className={`${styles.classTitle} ${styles.maxTitle}`}>
                MAX
              </span>
              <div className={styles.max_sub}>
                <span className={styles.class}>{props.maxConc?.sectionName}</span>
                <span className={styles.totamount}>
                  {formatAmount(props.maxConc?.concessionAmount)}
                </span>
              </div>
            </div>
          )}
          {props.minConc && (
            <div className={styles.min}>
              <span className={`${styles.classTitle} ${styles.minTitle}`}>
                MIN
              </span>
              <div className={styles.min_sub}>
                <span className={styles.class}>{props.minConc?.sectionName}</span>
                <span className={styles.totamount}>
                  {formatAmount(props.minConc?.concessionAmount)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConcessionClassCard;
