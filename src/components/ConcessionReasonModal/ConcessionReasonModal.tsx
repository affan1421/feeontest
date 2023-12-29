import styles from "./ConcessionReasonModal.module.css";
import { Paper, InputBase, Dialog } from "@mui/material";
import api from "@/store/api";
import { useEffect, useState } from "react";
import { createReasonTypeSchema } from "@/FormSchema/FormValidation";
import { ReasonTypeModel } from "@/models/ReasonType";

interface CreateReasonTypeProps {
    isConEdit: boolean;
    reasonType: ReasonTypeModel;
    setDialogEnabled: (value: boolean) => void;
}

const ConcessionReasonModal = (props: CreateReasonTypeProps) => {
 // API's
 const createReasonTypeAPI = api((state) => state.createConcReason);
 const updateReasonTypeAPI = api((state) => state.updateConcReason);
 const setError = api((state) => state.setError);

  // Data Variables
  const [reasonType, setReasonType] = useState<ReasonTypeModel>({
    id: "",
    reason: "",
    schoolId: localStorage.getItem("school_id") as string,
  });

  const handleClose = () => {
    props.setDialogEnabled(false);
    setReasonType({
      ...reasonType,
      reason: "",
    });
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
          reason: "",
        });
        handleClose();

        // Set props.isConEdit to false after a successful update
        props.setDialogEnabled(false);
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
  if(props.isConEdit){
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
           {!props.isConEdit ? (
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

export default ConcessionReasonModal;
