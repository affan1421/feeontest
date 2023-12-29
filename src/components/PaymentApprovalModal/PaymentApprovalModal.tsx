import { IconButton } from "@mui/material";
import styles from "./paymentApprovalModal.module.css"
import { Close } from "@mui/icons-material";


interface props {
  setPaymentApproval: React.Dispatch<React.SetStateAction<boolean>>;
  data: {
    idField: string;
    bankNameField: string;
    dateField: string;
    paymentMode: string;
  };
  modeDetail: {
    idField: string,
    bankNameField: string,
    dateField: string,
  };
  handlePayment: React.Dispatch<React.SetStateAction<any>>
  
}

const PaymentApprovalModal = (Props:props) => {
    const { setPaymentApproval, data, modeDetail } = Props
    
    const handleApprove = (e:any) => {
        Props.handlePayment(e.target.name)
    }
  return (
  <section className={styles.Popup}>
      <header>
        <h2 className={styles.popupTypo}>Payment Approval</h2>
        <IconButton
          sx={{ p: "10px" }}
          onClick={() => {
            setPaymentApproval(false)
          }}
        >
          <Close />
        </IconButton>
      </header>

      {["Cheque", "Online Transfer", "UPI", "DD"].includes(data.paymentMode) ? (
        <main>
          <h1>Payment Details</h1>
          <br />
          <div className={styles.popupInfoDiv}>
            <div className={styles.popupBoldFont}>
              <p>
                PaymentMode: <span className={styles.popup_value}>{data.paymentMode}</span>
              </p>
              <p>
                Bank Name:{" "}
                <span className={styles.popup_value}>
                  {data.bankNameField}
                </span>
              </p>
            </div>
            <div className={styles.popupBoldFont}>
              <p>
                {modeDetail?.idField}:{" "}
                <span className={styles.popup_value}>
                  {data.idField}
                </span>
              </p>
              <p>
                {modeDetail?.dateField}:{" "}
                <span className={styles.popup_value}>
                  {data.dateField.toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        </main>
      ) : (
        <main>
          <h1>Payment Details</h1>
          <br />
          <div className={styles.popupInfoDiv}>
            <div className={styles.popupBoldFont}>
              <p>
                PaymentMode:{" "}
                <span className={styles.popup_value}>
                    {modeDetail?.idField}
                    </span>
              </p>
              <p>
                Transaction ID:{" "}
                <span className={styles.popup_value}>
                  {data.idField}
                </span>
              </p>
            </div>
          </div>
        </main>
      )}
      <footer className={styles.popup_footer}>
        <button
          className={styles.popup_cancel}
          onClick={() => {
            setPaymentApproval(false)
          }}
        >
          Cancel
        </button>
        <button className={styles.popup_ack}
        name="PENDING"
        onClick={handleApprove}
         >
          Generate Acknowledgment
        </button>
        <button name="APPROVED" className={styles.popupButton} 
        onClick={handleApprove}
        >
          Approve & Generate
        </button>
      </footer>
    </section>
  );
};

export default PaymentApprovalModal