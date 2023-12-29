import api from "@/store/api";
import styles from "./ConfirmPayment.module.css";
import { FeeCollectionAPI } from "../../models/FeeCollection";
import { ReceiptModel } from "@/models/Receipt";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import React from "react";
import { ModeDetail } from "../MakePayment/MakePayment";

interface ConfirmPaymentProps {
  mode: string;
  modeDetail: ModeDetail;
  inputValues: ModeDetail;
  data: FeeCollectionAPI;
  setDialogPaymentEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setDialogEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setReceipt: React.Dispatch<React.SetStateAction<ReceiptModel>>;
}

const ConfirmPayment = (props: ConfirmPaymentProps) => {
  const { mode, modeDetail, inputValues, data } = props;
  const makePaymentAPI = api((state) => state.makePayment);

  const ackHandler = async () => {
    data.status = "PENDING";
    const response = await makePaymentAPI(data);
    if (response.status === 201) {
      props.setDialogPaymentEnabled(false);
      props.setDialogEnabled(true);
      props.setReceipt(response.data.data);
    }
  };

  const approveHandler = async () => {
    data.status = "APPROVED";

    const response = await makePaymentAPI(data);
    if (response.status === 201) {
      props.setDialogPaymentEnabled(false);
      props.setDialogEnabled(true);
      props.setReceipt(response.data.data);
    }
  };

  return (
    <section className={styles.Popup}>
      <header>
        <h2 className={styles.popupTypo}>Payment Approval</h2>
        <IconButton
          sx={{ p: "10px" }}
          onClick={() => {
            props.setDialogPaymentEnabled(false);
          }}
        >
          <Close />
        </IconButton>
      </header>

      {["Cheque", "Online Transfer", "UPI", "DD"].includes(mode) ? (
        <main>
          <h1>Payment Details</h1>
          <br />
          <div className={styles.popupInfoDiv}>
            <div className={styles.popupBoldFont}>
              <p>
                PaymentMode: <span className={styles.popup_value}>{mode}</span>
              </p>
              <p>
                Bank Name:{" "}
                <span className={styles.popup_value}>
                  {inputValues.bankNameField}
                </span>
              </p>
            </div>
            <div className={styles.popupBoldFont}>
              <p>
                {modeDetail.idField}:{" "}
                <span className={styles.popup_value}>
                  {inputValues.idField}
                </span>
              </p>
              <p>
                {modeDetail.dateField}:{" "}
                <span className={styles.popup_value}>
                  {inputValues.dateField.toLocaleString()}
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
                <span className={styles.popup_value}>{modeDetail.idField}</span>
              </p>
              <p>
                Transaction ID:{" "}
                <span className={styles.popup_value}>
                  {inputValues.idField}
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
            props.setDialogPaymentEnabled(false);
          }}
        >
          Cancel
        </button>
        <button className={styles.popup_ack} onClick={ackHandler}>
          Generate Acknowledgment
        </button>
        <button className={styles.popupButton} onClick={approveHandler}>
          Approve & Generate
        </button>
      </footer>
    </section>
  );
};

export default ConfirmPayment;
