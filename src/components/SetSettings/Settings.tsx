import { Divider, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import styles from "./Settings.module.css";
import AddIcon from "../../assests/add_circle.svg";
import api from "@/store/api";
import { useEffect, useState } from "react";
import CreateReasonType from "../CreateReasonType/CreateReasonType";
import { Dialog } from "@mui/material";
import ConcessionReasonModal from "../ConcessionReasonModal/ConcessionReasonModal";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

interface TcReasonResponse {
  map(arg0: (item: any) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
  id: string;
  reason: string;
}

const Settings = () => {
  const [selectedReason, setSelectedReason] = useState("TransferCertificate");

  // API's
  const getTcReasonsAPI = api((state) => state.getReasonTypes);
  const geConcReasonsAPI = api((state) => state.getConcReason);

  const [concEdit, setConcEdit] = useState(false);
  const [tcEdit, setTcEdit] = useState(false);
  const [tcDialogEnabled, setTcDialogEnabled] = useState(false);
  const [tcReasons, setTcReasons] = useState<TcReasonResponse[]>([]);
  const [concDialogEnabled, setconcDialogEnabled] = useState(false);
  const [concReasons, setConReasons] = useState<TcReasonResponse[]>([]);
  const [tcReasonType, setTcReasonType] = useState<any>({
    reason: "",
    id: "",
  });
  const [concReasonType, setConcReasonType] = useState<any>({
    reason: "",
    id: "",
  });

  const schoolId = localStorage.getItem("school_id") as string;

  useEffect(() => {
    getTcReasonTypes(schoolId);
    getConcReasonTypes(schoolId);
  }, []);

  const getTcReasonTypes = (school_id: string) => {
    getTcReasonsAPI(school_id).then((response: any) => {
      if (response && response.data && response.data.data) {
        let data = response.data.data.reasons;
        data.map((item: any) => {
          item.id = item._id;
        });
        setTcReasons(data);
      }
    });
  };

  const getConcReasonTypes = (school_id: string) => {
    geConcReasonsAPI(school_id).then((response: any) => {
      if (response && response.data && response.data.data) {
        let data = response.data.data.reasons;
        data.map((item: any) => {
          item.id = item._id;
        });
        setConReasons(data);
      }
    });
  };

  useEffect(() => {
    if (!concDialogEnabled) {
      getConcReasonTypes(schoolId);
    }
  }, [concDialogEnabled]);

  useEffect(() => {
    if (!tcDialogEnabled) {
      getTcReasonTypes(schoolId);
    }
  }, [tcDialogEnabled]);

  const handleRadioChange = (event: any) => {
    setSelectedReason(event.target.value);
  };

  const editConcReason = async (data: any) => {
    try {
      setConcEdit(true);
      setConcReasonType(data);
      setconcDialogEnabled(true);
    } catch (error) {
      console.error("Error deleting concession reason:", error);
    }
  };

  const editTcReason = async (data: any) => {
    try {
      setTcEdit(true);
      setTcReasonType(data);
      setTcDialogEnabled(true);
    } catch (error) {
      console.error("Error deleting concession reason:", error);
    }
  };



  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.heading}>Reason Types</span>
        <div className={styles.reasons}>
          <RadioGroup row value={selectedReason} onChange={handleRadioChange}>
            <FormControlLabel
              value="TransferCertificate"
              control={<Radio />}
              label="Transfer Certificate"
              className={styles.formControlLabel}
            />
            <FormControlLabel value="Concession" control={<Radio />} label="Concession" />
          </RadioGroup>
        </div>
      </div>
      <div className={styles.line}>
        <Divider className={styles.margin} />
      </div>
      {selectedReason === "TransferCertificate" && (
        <div className={styles.reasonTypes}>
          <div
            onClick={() => {
              setTcDialogEnabled(true);
              setTcEdit(false)
            }}
            className={styles.addHeader}
          >
            <img className={styles.addIcon} src={AddIcon} alt="add-icon" />
            <span>Add new</span>
          </div>
          {tcReasons.map((item: any) => {
            return (
              <div key={item.id} className={styles.buttonContainer}>
                <div onClick={() => editTcReason(item)}>
                  <EditOutlinedIcon style={{ color: "blue" }} />
                </div>
                <span>{item.reason}</span>
              </div>
            );
          })}
        </div>
      )}
      {selectedReason === "Concession" && (
        <div className={styles.reasonTypes}>
          <div
            onClick={() => {
              setconcDialogEnabled(true);
              setConcReasonType({
                id: "",
                reason: "",
              });
              setConcEdit(false)
            }}
            className={styles.addHeader}
          >
            <img className={styles.addIcon} src={AddIcon} alt="add-icon" />
            <span>Add new</span>
          </div>
          {concReasons.map((item: any) => {
            return (
              <div key={item.id} className={styles.buttonContainer}>
                <div onClick={() => editConcReason(item)}>
                  <EditOutlinedIcon style={{ color: "blue" }} />
                </div>
                <span>{item.reason}</span>
              </div>
            );
          })}
        </div>
      )}
      <Dialog open={tcDialogEnabled} maxWidth="xl">
        <CreateReasonType isEdit={tcEdit} reasonType={tcReasonType} setDialogEnabled={setTcDialogEnabled} />
      </Dialog>

      <Dialog open={concDialogEnabled} maxWidth="xl">
        <ConcessionReasonModal
          isConEdit={concEdit}
          reasonType={concReasonType}
          setDialogEnabled={setconcDialogEnabled}
        />
      </Dialog>
    </div>
  );
};

export default Settings;
