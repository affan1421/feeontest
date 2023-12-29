import { Modal } from "@mui/material";
import style from "./TcStudentModal.module.css";
import Chip from "@mui/material/Chip";
import FileDownloadIcon from "../../assests/download.svg";
import CloseIcon from "@mui/icons-material/Close";

export default function TcStudentPreviewModal({
  modalData,
  showModal,
  setShowModal,
}: {
  showModal: any;
  setShowModal: any;
  modalData: any;
}) {
  const handleClick = () => {
    console.info("You clicked the Chip.");
  };

  const handleDelete = () => {
    console.info("You clicked the delete icon.");
  };

  return (
    <Modal open={showModal} onClose={() => setShowModal(false)}>
      <div className={style.modal}>
        <div>
          <div className={style.closeBtnWrapper}>
            <CloseIcon
              sx={{ cursor: "pointer" }}
              onClick={() => setShowModal(false)}
            />
          </div>
          <h1 className={style.heading}>TC Details</h1>
        </div>
        <h1 className={style.subHeading}>Payment Details</h1>

        <div className={style.feesWrapper}>
          <span>
            Total Fees :{" "}
            <span className={style.feesAmount}>
              ₹ {modalData?.pendingAmount + modalData?.paidAmount}
            </span>
          </span>
          <span>
            Paid Fees :{" "}
            <span className={style.feesAmount}>₹ {modalData?.paidAmount}</span>
          </span>
          <span>
            Pending Fees :{" "}
            <span className={style.feesAmount}>
              ₹ {modalData?.pendingAmount}
            </span>
          </span>
        </div>
        <div className={style.schoolWrapper}>
          <h1 className={style.subHeading}>
            School/College Name : <h1>{modalData?.schoolname}</h1>
          </h1>
        </div>
        <h1 className={style.subHeading}>
          Reason : <h1>{modalData?.reason} </h1>
        </h1>
        <div className={style.commentWrapper}>
          <h2 className={style.subHeading}>Comment by admin</h2>
          <p className={style.comment}>
            {modalData?.comment ? modalData.comment : "no comments added"}
          </p>
        </div>
        <div className={style.chipWrapper}>
          {modalData?.attachments?.length > 0 &&
            modalData?.attachments?.map((x: any) => {
              return (
                <a href={x} download={true}>
                  <Chip
                    sx={{
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      ":hover": { textDecoration: "underline", color: "blue" },
                    }}
                    label={x?.split("/").pop()}
                    onClick={handleClick}
                    onDelete={handleDelete}
                    deleteIcon={<img src={FileDownloadIcon} />}
                  />
                </a>
              );
            })}
        </div>
      </div>
    </Modal>
  );
}
