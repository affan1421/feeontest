import { IconButton, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import styles from "./Selector.module.css";
import CloseRounded from "@mui/icons-material/CloseRounded";

interface MenuItemModel {
  name?: string;
  value?: string;
}

interface SelectorProps {
  value: string;
  defaultValue?: string;
  items: MenuItemModel[];
  disabled?: boolean;
  onChange: (event: string) => void;
  height?: string;
  enableDefault?: boolean | undefined;
  hideClearButton?: boolean;
}

export const Selector = (props: SelectorProps) => {
  return (
    <Select
      disabled={props.disabled}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      fullWidth
      endAdornment={
        !props.hideClearButton &&
        props.value !== "default" && (
          <IconButton
            size="small"
            onClick={() => {
              props.onChange("default");
            }}
          >
            <CloseRounded />
          </IconButton>
        )
      }
      IconComponent={props.value == "default" ? undefined : () => null}
      sx={{
        height: props.height ? props.height : "45px",
      }}
    >
      <MenuItem
        value="default"
        key="default"
        disabled={props.enableDefault == undefined || props.enableDefault == false}
      >
        {props.defaultValue}
      </MenuItem>
      {props.items.map((e: MenuItemModel) => {
        return (
          <MenuItem value={e.value} key={e.value}>
            {e.name}
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default Selector;
