import styles from "./TransferCerticateCard.module.css";
import TotalTcs from "./TotalTcs";
import ClassTcs from "./ClassTcs";
import TcReasons from "./TcReasons";
import { useEffect, useState } from "react";
import api from "@/store/api";
import { TcResponseData } from "@/models/StudentTranserDetails";

const TransferCerticateCard = ({ refetch }: { refetch: number }) => {
  const apiGetApi = api((s) => s.getTcDetails);
  const schoolId = localStorage.getItem("school_id") as string
  const [tcDetails, setTcDetails] = useState<TcResponseData>({
    countsByType: {
      typeResult: [
        {
          tcType: "",
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
        },
      ],
    },
    reasonsData: {
      reasonResult: [
        {
          reason: "",
          count: 0,
        },
      ],
    },
    classData: {
      classResult: [
        {
          className: "",
          count: 0,
        },
      ],
    },
    tcsCount: 0,
    classCount: 0,
    reasonCount: 0,
  });

  const getAllTcClasses = async () => {
    try {
      const response = await apiGetApi(schoolId);
      setTcDetails(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (refetch != 1) getAllTcClasses();
  }, [refetch]);

  return (
    <div className={styles.container}>
      <TotalTcs tcDetails={tcDetails} />
      <ClassTcs tcDetails={tcDetails} />
      <TcReasons tcDetails={tcDetails} />
    </div>
  );
};

export default TransferCerticateCard;
