import { Button, LinearProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import BasicInfo from "./BasicInfo/BasicInfo";
import TestPerfomance from "./TestPerfomance/TestPerfomance";
import PreviousEducation from "./PerviousEducation/PreviousEducation";
import DocumentUpload from "./DocumentUpload/DocumentUpload";
import PreviewAndSubmit from "./PreviewAndSubmit/PreviewAndSubmit";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "@/store/api";

interface ProgressStepData {
  title: string;
  completed: boolean;
}

const Progress = ({ data = [] }: { data: ProgressStepData[] }) => {
  return (
    <Stack
      direction={"row"}
      sx={{
        gap: "3px",
        p: 3,
        px: 10,
        pb: 7,
        backgroundColor: "white",
        borderRadius: 3,
        border: "1px solid var(--border-color-1)",
      }}
    >
      {data?.map((step, i, arr) => {
        return (
          <>
            {i + 1 != arr.length && (
              <Stack sx={{ width: "100%" }} direction="row" alignItems={"center"} gap={"3px"}>
                <Stack
                  alignItems={"center"}
                  justifyContent={"center"}
                  sx={{
                    width: "40px",
                    height: "40px",
                    backgroundColor:
                      step?.completed || arr[i - 1]?.completed || i == 0 ? "#2760ea" : "#d2dcf1",
                    borderRadius: "50%",
                    position: "relative",
                  }}
                  flexShrink={0}
                >
                  <Typography color={"white"} fontWeight={"bold"}>
                    {i + 1}
                  </Typography>
                  <Stack position={"absolute"} sx={{ bottom: -30, whiteSpace: "nowrap" }}>
                    {step?.title}
                  </Stack>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={step?.completed ? 100 : -10}
                  sx={{ width: "100%" }}
                />
              </Stack>
            )}
            {i + 1 == arr.length && (
              <Stack>
                <Stack
                  alignItems={"center"}
                  justifyContent={"center"}
                  sx={{
                    width: "40px",
                    height: "40px",
                    backgroundColor:
                      step?.completed || arr[i - 1]?.completed ? "#2760ea" : "#d2dcf1",
                    borderRadius: "50%",
                    position: "relative",
                  }}
                >
                  <Typography color={"white"} fontWeight={"bold"}>
                    {i + 1}
                  </Typography>
                  <Stack position={"absolute"} sx={{ bottom: -30, whiteSpace: "nowrap" }}>
                    {step?.title}
                  </Stack>
                </Stack>
              </Stack>
            )}
          </>
        );
      })}
    </Stack>
  );
};

const progressInitialData = [
  {
    title: "Basic information",
    completed: false,
  },
  {
    title: "Test performance",
    completed: false,
  },
  {
    title: "Previous education",
    completed: false,
  },
  {
    title: "Document Upload",
    completed: false,
  },
  {
    title: "Preview and Submit",
    completed: false,
  },
];

const AddStudent = () => {
  const applicationId = useParams()?.id;
  const [searchParsms, setSearchParams] = useSearchParams();

  const admissionBasicLeadInfoApi = api((state) => state.admissionBasicLeadInfo);
  const [existingData, setExistingData] = useState({});
  const navigate = useNavigate();

  const [progressData, setProgressData] = useState(progressInitialData);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await admissionBasicLeadInfoApi(applicationId);
        setExistingData(data?.data);
      } catch (error) {
        navigate("/admission");
      }
    })();
  }, [searchParsms]);

  const goToPage = (pageNumber: number) => {
    setSearchParams((pre) => {
      pre.set("step", pageNumber + "");
      return pre;
    });
  };

  useEffect(() => {
    const step = Number(searchParsms?.get("step"));
    if (!step || step > progressInitialData?.length || step <= 0) {
      setSearchParams((pre) => {
        pre.set("step", "1");
        return pre;
      });
    } else {
      setProgressData((pre) => {
        return [...pre].map((e, i) => {
          return i >= step - 1 ? { ...e, completed: false } : { ...e, completed: true };
        });
      });
    }
  }, [searchParsms]);

  const Pages = [
    <BasicInfo existingData={existingData} goToPage={goToPage} />,
    <TestPerfomance existingData={existingData} goToPage={goToPage} />,
    <PreviousEducation existingData={existingData} goToPage={goToPage} />,
    <DocumentUpload existingData={existingData} goToPage={goToPage} />,
    <PreviewAndSubmit existingData={existingData} goToPage={goToPage} />,
  ];

  return (
    <Stack p={3} gap={3}>
      <Progress data={progressData} />
      <Stack>{Pages[Number(searchParsms?.get("step")) - 1 || 0]}</Stack>
    </Stack>
  );
};

export default AddStudent;
