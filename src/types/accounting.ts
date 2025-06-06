export enum EntryType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT'
}

export interface AccountingEntry {
  id: string;
  date: string;
  description: string;
  value: number;
  type: EntryType;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyTotals {
  credits: number;
  debits: number;
}

export interface MonthlyData {
  month: number;
  entries: AccountingEntry[];
  totals: MonthlyTotals;
}

export interface MonthlyEntries {
  monthlyEntries: MonthlyData[];
  overallTotals: MonthlyTotals;
} 