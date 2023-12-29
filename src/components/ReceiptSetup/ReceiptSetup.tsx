import styles from "./ReceiptSetup.module.css";
import { RadioGroup, FormControlLabel, Radio, Divider } from "@mui/material";
import api from "@/store/api";
import { useEffect, useState } from "react";
import FinanceSetup from "../FinanceSetup/FinanceSetup";

const ReceiptSetup = () => {
  const [ackReceipt, setAckReceipt] = useState('DEFAULT');

  let schoolId = localStorage.getItem("school_id") as string;

  const getSchoolDetailAPI = api((state) => state.getSchoolDetailsById);
  const updateAckReceipt = api((state) => state.updateAckReceipt);

  const getSchoolDetails = () => {
    getSchoolDetailAPI(schoolId).then((response) => {
      let permissions = response.data.data[0].permissions;
      setAckReceipt(permissions.ackReceipt ?? "NONE");
      console.log(ackReceipt);
    });
  };

  useEffect(() => {
    getSchoolDetails();
  }, []);

  //handle change for radio buttons and call api /isLead
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = (event.target as HTMLInputElement).value;
    console.log("setvalue", value);
    setAckReceipt( value);

    updateAckReceipt(schoolId, value).then((response) => {
      console.log(response);
    });
  };

  return (
    <div className={styles.main}>
      <div className={styles.description}>
        <p className={styles.title}>Online Payment Confirmation - Acknowledgment</p>
        <p className={styles.sub_title}>
          The Payment Confirmation Acknowledgment feature verifies all payment
          methods except cash, offering you control over pending or incomplete
          payments.
        </p>
      </div>
      <br />
      <div className={styles.options_container}>
        <RadioGroup
          value={ackReceipt}
          onChange={handleChange}
        >
          <FormControlLabel
            value="MANAGEMENT"
            disabled={ackReceipt === "DEFAULT"}
            control={<Radio />}
            label={
              <div>
                <p className={styles.option_title}>
                  Generate Acknowledgment Receipts (Super Admin Confirmation)
                </p>
                <p className={styles.option_desc}>
                  Generate Acknowledgment receipts before final receipts.
                  Payments trigger Acknowledgment and await super admin approval
                  for final receipt generation.
                </p>
              </div>
            }
          />
          <br />
          <FormControlLabel
            value="BOTH"
            disabled={ackReceipt === "DEFAULT"}
            control={<Radio />}
            label={
              <div>
                <p className={styles.option_title}>Admin Confirmation</p>
                <p className={styles.option_desc}>
                  Prompts admin for confirmation via popup with payment details.
                  Admin can approve and generate receipt if payment is
                  confirmed.
                </p>
              </div>
            }
          />
          <br />
          <FormControlLabel
            value="NONE"
            disabled={ackReceipt === "DEFAULT"}
            control={<Radio />}
            label={
              <div>
                <p className={styles.option_title}>
                  Generate Receipts (No Confirmation Layers)
                </p>
                <p className={styles.option_desc}>
                  Generates receipts without payment confirmation layers
                </p>
              </div>
            }
          />
        </RadioGroup>
      </div>
      <div className={styles.divider_line}>
      <Divider/>
      </div >
      
      <FinanceSetup/>
    </div>
  );
};

export default ReceiptSetup;
