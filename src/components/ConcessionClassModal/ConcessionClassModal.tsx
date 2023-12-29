import { InputBase, Paper, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import styles from "./ConcessionClassModal.module.css";
import SearchIcon from "@mui/icons-material/Search";
import ClassConcessionTableModal from "../ClassConcessionTableModal/ClassConcessionTableModal";
import { classModalType } from "@/models/GiveConcessionTypes";
import api from "@/store/api";

const ConcessionClassModal = ({ classId, setDialogEnabled, setConcId, handleStatusUpdate }: any) => {
  const getClassConcDetials = api((state) => state.getClassConcDetials);
  const schoolId = localStorage.getItem("school_id");
  const [search, setSearch] = useState<string>("");
  const [data, setData] = useState<classModalType>({
    className: "",
    students: 0,
    concStudents: 0,
    receivableAmount: 0,
    discount: 0,
    paid: 0,
    concAmount: 0,
    dueAmount: 0,
  });
  const [TotalCount, setTotalCount] = useState(0);
  const [refetch, setRefetch] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [tableData, setTableData] = useState<any[]>([
    {
      id: "",
      className: "",
      totalAmount: 0,
      paidAmount: 0,
      status: "",
      discountAmount: 0,
      totalStudentsCount: 0,
      concAmount: 0,
      studentname: "",
    },
  ]);

  /**
   * For fetch class wise data from server.
   */
  const getModalData = async () => {
    const datas = await getClassConcDetials(schoolId, classId, search);
    const data = datas?.data[0];
    if (!search) {
      setData({
        className: data.className,
        students: data.studentsCount,
        concStudents: data.concessionStudentsCount,
        receivableAmount: data.totalFees,
        discount: data.totalDiscountAmount,
        paid: data.totalPaidFees,
        concAmount: data.totalConcessionAmount,
        dueAmount: data.totalFees - (data.totalPaidFees + data.totalDiscountAmount + data.totalConcessionAmount),
      });
      setTotalCount(data.concessionStudentsCount);
    }
    setTableData(data?.data || []);
  };

  useEffect(() => {
    // fetching data for modal from server.
    getModalData();
  }, [search, refetch]);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.searchInputWrapper}>
          <Paper className={styles.search}>
            <IconButton aria-label="menu">
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder={"Search Students"}
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
              id="filled-hidden-label-small"
              size="small"
            />
          </Paper>
        </div>

        <div className={styles.classDetails}>
          <div>
            <p>Class Name</p>
            <span>{data.className}</span>
          </div>
          <div>
            <p>Students</p>
            <span>{data.students}</span>
          </div>
          <div>
            <p>Conc.Students</p>
            <span>{data.concStudents}</span>
          </div>
          <div>
            <p>Receivable</p>
            <span>{data.receivableAmount}</span>
          </div>
          <div>
            <p>Disc.Amount</p>
            <span>{data.discount}</span>
          </div>
          <div>
            <p>Paid.Amount</p>
            <span>{data.paid}</span>
          </div>
          <div>
            <p>Conc.Amount</p>
            <span>{data.concAmount}</span>
          </div>
          <div>
            <p>Due Amount</p>
            <span>{data.dueAmount}</span>
          </div>
        </div>
      </div>
      <ClassConcessionTableModal
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        setRefetch={setRefetch}
        handleStatusUpdate={handleStatusUpdate}
        setConcId={setConcId}
        setDialogEnabled={setDialogEnabled}
        tableData={tableData}
        totalCount={TotalCount}
      />
    </div>
  );
};

export default ConcessionClassModal;
