import styles from "./MiscellaneousCollection.module.css";
import { Dialog, SelectChangeEvent } from "@mui/material";
import Input from "@/Elements/Input/Input";
import { useEffect, useState } from "react";
import { Selector } from "@/Elements/Selector/Selector";
import { MiscellaneousFeeType } from "@/models/MiscellaneousFee";
import api from "@/store/api";
import { Class } from "@/models/Class";
import Payment from "../Payment/Payment";
import Receipt from "../Receipt/Receipt";
import { ReceiptModel } from "@/models/Receipt";
import { MiscellaneousCollectionSchema } from "../../FormSchema/FormValidation";

const CreateMiscellaneous = (props: any) => {
  let schoolId = localStorage.getItem("school_id") as string;

  const getClassesAPI = api((state) => state.getClasses);
  const getBySectionIdAPI = api((state) => state.getBySectionId);
  const getMiscellaneousFeeTypesAPI = api((state) => state.getMiscellaneousFeeTypes);
  const miscCollectionAPI = api((state) => state.miscCollection);
  const setError = api((state) => state.setError);
  const getSchoolDetailAPI = api((state) => state.getSchoolDetailsById);

  interface Student {
    _id?: string;
    name: string;
    section?: string;
    parent_id?: {
      name: string;
    };
    value?: string;
  }

  interface MiscFeeType {
    _id?: string;
    feeType: string;
  }

  interface PaymentData {
    paymentMethod: string;
    bankName?: string;
    chequeDate?: string;
    chequeNumber?: string;
    transactionDate?: string;
    transactionId?: string;
    upiId?: string;
    payerName?: string;
    ddNumber?: string;
    ddDate?: string;
    issueDate?: string;
  }

  interface SchoolDetails {
    permissions: {
      ackReceipt: String;
      prevDateReceipt: Boolean;
      prevDateVoucher: Boolean;
    };
  }

  const [miscellaneousFee, setMiscellaneousFee] = useState<MiscellaneousFeeType>({
    studentId: "default",
    receiptType: "MISCELLANEOUS",
    paymentMethod: "",
    feeTypeId: "default",
    classId: "default",
    totalFeeAmount: 0,
    createdBy: localStorage.getItem("user_id") as string,
  });
  const [dialogEnabled, setDialogEnabled] = useState(false);
  const [receiptDialog, setReceiptDialog] = useState(false);

  const [classes, setClasses] = useState<Class[]>([]);
  const [schoolDetails, setSchoolDetails] = useState<SchoolDetails>({
    permissions: {
      prevDateReceipt: false,
      prevDateVoucher: false,
      ackReceipt: "DEFAULT",
    },
  });
  const [receipt, setReceipt] = useState<ReceiptModel>({
    issueDate: "",
    student: {
      name: "",
      studentId: "",
      class: {
        name: "",
        classId: "",
      },
      section: {
        name: "",
        sectionId: "",
      },
    },
    parent: {
      name: "",
      mobile: 0,
      parentId: "",
    },
    academicYear: {
      name: "",
      academicYearId: "",
    },
    status: "APPROVED",
    school: {
      name: "",
      address: "",
      schoolId: "",
    },
    totalAmount: 0,
    paidAmount: 0,
    dueAmount: 0,
    payment: {
      method: "",
    },
    _id: "",
    items: [],
    createdAt: "",
    receiptId: "",
  });
  const [payment, setPayment] = useState<PaymentData>();

  const [studentsbyClass, setStudentsbyClass] = useState<Student[]>([{ name: "Select Student", _id: "default" }]);

  const [miscTypes, setMiscTypes] = useState<MiscFeeType[]>([]);

  const [editableAmount, setEditableAmount] = useState(0);

  const handleStudentSelection = (event: string) => {
    setMiscellaneousFee({
      ...miscellaneousFee,
      studentId: event,
    });
  };

  const getSchoolDetails = () => {
    getSchoolDetailAPI(schoolId).then((response) => {
      let permissions = response.data.data[0].permissions;
      setSchoolDetails({
        ...schoolDetails,
        permissions: permissions,
      });
    });
  };

  const handleClassChange = (event: string) => {
    setMiscellaneousFee({
      ...miscellaneousFee,
      classId: event,
    });
    getStudents(event);
  };

  const handleFeeTypeChange = (event: string) => {
    setMiscellaneousFee({
      ...miscellaneousFee,
      feeTypeId: event,
    });
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMiscellaneousFee({
      ...miscellaneousFee,
      totalFeeAmount: event.target.value,
    });
  };

  const makePayment = async () => {
    try {
      await MiscellaneousCollectionSchema.validate(miscellaneousFee, { abortEarly: false });
      setDialogEnabled(true);
    } catch (error: any) {
      const errorMessage = error.errors.join("\n");
      setError(true, errorMessage);
      setTimeout(() => {
        setError(false, "");
      }, 2000);
    }
  };

  const getClasses = () => {
    getClassesAPI(schoolId).then(async (response: any) => {
      if (response.status === 200) {
        let classes: Class[] = await response.data.data;
        classes.unshift({ name: "Select Class", sectionId: "default" });
        setClasses(classes);
      }
    });
  };

  const getStudents = (classId: string) => {
    getBySectionIdAPI(classId).then(async (response: any) => {
      if (response.status === 200) {
        let students: Student[] = await response.data.data;
        students.unshift({ name: "Select Student", _id: "default" });
        students = students.map((e) => {
          return {
            ...e,
            name: `${e.name} ${e.parent_id?.name ? `(${e.parent_id?.name})` : ""} `,
          };
        });
        setStudentsbyClass(students);
        setMiscellaneousFee((prevState) => ({ ...prevState, studentId: "default" }));
      }
    });
  };

  const getMiscellaneousFeeTypes = () => {
    getMiscellaneousFeeTypesAPI(schoolId).then(async (response: any) => {
      if (response.status === 200) {
        let miscellaneousFeeTypes: MiscFeeType[] = await response.data.data;
        miscellaneousFeeTypes.unshift({ feeType: "Select Fee Type", _id: "default" });
        setMiscTypes(miscellaneousFeeTypes);
      }
    });
  };

  const handlePay = (paymentData: PaymentData, status: string) => {
    setPayment(paymentData);
    let data: MiscellaneousFeeType = {
      ...miscellaneousFee,
      ...paymentData,
    };
    if (status) {
      data.status = status;
    }

    miscCollectionAPI(data)
      .then((response: any) => {
        if (response.status === 201) {
          response.data.data.recieptId = response.data.data.receiptId;
          setReceipt(response.data.data);
          setDialogEnabled(false);
          setReceiptDialog(true);
          setMiscellaneousFee({
            ...miscellaneousFee,
            studentId: "default",
            classId: "default",
            feeTypeId: "default",
            totalFeeAmount: "",
          });
        }
      })
      .catch((err) => {
        console.log(`Error `,err);
      });
  };

  useEffect(() => {
    getClasses();
    getMiscellaneousFeeTypes();
    getSchoolDetails();
  }, []);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.header}>
          <h1>Miscellaneous Form</h1>
        </div>
        <div className={styles.inputs}>
          <div className={styles.row}>
            <div className={styles.selector}>
              <label htmlFor="classSelect">Miscellaneous Type</label>
              <div
                style={{
                  marginTop: "10px",
                }}
              >
                <Selector
                  value={miscellaneousFee.feeTypeId}
                  items={miscTypes.map((e) => {
                    return {
                      name: e.feeType,
                      value: e._id,
                    };
                  })}
                  onChange={handleFeeTypeChange}
                ></Selector>
              </div>
            </div>
            <div className={styles.selector}>
              <label htmlFor="classSelect">Class</label>
              <div
                style={{
                  marginTop: "10px",
                }}
              >
                <Selector
                  value={miscellaneousFee.classId}
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
            <div className={styles.selector}>
              <label htmlFor="classSelect">Student</label>
              <div
                style={{
                  marginTop: "10px",
                }}
              >
                <Selector
                  disabled={studentsbyClass.length === 1}
                  value={miscellaneousFee.studentId}
                  items={studentsbyClass.map((e) => {
                    return {
                      name: e.name,
                      value: e._id,
                    };
                  })}
                  onChange={handleStudentSelection}
                ></Selector>
              </div>
            </div>
          </div>
          <div className={styles.input}>
            <label htmlFor="nameInput" className={styles.label}>
              Amount
            </label>
            <Input
              type="number"
              width="90%"
              placeholder="Amount"
              onChange={handleAmountChange}
              value={miscellaneousFee.totalFeeAmount}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <button className={styles.save} onClick={makePayment}>
            Make Payment
          </button>
        </div>
      </div>
      <Dialog open={dialogEnabled} maxWidth="xl">
        <Payment
          schoolDetails={schoolDetails}
          setPayment={setPayment}
          setDialogEnabled={setDialogEnabled}
          amount={Number(miscellaneousFee.totalFeeAmount)}
          handlePay={handlePay}
        />
      </Dialog>
      <Dialog open={receiptDialog} maxWidth="xl">
        <Receipt receipt={receipt} setDialogEnabled={setReceiptDialog} />
      </Dialog>
    </>
  );
};

export default CreateMiscellaneous;
