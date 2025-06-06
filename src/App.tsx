import { useState, useEffect } from 'react';
import { Container, CssBaseline, ThemeProvider, Box, Typography } from '@mui/material';
import { EntryForm } from './components/EntryForm';
import { EntriesList } from './components/EntriesList';
import { MonthSelector } from './components/MonthSelector';
import { accountingService } from './services/api';
import { MonthlyEntries } from './types/accounting';
import { theme } from './styles/theme';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'year' | 'month'>('year');
  const [yearlyData, setYearlyData] = useState<MonthlyEntries>({
    monthlyEntries: [],
    overallTotals: { credits: 0, debits: 0 }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (view === 'year') {
        data = await accountingService.getYearlyEntries(
          selectedDate.getFullYear()
        );
      } else {
        data = await accountingService.getMonthlyEntries(
          selectedDate.getFullYear(),
          selectedDate.getMonth() + 1
        );
        // Transform monthly data to match yearly format
        data = {
          monthlyEntries: [{
            month: selectedDate.getMonth(),
            entries: data.entries,
            totals: data.totals
          }],
          overallTotals: data.totals
        };
      }
      setYearlyData(data);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load entries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate, view]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleViewChange = (newView: 'year' | 'month') => {
    setView(newView);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 4
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4 
          }}>
            <Typography variant="h4" component="h1">
              CONT.AI
            </Typography>
            <MonthSelector 
              value={selectedDate} 
              onChange={handleDateChange}
              view={view}
              onViewChange={handleViewChange}
            />
          </Box>
          
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '300px 1fr' },
            gap: 3,
            mb: 4
          }}>
            <Box>
              <EntryForm onSuccess={loadData} selectedDate={selectedDate} />
            </Box>
            <Box>
              <EntriesList 
                data={yearlyData} 
                loading={loading}
                error={error}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 