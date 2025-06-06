import axios from 'axios';
import { AccountingEntry, MonthlyEntries } from '../types/accounting';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export const accountingService = {
  createEntry: async (entry: Omit<AccountingEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<AccountingEntry>('/entries', entry);
    return response.data;
  },

  listEntries: async () => {
    const response = await api.get<AccountingEntry[]>('/entries');
    return response.data;
  },

  getMonthlyEntries: async (year: number, month: number) => {
    const response = await api.get<MonthlyEntries>('/entries/monthly', {
      params: { year, month }
    });
    return response.data;
  },

  getYearlyEntries: async (year: number) => {
    const response = await api.get<MonthlyEntries>('/entries/yearly', {
      params: { year }
    });
    return response.data;
  }
}; 