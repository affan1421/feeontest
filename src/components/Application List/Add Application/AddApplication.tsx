import { Dialog, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import styles from "./AddApplication.module.css";
import Input from "@/Elements/Input/Input";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { Selector } from "@/Elements/Selector/Selector";
import { ApplicationForm } from "@/models/ApplicationForm";
import { ApplicationFormSchema } from "@/FormSchema/FormValidation";
import api from "@/store/api";
import { Class } from "@/models/Class";
import Receipt from "@/components/Receipt/Receipt";
import { ReceiptModel } from "@/models/Receipt";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

interface MenuItem {
  name: string;
  value: string;
}

interface Props {
  setIsAdd?: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddApplication = (props: Props) => {
  let schoolId = localStorage.getItem("school_id") as string;

  // API's
  const setError = api((state) => state.setError);
  const createApplicationFeeAPI = api((state) => state.createApplicationFee);
  const getClassesAPI = api((state) => state.getClasses);

  // const [value, setValue] = useState('female');

  const [applicationForm, setApplicationForm] = useState<ApplicationForm>({
    studentName: "",
    classId: "default",
    sectionId: "default",
    className: "",
    gender: "default",
    parentName: "",
    parentType: "default",
    phoneNumber: 0,
    course: "",
    amount: 0,
    schoolId: schoolId,
    paymentMode: "CASH",
    createdBy: localStorage.getItem("user_id") as string,
  });
  const [classes, setClasses] = useState<Class[]>([]);
  const [dialogEnabled, setDialogEnabled] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<ReceiptModel>({} as ReceiptModel);
  const [loading, setLoading] = useState<boolean>(false);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setApplicationForm({
      ...applicationForm,
      studentName: event.target.value,
    });
  };

  const handleGenderChange = (event: string) => {
    setApplicationForm({
      ...applicationForm,
      gender: event,
    });
  };

  const handleParentTypeChange = (event: string) => {
    setApplicationForm({
      ...applicationForm,
      parentType: event as "FATHER" | "MOTHER" | "GUARDIAN" | "OTHER",
    });
  };

  const handleParentNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setApplicationForm({
      ...applicationForm,
      parentName: event.target.value,
    });
  };

  const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    setApplicationForm({
      ...applicationForm,
      phoneNumber: Number(event.target.value),
    });
  };

  const getSectionId = (id: string) => {
    return classes.filter((e) => e.sectionId == id)[0].class_id as string;
  };

  const handleClassChange = (event: string) => {
    let className = classes.filter((e) => e.sectionId == event)[0].name;
    setApplicationForm({
      ...applicationForm,
      sectionId: event as string,
      classId: getSectionId(event as string),
      className: className,
    });
  };

  const handleCourseChange = (event: ChangeEvent<HTMLInputElement>) => {
    setApplicationForm({
      ...applicationForm,
      course: event.target.value,
    });
  };

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setApplicationForm({
      ...applicationForm,
      amount: Number(event.target.value),
    });
  };

  const getClasses = () => {
    getClassesAPI(schoolId).then((response: any) => {
      if (response.status === 200) {
        setClasses(response.data.data);
      }
    });
  };

  const createApplicationFee = () => {
    createApplicationFeeAPI(applicationForm).then((response: any) => {
      if (response.status === 201) {
        let item = response.data.data;
        item.receipt.createdAt = item.receipt.issueDate;
        item.receipt.status = "APPROVED";
        item.receipt.recieptId = item.receipt.receiptId;
        item.receipt.paidAmount = item.amount;
        setReceipt(response.data.data.receipt);
        setDialogEnabled(true);
      }
    });
  };

  const makePayment = async () => {
    try {
      setLoading(true);
      await ApplicationFormSchema.validate(applicationForm, { abortEarly: false });
      createApplicationFee();
      setApplicationForm({
        studentName: "",
        classId: "default",
        sectionId: "default",
        className: "",
        gender: "",
        parentType: "default",
        parentName: "",
        phoneNumber: 0,
        course: "",
        amount: 0,
        schoolId: schoolId,
        paymentMode: "CASH",
        createdBy: localStorage.getItem("user_id") as string,
      });
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
    getClasses();
  }, []);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.header}>
          <h1>Application Form</h1>
        </div>
        <div className={styles.inputs}>
          <div className={styles.row}>
            <div className={styles.input}>
              <label htmlFor="nameInput" className={styles.label}>
                Student Name
              </label>
              <Input
                width="90%"
                placeholder="Student name"
                value={applicationForm.studentName}
                onChange={handleNameChange}
              />
            </div>
            <div className={styles.selector} style={{ marginBottom: "12px" }}>
              <label htmlFor="classSelect" className={styles.clabel}>
                Gender
              </label>
              <div style={{ marginTop: "10px" }}>
                <Selector
                  defaultValue="Select Gender"
                  value={applicationForm.gender}
                  items={[
                    { name: "Male", value: "Male" },
                    { name: "Female", value: "Female" },
                  ]}
                  onChange={handleGenderChange}
                ></Selector>
              </div>
            </div>
            <div className={styles.selector}>
              <label htmlFor="classSelect" className={styles.clabel}>
                Class
              </label>
              <div
                style={{
                  marginTop: "10px",
                }}
              >
                <Selector
                  defaultValue="Select Class"
                  value={applicationForm.sectionId}
                  items={classes.map((e) => {
                    return {
                      name: e.name,
                      value: e.sectionId,
                    };
                  })}
                  onChange={handleClassChange}
                ></Selector>
              </div>
            </div>
            <div className={styles.selector} style={{ marginBottom: "12px" }}>
              <label htmlFor="classSelect" className={styles.clabel}>
                Parent Type
              </label>
              <div style={{ marginTop: "10px" }}>
                <Selector
                  defaultValue="Parent Type"
                  value={applicationForm.parentType}
                  items={[
                    { name: "Father", value: "FATHER" },
                    { name: "Mother", value: "MOTHER" },
                    { name: "Guardian", value: "GUARDIAN" },
                    { name: "other", value: "OTHER" },
                  ]}
                  onChange={handleParentTypeChange}
                ></Selector>
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.input}>
              <label htmlFor="nameInput" className={styles.label}>
                Parent Name
              </label>
              <Input
                width="90%"
                placeholder="Parent Name"
                value={applicationForm.parentName}
                onChange={handleParentNameChange}
              />
            </div>
            <div className={styles.input}>
              <label htmlFor="nameInput" className={styles.label}>
                Phone Number
              </label>
              <Input
                width="90%"
                type="number"
                value={applicationForm.phoneNumber !== 0 ? applicationForm.phoneNumber : null}
                placeholder="Phone Number"
                onChange={handlePhoneNumberChange}
              />
            </div>
            <div className={styles.input}>
              <label htmlFor="nameInput" className={styles.label}>
                Course
              </label>
              <Input width="90%" placeholder="Course" value={applicationForm.course} onChange={handleCourseChange} />
            </div>
            <div className={styles.input}>
              <label htmlFor="nameInput" className={styles.label}>
                Amount
              </label>
              <Input
                width="90%"
                type="number"
                placeholder="Enter Amount"
                value={applicationForm.amount !== 0 ? applicationForm.amount : null}
                onChange={handleAmountChange}
              />
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <button disabled={loading} className={styles.save} onClick={makePayment}>
            Make Payment
          </button>
        </div>
      </div>
      <Dialog open={dialogEnabled} maxWidth="xl">
        <Receipt receipt={receipt} setDialogEnabled={setDialogEnabled} />
      </Dialog>
    </>
  );
};

export default AddApplication;
