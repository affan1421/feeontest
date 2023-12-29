import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Chip,
  OutlinedInput,
  Box,
} from '@mui/material';

interface MultipleSelectorFormControlProps {
  label: string;
  value: string[];
  onChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  items: { name: string; value: string }[];
}

const MultipleSelectorFormControl: React.FC<MultipleSelectorFormControlProps> = ({
  label,
  value,
  onChange,
  items,
}) => {
  return (
    <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={(event) => onChange(event as React.ChangeEvent<{ value: unknown }>)}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((selectedValue) => {
              const selectedItem = items.find((item) => item.value === selectedValue);
              return (
                <Chip key={selectedValue} label={selectedItem?.name || ''} />
              );
            })}
          </Box>
        )}
      >
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            <Checkbox checked={value.includes(item.value)} />
            <ListItemText primary={item.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultipleSelectorFormControl;
