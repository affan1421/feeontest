import { dateFormatter } from "@/helpers/dateFormatter";
import api from "@/store/api";
import { Close } from "@mui/icons-material";
import { Button, Divider, IconButton, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { admissionAddedStudent, notUploaded, uploaded } from "../svg";

const DocumentAttachCard = ({ attached, title }: { attached: boolean; title: string }) => {
  return (
    <Stack gap={2}>
      <Typography sx={{ width: "150px" }} fontWeight={"bold"}>
        {title}
      </Typography>
      <Stack
        sx={{
          width: "200px",
          height: "200px",
          border: "3px dashed #C5C5C5",
          borderRadius: 3,
          backgroundColor: "#F6F8FE",
          alignItems: "center",
          justifyContent: "center",
        }}
        gap={1}
      >
        {attached ? uploaded : notUploaded}
        <Typography fontWeight={"bold"} color={"dimgray"}>
          {attached ? "Attached" : "Not attached"}
        </Typography>
      </Stack>
    </Stack>
  );
};

const DetailsCell = ({ title, value }: { title: string; value: string }) => {
  return (
    <Stack width={"100%"} gap={4} direction={"row"} alignItems={"center"}>
      <Typography sx={{ width: "200px" }} fontWeight={"bold"}>
        {title}
      </Typography>
      <Typography>{value}</Typography>
    </Stack>
  );
};

const PreviewAndSubmit = ({
  goToPage,
  existingData,
}: {
  existingData: any;
  goToPage: (pageNumber: number) => void;
}) => {
  const applicationNo = useParams()?.id;
  const admissionAddStudentFinalSubmitApi = api((state) => state.admissionAddStudentFinalSubmit);
  const navigate = useNavigate();
  const [modalData, setModalData] = useState({ open: false, admissionNo: "" });

  const submitData = async () => {
    try {
      const { data: response_data } = await admissionAddStudentFinalSubmitApi(applicationNo);
      setModalData({ open: true, admissionNo: response_data?.newStudent?.admission_no });
    } catch (error) {
      console.log(error);
    }
  };

  const closeAdmissonModal = () => {
    setModalData((pre) => ({ ...pre, open: false }));
    navigate("/admission");
  };

  return (
    <Stack gap={3}>
      <Typography variant="h6">Student details</Typography>
      <Stack
        sx={{
          p: 3,
          backgroundColor: "white",
          borderRadius: 3,
        }}
        gap={2}
      >
        <Stack
          sx={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "1px solid gray",
          }}
        >
          <img
            style={{ minHeight: "100%", minWidth: "100%" }}
            src={existingData?.photoURL}
            alt=""
          />
        </Stack>

        <Stack mt={2} direction={"row"} gap={2}>
          <DetailsCell title="Name of student" value={existingData?.studentName} />
          <DetailsCell title="Date of Birth" value={dateFormatter(new Date(existingData?.dob))} />
        </Stack>
        {/*  */}
        <Stack direction={"row"} gap={2}>
          <DetailsCell title="Gender" value={existingData?.gender} />
          <DetailsCell title="Blood group" value={existingData?.bloodGroup} />
        </Stack>
        {/*  */}
        <Stack direction={"row"} gap={2}>
          <DetailsCell title="Joining Class" value={existingData?.sectionName} />
          <DetailsCell title="Religion" value={existingData?.religion} />
        </Stack>
        {/*  */}
        <Typography mt={3} variant="h6">
          Parent details
        </Typography>
        <Divider />
        <Stack direction={"row"} gap={2}>
          <DetailsCell title="Father's Name" value={existingData?.parentsInfo?.fatherName} />
          <DetailsCell title="Mother's Name" value={existingData?.parentsInfo?.motherName} />
        </Stack>
        {/*  */}
        <Stack direction={"row"} gap={2}>
          <DetailsCell
            title="Father's Occupation"
            value={existingData?.parentsInfo?.fatherOccupation}
          />
          <DetailsCell
            title="Mother's Occupation"
            value={existingData?.parentsInfo?.motherOccupation}
          />
        </Stack>
        {/*  */}
        <Stack direction={"row"} gap={2}>
          <DetailsCell
            title="Father  Contact Number"
            value={existingData?.parentsInfo?.fatherMobileNo}
          />
          <DetailsCell
            title="Mother's  Contact Number"
            value={existingData?.parentsInfo?.motherMobileNo}
          />
        </Stack>
        {/*  */}
        <Stack direction={"row"} gap={2}>
          <DetailsCell title="Father's Mail Id" value={existingData?.parentsInfo?.fatherEmail} />
          <DetailsCell title="Mother's Mail Id" value={existingData?.parentsInfo?.motherEmail} />
        </Stack>
        {/*  */}
        <Stack direction={"row"} gap={2}>
          <DetailsCell title="Residential Address" value={existingData?.residentialAddress} />
          <DetailsCell title="Permanent Address" value={existingData?.permanentAddress} />
        </Stack>
        {/*  */}
        <Typography mt={3} variant="h6">
          Medical information
        </Typography>
        <Divider />
        <Stack direction={"row"} gap={2}>
          <DetailsCell title="Health Condition" value={existingData?.medical?.healthCondition} />
          <DetailsCell
            title="Disability"
            value={existingData?.medical?.disability ? "Yes" : "No"}
          />
        </Stack>
        <Stack direction={"row"} gap={2}>
          <DetailsCell title="Height" value={existingData?.medical?.height} />
          <DetailsCell title="Weight" value={existingData?.medical?.weight} />
        </Stack>
        {/*  */}
      </Stack>
      {/*  */}
      <Stack
        sx={{
          p: 3,
          backgroundColor: "white",
          borderRadius: 3,
        }}
        gap={2}
      >
        <Stack direction={"row"} gap={2}>
          <DetailsCell
            title="Strengths of the Child"
            value={existingData?.teachersFeedback?.strengths}
          />
          <DetailsCell
            title="Areas of Improvement"
            value={existingData?.teachersFeedback?.improvementNeeded}
          />
        </Stack>
      </Stack>
      {/*  */}
      <Stack
        sx={{
          p: 3,
          backgroundColor: "white",
          borderRadius: 3,
        }}
        gap={2}
      >
        <Typography variant="h6">Previous education details</Typography>
        <Divider />
        <Stack p={1} gap={2}>
          <Stack direction={"row"} gap={2}>
            <DetailsCell
              title="School last studied"
              value={existingData?.previousSchool?.prevSchoolName}
            />
            <DetailsCell
              title="General Conduct"
              value={existingData?.previousSchool?.generalConduct}
            />
          </Stack>
          <Stack direction={"row"} gap={2}>
            <DetailsCell
              title="School contact number"
              value={existingData?.previousSchool?.schoolContact}
            />
            <DetailsCell
              title="Reason for leaving school"
              value={existingData?.previousSchool?.reasonForLeaving}
            />
          </Stack>
        </Stack>
      </Stack>
      {/*  */}
      <Stack
        sx={{
          p: 3,
          backgroundColor: "white",
          borderRadius: 3,
        }}
        gap={2}
      >
        <Typography variant="h6">Document Uploaded</Typography>
        <Divider />
        <Stack direction={"row"} gap={2}>
          <DocumentAttachCard attached={existingData?.mandatoryAttachments?.[0]} title="Id proof" />
          <DocumentAttachCard
            attached={existingData?.mandatoryAttachments?.[1]}
            title="Age Proof"
          />
          <DocumentAttachCard
            attached={existingData?.mandatoryAttachments?.[2]}
            title="Residence proof"
          />
        </Stack>
        <Typography mt={3} fontSize={"15px"} fontWeight={"bold"}>
          Conditional - documents
        </Typography>
        <Divider />
        <Stack direction={"row"} gap={2}>
          <DocumentAttachCard
            attached={existingData?.attachments?.[0]}
            title="Guardians ID Proof"
          />
          <DocumentAttachCard
            attached={existingData?.attachments?.[1]}
            title="Category certificate"
          />
          <DocumentAttachCard
            attached={existingData?.attachments?.[2]}
            title="Income certificate"
          />
        </Stack>
      </Stack>
      <Modal
        open={modalData.open}
        onClose={closeAdmissonModal}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Stack sx={{ backgroundColor: "white", p: 4, borderRadius: 3, minWidth: "400px" }} gap={4}>
          <Stack>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"end"}>
              <IconButton onClick={closeAdmissonModal}>
                <Close />
              </IconButton>
            </Stack>
            <Typography textAlign={"center"} variant="h6">
              Student added successfully!
            </Typography>
          </Stack>
          <Stack>
            {admissionAddedStudent}
            <Typography textAlign={"center"} color={"dimgray"}>
              STUDENT ADMISSION NUMBER
            </Typography>
            <Typography textAlign={"center"} variant="h6">
              {modalData?.admissionNo}
            </Typography>
          </Stack>
        </Stack>
      </Modal>
      <Stack direction={"row"} justifyContent={"end"} gap={1}>
        <Button
          variant="outlined"
          onClick={() => {
            goToPage(4);
          }}
        >
          Go back
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            submitData();
          }}
        >
          Submit
        </Button>
      </Stack>
      <Stack sx={{ height: "100px" }}></Stack>
    </Stack>
  );
};

export default PreviewAndSubmit;
