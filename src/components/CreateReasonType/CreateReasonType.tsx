import { Paper, InputBase, TextareaAutosize, Dialog } from "@mui/material";
import styles from "./CreateReasonType.module.css";
import api from "@/store/api";
import { useEffect, useState } from "react";
import { createReasonTypeSchema } from "@/FormSchema/FormValidation";
import { ReasonTypeModel } from "@/models/ReasonType";

interface CreateReasonTypeProps {
  isEdit: boolean;
  reasonType: ReasonTypeModel;
  setDialogEnabled: (value: boolean) => void;
}

const CreateExpenseType = (props: CreateReasonTypeProps) => {
  // API's
  const createReasonTypeAPI = api((state) => state.createReasonType);
  const updateReasonTypeAPI = api((state) => state.updateReasonType);
  const setError = api((state) => state.setError);

  // Data Variables
  const [reasonType, setReasonType] = useState<ReasonTypeModel>({
    id: "",
    reason: "",
    schoolId: localStorage.getItem("school_id") as string,
  });

  const handleClose = () => {
    props.setDialogEnabled(false);
  };

  const handleReasonNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReasonType({
      ...reasonType,
      reason: event.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await createReasonTypeSchema.validate(reasonType, { abortEarly: false });
      await createReasonTypeAPI(reasonType).then((response: any) => {
        if (response.status == 200) {
          setReasonType({
            reason: "",
          });
          handleClose();
        }
      });
    } catch (error: any) {
      const errorMessage = error.errors.join("\n");
      setError(true, errorMessage);
      setTimeout(() => {
        setError(false, "");
      }, 2000);
    }
  };

  const handleUpdate = async () => {
    try {
      await createReasonTypeSchema.validate(reasonType, { abortEarly: false });
      await updateReasonTypeAPI(reasonType).then((response: any) => {
        if (response.status == 200) {
          setReasonType({
            ...reasonType,
            reason: "",
          });
          handleClose();
        }
      });
    } catch (error: any) {
      const errorMessage = error.errors.join("\n");
      setError(true, errorMessage);
      setTimeout(() => {
        setError(false, "");
      }, 2000);
    }
  };

  useEffect(() => {
    if (props.isEdit) {
      setReasonType(props.reasonType);
    }
  }, []);

  return (
    <>
      <Dialog open={true} onClose={handleClose} maxWidth="xl">
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Create Reason Type</h1>
          </div>
          <div className={styles.main}>
            <div className={styles.row}>
              <div style={{ width: "95%" }}>
                <label>
                  <b>Reason Type Name</b>
                </label>
                <Paper className={styles.input}>
                  <InputBase
                    placeholder="Reason Type"
                    size="small"
                    className={styles.input_input}
                    value={reasonType.reason}
                    onChange={handleReasonNameChange}
                  />
                </Paper>
              </div>
            </div>
          </div>
          <div className={styles.action}>
            <button className={styles.cancel} onClick={handleClose}>
              {" "}
              Cancel
            </button>
            {!props.isEdit ? (
              <button
                onClick={() => {
                  handleSave();
                }}
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => {
                  handleUpdate();
                }}
              >
                Update
              </button>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default CreateExpenseType;
