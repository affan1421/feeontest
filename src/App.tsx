import { useEffect } from "react";
import styles from "./App.module.css";
import useStore from "./store/global";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import Views from "./Routes/Routes";
import { AuthProvider, useIsAuthenticated } from "react-auth-kit";
import Alert_Message from "./ErrorHandling/Alert_Message";
import api from "./store/api";
import { createTheme, ThemeProvider } from "@mui/material";
import blue from "@mui/material/colors/blue";
import Dialog from "@mui/material/Dialog";
import GlobalSearchStudent from "./components/GlobalSearchStudent/GlobalSearchStudent";
import global from "@/store/global"; 

const theme = createTheme({
  palette: {
    primary: {
      main: blue[900],
    },
  },
});

function App() {
  const Domain_URL = `${import.meta.env.VITE_DOMAIN_FEEON}`;
  return (
    <>
      <ThemeProvider theme={theme}>
        <AuthProvider
          authType={"cookie"}
          authName={"_auth"}
          cookieDomain={Domain_URL}
          cookieSecure={window.location.protocol === "https:"}
        >
          <Root />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

const Root = () => {
  const apiStore = api((state) => state.alertMessage);
  const login = useStore((state) => state.login);
  const logout = useStore((state) => state.logout);
  const isAuthenticated = useIsAuthenticated();
  const searchDialog = global((state) => state.searchDialog);
  const setSearchDialog = global((state) => state.setSearchDialog);
  const getCloseCollectionEditStatusApi = api((state) => state.getEditStatus);

  useEffect(() => {
    (async () => {
      const { data } = await getCloseCollectionEditStatusApi(localStorage.getItem("school_id"));
      localStorage.setItem("collection_editable", data?.data?.allowEdit);
    })();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === "s") {
        handleShortcut();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isAuthenticated()) {
    login();
  } else {
    logout();
  }

  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const closeSidebar = useStore((state) => state.closeSidebar);
  const isSidebarEnabled = useStore((state) => state.isSidebarEnabled);

  const handleShortcut = () => {
    setSearchDialog(!searchDialog);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      setSearchDialog(false);
    }
  };

  const handleSearchClose = () => {
    setSearchDialog(false);
  };

  useEffect(() => {
    if (window.innerWidth < 600) {
      if (isSidebarEnabled) {
        closeSidebar();
      }
    }
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <div className={styles.container}>
          <div className={styles.sidebar}>{isSidebarEnabled && <Sidebar />}</div>
          <div className={styles.main}>
            <Header />
            <Views />
            {apiStore?.isEnabled ? (
              <Alert_Message
                isSnackbar={true}
                AlertProperties={{
                  severity: apiStore?.type,
                  message: apiStore?.message,
                  width: "100%",
                }}
              />
            ) : null}
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          {apiStore?.isEnabled ? (
            <Alert_Message
              isSnackbar={true}
              AlertProperties={{
                severity: apiStore?.type,
                message: apiStore?.message,
                width: "100%",
              }}
            />
          ) : null}
          <Login />
        </div>
      )}
      {isLoggedIn && (
        <Dialog open={searchDialog} onClose={handleSearchClose} PaperProps={{ onKeyDown: handleKeyDown }}>
          <GlobalSearchStudent dialog={setSearchDialog} />
        </Dialog>
      )}
    </>
  );
};

export default App;
