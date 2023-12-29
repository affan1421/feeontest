import style from "./TransferCertficate.module.css";
import { IconButton, InputBase, Paper, SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import { Selector } from "@/Elements/Selector/Selector";
import SearchIcon from "@mui/icons-material/Search";
import { GenerateTcModal } from "@/components/GenerateTcModal/GenerateTcModal";
import TransferCerticateCard from "../../components/TransferCerticateCard/TransferCerticateCard";
import api from "@/store/api";
import StudentsTcList from "@/components/StudentsTcList/StudentsTcList";
import TcStudentPreviewModal from "@/components/TcStudentPreview/TcStudentPreviewModal";

interface selecTypes {
  name: string;
  value: string;
}

export default function TransferCertficate() {
  const schoolId = localStorage.getItem("school_id") as string;
  const [search, setSearch] = useState("");
  const [classSelect, setClassSelect] = useState("default");
  const [statusSelect, setStatusSelect] = useState("default");
  const [classList, setClassList] = useState<selecTypes[]>([]);
  const [refetch, setRefetch] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const statusList = [
    { name: "Pending", value: "PENDING" },
    { name: "Approved", value: "APPROVED" },
    { name: "Rejected", value: "REJECTED" },
  ];

  const selectWidth = "150px";

  const classListApi = api((state) => state.getClasses);
  const getClassList = async (school_id: string) => {
    const { data } = await classListApi(school_id);
    setClassList(
      data?.data?.map((pre: any) => ({
        ...pre,
        value: `${pre.class_id}_${pre.name}`,
      }))
    );
  };
  useEffect(() => {
    getClassList(schoolId);
  }, []);

  const [modalData, setModalData] = useState(null);

  const viewTcDetails = api((state) => state.viewTcDetails);
  async function handleModalOpen(id: string) {
    const { status, data } = await viewTcDetails(id);
    if (status === 200) {
      setModalData(data.data[0]);
      setShowModal(true);
    }
    console.log(data, 67);
  }

  function handleClassSelectChange(e: string) {
    setClassSelect(e);
  }

  const AlumniTabItems = [
    {
      minWidth: "100px",
      compo: (
        <Paper className={style.search}>
          <IconButton aria-label="menu">
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ height: "100%" }}
            placeholder={"Search Students"}
            id="filled-hidden-label-small"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Paper>
      ),
    },
    {
      minWidth: selectWidth,
      compo: (
        <Selector
          defaultValue="All Classes"
          value={classSelect}
          onChange={handleClassSelectChange}
          items={classList}
          height="auto !important"
          enableDefault
        />
      ),
    },
    {
      minWidth: selectWidth,
      compo: (
        <Selector
          defaultValue="All Status"
          value={statusSelect}
          onChange={(e) => setStatusSelect(e)}
          items={statusList}
          height="auto !important"
          enableDefault
        />
      ),
    },
  ];

  // {
  //   minWidth: selectWidth,
  //   compo: (
  //     <Selector
  //       defaultValue="Reason Type"
  //       value={selectValue}
  //       onChange={() => console.log("change")}
  //       items={reasonSelectorList}
  //       height="auto !important"
  //     />
  //   ),
  // },

  const content = [
    {
      title: "ALUMINI-TC",
      items: AlumniTabItems,
    },
    {
      title: "AVAIL-TC",
      items: AlumniTabItems,
    },
    // {
    //   title: "Blocked Students",
    //   items: BlockedTabItems,
    // },
  ];

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className={style.main}>
      <div className={style.list}>
        <div className={style.header}>
          <span>Transfer Certificates</span>
          <button data-testid="add-new" onClick={() => setOpenModal(true)}>
            Generate TC
          </button>
          <GenerateTcModal setRefetch={setRefetch} open={openModal} setOpen={setOpenModal} />
        </div>
        <TransferCerticateCard refetch={refetch} />
        <TcStudentPreviewModal modalData={modalData} showModal={showModal} setShowModal={setShowModal} />
        <StudentsTcList
          refetch={refetch}
          setRefetch={setRefetch}
          class={classSelect}
          status={statusSelect}
          search={search}
          content={content}
          setShowModal={setShowModal}
          handleModalOpen={handleModalOpen}
        />
      </div>
    </div>
  );
}
