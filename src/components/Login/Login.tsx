import React from "react";
import { useState } from "react";
import styles from "./Login.module.css";
import useStore from "../../store/api";
import globalStore from "../../store/global";
import { useSignIn } from "react-auth-kit";
import { LoginData, LoginProps } from "../../models/Login";
import Item from "@/assests/Item.svg";
import School from "@/assests/school.svg";
import Phone from "@/assests/phone.svg";
import Lock from "@/assests/lock.svg";

const Login: React.FC<LoginProps> = ({ handleLoginMock }) => {
  const signIn = useSignIn();
  const api = useStore();
  const global = globalStore();

  const [loginData, setLoginData]: any = useState<LoginData>({
    username: null,
    password: "",
    school_code: null,
    global: false,
  });

  const handleLogin = async () => {
    localStorage.clear();
    api.login(loginData).then(
      async (response: any) => {
        if (response?.data.status == 200) {
          global.login();
          signIn({
            token: await response.data.token,
            expiresIn: 3600,
            tokenType: "Bearer",
            authState: { loginData: loginData, school_id: response.data.user_info[0].school_details[0]._id },
          });
          localStorage.setItem("school_id", response.data.user_info[0].school_details[0]._id);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("role_id", response.data.user_info[0].role._id);
          localStorage.setItem("role_name", response.data.user_info[0].role.role_name);
          localStorage.setItem("user_id", response.data.user_info[0]._id);
          localStorage.setItem("user_profile", response.data.user_info[0].user_profile);
          localStorage.setItem("name", response.data.user_info[0].name || "User");
          localStorage.setItem("school_name", response.data.user_info[0].school_details[0].schoolName);
          localStorage.setItem("school_address", response.data.user_info[0].school_details[0].address);
          // window.location.reload();
        }
      },
      (error: any) => {
        // alert(error?.response.data.message)
      }
    );
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <div className={styles.logo_container}>
          <span className={styles.logo}>
            fee<span className={styles.sub_text}>On</span>
          </span>
        </div>
        <div className={styles.left_container}>
          <img className={styles.item} src={Item} />
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.right_container}>
          <div className={styles.right_box}>
            <div className={styles.right_header}>
              <span className={styles.right_title}>Welcome back!</span>
              <span className={styles.right_subtitle}>Start managing your finances faster and better</span>
            </div>
            <br />
            <label className={styles.label}>Mobile number</label>
            <div className={styles.input_container}>
              <img src={Phone} />
              <input
                type="number"
                onChange={(e) => {
                  setLoginData((prevState: any) => ({
                    ...prevState,
                    username: e.target.value,
                  }));
                }}
                onKeyDown={handleKeyDown}
                value={loginData.username}
                className={styles.input}
                placeholder="12345 67890"
              />
            </div>
            <label className={styles.label}>Password</label>
            <div className={styles.input_container}>
              <img src={Lock} />
              <input
                type="password"
                onChange={(e) => {
                  setLoginData((prevState: any) => ({
                    ...prevState,
                    password: e.target.value,
                  }));
                }}
                value={loginData.password}
                className={styles.input}
                onKeyDown={handleKeyDown}
                placeholder="Minimum 4 Characters"
              />
            </div>
            <label className={styles.label}>School Code</label>
            <div className={styles.input_container}>
              <img src={School} />
              <input
                type="number"
                onChange={(e) => {
                  setLoginData((prevState: any) => ({
                    ...prevState,
                    school_code: e.target.value,
                  }));
                }}
                value={loginData.school_code}
                className={styles.input}
                placeholder="4 characters code"
                onKeyDown={handleKeyDown}
              />
            </div>
            <button
              disabled={loginData.username == null || loginData.password == "" || loginData.school_code == null}
              className={styles.button}
              onClick={handleLoginMock ? handleLoginMock : handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
