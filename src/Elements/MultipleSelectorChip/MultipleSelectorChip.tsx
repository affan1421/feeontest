import React from "react";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import styles from "./MultipleSelectorChip.module.css";

interface MenuItemModel {
  name?: string;
  value?: string;
}

interface Props {
  value: string[];
  defaultValue?: string;
  items: MenuItemModel[];
  disabled?: boolean;
  onChange: (event: any) => void;
}

const MultipleSelectorChip = (props: Props) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const { items, value, onChange, defaultValue } = props;

  const labelSelector = (value: string) => {
    const selectedItem = items.find((item) => item.value === value);
    return <span style={{ fontSize: "12px" }}>{selectedItem?.name}</span>;
  };

  return (
    <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel>{defaultValue || "Default Label"}</InputLabel>
      <Select
        className={styles.selector}
        multiple
        value={Array.isArray(value) ? value : []}
        onChange={onChange}
        disabled={props.disabled}
        input={<OutlinedInput label={defaultValue} />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {Array.isArray(selected) &&
              selected.map((value) => (
                <Chip
                  sx={{
                    height: "25px",
                  }}
                  key={value}
                  label={labelSelector(value)}
                />
              ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultipleSelectorChip;
