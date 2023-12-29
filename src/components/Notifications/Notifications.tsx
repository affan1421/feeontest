import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Badge, Box, Stack, Typography } from "@mui/material";
import useNotificationStore from "@/store/notification";
import NotificationsIcon from "@mui/icons-material/NotificationsNone";
import PersonIcon from "@mui/icons-material/Person";
import PaidIcon from "@mui/icons-material/Paid";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DiscountIcon from "@mui/icons-material/Discount";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import LaunchIcon from "@mui/icons-material/Launch";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const school_id = localStorage.getItem("school_id");
  const role = localStorage.getItem("role_name");
  const [open, setOpen] = useState<boolean>(false);
  const [newNotification, setNewNotification] = useState<boolean>(false);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const addAllNotifications = useNotificationStore((state) => state.setAllNotifications);
  const notifications = useNotificationStore((state) => state.notifications);
  const navigate = useNavigate();

  const notificationIcons = {
    TC: <PersonIcon />,
    PAYMENT: <PaidIcon />,
    RECEIPT: <ReceiptIcon />,
    DISCOUNT: <DiscountIcon />,
    DONATION: <VolunteerActivismIcon />,
  };

  const notificationColorStatus = {
    SUCCESS: "#C8FFB0",
    ERROR: "#FFB0B0",
    WARNING: "#FFD57D",
    DEFAULT: "#B0FEFF",
  };

  useEffect(() => {
    const connectionUrl = import.meta.env.VITE_API_URL_FEEON?.split("/api/v1")?.[0];
    const clientId = `${school_id}_${role == "management" ? "MANAGEMENT" : "ADMIN"}`;
    const server = io(connectionUrl, { auth: { clientId } });

    server.on("connect", () => {
      /** Sends the connection is about to be closed   */
      window.addEventListener("beforeunload", () => {
        server.emit("disconnecting");
      });

      /** Initial adding or notifications from server */
      server.emit("notification:get_all", (notifications: any) => {
        addAllNotifications(notifications);
      });

      /** Recive each notification from server */
      server.on("notification:recive", (dataToSet) => {
        setNewNotification(true);
        addNotification(dataToSet);
      });
      //
    });

    return () => {
      server.close();
    };
  }, []);

  const handleAction = (url: string) => {
    navigate(`${url}`);
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      setNewNotification(false);
    }
  }, [open]);
  return (
    <>
      {open && (
        <Box
          sx={{
            position: "fixed",
            zIndex: 10,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, .3)",
          }}
          onClick={() => setOpen((prev: boolean) => !prev)}
        ></Box>
      )}
      <Box sx={{ position: "relative", zIndex: 20 }}>
        <div>
          <Badge color="primary" overlap="circular" variant="dot" invisible={!newNotification}>
            <NotificationsIcon
              sx={{ cursor: "pointer", color: open ? "white" : "black" }}
              onClick={() => setOpen((prev: boolean) => !prev)}
            />
          </Badge>
        </div>
        {open && (
          <Stack
            bgcolor={"white"}
            gap={1}
            borderRadius={2}
            width={300}
            p={3}
            position={"absolute"}
            top={30}
            right={"-50%"}
            sx={{ border: "1px solid #DBDBDB", cursor: "pointer" }}
          >
            <Typography variant="h6">Notifications</Typography>
            <Stack
              gap={1}
              height={350}
              sx={{
                overflowX: "hidden",
                scrollBehavior: "smooth",
                "::-webkit-scrollbar": {
                  width: "6px",
                },
                "::-webkit-scrollbar-thumb": {
                  background: "#e0e0e0",
                  borderRadius: "6px",
                },
              }}
            >
              {notifications?.map((notification) => {
                return (
                  <>
                    <Stack
                      onClick={() => handleAction(notification.action)}
                      direction={"row"}
                      alignItems={"center"}
                      gap={2}
                      py={0.5}
                      bgcolor={"white"}
                      borderRadius={2}
                      sx={{
                        paddingLeft: "5px",
                        ":hover": {
                          backgroundColor: "#e6e6e66b",
                          "div:nth-child(3)": {
                            visibility: "visible",
                          },
                        },
                      }}
                    >
                      <Stack
                        width={25}
                        // height={25}
                        alignItems={"center"}
                        justifyContent={"center"}
                        bgcolor={notificationColorStatus[notification?.status]}
                        p={0.8}
                        borderRadius={50}
                      >
                        {notificationIcons[notification?.type]}
                      </Stack>
                      <Box pr={1} width={"100%"}>
                        <Typography
                          textTransform={"capitalize"}
                          variant="subtitle2"
                          fontWeight={"500"}
                          my={0}
                          py={0}
                          lineHeight={1}
                        >
                          {notification?.title?.toLowerCase()}
                        </Typography>
                        <Typography variant="caption" lineHeight={1}>
                          {notification?.description}
                        </Typography>
                        <br />
                        <Typography variant="caption"> {new Date(notification?.createdAt).toDateString()}</Typography>
                      </Box>
                      <Stack visibility={"hidden"} justifyContent={"end"} px={1}>
                        <LaunchIcon fontSize="small" />
                      </Stack>
                    </Stack>
                    {/* <Divider /> */}
                  </>
                );
              })}

              {notifications?.length > 0 && (
                <Typography mt={1} textAlign={"center"} variant="caption">
                  Look's like you are reached the end
                </Typography>
              )}
              {notifications?.length == 0 && (
                <Typography
                  height={"100%"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  variant="caption"
                >
                  It's quiet here!
                </Typography>
              )}
            </Stack>
          </Stack>
        )}
      </Box>
    </>
  );
};

export default Notifications;
