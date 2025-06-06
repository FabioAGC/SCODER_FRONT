import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { accountingService } from '../services/api';
import { EntryType } from '../types/accounting';

interface EntryFormProps {
  onSuccess: () => void;
  selectedDate: Date;
}

export const EntryForm: React.FC<EntryFormProps> = ({ onSuccess, selectedDate }) => {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [type, setType] = useState<EntryType>(EntryType.CREDIT);
  const [date, setDate] = useState<Date>(selectedDate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 151 }, (_, i) => 1900 + i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await accountingService.createEntry({
        description,
        value: parseFloat(value),
        type,
        date: date.toISOString()
      });

      setDescription('');
      setValue('');
      setType(EntryType.CREDIT);
      setDate(selectedDate);
      setSuccess(true);
      onSuccess();
    } catch (error) {
      setError('Failed to create entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: SelectChangeEvent) => {
    const newDate = new Date(date);
    newDate.setDate(parseInt(event.target.value));
    setDate(newDate);
  };

  const handleMonthChange = (event: SelectChangeEvent) => {
    const newDate = new Date(date);
    newDate.setMonth(parseInt(event.target.value));
    setDate(newDate);
  };

  const handleYearChange = (event: SelectChangeEvent) => {
    const newDate = new Date(date);
    newDate.setFullYear(parseInt(event.target.value));
    setDate(newDate);
  };

  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <Paper sx={{ p: 3, width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        New Entry
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            size="medium"
            autoComplete="off"
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              fullWidth
              size="medium"
              autoComplete="off"
              inputProps={{ 
                step: "0.01", 
                min: "0",
                style: { 
                  WebkitAppearance: 'textfield',
                  MozAppearance: 'textfield',
                  appearance: 'textfield'
                }
              }}
              sx={{
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
                '& input[type=number]': {
                  MozAppearance: 'textfield',
                }
              }}
            />

            <FormControl fullWidth size="medium">
              <InputLabel>Type</InputLabel>
              <Select
                value={type}
                label="Type"
                onChange={(e) => setType(e.target.value as EntryType)}
                autoComplete="off"
              >
                <MenuItem value={EntryType.CREDIT}>Credit</MenuItem>
                <MenuItem value={EntryType.DEBIT}>Debit</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth size="medium">
              <InputLabel>Day</InputLabel>
              <Select
                value={date.getDate().toString()}
                label="Day"
                onChange={handleDateChange}
                autoComplete="off"
              >
                {days.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="medium">
              <InputLabel>Month</InputLabel>
              <Select
                value={date.getMonth().toString()}
                label="Month"
                onChange={handleMonthChange}
                autoComplete="off"
              >
                {months.map((month, index) => (
                  <MenuItem key={month} value={index}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="medium">
              <InputLabel>Year</InputLabel>
              <Select
                value={date.getFullYear().toString()}
                label="Year"
                onChange={handleYearChange}
                autoComplete="off"
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            size="large"
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Entry'}
          </Button>
        </Box>
      </form>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Entry added successfully!
        </Alert>
      </Snackbar>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
}; 