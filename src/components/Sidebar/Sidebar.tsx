import styles from "./Sidebar.module.css";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import {
  Admission,
  Build,
  Dashboard,
  Donor,
  Expense,
  Feesetup,
  History,
  Income,
  NoteStack,
  Receipt,
  Savings,
  Sell,
  Transfer,
} from "./Svg";

interface MenuItem {
  label: string;
  path?: string;
  disabled?: boolean;
  isComingSoon?: boolean;
  icon: string;
  submenu?: SubMenuItem[];
  roles?: string[];
}

interface SubMenuItem {
  label: string;
  path: string;
  icon: string;
}

const IconComponent = ({
  icon,
  isSubmenu,
  isActive,
}: {
  icon: string;
  isSubmenu: boolean;
  isActive: boolean;
}) => {
  const icons: any = {
    DashboardIcon: (
      <div style={isSubmenu ? { marginTop: "12px" } : {}} className={styles.icon}>
        <Dashboard fill={"#2760EA"} isActive={isActive} />
      </div>
    ),
    FeeSetupIcon: (
      <div style={isSubmenu ? { marginTop: "12px" } : {}} className={styles.icon}>
        <Feesetup fill={"#2760EA"} isActive={isActive} />
      </div>
    ),
    CategoryIcon: (
      <div style={isSubmenu ? { marginTop: "12px" } : {}} className={styles.icon}></div>
    ),
    FeeCollectionIcon: (
      <div style={isSubmenu ? { marginTop: "12px" } : {}} className={styles.icon}>
        <Savings fill={"#2760EA"} isActive={isActive} />
      </div>
    ),
    Receipts: (
      <div style={isSubmenu ? { marginTop: "12px" } : {}} className={styles.icon}>
        <Receipt fill={"#2760EA"} isActive={isActive} />
      </div>
    ),
    StudentCollectionIcon: (
      <div style={isSubmenu ? { marginTop: "12px" } : {}} className={styles.icon}></div>
    ),
    MiscellaneousCollectionIcon: (
      <div style={isSubmenu ? { marginTop: "12px" } : {}} className={styles.icon}></div>
    ),
    ConcessionIcon: (
      <div style={isSubmenu ? { marginTop: "12px" } : {}} className={styles.icon}>
        <Receipt fill={"#2760EA"} isActive={isActive} />
      </div>
    ),
    ApplicationFormIcon: (
      <div style={isSubmenu ? { marginTop: "12px" } : {}} className={styles.icon}></div>
    ),
    DueListIcon: <div style={isSubmenu ? { marginTop: "12px" } : {}} className={styles.icon}></div>,
    Students: (
      <div style={isSubmenu ? { marginTop: "12px" } : {}} className={styles.icon}>
        <NoteStack fill={"#2760EA"} isActive={isActive} />
      </div>
    ),
    DiscountIcon: (
      <div style={isSubmenu ? { marginTop: "12px" } : {}} className={styles.icon}>
        <Sell fill={"#2760EA"} isActive={isActive} />
      </div>
    ),
    // TransportationIcon: (
    //   <div style={isSubmenu ? { marginTop: "12px" } : {}} className={styles.icon}>
    //     <NoteStack fill={"#2760EA"} isActive={isActive} />
    //   </div>
    // ),
    ExpenseIcon: (
      <div style={isSubmenu ? { marginTop: "12px" } : {}} className={styles.icon}>
        <Expense fill={"#2760EA"} isActive={isActive} />
      </div>
    ),
    IncomeIcon: (
      <div style={isSubmenu ? { marginTop: "12px" } : {}} className={styles.icon}>
        <Income fill={"#2760EA"} isActive={isActive} />
      </div>
    ),
    DonorIcon: (
      <div style={isSubmenu ? { marginTop: "12px" } : {}} className={styles.icon}>
        <Donor fill={"#2760EA"} isActive={isActive} />
      </div>
    ),
    PreviousBalance: (
      <div style={isSubmenu ? { marginTop: "12px" } : {}} className={styles.icon}>
        <History fill={"#2760EA"} isActive={isActive} />
      </div>
    ),
    SetupIcon: (
      <div style={isSubmenu ? { marginTop: "12px" } : {}} className={styles.icon}>
        <Build fill={"#2760EA"} isActive={isActive} />
      </div>
    ),
    TransferCertificate: (
      <div style={isSubmenu ? { marginTop: "12px" } : {}} className={styles.icon}>
        <Transfer fill={"#2760EA"} isActive={isActive} />
      </div>
    ),
    // Admission: (
    //   <div style={isSubmenu ? { marginTop: "12px" } : {}} className={styles.icon}>
    //     <Admission fill={"#2760EA"} isActive={isActive} />
    //   </div>
    // ),
  };

  return icons[icon] || <></>;
};

