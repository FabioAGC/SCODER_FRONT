import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, ToggleButton, ToggleButtonGroup } from '@mui/material';

interface MonthSelectorProps {
  value: Date;
  onChange: (date: Date) => void;
  view: 'year' | 'month';
  onViewChange: (view: 'year' | 'month') => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({ value, onChange, view, onViewChange }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleMonthChange = (event: SelectChangeEvent) => {
    const newDate = new Date(value);
    newDate.setMonth(parseInt(event.target.value));
    onChange(newDate);
  };

  const handleYearChange = (event: SelectChangeEvent) => {
    const newDate = new Date(value);
    newDate.setFullYear(parseInt(event.target.value));
    onChange(newDate);
  };

  const handleViewChange = (_event: React.MouseEvent<HTMLElement>, newView: 'year' | 'month') => {
    if (newView !== null) {
      onViewChange(newView);
    }
  };

  const years = Array.from({ length: 151 }, (_, i) => 1900 + i);

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleViewChange}
        size="small"
      >
        <ToggleButton value="month">Month</ToggleButton>
        <ToggleButton value="year">Year</ToggleButton>
      </ToggleButtonGroup>

      {view === 'month' && (
        <FormControl size="small" sx={{ minWidth: '120px' }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={value.getMonth().toString()}
            label="Month"
            onChange={handleMonthChange}
            size="small"
          >
            {months.map((month, index) => (
              <MenuItem key={month} value={index}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <FormControl size="small" sx={{ minWidth: '120px' }}>
        <InputLabel>Year</InputLabel>
        <Select
          value={value.getFullYear().toString()}
          label="Year"
          onChange={handleYearChange}
          size="small"
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}; 