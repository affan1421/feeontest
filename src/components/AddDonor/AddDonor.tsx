import styles from "./AddDonor.module.css";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Input from "@/Elements/Input/Input";
import { useEffect, useState } from "react";
import { Donor } from "@/models/Donor";
import api from "@/store/api";
import { CreateDonorSchema } from "@/FormSchema/FormValidation";

interface Props {
  setDialogEnabled: (state: boolean) => void;
  onFormSubmit: () => void;
  donor?: Donor;
  id?: string;
}

const AddDonor = (props: Props) => {
  const schoolId = localStorage.getItem("school_id") as string;

  const createDonorAPI = api((state) => state.createDonor);
  const updateDonorAPI = api((state) => state.updateDonor);
  const setError = api((state) => state.setError);
  const [donor, setDonor] = useState<Donor>({
    name: "",
    donorType: "default",
    contactNumber: 0,
    email: "",
    address: "",
    accountNumber: 0,
    accountType: "default",
    IFSC: "",
    bank: "",
    schoolId: schoolId,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDonor({
      ...donor,
      name: event.target.value,
    });
  };

  const handleDonorChange = (event: SelectChangeEvent) => {
    setDonor({
      ...donor,
      donorType: event.target.value as "INDIVIDUAL" | "TRUST" | "COMPANY",
    });
  };

  const handleContactChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDonor({
      ...donor,
      contactNumber: Number(event.target.value),
    });
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDonor({
      ...donor,
      email: event.target.value,
    });
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDonor({
      ...donor,
      address: event.target.value,
    });
  };

  const handleAccountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDonor({
      ...donor,
      accountNumber: Number(event.target.value),
    });
  };

  const handleAccountTypeChange = (event: SelectChangeEvent) => {
    setDonor({
      ...donor,
      accountType: event.target.value as "Savings" | "Current",
    });
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDonor({
      ...donor,
      IFSC: event.target.value,
    });
  };

  const handlebankChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDonor({
      ...donor,
      bank: event.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      await CreateDonorSchema.validate(donor, { abortEarly: false });
      setLoading(true);
      if (props.donor) {
        updateDonorAPI(donor, props.id as string).then((response: any) => {
          if (response.status === 200) {
            setDonor({
              ...donor,
              name: "",
              donorType: "default",
              contactNumber: 0,
              email: "",
              address: "",
              accountNumber: 0,
              accountType: "default",
              IFSC: "",
              bank: "",
              schoolId: schoolId,
            });
            props.setDialogEnabled(false);
            props.onFormSubmit();
            setLoading(false);
          }
        });
      } else {
        createDonorAPI(donor).then((response: any) => {
          if (response.status === 201) {
            setDonor({
              ...donor,
              name: "",
              donorType: "default",
              contactNumber: 0,
              email: "",
              address: "",
              accountNumber: 0,
              accountType: "default",
              IFSC: "",
              bank: "",
              schoolId: schoolId,
            });
            props.setDialogEnabled(false);
            props.onFormSubmit();
            setLoading(false);
          }
        });
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      const errorMessage = error.errors.join("\n");
      setError(true, errorMessage);
      setTimeout(() => {
        setError(false, "");
      }, 2000);
    }
  };

  useEffect(() => {
    if (props.donor) {
      setDonor(props.donor);
    }
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <h1>Add Donor</h1>
      </div>
      <div className={styles.dialog_container}>
        <div className={styles.row}>
          <div className={styles.input}>
            <Input width="90%" placeholder="Name" value={donor.name} onChange={handleNameChange} />
          </div>
          <div className={styles.selector}>
            <div>
              <Select value={donor.donorType} onChange={handleDonorChange} style={{ width: "96%", height: "45px" }}>
                <MenuItem value="default">Donor Type</MenuItem>
                <MenuItem value="INDIVIDUAL">Individual</MenuItem>
                <MenuItem value="COMPANY">Company</MenuItem>
                <MenuItem value="TRUST">Trust</MenuItem>
              </Select>
            </div>
          </div>
        </div>
        <div>
          <span className={styles.title}>Contact Details </span>
        </div>
        <div className={styles.row}>
          <div className={styles.input}>
            <Input
              width="90%"
              type="number"
              placeholder="Contact Number"
              value={donor.contactNumber !== 0 ? donor.contactNumber : null}
              onChange={handleContactChange}
            />
          </div>
          <div className={styles.input}>
            <Input width="90%" placeholder="Email" value={donor.email} onChange={handleEmailChange} />
          </div>
        </div>
        <div className={styles.input} style={{ width: "100%" }}>
          <Input width="95%" placeholder="Address" value={donor.address} onChange={handleAddressChange} />
        </div>
        <div>
          <span className={styles.title}>Bank Details</span>
        </div>
        <div className={styles.row}>
          <div className={styles.input}>
            <Input
              width="90%"
              type="number"
              placeholder="Account no"
              value={donor.accountNumber !== 0 ? donor.accountNumber : null}
              onChange={handleAccountChange}
            />
          </div>
          <div className={styles.selector}>
            <div>
              <Select
                value={donor.accountType}
                onChange={handleAccountTypeChange}
                style={{ width: "96%", height: "45px" }}
              >
                <MenuItem value="default">Account Type</MenuItem>
                <MenuItem value="Savings">Savings</MenuItem>
                <MenuItem value="Current">Current</MenuItem>
              </Select>
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.input}>
            <Input width="90%" placeholder="IFSC Code" value={donor.IFSC} onChange={handleCodeChange} />
          </div>
          <div className={styles.input}>
            <Input width="90%" placeholder="Bank Name" value={donor.bank} onChange={handlebankChange} />
          </div>
        </div>
        <div className={styles.button}>
          <div>
            <button className={styles.cancel} onClick={() => props.setDialogEnabled(false)}>
              Cancel
            </button>
          </div>
          <div>
            <button disabled={loading} className={styles.save} onClick={handleSubmit}>
              {props.donor ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDonor;
