import api from "@/store/api";
import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PreviousEducation = ({
  goToPage,
  existingData,
}: {
  existingData: any;
  goToPage: (pageNumber: number) => void;
}) => {
  const admissionUpdatePreviousEducationApi = api((state) => state.admissionUpdatePreviousEducation);
  const applicationNo = useParams()?.id;

  const [schoolDetails, setSchoolDetails] = useState({
    prevSchoolName: "",
    generalConduct: "",
    reasonForLeaving: "",
    schoolContact: 0,
    additionalInfo: "",
  });

  useEffect(() => {
    setSchoolDetails((pre) => ({
      ...pre,
      ...existingData?.previousSchool,
    }));
  }, [existingData]);

  const submitData = async () => {
    const { data: response_data } = await admissionUpdatePreviousEducationApi({
      applicationNo: applicationNo,
      previousSchool: schoolDetails,
    });
    if (response_data?.success) goToPage(4);
  };

  return (
    <Stack gap={3}>
      <Typography variant="h6">Previous education details</Typography>
      <Stack
        sx={{
          p: 3,
          backgroundColor: "white",
          borderRadius: 3,
        }}
        gap={2}
      >
        <Typography fontWeight={"bold"}>School details</Typography>
        <Divider />
        <Stack gap={3} direction={"row"}>
          <Stack gap={1} width={"100%"}>
            <Typography>School last attended</Typography>
            <TextField
              value={schoolDetails?.prevSchoolName}
              onChange={(e) => setSchoolDetails((pre) => ({ ...pre, prevSchoolName: e.target.value }))}
              size="small"
              placeholder="Enter last studied school's name"
            />
          </Stack>
          <Stack gap={1} width={"100%"}>
            <Typography>School contact number</Typography>
            <TextField
              value={schoolDetails?.schoolContact}
              onChange={(e) =>
                setSchoolDetails((pre) => ({ ...pre, schoolContact: e.target.value as unknown as number }))
              }
              size="small"
              placeholder="1234567891"
            />
          </Stack>
        </Stack>
        <Stack gap={1} width={"49.2%"}>
          <Typography>General conduct of the student</Typography>
          <TextField
            value={schoolDetails?.generalConduct}
            onChange={(e) => setSchoolDetails((pre) => ({ ...pre, generalConduct: e.target.value }))}
            size="small"
            placeholder="eg. Excellent"
          />
        </Stack>
        <Stack gap={1} width={"49.2%"}>
          <Typography>Reason for leaving the School</Typography>
          <TextField
            value={schoolDetails?.reasonForLeaving}
            onChange={(e) => setSchoolDetails((pre) => ({ ...pre, reasonForLeaving: e.target.value }))}
            size="small"
            placeholder="Type something.."
          />
        </Stack>
      </Stack>
      <Stack
        sx={{
          p: 3,
          backgroundColor: "white",
          borderRadius: 3,
        }}
        gap={2}
      >
        <Typography fontWeight={"bold"}>Additional Information(if any)</Typography>
        <Divider />
        <Stack gap={3} direction={"row"}>
          <Stack gap={1} width={"100%"}>
            <TextField
              value={schoolDetails?.additionalInfo}
              onChange={(e) => setSchoolDetails((pre) => ({ ...pre, additionalInfo: e.target.value }))}
              size="small"
              placeholder="Type something.."
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack direction={"row"} justifyContent={"end"} gap={1}>
        <Button
          variant="outlined"
          onClick={() => {
            goToPage(2);
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
          Save and continue
        </Button>
      </Stack>
    </Stack>
  );
};

export default PreviousEducation;
