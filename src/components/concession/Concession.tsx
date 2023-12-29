import styles from "./Concession.module.css";
import ConcessionStudentCard from "../ConcessionStudentCard/ConcessionStudentCard";
import ConcessionClassCard from "../ConcessionClassCard/ConcessionClassCard";
import ConcessionReason from "../ConcessionReason/ConcessionReason";
import { useEffect, useState } from "react";
import api from "@/store/api";

const ConcessionData = ({refetch}:any) => {
  const getConcessionCardData = api((state) => state.getConcessionCardData);

  const schoolId = localStorage.getItem("school_id");

  const [totalClassesConc, setTotalClassesConc] = useState(0);
  const [totalConcAmount, setTotalConcAmount] = useState(0);
  const [boysConcCount, setBoysConcCount] = useState(0);
  const [girlsConcCount, setGirlsConcCount] = useState(0);
  const [totalStudentsCount, setTotalStudentsCount] = useState(0);
  const [maxConc, setMaxConc] = useState({ sectionName: "", concessionAmount: 0 });
  const [minConc, setMinConc] = useState({ sectionName: "", concessionAmount: 0 });

  useEffect(() => {
    (async () => {
      // fetching card datas from server.
      const {
        data: { data },
      } = await getConcessionCardData(schoolId);
      setTotalConcAmount(data.totalConcessionAmount);
      setTotalClassesConc(data.uniqueClassCount);
      setMaxConc(data.maxConcessionSection);
      setMinConc(data.minConcessionSection);
      setTotalStudentsCount(data.totalStudentCount);
      setBoysConcCount(data.studentData.filter((x: any) => x.gender === "Male")[0].count || 0);
      setGirlsConcCount(data.studentData.filter((x: any) => x.gender === "Female")[0].count || 0);
    })();
  }, [refetch]);
  return (
    <>
      <div className={styles.alignCards}>
        <div className={styles.main}>
          <div className={styles.header}>
            <div className={styles.heading}>
              <div className={styles.block}>
                <span className={styles.subHeading}>Total Concession</span>
                <span className={styles.total}>{totalConcAmount}</span>
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.card}>
              <ConcessionStudentCard
                totalStudentsCount={totalStudentsCount}
                boysConcCount={boysConcCount}
                girlsConcCount={girlsConcCount}
              />
            </div>
            <div className={styles.card}>
              <ConcessionClassCard
                maxConc={maxConc}
                minConc={minConc}
                icon="totalrecievable"
                title="Conc.Classes"
                totalAmount={totalClassesConc}
                format={false}
              />
            </div>
          </div>
        </div>
        <div className={styles.reason}>
          <ConcessionReason refetch={refetch} />
        </div>
      </div>
    </>
  );
};

export default ConcessionData;
