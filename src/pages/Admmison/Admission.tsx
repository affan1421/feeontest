import { Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import studentImage from "../../assests/StudentIcon.svg";
import { SaveAsSharp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Button, Dialog } from "@mui/material";
import { useState, useEffect } from "react";
import ClassListModal from "../../components/Admission/ClassList/ClassListModal";
import ClassOccupancy from "@/components/Admission/ClassOcuppancy/ClassOccupancy";
import AdmissionList from "@/components/Admission/AdmissonList/AdmissionList";
import LeadsIcon from "../../assests/LeadsIcon.svg";
import FormIssued from "../../assests/form-Issued.svg";
import Admitted from "../../assests/admitted.svg";
import Rejected from "../../assests/rejected.svg";
import api from "@/store/api";

export default function Admission() {
  const navigate = useNavigate();
  const [classModal, setClassModal] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [cardList, setCardList] = useState<any[]>([]);

  const handleModalOpen = () => setClassModal(true);
  const handleModalClose = () => setClassModal(false);

  const getCardDataApi = api((state) => state.getCardData);

  const fetchCardData = async (statusIcons: any) => {
    try {
      const { data } = await getCardDataApi();
      console.log("data", Object.keys(data?.data));
      setCardList(
        Object.keys(data?.data)?.map((x: any, i: number) => ({
          label: x,
          amount: data?.data[x],
          icon: <img key={i} src={statusIcons[i]} alt="Status Icon" />,
        }))
      );
    } catch (error) {
      console.error("Error fetching card data:", error);
    }
  };

  useEffect(() => {
    const statusIcons = [LeadsIcon, FormIssued, FormIssued, Admitted, Rejected, Rejected];
    fetchCardData(statusIcons);
  }, []);

  return (
    <Stack padding={2} gap={4}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        borderRadius={2}
        justifyContent={"space-between"}
        p={"30px 30px 0px"}
        bgcolor={"#C3CFEC"}
      >
        <Typography fontSize={22} fontWeight={500} color={"#2760EA"}>
          Student Admissions
        </Typography>
        <img src={studentImage} alt="" />
      </Stack>

      <Grid container justifyContent={"space-around"} gap={1}>
        <ClassOccupancy refetch={refetch} handleModalOpen={handleModalOpen} />
      </Grid>

      <Stack overflow={"auto"} className="custom-scroll-bar" pb={1} direction={"row"} gap={1}>
        {cardList?.length > 0 &&
          cardList.map((x: any, i: number) => (
            <Stack
              key={i}
              sx={{ p: 2, backgroundColor: "white", width: "100%", borderRadius: 2 }}
              direction={"row"}
              gap={2}
            >
              {x?.icon && (
                <Stack alignItems={"center"} justifyContent={"center"}>
                  {x?.icon}
                </Stack>
              )}
              <Stack>
                <Typography>{x?.label}</Typography>
                <Typography fontWeight={"bold"} fontSize={"20px"}>
                  {x?.amount}
                </Typography>
              </Stack>
            </Stack>
          ))}
      </Stack>

      <AdmissionList />

      <Dialog onClose={handleModalClose} maxWidth={"md"} fullWidth open={classModal}>
        <ClassListModal setRefetch={setRefetch} handleModalClose={handleModalClose} />
      </Dialog>
    </Stack>
  );
}
