import api from "@/store/api";
import { Close } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function ClassListModal({ handleModalClose, setRefetch }: any) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setError] = useState<any[]>([]);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const getClassDataApi = api((state) => state.getClassData);
  const createSeatsApi = api((state) => state.createSeats);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data } = await getClassDataApi();
      setLoading(false);
      console.log("class data", data);
      setData(data?.data?.length > 0 ? data?.data : data?.data?.classInfo || []);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    const newData = data.map((classData: any) => ({
      ...classData,
      sectionDetails: classData.sectionDetails.map((section: any) => ({
        ...section,
        totalSeats: section.totalSeats === "" ? 0 : Number(section.totalSeats),
      })),
    }));

    const allEmpty = newData.every((classData: any) =>
      classData.sectionDetails.every((section: any) => section.totalSeats === 0)
    );

    const isEmpty = data.every((x: any) => x.sectionDetails.every((y: any) => !y.totalSeats));

    if (isEmpty) {
      setShowConfirmation(true);
      return;
    }

    if (allEmpty) {
      setShowConfirmation(true);
      return;
    }

    const error = newData
      .filter((x: any) =>
        x.sectionDetails.some((y: any) => y.totalSeats === undefined || y.totalSeats === null)
      )
      .flatMap((x: any) => x.sectionDetails);

    if (error.length > 0) {
      setError(error);
      return;
    }

    console.log("data", newData);
    const response = await createSeatsApi(newData);

    if (response?.status === 200) {
      handleModalClose();
      setRefetch((prev: boolean) => !prev);
    }

    console.log(response);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  const handleConfirmationContinue = () => {
    setShowConfirmation(false);
    handleSave();
    handleModalClose();
  };

  const handleInputChange = (value: number | null, CIndex: number, index: number) => {
    setData((prev: any) => {
      const newState = [...prev];
      newState[CIndex] = {
        ...newState[CIndex],
        sectionDetails: [
          ...newState[CIndex].sectionDetails.slice(0, index),
          {
            ...newState[CIndex].sectionDetails[index],
            totalSeats: value,
          },
          ...newState[CIndex].sectionDetails.slice(index + 1),
        ],
      };

      return newState;
    });
  };

  if (loading) {
    return (
      <Stack height={"100vh"} justifyContent={"center"} alignItems={"center"}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack p={2} justifyContent={"center"}>
      <Dialog open={showConfirmation} onClose={handleConfirmationClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>Are you sure you want to continue without Adding any Seats?</DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmationContinue} color="primary" autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
        <Typography fontSize={16} fontWeight={500} color={"#171717"}>
          Class-wise seat vacancy
        </Typography>
        <IconButton onClick={handleModalClose}>
          <Close />
        </IconButton>
      </Stack>

      <Grid p={3} justifyContent={"space-between"} gap={2} container>
        {data?.length > 0 &&
          data?.map((data: any, CIndex: number) => (
            <Card err={err} data={data} handleInputChange={handleInputChange} CIndex={CIndex} />
          ))}
      </Grid>
      <Stack px={3}>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save details
        </Button>
      </Stack>
    </Stack>
  );
}

function Card({ data, handleInputChange, CIndex, err }: any) {
  return (
    <Grid
      item
      xs={3.8}
      p={2}
      sx={{ display: "flex", gap: "5px", flexDirection: "column" }}
      borderRadius={1}
      border={"1px solid #00000030"}
    >
      <Typography fontWeight={"bold"} fontSize={15} color={"#171717"}>
        {data?.className}
      </Typography>

      <Stack overflow={"auto"} height={125} gap={1} px={1} className="custom-scroll-bar">
        {data?.sectionDetails?.length > 0 &&
          data?.sectionDetails?.map((x: any, index: number) => {
            return (
              <Stack key={index} direction={"row"} alignItems={"center"} gap={1}>
                <Typography
                  whiteSpace={"nowrap"}
                  width={200}
                  textOverflow={"ellipsis"}
                  overflow={"hidden"}
                >
                  {x?.sectionName}
                </Typography>
                :
                <TextField
                  value={x?.totalSeats}
                  onChange={(e: any) => handleInputChange(Number(e?.target?.value), CIndex, index)}
                  type="number"
                  sx={{ height: "35px" }}
                  variant="outlined"
                  size="small"
                  // error={err?.some((section:any)=>  section?.sectionId === x?.sectionId)}
                />
              </Stack>
            );
          })}
      </Stack>

      <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} gap={1}>
        <Typography fontSize={15} color={"#171717"}>
          Total :
        </Typography>
        {/* <TextField
          value={
            data?.sectionDetails?.length > 0 &&
            data?.sectionDetails?.reduce((acc: any, curr: any) => {
              return acc + Number(curr?.value || 0);
            }, 0)
          }
          disabled
          type="number"
          variant="filled"
          size="small"
        /> */}
        <Typography>
          {data?.sectionDetails?.length > 0 &&
            data?.sectionDetails?.reduce((acc: any, curr: any) => {
              return acc + Number(curr?.totalSeats || 0);
            }, 0)}
        </Typography>
      </Stack>
    </Grid>
  );
}
