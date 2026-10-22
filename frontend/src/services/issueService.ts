import { apiClient } from './apiClient';
import { IssueBookRequest, Loan, LoanQueryParams } from '../types/issue';

export const issueService = {
  async getLoans(params?: LoanQueryParams): Promise<Loan[]> {
    return apiClient.get<Loan[]>('/api/issues', {
      studentUserId: params?.studentUserId,
      activeOnly: params?.activeOnly ? 'true' : undefined,
    });
  },

  async getLoanById(loanId: string): Promise<Loan> {
    return apiClient.get<Loan>(`/api/issues/${loanId}`);
  },

  async issueBook(payload: IssueBookRequest): Promise<Loan> {
    return apiClient.post<Loan>('/api/issues', payload);
  },

  async returnBook(loanId: string): Promise<Loan> {
    return apiClient.post<Loan>(`/api/issues/${loanId}/return`);
  },
};
