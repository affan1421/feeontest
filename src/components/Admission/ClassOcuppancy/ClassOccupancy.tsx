import { Button, CircularProgress, Divider, Grid, Paper, Stack, Tooltip, Typography } from "@mui/material";
import chairImage from "../../../assests/Chair.svg";
import VaccencyGraph from "../ClassList/VaccencyGraph";
import pageInfo from "../../../assests/page_info.svg";
import { useEffect, useState } from "react";
import api from "@/store/api";

export default function ClassOccupancy({ handleModalOpen, refetch }: any) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const getGraphDataApi = api((state) => state.getGraphData);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await getGraphDataApi();
    setData(data?.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [refetch]);

  return (
    <Grid item xs={12}>
      <Paper elevation={0} sx={{ padding: "16px", height: "345px" }}>
        <Stack p={1} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
          <Tooltip title={"Reload"}>
            <Typography sx={{ cursor: "pointer" }} onClick={fetchData} color={"#171717"} fontSize={16} fontWeight={500}>
              Class occupancy
            </Typography>
          </Tooltip>
          <img onClick={handleModalOpen} style={{ width: "25px", height: "25px" }} src={pageInfo} alt="" />
        </Stack>
        <Divider />
        {loading ? (
          <Stack height={"100%"} justifyContent={"center"} alignItems={"center"}>
            <CircularProgress />
          </Stack>
        ) : data?.length > 0 ? (
          <VaccencyGraph items={data} />
        ) : (
          <Grid gap={2} display={"flex"} height={"100%"} alignItems={"center"} container>
            <Grid item xs={5.5}>
              <img src={chairImage} alt="" />
            </Grid>
            <Grid
              item
              xs={5.5}
              gap={1.5}
              display={"flex"}
              direction={"column"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Typography>Setup Class wise seat vacancy to view data</Typography>
              <Stack>
                <Button onClick={handleModalOpen} variant="contained">
                  Setup
                </Button>
              </Stack>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Grid>
  );
}