const SidebarComponent = () => {
  const signOut = useSignOut();
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role_name");

  const menuItems: MenuItem[] = [
    { label: "Dashboard", path: "/", icon: "DashboardIcon", roles: ["school_admin", "management"] },
    {
      label: "Fee Setup",
      path: "/fee-structure",
      icon: "FeeSetupIcon",
      submenu: [{ label: "Fee Category", icon: "CategoryIcon", path: "/feecategory" }],
      roles: ["school_admin", "management"],
    },
    {
      label: "Fee Collection",
      path: "/collection",
      icon: "FeeCollectionIcon",
      submenu: [
        { label: "Student Collection", icon: "StudentCollectionIcon", path: "/collection" },
        {
          label: "Misc Collections",
          icon: "MiscellaneousCollectionIcon",
          path: "/miscellaneouscollection",
        },
        { label: "Application Form", icon: "ApplicationFormIcon", path: "/applicationform" },
        { label: "Due List", icon: "DueListIcon", path: "/duelist" },
      ],
      roles: ["school_admin", "management"],
    },
    { label: "Receipts", icon: "Receipts", path: "/receipts", roles: ["management"] },
    {
      label: "Student Report",
      icon: "Students",
      path: "/students",
      roles: ["school_admin", "management"],
    },
    // { label: 'Receipts', icon: 'Receipts', path: '/admin-receipts', roles: ['school_admin'],disabled:true },
    {
      label: "Payment Confirmations",
      icon: "Receipts",
      path: "/payment-confirmations",
      roles: ["management"],
    },
    {
      label: "Discount",
      icon: "DiscountIcon",
      path: "/discount",
      roles: ["school_admin", "management"],
    },
    // {
    //   label: "Transportation",
    //   icon: "TransportationIcon",
    //   path: "/transportation",
    //   roles: ["school_admin", "management"],
    // },
    {
      label: "Concession",
      icon: "ConcessionIcon",
      path: "/concession",
      roles: ["school_admin", "management"],
    },
    // {
    //   label: "Admission",
    //   icon: "Admission",
    //   path: "/admission",
    //   roles: ["school_admin", "management"],
    // },

    {
      label: "Expense",
      icon: "ExpenseIcon",
      path: "/expense",
      roles: ["school_admin", "management"],
    },
    { label: "Income", icon: "IncomeIcon", path: "/income", roles: ["school_admin", "management"] },
    { label: "Donor", icon: "IncomeIcon", path: "/donor", roles: ["school_admin", "management"] },
    {
      label: "Previous Balance",
      icon: "PreviousBalance",
      path: "/previous-balance",
      roles: ["school_admin", "management"],
    },
    {
      label: "Transfer Certificate",
      icon: "SetupIcon",
      path: "/transfer-certificates",
      roles: ["school_admin", "management"],
    },
    { label: "Setup", icon: "SetupIcon", path: "/setup", roles: ["school_admin", "management"] },
  ];

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  const handleLogoutClick = () => {
    localStorage.clear();
    signOut();
    navigate("/");
  };

  const allowedMenuItems = menuItems.filter((menuItem) => {
    if (menuItem.roles && role) {
      return menuItem.roles.includes(role);
    }
    return true;
  });

  return (
    <Sidebar>
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h1>
            <span className={styles.logo}>fee</span>On
          </h1>
        </div>
        <hr />
        <Menu>
          {allowedMenuItems.map((menuItem, index) =>
            menuItem.submenu ? (
              <SubMenu
                key={index}
                icon={
                  <IconComponent
                    icon={menuItem.icon}
                    isSubmenu={true}
                    isActive={location.pathname === menuItem.path}
                  />
                }
                label={menuItem.label}
              >
                {menuItem.submenu.map((submenuItem, subIndex) => (
                  <MenuItem
                    key={subIndex}
                    className={location.pathname === submenuItem.path ? styles.active : ""}
                    onClick={() => handleMenuItemClick(submenuItem.path)}
                  >
                    <div className={styles.menuItem}>
                      <IconComponent
                        icon={submenuItem.icon}
                        isSubmenu={false}
                        isActive={location.pathname === submenuItem.path}
                      />
                      {submenuItem.label}
                    </div>
                  </MenuItem>
                ))}
              </SubMenu>
            ) : (
              <MenuItem
                key={index}
                className={location.pathname === menuItem.path ? styles.active : ""}
                disabled={menuItem.disabled}
                onClick={() => handleMenuItemClick(menuItem.path as string)}
              >
                <div className={styles.menuItem}>
                  <IconComponent
                    icon={menuItem.icon}
                    isSubmenu={false}
                    isActive={location.pathname === menuItem.path}
                  />
                  {menuItem.label}
                </div>
                {menuItem.isComingSoon && <span className={styles.status}>Coming Soon</span>}
              </MenuItem>
            )
          )}
        </Menu>
        <div className={styles.logout}>
          <Button variant="outlined" onClick={handleLogoutClick}>
            Logout
          </Button>
        </div>
      </div>
    </Sidebar>
  );
};

export default SidebarComponent;
