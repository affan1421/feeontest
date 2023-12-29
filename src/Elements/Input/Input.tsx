import { Paper, InputBase, InputBaseComponentProps } from "@mui/material";
import React from "react";
import styles from "./Input.module.css";

interface InputProps {
  value: string | number | null;
  placeholder?: string;
  type?: string;
  width?: string;
  multiline?: boolean;
  error?: boolean;
  startAdornment?: InputBaseComponentProps["startAdornment"];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const Input = (props: InputProps) => {
  return (
    <>
      <Paper
        style={{ width: props.width ? props.width : "100%" }}
        className={`${styles.input} ${props?.error == true ? styles.error : ""}`}
      >
        <InputBase
          error={props?.error || false}
          type={props.type ? props.type : "text"}
          placeholder={props.placeholder}
          id="filled-hidden-label-small"
          size="small"
          className={styles.input_input}
          value={props.value}
          onChange={props.onChange}
          multiline={props?.multiline || false}
          startAdornment={props?.startAdornment}
          disabled={props?.disabled}
        />
      </Paper>
    </>
  );
};

export default Input;
