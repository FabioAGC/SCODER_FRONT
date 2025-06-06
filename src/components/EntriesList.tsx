import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { format } from 'date-fns';
import { AccountingEntry, MonthlyEntries } from '../types/accounting';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface EntriesListProps {
  data: MonthlyEntries;
  loading?: boolean;
  error?: string | null;
}

export const EntriesList: React.FC<EntriesListProps> = ({ data, loading = false, error = null }) => {
  const { monthlyEntries, overallTotals } = data;
  const [expandedMonths, setExpandedMonths] = useState<number[]>([]);

  const handleAccordionChange = (month: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedMonths(prev => 
      isExpanded 
        ? [...prev, month]
        : prev.filter(m => m !== month)
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getMonthName = (month: number) => {
    return format(new Date(2024, month, 1), 'MMMM');
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  if (!monthlyEntries || monthlyEntries.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="info">No entries found for this period.</Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, minHeight: '600px' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Entries by Month
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {monthlyEntries.map((monthData) => (
        <Accordion 
          key={monthData.month} 
          sx={{ mb: 2 }}
          expanded={expandedMonths.includes(monthData.month)}
          onChange={handleAccordionChange(monthData.month)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pr: 2 }}>
              <Typography>{getMonthName(monthData.month)}</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ color: 'success.main' }}>
                  Credits: {formatCurrency(monthData.totals.credits)}
                </Typography>
                <Typography sx={{ color: 'error.main' }}>
                  Debits: {formatCurrency(monthData.totals.debits)}
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer sx={{ minHeight: '200px' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Value</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monthData.entries.map((entry) => (
                    <TableRow 
                      key={entry.id}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'action.hover' 
                        }
                      }}
                    >
                      <TableCell>
                        {format(new Date(entry.date), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(entry.value)}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={entry.type}
                          color={entry.type === 'CREDIT' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}

      <Divider sx={{ my: 3 }} />

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="subtitle1" sx={{ color: 'success.main' }}>
          Total Credits: {formatCurrency(overallTotals.credits)}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
          Total Debits: {formatCurrency(overallTotals.debits)}
        </Typography>
      </Box>
    </Paper>
  );
}; 