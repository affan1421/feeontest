import styles from "./Header.module.css";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import useStore from "../../store/global";
import user from "@/assests/user.png";
import global from "@/store/global";
import Notifications from "../Notifications/Notifications";

const Header = () => {
  const toggleSidebar = useStore((state) => state.toggleSidebar);
  const setSearchDialog = global((state) => state.setSearchDialog);
  const searchDialog = global((state) => state.searchDialog);
  const user_image = localStorage.getItem("user_image");
  const name = localStorage.getItem("name");
  const schoolName = localStorage.getItem("school_name");

  return (
    <>
      <div className={styles.main}>
        <div className={styles.left}>
          <IconButton onClick={toggleSidebar} sx={{ p: "10px" }} aria-label="menu">
            <MenuIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setSearchDialog(!searchDialog);
            }}
            sx={{ p: "10px" }}
            aria-label="menu"
          >
            <SearchIcon />
          </IconButton>
          <span className={styles.school_name}>{schoolName}</span>
        </div>
        <div className={styles.right}>
          <Notifications />
          <div className={styles.user_info}>
            {user_image ? (
              <img
                src={user_image ? user_image : ""}
                height={30}
                style={{ borderRadius: "50px", marginLeft: "10px" }}
              />
            ) : (
              <img src={user} height={30} style={{ borderRadius: "50px", marginLeft: "10px" }} />
            )}
            <span>{name}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
