import styles from "./Concession.module.css";
import ConcessionData from "@/components/concession/Concession";
import { useState } from "react";
import { Dialog } from "@mui/material";
import CreateConcession from "@/components/CreateConcession/CreateConcession";
import ConcessionList from "@/components/ConcessionList/ConcessionList";

const Concession = () => {
  const [dialogEnabled, setDialogEnabled] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Concessions</span>
        <button onClick={() => { setDialogEnabled(true) }} >
          Give Concession
        </button>
      </div>
      <div className={styles.main}>
        <div className={styles.concCard}>
          <ConcessionData refetch={refetch} />
        </div>
        <ConcessionList refetch={refetch} setRefetch={setRefetch} />
      </div>
      <Dialog open={dialogEnabled} onClose={()=> setDialogEnabled(false)} maxWidth="lg">
        <CreateConcession
         setRefetch={setRefetch}
          setDialogEnabled={setDialogEnabled}
        />
      </Dialog>
    </div>
  );
};

export default Concession;
